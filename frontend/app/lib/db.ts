import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable could not be resolved.');
}
const sql = postgres(databaseUrl, { ssl: 'require' });

export default sql;
