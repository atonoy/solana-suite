import {
  ConfirmOptions,
  Transaction,
  TransactionSignature,
} from '@solana/web3.js';

import { Constants, Result, Try } from '~/suite-utils';
import { Node } from '~/node';
import { Pubkey } from '~/types/account';
import {
  PartialSignStructure,
  SubmitOptions,
} from '~/types/transaction-builder';
import { TransactionBuilder as RetryComputeUnit } from './retry-compute-unit';

export namespace TransactionBuilder {
  export class PartialSign implements PartialSignStructure {
    hexInstruction: string;
    data?: Pubkey;

    constructor(instructions: string, mint?: Pubkey) {
      this.hexInstruction = instructions;
      this.data = mint;
    }

    submit = async (
      options: Partial<SubmitOptions> = {},
    ): Promise<Result<TransactionSignature, Error>> => {
      return Try(async () => {
        if (!(this instanceof PartialSign)) {
          throw Error('only PartialSignInstruction object that can use this');
        }

        if (!options.feePayer) {
          throw Error('Need feePayer');
        }

        const decode = Buffer.from(this.hexInstruction, 'hex');
        const transaction = Transaction.from(decode);
        const confirmOptions: ConfirmOptions = {
          maxRetries: Constants.MAX_TRANSACTION_RETRIES,
        };

        try {
          transaction.partialSign(options.feePayer.toKeypair());
          const wireTransaction = transaction.serialize();
          return await Node.getConnection().sendRawTransaction(
            wireTransaction,
            confirmOptions,
          );
        } catch (error) {
          if (RetryComputeUnit.RetryComputeUnit.isError(error)) {
            return await RetryComputeUnit.RetryComputeUnit.submitForPartialSign(
              transaction,
              options.feePayer.toKeypair(),
              confirmOptions,
            );
          }
          throw error;
        }
      });
    };
  }
}
