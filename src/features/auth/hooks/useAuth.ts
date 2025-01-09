import type { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { login as loginAction } from "~/actions/hows-that";
import { COOKIE_OPTIONS } from "~/utils/constants";

type LoginCredentials = { email: string; password: string };

type UserAttributes = {
    userName: string | undefined;
    codeSap: string | undefined;
    token: string | undefined;
    applicationCookie: string | undefined;
};

type LoginResponse = {
    salesManCode: string;
    token: string;
    applicationCookie: string;
    message?: string;
};

const AUTH_STATE_CHANGE_EVENT = "authStateChange";
const COOKIE_KEYS = {
    userName: "userName",
    codeSap: "codeSap",
    token: "token",
    applicationCookie: "applicationCookie",
} as const;

const setCookies = (username: string, response: AxiosResponse) => {
    Cookies.set(COOKIE_KEYS.userName, username, COOKIE_OPTIONS);
    Cookies.set(
        COOKIE_KEYS.codeSap,
        response.data.salesManCode,
        COOKIE_OPTIONS,
    );
    Cookies.set(COOKIE_KEYS.token, response.data.token, COOKIE_OPTIONS);
    Cookies.set(
        COOKIE_KEYS.applicationCookie,
        response.data.applicationCookie,
        COOKIE_OPTIONS,
    );
};

const removeCookies = () => {
    for (const key of Object.values(COOKIE_KEYS)) {
        Cookies.remove(key);
    }
};

const getUserAttributes = (): UserAttributes => ({
    userName: Cookies.get(COOKIE_KEYS.userName),
    codeSap: Cookies.get(COOKIE_KEYS.codeSap),
    token: Cookies.get(COOKIE_KEYS.token),
    applicationCookie: Cookies.get(COOKIE_KEYS.applicationCookie),
});

const isAuthenticated = () => !!Cookies.get(COOKIE_KEYS.userName);
const userName = () => Cookies.get(COOKIE_KEYS.userName);

export const useAuth = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(
        async (credentials: LoginCredentials) => {
            setIsLoading(true);
            setError(null);
            try {
                const response = (await loginAction(
                    {
                        Email: credentials.email,
                        Password: credentials.password,
                    },
                    setError,
                )) as AxiosResponse<LoginResponse>;

                if (response.status !== 200)
                    throw new Error(response.data.message || "Login failed");

                setCookies(credentials.email, response);
                window.dispatchEvent(new Event(AUTH_STATE_CHANGE_EVENT));
                router.replace("/");
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "An unexpected error occurred";
                setError(message);
                throw new Error(message);
            } finally {
                setIsLoading(false);
            }
        },
        [router],
    );

    const logout = useCallback(() => {
        removeCookies();
        window.dispatchEvent(new Event(AUTH_STATE_CHANGE_EVENT));
        router.replace("/login");
    }, [router]);

    return {
        isAuthenticated,
        userName,
        login,
        logout,
        getUserAttributes,
        isLoading,
        error,
    };
};
