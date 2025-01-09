"use client";

import type { PrintColor, Table } from "~/features/quoter/utils/types";

export const printsColors: Table<PrintColor> = {
    tableName: "Print Colors",
    table: "printColors",
    columns: [
        {
            field: "id",
            headerName: "id",
            editable: false,
            unique: true,
        },
        {
            field: "code",
            headerName: "Code",
            editable: true,
            unique: true,
            type: "string",
        },
        {
            field: "description",
            headerName: "Description",
            type: "string",
            unique: true,
            editable: true,
        },
        {
            field: "price",
            headerName: "Price",
            editable: true,
            type: "number",
            isPrice: true,
        },
        {
            field: "search",
            headerName: "Search",
            editable: false,
            valueGetter: (_value, row) => `[${row.code}] ${row.description}`,
        },
    ],
};
