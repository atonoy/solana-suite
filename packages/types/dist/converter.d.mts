import BN from 'bn.js';
import { FileType, StorageType } from './storage.mjs';
import { PublicKey } from '@solana/web3.js';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { Pubkey as Pubkey$1 } from './account.mjs';
import './phantom-e9a40784.js';

type Option<T> = T | null;
type bignum = number | BN;
declare namespace Common {
    type Properties = {
        creators?: {
            address?: string;
            share?: number;
            [key: string]: unknown;
        }[];
        files?: {
            type?: string;
            filePath?: FileType;
            [key: string]: unknown;
        }[];
        [key: string]: unknown;
    };
    type Attribute = {
        trait_type?: string;
        value?: string;
        [key: string]: unknown;
    };
    enum UseMethod {
        Burn = 0,
        Multiple = 1,
        Single = 2
    }
    type Uses = {
        useMethod: UseMethod;
        remaining: bignum;
        total: bignum;
    };
    type Options = {
        [key: string]: unknown;
    };
}

declare namespace InfraInput {
    interface File extends Blob {
        readonly lastModified: number;
        readonly name: string;
    }
    type StorageNftStorageMetadata = {
        storageType?: 'nftStorage';
    };
    type StorageArweaveMetadata = {
        storageType?: 'arweave';
    };
    type Collection = {
        key: PublicKey;
        verified: boolean;
    };
    type Creators = {
        address: PublicKey;
        verified: boolean;
        share: number;
    };
    type Properties = Common.Properties;
    type Offchain = {
        name?: string;
        symbol?: string;
        description?: string;
        seller_fee_basis_points?: number;
        image?: string;
        external_url?: string;
        attributes?: Common.Attribute[];
        properties?: Common.Properties;
        collection?: {
            name?: string;
            family?: string;
            [key: string]: unknown;
        };
        created_at?: number;
    };
    type MetaplexDataV2 = {
        name: string;
        symbol: string;
        uri: string;
        sellerFeeBasisPoints: number;
        creators: Option<Creators[]>;
        collection: Option<Collection>;
        uses: Option<Common.Uses>;
    };
}

declare namespace InfraOutput {
    type Collection = {
        verified: boolean;
        key: PublicKey;
    };
    type OnchainAndOffchain = {
        onchain: Metadata;
        offchain: InfraOutput.Offchain;
    };
    type Transfer = {
        parsed: {
            info: {
                destination: Pubkey;
                source: Pubkey;
                lamports: number;
            };
            type: string;
        };
        program: string;
        programId?: PublicKey;
    };
    type MintTo = {
        parsed: {
            info: {
                account: Pubkey;
                mint: Pubkey;
                mintAuthority: Pubkey;
                tokenAmount: string;
            };
            type: string;
        };
        program: string;
        programId?: PublicKey;
    };
    type MintToChecked = MintTo;
    type TransferChecked = {
        parsed: {
            info: {
                destination: Pubkey;
                mint: Pubkey;
                multisigAuthority: Pubkey;
                signers: Pubkey[];
                source: Pubkey;
                tokenAmount: string;
            };
            type: string;
        };
        program: string;
        programId?: PublicKey;
    };
    type Memo = {
        parsed: string;
        program: string;
        programId: PublicKey;
    };
    type Creator = InfraInput.Creators;
    type Offchain = InfraInput.Offchain;
    type Uses = Common.Uses;
}

declare namespace UserInput {
    type Collection = Pubkey$1;
    type Creators = {
        address: Pubkey$1;
        share: number;
        verified: boolean;
    };
    type Properties = Common.Properties;
    enum TokenStandard {
        NonFungible = 0,
        FungibleAsset = 1,
        Fungible = 2,
        NonFungibleEdition = 3,
        ProgrammableNonFungible = 4
    }
    type NftMetadata = {
        name: string;
        symbol: string;
        royalty: number;
        storageType?: StorageType;
        filePath?: FileType;
        uri?: string;
        isMutable?: boolean;
        description?: string;
        external_url?: string;
        attributes?: Common.Attribute[];
        properties?: Properties;
        maxSupply?: bignum;
        creators?: Creators[];
        uses?: Common.Uses;
        collection?: Collection;
        options?: Common.Options;
    };
    type TokenMetadata = {
        name: string;
        symbol: string;
        filePath?: FileType;
        uri?: string;
        storageType?: StorageType;
        description?: string;
        royalty?: number;
        uses?: Common.Uses;
        creators?: Creators[];
        attributes?: Common.Attribute[];
        options?: Common.Options;
    };
}

declare namespace UserOutput {
    type Creators = UserInput.Creators;
    type Collection = {
        address: Pubkey$1;
        verified: boolean;
    };
    type Uses = Common.Uses;
    type NftMetadata = {
        mint: string;
        updateAuthority: string;
        royalty: number;
        name: string;
        symbol: string;
        uri: string;
        isMutable: boolean;
        primarySaleHappened: boolean;
        editionNonce: Option<number>;
        offchain: InfraOutput.Offchain;
        tokenAmount: string;
        collection?: Collection | undefined;
        creators?: Creators[] | undefined;
        uses?: Common.Uses | undefined;
        dateTime?: Date | undefined;
    };
    type TokenMetadata = {
        mint: string;
        name: string;
        symbol: string;
        uri: string;
        royalty: number;
        offchain: InfraOutput.Offchain;
        tokenAmount: string;
        attributes?: Common.Attribute | undefined;
        creators?: Creators[] | undefined;
        uses?: Common.Uses | undefined;
        dateTime?: Date | undefined;
    };
}

export { Common, InfraInput, InfraOutput, Option, UserInput, UserOutput, bignum };
