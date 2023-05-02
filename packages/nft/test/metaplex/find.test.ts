import { describe, it } from 'mocha';
import { assert } from 'chai';
import { Metaplex } from '../../src/metaplex';
import { Sortable } from '../../../core/src';

const owner = 'CGDRajhcFo9ysuUjBsbwCQHKJuCHiXeEUrMKSot1eyay';
const notFoundTokenOwner = '93MwWVSZHiPS9VLay4ywPcTWmT4twgN2nxdCgSx6uFT';
describe('Metaplex.find', () => {
  it('Not found nft', async () => {
    await Metaplex.findByOwner(notFoundTokenOwner, (result) => {
      assert.isTrue(result.isOk);
      assert.isArray(result.unwrap());
    });
  });

  it('Find owner info', async () => {
    await Metaplex.findByOwner(owner, (result) => {
      result.match(
        (ok) => {
          assert.isNotEmpty(ok);
        },
        (err) => assert.fail(err.message)
      );
    });
  });

  it('Find owner info with Desc', async () => {
    await Metaplex.findByOwner(
      owner,
      (result) => {
        result.match(
          (ok) => {
            assert.isNotEmpty(ok);
          },
          (err) => assert.fail(err.message)
        );
      },
      Sortable.Desc
    );
  });

  it('Find owner info with Asc', async () => {
    await Metaplex.findByOwner(
      owner,
      (result) => {
        result.match(
          (ok) => {
            assert.isNotEmpty(ok);
          },
          (err) => assert.fail(err.message)
        );
      },
      Sortable.Asc
    );
  });
});
