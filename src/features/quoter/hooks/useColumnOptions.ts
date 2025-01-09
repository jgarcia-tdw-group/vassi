// useColumnOptions.ts
import { useEffect, useState } from "react";
import { transformColumns } from "../utils/columns_formatter";
import type { ExtendedGridColDef } from "../utils/types";

export function useColumnOptions<T extends { id: string }>(
    columns: ExtendedGridColDef<T>[],
    rows: T[],
) {
    const [columnsOptions, setColumnsOptions] = useState<
        ExtendedGridColDef<T>[]
    >([]);

    useEffect(() => {
        const applyColumnTransformation = async () => {
            const transformedColumns = transformColumns(columns, () => rows);
            setColumnsOptions(await Promise.all(transformedColumns));
        };
        if (rows.length >= 0) {
            applyColumnTransformation();
        }
    }, [columns, rows]);

    return columnsOptions;
}
