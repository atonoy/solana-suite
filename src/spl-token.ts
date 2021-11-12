import {
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';


import {
  Keypair,
  ParsedConfirmedTransaction,
  ParsedInstruction,
  PublicKey,
  TokenBalance,
  TransactionSignature,
  Signer,
} from '@solana/web3.js';

import {Transaction, Node, Result, Append, Instruction} from './';

export namespace SplToken {
  export interface TransferHistory {
    info: {
      destination: string,
      source: string,
      authority?: string,
      multisigAuthority?: string,
      signers?: string[],
      amount?: string,
      mint?: string,
      tokenAmount?: any[],
    },
    type: string,
    date: Date,
  }

  export interface TransferDestinationList {
    dest: PublicKey,
    date: Date,
  }

  enum TransactionStatus {
    Transfer = 'transfer',
    TransferChecked = 'transferChecked',
  }

  const isTransfer = (value: ParsedInstruction) => {
    if (value.program === 'spl-token') {
      switch (value.parsed.type) {
        case TransactionStatus.Transfer:
        case TransactionStatus.TransferChecked:
          return true;
        default:
          return false;
      }
    } else {
      return false;
    }
  }

  const convertTimestmapToDate = (blockTime: number): Date =>
    new Date(blockTime * 1000);

  export const subscribeAccount = (
    pubkey: PublicKey,
    callback: any
  ): number => {
    return Node.getConnection().onAccountChange(pubkey, async () => {
      const res = await SplToken.getTransferHistory(pubkey, 1);
      if (res.isErr) return res;
      callback((res.value as TransferHistory[])[0]);
    });
  }

  export const unsubscribeAccount = (subscribeId: number)
    : Promise<void> =>
    Node.getConnection().removeAccountChangeListener(subscribeId);


  export const getTransferHistory = async (
    pubkey: PublicKey,
    limit?: number
  ): Promise<Result<TransferHistory[], Error>> => {
    const transactions = await Transaction.getAll(pubkey, limit);

    if (transactions.isErr) return transactions as Result<[], Error>;

    const hist: TransferHistory[] = [];
    for (const tx of transactions.unwrap() as ParsedConfirmedTransaction[]) {
      for (const inst of tx.transaction.message.instructions) {
        const value = inst as ParsedInstruction;
        if (isTransfer(value)) {
          const v: TransferHistory = value.parsed;
          v.date = convertTimestmapToDate(tx.blockTime as number);
          hist.push(v);
        }
      }
    }
    return Result.ok(hist);
  }

  export const getTransferDestinationList = async (
    pubkey: PublicKey
  ): Promise<Result<TransferDestinationList[], Error>> => {
    const transactions = await Transaction.getAll(pubkey);

    if (transactions.isErr) return Result.err(transactions.error);

    const hist: TransferDestinationList[] = [];
    for (const tx of transactions.unwrap() as ParsedConfirmedTransaction[]) {
      const posts = tx.meta?.postTokenBalances as TokenBalance[];
      if (posts.length > 1) {
        posts.forEach((p) => {
          const amount = p!.uiTokenAmount!.uiAmount as number;
          if (amount > 0) {
            const index = p.accountIndex;
            const dest = tx.transaction.message.accountKeys[index].pubkey;
            const date = convertTimestmapToDate(tx.blockTime as number);
            const v: TransferDestinationList = {dest, date};
            hist.push(v);
          }
        });
      }
    }
    return Result.ok(hist);
  }

  export const mint = (
    source: PublicKey,
    signers: Keypair[],
    totalAmount: number,
    mintDecimal: number,
  ) => async (append?: Append.Value)
      : Promise<Result<string, Error>> => {
      const tokenRes = await Token.createMint(
        Node.getConnection(),
        signers[0],
        source,
        null,
        mintDecimal,
        TOKEN_PROGRAM_ID
      )
        .then(Result.ok)
        .catch(Result.err);

      if (tokenRes.isErr) return Result.err(tokenRes.error);
      const token = tokenRes.value;

      // Check comformability of fee payer
      if (append?.feePayer) {
        if (!Append.isInFeePayer(append.feePayer, signers))
          return Result.err(Error('Not found fee payer secret key in signers'));
        token.payer = Append.extractFeePayerKeypair(
          signers,
          append?.feePayer,
        )[0];
      }

      // Check comformability of multiSig
      let authority = source;
      append?.multiSig && (authority = append.multiSig);

      const tokenAssociated =
        await token.getOrCreateAssociatedAccountInfo(source)
          .then(Result.ok)
          .catch(Result.err);

      if (tokenAssociated.isErr) return Result.err(tokenAssociated.error);

      const res = await token.mintTo(
        tokenAssociated.value.address,
        authority,
        signers,
        totalAmount,
      )
        .then(Result.ok)
        .catch(Result.err);

      return (res as Result<string, Error>).chain(
        (_value: string) => Result.ok(token.publicKey.toBase58()),
        (error: Error) => Result.err(error)
      );
    }

  export const transfer2 = async (
    tokenKey: PublicKey,
    owner: PublicKey,
    dest: PublicKey,
    signers: Signer[],
    amount: number,
    mintDecimal: number,
    feePayer?: Signer,
  ) => {
    // : Promise<Result<TransactionSignature, Error>> => {

    const match = signers.filter(s => owner.toBase58() === s.publicKey.toBase58());
    if (match.length === 0)
      return (Result.err(Error('Not found signer of owner in signers param')));

    const ownerSigner = match[0];
    const token = new Token(
      Node.getConnection(),
      tokenKey,
      TOKEN_PROGRAM_ID,
      ownerSigner);

    const sourceToken = await token.getOrCreateAssociatedAccountInfo(owner)
      .then(Result.ok)
      .catch(Result.err);

    if (sourceToken.isErr) return Result.err(sourceToken.error);

    const destToken = await token.getOrCreateAssociatedAccountInfo(dest)
      .then(Result.ok)
      .catch(Result.err);

    if (destToken.isErr) return Result.err(destToken.error);

      const instruction = Token.createTransferCheckedInstruction(
        TOKEN_PROGRAM_ID,
        sourceToken.value.address,
        tokenKey,
        destToken.value.address,
        owner,
        signers,
        amount,
        mintDecimal
      );

      return new Instruction(
        [instruction],
        signers,
        feePayer
      );
  }

  export const transfer = (
    tokenKey: PublicKey,
    source: PublicKey,
    dest: PublicKey,
    signers: Keypair[],
    amount: number,
    mintDecimal: number,
  ) => async (append?: Append.Value)
      : Promise<Result<TransactionSignature, Error>> => {
      const token = new Token(
        Node.getConnection(),
        tokenKey,
        TOKEN_PROGRAM_ID,
        signers[0]);
      const sourceToken = await token.getOrCreateAssociatedAccountInfo(source)
        .then(Result.ok)
        .catch(Result.err);

      if (sourceToken.isErr) return Result.err(sourceToken.error);

      const destToken = await token.getOrCreateAssociatedAccountInfo(dest)
        .then(Result.ok)
        .catch(Result.err);

      if (destToken.isErr) return Result.err(destToken.error);

      const param = Token.createTransferCheckedInstruction(
        TOKEN_PROGRAM_ID,
        sourceToken.value.address,
        tokenKey,
        destToken.value.address,
        source,
        signers,
        amount,
        mintDecimal
      );

      const instructions =
        append?.txInstructions
          ? new Array(append.txInstructions, [param]).flat()
          : [param];
      return Transaction.send(
        source,
        dest,
        signers,
        amount,
      )(
        {
          feePayer: append?.feePayer,
          txInstructions: instructions
        }
      );
    }
}
