"use client";

import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Snackbar,
    Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function ExcelHandler() {
    const [uploading, setUploading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
    });

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post("/api/quoter/excel", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSnackbar({
                open: true,
                message: "File uploaded successfully!",
                severity: "success",
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Error uploading file.",
                severity: "error",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const response = await axios.get("/api/quoter/excel", {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `quoter_data_${new Date().toISOString().split("T")[0]}.xlsx`,
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            setSnackbar({
                open: true,
                message: "File downloaded successfully!",
                severity: "success",
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Error downloading file.",
                severity: "error",
            });
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    my: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Excel Handler
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        width: "100%",
                        justifyContent: "center",
                    }}
                >
                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<CloudUploadIcon />}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <CircularProgress size={24} />
                        ) : (
                            "Upload Excel"
                        )}
                        <input
                            type="file"
                            hidden
                            accept=".xlsx, .xls"
                            onChange={handleFileUpload}
                        />
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleDownload}
                        startIcon={<CloudDownloadIcon />}
                        disabled={downloading}
                    >
                        {downloading ? (
                            <CircularProgress size={24} />
                        ) : (
                            "Download Excel"
                        )}
                    </Button>
                </Box>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}
