import express, { type NextFunction, type Request, type Response } from 'express';

import {
  findAllInvoices,
  findInvoiceById
} from './invoice.service.ts';

const routes = express.Router();

routes.get('/', async (_request, response) => {
  const invoices = await findAllInvoices();

  response.status(200).json(invoices);
});

routes.get('/:id', async (request, response) => {
  const id = +request.params.id;

  const invoice = await findInvoiceById(id);

  if (!invoice) response.status(404).json({ error: { message: 'Fatura não encontrada.' } });

  response.status(200).json(invoice);
});

routes.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  console.error(error);

  response.status(500).json({ error: { message: 'Erro interno do servidor.' } });
});

export default routes;
