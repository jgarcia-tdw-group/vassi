import DeleteIcon from "@mui/icons-material/Delete";
import {
    Alert,
    CircularProgress,
    DialogActions,
    TablePagination,
} from "@mui/material";
import { Autocomplete, createFilterOptions } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { clientsList, storeDisplayOrder } from "~/actions/hows-that";
import { formatearNumero } from "~/utils/utils";
import { TablePaginationActions } from "./Navigation";
/* import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select'; */

const ModalCart = ({
    isOpen,
    title,
    onClose,
    listItem,
    total,
    setListItem,
    setCount,
}) => {
    const [pagination, setPagination] = useState({ rowsPerPage: 25, page: 0 });
    const [success, setSucces] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [Message, setMessage] = useState("");
    const [order, setOrder] = useState({
        clientName: "",
        salesManCode: "",
    });
    const [totalOrder, setTotalOrder] = useState(0);
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [clientsEntry, setClientsEntry] = useState("");
    const [tiempo, setTiempo] = useState("");
    const [open, setOpen] = useState(false);
    const [clientId, setClientId] = useState(-1);
    const router = useRouter();
    const [idsErrors, setIdsErrors] = useState([]);

    useEffect(() => {
        handleChangeTotal(total);
    }, [total]);

    useEffect(() => {
        setOrder({
            clientName: "",
            salesManCode: "",
        });
    }, [isOpen]);

    useEffect(() => {
        const newListWithErrors = [];
        listItem.forEach((row) => {
            let findedItemNameError = false;
            let findedInternalCodeError = false;
            let findedExternalCodeError = false;
            idsErrors.forEach((rowErrors) => {
                if (row.itemName === rowErrors) {
                    findedItemNameError = true;
                }
                if (`#${row.internalCode}` === rowErrors) {
                    findedInternalCodeError = true;
                }
                if (`#${row.externalCode}` === rowErrors) {
                    findedExternalCodeError = true;
                }
            });
            newListWithErrors.push({
                ...row,
                itemNameError: findedItemNameError,
                internalCodeError: findedInternalCodeError,
                externalCodeError: findedExternalCodeError,
            });
        });
        setListItem(newListWithErrors);
    }, [idsErrors]);

    const handleChangePage = (event, newPage) => {
        setPagination((old) => {
            return { ...old, page: newPage };
        });
    };

    const handleChangeRowsPerPage = (event) => {
        setPagination((old) => {
            return {
                ...old,
                page: 0,
                rowsPerPage: Number.parseInt(event.target.value, 10),
            };
        });
    };

    const handleSendOrder = (e) => {
        e.preventDefault();
        //onClose();
        if (order.clientName === "") {
            handleErrorMessage("Select a client!", "error");
            return;
        }

        if (clientId === -1) {
            handleErrorMessage("Select a client!", "error");
            return;
        }

        if (listItem.length === 0) {
            handleErrorMessage("Add at least one item!", "error");
            return;
        }

        const codeSap = Cookies.get("codeSap") || "Not valid";
        const applicationCookie =
            Cookies.get("applicationCookie") || "Not valid";
        const Authorization = Cookies.get("token") || "Not valid";

        if (
            codeSap === "Not valid" ||
            applicationCookie === "Not valid" ||
            Authorization === "Not valid"
        ) {
            handleErrorMessage("please login first!", "error");
            router.push("/login");
            return;
        }

        const orden = {
            ...order,
            listItems: listItem,
            salesManCode: codeSap,
            Total: totalOrder,
            Authorization: `Bearer ${Authorization}`,
            applicationCookie: applicationCookie,
            clientId: clientId,
        };

        storeDisplayOrder(orden, handleErrorMessage, setLoading).then((response) => {
            console.log(response.data);
            if (response.status === 200) {
                handleErrorMessage(
                    `Order Sent Successfuly! Order Number: ${response.data.order_no}`,
                    "success",
                );
                setLoading(false);
            } else {
                const error = response.data.Message;
                const errorsMessages = [];

                if (error.includes("Customer information not found"))
                    errorsMessages.push("Customer information not found");

                if (error.includes("Sales information not found"))
                    errorsMessages.push("Sales information not found");

                if (error.includes("Division Code information not found"))
                    errorsMessages.push("Division Code information not found");

                if (
                    error.includes(
                        "Item quantity must be greater than zero for",
                    )
                )
                    errorsMessages.push(
                        "Item quantity must be greater than zero",
                    );

                if (error.includes("Item price must be greater than zero for"))
                    errorsMessages.push("Item price must be greater than zero");

                if (error.includes("Item price scale invalid for"))
                    errorsMessages.push("Item price scale invalid");

                if (error.includes("Display information not found"))
                    errorsMessages.push("Display information not found");

                if (error.includes("Internal Material information not found"))
                    errorsMessages.push(
                        "Internal Material information not found",
                    );

                if (error.includes("External Material information not found"))
                    errorsMessages.push(
                        "External Material information not found",
                    );

                if (error.includes("Package information not found"))
                    errorsMessages.push("Package information not found");

                if (error.includes("Raw Material information not found"))
                    errorsMessages.push("Raw Material information not found");

                if (error.includes("Fabric Material information not found"))
                    errorsMessages.push(
                        "Fabric Material information not found",
                    );

                if (error.includes("Unit Measure information not found"))
                    errorsMessages.push("Unit Measure information not found");

                const plaintMessage = formatErrorMessages(errorsMessages);
                handleErrorMessage(plaintMessage, "error");
                setLoading(false);

                console.log(handleFillIdsErrors(error));
                setIdsErrors(handleFillIdsErrors(error));
            }
        });
    };

    const handleChangeInputs = (e) => {
        //e.preventDefault();
        setOrder((old) => {
            return { ...old, [e.target.name]: e.target.value };
        });
    };

    const handleDeleteItem = (e, title) => {
        e.preventDefault();
        setListItem((old) => {
            setCount((old) => old - 1);
            const newArray = eliminarElementoPorCodigo(old, title);
            let total = 0;
            newArray.forEach((element) => {
                total = total + element.total;
            });
            handleChangeTotal(total);
            const objetoJson = { listItem: newArray };
            const cadenaJson = JSON.stringify(objetoJson);
            Cookies.set("listITems", cadenaJson, { expires: 7, path: "/" });
            return newArray;
        });
    };

    const eliminarElementoPorCodigo = (array, codigo) => {
        const indice = array.findIndex(
            (elemento) => elemento.itemName === codigo,
        );
        if (indice !== -1) {
            array.splice(indice, 1);
        }
        if (array.length === 0) {
            return [];
        }
        return array;
    };

    const handleChangeTotal = (num1) => {
        const factor = 10 ** 2;
        setTotalOrder(Math.floor(num1 * factor) / factor);
    };

    const handleErrorMessage = (Message, severity) => {
        setSucces(true);
        setSeverity(severity);
        if (Message === "Invalid token.") {
            Message = `${Message} Please Login Again!`;
        }
        setMessage(Message);
    };

    const filterOptions = (options, state) => {
        const defaultFilterOptions = createFilterOptions();
        return defaultFilterOptions(options, state).slice(0, 1000);
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
                        ).then((response) => {
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

    const formatErrorMessages = (errors) => {
        if (!errors || errors.length === 0) {
            return "No errors found.";
        }

        const errorCount = errors.length;
        let errorMessage = "";

        for (let i = 0; i < Math.min(2, errorCount); i++) {
            errorMessage += errors[i];
            if (i < Math.min(1, errorCount - 1)) {
                errorMessage += ", ";
            }
        }

        if (errorCount > 2) {
            errorMessage += ` and ${errorCount - 2} error${errorCount > 3 ? "s" : ""} more`;
        }

        return errorMessage;
    };

    const handleFillIdsErrors = (errors) => {
        if (!errors || errors.length === 0) {
            return [];
        }

        const segments = errors.split(";");

        const ids = segments.reduce((acc, segment) => {
            const match = segment.match(/\s*#([A-Za-z0-9]+)\s*/);
            if (match) {
                acc.push(`#${match[1]}`);
            }
            return acc;
        }, []);

        return ids;
    };

    return (
        <div>
            <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={"lg"}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent dividers>
                    <Box>
                        <div>
                            {/* <div style={{ marginTop: "3%", marginBottom: "3%" }}>
                <label style={{ marginRight: "100px" }}>Client Code:</label>
                <TextField type='text' id="clientCode" name="clientCode" onChange={(e) => { handleChangeInputs(e) }}></TextField>
              </div> */}
                            {/* <div style={{ marginTop: "3%", marginBottom: "3%" }}>
                <label style={{ marginRight: "96px" }}>Customer Name:</label>
                <TextField
                  type="text"
                  id="clientName"
                  name="clientName"
                  onChange={(e) => {
                    handleChangeInputs(e);
                  }}
                ></TextField>
              </div> */}
                            <div className="grid-item2">
                                <FormControl style={{ width: "60%" }}>
                                    <label style={{ marginRight: "96px" }}>
                                        Customer Name:
                                    </label>
                                    <Autocomplete
                                        {...{
                                            options: clients,
                                            getOptionLabel: (option) =>
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
                                    {/* <TextField
                      id="standard-basic"
                      variant="standard"
                      onChange={(e) => { setClientsEntry(e.target.value) }}
                      value={clientsEntry}
                      onKeyUp={e => {
                        handleKeyUp(e);
                      }}
                    />
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={order.clientName}
                      onChange={(e) => {
                        setOpen(false);
                        setOrder({clientName: e.target.value}); }}
                      label="Age"
                      open={open}
                      onClickCapture={(e) => setOpen(old=>!old)}
                    >
                      {
                        clients.length > 0 ?
                          clients.map((row, index) => (
                            <MenuItem key={index} value={row.name}><em>{row.name}</em></MenuItem>
                          ))
                          :
                          <MenuItem value=""><em>None</em></MenuItem>
                      }
                    </Select>
                  </FormControl> */}
                                </FormControl>
                            </div>
                            {/* <div style={{ marginTop: "3%", marginBottom: "3%" }}>
                <label style={{ marginRight: "66px" }}>Sales Man Code:</label>
                <TextField type='text' id="salesManCode" name="salesManCode" onChange={(e) => { handleChangeInputs(e) }}></TextField>
              </div> */}
                        </div>
                        <div style={{ marginTop: "3%", marginBottom: "3%" }}>
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item Name</TableCell>
                                            <TableCell align="center">
                                                Price
                                            </TableCell>
                                            <TableCell align="center">
                                                Magnet
                                            </TableCell>
                                            <TableCell align="center">
                                                Internal Material
                                            </TableCell>
                                            <TableCell align="center">
                                                External Material
                                            </TableCell>
                                            <TableCell align="center">
                                                Quantity
                                            </TableCell>
                                            <TableCell align="center">
                                                Total Line
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {listItem
                                            .slice(
                                                pagination.page *
                                                    pagination.rowsPerPage,
                                                pagination.page *
                                                    pagination.rowsPerPage +
                                                    pagination.rowsPerPage,
                                            )
                                            .map((row, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        "&:last-child td, &:last-child th":
                                                            { border: 0 },
                                                    }}
                                                >
                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        style={{
                                                            background:
                                                                row.itemNameError
                                                                    ? "#E55555"
                                                                    : "#ffffff",
                                                        }}
                                                    >
                                                        {row.itemName}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        $
                                                        {formatearNumero(
                                                            row.itemPrice,
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {row.magnet
                                                            ? "Yes"
                                                            : "No"}
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={{
                                                            background:
                                                                row.internalCodeError
                                                                    ? "#E55555"
                                                                    : "#ffffff",
                                                        }}
                                                    >
                                                        {`(${row.internalCode})${row.internalName}`}
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={{
                                                            background:
                                                                row.externalCodeError
                                                                    ? "#E55555"
                                                                    : "#ffffff",
                                                        }}
                                                    >
                                                        {`(${row.externalCode})${row.externalName}`}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {row.itemQuantity}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        $
                                                        {formatearNumero(
                                                            row.total,
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            aria-label="delete"
                                                            onClick={(e) =>
                                                                handleDeleteItem(
                                                                    e,
                                                                    row.itemName,
                                                                )
                                                            }
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[
                                        25,
                                        50,
                                        75,
                                        {
                                            label: "All",
                                            value: listItem.length,
                                        },
                                    ]}
                                    component="div"
                                    count={listItem.length}
                                    rowsPerPage={pagination.rowsPerPage}
                                    page={pagination.page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={
                                        handleChangeRowsPerPage
                                    }
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableContainer>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions>
                    {loading ? (
                        success ? (
                            <Alert severity={severity}>{Message}</Alert>
                        ) : (
                            <CircularProgress style={{ marginLeft: "40px" }} />
                        )
                    ) : success ? (
                        <Alert severity={severity}>{Message}</Alert>
                    ) : (
                        <></>
                    )}
                    <p style={{ marginRight: "10px" }}>
                        {`Total Order: $${formatearNumero(totalOrder)}`}
                    </p>
                    <Button
                        disabled={listItem.length <= 0}
                        variant="contained"
                        onClick={(e) => {
                            setLoading(true);
                            setSucces(false);
                            handleSendOrder(e);
                        }}
                    >
                        Send Order
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ModalCart;
