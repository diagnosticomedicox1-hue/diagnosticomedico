const { createClient } = require("@libsql/client/http");
require("dotenv").config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log("URL:", url);
console.log("Token length:", authToken ? authToken.length : 0);

const client = createClient({
    url,
    authToken,
});

async function main() {
    try {
        const result = await client.execute("SELECT * FROM consultas ORDER BY fecha DESC");
        console.log("Query successful:", result.rows);
    } catch (error) {
        console.error("Query failed:", error);
    }
}

main();
