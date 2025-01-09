import * as sql from "mssql";
import * as xlsx from "xlsx";
import { QUOTER_DB_SCHEMA } from "~/utils/constants";
import { pool } from "~/utils/db";
import { tables } from "../utils/base";

interface RowData {
    [key: string]: string | number | boolean | null | undefined;
}

const BATCH_SIZE = 100; // Adjust this value based on your needs

const tableOrder = [
  "quotes",
  "productsCtnPrices",
  "productsMaterialPrices",
  "productsCvrPrices",
  "products",
  "printPrices",
  "printColors",
  "styles",
  "materials",
  "materialFamilies",
  "uom"
];

const deleteOrder = [...tableOrder];
const insertOrder = [...tableOrder].reverse();

export async function GET() {
    const schema = QUOTER_DB_SCHEMA;
    const tableNames = tables.map((table) => `[${schema}].[${table}]`);

    const data = await Promise.all(
        tableNames.map(async (tableName) => {
            const result = await pool
                .request()
                .query(`SELECT * FROM ${tableName}`);
            return result.recordset;
        }),
    );

    const workbook = xlsx.utils.book_new();

    data.forEach((tableData, index) => {
        const worksheet = xlsx.utils.json_to_sheet(tableData);
        xlsx.utils.book_append_sheet(workbook, worksheet, `${tables[index]}`);
    });

    // Write to a buffer
    const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "buffer",
    });

    // Create a Blob from the buffer
    const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    return new Response(blob, {
        headers: {
            "Content-Disposition": `attachment; filename=${new Date().toISOString().split("T")[0]}.xlsx`,
            "Content-Type":
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
    });
}

function getSqlType(dataType: string, maxLength: number | null): sql.ISqlType {
    switch (dataType.toLowerCase()) {
        case "int":
            return sql.Int();
        case "bigint":
            return sql.BigInt();
        case "varchar":
            return sql.VarChar(maxLength || sql.MAX);
        case "nvarchar":
            return sql.NVarChar(maxLength || sql.MAX);
        case "datetime":
            return sql.DateTime();
        case "bit":
            return sql.Bit();
        case "decimal":
            return sql.Decimal(18, 6); // Adjust precision and scale as needed
        case "float":
            return sql.Float();
        default:
            return sql.VarChar(sql.MAX);
    }
}

function validateAndConvertValue(value: unknown, sqlType: sql.ISqlType) {
    if (value === null || value === undefined) {
        return null;
    }

    switch (sqlType.type) {
        case sql.TYPES.Int:
        case sql.TYPES.BigInt:
            return Number.parseInt(value as string, 10) || null;
        case sql.TYPES.VarChar:
        case sql.TYPES.NVarChar:
            return String(value).slice(0, sql.MAX);
        case sql.TYPES.DateTime:
            return new Date(value as string) || null;
        case sql.TYPES.Bit:
            return Boolean(value);
        case sql.TYPES.Decimal:
        case sql.TYPES.Float:
            return Number(value) || null;
        default:
            return String(value);
    }
}

async function deleteTableData(
    transaction: sql.Transaction,
    tableName: string,
) {
    const schema = QUOTER_DB_SCHEMA;
    const fullTableName = `[${schema}].[${tableName}]`;

    await new sql.Request(transaction).query(`
        ALTER TABLE ${fullTableName} NOCHECK CONSTRAINT ALL;
        DELETE FROM ${fullTableName};
        ALTER TABLE ${fullTableName} CHECK CONSTRAINT ALL;
    `);
}

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get("file");
    const preserveExisting = formData.get("preserveExisting") === "true";

    if (!file || !(file instanceof File)) {
        return new Response(JSON.stringify({ error: "No file uploaded" }), { 
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: "buffer" });

    const schema = QUOTER_DB_SCHEMA;
    const results: string[] = [];
    let totalRowsAffected = 0;

    const transaction = new sql.Transaction(pool);

    try {
        console.log("Beginning transaction...");
        await transaction.begin();

        // Disable all constraints
        await new sql.Request(transaction).query('EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT ALL"');

        console.log("Deleting existing data...");
        for (const tableName of deleteOrder) {
            if (workbook.SheetNames.includes(tableName)) {
                try {
                    await deleteTableData(transaction, tableName);
                    console.log(`Deleted data from ${tableName}`);
                } catch (deleteError) {
                    console.error(
                        `Error deleting data from ${tableName}:`,
                        deleteError
                    );
                    throw deleteError;
                }
            }
        }

        console.log("Processing sheets...");
        for (const tableName of insertOrder) {
            if (workbook.SheetNames.includes(tableName)) {
                console.log(`Processing sheet: ${tableName}`);
                const worksheet = workbook.Sheets[tableName];
                const jsonData = xlsx.utils.sheet_to_json(worksheet) as RowData[];

                if (jsonData.length === 0) {
                    results.push(`Table ${tableName}: Skipped (no data)`);
                    continue;
                }

                const fullTableName = `[${schema}].[${tableName}]`;

                console.log(`Getting table structure for ${tableName}...`);
                const tableInfoQuery = `
                    SELECT
                        c.COLUMN_NAME,
                        COLUMNPROPERTY(OBJECT_ID(c.TABLE_SCHEMA + '.' + c.TABLE_NAME), c.COLUMN_NAME, 'IsIdentity') as IS_IDENTITY
                    FROM
                        INFORMATION_SCHEMA.COLUMNS c
                    WHERE
                        c.TABLE_SCHEMA = @schema
                        AND c.TABLE_NAME = @tableName
                `;
                const tableInfo = await new sql.Request(transaction)
                    .input("schema", sql.VarChar, schema)
                    .input("tableName", sql.VarChar, tableName)
                    .query<{ COLUMN_NAME: string; IS_IDENTITY: number }>(
                        tableInfoQuery
                    );

                const identityColumns = tableInfo.recordset
                    .filter((col) => col.IS_IDENTITY === 1)
                    .map((col) => col.COLUMN_NAME);

                const columns = Object.keys(jsonData[0]).filter(
                    (col) => !identityColumns.includes(col)
                );

                console.log(`Inserting data for ${tableName} in batches...`);
                let totalRowsAffectedForSheet = 0;

                for (let i = 0; i < jsonData.length; i += BATCH_SIZE) {
                    const batch = jsonData.slice(i, i + BATCH_SIZE);

                    const insertQueries: string[] = batch.map(
                        (_, index) => `
                        INSERT INTO ${fullTableName} (${columns.join(", ")})
                        VALUES (${columns.map((col) => `@${col}${index}`).join(", ")})
                    `
                    );

                    const insertQuery = insertQueries.join("\n");
                    const request = new sql.Request(transaction);

                    for (let j = 0; j < batch.length; j++) {
                        const row = batch[j];
                        for (const col of columns) {
                            const value = validateAndConvertValue(
                                row[col],
                                sql.NVarChar(sql.MAX)
                            );
                            request.input(
                                `${col}${j}`,
                                sql.NVarChar(sql.MAX),
                                value
                            );
                        }
                    }

                    const insertResult = await request.query(insertQuery);
                    const rowsAffected = insertResult.rowsAffected.reduce(
                        (a, b) => a + b,
                        0
                    );
                    totalRowsAffectedForSheet += rowsAffected;
                    console.log(`Batch inserted: ${rowsAffected} rows`);
                }

                totalRowsAffected += totalRowsAffectedForSheet;
                results.push(
                    `Table ${tableName}: ${totalRowsAffectedForSheet} rows inserted (${jsonData.length} processed)`
                );
            }
        }

        // Re-enable all constraints before committing
        await new sql.Request(transaction).query('EXEC sp_MSforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL"');

        console.log("Committing transaction...");
        await transaction.commit();
        console.log("Transaction committed successfully.");

        return new Response(
            JSON.stringify({
                success: true,
                results,
                totalRowsAffected,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error occurred during transaction:", error);
        if (error instanceof Error) {
            console.error("Error stack:", error.stack);
        }
        console.log("Rolling back transaction...");
        await transaction.rollback();
        console.log("Transaction rolled back.");

        const errorMessage = error instanceof Error ? error.message : String(error);
        
        return new Response(
            JSON.stringify({
                success: false,
                error: errorMessage,
                results,
                totalRowsAffected,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
