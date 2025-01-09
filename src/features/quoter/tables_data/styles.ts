"use client";

import type { Style, Table } from "~/features/quoter/utils/types";

export const styles: Table<Style> = {
    tableName: "Styles",
    table: "styles",
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
    ],
};
