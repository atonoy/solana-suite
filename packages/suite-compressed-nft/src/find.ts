import { Converter } from '~/converter';
import { DasApi } from '~/das-api';
import { debugLog, Result, Try } from '~/shared';
import { Offchain } from '~/types/storage';
import { NftMetadata, Metadata } from '~/types/nft';
import { FindOptions } from '~/types/find';

export namespace CompressedNft {
  /**
   * Find nft by owner address
   *
   * @param {Pubkey} owner
   * @param {Partial<FindOptions>} options
   * @return Promise<Result<CompressedNftMetadata, Error>>
   */
  export const findByOwner = async (
    owner: Pubkey,
    options: Partial<FindOptions> = {},
  ): Promise<Result<NftMetadata, Error>> => {
    return Try(async () => {
      const defaultOptions = {
        limit: 1000,
        page: 1,
        sortBy: DasApi.defaultSortBy,
      };
      const { limit, page, sortBy, before, after } = {
        ...defaultOptions,
        ...options,
      };

      const assets = await DasApi.getAssetsByOwner(
        owner,
        limit,
        page,
        sortBy,
        before,
        after,
      );
      if (assets.isErr) {
        throw assets.error;
      }

      const items = assets.value.items;

      const metadatas = await Promise.all(
        items
          .filter((item) => item.compression.compressed === true)
          .map(async (item) => {
            try {
              const offchain: Offchain = await DasApi.fetchOffchain(
                item.content.json_uri,
              );
              const merged = {
                onchain: item,
                offchain: offchain,
              };
              return Converter.Nft.intoUser(merged);
            } catch (err) {
              debugLog('# Failed fetch offchain url: ', item.content.json_uri);
              return Converter.Nft.intoUser({
                onchain: item,
                offchain: {},
              });
            }
          }),
      );
      return {
        page: assets.value.page,
        total: assets.value.total,
        limit: assets.value.limit,
        metadatas,
      };
    });
  };

  /**
   * Find nft by mint address
   *
   * @param {Pubkey} mint
   * @return Promise<Result<NftMetadata, Error>>
   */
  export const findByMint = async (
    mint: Pubkey,
  ): Promise<Result<Metadata, Error>> => {
    return Try(async () => {
      const asset = await DasApi.getAsset(mint);
      if (asset.isErr) {
        throw asset.error;
      }

      const offchain: Offchain = await DasApi.fetchOffchain(
        asset.value.content.json_uri,
      );
      const merged = {
        onchain: asset.value,
        offchain: offchain,
      };
      return Converter.Nft.intoUser(merged);
    });
  };

  /**
   * Find nft by collection mint
   *
   * @param {Pubkey} collectionMint
   * @param {Partial<FindOptions>} options
   * @return Promise<Result<CompressedNftMetadata, Error>>
   */
  export const findByCollection = async (
    collectionMint: Pubkey,
    options: Partial<FindOptions> = {},
  ): Promise<Result<NftMetadata, Error>> => {
    return Try(async () => {
      const defaultOptions = {
        limit: 1000,
        page: 1,
        sortBy: DasApi.defaultSortBy,
      };
      const { limit, page, sortBy, before, after } = {
        ...defaultOptions,
        ...options,
      };

      const assets = await DasApi.getAssetsByGroup(
        'collection',
        collectionMint,
        limit,
        page,
        sortBy,
        before,
        after,
      );
      if (assets.isErr) {
        throw assets.error;
      }

      const items = assets.value.items;

      const metadatas = await Promise.all(
        items
          .filter((item) => item.compression.compressed === true)
          .map(async (item) => {
            const offchain: Offchain = await DasApi.fetchOffchain(
              item.content.json_uri,
            );
            const merged = {
              onchain: item,
              offchain: offchain,
            };
            return Converter.Nft.intoUser(merged);
          }),
      );
      return {
        page: assets.value.page,
        total: assets.value.total,
        limit: assets.value.limit,
        metadatas,
      };
    });
  };
}
