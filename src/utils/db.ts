import * as sql from "mssql";
// import { USE_MOCK_DATA } from "./constants";

const sqlConfig = {
    server: "SPECIALTY-VM-DB",
    port: 1433,
    database: "catalogos",
    user: "sql_admin",
    password: "Sp3cialtyDB$2023",
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

// make a mock data pool that does not connect to the database

export const pool = await sql.connect(sqlConfig);
