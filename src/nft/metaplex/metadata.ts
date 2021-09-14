import {
  PublicKey,
  TransactionInstruction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  AccountInfo,
} from '@solana/web3.js';

import {serialize} from 'borsh';

import {Wallet} from '../../wallet';
import {Transaction} from '../../transaction';
import {Constants} from '../../constants';
import {MetaplexObject} from './object';
import {MetaplexSerialize} from './serialize';
import {Util} from '../../util';
import {Token} from '@solana/spl-token';

export namespace MetaplexMetaData {
  const TOKEN_PROGRAM_ID = new PublicKey(Constants.SPL_TOKEN_PROGRAM_ID);
  const METADATA_PROGRAM_ID = new PublicKey(Constants.METAPLEX_PROGRAM_ID);

  const fetchMetaDataByMintKey = (mintKey: string, encoded: AccountInfo<string>) => {
    if (!encoded) return false;
    const decodeData = MetaplexSerialize.decode(encoded.data);
    return mintKey === decodeData.mintKey
  }

  export const getByMintKey = async (mintKey: string) => {
    const accounts = await Transaction.getProgramAccounts(Constants.METAPLEX_PROGRAM_ID);
    const matches = accounts.filter(a => fetchMetaDataByMintKey(mintKey, a.account));
    return MetaplexSerialize.decode(matches[0].account.data);
  }

  // owner => recipet
  export const getByOwner = async (ownerPubKey: string) => {
    // Get all token by owner
    const tokens = await Util.getConnection().getParsedTokenAccountsByOwner(
      new PublicKey(ownerPubKey),
      {programId: TOKEN_PROGRAM_ID}
    );

    const matches:Array<any> = [];

    // Filter only metaplex nft
    for (let i = 0; i < tokens.value.length; i++) {
      const token = tokens.value[i];
      // Get metalex account
      const metaAccount = (await Wallet.findMetaplexAssocaiatedTokenAddress(
        token.account.data.parsed.info.mint)
      ).toBase58();

      // get rent data in a metaAccount
      const nfts = await Util.getConnection().getParsedAccountInfo(
        new PublicKey(metaAccount)
      );
      if (nfts?.value?.data) {
        const data = nfts.value.data as Buffer;
        matches.push(MetaplexSerialize.decode2(data));
      }
    };
    return matches;
  }

  export const create = (
    data: MetaplexObject.Data,
    mintKey: string,
    payer: string,
    mintAuthorityKey = payer,
    updateAuthority = payer,
  ) => async (instructions?: TransactionInstruction[]) => {
    let inst: TransactionInstruction[] = [];
    inst = instructions ? instructions : inst;
    const metaAccount = (await Wallet.findMetaplexAssocaiatedTokenAddress(mintKey)).toBase58();

    console.log('# metaAccount', metaAccount);

    const value = new MetaplexObject.CreateMetadataArgs({data, isMutable: true});
    const txnData = Buffer.from(serialize(MetaplexObject.SCHEMA, value));
    const keys = [
      {
        pubkey: new PublicKey(metaAccount),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: new PublicKey(mintKey),
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: new PublicKey(mintAuthorityKey),
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: new PublicKey(payer),
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: new PublicKey(updateAuthority),
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
    ];
    inst.push(
      new TransactionInstruction({
        keys,
        programId: METADATA_PROGRAM_ID,
        data: txnData,
      })
    );
    return inst;
  }

  export const update = (
    data: MetaplexObject.Data | undefined,
    newUpdateAuthority: string | undefined,
    primarySaleHappened: boolean | null | undefined,
    mintKey: string,
    updateAuthority: string,
    recipientKey: string, // todo:
    sourceSecret: string,
  ) => async (instructions?: TransactionInstruction[]) => {
    let inst: TransactionInstruction[] = [];
    inst = instructions ? instructions : inst;

    const associatedTokenAccount = await Wallet.findAssocaiatedTokenAddress(updateAuthority, mintKey);
    console.log('# associatedTokenAccount: ', associatedTokenAccount.toBase58());

    inst.push(
      Wallet.createAssociatedTokenAccountInstruction(
        associatedTokenAccount.toBase58(),
        updateAuthority,
        updateAuthority,
        mintKey
      )
    );

    inst.push(
      Token.createMintToInstruction(
        TOKEN_PROGRAM_ID,
        new PublicKey(mintKey),
        associatedTokenAccount,
        new PublicKey(updateAuthority),
        [Util.createKeypair(sourceSecret)],
        1,
      ),
    );

    const metaAccount = (await Wallet.findMetaplexAssocaiatedTokenAddress(mintKey)).toBase58();

    const value = new MetaplexObject.UpdateMetadataArgs({
      data,
      updateAuthority: !newUpdateAuthority ? undefined : newUpdateAuthority,
      primarySaleHappened:
        primarySaleHappened === null || primarySaleHappened === undefined
          ? null
          : primarySaleHappened,
    });
    const txnData = Buffer.from(serialize(MetaplexObject.SCHEMA, value));
    const keys = [
      {
        pubkey: new PublicKey(metaAccount),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: new PublicKey(updateAuthority),
        isSigner: true,
        isWritable: false,
      },
    ];
    inst.push(
      new TransactionInstruction({
        keys,
        programId: new PublicKey(METADATA_PROGRAM_ID),
        data: txnData,
      }),
    );
    return inst;
  }
}
