import * as _solana_suite_shared from '@solana-suite/shared';
import * as internals_shared_metaplex from 'internals/shared-metaplex';
import { Keypair, Transaction, PublicKey, SendOptions, TransactionSignature } from '@solana/web3.js';

declare const Metaplex: {
    mint: (input: internals_shared_metaplex.UserSideInput.NftMetadata, cluster: string, phantom: Phantom) => Promise<_solana_suite_shared.Result<string, Error | internals_shared_metaplex.ValidatorError>>;
};

declare const PhantomSplToken: {
    mint: (input: internals_shared_metaplex.UserSideInput.TokenMetadata, owner: _solana_suite_shared.Pubkey, cluster: string, totalAmount: number, mintDecimal: number, phantom: Phantom) => Promise<_solana_suite_shared.Result<string, Error>>;
    add: (tokenKey: _solana_suite_shared.Pubkey, owner: _solana_suite_shared.Pubkey, cluster: string, totalAmount: number, mintDecimal: number, phantom: Phantom) => Promise<_solana_suite_shared.Result<string, Error>>;
};

type InitializeMint = {
    mint: Keypair;
    tx: Transaction;
};

type connectOption = {
    onlyIfTrusted: false;
};
type Phantom = {
    isPhantom?: boolean;
    publicKey: PublicKey;
    isConnected: boolean;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    signAndSendTransaction(transaction: Transaction, options?: SendOptions): Promise<{
        signature: TransactionSignature;
    }>;
    signMessage(message: Uint8Array): Promise<Uint8Array>;
    connect(): Promise<{
        publicKey: Uint16Array;
    }>;
    disconnect(): Promise<void>;
    _handleDisconnect(...args: unknown[]): unknown;
};

export { InitializeMint, Metaplex, Phantom, PhantomSplToken, connectOption };
