import { MetaplexFileContent } from '@metaplex-foundation/js';
import { overwriteObject, Secret, Result } from '@solana-suite/shared';
import { IProperties, StorageType } from './types';

export namespace Properties {
  export const toInputConvert = async (
    input: IProperties | undefined,
    storageFunc: (
      data: MetaplexFileContent,
      storageType: StorageType,
      feePayer?: Secret
    ) => Promise<Result<string, Error>>,
    storageType: StorageType,
    feePayer?: Secret
  ): Promise<IProperties> => {
    if (!input || !input.files) {
      return {};
    }

    const files = await Promise.all(
      input.files.map(async (file) => {
        if (!file.filePath) {
          return {};
        }
        const res = await storageFunc(file.filePath, storageType, feePayer);
        if (res.isErr) {
          throw Error(res.error.message);
        }
        return overwriteObject(file, [
          {
            existsKey: 'filePath',
            will: { key: 'uri', value: res.value },
          },
        ]);
      })
    );
    return { ...input, files } as IProperties;
  };
}
