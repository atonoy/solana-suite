import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  TransactionInstruction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';

import bs from 'bs58';

import {Transaction, Constants, Node, Result} from './';

export namespace Wallet {

  type Unit = 'sol' | 'lamports';

  export interface KeypairStr {
    pubkey: string,
    secret: string
  }

  export const DEFAULT_AIRDROP_AMOUNT = LAMPORTS_PER_SOL * 1;
  export const MAX_AIRDROP_SOL = LAMPORTS_PER_SOL * 5;

  export const getBalance = async (
    pubkey: PublicKey,
    unit: Unit = 'sol'
  ): Promise<Result<number, Error>> => {
    const balance = await Node.getConnection().getBalance(pubkey)
      .then(Result.ok)
      .catch(Result.err);

    if (balance.isErr) return balance;

    switch (unit) {
      case 'sol': return Result.ok((balance.value) / LAMPORTS_PER_SOL);
      case 'lamports': return balance;
      default: return Result.err(Error('no match unit'));
    }
  };

  export const requestAirdrop = async (
    pubkey: PublicKey,
    airdropAmount: number = DEFAULT_AIRDROP_AMOUNT
  ): Promise<Result<string, Error>> => {
    console.debug('Now airdropping...please wait');

    if (airdropAmount > MAX_AIRDROP_SOL)
      return Result.err(Error(`Over max airdrop amount: ${airdropAmount}`))

    const sig = await Node.getConnection().requestAirdrop(pubkey, airdropAmount)
      .then(Result.ok)
      .catch(Result.err);

    if (sig.isErr) return Result.err(Error('Failed airdrop'));
    await Transaction.confirmedSig(sig.value);
    return Result.ok('success');
  }

  export const create = (): KeypairStr => {
    const keypair = Keypair.generate();
    return {
      pubkey: keypair.publicKey.toBase58(),
      secret: bs.encode(keypair.secretKey)
    };
  };

  export const findAssocaiatedTokenAddress = async (
    source: PublicKey,
    tokenKey: PublicKey
  ): Promise<Result<PublicKey, Error>> => {
    return await PublicKey.findProgramAddress(
      [
        source.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenKey.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
      .then(v => Result.ok(v[0]))
      .catch(Result.err);
  }

  export const findMetaplexAssocaiatedTokenAddress = async (
    tokenKey: PublicKey
  ): Promise<Result<PublicKey, Error>> => {
    return await PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        Constants.METAPLEX_PROGRAM_ID.toBuffer(),
        tokenKey.toBuffer(),
      ],
      Constants.METAPLEX_PROGRAM_ID,
    )
      .then(v => Result.ok(v[0]))
      .catch((e: Error) => Result.err(e))
  }

  export const createAssociatedTokenAccountInstruction = (
    associatedToken: PublicKey,
    payer: PublicKey,
    source: PublicKey,
    mintKey: PublicKey,
  ) => {
    const keys = [
      {
        pubkey: payer,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: associatedToken,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: source,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: mintKey,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
    ];
    return new TransactionInstruction({
      keys,
      programId: ASSOCIATED_TOKEN_PROGRAM_ID,
      data: Buffer.from([]),
    });
  }
}
