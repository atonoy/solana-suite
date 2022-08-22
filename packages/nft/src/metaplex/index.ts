export * from './internal/_mint';
export * from './royalty';

import { CreateNftInput } from '@metaplex-foundation/js';
import { PublicKey, Keypair } from '@solana/web3.js';
import { NftStorageMetadata, StorageNftStorage } from '../storage';
import { Instruction, Result } from '@solana-suite/shared';
import { StorageArweave } from '../storage';
import { MetaplexInternal_Mint } from './internal/_mint';
import { MetaplexRoyalty } from './royalty';
import { ValidatorError } from '../validator';

type noNeedOptional =
  | 'payer'
  | 'owner'
  | 'associatedTokenProgram'
  | 'tokenProgram'
  | 'confirmOptions';

export type MetaplexMetaData = Omit<CreateNftInput, noNeedOptional>;

export type NftStorageMetaplexMetadata = Omit<
  NftStorageMetadata,
  'seller_fee_basis_points'
> &
  Omit<MetaplexMetaData, 'uri' | 'sellerFeeBasisPoints'> & {
    name: string;
    symbol: string;
    royalty: number;
    filePath: string | File;
    storageType: 'arweave' | 'nftStorage';
  };

export namespace Metaplex {
  /**
   * Upload content and NFT mint
   *
   * @param {NftStorageMetaplexMetadata}  metadata
   * {
   *   name: string               // nft content name
   *   symbol: string             // nft ticker symbol
   *   filePath: string | File    // nft ticker symbol
   *   royalty: number            // royalty percentage
   *   description?: string       // nft content description
   *   external_url?: string      // landing page, home page uri, related url
   *   attributes?: JsonMetadataAttribute[]     // game character parameter, personality, characteristics
   *   properties?: JsonMetadataProperties<Uri> // include file name, uri, supported file type
   *   collection?: Collection                  // collections of different colors, shapes, etc.
   *   [key: string]: unknown                   // optional param, Usually not used.
   *   creators?: Creator[]          // other creators than owner
   *   uses?: Uses                   // usage feature: burn, single, multiple
   *   isMutable?: boolean           // enable update()
   *   maxSupply?: BigNumber         // mint copies
   *   mintAuthority?: Signer        // mint authority
   *   updateAuthority?: Signer      // update minted authority
   *   freezeAuthority?: PublicKey   // freeze minted authority
   * }
   * @param {PublicKey} owner        // first minted owner
   * @param {Keypair} feePayer       // fee payer
   * @return Promise<Result<Instruction, Error>>
   */
  export const mint = async (
    metadata: NftStorageMetaplexMetadata,
    owner: PublicKey,
    feePayer: Keypair
  ): Promise<Result<Instruction, Error | ValidatorError>> => {
    const data: Partial<NftStorageMetaplexMetadata> = metadata;
    if (data.royalty) {
      data.sellerFeeBasisPoints = MetaplexRoyalty.convertValue(data.royalty);
      // copied to sellerFeeBasisPoints, no need key
      delete data.royalty;
    }

    let storageRes;
    const { filePath, storageType, ...reducedMetadata } = data;
    if (storageType === 'arweave') {
      storageRes = (
        await StorageArweave.uploadContent(filePath!, feePayer)
      ).map(
        async (ok: string) => {
          reducedMetadata.image = ok;
          return await StorageArweave.uploadMetadata(reducedMetadata, feePayer);
        },
        (err: Error) => err
      );
    } else if (storageType === 'nftStorage') {
      storageRes = (await StorageNftStorage.uploadContent(filePath!)).map(
        async (ok: string) => {
          reducedMetadata.image = ok;
          return await StorageNftStorage.uploadMetadata(reducedMetadata);
        },
        (err: Error) => err
      );
    } else {
      return Result.err(Error('storageType is `arweave` or `nftStorage`'));
    }

    // if (storageType === 'arweave') {
    //     reducedMetadata.image = (
    //       await StorageArweave.uploadContent(filePath!, feePayer)
    //     ).unwrap();
    //     uri = (
    //       await StorageArweave.uploadMetadata(reducedMetadata, feePayer)
    //     ).unwrap();
    //   } else if (storageType === 'nftStorage') {
    //     reducedMetadata.image = (
    //       await StorageArweave.uploadContent(filePath!, feePayer)
    //     ).unwrap();
    //     uri = (await StorageNftStorage.uploadMetadata(reducedMetadata)).unwrap();
    //   } else {
    //     return Result.err(Error('storageType is `arweave` or `nftStorage`'));
    //   }

    console.log('###', storageRes.isErr);

    if (storageRes.isErr) {
      return Result.err(storageRes.error);
    }

    const uri = '';
    const mintInput: MetaplexMetaData = {
      uri,
      ...reducedMetadata,
    };

    return MetaplexInternal_Mint.create(mintInput, owner, feePayer);
  };
}
