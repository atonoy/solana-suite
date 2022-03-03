import { PublicKey, ParsedTransactionWithMeta, Commitment, RpcResponseAndContext, SignatureResult } from '@solana/web3.js';
import { Result } from '@solana-suite/shared';
export declare namespace Transaction {
    const subscribeAccount: (pubkey: PublicKey, callback: any) => number;
    const unsubscribeAccount: (subscribeId: number) => Promise<void>;
    interface TransferHistory {
        info: {
            destination?: string;
            source?: string;
            authority?: string;
            multisigAuthority?: string;
            signers?: string[];
            amount?: string;
            mint?: string;
            tokenAmount?: any[];
        };
        type: string;
        date: Date;
        innerInstruction: boolean;
        sig: string;
        memo?: string;
    }
    interface TransferDestinationList {
        dest: PublicKey;
        date: Date;
    }
    enum Filter {
        Transfer = "transfer",
        TransferChecked = "transferChecked",
        Memo = "spl-memo",
        MintTo = "mintTo",
        Create = "create"
    }
    enum DirectionType {
        Dest = "destination",
        Source = "source"
    }
    interface TransferFilter {
        filter: DirectionType;
        pubkey: PublicKey;
    }
    const get: (signature: string) => Promise<Result<ParsedTransactionWithMeta, Error>>;
    const getForAddress: (pubkey: PublicKey, limit?: number | undefined, before?: string | undefined, until?: string | undefined) => Promise<Result<ParsedTransactionWithMeta, Error>[]>;
    const getTransactionHistory: (pubkey: PublicKey, options: {
        limit?: number;
        actionFilter?: Filter[];
        transferFilter?: TransferFilter;
    }) => Promise<Result<TransferHistory[], Error>>;
    const getTokenTransactionHistory: (tokenKey: PublicKey, pubkey: PublicKey, options: {
        limit?: number;
        actionFilter?: Filter[];
        transferFilter?: TransferFilter;
    }) => Promise<Result<TransferHistory[], Error>>;
    const confirmedSig: (signature: string, commitment?: Commitment) => Promise<Result<RpcResponseAndContext<SignatureResult> | unknown, Error>>;
}
