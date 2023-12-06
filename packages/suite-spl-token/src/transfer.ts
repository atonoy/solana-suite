import { createTransferCheckedInstruction } from '@solana/spl-token';
import { Result, Try } from '~/shared';
import { SplToken as Calculator } from './calculate-amount';
import { Account } from '~/account';
import { TransactionBuilder } from '~/transaction-builder';
import { Pubkey, Secret } from '~/types/account';
import { AuthorityOptions } from '~/types/shared';
import { CommonStructure } from '~/types/transaction-builder';

export namespace SplToken {
  export const transfer = async (
    mint: Pubkey,
    owner: Pubkey,
    dest: Pubkey,
    signers: Secret[],
    amount: number,
    mintDecimal: number,
    options: Partial<AuthorityOptions> = {},
  ): Promise<Result<CommonStructure, Error>> => {
    return Try(async () => {
      const payer = options.feePayer ? options.feePayer : signers[0];
      const keypairs = signers.map((s) => s.toKeypair());

      const sourceToken = await Account.Associated.retryGetOrCreate(
        mint,
        owner,
        payer,
      );

      const destToken = await Account.Associated.retryGetOrCreate(
        mint,
        dest,
        payer,
      );

      const inst = createTransferCheckedInstruction(
        sourceToken.toPublicKey(),
        mint.toPublicKey(),
        destToken.toPublicKey(),
        owner.toPublicKey(),
        Calculator.calculateAmount(amount, mintDecimal),
        mintDecimal,
        keypairs,
      );

      return new TransactionBuilder.Common([inst], keypairs, payer.toKeypair());
    });
  };
}
