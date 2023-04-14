import { Metaplex as Mint } from './mint';
import { Metaplex as Find } from './find';
import { Metaplex as FeePayer } from './fee-payer-partial-sign-mint';
import { Metaplex as FeePayerTransfer } from './fee-payer-partial-sign-transfer';
import { Metaplex as Transfer } from './transfer';

export const Metaplex = {
  ...Mint,
  ...Find,
  ...FeePayer,
  ...FeePayerTransfer,
  ...Transfer,
};
