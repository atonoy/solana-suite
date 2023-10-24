import { RegularNft as Burn } from './burn';
import { RegularNft as Find } from './find';
import { RegularNft as Freeze } from './freeze';
import { RegularNft as FeePayer } from './fee-payer-partial-sign-mint';
import { RegularNft as FeePayerTransfer } from './fee-payer-partial-sign-transfer';
import { RegularNft as Mint } from './mint';
import { RegularNft as Thaw } from './thaw';
import { RegularNft as Transfer } from './transfer';
import '~/types/instruction';
import '~/instruction';

export const RegularNft = {
  ...Burn,
  ...Find,
  ...Freeze,
  ...FeePayer,
  ...FeePayerTransfer,
  ...Mint,
  ...Thaw,
  ...Transfer,
};

export * from '~/shared/exports';