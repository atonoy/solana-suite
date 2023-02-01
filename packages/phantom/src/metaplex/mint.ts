import { Keypair, Transaction, TransactionInstruction } from '@solana/web3.js';
import { CreateNftBuilderParams } from '@metaplex-foundation/js';

import { Metaplex } from '@solana-suite/nft';
import { Storage } from '@solana-suite/storage';
import { debugLog, Node, Result, Try } from '@solana-suite/shared';
import {
  Bundlr,
  Validator,
  ValidatorError,
  InputNftMetadata,
  MetaplexNftMetaData,
} from '@solana-suite/shared-metaplex';
import { InitializeNftMint, Phantom } from '../types';

export namespace PhantomMetaplex {
  const createNftBuilder = async (
    params: CreateNftBuilderParams,
    phantom: Phantom
  ): Promise<InitializeNftMint> => {
    const metaplex = Bundlr.make(phantom);
    const payer = metaplex.identity();
    const useNewMint = Keypair.generate();
    const updateAuthority = metaplex.identity();
    const mintAuthority = metaplex.identity();
    const tokenOwner = metaplex.identity().publicKey;
    const instructions = await Metaplex.createNftBuilderInstruction(
      payer,
      params,
      useNewMint,
      updateAuthority,
      mintAuthority,
      tokenOwner
    );

    const transaction = new Transaction();
    transaction.feePayer = payer.publicKey;
    instructions.forEach((inst: TransactionInstruction) => {
      transaction.add(inst);
    });

    return { tx: transaction, useNewMint: useNewMint };
  };

  /**
   * Upload content and NFT mint
   *
   * @param {InputNftMetadata}  input
   * @param {Phantom} phantom        phantom wallet object
   * @return Promise<Result<Instruction, Error>>
   */
  export const mint = async (
    input: InputNftMetadata,
    cluster: string,
    phantom: Phantom
  ): Promise<Result<string, Error | ValidatorError>> => {
    return Try(async () => {
      const valid = Validator.checkAll<InputNftMetadata>(input);
      if (valid.isErr) {
        throw valid.error;
      }

      Node.changeConnection({ cluster });

      const uploaded = await Storage.uploadMetaContent(input, phantom);

      const { uri, sellerFeeBasisPoints, reducedMetadata } = uploaded;
      debugLog('# upload content url: ', uri);
      debugLog('# sellerFeeBasisPoints: ', sellerFeeBasisPoints);
      debugLog('# reducedMetadata: ', reducedMetadata);

      const mintInput: MetaplexNftMetaData = {
        uri,
        sellerFeeBasisPoints,
        ...reducedMetadata,
      };
      const connection = Node.getConnection();

      const builder = await createNftBuilder(mintInput, phantom);
      debugLog('# mint: ', builder.useNewMint.publicKey.toString());
      builder.tx.feePayer = phantom.publicKey;
      const blockhashObj = await connection.getLatestBlockhashAndContext();
      builder.tx.recentBlockhash = blockhashObj.value.blockhash;
      builder.tx.partialSign(builder.useNewMint);
      const signed = await phantom.signTransaction(builder.tx);
      debugLog(
        '# signed, signed.signatures: ',
        signed,
        signed.signatures.map((sig) => sig.publicKey.toString())
      );
      const sig = await connection.sendRawTransaction(signed.serialize());
      await Node.confirmedSig(sig);
      return builder.useNewMint.publicKey.toString();
    });
  };
}