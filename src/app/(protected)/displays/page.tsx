"use client";

import React from "react";
import { PDFViewerExtractor } from "./components/PDFViewer";

export default function Home() {
    const pdfUrl = "/pdf/catalogo.pdf";

    return <PDFViewerExtractor pdfUrl={pdfUrl} page={1} />;
}
