import { Option } from '../shared';
import { _Same } from '../_same';
import { Pubkey } from '@solana-suite/shared';
import { InfraSideOutput } from '../infra-side/output';
export declare namespace UserSideOutput {
    type Collection = Option<{
        address: Pubkey;
        verified: boolean;
    }>;
    type Creator = Option<{
        readonly address: Pubkey;
        readonly share: number;
        readonly verified: boolean;
    }>;
    type NftMetadata = {
        mint: string;
        updateAuthority: string;
        royalty: number;
        name: string;
        symbol: string;
        uri: string;
        isMutable: boolean;
        primarySaleHappened: boolean;
        creators: Creator[];
        editionNonce: Option<number>;
        collection: Option<{
            address: Pubkey;
            verified: boolean;
        }>;
        uses: Option<_Same.Uses>;
        onchain: InfraSideOutput.Offchain;
    };
    type TokenMetadata = {
        name: string;
        symbol: string;
        uri: string;
        sellerFeeBasisPoints: number;
        attributes?: _Same.Attribute;
        creators?: Creator[];
        uses?: Option<_Same.Uses>;
    };
}
