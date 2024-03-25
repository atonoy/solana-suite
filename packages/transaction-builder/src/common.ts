import {
  ConfirmOptions,
  Keypair,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js';

import { Node } from '~/node';
import { Constants, Result, Try } from '~/suite-utils';
import { CommonStructure, SubmitOptions } from '~/types/transaction-builder';
import { TransactionBuilder as PriorityFee } from './priority-fee';
import { TransactionBuilder as ComputeUnit } from './compute-unit';
import { TransactionBuilder as RetryComputeUnit } from './retry-compute-unit';

export namespace TransactionBuilder {
  export class Common<T = undefined> implements CommonStructure<T> {
    static MAX_TRANSACTION_SIZE = 1232;

    instructions: TransactionInstruction[];
    signers: Keypair[];
    feePayer?: Keypair;
    data?: T;

    constructor(
      instructions: TransactionInstruction[],
      signers: Keypair[],
      feePayer?: Keypair,
      data?: T,
    ) {
      this.instructions = instructions;
      this.signers = signers;
      this.feePayer = feePayer;
      this.data = data;
    }

    submit = async (
      options: Partial<SubmitOptions> = {},
    ): Promise<Result<TransactionSignature, Error>> => {
      return Try(async () => {
        if (!(this instanceof Common)) {
          throw Error('only Instruction object that can use this');
        }
        const transaction = new Transaction();

        const blockhashObj = await Node.getConnection().getLatestBlockhash();
        transaction.lastValidBlockHeight = blockhashObj.lastValidBlockHeight;
        transaction.recentBlockhash = blockhashObj.blockhash;
        let finalSigners = this.signers;

        if (this.feePayer) {
          transaction.feePayer = this.feePayer.publicKey;
          finalSigners = [this.feePayer, ...this.signers];
        }

        if (options.isPriorityFee) {
          this.instructions.unshift(
            await PriorityFee.PriorityFee.createInstruction(
              this.instructions,
              options.addSolPriorityFee,
              finalSigners[0],
            ),
          );
        }

        this.instructions.unshift(
          await ComputeUnit.ComputeUnit.createInstruction(
            this.instructions,
            finalSigners[0],
          ),
        );

        this.instructions.forEach((inst) => transaction.add(inst));

        const confirmOptions: ConfirmOptions = {
          maxRetries: Constants.MAX_TRANSACTION_RETRIES,
        };
        try {
          return await sendAndConfirmTransaction(
            Node.getConnection(),
            transaction,
            finalSigners,
            confirmOptions,
          );
        } catch (error) {
          if (RetryComputeUnit.RetryComputeUnit.isError(error)) {
            return await RetryComputeUnit.RetryComputeUnit.submit(
              transaction,
              finalSigners,
              confirmOptions,
            );
          }
          throw error;
        }
      });
    };
  }
}
