import express from 'express';

import {
  findAllInvoices,
  findInvoiceById
} from './invoice.service.ts';

const routes = express.Router();

routes.get('/', async (_request, response) => {
  try {
    const invoices = await findAllInvoices();

    response.status(200).json(invoices);
  } catch (error) {
    console.error(error);

    response.status(500).json({ error: { message: 'Não foi possível carregar as faturas.' } });
  }
});

routes.get('/:id', async (request, response) => {
  try {
    const id = +request.params.id;

    const invoice = await findInvoiceById(id);

    if (!invoice) response.status(404).json({ error: { message: 'Fatura não encontrada.' } });

    response.status(200).json(invoice);
  } catch (error) {
    console.error(error);

    response.status(500).json({ error: { message: 'Não foi possível carregar a fatura.' } });
  }
});

export default routes;
