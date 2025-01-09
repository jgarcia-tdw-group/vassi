import { pool } from "~/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

interface Price {
    code: string;
    description: string;
    pricelevel: number;
}

interface QueryResult {
    recordset: Price[];
}

export default async function getCothPrices(
    _req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        const queryResult: QueryResult = await pool.query(`
            SELECT
                [code],
                [description],
                [pricelevel]
            FROM
                [catalogos].[dbo].[preciostelas]
            WHERE
                [displaystandar] = 1
                AND [pricelevel] != 0
                AND [description] NOT IN ('NO CCT', 'Special Material - No longer in use')
                AND [description] NOT LIKE '%DISCONTINUED%'
                AND [description] NOT LIKE '%DESCONTINUED%'
                AND [description] NOT LIKE '%discontinued%'
        `);
        res.status(200).send({
            status: 200,
            resultado: queryResult.recordset,
            message: "ok",
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: 400,
            message: JSON.stringify(error),
        });
    }
}
