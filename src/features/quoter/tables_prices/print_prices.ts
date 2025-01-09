"use client";

import type { PrintPrices, Table } from "~/features/quoter/utils/types";

export const printPrices: Table<PrintPrices> = {
    tableName: "Print Prices",
    table: "printPrices",
    columns: [
        {
            field: "id",
            headerName: "ID",
            editable: false,
            unique: true,
        },
        {
            field: "category",
            headerName: "Category",
            editable: true,
            unique: true,
            type: "string",
        },
        {
            field: "price",
            headerName: "Price",
            editable: true,
            type: "number",
            isPrice: true,
        },
    ],
};
