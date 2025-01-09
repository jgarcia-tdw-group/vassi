"use client";

import type { Quotes, Table } from "~/features/quoter/utils/types";
import { formatPrice } from "~/utils/formatters";
import { getItemPrice } from "../utils/item_price";

export const quoterTable: Table<Quotes> = {
    tableName: "Quotes",
    table: "quotes",
    columns: [
        { field: "id", headerName: "ID", editable: false, unique: true },
        {
            field: "quantity",
            headerName: "Quantity",
            editable: true,
            type: "number",
        },
        {
            field: "productCode",
            headerName: "Product Code",
            editable: true,
            unique: true,
            options: {
                table: "products",
                valueColumn: "code",
                labelColumn: "[%code%] %description%",
            },
        },
        {
            field: "ctnMaterialCode",
            headerName: "CTN Material",
            editable: true,
            options: {
                table: "materials",
                valueColumn: "code",
                labelColumn: "[%code%] %description%",
                filterQuery: "[cartonSuitable] = 1",
            },
        },
        {
            field: "ctnStyleCode",
            headerName: "CTN Style",
            editable: true,
            options: {
                table: "styles",
                valueColumn: "code",
                labelColumn: "[%code%] %description%",
            },
        },
        {
            field: "btpMaterialCode",
            headerName: "BTP Material",
            editable: true,
            options: {
                table: "materials",
                valueColumn: "code",
                labelColumn: "[%code%] %description%",
            },
        },
        {
            field: "tcsMaterialCode",
            headerName: "TCS Material",
            editable: true,
            options: {
                table: "materials",
                valueColumn: "code",
                labelColumn: "[%code%] %description%",
            },
        },
        {
            field: "cvrMaterialCode",
            headerName: "CVR Material",
            editable: true,
            options: {
                table: "materials",
                valueColumn: "code",
                labelColumn: "[%code%] %description%",
                filterQuery: "[cartonSuitable] = 1",
            },
        },
        {
            field: "itemPrintCode",
            headerName: "Item Print",
            editable: true,
            options: {
                table: "printColors",
                valueColumn: "code",
                labelColumn: "[%code%] %description%",
            },
        },
        {
            field: "cartonPrintCode",
            headerName: "Carton Print",
            editable: true,
            options: {
                table: "printColors",
                valueColumn: "code",
                labelColumn: "[%code%] %description%",
            },
        },
        {
            field: "price",
            headerName: "Unit Price",
            editable: false,
            type: "number",
            valueGetter: (_params, row) => {
                getItemPrice(row, "unit").then((price) => {
                    row.price = formatPrice(price);
                    // TODO make component re-render
                    console.log("Price updated:", price, row.price);
                    return row.price
                });

                return row.price;
            },
        },
        
    ],
};
