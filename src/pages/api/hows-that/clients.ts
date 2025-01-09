import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { createAxiosInstance } from "~/utils/api";

const URL_CLIENTS = "/digitalcatalogue/customers?query=";

export default async function clients(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        const { Authorization, clientsEntry, applicationCookie } = req.body;

        const instanceStore = createAxiosInstance(
            Authorization,
            applicationCookie,
        );

        const response = await instanceStore.get(URL_CLIENTS + clientsEntry);

        if (response.status !== 200) {
            return res.status(201).json({
                status: 201,
                message: "Error user not found",
            });
        }

        const clientes = response.data.map((row) => ({
            id: row.account_number,
            name: row.company_name,
        }));

        return res.status(200).json({
            Clients: clientes,
        });
    } catch (error) {
        console.error(error);

        if (axios.isAxiosError(error)) {
            return res.status(201).json({
                status: 201,
                message: "Error user not found",
            });
        }

        return res.status(400).json({
            status: 400,
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        });
    }
}
