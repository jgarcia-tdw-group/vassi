import type { NextApiRequest, NextApiResponse } from "next";
import { pool } from "~/utils/db";

interface ItemPriceRequest extends NextApiRequest {
    body: { itemNumber: string; magnet: boolean };
}

interface ItemPriceResponse extends NextApiResponse {
    status: (statusCode: number) => ItemPriceResponse;
    json: (data: object) => ItemPriceResponse;
    send: (data: object) => ItemPriceResponse;
}

export default async function getItemPrice(
    req: ItemPriceRequest,
    res: ItemPriceResponse,
) {
    if (req.method !== "POST") {
        return res
            .status(405)
            .json({ status: 405, message: "Method Not Allowed" });
    }

    try {
        const { itemNumber, magnet } = req.body;

        const queryResult = await pool.query(
            `SELECT
                t1.PRICE1,
                t1.PRICE2,
                t1.PRICE3,
                t1.PRICE4,
                t1.PRICE5,
                t1.PRICE6
            FROM catalogo t0
            INNER JOIN precios t1 ON (t0.ITEMNUMBER = t1.ITEMNUMBER)
            WHERE
                t1.magnet = ${magnet ? 1 : 0} and
                t0.ITEMNUMBER = '${itemNumber}'`,
        );

        res.status(200).send({
            status: 200,
            resultado: queryResult.recordset,
            message: "ok",
        });
    } catch (error) {
        console.error("Error in getItemPrice:", error.message);
        res.status(400).send({
            status: 400,
            message: JSON.stringify(error),
        });
    }
}
