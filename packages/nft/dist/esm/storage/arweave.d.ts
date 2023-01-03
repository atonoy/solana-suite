import { Currency, MetaplexFileContent } from '@metaplex-foundation/js';
import { Result } from '@solana-suite/shared';
import { NftStorageMetadata } from '../types/storage';
import { BundlrSigner } from '../types';
export interface MetaplexFileOptions {
    readonly displayName: string;
    readonly uniqueName: string;
    readonly contentType: string | undefined;
    readonly extension: string | undefined;
    readonly tags: {
        name: string;
        value: string;
    }[];
}
export declare namespace StorageArweave {
    const getUploadPrice: (filePath: MetaplexFileContent, feePayer: BundlrSigner) => Promise<Result<{
        price: number;
        currency: Currency;
    }, Error>>;
    const uploadContent: (filePath: MetaplexFileContent, feePayer: BundlrSigner, fileOptions?: MetaplexFileOptions) => Promise<Result<string, Error>>;
    const uploadMetadata: (metadata: NftStorageMetadata, feePayer: BundlrSigner) => Promise<Result<string, Error>>;
}
