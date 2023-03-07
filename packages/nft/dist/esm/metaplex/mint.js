var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { debugLog, overwriteObject, Try, MintInstruction, KeypairAccount, } from '@solana-suite/shared';
import { Storage } from '@solana-suite/storage';
import { Bundlr, Validator, Creators, } from '@solana-suite/shared-metaplex';
import { token, TransactionBuilder, } from '@metaplex-foundation/js';
import { createCreateMasterEditionV3Instruction } from '@metaplex-foundation/mpl-token-metadata';
export var Metaplex;
(function (Metaplex) {
    // original: plugins/nftModule/operations/createNft.ts
    const createNftBuilder = (params, owner, signer, feePayer) => __awaiter(this, void 0, void 0, function* () {
        const mint = KeypairAccount.create();
        const updateAuthority = signer;
        const mintAuthority = signer;
        const inst = yield Metaplex.createNftBuilderInstruction(feePayer.toKeypair(), params, mint.toKeypair(), updateAuthority.toKeypair(), mintAuthority.toKeypair(), owner);
        return new MintInstruction(inst, [feePayer.toKeypair(), mint.toKeypair(), signer.toKeypair()], undefined, mint);
    });
    Metaplex.createNftBuilderInstruction = (feePayer, params, useNewMint, updateAuthority, mintAuthority, tokenOwner) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        debugLog('# params: ', params);
        debugLog('# feePayer: ', feePayer);
        debugLog('# useNewMint: ', useNewMint);
        debugLog('# updateAuthority: ', updateAuthority);
        debugLog('# mintAuthority: ', mintAuthority);
        debugLog('# tokenOwner: ', tokenOwner);
        const metaplex = Bundlr.make(feePayer);
        const payer = metaplex.identity();
        const sftBuilder = yield metaplex
            .nfts()
            .builders()
            .createSft(Object.assign(Object.assign({}, params), { updateAuthority,
            mintAuthority,
            useNewMint, tokenOwner: tokenOwner.toPublicKey(), tokenAmount: token(1), decimals: 0 }));
        const { mintAddress, metadataAddress, tokenAddress } = sftBuilder.getContext();
        const masterEditionAddress = metaplex
            .nfts()
            .pdas()
            .masterEdition({ mint: mintAddress });
        return (TransactionBuilder.make()
            .setFeePayer(payer)
            .setContext({
            mintAddress,
            metadataAddress,
            masterEditionAddress,
            tokenAddress: tokenAddress,
        })
            // Create the mint, the token and the metadata.
            .add(sftBuilder)
            // Create master edition account (prevents further minting).
            .add({
            instruction: createCreateMasterEditionV3Instruction({
                edition: masterEditionAddress,
                mint: mintAddress,
                updateAuthority: updateAuthority.publicKey,
                mintAuthority: mintAuthority.publicKey,
                payer: payer.publicKey,
                metadata: metadataAddress,
            }, {
                createMasterEditionArgs: {
                    maxSupply: params.maxSupply === undefined ? 0 : params.maxSupply,
                },
            }),
            signers: [payer, mintAuthority, updateAuthority],
            key: (_a = params.createMasterEditionInstructionKey) !== null && _a !== void 0 ? _a : 'createMasterEdition',
        })
            .getInstructions());
    });
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
     *   attributes?: JsonMetadataAttribute[]     // game character parameter, personality, characteristics
     *   properties?: JsonMetadataProperties<Uri> // include file name, uri, supported file type
     *   collection?: Collection                  // collections of different colors, shapes, etc.
     *   [key: string]?: unknown                   // optional param, Usually not used.
     *   creators?: Creator[]          // other creators than owner
     *   uses?: Uses                   // usage feature: burn, single, multiple
     *   isMutable?: boolean           // enable update()
     *   maxSupply?: BigNumber         // mint copies
     * }
     * @param {Secret} feePayer?       // fee payer
     * @return Promise<Result<Instruction, Error>>
     */
    Metaplex.mint = (owner, signer, input, feePayer) => __awaiter(this, void 0, void 0, function* () {
        return Try(() => __awaiter(this, void 0, void 0, function* () {
            const valid = Validator.checkAll(input);
            if (valid.isErr) {
                throw valid.error;
            }
            const value = Creators.toInputConvert(input.creators);
            const metadata = overwriteObject(input, 'creators', {
                key: 'creators',
                value,
            });
            const payer = feePayer ? feePayer : signer;
            const uploaded = yield Storage.uploadMetaContent(metadata, payer);
            const { uri, sellerFeeBasisPoints, reducedMetadata } = uploaded;
            debugLog('# upload content url: ', uri);
            debugLog('# sellerFeeBasisPoints: ', sellerFeeBasisPoints);
            debugLog('# reducedMetadata: ', reducedMetadata);
            const mintInput = Object.assign({ uri,
                sellerFeeBasisPoints }, reducedMetadata);
            return yield createNftBuilder(mintInput, owner, signer, payer);
        }));
    });
})(Metaplex || (Metaplex = {}));
//# sourceMappingURL=mint.js.map