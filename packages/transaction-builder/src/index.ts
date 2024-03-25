import { TransactionBuilder as Batch } from './batch';
import { TransactionBuilder as Common } from './common';
import { TransactionBuilder as Compute } from './compute-unit';
import { TransactionBuilder as Mint } from './mint';
import { TransactionBuilder as PartialSign } from './partial-sign';
import { TransactionBuilder as PriorityFee } from './priority-fee';
import { TransactionBuilder as CalculateTxsize } from './calculate-txsize';
import { TransactionBuilder as RetryComputeUnit } from './retry-compute-unit';
import '~/types/global';
import '~/global';

export const TransactionBuilder = {
  ...Batch,
  ...CalculateTxsize,
  ...Common,
  ...Compute,
  ...Mint,
  ...PartialSign,
  ...PriorityFee,
  ...RetryComputeUnit,
};
