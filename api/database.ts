import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString)
  throw new Error('A variável de ambiente para conecção não está definida.');

const pool = new Pool({ connectionString });

export default pool;
