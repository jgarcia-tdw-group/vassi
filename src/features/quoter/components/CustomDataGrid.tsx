"use client";

import { Typography, Button, Autocomplete, createFilterOptions } from "@mui/material";
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
import FormControl from "@mui/material/FormControl";
import { useRowModes } from "../hooks/useRowModes";
import { ActionButtons } from "./ActionButtons";
import { EditToolbar } from "./EditToolbar";
import TextField from "@mui/material/TextField";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { clientsList, storeDisplayOrder } from "~/actions/hows-that";
import { SpaceBar } from "@mui/icons-material";

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

    const [clients, setClients] = useState([]);
    const [clientsEntry, setClientsEntry] = useState("");
    const [tiempo, setTiempo] = useState("");
    const [open, setOpen] = useState(false);
    const [clientId, setClientId] = useState(-1);
    const [success, setSucces] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [Message, setMessage] = useState("");
    const router = useRouter();

    const [order, setOrder] = useState({
        clientName: "",
        salesManCode: "",
    });

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

    const handleKeyUp = (e) => {
        // hace el llamado del servicio un segundo despues que ha dejado de escribir
        clearTimeout(tiempo);
        setTiempo(
            setTimeout(() => {
                clearTimeout(tiempo);
                if (clientsEntry.length >= 3) {
                    function loadClients() {
                        const Authorization =
                            Cookies.get("token") || "Not valid";
                        const applicationCookie =
                            Cookies.get("applicationCookie") || "Not valid";
                        if (
                            Authorization === "Not valid" ||
                            applicationCookie === "Not valid"
                        ) {
                            handleErrorMessage("please login first!", "error");
                            router.push("/login");
                            return;
                        }
                        clientsList(
                            {
                                Authorization: `Bearer ${Authorization}`,
                                applicationCookie: applicationCookie,
                                clientsEntry: clientsEntry,
                            },
                            handleErrorMessage,
                            setOpen,
                        ).then((response: any) => {
                            if (response.status === 200) {
                                setClients(response.data.Clients);
                                setOpen(true);
                            } else {
                                handleErrorMessage(
                                    "Error loading clients!",
                                    "error",
                                );
                                setClients([]);
                                setOpen(false);
                            }
                        });
                    }
                    loadClients();
                }
            }, 1000),
        );
    };

    const handleChangeInputs = (e) => {
        setOrder((old) => {
            return { ...old, [e.target.name]: e.target.value };
        });
    };

    const handleErrorMessage = (Message, severity) => {
        setSucces(true);
        setSeverity(severity);
        if (Message === "Invalid token.") {
            Message = `${Message} Please Login Again!`;
        }
        setMessage(Message);
    };

    const onTagsChangeInternalCoth = (event, values) => {
        if (values != null) {
            handleChangeInputs({
                target: { name: "clientName", value: values.name },
            });
            setClientId(values.id);
        } else {
            handleChangeInputs({ target: { name: "clientName", value: "" } });
            setClientId(-1);
        }
        setOpen(false);
    };

    const filterOptions = (options, state) => {
        const defaultFilterOptions = createFilterOptions();
        return defaultFilterOptions(options, state).slice(0, 1000);
    };

    return (
        <div style={{ height: "100%", width: "95%", margin: "auto" }}>
            <Typography variant="h6" component="h2" gutterBottom>
                {tableName}
            </Typography>

            <div className="divbotoncart">

                <FormControl style={{ width: "60%" }}>
                    <label style={{ marginRight: "96px" }}>
                        Customer Name:
                    </label>
                    <Autocomplete
                        {...{
                            options: clients,
                            getOptionLabel: (option: any) =>
                                `(${option.id}) ${option.name}`,
                        }}
                        id="disable-close-on-select"
                        renderInput={(params) => {
                            setClientsEntry(
                                params.inputProps.value,
                            );
                            return (
                                <TextField
                                    {...params}
                                    label={order.clientName}
                                    variant="standard"
                                />
                            );
                        }}
                        onChange={onTagsChangeInternalCoth}
                        ListboxProps={{
                            style: {
                                maxHeight: 200,
                                overflow: "auto",
                            },
                        }}
                        filterOptions={filterOptions}
                        onKeyUp={(e) => {
                            setOpen(false);
                            handleKeyUp(e);
                        }}
                        open={open}
                        onClickCapture={(e) =>
                            setOpen((old) => !old)
                        }
                        onBlur={(e) => {
                            e.preventDefault();
                            setOpen(false);
                        }}
                    />
                </FormControl>

                <div style={{ flexGrow: 5 }} />

                <Button variant="contained" onClick={() => console.log("Send Order")}>
                    {`Send Order`}
                </Button>
            </div>

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
