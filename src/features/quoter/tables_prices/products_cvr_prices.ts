"use client";

import type { ProductsCvrPrices, Table } from "~/features/quoter/utils/types";

export const productsCvrPrices: Table<ProductsCvrPrices> = {
    tableName: "Products CVR Prices",
    table: "productsCvrPrices",
    columns: [
        { field: "id", headerName: "ID", editable: false, unique: true },
        {
            field: "productCode",
            headerName: "Product Code",
            editable: true,
            width: 200,
            options: {
                table: "products",
                valueColumn: "code",
                labelColumn: "[%code%] %description%",
            },
        },
        {
            field: "materialFamilyCode",
            headerName: "Carton Material Family Code",
            editable: true,
            width: 200,
            options: {
                table: "materialFamilies",
                valueColumn: "code",
                labelColumn: "[%code%] %category%",
            },
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
            headerName: "Code",
            editable: false,
            unique: true,
            width: 200,
            valueGetter: (_value, row) =>
                `${row.productCode}_${row.materialFamilyCode}`,
        },
    ],
};
