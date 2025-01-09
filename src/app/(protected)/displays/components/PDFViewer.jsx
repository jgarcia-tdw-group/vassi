"use client";

import { Viewer } from "@react-pdf-viewer/core";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import React, { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import ModalItems from "./modal";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Delete } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Cookies from "js-cookie";
import ModalCart from "./modalCart";

// Establece la ruta del archivo 'worker' de pdfjs-dist
GlobalWorkerOptions.workerSrc =
    "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.7.107/pdf.worker.js";
//GlobalWorkerOptions.workerSrc = `../public/pdf/pdf.worker.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const PDFViewerExtractor = ({ pdfUrl, page }) => {
    const [numPages, setNumPages] = useState(null);
    const [text, setText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [titulo, settitulo] = useState("");
    const [listhastangs, setListhastangs] = useState([]);
    const [modalCartOpen, setModalCartOpen] = useState(false);
    const [tituloModalCart, setTitulomodalCart] = useState("ORDER");
    const [listItem, setListItem] = useState([]);
    const [count, setCount] = useState(0);
    const [totalOrder, setTotalOrder] = useState(0);
    const [search, setSearch] = useState("");
    const [modalOpenDeleteOrder, setModalOpenDeleteOrder] = useState(false);

    useEffect(() => {
        const listaItems = Cookies.get("listITems");
        if (listaItems) {
            const objetoJson = JSON.parse(listaItems);
            setListItem(objetoJson.listItem);
            setCount(objetoJson.listItem.length);
        }
    }, []);

    const extractText = async (page) => {
        try {
            const pdf = await getDocument(pdfUrl).promise;
            const totalNumPages = pdf.numPages;

            let extractedText = "";
            //for (let pageNum = 1; pageNum <= totalNumPages; pageNum++) {
            const pageload = await pdf.getPage(page);
            const pageText = await pageload.getTextContent();
            const pageStrings = pageText.items.map((item) => item.str);
            extractedText += pageStrings.join(" ");
            //}

            setNumPages(totalNumPages);
            setText(extractedText);
            setListhastangs(extractHashtags(extractedText));
        } catch (error) {
            console.error("Error extracting text:", error);
        }
    };

    const generateLinks = () => {
        const keywords = listhastangs; // Palabras clave para buscar

        const linkElements = keywords.map((keyword) => {
            if (text.includes(keyword)) {
                let alreadyInOrder = false;
                listItem.forEach((element) => {
                    if (element.itemName === keyword) alreadyInOrder = true;
                });
                return (
                    <Button
                        variant="text"
                        style={{
                            margin: "3px",
                            color: alreadyInOrder ? "red" : "blue",
                        }}
                        key={keyword}
                        onClick={(e) => {
                            e.preventDefault();
                            openModal();
                            settitulo(keyword);
                        }}
                    >
                        {keyword}
                    </Button>
                );
            }
            return null;
        });

        return linkElements;
    };

    const handlePageChange = (page) => {
        extractText(page);
        setCurrentPage(page);
    };

    const extractHashtags = (str) => {
        const regex = /#[^\s,#]+/g;
        const hashtags = str.match(regex) || [];

        // Utilizar un Set para eliminar los valores duplicados
        const uniqueHashtags = [...new Set(hashtags)];

        return uniqueHashtags;
    };

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const openModalCart = () => {
        let total = 0;
        listItem.forEach((element) => {
            total = total + element.total;
        });
        setTotalOrder(total);
        setModalCartOpen(true);
    };

    const closeModalCart = () => {
        setModalCartOpen(false);
    };

    const handleEmptyOrder = () => {
        setCount(0);
        setListItem([]);
        const objetoJson = { listItem: [] };
        const cadenaJson = JSON.stringify(objetoJson);
        Cookies.set("listITems", cadenaJson, { expires: 7, path: "/" });
        setModalOpenDeleteOrder(false);
    };

    return (
        <div className="divprincipal">
            <Dialog
                open={modalOpenDeleteOrder}
                fullWidth
                maxWidth={"sm"}
                onClose={() => {
                    setModalOpenDeleteOrder(false);
                }}
            >
                <DialogTitle>Delete items in order?</DialogTitle>
                <DialogContent>
                    <div className="divbotoncart">
                        <div style={{ flexGrow: 5 }} />
                        <Button
                            variant="contained"
                            onClick={() => setModalOpenDeleteOrder(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            style={{
                                backgroundColor: "red",
                            }}
                            onClick={() => {
                                handleEmptyOrder();
                            }}
                        >
                            Accept
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <ModalItems
                isOpen={modalOpen}
                title={titulo}
                onClose={closeModal}
                setListItem={setListItem}
                setCount={setCount}
                listItem={listItem}
            />
            <ModalCart
                isOpen={modalCartOpen}
                title={tituloModalCart}
                onClose={closeModalCart}
                listItem={listItem}
                total={totalOrder}
                setListItem={setListItem}
                setCount={setCount}
            />

            <div className="divbotoncart">
                <div style={{ flexGrow: 5 }} />
                <IconButton
                    aria-label="delete"
                    onClick={(e) => {
                        e.preventDefault();
                        setModalOpenDeleteOrder(true);
                    }}
                    disabled={count === 0}
                >
                    <Delete />
                </IconButton>
                <Button variant="contained" onClick={() => openModalCart()}>
                    {`Order (${count})`}
                </Button>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <TextField
                    size="small"
                    id="itemCodeSearch"
                    name="itemCodeSearch"
                    label="Manual Search"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                    disabled={search === ""}
                    variant="text"
                    onClick={(e) => {
                        e.preventDefault();
                        openModal();
                        settitulo(search);
                    }}
                >
                    Search
                </Button>
            </div>
            <div>
                <div>{generateLinks()}</div>
                <p>Page: {`${currentPage}/${numPages}`}</p>
                <div
                    style={{
                        border: "1px solid rgba(0, 0, 0, 0.3)",
                        height: "750px",
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Viewer
                        initialPage={0}
                        onPageChange={(e) => {
                            handlePageChange(e.currentPage + 1);
                        }}
                        fileUrl={pdfUrl}
                        defaultScale={1.2}
                    />
                </div>
            </div>
        </div>
    );
};
