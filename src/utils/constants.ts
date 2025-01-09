import type { CookieAttributes } from "js-cookie";

export const USE_MOCK_DATA = false;
export const QUOTER_DB_SCHEMA = "quoter";
export const COOKIE_OPTIONS: CookieAttributes = {
    expires: 1 / 24, // 1 = 1 day, 1/24 = 1 hour. The auth token for How's That lasts 1 hour.
    path: "/",
};

export const ADMIN_USERS = [
    "halvarado@vassigroup.com",
    "jbeltran@vassigroup.com",
    "gvega@sigmaq.com"
];
