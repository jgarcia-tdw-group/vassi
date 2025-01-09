import axios from "axios";
import type {
    PrintPrices,
    ProductsCtnPrices,
    ProductsCvrPrices,
    ProductsMaterialPrices,
    Quotes,
    TableName,
    Tables,
} from "./types";

const cache: Record<string, Tables> = {};

async function getCachedPriceRow<T extends Tables>(
    table: TableName,
    filter: string,
): Promise<T> {
    const cacheKey = `${table}-${filter}`;
    if (cache[cacheKey]) {
        return cache[cacheKey] as T;
    }

    const response = await axios.get<T>(
        `/api/quoter?table=${table}&filter=${filter}`,
    );
    const data = response.data[0] as T;
    cache[cacheKey] = data;
    return data;
}

/**
 * Calculates the price of an item based on various material and print prices.
 *
 * @param {Quotes} row - The row object containing details about the item.
 * @param {"unit" | "subtotal"} shown - Determines whether to return the unit price or the subtotal price.
 * @returns {Promise<number>} - The calculated price of the item.
 *
 * @remarks
 * This function fetches cached prices for different materials and prints associated with the item.
 * It then calculates the total price based on these components. If the `shown` parameter is "subtotal",
 * the function returns the total price multiplied by the quantity of items. Otherwise, it returns the unit price.
 *
 * @example
 * ```typescript
 * const row = {
 *   productCode: "P123",
 *   ctnMaterialCode: "M456",
 *   ctnStyleCode: "S789",
 *   btpMaterialCode: "M101",
 *   tcsMaterialCode: "M112",
 *   cvrMaterialCode: "M131",
 *   itemPrintCode: "IP01",
 *   cartonPrintCode: "CP02",
 *   quantity: 10,
 * };
 * const price = await getItemPrice(row, "unit");
 * console.log(price); // Outputs the unit price of the item
 * ```
 */
export async function getItemPrice(row: Quotes, shown: "unit" | "subtotal") {
    const qty = Number(row.quantity);
    if (qty === 0) return 0;

    const ctn = await getCachedPriceRow<ProductsCtnPrices>(
        "productsCtnPrices",
        `productCode=${row.productCode} AND materialCode=${row.ctnMaterialCode} AND styleCode=${row.ctnStyleCode}`,
    );

    const btp = await getCachedPriceRow<ProductsMaterialPrices>(
        "productsMaterialPrices",
        `productCode=${row.productCode} AND materialCode=${row.btpMaterialCode}`,
    );

    const tcs = await getCachedPriceRow<ProductsMaterialPrices>(
        "productsMaterialPrices",
        `productCode=${row.productCode} AND materialCode=${row.tcsMaterialCode}`,
    );

    const cvr = await getCachedPriceRow<ProductsCvrPrices>(
        "productsCvrPrices",
        `productCode=${row.productCode} AND materialCode=${row.cvrMaterialCode}`,
    );

    const ctnPrice = Number(ctn.price);
    const btpPrice = Number(btp.btpPrice);
    const tcsPrice = Number(tcs.tcsPrice);
    const cvrPrice = Number(cvr.price);

    let printPrice = 0;

    if (
        row.itemPrintCode &&
        row.itemPrintCode !== "" &&
        row.itemPrintCode !== "1"
    ) {
        const itemPrint = await getCachedPriceRow<PrintPrices>(
            "printPrices",
            "category=Items",
        );

        printPrice += Number(itemPrint.price);
    }

    if (
        row.cartonPrintCode &&
        row.cartonPrintCode !== "" &&
        row.cartonPrintCode !== "1"
    ) {
        const cartonPrint = await getCachedPriceRow<PrintPrices>(
            "printPrices",
            "category=Cartons",
        );

        printPrice += Number(cartonPrint.price);
    }

    const itemPrice = ctnPrice + btpPrice + tcsPrice + cvrPrice;

    if (shown === "subtotal") return itemPrice * qty;
    return itemPrice;
}
