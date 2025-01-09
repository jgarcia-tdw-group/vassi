import { Box, Button, Modal, Typography } from "@mui/material";
import type { GridRowModel } from "@mui/x-data-grid";
import React from "react";
import type { ExtendedGridColDef } from "~/features/quoter/utils/types";
import GenericInput from "./GenericInput"; // Import the generic input component

type AddRowModalProps<T extends { id: string }> = {
    open: boolean;
    handleClose: () => void;
    columns: ExtendedGridColDef<T>[];
    newRow: GridRowModel;
    handleInputChange: (field: string, value: string) => void;
    handleSubmit: () => void;
};

export default function AddRowModal<T extends { id: string }>({
    open,
    handleClose,
    columns,
    newRow,
    handleInputChange,
    handleSubmit,
}: AddRowModalProps<T>) {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 800,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" component="h2" gutterBottom>
                    Add New Record
                </Typography>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplate: "1fr / 1fr 1fr",
                        gap: "0 1rem",
                    }}
                >
                    {columns.map(
                        (column) =>
                            column.editable && (
                                <GenericInput
                                    key={column.field}
                                    column={column}
                                    value={newRow[column.field] || ""}
                                    handleInputChange={handleInputChange}
                                />
                            ),
                    )}
                </Box>
                <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                >
                    <Button onClick={handleClose} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Add
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
