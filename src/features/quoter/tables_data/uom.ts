"use client";

import type { Table, UoM } from "~/features/quoter/utils/types";

export const uom: Table<UoM> = {
    tableName: "Units Of Measure",
    table: "uom",
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
            field: "numberOfPieces",
            headerName: "Number of Pieces",
            editable: true,
            type: "number",
        },
    ],
};
