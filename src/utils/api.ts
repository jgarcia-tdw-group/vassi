import axios, { type AxiosInstance } from "axios";

const URL_BASE = "https://ht.bufkor.com/api";

export const createAxiosInstance = (
    Authorization?: string,
    Cookie?: string,
): AxiosInstance => {
    return axios.create({
        // biome-ignore lint/style/useNamingConvention: <explanation>
        baseURL: URL_BASE,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
            // biome-ignore lint/style/useNamingConvention: <explanation>
            Accept: "*/*",
            Authorization,
            Cookie,
        },
    });
};
