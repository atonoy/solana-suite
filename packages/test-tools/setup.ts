import fs from 'node:fs';
import bs from 'bs58';
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { KeypairAccount } from '~/types/account';
import { Constants, debugLog, Pubkey, Secret } from '~/shared';
import { Node } from '~/node';
import { Account } from '~/account';
// import { CompressedNft } from '~/suite-compressed-nft';

console.log(`\u001b[33m === TEST START ===`);
console.log(`\u001b[33m solana-network: ${Constants.currentCluster}`);

export namespace Setup {
  const TEMP_KEYPAIR_FILE = `../../solana-${Constants.currentCluster}-keypair`;

  export const generateKeyPair = async (): Promise<{
    source: KeypairAccount;
    dest: KeypairAccount;
    treeOwner: Pubkey;
    collectionMint: Pubkey;
  }> => {
    const { source, dest, treeOwner, collectionMint } =
      await fetchSourceAndDest();
    log(source, dest);
    return {
      source: new Account.Keypair({
        pubkey: source.pubkey,
        secret: source.secret,
      }),
      dest: new Account.Keypair({ pubkey: dest.pubkey, secret: dest.secret }),
      treeOwner: treeOwner,
      collectionMint: collectionMint,
    };
  };

  const log = (source: KeypairAccount, dest: KeypairAccount) => {
    debugLog(`# source.pubkey:`, source.pubkey);
    debugLog(`# source.secret: `, source.secret);
    debugLog(`# destination.pubkey:`, dest.pubkey);
    debugLog(`# destination.secret: `, dest.secret);
  };

  const fetchSourceAndDest = async () => {
    if (fs.existsSync(TEMP_KEYPAIR_FILE)) {
      return await loadTempFile();
    } else {
      return createTempFile();
    }
  };

  const loadTempFile = async () => {
    const obj = JSON.parse(fs.readFileSync(TEMP_KEYPAIR_FILE, 'utf8'));
    const treeOwner = obj.treeOwner;
    const collectionMint = obj.collectionMint;
    return { source: obj.source, dest: obj.dest, treeOwner, collectionMint };
  };

  const requestAirdrop = async (pubkey: PublicKey) => {
    console.log('Now airdropping...please wait');
    const sig = await Node.getConnection().requestAirdrop(
      pubkey,
      LAMPORTS_PER_SOL,
    );
    await Node.confirmedSig(sig);
    console.log('Confirmed !!');
  };

  const createTempFile = async () => {
    const source = Keypair.generate();
    const dest = Keypair.generate();

    await requestAirdrop(source.publicKey);

    const sourceObject = new Account.Keypair({
      pubkey: source.publicKey.toBase58() as Pubkey,
      secret: bs.encode(source.secretKey) as Secret,
    });

    const destObject = new Account.Keypair({
      pubkey: dest.publicKey.toBase58() as Pubkey,
      secret: bs.encode(dest.secretKey) as Secret,
    });

    // const inst = await CompressedNft.initTree(sourceObject.secret);
    let data = {
      source: { pubkey: '', secret: '' },
      dest: { pubkey: '', secret: '' },
      treeOwner: '',
      collectionMint: '',
    };

    // (await inst.submit()).match(
    //   () => {
    //     data = templateKeyPair(sourceObject, destObject, inst.unwrap().data!);
    //   },
    //   (err) => {
    //     console.error('Failed init tree: ', err);
    //     data = templateKeyPair(sourceObject, destObject, '');
    //   },
    // );
    data = templateKeyPair(sourceObject, destObject, '', '');
    fs.writeFileSync(TEMP_KEYPAIR_FILE, JSON.stringify(data));
    return data;
  };

  const templateKeyPair = (
    source: KeypairAccount,
    dest: KeypairAccount,
    treeOwner: Pubkey,
    collectionMint: Pubkey,
  ) => {
    return {
      source: {
        pubkey: source.pubkey,
        secret: source.secret,
      },
      dest: {
        pubkey: dest.pubkey,
        secret: dest.secret,
      },
      treeOwner,
      collectionMint,
    };
  };
}
