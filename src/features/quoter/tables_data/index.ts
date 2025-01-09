import { uom } from "./uom";
import { products } from "./products";
import { materialFamilies } from "./material_families";
import { materials } from "./materials";
import { styles } from "./styles";
import { printsColors } from "./print_colors";
import type { Table } from "../utils/types";

// biome-ignore lint/suspicious/noExplicitAny: Needed fot this to work
export const tables: Table<any>[] = [
    uom,
    products,
    materialFamilies,
    materials,
    styles,
    printsColors,
];
