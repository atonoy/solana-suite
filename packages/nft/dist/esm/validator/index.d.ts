import { Result } from '@solana-suite/shared';
import { MetaplexMetaData, NftStorageMetaplexMetadata } from '../metaplex';
import { NftStorageMetadata } from '../storage';
export declare namespace Validator {
    export namespace Message {
        const SUCCESS = "success";
        const SMALL_NUMBER = "too small";
        const BIG_NUMBER = "too big";
        const LONG_LENGTH = "too long";
        const EMPTY = "invalid empty value";
        const INVALID_URL = "invalid url";
    }
    export const NAME_LENGTH = 32;
    export const SYMBOL_LENGTH = 10;
    export const URL_LENGTH = 200;
    export const ROYALTY_MAX = 100;
    export const ROYALTY_MIN = 0;
    export type Condition = 'overMax' | 'underMin';
    export interface Limit {
        threshold: number;
        condition: Condition;
    }
    export interface Details {
        key: string;
        message: string;
        actual: string | number;
        limit?: Limit;
    }
    export const isRoyalty: (royalty: number) => Result<string, ValidatorError>;
    export const isName: (name: string) => Result<string, ValidatorError>;
    export const isSymbol: (symbol: string) => Result<string, ValidatorError>;
    export const isFilePath: (filePath: string | File) => Result<string, ValidatorError>;
    export const isUri: (uri: string) => Result<string, ValidatorError>;
    export const isImageUrl: (image: string) => Result<string, ValidatorError>;
    export const checkAll: (metadata: PickNftStorage | PickNftStorageMetaplex | PickMetaplex) => Result<string, ValidatorError>;
    type PickNftStorage = Pick<NftStorageMetadata, 'name' | 'symbol' | 'image' | 'seller_fee_basis_points'>;
    type PickNftStorageMetaplex = Pick<NftStorageMetaplexMetadata, 'name' | 'symbol' | 'royalty' | 'filePath'>;
    type PickMetaplex = Pick<MetaplexMetaData, 'name' | 'symbol' | 'uri' | 'sellerFeeBasisPoints'>;
    export {};
}
export declare class ValidatorError extends Error {
    details: Validator.Details[];
    constructor(message: string, details: Validator.Details[]);
}
