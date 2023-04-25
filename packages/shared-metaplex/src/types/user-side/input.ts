import { InfraSide } from '../infra-side/input';
import { _Common, bignum, FileContent, Option, User } from '../shared';

/////////// NFT //////////////
export module UserSide.Input {
  export type NftMetadata = {
    name: string;
    symbol: string;
    royalty: number;
    storageType?: InfraSide.Input.StorageType;
    filePath?: FileContent;
    uri?: string;
    isMutable?: boolean;
    description?: string;
    external_url?: string;
    attributes?: User.Attribute[];
    properties?: _Common.Properties;
    maxSupply?: bignum;
    creators?: User.Creators[];
    uses?: _Common.Uses;
    collection?: User.Input.Collection;
    options?: { [key: string]: unknown };
  };
}

/////////// TOKEN //////////////
export namespace UserSide.Input {
  export type TokenMetadata = {
    name: string;
    symbol: string;
    filePath?: FileContent;
    uri?: string;
    storageType?: InfraSide.Input.StorageType;
    description?: string;
    royalty?: number;
    attributes?: User.Attribute[];
    creators?: User.Creators[];
    uses?: Option<_Common.Uses>;
    options?: { [key: string]: unknown };
  };
}
