import fs from 'fs';
import {Wallet} from '../../src/wallet';
import {Debug} from './debug';
import '../../src/util';

console.debug(`\u001b[33m === DEBUG MODE (${process.env.NODE_ENV}) ===`);

export namespace Setup {
  export const TEMP_KEYPAIR_FILE = `.solana-${process.env.NODE_ENV}-keypair`;

  export const generatekeyPair = async ():
    Promise<{source: Wallet.KeyPair, dest: Wallet.KeyPair}> => {
    const {source, dest} = await getSourceAndDest();
    Debug.display(source, dest);
    return {source: source, dest: dest};
  }

  const getSourceAndDest = async () => {
    if (fs.existsSync(TEMP_KEYPAIR_FILE)) {
      const obj = await loadTempFile();
      const sourceBalance = await Wallet.getBalance(obj.source.pubkey);
      const destBalance = await Wallet.getBalance(obj.dest.pubkey);
      console.debug(`# source balance: ${sourceBalance}`);
      console.debug(`# dest balance: ${destBalance}`);
      if (sourceBalance < 0.1 || destBalance < 0.1) {
        console.warn(`[Warning]source or dest balance is under 0.1 amount`);
        console.warn(`Reset setupKeyPair`);
        removeTempFile;
      }
      return obj;
    } else {
      return createTempFile();
    }
  }

  const removeTempFile = () => fs.rmSync(TEMP_KEYPAIR_FILE);

  const loadTempFile = async () => {
    const obj = JSON.parse(fs.readFileSync(TEMP_KEYPAIR_FILE, 'utf8'));
    return {source: obj.source, dest: obj.dest};
  }

  const createTempFile = async () => {
    const source = await Wallet.create();
    const dest = await Wallet.create();
    const data = templateKeyPair(source, dest);
    fs.writeFileSync(TEMP_KEYPAIR_FILE, JSON.stringify(data));
    return {source: source, dest: dest};
  }

  const templateKeyPair = (source: Wallet.KeyPair, dest: Wallet.KeyPair) => {
    return {
      source: {
        pubkey: source.pubkey,
        secret: source.secret,
      },
      dest: {
        pubkey: dest.pubkey,
        secret: dest.secret,
      },
    };
  }
}

export default TestUtils.setupKeyPair;
