"use client";

import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import {
    GridCsvExportMenuItem,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExportContainer,
    GridToolbarFilterButton,
    GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import type { GridRowModel, GridToolbarContainerProps } from "@mui/x-data-grid";
import React, { useState } from "react";
import type { ExtendedGridColDef } from "~/features/quoter/utils/types";
import AddRowModal from "./AddRowModal"; // Import the modal component

type EditToolbarProps<T extends { id: string }> = {
    table: string;
    onAdd: (newRow: GridRowModel) => void;
    columns: ExtendedGridColDef<T>[];
    extraExports?: GridToolbarContainerProps["children"][];
};

export function EditToolbar<T extends { id: string }>({
    table,
    onAdd,
    columns,
    extraExports,
}: EditToolbarProps<T>) {
    const [open, setOpen] = useState(false);
    const [newRow, setNewRow] = useState<GridRowModel>({});

    const handleOpen = () => {
        setOpen(true);
        setNewRow({ isNew: true });
    };

    const handleClose = () => {
        setOpen(false);
        setNewRow({});
    };

    const handleInputChange = (field: string, value: string) => {
        setNewRow((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onAdd(newRow);
        handleClose();
    };

    return (
        <>
            <GridToolbarContainer>
                <Button
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                >
                    Add record
                </Button>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExportContainer>
                    <GridCsvExportMenuItem
                        options={{ fileName: table, utf8WithBom: true }}
                    />
                </GridToolbarExportContainer>
                <GridToolbarQuickFilter style={{ marginLeft: "auto" }} />
                {...(extraExports || [])}
            </GridToolbarContainer>
            <AddRowModal
                open={open}
                handleClose={handleClose}
                columns={columns}
                newRow={newRow}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />
        </>
    );
}
