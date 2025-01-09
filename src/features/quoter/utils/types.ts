import type { DataGridProps, GridColDef } from "@mui/x-data-grid";
import type { Prettify } from "~/utils/utils";
import type * as base from "./base";

export type SelectColumnOptions = {
    table: TableName;
    valueColumn: string;
    labelColumn?: string;
    filterQuery?: string;
};

type ExtendedColumn<T> = {
    field: keyof T | "search";
    unique?: boolean;
    isPrice?: boolean;
    options?: Array<string> | SelectColumnOptions;
};

export type ExtendedGridColDef<T extends { id: unknown }> = Prettify<
    GridColDef<T> & ExtendedColumn<T>
>;

export type TableName = (typeof base.tables)[number];

export type Table<T extends { id: string }> = {
    tableName: string;
    table: TableName;
    columns: ExtendedGridColDef<T>[];
    configs?: Omit<DataGridProps<T>, "rows" | "columns">;
};

export type UoM = Prettify<typeof base.baseUoM>;
export type Product = Prettify<typeof base.baseProduct>;
export type MaterialFamily = Prettify<typeof base.baseMaterialFamily>;
export type Material = Prettify<typeof base.baseMaterial>;
export type Style = Prettify<typeof base.baseStyle>;
export type PrintColor = Prettify<typeof base.basePrintColor>;

export type ProductsCtnPrices = Prettify<typeof base.baseProductCtnPrices>;
export type ProductsMaterialPrices = Prettify<
    typeof base.baseProductMaterialsPrices
>;
export type ProductsCvrPrices = Prettify<typeof base.baseProductCvrPrices>;
export type PrintPrices = Prettify<typeof base.basePrintPrice>;

export type Quotes = Prettify<typeof base.baseQuote>;

export type Tables =
    | Product
    | UoM
    | MaterialFamily
    | Material
    | Style
    | PrintColor
    | ProductsCtnPrices
    | ProductsMaterialPrices
    | ProductsCvrPrices
    | PrintPrices
    | Quotes;
