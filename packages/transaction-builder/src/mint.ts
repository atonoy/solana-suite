import {
  ConfirmOptions,
  Keypair,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js';

import { Constants, debugLog, Result, Try } from '~/suite-utils';
import { Node } from '~/node';
import { TransactionBuilder as ComputeUnit } from './compute-unit';
import { TransactionBuilder as PriorityFee } from './priority-fee';
import { TransactionBuilder as RetryComputeUnit } from './retry-compute-unit';
import { MintStructure, SubmitOptions } from '~/types/transaction-builder';
import { Pubkey } from '~/types/account';

export namespace TransactionBuilder {
  export class Mint<T = Pubkey> implements MintStructure<T> {
    instructions: TransactionInstruction[];
    signers: Keypair[];
    feePayer: Keypair;
    data: T;

    constructor(
      instructions: TransactionInstruction[],
      signers: Keypair[],
      feePayer: Keypair,
      data: T,
    ) {
      this.instructions = instructions;
      this.signers = signers;
      this.data = data;
      this.feePayer = feePayer;
    }

    submit = async (
      options: Partial<SubmitOptions> = {},
    ): Promise<Result<TransactionSignature, Error>> => {
      return Try(async () => {
        if (!(this instanceof Mint)) {
          throw Error('only MintInstruction object that can use this');
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

        if (Node.getConnection().rpcEndpoint === Constants.EndPointUrl.prd) {
          debugLog('# Change metaplex cluster on mainnet-beta');
          Node.changeConnection({ cluster: Constants.Cluster.prdMetaplex });
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
