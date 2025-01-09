"use client";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useRef, useState, useCallback } from "react";
import { useAuth } from "~/features/auth/hooks/useAuth";

export function Login() {
    const { login, isLoading, error } = useAuth();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handleLogin = useCallback(async () => {
        const email = usernameRef.current?.value || "";
        const password = passwordRef.current?.value || "";

        setEmailError(!email);
        setPasswordError(!password);

        if (!email || !password) {
            enqueueSnackbar("Please add a user and password", {
                variant: "error",
            });
            return;
        }

        try {
            await login({ email, password });
            enqueueSnackbar("Login successful", { variant: "success" });
        } catch (error) {
            enqueueSnackbar("Login failed", { variant: "error" });
        }
    }, [login]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                maxWidth: "25rem",
                margin: "auto",
                gap: "1rem",
            }}
        >
            <Typography variant="h2">Sign in</Typography>
            <TextField
                label="Email"
                inputRef={usernameRef}
                fullWidth
                error={emailError}
                helperText={emailError && "Email is required"}
            />
            <TextField
                label="Password"
                type="password"
                inputRef={passwordRef}
                fullWidth
                error={passwordError}
                helperText={passwordError && "Password is required"}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleLogin}
                fullWidth
                disabled={isLoading}
            >
                {isLoading ? <CircularProgress size={24} /> : "Sign in"}
            </Button>
            {error && <Alert severity="error">{error}</Alert>}
        </Box>
    );
}
