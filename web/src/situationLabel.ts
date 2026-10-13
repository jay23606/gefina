import type { InvoiceSituation } from './invoice.ts';

export default function situationLabel(situation: InvoiceSituation): string {
  return situation === 'paid' ? 'Paga' : situation === 'overdue' ? 'Atrasada' : 'Pendente';
}
