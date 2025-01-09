import type { GridColTypeDef } from "@mui/x-data-grid";

export const tables = [
    "products",
    "uom",
    "materialFamilies",
    "materials",
    "styles",
    "printColors",
    "productsCtnPrices",
    "productsMaterialPrices",
    "productsCvrPrices",
    "printPrices",
    "quotes",
] as const satisfies string[];

type Columns = Record<string, GridColTypeDef["type"]>;

export const baseUoM = {
    id: "string",
    code: "string",
    description: "string",
    numberOfPieces: "number",
} satisfies Columns;

export const baseProduct = {
    id: "string",
    code: "string",
    description: "string",
    uom: "singleSelect", // fk to uom table
    minOrder: "number",
    ctnAvailable: "boolean",
    cvrAvailable: "boolean",
    btpAvailable: "boolean",
    tcsAvailable: "boolean",
    ctnUpCharge: "number",
} satisfies Columns;

export const baseMaterialFamily = {
    id: "string",
    code: "string",
    category: "string",
} satisfies Columns;

export const baseMaterial = {
    id: "string",
    code: "string",
    description: "string",
    standardPackaging: "boolean",
    cartonSuitable: "boolean",
    family: "singleSelect", // fk to family table
} satisfies Columns;

export const baseStyle = {
    id: "string",
    code: "string",
    description: "string",
} satisfies Columns;

export const basePrintColor = {
    id: "string",
    code: "string",
    description: "string",
    price: "number",
} satisfies Columns;

export const baseProductCtnPrices = {
    id: "string",
    productCode: "singleSelect", // fk to products table
    materialFamilyCode: "singleSelect", // fk to material table
    styleCode: "singleSelect", // fk to styles table
    price: "number",
} satisfies Columns;

export const baseProductMaterialsPrices = {
    id: "string",
    productCode: "singleSelect", // fk to products table
    materialFamilyCode: "singleSelect", // fk to material table
    btpPrice: "number",
    tcsPrice: "number",
} satisfies Columns;

export const baseProductCvrPrices = {
    id: "string",
    productCode: "string", // fk to products table
    materialFamilyCode: "string", // fk to material table
    price: "number",
} satisfies Columns;

export const basePrintPrice = {
    id: "string",
    category: "string",
    price: "number",
} satisfies Columns;

export const baseQuote = {
    id: "string",
    quantity: "number",
    productCode: "singleSelect", // fk to products table
    ctnMaterialCode: "singleSelect", // fk to material table
    ctnStyleCode: "singleSelect", // fk to styles table
    btpMaterialCode: "singleSelect", // fk to material table
    tcsMaterialCode: "singleSelect", // fk to material table
    cvrMaterialCode: "singleSelect", // fk to material table
    itemPrintCode: "singleSelect",
    cartonPrintCode: "singleSelect",
    price: "number",
    subtotal: "number",
};

export const tableBases = {
    products: baseProduct,
    uom: baseUoM,
    materialFamilies: baseMaterialFamily,
    materials: baseMaterial,
    styles: baseStyle,
    printColors: basePrintColor,
    productsCtnPrices: baseProductCtnPrices,
    productsMaterialPrices: baseProductMaterialsPrices,
    productsCvrPrices: baseProductCvrPrices,
    printPrices: basePrintPrice,
    quotes: baseQuote,
};
