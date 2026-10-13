import express from 'express';

import path from 'node:path';

import invoices from './invoice.route.ts';

import pool from './database.ts';

const app = express();

const dist = path.join(import.meta.dirname, '..', 'web', 'dist');

app.use((request, _response, next) => {
  console.log(`${request.method} ${request.url}`);
  next();
});

app.get('/api/health', async (_request, response) => {
  try {
    await pool.query('SELECT 1');

    response.status(200).json({
      status: 'ok',
      database: 'ok'
    });
  } catch (error) {
    console.error(error);

    response.status(500).json({
      status: 'ok',
      database: 'unavailable'
    })
  }

});

app.use('/api/invoices', invoices);

app.use(express.static(dist));

app.use((_request, response) => {
  response.status(404).json({ error: { message: 'Recurso não encontrado.' } });
});

app.listen(Number(process.env.PORT) || 3000);
