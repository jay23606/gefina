import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { after, before, mock, test } from 'node:test';
import express from 'express';

process.env.DATABASE_URL ??= 'postgres://localhost/gefina_test';

const { default: pool } = await import('./database.ts');
const { default: invoices } = await import('./invoice.route.ts');

const app = express();

app.use('/api/invoices', invoices);

let server: Server;
let baseUrl: string;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));

  const { port } = server.address() as AddressInfo;

  baseUrl = `http://127.0.0.1:${port}`;
});

after(() => {
  server.close();
  pool.end();
});

test('falha de consulta responde 500 em JSON sem detalhe técnico e registra o erro', async () => {
  const failure = new Error('connection refused');

  mock.method(pool, 'query', async () => {
    throw failure;
  });

  const logged: unknown[][] = [];

  mock.method(console, 'error', (...args: unknown[]) => {
    logged.push(args);
  });

  try {
    const response = await fetch(`${baseUrl}/api/invoices`);

    assert.equal(response.status, 500);
    assert.equal(response.headers.get('content-type'), 'application/json; charset=utf-8');
    assert.deepStrictEqual(await response.json(), {
      error: { message: 'Erro interno do servidor.' },
    });
    assert.equal(logged.length, 1);
    assert.ok(logged[0].includes(failure));
  } finally {
    mock.restoreAll();
  }
});
