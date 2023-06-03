/// <reference types="@solana/web3.js" />
export declare const SplToken: {
    transfer: (mint: import("@solana-suite/shared").Pubkey, owner: import("@solana-suite/shared").Pubkey, dest: import("@solana-suite/shared").Pubkey, signers: import("@solana-suite/shared").Secret[], amount: number, mintDecimal: number, feePayer?: import("@solana-suite/shared").Secret | undefined) => Promise<import("@solana-suite/shared").Result<import("@solana-suite/shared").Instruction, Error>>;
    thaw: (mint: import("@solana-suite/shared").Pubkey, owner: import("@solana-suite/shared").Pubkey, freezeAuthority: import("@solana-suite/shared").Secret, feePayer?: import("@solana-suite/shared").Secret | undefined) => import("@solana-suite/shared").Result<import("@solana-suite/shared").Instruction, Error>;
    createFreezeAuthority: (mint: import("@solana/web3.js").PublicKey, owner: import("@solana/web3.js").PublicKey, freezeAuthority: import("@solana/web3.js").PublicKey) => import("@solana/web3.js").TransactionInstruction;
    createMintInstructions: (mint: import("@solana/web3.js").PublicKey, owner: import("@solana/web3.js").PublicKey, totalAmount: number, mintDecimal: number, tokenMetadata: import("@metaplex-foundation/mpl-token-metadata").DataV2, feePayer: import("@solana/web3.js").PublicKey, isMutable: boolean) => Promise<import("@solana/web3.js").TransactionInstruction[]>;
    mint: (owner: import("@solana-suite/shared").Pubkey, signer: import("@solana-suite/shared").Secret, totalAmount: number, mintDecimal: number, input: import("@solana-suite/shared-metaplex").UserSideInput.TokenMetadata, feePayer?: import("@solana-suite/shared").Secret | undefined, freezeAuthority?: import("@solana-suite/shared").Pubkey | undefined) => Promise<import("@solana-suite/shared").Result<import("@solana-suite/shared").MintInstruction, Error>>;
    getHistory: (target: import("@solana-suite/shared").Pubkey, filterType: import("..").FilterType, onOk: import("..").History.OnOk, onErr: import("..").History.OnErr, narrowDown?: number) => Promise<void>;
    feePayerPartialSignTransfer: (mint: import("@solana-suite/shared").Pubkey, owner: import("@solana-suite/shared").Pubkey, dest: import("@solana-suite/shared").Pubkey, signers: import("@solana-suite/shared").Secret[], amount: number, mintDecimal: number, feePayer: import("@solana-suite/shared").Pubkey) => Promise<import("@solana-suite/shared").Result<import("@solana-suite/shared").PartialSignInstruction, Error>>;
    freeze: (mint: import("@solana-suite/shared").Pubkey, owner: import("@solana-suite/shared").Pubkey, freezeAuthority: import("@solana-suite/shared").Secret, feePayer?: import("@solana-suite/shared").Secret | undefined) => import("@solana-suite/shared").Result<import("@solana-suite/shared").Instruction, Error>;
    genericFindByOwner: <T extends import("@solana-suite/shared-metaplex").UserSideOutput.TokenMetadata | import("@solana-suite/shared-metaplex").UserSideOutput.NftMetadata>(owner: import("@solana-suite/shared").Pubkey, callback: (result: import("@solana-suite/shared").Result<T[], Error>) => void, tokenStandard: import("@solana-suite/shared-metaplex").UserSideInput.TokenStandard, sortable?: import("..").Sortable | undefined, isHolder?: boolean | undefined) => Promise<void>;
    genericFindByMint: <T_1 extends import("@solana-suite/shared-metaplex").UserSideOutput.TokenMetadata | import("@solana-suite/shared-metaplex").UserSideOutput.NftMetadata>(mint: import("@solana-suite/shared").Pubkey, tokenStandard: import("@solana-suite/shared-metaplex").UserSideInput.TokenStandard) => Promise<import("@solana-suite/shared").Result<import("@solana-suite/shared-metaplex").UserSideOutput.TokenMetadata, Error>>;
    findByOwner: (owner: import("@solana-suite/shared").Pubkey, onOk: import("..").Find.OnOk, onErr: import("..").Find.OnErr, options?: {
        sortable?: import("..").Sortable | undefined;
        isHolder?: boolean | undefined;
    } | undefined) => void;
    findByMint: (mint: import("@solana-suite/shared").Pubkey) => Promise<import("@solana-suite/shared").Result<import("@solana-suite/shared-metaplex").UserSideOutput.TokenMetadata, Error>>;
    burn: (mint: import("@solana-suite/shared").Pubkey, owner: import("@solana-suite/shared").Pubkey, signers: import("@solana-suite/shared").Secret[], burnAmount: number, tokenDecimals: number, feePayer?: import("@solana-suite/shared").Secret | undefined) => import("@solana-suite/shared").Result<import("@solana-suite/shared").Instruction, Error>;
    add: (token: import("@solana-suite/shared").Pubkey, owner: import("@solana-suite/shared").Pubkey, signers: import("@solana-suite/shared").Secret[], totalAmount: number, mintDecimal: number, feePayer?: import("@solana-suite/shared").Secret | undefined) => Promise<import("@solana-suite/shared").Result<import("@solana-suite/shared").Instruction, Error>>;
};
//# sourceMappingURL=index.d.ts.map