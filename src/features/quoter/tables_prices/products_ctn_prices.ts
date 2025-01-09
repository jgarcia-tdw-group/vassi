"use client";

import type { ProductsCtnPrices, Table } from "~/features/quoter/utils/types";

export const productsCtnPrices: Table<ProductsCtnPrices> = {
    tableName: "Products CTN Prices",
    table: "productsCtnPrices",
    columns: [
        {
            field: "id",
            headerName: "ID",
            editable: false,
            unique: true,
        },
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
            headerName: "Material Family Code",
            editable: true,
            width: 200,
            options: {
                table: "materialFamilies",
                valueColumn: "code",
                labelColumn: "[%code%] %category%",
            },
        },
        {
            field: "styleCode",
            headerName: "Style Code",
            editable: true,
            width: 200,
            options: {
                table: "styles",
                valueColumn: "code",
                labelColumn: "[%code%] %description%",
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
                `${row.productCode}_${row.materialFamilyCode}_${row.styleCode}`,
        },
    ],
};
