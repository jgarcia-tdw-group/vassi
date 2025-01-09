"use client";

import { CustomDataGrid } from "~/features/quoter/components/CustomDataGrid";
import { tables } from "~/features/quoter/tables_prices/index";

export default function Page() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: "2rem",
            }}
        >
            {tables.map((table) => (
                <CustomDataGrid key={table.table} {...table} />
            ))}
        </div>
    );
}
