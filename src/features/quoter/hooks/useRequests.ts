"use client";

import axios from "axios";

export function useRequests<T extends { id: string }>(table: string) {
    const baseUrl = `/api/quoter?table=${table}`;
    return {
        getRows: async () => {
            const response = await axios.get<T[]>(baseUrl);
            return response.data;
        },

        addRow: async (newRow: T) => {
            const response = await axios.post<T>(baseUrl, newRow);
            return response.data;
        },

        updateRow: async (updateRow: T) => {
            const response = await axios.put<T>(baseUrl, updateRow);
            return response.data;
        },

        deleteRow: async (id: string) => {
            return axios.delete<void>(`${baseUrl}&id=${id}`);
        },
    };
}
