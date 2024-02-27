import { Pubkey, Secret } from '../account';
import { Attribute, Properties, StorageType } from '../storage';
import { FileType } from '../storage';
import { bignum, InputCreators, Uses } from './common';

export type InputCollection = Pubkey;
export type Options = { [key: string]: unknown };
export type InputNftMetadata = {
  name: string;
  symbol: string;
  royalty?: number;
  storageType?: StorageType;
  filePath?: FileType;
  uri?: string;
  isMutable?: boolean;
  description?: string;
  external_url?: string;
  attributes?: Attribute[];
  properties?: Properties;
  maxSupply?: bignum;
  creators?: InputCreators[];
  uses?: Uses;
  collection?: InputCollection;
  options?: Options;
};

export type MintOptions = {
  updateAuthority: Pubkey;
  freezeAuthority: Pubkey;
  feePayer: Secret;
};
