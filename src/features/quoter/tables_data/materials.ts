"use client";

import type { Material, Table } from "~/features/quoter/utils/types";

export const materials: Table<Material> = {
    tableName: "Materials",
    table: "materials",
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
            editable: true,
            unique: true,
            type: "string",
        },
        {
            field: "standardPackaging",
            headerName: "Standard Packaging",
            editable: true,
            type: "boolean",
        },
        {
            field: "cartonSuitable",
            headerName: "Carton Suitable",
            editable: true,
            type: "boolean",
        },
        {
            field: "family",
            headerName: "Family",
            editable: true,
            options: {
                table: "materialFamilies",
                valueColumn: "code",
                labelColumn: "%code%",
            },
        },
        {
            field: "search",
            headerName: "Search",
            editable: false,
            valueGetter: (_value, row) =>
                `[${row.code}] ${row.family} ${row.description}`,
        },
    ],
};
