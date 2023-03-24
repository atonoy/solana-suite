import { TransactionInstruction, PublicKey, Keypair } from '@solana/web3.js';

import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToCheckedInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import {
  Result,
  debugLog,
  Try,
  MintInstruction,
  Secret,
  KeypairAccount,
  Pubkey,
} from '@solana-suite/shared';

import { Storage } from '@solana-suite/storage';

import {
  Validator,
  InputNftMetadata,
  _InputNftMetadata,
  _MetaplexNftMetaData,
  Creators,
  Collections,
  Properties,
  Pda,
  Royalty,
} from '@solana-suite/shared-metaplex';

import {
  createCreateMetadataAccountV2Instruction,
  createCreateMasterEditionV3Instruction,
  DataV2,
} from '@metaplex-foundation/mpl-token-metadata';
export namespace Metaplex {
  export const createMintInstructions = async (
    mint: PublicKey,
    owner: PublicKey,
    nftMetadata: DataV2,
    feePayer: PublicKey,
    isMutable: boolean
  ): Promise<TransactionInstruction[]> => {
    let ata = await getAssociatedTokenAddress(mint, owner);
    let tokenMetadataPubkey = Pda.getMetadata(mint);
    let masterEditionPubkey = Pda.getMasterEdition(mint);

    const inst1 = createInitializeMintInstruction(mint, 0, owner, owner);

    const inst2 = createAssociatedTokenAccountInstruction(
      feePayer,
      ata,
      owner,
      mint
    );

    const inst3 = createMintToCheckedInstruction(mint, ata, feePayer, 1, 0);

    const inst4 = createCreateMetadataAccountV2Instruction(
      {
        metadata: tokenMetadataPubkey,
        mint,
        mintAuthority: owner,
        payer: feePayer,
        updateAuthority: owner,
      },
      {
        createMetadataAccountArgsV2: {
          data: nftMetadata,
          isMutable,
        },
      }
    );

    const inst5 = createCreateMasterEditionV3Instruction(
      {
        edition: masterEditionPubkey,
        mint,
        updateAuthority: owner,
        mintAuthority: owner,
        payer: feePayer,
        metadata: tokenMetadataPubkey,
      },
      {
        createMasterEditionArgs: {
          maxSupply: 0,
        },
      }
    );
    return [inst1, inst2, inst3, inst4, inst5];
  };

  /**
   * Upload content and NFT mint
   *
   * @param {Pubkey} owner          // first minted owner
   * @param {Secret} signer         // owner's Secret
   * @param {NftMetadata}  input
   * {
   *   name: string               // nft content name
   *   symbol: string             // nft ticker symbol
   *   filePath: string | File    // nft ticker symbol
   *   royalty: number            // royalty percentage
   *   storageType: 'arweave'|'nftStorage' // royalty percentage
   *   description?: string       // nft content description
   *   external_url?: string      // landing page, home page uri, related url
   *   attributes?: MetadataAttribute[]     // game character parameter, personality, characteristics
   *   properties?: MetadataProperties<Uri> // include file name, uri, supported file type
   *   collection?: Pubkey           // collections of different colors, shapes, etc.
   *   [key: string]?: unknown       // optional param, Usually not used.
   *   creators?: InputCreators[]          // other creators than owner
   *   uses?: Uses                   // usage feature: burn, single, multiple
   *   isMutable?: boolean           // enable update()
   *   maxSupply?: BigNumber         // mint copies
   * }
   * @param {Secret} feePayer?       // fee payer
   * @return Promise<Result<Instruction, Error>>
   */
  export const mint = async (
    owner: Pubkey,
    signer: Secret,
    input: InputNftMetadata,
    feePayer?: Pubkey
  ): Promise<Result<MintInstruction, Error>> => {
    return Try(async () => {
      const valid = Validator.checkAll<InputNftMetadata>(input);
      if (valid.isErr) {
        throw valid.error;
      }

      const payer = feePayer ? feePayer : signer;

      //Convert creators
      const creators = Creators.toInputConvert(input.creators);
      debugLog('# creators: ', creators);

      //Convert collection
      const collection = Collections.toInputConvert(input.collection);
      debugLog('# collection: ', collection);

      //Convert porperties, Upload content
      const properties = await Properties.toInputConvert(
        input.properties,
        Storage.uploadContent,
        input.storageType,
        feePayer
      );
      debugLog('# properties: ', properties);

      const overwrited = {
        ...input,
        creators,
        collection,
        properties,
      } as _InputNftMetadata;

      const sellerFeeBasisPoints = Royalty.convert(overwrited.royalty);
      const nftStorageMetadata = Storage.toConvertNftStorageMetadata(
        overwrited,
        sellerFeeBasisPoints
      );
      const uri = await Storage.uploadMetaContent(
        nftStorageMetadata,
        overwrited.filePath,
        payer
      );

      debugLog('# upload content url: ', uri);
      debugLog('# sellerFeeBasisPoints: ', sellerFeeBasisPoints);

      const mint = KeypairAccount.create();
      const insts = await createMintInstructions(
        mint.toPublicKey(),
        owner.toPublicKey(),
        input as any,
        payer.toPublicKey(),
        input.isMutable || true
      );
      return new MintInstruction(
        insts,
        [signer.toKeypair(), mint.toKeypair()],
        payer.toKeypair(),
        mint.pubkey
      );
    });
  };
}
