"use strict";
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
exports.MetaplexMetaData = void 0;
const web3_js_1 = require("@solana/web3.js");
const index_1 = require("./index");
const shared_1 = require("@solana-suite/shared");
const core_1 = require("@solana-suite/core");
const spl_token_1 = require("@solana/spl-token");
var MetaplexMetaData;
(function (MetaplexMetaData) {
    const createAssociatedTokenAccountInstruction = (metaAccount, mint, mintAuthorityKey, updateAuthority, payer, txnData) => {
        const keys = [
            {
                pubkey: metaAccount,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: mint,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: mintAuthorityKey,
                isSigner: true,
                isWritable: false,
            },
            {
                pubkey: payer,
                isSigner: true,
                isWritable: false,
            },
            {
                pubkey: updateAuthority,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: web3_js_1.SystemProgram.programId,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
                isSigner: false,
                isWritable: false,
            },
        ];
        return new web3_js_1.TransactionInstruction({
            keys,
            programId: shared_1.Constants.METAPLEX_PROGRAM_ID,
            data: txnData,
        });
    };
    const updateAssociatedTokenAccountInstruction = (associatedToken, payer, source, mintKey) => {
        const keys = [
            {
                pubkey: payer,
                isSigner: true,
                isWritable: true,
            },
            {
                pubkey: associatedToken,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: source,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: mintKey,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: web3_js_1.SystemProgram.programId,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: spl_token_1.TOKEN_PROGRAM_ID,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
                isSigner: false,
                isWritable: false,
            },
        ];
        return new web3_js_1.TransactionInstruction({
            keys,
            programId: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
            data: Buffer.from([]),
        });
    };
    MetaplexMetaData.getByTokenKey = (mint) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const metaAccount = yield index_1.MetaplexAccount.findMetaplexAssocaiatedTokenAddress(mint);
        if (metaAccount.isErr) {
            return shared_1.Result.err(metaAccount.error);
        }
        const nfts = yield shared_1.Node.getConnection().getParsedAccountInfo(metaAccount.value)
            .then(shared_1.Result.ok)
            .catch(shared_1.Result.err);
        if (nfts.isErr)
            return shared_1.Result.err(nfts.error);
        const accountData = nfts.value;
        const data = (_a = accountData.value) === null || _a === void 0 ? void 0 : _a.data;
        if (data) {
            return shared_1.Result.ok(index_1.MetaplexSerialize.decode(data));
        }
        return shared_1.Result.ok(index_1.Metaplex.initFormat());
    });
    MetaplexMetaData.getByOwner = (owner) => __awaiter(this, void 0, void 0, function* () {
        // Get all token by owner
        const tokens = yield shared_1.Node.getConnection().getParsedTokenAccountsByOwner(owner, { programId: spl_token_1.TOKEN_PROGRAM_ID })
            .then(shared_1.Result.ok)
            .catch(shared_1.Result.err);
        if (tokens.isErr)
            return shared_1.Result.err(tokens.error);
        const arr = tokens.value;
        const matches = [];
        // Filter only metaplex nft
        for (const token of arr.value) {
            const decoded = yield MetaplexMetaData.getByTokenKey(token.account.data.parsed.info.mint.toPublicKey());
            if (!decoded)
                continue;
            if (decoded.isErr) {
                return shared_1.Result.err(decoded.error);
            }
            matches.push(decoded.value);
        }
        return shared_1.Result.ok(matches);
    });
    MetaplexMetaData.create = (data, mint, mintAuthorityKey, updateAuthority, feePayer) => __awaiter(this, void 0, void 0, function* () {
        const metaAccount = yield index_1.MetaplexAccount.findMetaplexAssocaiatedTokenAddress(mint);
        if (metaAccount.isErr) {
            return shared_1.Result.err(metaAccount.error);
        }
        const txnData = index_1.MetaplexSerialize.serializeCreateArgs(data);
        const inst = createAssociatedTokenAccountInstruction(metaAccount.unwrap(), mint, mintAuthorityKey, updateAuthority, feePayer, txnData);
        return shared_1.Result.ok([inst]);
    });
    MetaplexMetaData.update = (data, newUpdateAuthority, primarySaleHappened, mint, updateAuthority, signers) => __awaiter(this, void 0, void 0, function* () {
        const inst = [];
        const associatedToken = yield core_1.Account.findAssocaiatedTokenAddress(mint, updateAuthority);
        if (associatedToken.isErr) {
            return shared_1.Result.err(associatedToken.error);
        }
        inst.push(updateAssociatedTokenAccountInstruction(associatedToken.value, updateAuthority, updateAuthority, mint));
        inst.push((0, spl_token_1.createMintToInstruction)(mint, associatedToken.value, updateAuthority, 1, signers, spl_token_1.TOKEN_PROGRAM_ID));
        const metaAccount = yield index_1.MetaplexAccount.findMetaplexAssocaiatedTokenAddress(mint);
        if (metaAccount.isErr) {
            return shared_1.Result.err(metaAccount.error);
        }
        const txnData = index_1.MetaplexSerialize.serializeUpdateArgs(data, newUpdateAuthority, primarySaleHappened);
        const keys = [
            {
                pubkey: metaAccount.value,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: updateAuthority,
                isSigner: true,
                isWritable: false,
            },
        ];
        inst.push(new web3_js_1.TransactionInstruction({
            keys,
            programId: shared_1.Constants.METAPLEX_PROGRAM_ID,
            data: txnData,
        }));
        return shared_1.Result.ok(inst);
    });
})(MetaplexMetaData = exports.MetaplexMetaData || (exports.MetaplexMetaData = {}));
