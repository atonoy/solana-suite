import { Blob, NFTStorage } from "nft.storage";
import {
  Constants,
  debugLog,
  Result,
  Try,
} from "@solana-suite/shared";
import { ProvenanceLayer } from "./provenance-layer";
import { FileContent, InfraSideInput } from "@solana-suite/shared-metaplex";

export namespace NftStorage {
  let isDisplayWarning = false;
  const getNftStorageApiKey = (): string => {
    if (!Constants.nftStorageApiKey) {
      if (!isDisplayWarning) {
        console.warn(
          `
        [Warning]
        --------------------------------------
        If will use @solana-suite/nft package
        your need to update nftStorage.apiKey define parameter in solana-suite.json.
        can get apiKey from https://nft.storage/
        --------------------------------------
        `,
        );
        isDisplayWarning = true;
      }
      return Constants.NFT_STORAGE_API_KEY;
    } else {
      return Constants.nftStorageApiKey;
    }
  };

  const createGatewayUrl = (cid: string): string =>
    `${Constants.NFT_STORAGE_GATEWAY_URL}/${cid}`;

  const connect = () => new NFTStorage({ token: getNftStorageApiKey() });

  export const uploadContent = async (
    filePath: FileContent,
  ): Promise<Result<string, Error>> => {
    return Try(async () => {
      debugLog("# upload content: ", filePath);
      let file!: Buffer;
      if (ProvenanceLayer.isNodeable(filePath)) {
        file = (await import("fs")).readFileSync(filePath);
      } else if (ProvenanceLayer.isBrowserable(filePath)) {
        file = Buffer.from(await filePath.arrayBuffer());
      } else {
        throw Error("Supported environment: only Node.js and Browser js");
      }

      const blobImage = new Blob([file]);
      const res = await connect().storeBlob(blobImage);
      return createGatewayUrl(res);
    });
  };

  /**
   * Upload content
   *
   * @param {StorageMetadata} metadata
   * {
   *   name?: {string}                      // nft content name
   *   symbol?: {string}                    // nft ticker symbol
   *   description?: {string}               // nft content description
   *   sellerFeeBasisPoints?: number        // royalty percentage
   *   image?: {string}                     // uploaded uri of original content
   *   external_url?: {string}              // landing page, home page uri, related url
   *   attributes?: {JsonMetadataAttribute[]}     // game character parameter, personality, characteristics
   *   properties?: {JsonMetadataProperties<Uri>} // included file name, uri, supported file type
   *   collection?: Collection              // collections of different colors, shapes, etc.
   *   [key: string]: {unknown}             // optional param, Usually not used.
   * }
   * @return Promise<Result<string, Error>>
   */
  export const uploadMetadata = async (
    metadata: InfraSideInput.Offchain,
  ): Promise<Result<string, Error>> => {
    return Try(async () => {
      debugLog("# upload metadata: ", metadata);

      const blobJson = new Blob([JSON.stringify(metadata)]);
      const res = await connect().storeBlob(blobJson);
      return createGatewayUrl(res);
    });
  };
}
