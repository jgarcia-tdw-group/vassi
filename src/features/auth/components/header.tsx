// components/Header.tsx
"use client";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import {
    AppBar,
    Box,
    CircularProgress,
    IconButton,
    Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigation } from "./navigation";

export function Header() {
    const { isAuthenticated, userName, logout, isLoading, error } = useAuth();

    const navigation = {
        // login: "/login",
        displays: {
            Displays: "/displays",
            Dashboard: "/displays/dashboard",
        },
        packages: {
            Packages: "/packages",
            Dashboard: "/packages/dashboard",
        },
    };

    useEffect(() => {
        if (error) {
            enqueueSnackbar((error as unknown as Error).message, {
                variant: "error",
            });
            console.error(error);
        }
    }, [error]);

    return (
        <header style={{ marginBottom: "4rem" }}>
            <AppBar position="fixed" sx={{ height: "3rem" }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: "100%",
                        px: 2,
                    }}
                >
                    <Navigation links={navigation} />
                    {isLoading ? (
                        <CircularProgress color="inherit" size={24} />
                    ) : isAuthenticated() && userName() ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <AccountCircleIcon sx={{ mr: 1 }} />
                            <Typography variant="body1" sx={{ mr: 2 }}>
                                Hello, {userName()}
                            </Typography>
                            <IconButton
                                color="inherit"
                                onClick={logout}
                                size="small"
                            >
                                <LogoutIcon />
                            </IconButton>
                        </Box>
                    ) : null}
                </Box>
            </AppBar>
        </header>
    );
}
