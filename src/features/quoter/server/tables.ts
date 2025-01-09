import { randomId } from "@mui/x-data-grid-generator";
import { QUOTER_DB_SCHEMA, USE_MOCK_DATA } from "~/utils/constants";
import { pool } from "~/utils/db";
import { tables, type tableBases } from "../utils/base";

function validateTable(table: string | null): table is (typeof tables)[number] {
    return table !== null && (tables as string[]).includes(table);
}

function printQuery(query: string, params?: Record<string, unknown>) {
    console.log("Executing query:");
    console.log(query);

    if (params) {
        console.log("With parameters:");
        console.log(JSON.stringify(params, null, 2));
    }
}

export async function GET(request: Request) {
    const params = new URL(request.url).searchParams;
    const table = params.get("table");
    const filterQuery = params.get("filterQuery");

    if (!validateTable(table)) {
        return new Response(JSON.stringify({ message: "Invalid table" }), {
            status: 400,
        });
    }

    const filter = filterQuery ? `WHERE ${filterQuery}` : "";
    const query =
        `SELECT * FROM [${QUOTER_DB_SCHEMA}].[${table}] ${filter}`.trim();

    printQuery(query);

    try {
        const result = await pool.request().query(query);
        return new Response(JSON.stringify(result.recordset), { status: 200 });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Database error", error }),
            {
                status: 500,
            },
        );
    }
}

export async function POST(request: Request) {
    const params = new URL(request.url).searchParams;
    const table = params.get("table");

    if (!validateTable(table)) {
        return new Response(JSON.stringify({ message: "Invalid table" }), {
            status: 401,
        });
    }

    const body = JSON.parse(
        await request.text(),
    ) as (typeof tableBases)[typeof table];

    const keys = Object.keys(body).filter(
        (key) => key !== "id" && key !== "isNew" && body[key] !== undefined,
    );

    const query = `INSERT INTO [${QUOTER_DB_SCHEMA}].[${table}] (${keys.join(", ")})
                   OUTPUT INSERTED.*
                   VALUES (${keys.map((key) => `@${key}`).join(", ")})`;
    printQuery(query, body);

    try {
        const request = pool.request();
        for (const key of keys) {
            request.input(key, body[key]);
        }
        const result = await request.query(query);
        return new Response(JSON.stringify(result.recordset[0]), {
            status: 201,
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Database error", error }),
            {
                status: 500,
            },
        );
    }
}

export async function PUT(request: Request) {
    const params = new URL(request.url).searchParams;
    const table = params.get("table");

    if (!validateTable(table)) {
        return new Response(JSON.stringify({ message: "Invalid table" }), {
            status: 400,
        });
    }

    const body = await request.json();

    const updates = Object.keys(body)
        .filter((key) => key !== "id" && key !== "isNew")
        .map((key) => `${key} = @${key}`)
        .join(", ");

    const query = `UPDATE [${QUOTER_DB_SCHEMA}].[${table}]
                   SET ${updates}
                   OUTPUT INSERTED.*
                   WHERE id = @id`;
    printQuery(query, body);

    try {
        const request = pool.request();
        for (const [key, value] of Object.entries(body)) {
            request.input(key, value);
        }
        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return new Response(JSON.stringify({ message: "Item not found" }), {
                status: 404,
            });
        }
        return new Response(JSON.stringify(result.recordset[0]), {
            status: 200,
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Database error", error }),
            {
                status: 500,
            },
        );
    }
}

export async function DELETE(request: Request) {
    const params = new URL(request.url).searchParams;
    const table = params.get("table");
    const id = params.get("id");

    if (!validateTable(table)) {
        return new Response(JSON.stringify({ message: "Invalid table" }), {
            status: 400,
        });
    }

    const query = `DELETE FROM [${QUOTER_DB_SCHEMA}].[${table}]
                   OUTPUT DELETED.*
                   WHERE id = @id`;
    printQuery(query, { id });

    try {
        const result = await pool.request().input("id", id).query(query);
        if (result.recordset.length === 0) {
            return new Response(JSON.stringify({ message: "Item not found" }), {
                status: 404,
            });
        }
        return new Response(
            JSON.stringify({
                message: "Item deleted",
                data: result.recordset[0],
            }),
            { status: 200 },
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Database error", error }),
            {
                status: 500,
            },
        );
    }
}
