"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { SnackbarProvider } from "notistack";
import { Header } from "~/features/auth/components";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <title>Vassi</title>
                <meta name="description" content="Vassi" />
                <link rel="icon" href="/favicon.ico" />
            </head>

            <body className={inter.className}>
                <SnackbarProvider
                    maxSnack={3}
                    autoHideDuration={3000}
                    preventDuplicate
                >
                    <Header />
                    <main style={{ marginTop: "3rem" }}>{children}</main>
                </SnackbarProvider>
            </body>
        </html>
    );
}
