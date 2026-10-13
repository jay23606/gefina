import express from 'express';

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

export default routes;
