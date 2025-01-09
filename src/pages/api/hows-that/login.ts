import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { createAxiosInstance } from "~/utils/api";

const URL_LOGIN = "/digitalcatalogue/login/";
const instance = createAxiosInstance();

export default async function login(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { Email, Password } = req.body;
        const response = await instance.post(URL_LOGIN, { Email, Password });


        if (response.status !== 200) {
            return res.status(201).json({
                status: 201,
                message: "Error user not found",
            });
        }

        const applicationCookie =
            response.headers["set-cookie"]?.find((row) =>
                row.includes("ApplicationCookie"),
            ) || "";

        return res.status(200).json({
            status: 200,
            codeSap: response.data.salesManCode,
            salesManCode: response.data.salesManCode,
            message: "Login successful!",
            token: response.data.token,
            applicationCookie,
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return res.status(201).json({
                message: error.response?.data.Message || "Error user not found",
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
