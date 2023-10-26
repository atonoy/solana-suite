"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftStorage = void 0;
const nft_storage_1 = require("nft.storage");
const shared_1 = require("@solana-suite/shared");
const provenance_layer_1 = require("./provenance-layer");
var NftStorage;
(function (NftStorage) {
    let isDisplayWarning = false;
    const getNftStorageApiKey = () => {
        if (!shared_1.Constants.nftStorageApiKey) {
            if (!isDisplayWarning) {
                console.warn(`
        [Warning]
        --------------------------------------
        If will use @solana-suite/nft package
        your need to update nftStorage.apiKey define parameter in solana-suite.json.
        can get apiKey from https://nft.storage/
        --------------------------------------
        `);
                isDisplayWarning = true;
            }
            return shared_1.Constants.NFT_STORAGE_API_KEY;
        }
        else {
            return shared_1.Constants.nftStorageApiKey;
        }
    };
    const createGatewayUrl = (cid) => `${shared_1.Constants.NFT_STORAGE_GATEWAY_URL}/${cid}`;
    const connect = () => new nft_storage_1.NFTStorage({ token: getNftStorageApiKey() });
    NftStorage.uploadContent = (filePath) => __awaiter(this, void 0, void 0, function* () {
        return (0, shared_1.Try)(() => __awaiter(this, void 0, void 0, function* () {
            (0, shared_1.debugLog)('# upload content: ', filePath);
            let file;
            if (provenance_layer_1.ProvenanceLayer.isNodeable(filePath)) {
                file = (yield Promise.resolve().then(() => __importStar(require('fs')))).readFileSync(filePath);
            }
            else if (provenance_layer_1.ProvenanceLayer.isBrowserable(filePath)) {
                file = Buffer.from(yield filePath.arrayBuffer());
            }
            else {
                throw Error('Supported environment: only Node.js and Browser js');
            }
            const blobImage = new nft_storage_1.Blob([file]);
            const res = yield connect().storeBlob(blobImage);
            return createGatewayUrl(res);
        }));
    });
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
    NftStorage.uploadMetadata = (metadata) => __awaiter(this, void 0, void 0, function* () {
        return (0, shared_1.Try)(() => __awaiter(this, void 0, void 0, function* () {
            (0, shared_1.debugLog)('# upload metadata: ', metadata);
            const blobJson = new nft_storage_1.Blob([JSON.stringify(metadata)]);
            const res = yield connect().storeBlob(blobJson);
            return createGatewayUrl(res);
        }));
    });
})(NftStorage = exports.NftStorage || (exports.NftStorage = {}));
//# sourceMappingURL=nft-storage.js.map