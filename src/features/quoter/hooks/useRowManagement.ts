import type { GridRowId, GridRowModel } from "@mui/x-data-grid";
import { enqueueSnackbar } from "notistack";
// useRowManagement.ts
import { useEffect, useState } from "react";
import type {
    ExtendedGridColDef,
    TableName,
} from "~/features/quoter/utils/types";
import type { EditableRow } from "../utils/columns_formatter";
import { useRequests } from "./useRequests";

export function useRowManagement<T extends { id: string }>(
    table: TableName,
    columns: ExtendedGridColDef<T>[],
) {
    const [rows, setRows] = useState<EditableRow<T>[]>([]);
    const { getRows, addRow, updateRow, deleteRow } = useRequests<T>(table);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const fetchRows = async () => {
            try {
                const fetchedRows = await getRows();
                setRows(fetchedRows);
            } catch (error) {
                console.error("Failed to fetch rows:", error);
                enqueueSnackbar(error.message, { variant: "error" });
            }
        };
        fetchRows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkForDuplicates = (
        newRow: GridRowModel<T>,
        existingRows: EditableRow<T>[],
    ) => {
        for (const column of columns) {
            if (!column.unique) continue;

            let newValue: unknown;
            if (column.valueGetter) {
                newValue = (
                    column.valueGetter as <T>(
                        value: unknown | null,
                        row: T,
                    ) => string
                )(null, newRow);
            } else {
                newValue = newRow[column.field as keyof T];
            }

            const isDuplicate = existingRows.some((row) => {
                let rowValue: unknown;
                if (column.valueGetter) {
                    rowValue = (
                        column.valueGetter as <T>(
                            value: unknown | null,
                            row: T,
                        ) => string
                    )(null, row);
                } else {
                    rowValue = row[column.field as keyof T];
                }
                return rowValue === newValue && row.id !== newRow.id;
            });

            if (isDuplicate) {
                throw new Error(
                    `The value in column ${column.field} must be unique.`,
                );
            }
        }
    };

    const handleAddRow = async (newRow: GridRowModel<T>) => {
        try {
            checkForDuplicates(newRow, rows);
            const addedRow = await addRow(newRow);
            setRows((prevRows) => [...prevRows, addedRow]);
            return addedRow;
        } catch (error) {
            console.error("Failed to add row:", error);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    };

    const handleUpdateRow = async (
        updatedRow: GridRowModel<T & { isNew: boolean }>,
    ) => {
        try {
            checkForDuplicates(updatedRow, rows);
            const updated = await updateRow(updatedRow as T);
            setRows((prevRows) =>
                prevRows.map((row) => (row.id === updated.id ? updated : row)),
            );
            return updated;
        } catch (error) {
            console.error("Failed to update row:", error);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    };

    const handleDeleteRow = async (id: GridRowId) => {
        try {
            await deleteRow(id.toString());
            setRows((prevRows) => prevRows.filter((row) => row.id !== id));
        } catch (error) {
            console.error("Failed to delete row:", error);
            enqueueSnackbar(error.message, { variant: "error" });
        }
    };

    return { rows, handleAddRow, handleUpdateRow, handleDeleteRow };
}
