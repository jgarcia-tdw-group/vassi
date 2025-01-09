import { printPrices } from "./print_prices";
import { productsCtnPrices } from "./products_ctn_prices";
import { productsCvrPrices } from "./products_cvr_prices";
import { productsMaterialPrices } from "./products_material_prices";
import type { Table } from "../utils/types";

// biome-ignore lint/suspicious/noExplicitAny: Needed fot this to work
export const tables: Table<any>[] = [
    printPrices,
    productsCtnPrices,
    productsCvrPrices,
    productsMaterialPrices,
];
