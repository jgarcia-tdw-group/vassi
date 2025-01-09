"use client";

import type {
    ProductsMaterialPrices,
    Table,
} from "~/features/quoter/utils/types";

export const productsMaterialPrices: Table<ProductsMaterialPrices> = {
    tableName: "Products Material Prices",
    table: "productsMaterialPrices",
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
                // the code is like CR1, CR2, CR3, etc.
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
            field: "btpPrice",
            headerName: "BTP Price",
            editable: true,
            type: "number",
            isPrice: true,
        },
        {
            field: "tcsPrice",
            headerName: "TCS Price",
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