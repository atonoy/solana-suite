import { Result, Secret } from '@solana-suite/shared';
import {
  _InputNftMetadata,
  StorageMetadata,
  StorageType,
} from '@solana-suite/shared-metaplex';

//todo: replaced
import { MetaplexFileContent } from '@metaplex-foundation/js';

import { Arweave } from './arweave';
import { NftStorage } from './nft-storage';

export namespace Storage {
  export const toConvertNftStorageMetadata = (
    input: _InputNftMetadata,
    sellerFeeBasisPoints: number
  ): StorageMetadata => {
    const data = {
      name: input.name,
      symbol: input.symbol,
      description: input.description,
      seller_fee_basis_points: sellerFeeBasisPoints,
      external_url: input.external_url,
      attributes: input.attributes,
      properties: input.properties,
      image: '',
      options: input.options,
    };
    return data;
  };

  export const uploadContent = async (
    filePath: MetaplexFileContent,
    storageType: StorageType,
    feePayer?: Secret
  ): Promise<Result<string, Error>> => {
    if (storageType === 'arweave') {
      if (!feePayer) {
        throw Error('Arweave needs to have feepayer');
      }
      return await Arweave.uploadContent(filePath, feePayer);
    } else if (storageType === 'nftStorage') {
      return await NftStorage.uploadContent(filePath);
    } else {
      throw Error('Not found storageType');
    }
  };

  export const uploadMetaContent = async (
    input: StorageMetadata,
    filePath: MetaplexFileContent,
    storageType: StorageType,
    feePayer?: Secret
  ): Promise<Result<string, Error>> => {
    let storage;
    if (storageType === 'arweave') {
      if (!feePayer) {
        throw Error('Arweave needs to have feepayer');
      }
      storage = await (
        await Arweave.uploadContent(filePath, feePayer)
      ).unwrap(
        async (ok: string) => {
          input.image = ok;
          return await Arweave.uploadMetadata(input, feePayer);
        },
        (err: Error) => {
          throw err;
        }
      );
    } else if (storageType === 'nftStorage') {
      storage = await (
        await NftStorage.uploadContent(filePath)
      ).unwrap(
        async (ok: string) => {
          input.image = ok;
          console.log('#input.image: ', input);
          return await NftStorage.uploadMetadata(input);
        },
        (err: Error) => {
          throw err;
        }
      );
    } else {
      throw Error('No match storageType');
    }

    console.log('#storage: ', storage);
    if (!storage) {
      throw Error('Empty storage object');
    }
    return storage;
  };
}
