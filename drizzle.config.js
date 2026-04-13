import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { url } from 'inspector';


if(!process.env.DATABASE_URL){
    throw new Error('DATABASE URL is not set');
}
export default defineConfig({
    schema: "./src/db/schema.js",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    }
})