import { LedgerAccountRepository } from './account-repository.js';
import { LedgerEntryRepository } from './entry-repository.js';
import { LedgerBalanceReader } from './balance-reader.js';
import { LedgerOutbox } from './outbox.js';
import { LedgerService } from './ledger-service.js';

export function createLedger() {
  const accounts = new LedgerAccountRepository();
  const entries = new LedgerEntryRepository();
  const balances = new LedgerBalanceReader(entries);
  const outbox = new LedgerOutbox();
  return new LedgerService(accounts, entries, balances, outbox);
}
