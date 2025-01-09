"use client";

import { CustomDataGrid } from "~/features/quoter/components/CustomDataGrid";
import { quoterTable } from "~/features/quoter/tables_quoter/quoter_table";

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
            <CustomDataGrid {...quoterTable} />
        </div>
    );
}
