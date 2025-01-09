"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import ExcelHandler from "~/features/quoter/components/ExcelHandler";

export default function Page() {
    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    my: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                }}
            >
                <Typography variant="h3" component="h1" gutterBottom>
                    Packages Dashboard
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <Link href="/packages/dashboard/data" passHref>
                        <Button variant="contained">Data</Button>
                    </Link>
                    <Link href="/packages/dashboard/prices" passHref>
                        <Button variant="contained">Prices</Button>
                    </Link>
                </Box>

                <ExcelHandler />
            </Box>
        </Container>
    );
}
