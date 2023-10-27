import { Result, Try } from '~/shared';
import { Node } from '~/node';
import { Keypair } from '@solana/web3.js';
import { Pubkey, Secret } from '~/types/account';
import { Instruction, MultisigInstruction } from '~/instruction';

export namespace Multisig {
  export const create = async (
    m: number,
    feePayer: Secret,
    signerPubkeys: Pubkey[],
  ): Promise<Result<Instruction, Error>> => {
    return Try(async () => {
      if (m > signerPubkeys.length) {
        throw Error('signers number less than m number');
      }

      const account = Keypair.generate();
      const connection = Node.getConnection();
      const balanceNeeded = await connection.getMinimumBalanceForRentExemption(
        MultisigInstruction.Layout.span,
      );

      const inst1 = MultisigInstruction.account(
        account,
        feePayer.toKeypair(),
        balanceNeeded,
      );

      const inst2 = MultisigInstruction.multisig(
        m,
        account,
        signerPubkeys.map((pubkey: Pubkey) => pubkey.toPublicKey()),
      );

      return new Instruction(
        [inst1, inst2],
        [account],
        feePayer.toKeypair(),
        account.publicKey.toString(),
      );
    });
  };
}