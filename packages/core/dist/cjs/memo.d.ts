/// <reference types="node" />
import { PublicKey, Signer } from '@solana/web3.js';
import { Instruction } from '@solana-suite/shared';
export declare namespace Memo {
    const decode: (encoded: string) => string;
    const encode: (data: string) => Buffer;
    const create: (data: string, owner: PublicKey, signer: Signer) => Instruction;
}
