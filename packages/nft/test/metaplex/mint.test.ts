import { describe, it } from 'mocha';
import { assert } from 'chai';
import { Setup } from '../../../shared/test/testSetup';
import { Metaplex } from '../../src/metaplex';
import { RandomAsset } from '../../../storage/test/randomAsset';
import { InputCreators, ValidatorError } from '../../../shared-metaplex/';
import { KeypairAccount } from '../../../shared';
import { Pubkey } from '../../../shared/src';

let source: KeypairAccount;

describe('Metaplex', () => {
  before(async () => {
    const obj = await Setup.generateKeyPair();
    source = obj.source;
  });

  it('[Arweave] mint nft', async () => {
    const asset = RandomAsset.get();

    const creator1: InputCreators = {
      address: source.pubkey,
      share: 70,
      authority: source.secret,
    };

    const creator2: InputCreators = {
      address: '93MwWVSZHiPS9VLay4ywPcTWmT4twgN2nxdCgSx6uFTk',
      share: 30,
      authority: '',
    };

    const res = await Metaplex.mint(source.pubkey, source.secret, {
      filePath: asset.filePath as string,
      storageType: 'arweave',
      name: asset.name!,
      symbol: asset.symbol!,
      royalty: 50,
      creators: [creator1, creator2],
      isMutable: true,
    });

    assert.isTrue(KeypairAccount.isPubkey(res.unwrap().data as Pubkey));

    (await res.submit()).match(
      (ok: string) => {
        console.log('# mint:', res.unwrap().data);
        console.log('# sig:', ok);
      },
      (ng: Error) => assert.fail(ng.message)
    );
  });

  it.only('[Nft Storage] mint nft', async () => {
    const asset = RandomAsset.get();

    const creator1: InputCreators = {
      address: 'CGDRajhcFo9ysuUjBsbwCQHKJuCHiXeEUrMKSot1eyay',
      share: 70,
      authority: '',
    };

    const creator2 = {
      address: '93MwWVSZHiPS9VLay4ywPcTWmT4twgN2nxdCgSx6uFTk',
      share: 30,
      authority: '',
    };

    const res = await Metaplex.mint(source.pubkey, source.secret, {
      filePath: asset.filePath as string,
      storageType: 'nftStorage',
      name: asset.name!,
      symbol: asset.symbol!,
      royalty: 20,
      creators: [creator1, creator2],
      isMutable: true,
      options: {
        createdBy: 'Solana Suite',
        poweredBy: 'Solana',
        creators: [creator1, creator2],
      },
    });

    assert.isTrue(KeypairAccount.isPubkey(res.unwrap().data as Pubkey));

    (await res.submit()).match(
      (ok: string) => {
        console.log('# mint:', res.unwrap().data);
        console.log('# sig:', ok);
      },
      (ng: Error) => {
        console.log(ng);
        assert.fail(ng.message);
      }
    );
  });

  it('Raise validation error when upload meta data', async () => {
    const res = await Metaplex.mint(source.pubkey, source.secret, {
      filePath: '',
      name: '',
      symbol: 'LONG-SYMBOL-LONG',
      royalty: -100,
      storageType: 'nftStorage',
    });

    res.match(
      (_: unknown) => assert.fail('Unrecognized error'),
      (_: unknown) => {
        (err: ValidatorError) => {
          assert.isNotEmpty(err.message);
          console.log(err.details);
        };
      }
    );
  });
});
