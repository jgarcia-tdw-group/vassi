"use client";

import type { Product, Table } from "~/features/quoter/utils/types";

export const products: Table<Product> = {
    tableName: "Products",
    table: "products",
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
            // unit of measure -> fk to uom table
            field: "uom",
            headerName: "UoM",
            editable: true,
            options: {
                table: "uom",
                valueColumn: "code",
                labelColumn: "%description%",
            },
        },
        {
            field: "minOrder",
            headerName: "Min Order",
            editable: true,
            type: "number",
        },
        {
            field: "ctnAvailable",
            headerName: "CTN Available",
            editable: true,
            type: "boolean",
        },
        {
            field: "cvrAvailable",
            headerName: "CVR Available",
            editable: true,
            type: "boolean",
        },
        {
            field: "btpAvailable",
            headerName: "BTP Available",
            editable: true,
            type: "boolean",
        },
        {
            field: "tcsAvailable",
            headerName: "TCS Available",
            editable: true,
            type: "boolean",
        },
        {
            field: "ctnUpCharge",
            headerName: "CTN Up-charge",
            editable: true,
            type: "number",
            isPrice: true,
        },
        {
            field: "description",
            headerName: "Description",
            type: "string",
            width: 200,
            editable: true,
        },
        {
            field: "search",
            headerName: "Search",
            width: 250,
            editable: false,
            valueGetter: (_value, row) => `[${row.code}] ${row.description}`,
        },
    ],
};
