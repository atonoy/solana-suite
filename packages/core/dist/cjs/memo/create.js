"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memo = void 0;
const web3_js_1 = require("@solana/web3.js");
const shared_1 = require("@solana-suite/shared");
const bs58_1 = __importDefault(require("bs58"));
var Memo;
(function (Memo) {
    Memo.decode = (encoded) => bs58_1.default.decode(encoded).toString();
    Memo.encode = (data) => Buffer.from(data);
    Memo.create = (data, owner, signer, feePayer) => {
        const key = owner.toPublicKey()
            ? [
                {
                    pubkey: owner.toPublicKey(),
                    isSigner: true,
                    isWritable: true,
                },
            ]
            : [];
        const instruction = new web3_js_1.TransactionInstruction({
            programId: shared_1.Constants.MEMO_PROGRAM_ID,
            data: Memo.encode(data),
            keys: key,
        });
        const payer = feePayer || signer;
        return new shared_1.Instruction([instruction], [signer.toKeypair()], payer.toKeypair());
    };
})(Memo = exports.Memo || (exports.Memo = {}));
//# sourceMappingURL=create.js.map