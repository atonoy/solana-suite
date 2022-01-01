import { PublicKey, Signer } from '@solana/web3.js';
import { Result, Instruction } from '@solana-suite/shared';
export declare namespace SolNative {
    const transferWithMultisig: (owner: PublicKey, dest: PublicKey, signers: Signer[], amountSol: number, feePayer?: Signer | undefined) => Promise<Result<Instruction, Error>>;
    const transfer: (source: PublicKey, destination: PublicKey, signers: Signer[], amountSol: number, feePayer?: Signer | undefined) => Promise<Result<Instruction, Error>>;
}