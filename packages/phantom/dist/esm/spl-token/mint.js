var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Transaction, Keypair } from '@solana/web3.js';
import { Node, Try, debugLog } from '@solana-suite/shared';
import { Storage } from '@solana-suite/storage';
import { SplToken } from '@solana-suite/core';
import { TokenMetadata, } from '@solana-suite/shared-metaplex';
export var PhantomSplToken;
(function (PhantomSplToken) {
    PhantomSplToken.mint = (input, owner, cluster, totalAmount, mintDecimal, phantom) => __awaiter(this, void 0, void 0, function* () {
        return Try(() => __awaiter(this, void 0, void 0, function* () {
            Node.changeConnection({ cluster });
            const connection = Node.getConnection();
            const transaction = new Transaction();
            const mint = Keypair.generate();
            input.royalty = 0;
            const sellerFeeBasisPoints = 0;
            const tokenStorageMetadata = Storage.toConvertNftStorageMetadata(input, input.royalty);
            const uploaded = yield Storage.uploadMetaContent(tokenStorageMetadata, input.filePath, input.storageType);
            if (uploaded.isErr) {
                throw uploaded;
            }
            const uri = uploaded.value;
            const isMutable = true;
            const datav2 = TokenMetadata.toConvertInfra(input, uri, sellerFeeBasisPoints);
            debugLog('# datav2: ', datav2);
            debugLog('# upload content url: ', uri);
            const insturctions = yield SplToken.createMintInstructions(mint.publicKey, owner.toPublicKey(), totalAmount, mintDecimal, datav2, owner.toPublicKey(), isMutable);
            insturctions.forEach((inst) => transaction.add(inst));
            transaction.feePayer = owner.toPublicKey();
            const blockhashObj = yield connection.getLatestBlockhashAndContext();
            transaction.recentBlockhash = blockhashObj.value.blockhash;
            transaction.partialSign(mint);
            const signed = yield phantom.signTransaction(transaction);
            debugLog('# signed, signed.signatures: ', signed, signed.signatures.map((sig) => sig.publicKey.toString()));
            const sig = yield connection.sendRawTransaction(signed.serialize());
            yield Node.confirmedSig(sig);
            return mint.publicKey.toString();
        }));
    });
})(PhantomSplToken || (PhantomSplToken = {}));
//# sourceMappingURL=mint.js.map