import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

if(!process.env.DATABASE.URL){
    throw new Error('DATABASE URL is not set');
}

export const pool = new pg.pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);