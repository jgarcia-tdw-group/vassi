import { Delete } from "@mui/icons-material";
import {
    Alert,
    CircularProgress,
    DialogActions,
    Typography,
} from "@mui/material";
import { Autocomplete, createFilterOptions } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { getCothPrices, getItemPrices } from "~/actions/displays";
import { formatearNumero } from "~/utils/utils";

function ModalItems({
    isOpen,
    title,
    onClose,
    setListItem,
    setCount,
    listItem,
}) {
    const [price, setPrice] = useState(0);
    const [iman, setIman] = useState(false);
    const [qty, setQty] = useState(1);
    const [success, setSucces] = useState(false);
    const [total, setTotal] = useState(0);
    const [message, setMessege] = useState("");
    const [severity, setSeverity] = useState("");
    const [prices, setPrices] = useState([]);
    const [disabledAdd, setDisabledAdd] = useState(true);
    const [priceScale, setPriceScale] = useState(1);
    const [clothPricesBackup, setClothPricesBackup] = useState([]);
    const [clothPricesInternal, setClothPricesInternal] = useState([]);
    const [clothPricesExternal, setClothPricesExternal] = useState([]);
    const [internalCode, setInternalCode] = useState("");
    const [externalCode, setExternalCode] = useState("");
    const [internalName, setInternalName] = useState("");
    const [externalName, setExternalName] = useState("");
    const [internallevel, setInternalLevel] = useState(0);
    const [externallevel, setExternalLevel] = useState(0);
    const [checked, setChecked] = useState(false);

    const handleChangePrice = (event, pricesList) => {
        let precioScale;
        if (pricesList) {
            pricesList.forEach((row) => {
                if (row.price === event.target.value) {
                    precioScale = row.level;
                }
            });
        } else {
            prices.forEach((row) => {
                if (row.price === event.target.value) {
                    precioScale = row.level;
                }
            });
        }

        setPrice(event.target.value);
        setPriceScale(precioScale);
        handleChangeTotal(
            convertirMoneyAPosgreSqLaNumero(event.target.value) * qty,
        );
        //setIman(false);
    };

    useEffect(() => {
        setPrices([]);
        setQty(1);
        let ispush = false;
        listItem.forEach((element) => {
            if (element.itemName === title) ispush = true;
        });
        if (ispush) {
            setSucces(true);
            setMessege("this code is already in the order!");
            setSeverity("error");
        } else {
            setSucces(false);
            setMessege("");
            setSeverity("");
            if (title !== "") {
                getPrices(title, iman);
                getCothPricesList();
            }
            setInternalCode("");
            setExternalCode("");
            setInternalName("");
            setExternalName("");
            setInternalLevel(0);
            setExternalLevel(0);
        }
    }, [isOpen]);

    const handleAddItem = (e) => {
        e.preventDefault();

        if (internalName === "") {
            setSucces(true);
            setMessege("First Choose Internal Material");
            setSeverity("warning");
            return;
        }

        if (externalName === "") {
            setSucces(true);
            setMessege("First Choose External Material");
            setSeverity("warning");
            return;
        }

        setListItem((old) => {
            let ispush = true;
            old.forEach((element) => {
                if (element.itemName === title) ispush = false;
            });
            if (ispush) {
                if (price === 0) {
                    setSucces(true);
                    setMessege("Choose a price scale first!");
                    setSeverity("warning");
                } else {
                    old.push({
                        itemName: title,
                        itemQuantity: qty,
                        itemPrice: price,
                        priceScale: priceScale,
                        magnet: iman,
                        total: total,
                        externallevel: externallevel,
                        internallevel: internallevel,
                        externalCode: externalCode,
                        internalCode: internalCode,
                        externalName: externalName,
                        internalName: internalName,
                    });
                    setCount((old) => old + 1);
                    onClose();
                    setSeverity("error");
                }
            } else {
                setSucces(true);
                setMessege("this code is already in the order!");
                setSeverity("error");
            }
            const objetoJson = { listItem: old };
            const cadenaJson = JSON.stringify(objetoJson);
            Cookies.set("listITems", cadenaJson, { expires: 7, path: "/" });
            return old;
        });
    };

    const handleChangeIman = (e) => {
        e.preventDefault();
        setIman((old) => {
            /* if (!old) {
  setTotal((old2) => old2 + 50);
} else {
  setTotal((old2) => old2 - 50);
} */
            getPrices(title, !old);
            setTotal(0);
            return !old;
        });
    };

    const handleChangeQty = (e) => {
        e.preventDefault();
        if (e.target.value > 0) {
            setQty(e.target.value);
            handleChangeTotal(
                e.target.value * convertirMoneyAPosgreSqLaNumero(price),
            );
            //setIman(false);
        }
    };

    const handleChangeTotal = (num1) => {
        const factor = 10 ** 2;
        setTotal(Math.floor(num1 * factor) / factor);
    };

    const handleDeleteItem = (e) => {
        e.preventDefault();
        setListItem((old) => {
            setCount((old) => old - 1);
            setSucces(false);
            const newArray = eliminarElementoPorCodigo(old, title);
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

    const getPrices = (itemNumber, magnet) => {
        const inten = itemNumber.split("#")[1];
        const object = { itemNumber: inten, magnet: magnet };
        getItemPrices(object, handleMessage).then((response) => {
            if (response.status === 200) {
                if (response.data.resultado.length > 0) {
                    //console.log(response.data.resultado[0]);
                    const prices = response.data.resultado[0];
                    const pricesList = [];
                    const ob1 = { price: prices.PRICE1, level: 1 };
                    setPrice(prices.PRICE1);
                    pricesList.push(ob1);
                    const ob2 = { price: prices.PRICE2, level: 2 };
                    pricesList.push(ob2);
                    const ob3 = { price: prices.PRICE3, level: 3 };
                    pricesList.push(ob3);
                    const ob4 = { price: prices.PRICE4, level: 4 };
                    pricesList.push(ob4);
                    const ob5 = { price: prices.PRICE5, level: 5 };
                    pricesList.push(ob5);
                    const ob6 = { price: prices.PRICE6, level: 6 };
                    pricesList.push(ob6);
                    setPrices(pricesList);
                    if (
                        prices.PRICE1 === 0 &&
                        prices.PRICE1 === 0 &&
                        prices.PRICE1 === 0 &&
                        prices.PRICE1 === 0 &&
                        prices.PRICE1 === 0 &&
                        prices.PRICE1 === 0
                    ) {
                        setDisabledAdd(true);
                        setSucces(true);
                        setMessege(
                            "This item doesn't exits in this presentation!",
                        );
                        setSeverity("warning");
                        handleChangeTotal(0);
                    } else {
                        setSucces(false);
                        setDisabledAdd(false);
                        handleChangeTotal(
                            convertirMoneyAPosgreSqLaNumero(prices.price1) *
                                qty,
                        );
                        if (internallevel > externallevel)
                            setLevelPrice(internallevel, pricesList);
                        else setLevelPrice(externallevel, pricesList);
                    }
                } else {
                    setPrices([]);
                    setDisabledAdd(true);
                    setSucces(true);
                    setMessege("Prices not found!");
                    setSeverity("warning");
                    handleChangeTotal(0);
                }
            }
        });
    };

    const getCothPricesList = () => {
        getCothPrices(handleMessage).then((response) => {
            ordenarPorPriceLevelAscendente(response.data.resultado);
            setClothPricesBackup(response.data.resultado);
            setClothPricesInternal(response.data.resultado);
        });
    };

    function convertirMoneyAPosgreSqLaNumero(moneyString) {
        return moneyString;
        /* // Eliminar el símbolo "$" y cualquier otro caracter no numérico
const numericString = moneyString.replace(/[^0-9.]/g, '');

// Parsear el resultado en un número flotante
const numero = parseFloat(numericString);

return numero; */
    }

    const handleChangeInternalCoth = (code) => {
        let priceLevelSelected = 0;
        let nameLevelSelected = "";
        clothPricesBackup.forEach((element) => {
            if (element.code === code.target.value) {
                priceLevelSelected = element.pricelevel;
                nameLevelSelected = element.description;
            }
        });
        setInternalName(nameLevelSelected);
        setInternalCode(code.target.value);
        setInternalLevel(priceLevelSelected);

        if (checked) {
            setClothPricesExternal(clothPricesBackup);
            if (priceLevelSelected > externallevel)
                setLevelPrice(priceLevelSelected);
            else setLevelPrice(externallevel);
        } else {
            setLevelPrice(priceLevelSelected);
            const listafiltrada = clothPricesBackup.filter(
                (x) => x.pricelevel === priceLevelSelected,
            );
            setClothPricesExternal(listafiltrada);
        }
    };

    const handleChangeExternalCoth = (code) => {
        let priceLevelSelected = 0;
        let nameLevelSelected = "";
        clothPricesBackup.forEach((element) => {
            if (element.code === code.target.value) {
                priceLevelSelected = element.pricelevel;
                nameLevelSelected = element.description;
            }
        });
        setExternalName(nameLevelSelected);
        setExternalCode(code.target.value);
        setExternalLevel(priceLevelSelected);

        if (checked) {
            if (internallevel > priceLevelSelected)
                setLevelPrice(internallevel);
            else setLevelPrice(priceLevelSelected);
        }
    };

    const handleChangeChekbox = (event) => {
        setChecked(event.target.checked);
        if (event.target.checked) {
            setClothPricesExternal(clothPricesBackup);
            if (internallevel > externallevel) setLevelPrice(internallevel);
            else setLevelPrice(externallevel);
        } else {
            const listafiltrada = clothPricesBackup.filter(
                (x) => x.pricelevel === internallevel,
            );
            setClothPricesExternal(listafiltrada);
        }
    };

    const setLevelPrice = (level, pricesList) => {
        if (pricesList) {
            pricesList.forEach((element) => {
                if (element.level === level) {
                    //console.log({ target: { value: element.price } })
                    handleChangePrice(
                        { target: { value: element.price } },
                        pricesList,
                    );
                }
            });
        } else {
            prices.forEach((element) => {
                if (element.level === level) {
                    //console.log({ target: { value: element.price } })
                    handleChangePrice(
                        { target: { value: element.price } },
                        null,
                    );
                }
            });
        }
    };

    const ordenarPorPriceLevelAscendente = (arrayDeObjetos) => {
        arrayDeObjetos.sort((a, b) => a.pricelevel - b.pricelevel);
    };

    const filterOptions = (options, state) => {
        const defaultFilterOptions = createFilterOptions();
        return defaultFilterOptions(options, state).slice(
            0,
            clothPricesInternal.length,
        );
    };

    const filterOptions2 = (options, state) => {
        const defaultFilterOptions = createFilterOptions();
        return defaultFilterOptions(options, state).slice(
            0,
            clothPricesExternal.length,
        );
    };

    const onTagsChangeInternalCoth = (event, values) => {
        if (values != null) {
            handleChangeInternalCoth({ target: { value: values.code } });
        } else {
            setInternalName("");
            setInternalCode("");
        }
    };

    const onTagsChangeExternalCoth = (event, values) => {
        if (values != null) {
            handleChangeExternalCoth({ target: { value: values.code } });
        } else {
            setExternalName("");
            setExternalCode("");
        }
    };

    const handleMessage = (message, severity) => {
        setSucces(true);
        setMessege(message);
        setSeverity(severity);
    };

    return (
        <Dialog
            open={isOpen}
            fullWidth
            maxWidth={"md"}
            onClose={() => {
                onClose();
                setPrices([]);
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Box>
                    <div className="grid-container">
                        <div className="grid-item">
                            <Typography>Magnet</Typography>
                        </div>
                        <div className="grid-item2">
                            <Button
                                variant="contained"
                                onClick={(e) => {
                                    setPrices([]);
                                    handleChangeIman(e);
                                }}
                            >
                                {iman ? "Yes" : "No"}
                            </Button>
                        </div>
                        <div className="grid-item">
                            <Typography>Internal Material</Typography>
                        </div>
                        <div className="grid-item2">
                            {clothPricesInternal.length === 0 ? (
                                <CircularProgress
                                    style={{ marginLeft: "40px" }}
                                />
                            ) : (
                                <FormControl style={{ width: "60%" }}>
                                    <Autocomplete
                                        {...{
                                            options: clothPricesInternal,
                                            getOptionLabel: (option) =>
                                                `${option.description}(${option.pricelevel})`,
                                        }}
                                        id="disable-close-on-select"
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={internalName}
                                                variant="standard"
                                            />
                                        )}
                                        onChange={onTagsChangeInternalCoth}
                                        ListboxProps={{
                                            style: {
                                                maxHeight: 200,
                                                overflow: "auto",
                                            },
                                        }}
                                        filterOptions={filterOptions}
                                    />
                                </FormControl>
                            )}
                        </div>
                        <div className="grid-item">
                            <Typography>Different price level?</Typography>
                        </div>
                        <div className="grid-item2">
                            <Checkbox
                                checked={checked}
                                onChange={handleChangeChekbox}
                                inputProps={{ "aria-label": "controlled" }}
                            />
                        </div>
                        <div className="grid-item">
                            <Typography>External Material</Typography>
                        </div>
                        <div className="grid-item2">
                            {clothPricesExternal.length === 0 ? (
                                <p> Loading...</p>
                            ) : (
                                <FormControl style={{ width: "60%" }}>
                                    <Autocomplete
                                        {...{
                                            options: clothPricesExternal,
                                            getOptionLabel: (option) =>
                                                `${option.description}(${option.pricelevel})`,
                                        }}
                                        id="disable-close-on-select"
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={externalName}
                                                variant="standard"
                                            />
                                        )}
                                        onChange={onTagsChangeExternalCoth}
                                        ListboxProps={{
                                            style: {
                                                maxHeight: 200,
                                                overflow: "auto",
                                            },
                                        }}
                                        filterOptions={filterOptions2}
                                    />
                                </FormControl>
                            )}
                        </div>
                        <div className="grid-item">
                            <Typography>Price Scale</Typography>
                        </div>
                        <div className="grid-item2">
                            {prices.length === 0 ? (
                                <CircularProgress
                                    style={{ marginLeft: "40px" }}
                                />
                            ) : (
                                <>
                                    {" "}
                                    {internalCode === "" &&
                                    externalCode === "" ? (
                                        <p>Loading...</p>
                                    ) : (
                                        <Typography>{`(${priceScale})$${formatearNumero(price)}`}</Typography>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="grid-item">
                            <Typography>Quantity</Typography>
                        </div>
                        <div className="grid-item2">
                            <TextField
                                style={{ width: "60%" }}
                                type="number"
                                value={qty}
                                onChange={(e) => {
                                    handleChangeQty(e);
                                }}
                            />
                        </div>
                    </div>
                </Box>
            </DialogContent>
            <DialogActions>
                {success ? (
                    severity === "error" ? (
                        <>
                            <IconButton
                                aria-label="delete"
                                onClick={(e) => handleDeleteItem(e)}
                            >
                                <Delete />
                            </IconButton>
                            <Alert severity={severity}>{message}</Alert>
                        </>
                    ) : (
                        <Alert severity={severity}>{message}</Alert>
                    )
                ) : (
                    ""
                )}
                <Typography>{`Quantity: ${qty}`}</Typography>
                <Typography>{`Price: $${formatearNumero(price)}`}</Typography>
                <Typography style={{ fontWeight: "bold", marginRight: "10px" }}>
                    {`Total: $${formatearNumero(total)}`}
                </Typography>
                <Button
                    variant="contained"
                    onClick={(e) => {
                        handleAddItem(e);
                    }}
                    disabled={disabledAdd}
                >
                    Add to Order
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ModalItems;
