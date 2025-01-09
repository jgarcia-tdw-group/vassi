"use client";

import type { MaterialFamily, Table } from "~/features/quoter/utils/types";

export const materialFamilies: Table<MaterialFamily> = {
    tableName: "Material Families",
    table: "materialFamilies",
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
            field: "category",
            headerName: "Description",
            editable: true,
            unique: true,
            type: "string",
        },
    ],
};
