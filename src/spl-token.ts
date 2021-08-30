import {
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import {serialize} from 'borsh';

import {
  Account,
  LAMPORTS_PER_SOL,
  PublicKey,
  TransactionInstruction,
  TransactionSignature,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';

import {Util} from './util';
import {Transaction} from './transaction';

export namespace SplToken {

  const NFT_AMOUNT = 1;
  const NFT_DECIMAL = 0;

  interface CreateResponse {
    tokenId: string,
  }

  export const create = async (
    sourceSecret: string,
    totalAmount: number,
    decimal: number,
    authority: string = Util.createKeypair(sourceSecret).publicKey.toBase58(),
  ): Promise<CreateResponse> => {
    const connection = Util.getConnection();
    const signer = new Account(Util.createKeypair(sourceSecret).secretKey);
    const authorityPubKey = new PublicKey(authority);

    const token = await Token.createMint(
      connection,
      signer,
      authorityPubKey,
      null,
      decimal,
      TOKEN_PROGRAM_ID
    );

    const tokenAccount = await token.createAssociatedTokenAccount(signer.publicKey);

    await token.mintTo(
      tokenAccount,
      authorityPubKey,
      [],
      totalAmount,
    );

    return {tokenId: token.publicKey.toBase58()};
  }

  export const createNft = (
    sourceSecret: string,
    authority: string = Util.createKeypair(sourceSecret).publicKey.toBase58(),
  ): Promise<CreateResponse> => {
    return create(
      sourceSecret,
      NFT_AMOUNT,
      NFT_DECIMAL,
      authority
    );
  }

  export const transferNft = async (
    tokenId: string,
    sourceSecret: string,
    destPubkey: string,
    instruction?: TransactionInstruction
  ): Promise<TransactionSignature> => {
    return transfer(
      tokenId,
      sourceSecret,
      destPubkey,
      NFT_AMOUNT,
      instruction
    );
  }

  export const transfer = async (
    tokenId: string,
    sourceSecret: string,
    destination: string,
    amount: number,
    instruction?: TransactionInstruction
  ): Promise<TransactionSignature> => {
    const tokenPubkey = new PublicKey(tokenId);
    const destPubkey = new PublicKey(destination);
    const signer = Util.createKeypair(sourceSecret);
    const token = new Token(Util.getConnection(), tokenPubkey, TOKEN_PROGRAM_ID, signer);
    const sourceTokenAccount = (await token.getOrCreateAssociatedAccountInfo(signer.publicKey)).address;
    const destTokenAccount = (await token.getOrCreateAssociatedAccountInfo(destPubkey)).address;

    console.debug(`[sourceTokenAccount:${sourceTokenAccount.toBase58()}]=>[destTokenAccount:${destTokenAccount.toBase58()}]`);

    const param = Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      sourceTokenAccount,
      destTokenAccount,
      signer.publicKey,
      [],
      amount
    );

    const instructions = instruction ? new Array(param, instruction) : [param];
    const fn = await Transaction.send(
      signer.publicKey,
      [signer],
      destPubkey,
      amount,
    );
    return fn(instructions);
  }
}
