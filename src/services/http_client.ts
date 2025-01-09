import axios from "axios";
//const URL_BASE = process.env.NODE_ENV === "development"? 'http://localhost:4000/api': 'https://tdw-api.vercel.app/api';
//const URL_BASE = process.env.NODE_ENV === "development"? 'http://localhost:4000/api': 'http://74.249.176.50:4000/api';

const URL_BASE = "/api";

const instance = axios.create({
    // biome-ignore lint/style/useNamingConvention: from axios library
    baseURL: URL_BASE,
    timeout: 20000,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
            "GET, PUT, POST, DELETE, PATCH, OPTIONS",
        "X-Custom-Header": "foobar",
        "Content-Type": "application/json",
        methods: "GET,PUT,POST,DELETE",
    },
});


export default instance;
