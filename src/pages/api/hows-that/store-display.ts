import axios from "axios";
import type { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const URL_BASE = "https://ht.bufkor.com/api";
const URL_STORE = "/digitalcatalogue/store";

interface StoreRequestBody {
    clientName: string;
    clientId: string;
    salesManCode: string;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    listItems: any[]; // TODO figure out the type of this
    Total: number;
    Authorization: string;
    applicationCookie: string;
}

interface StoreResponseData {
    message?: string;
    order_no?: string;
    Message?: string;
}

const createAxiosInstance = (
    Authorization: string,
    applicationCookie: string,
): AxiosInstance => {
    return axios.create({
        baseURL: URL_BASE,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            Connection: "keep-alive",
            Authorization,
            Cookie: applicationCookie,
        },
    });
};

export default async function store(req: NextApiRequest, res: NextApiResponse) {
    const {
        clientName,
        clientId,
        salesManCode,
        listItems,
        Total,
        Authorization,
        applicationCookie,
    }: StoreRequestBody = req.body;

    const axiosInstance = createAxiosInstance(Authorization, applicationCookie);

    try {
        const response: AxiosResponse<StoreResponseData> =
            await axiosInstance.post(URL_STORE, {
                listItems,
                Total,
                salesManCode,
                clientName,
                clientId,
                divisionCode: "7",
            });

        if (response.status === 200) {
            return res.status(200).send({
                status: 200,
                message: response.data.message,
                order_no: response.data.order_no,
            });
        }
        return res.status(201).send({
            status: 201,
            Message: response.data.Message || "Error sending order",
        });
    } catch (error) {
        console.error("Error in store function:", error);

        if (axios.isAxiosError(error)) {
            const axiosError: AxiosError<StoreResponseData> = error;
            if (axiosError.response) {
                return res.status(201).send({
                    status: 201,
                    Message:
                        axiosError.response.data.Message ||
                        "Error sending order",
                });
            }

            if (axiosError.request) {
                return res.status(503).send({
                    status: 503,
                    message: "No response received from server",
                });
            }
        }

        return res.status(400).send({
            status: 400,
            message: JSON.stringify(error),
            Message: "Error sending order",
        });
    }
}
