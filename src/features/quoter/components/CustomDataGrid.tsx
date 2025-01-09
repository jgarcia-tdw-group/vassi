"use client";

import { Typography } from "@mui/material";
import {
    DataGrid,
    type GridColDef,
    type GridEventListener,
    GridRowEditStopReasons,
    type GridRowId,
    type GridRowModel,
    GridRowModes,
    type GridSlots,
} from "@mui/x-data-grid";
import type { Table } from "~/features/quoter/utils/types";
import { useColumnOptions } from "../hooks/useColumnOptions";
import { useRowManagement } from "../hooks/useRowManagement";
import { useRowModes } from "../hooks/useRowModes";
import { ActionButtons } from "./ActionButtons";
import { EditToolbar } from "./EditToolbar";

export function CustomDataGrid<T extends { id: string }>({
    tableName,
    table,
    columns,
    configs,
}: Table<T>) {
    const { rows, handleAddRow, handleUpdateRow, handleDeleteRow } =
        useRowManagement<T>(table, columns);
    const columnsOptions = useColumnOptions<T>(columns, rows);
    const {
        rowModesModel,
        handleEditClick,
        handleSaveClick,
        handleCancelClick,
        handleRowModesModelChange,
    } = useRowModes();

    const handleRowEditStop: GridEventListener<"rowEditStop"> = (
        params,
        event,
    ) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        handleDeleteRow(id);
        handleCancelClick(id)();
    };

    const processRowUpdate = (newRow: GridRowModel<T>) => {
        const updatedRow = { ...newRow, isNew: false };
        return handleUpdateRow(updatedRow);
    };

    const getActionColumn = (): GridColDef => ({
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 100,
        cellClassName: "actions",
        getActions: ({ id }) => {
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
            return ActionButtons({
                id,
                isInEditMode,
                onSave: handleSaveClick(id),
                onCancel: handleCancelClick(id),
                onEdit: handleEditClick(id),
                onDelete: handleDeleteClick(id),
            });
        },
    });

    const columnsWithActions: GridColDef[] = [
        ...columnsOptions,
        getActionColumn(),
    ];

    return (
        <div style={{ height: "100%", width: "95%", margin: "auto" }}>
            <Typography variant="h6" component="h2" gutterBottom>
                {tableName}
            </Typography>
            <DataGrid
                loading={rows.length === 0}
                checkboxSelection
                disableRowSelectionOnClick
                keepNonExistentRowsSelected
                rows={rows}
                columns={columnsWithActions}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                // biome-ignore lint/style/useNamingConvention: it's from MUI
                localeText={{ toolbarExportCSV: "Export to CSV" }}
                slots={{ toolbar: EditToolbar as GridSlots["toolbar"] }}
                slotProps={{
                    toolbar: { onAdd: handleAddRow, columns, table },
                    loadingOverlay: { variant: "skeleton" },
                }}
                pageSizeOptions={[10, 20, 50, 100]}
                style={{
                    maxHeight: "40rem",
                    maxWidth: "100%",
                    margin: "auto",
                    padding: "1rem",
                }}
                initialState={{
                    columns: { columnVisibilityModel: { id: false } },
                }}
                {...configs}
            />
        </div>
    );
}
