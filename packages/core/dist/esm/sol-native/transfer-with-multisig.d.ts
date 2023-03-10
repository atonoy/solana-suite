import { Result, Instruction, Pubkey, Secret } from '@solana-suite/shared';
export declare namespace SolNative {
    const transferWithMultisig: (owner: Pubkey, dest: Pubkey, signers: Secret[], amount: number, feePayer?: Secret) => Promise<Result<Instruction, Error>>;
}