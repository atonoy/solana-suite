// src/collection.ts
var Converter;
((Converter9) => {
  let Collection;
  ((Collection2) => {
    Collection2.intoInfraSide = (input) => {
      if (!input) {
        return null;
      }
      return {
        key: input.toPublicKey(),
        verified: false
      };
    };
    Collection2.intoUserSide = (output) => {
      if (!output) {
        return void 0;
      }
      return {
        address: output.key.toString(),
        verified: output.verified
      };
    };
  })(Collection = Converter9.Collection || (Converter9.Collection = {}));
})(Converter || (Converter = {}));

// src/creators.ts
var Converter2;
((Converter9) => {
  let Creators;
  ((Creators2) => {
    Creators2.intoInfraSide = (input) => {
      if (!input) {
        return null;
      }
      return input.map((data) => {
        let modify = null;
        modify = {
          address: data.address.toPublicKey(),
          share: data.share,
          verified: data.verified
        };
        return modify;
      });
    };
    Creators2.intoUserSide = (output) => {
      if (!output) {
        return void 0;
      }
      return output.map((data) => {
        const modify = {
          address: data.address.toString(),
          share: data.share,
          verified: data.verified
        };
        return modify;
      });
    };
  })(Creators = Converter9.Creators || (Converter9.Creators = {}));
})(Converter2 || (Converter2 = {}));

// src/uses.ts
var Converter3;
((Converter9) => {
  let Uses;
  ((Uses2) => {
    Uses2.intoUserSide = (output) => {
      if (!output) {
        return void 0;
      }
      return output;
    };
  })(Uses = Converter9.Uses || (Converter9.Uses = {}));
})(Converter3 || (Converter3 = {}));

// ../shared/src/constants.ts
import { PublicKey } from "@solana/web3.js";
import Config from "@solana-suite/config";
var Constants;
((Constants2) => {
  Constants2.currentCluster = Config.cluster.type;
  Constants2.customClusterUrl = Config.cluster.customClusterUrl;
  Constants2.isDebugging = Config.debugging;
  Constants2.nftStorageApiKey = Config.nftstorage.apikey;
  let Cluster;
  ((Cluster2) => {
    Cluster2["prd"] = "mainnet-beta";
    Cluster2["prdMetaplex"] = "mainnet-beta-metaplex";
    Cluster2["dev"] = "devnet";
    Cluster2["test"] = "testnet";
    Cluster2["localhost"] = "localhost-devnet";
  })(Cluster = Constants2.Cluster || (Constants2.Cluster = {}));
  let EndPointUrl;
  ((EndPointUrl2) => {
    EndPointUrl2["prd"] = "https://api.mainnet-beta.solana.com";
    EndPointUrl2["prdMetaplex"] = "https://api.metaplex.solana.com";
    EndPointUrl2["dev"] = "https://api.devnet.solana.com";
    EndPointUrl2["test"] = "https://api.testnet.solana.com";
    EndPointUrl2["localhost"] = "http://api.devnet.solana.com";
  })(EndPointUrl = Constants2.EndPointUrl || (Constants2.EndPointUrl = {}));
  Constants2.switchCluster = (param) => {
    const { cluster: env, customClusterUrl: customClusterUrl2 } = param;
    if (customClusterUrl2 && customClusterUrl2.length > 0) {
      const index = Date.now() % customClusterUrl2.length;
      return customClusterUrl2[index];
    }
    switch (env) {
      case "mainnet-beta" /* prd */:
        return "https://api.mainnet-beta.solana.com" /* prd */;
      case "mainnet-beta-metaplex" /* prdMetaplex */:
        return "https://api.metaplex.solana.com" /* prdMetaplex */;
      case "testnet" /* test */:
        return "https://api.testnet.solana.com" /* test */;
      case "devnet" /* dev */:
        return "https://api.devnet.solana.com" /* dev */;
      default:
        return "http://api.devnet.solana.com" /* localhost */;
    }
  };
  Constants2.switchBundlr = (env) => {
    switch (env) {
      case "devnet" /* dev */:
      case "testnet" /* test */:
      case "localhost-devnet" /* localhost */:
        return "https://devnet.bundlr.network";
      default: {
        const index = Date.now() % 2;
        const clusters = [
          "https://node1.bundlr.network",
          "https://node2.bundlr.network"
        ];
        return clusters[index];
      }
    }
  };
  Constants2.WRAPPED_TOKEN_PROGRAM_ID = new PublicKey(
    "So11111111111111111111111111111111111111112"
  );
  Constants2.MEMO_PROGRAM_ID = new PublicKey(
    "Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo"
  );
  Constants2.METAPLEX_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );
  Constants2.COMMITMENT = "confirmed";
  Constants2.NFT_STORAGE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweERGMjcyN2VkODZhRGU1RTMyZDZDZEJlODc0YzRFNDlEODY1OWZmOEMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyMDI2NDk0MzcwNiwibmFtZSI6ImRlbW8ifQ.d4J70mikxRB8a5vwNu6SO5HDA8JaueuseAj7Q_ytMCE";
  Constants2.NFT_STORAGE_GATEWAY_URL = "https://ipfs.io/ipfs";
  Constants2.BUNDLR_NETWORK_URL = (0, Constants2.switchBundlr)(Config.cluster.type);
})(Constants || (Constants = {}));

// ../shared/src/result.ts
var AbstractResult = class {
  // unified-signatures. into line 10
  // unwrap<U>(ok: (value: T) => U, err: (error: E) => U): U;
  unwrap(ok, err) {
    const r = this._chain(
      (value) => Result.ok(ok ? ok(value) : value),
      (error) => err ? Result.ok(err(error)) : Result.err(error)
    );
    if (r.isErr) {
      throw r.error;
    }
    return r.value;
  }
  map(ok, err) {
    return this._chain(
      (value) => Result.ok(ok(value)),
      (error) => Result.err(err ? err(error) : error)
    );
  }
  chain(ok, err) {
    return this._chain(ok, err || ((error) => Result.err(error)));
  }
  match(ok, err) {
    this._chain(
      (value) => Result.ok(ok(value)),
      (error) => Result.err(err(error))
    );
  }
  /// submit (alias Instruction.submit) ////
  async submit() {
    try {
      const instruction = this.unwrap();
      if (instruction.instructions && instruction.signers) {
        return await instruction.submit();
      }
      return Result.err(Error("Only Instruction object"));
    } catch (err) {
      return Result.err(err);
    }
  }
};
var InternalOk = class extends AbstractResult {
  constructor(value) {
    super();
    this.value = value;
  }
  isOk = true;
  isErr = false;
  /* eslint-disable @typescript-eslint/no-unused-vars */
  _chain(ok, _err) {
    return ok(this.value);
  }
};
var InternalErr = class extends AbstractResult {
  constructor(error) {
    super();
    this.error = error;
  }
  isOk = false;
  isErr = true;
  _chain(_ok, err) {
    return err(this.error);
  }
};
var Result;
((Result6) => {
  function ok(value) {
    return new InternalOk(value);
  }
  Result6.ok = ok;
  function err(error) {
    return new InternalErr(error || Error());
  }
  Result6.err = err;
  function all(obj) {
    if (Array.isArray(obj)) {
      const resArr = [];
      for (const item of obj) {
        if (item.isErr) {
          return item;
        }
        resArr.push(item.value);
      }
      return Result6.ok(resArr);
    }
    const res = {};
    const keys = Object.keys(obj);
    for (const key of keys) {
      const item = obj[key];
      if (item.isErr) {
        return item;
      }
      res[key] = item.value;
    }
    return Result6.ok(res);
  }
  Result6.all = all;
})(Result || (Result = {}));

// ../shared/src/shared.ts
var overwriteObject = (object, targets) => {
  const that = object;
  targets.forEach((target) => {
    delete that[target.existsKey];
    that[target.will.key] = target.will.value;
  });
  return that;
};
var debugLog = (data1, data2 = "", data3 = "", data4 = "") => {
  if (Constants.isDebugging === "true" || process.env.DEBUG === "true") {
    console.log("[DEBUG]", data1, data2, data3, data4);
  }
};
var sleep = async (sec) => {
  return new Promise((r) => setTimeout(r, sec * 1e3));
};
var isPromise = (obj) => {
  return !!obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
};
function Try(input, finallyInput) {
  try {
    const v = input();
    if (isPromise(v)) {
      return v.then(
        (x) => Result.ok(x),
        (err) => Result.err(err)
      );
    } else {
      return Result.ok(v);
    }
  } catch (e) {
    if (e instanceof Error) {
      return Result.err(e);
    }
    return Result.err(Error(e));
  } finally {
    if (finallyInput) {
      debugLog("# finally input:", finallyInput);
      finallyInput();
    }
  }
}
var convertTimestampToDateTime = (created_at) => {
  if (created_at) {
    return new Date(created_at * 1e3);
  }
  return;
};

// ../global/src/index.ts
import { Keypair as Keypair4, LAMPORTS_PER_SOL, PublicKey as PublicKey4 } from "@solana/web3.js";

// ../node/src/index.ts
import { Connection } from "@solana/web3.js";
var Node;
((Node2) => {
  const setted = {
    clusterUrl: "",
    commitment: Constants.COMMITMENT,
    customClusterUrl: []
  };
  Node2.getConnection = () => {
    debugLog("# [Before] setted:", setted);
    debugLog(
      "# [Before] Constants.customClusterUrl:",
      Constants.customClusterUrl
    );
    if (setted.customClusterUrl.length > 0) {
      setted.clusterUrl = Constants.switchCluster({
        customClusterUrl: setted.customClusterUrl
      });
    } else if (Constants.customClusterUrl.length > 0) {
      setted.clusterUrl = Constants.switchCluster({
        customClusterUrl: Constants.customClusterUrl
      });
    } else if (!setted.clusterUrl) {
      setted.clusterUrl = Constants.switchCluster({
        cluster: Constants.currentCluster
      });
    }
    if (!setted.commitment) {
      setted.commitment = Constants.COMMITMENT;
    }
    debugLog("# [After] setted:", setted);
    return new Connection(setted.clusterUrl, setted.commitment);
  };
  Node2.changeConnection = (param) => {
    setted.clusterUrl = "";
    setted.customClusterUrl = [];
    setted.commitment = Constants.COMMITMENT;
    const { cluster, commitment, customClusterUrl } = param;
    if (commitment) {
      setted.commitment = commitment;
      debugLog("# Node change commitment: ", setted.commitment);
    }
    if (cluster) {
      setted.clusterUrl = Constants.switchCluster({ cluster });
      debugLog("# Node change clusterUrl: ", setted.clusterUrl);
    }
    if (customClusterUrl) {
      debugLog("# customClusterUrl: ", customClusterUrl);
      setted.clusterUrl = Constants.switchCluster({ customClusterUrl });
      setted.customClusterUrl = customClusterUrl;
      debugLog(
        "# Node change cluster, custom cluster url: ",
        setted.clusterUrl
      );
    }
  };
  Node2.confirmedSig = async (signature, commitment = Constants.COMMITMENT) => {
    const connection = Node2.getConnection();
    const latestBlockhash = await connection.getLatestBlockhash();
    return await connection.confirmTransaction(
      {
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        signature
      },
      commitment
    ).then(Result.ok).catch(Result.err);
  };
})(Node || (Node = {}));

// ../instruction/src/instruction/index.ts
import {
  sendAndConfirmTransaction as sendAndConfirmTransaction2,
  Transaction as Transaction2
} from "@solana/web3.js";

// ../instruction/src/instruction/define.ts
var MAX_RETRIES = 3;

// ../instruction/src/instruction/batch-submit.ts
import {
  sendAndConfirmTransaction,
  Transaction
} from "@solana/web3.js";
var Instruction = class {
  static batchSubmit = async (arr) => {
    let i = 0;
    for (const a of arr) {
      if (!a.instructions && !a.signers) {
        throw Error(
          `only Instruction object that can use batchSubmit().
            Index: ${i}, Set value: ${JSON.stringify(a)}`
        );
      }
      i++;
    }
    const instructions = arr.flatMap((a) => a.instructions);
    const signers = arr.flatMap((a) => a.signers);
    const feePayers = arr.filter((a) => a.feePayer !== void 0);
    let feePayer = signers[0];
    if (feePayers.length > 0 && feePayers[0].feePayer) {
      feePayer = feePayers[0].feePayer;
    }
    const transaction = new Transaction();
    let finalSigners = signers;
    if (feePayer) {
      transaction.feePayer = feePayer.publicKey;
      finalSigners = [feePayer, ...signers];
    }
    instructions.map((inst) => transaction.add(inst));
    const options = {
      maxRetries: MAX_RETRIES
    };
    return await sendAndConfirmTransaction(
      Node.getConnection(),
      transaction,
      finalSigners,
      options
    );
  };
};

// ../instruction/src/instruction/index.ts
var Instruction2 = class _Instruction {
  instructions;
  signers;
  feePayer;
  data;
  constructor(instructions, signers, feePayer, data) {
    this.instructions = instructions;
    this.signers = signers;
    this.feePayer = feePayer;
    this.data = data;
  }
  submit = async () => {
    return Try(async () => {
      if (!(this instanceof _Instruction)) {
        throw Error("only Instruction object that can use this");
      }
      const transaction = new Transaction2();
      const blockhashObj = await Node.getConnection().getLatestBlockhash();
      transaction.lastValidBlockHeight = blockhashObj.lastValidBlockHeight;
      transaction.recentBlockhash = blockhashObj.blockhash;
      let finalSigners = this.signers;
      if (this.feePayer) {
        transaction.feePayer = this.feePayer.publicKey;
        finalSigners = [this.feePayer, ...this.signers];
      }
      this.instructions.forEach((inst) => transaction.add(inst));
      const options = {
        maxRetries: MAX_RETRIES
      };
      return await sendAndConfirmTransaction2(
        Node.getConnection(),
        transaction,
        finalSigners,
        options
      );
    });
  };
};
Array.prototype.submit = async function() {
  const instructions = [];
  return Try(async () => {
    let i = 0;
    for (const obj of this) {
      if (obj.isErr) {
        const errorMess = obj.error.message;
        throw Error(`[Array index of caught 'Result.err': ${i}]${errorMess}`);
      } else if (obj.isOk) {
        instructions.push(obj.value);
      } else {
        instructions.push(obj);
      }
      i++;
    }
    return Instruction.batchSubmit(instructions);
  });
};

// ../instruction/src/mint-instruction.ts
import {
  sendAndConfirmTransaction as sendAndConfirmTransaction3,
  Transaction as Transaction3
} from "@solana/web3.js";

// ../instruction/src/partial-signInstruction.ts
import {
  Transaction as Transaction4
} from "@solana/web3.js";

// ../account/src/associated-account.ts
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError
} from "@solana/spl-token";

// ../account/src/keypair-account.ts
import { Keypair as Keypair3, PublicKey as PublicKey2 } from "@solana/web3.js";
import bs from "bs58";
var KeypairAccount = class _KeypairAccount {
  secret;
  pubkey;
  constructor(params) {
    if (!params.pubkey) {
      const keypair = params.secret.toKeypair();
      this.pubkey = keypair.publicKey.toString();
    } else {
      this.pubkey = params.pubkey;
    }
    this.secret = params.secret;
  }
  toPublicKey() {
    return new PublicKey2(this.pubkey);
  }
  toKeypair() {
    const decoded = bs.decode(this.secret);
    return Keypair3.fromSecretKey(decoded);
  }
  static isPubkey = (value) => /^[0-9a-zA-Z]{32,44}$/.test(value);
  static isSecret = (value) => /^[0-9a-zA-Z]{87,88}$/.test(value);
  static create = () => {
    const keypair = Keypair3.generate();
    return new _KeypairAccount({
      pubkey: keypair.publicKey.toString(),
      secret: bs.encode(keypair.secretKey)
    });
  };
  static toKeyPair = (keypair) => {
    return new _KeypairAccount({
      pubkey: keypair.publicKey.toString(),
      secret: bs.encode(keypair.secretKey)
    });
  };
};

// ../account/src/associated-account.ts
var AssociatedAccount;
((AssociatedAccount2) => {
  const RETRY_OVER_LIMIT = 10;
  const RETRY_SLEEP_TIME = 3;
  const get = async (mint, owner, feePayer, allowOwnerOffCurve = false) => {
    const res = await (0, AssociatedAccount2.makeOrCreateInstruction)(
      mint,
      owner,
      new KeypairAccount({ secret: feePayer }).pubkey,
      allowOwnerOffCurve
    );
    if (!res.inst) {
      return res.tokenAccount;
    }
    return new Instruction2(
      [res.inst],
      [],
      feePayer.toKeypair(),
      res.tokenAccount
    );
  };
  AssociatedAccount2.retryGetOrCreate = async (mint, owner, feePayer) => {
    let counter = 1;
    while (counter < RETRY_OVER_LIMIT) {
      try {
        const inst = await get(mint, owner, feePayer, true);
        if (inst && typeof inst === "string") {
          debugLog("# associatedTokenAccount: ", inst);
          return inst;
        } else if (inst instanceof Instruction2) {
          (await inst.submit()).map(
            async (ok) => {
              await Node.confirmedSig(ok);
              return inst.data;
            },
            (err) => {
              debugLog("# Error submit retryGetOrCreate: ", err);
              throw err;
            }
          );
        }
      } catch (e) {
        debugLog(`# retry: ${counter} create token account: `, e);
        debugLog(`# mint: ${mint}, owner: ${owner}, feePayer: ${feePayer}`);
      }
      await sleep(RETRY_SLEEP_TIME);
      counter++;
    }
    throw Error(`retry action is over limit ${RETRY_OVER_LIMIT}`);
  };
  AssociatedAccount2.makeOrCreateInstruction = async (mint, owner, feePayer, allowOwnerOffCurve = false) => {
    const associatedTokenAccount = getAssociatedTokenAddressSync(
      mint.toPublicKey(),
      owner.toPublicKey(),
      allowOwnerOffCurve,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    debugLog("# associatedTokenAccount: ", associatedTokenAccount.toString());
    try {
      await getAccount(
        Node.getConnection(),
        associatedTokenAccount,
        Node.getConnection().commitment,
        TOKEN_PROGRAM_ID
      );
      return {
        tokenAccount: associatedTokenAccount.toString(),
        inst: void 0
      };
    } catch (error) {
      if (!(error instanceof TokenAccountNotFoundError) && !(error instanceof TokenInvalidAccountOwnerError)) {
        throw Error("Unexpected error");
      }
      const payer = !feePayer ? owner : feePayer;
      const inst = createAssociatedTokenAccountInstruction(
        payer.toPublicKey(),
        associatedTokenAccount,
        owner.toPublicKey(),
        mint.toPublicKey(),
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      return {
        tokenAccount: associatedTokenAccount.toString(),
        inst
      };
    }
  };
})(AssociatedAccount || (AssociatedAccount = {}));

// ../account/src/pda.ts
import { PublicKey as PublicKey3 } from "@solana/web3.js";
import { PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
var Pda;
((Pda2) => {
  Pda2.getMetadata = (mint) => {
    const [publicKey] = PublicKey3.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        PROGRAM_ID.toBuffer(),
        mint.toPublicKey().toBuffer()
      ],
      PROGRAM_ID
    );
    return publicKey;
  };
  Pda2.getMasterEdition = (mint) => {
    const [publicKey] = PublicKey3.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        PROGRAM_ID.toBuffer(),
        mint.toPublicKey().toBuffer(),
        Buffer.from("edition")
      ],
      PROGRAM_ID
    );
    return publicKey;
  };
})(Pda || (Pda = {}));

// ../global/src/index.ts
import { BigNumber } from "bignumber.js";
import bs2 from "bs58";
String.prototype.toExplorerUrl = function(explorer = "solscan" /* Solscan */) {
  const endPointUrl = Node.getConnection().rpcEndpoint;
  debugLog("# toExplorerUrl rpcEndpoint:", endPointUrl);
  let cluster = "";
  if (endPointUrl === Constants.EndPointUrl.prd) {
    cluster = Constants.Cluster.prd;
  } else if (endPointUrl === Constants.EndPointUrl.test) {
    cluster = Constants.Cluster.test;
  } else if (endPointUrl === Constants.EndPointUrl.dev) {
    cluster = Constants.Cluster.dev;
  } else {
    cluster = Constants.Cluster.dev;
  }
  const addressOrSignature = this.toString();
  let url = "";
  if (KeypairAccount.isPubkey(addressOrSignature)) {
    if (explorer === "solanafm" /* SolanaFM */) {
      url = `https://solana.fm/address/${addressOrSignature}?cluster=${cluster}`;
    } else {
      url = `https://solscan.io/account/${addressOrSignature}?cluster=${cluster}`;
    }
  } else {
    if (explorer === "solanafm" /* SolanaFM */) {
      url = `https://solana.fm/tx/${addressOrSignature}?cluster=${cluster}`;
    } else {
      url = `https://solscan.io/tx/${addressOrSignature}?cluster=${cluster}`;
    }
  }
  return url;
};
String.prototype.toPublicKey = function() {
  if (!KeypairAccount.isPubkey(this.toString())) {
    throw Error(`No match KeyPair.PubKey: ${this.toString()}`);
  }
  return new PublicKey4(this);
};
String.prototype.toKeypair = function() {
  if (!KeypairAccount.isSecret(this.toString())) {
    throw Error(`No match KeyPair.Secret: ${this.toString()}`);
  }
  const decoded = bs2.decode(this);
  return Keypair4.fromSecretKey(decoded);
};
Number.prototype.toSol = function() {
  return BigNumber(this).div(LAMPORTS_PER_SOL).toNumber();
};
Number.prototype.toLamports = function() {
  return BigNumber(this).times(LAMPORTS_PER_SOL).toNumber();
};

// src/token-metadata.ts
var Converter4;
((Converter9) => {
  let TokenMetadata;
  ((TokenMetadata2) => {
    TokenMetadata2.intoInfraSide = (input, uri, sellerFeeBasisPoints) => {
      return {
        name: input.name,
        symbol: input.symbol,
        uri,
        sellerFeeBasisPoints,
        creators: Converter2.Creators.intoInfraSide(input.creators),
        collection: null,
        uses: input.uses || null
      };
    };
    TokenMetadata2.intoUserSide = (output, tokenAmount) => {
      return {
        mint: output.onchain.mint.toString(),
        royalty: output.onchain.data.sellerFeeBasisPoints,
        name: (0, TokenMetadata2.deleteNullStrings)(output.onchain.data.name),
        symbol: (0, TokenMetadata2.deleteNullStrings)(output.onchain.data.symbol),
        tokenAmount,
        uri: (0, TokenMetadata2.deleteNullStrings)(output.onchain.data.uri),
        creators: Converter2.Creators.intoUserSide(output.onchain.data.creators),
        uses: Converter3.Uses.intoUserSide(output.onchain.uses),
        dateTime: convertTimestampToDateTime(output.offchain.created_at),
        offchain: output.offchain
      };
    };
    TokenMetadata2.deleteNullStrings = (str) => {
      return str.replace(/\0/g, "");
    };
  })(TokenMetadata = Converter9.TokenMetadata || (Converter9.TokenMetadata = {}));
})(Converter4 || (Converter4 = {}));

// src/nft-metadata.ts
var Converter5;
((Converter9) => {
  let NftMetadata;
  ((NftMetadata2) => {
    NftMetadata2.intoInfraSide = (input, uri, sellerFeeBasisPoints) => {
      return {
        name: input.name,
        symbol: input.symbol,
        uri,
        sellerFeeBasisPoints,
        creators: Converter2.Creators.intoInfraSide(input.creators),
        collection: Converter.Collection.intoInfraSide(input.collection),
        uses: input.uses || null
      };
    };
    NftMetadata2.intoUserSide = (output, tokenAmount) => {
      return {
        mint: output.onchain.mint.toString(),
        updateAuthority: output.onchain.updateAuthority.toString(),
        royalty: output.onchain.data.sellerFeeBasisPoints,
        name: Converter4.TokenMetadata.deleteNullStrings(output.onchain.data.name),
        symbol: Converter4.TokenMetadata.deleteNullStrings(
          output.onchain.data.symbol
        ),
        tokenAmount,
        uri: Converter4.TokenMetadata.deleteNullStrings(output.onchain.data.uri),
        isMutable: output.onchain.isMutable,
        primarySaleHappened: output.onchain.primarySaleHappened,
        creators: Converter2.Creators.intoUserSide(output.onchain.data.creators),
        editionNonce: output.onchain.editionNonce,
        collection: Converter.Collection.intoUserSide(
          output.onchain.collection
        ),
        uses: Converter3.Uses.intoUserSide(output.onchain.uses),
        dateTime: convertTimestampToDateTime(output.offchain.created_at),
        offchain: output.offchain
      };
    };
  })(NftMetadata = Converter9.NftMetadata || (Converter9.NftMetadata = {}));
})(Converter5 || (Converter5 = {}));

// src/properties.ts
var Converter6;
((Converter9) => {
  let Properties;
  ((Properties2) => {
    Properties2.intoInfraSide = async (input, storageFunc, storageType, feePayer) => {
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
              existsKey: "filePath",
              will: { key: "uri", value: res.value }
            }
          ]);
        })
      );
      return { ...input, files };
    };
  })(Properties = Converter9.Properties || (Converter9.Properties = {}));
})(Converter6 || (Converter6 = {}));

// src/royalty.ts
var Converter7;
((Converter9) => {
  let Royalty;
  ((Royalty2) => {
    Royalty2.THRESHOLD = 100;
    Royalty2.intoInfraSide = (percentage) => {
      return percentage * Royalty2.THRESHOLD;
    };
  })(Royalty = Converter9.Royalty || (Converter9.Royalty = {}));
})(Converter7 || (Converter7 = {}));

// src/index.ts
var Converter8 = {
  ...Converter,
  ...Converter2,
  ...Converter5,
  ...Converter6,
  ...Converter7,
  ...Converter4,
  ...Converter3
};
export {
  Converter8 as Converter
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL2NvbGxlY3Rpb24udHMiLCAiLi4vc3JjL2NyZWF0b3JzLnRzIiwgIi4uL3NyYy91c2VzLnRzIiwgIi4uLy4uL3NoYXJlZC9zcmMvY29uc3RhbnRzLnRzIiwgIi4uLy4uL3NoYXJlZC9zcmMvcmVzdWx0LnRzIiwgIi4uLy4uL3NoYXJlZC9zcmMvc2hhcmVkLnRzIiwgIi4uLy4uL2dsb2JhbC9zcmMvaW5kZXgudHMiLCAiLi4vLi4vbm9kZS9zcmMvaW5kZXgudHMiLCAiLi4vLi4vaW5zdHJ1Y3Rpb24vc3JjL2luc3RydWN0aW9uL2luZGV4LnRzIiwgIi4uLy4uL2luc3RydWN0aW9uL3NyYy9pbnN0cnVjdGlvbi9kZWZpbmUudHMiLCAiLi4vLi4vaW5zdHJ1Y3Rpb24vc3JjL2luc3RydWN0aW9uL2JhdGNoLXN1Ym1pdC50cyIsICIuLi8uLi9pbnN0cnVjdGlvbi9zcmMvbWludC1pbnN0cnVjdGlvbi50cyIsICIuLi8uLi9pbnN0cnVjdGlvbi9zcmMvcGFydGlhbC1zaWduSW5zdHJ1Y3Rpb24udHMiLCAiLi4vLi4vYWNjb3VudC9zcmMvYXNzb2NpYXRlZC1hY2NvdW50LnRzIiwgIi4uLy4uL2FjY291bnQvc3JjL2tleXBhaXItYWNjb3VudC50cyIsICIuLi8uLi9hY2NvdW50L3NyYy9wZGEudHMiLCAiLi4vc3JjL3Rva2VuLW1ldGFkYXRhLnRzIiwgIi4uL3NyYy9uZnQtbWV0YWRhdGEudHMiLCAiLi4vc3JjL3Byb3BlcnRpZXMudHMiLCAiLi4vc3JjL3JveWFsdHkudHMiLCAiLi4vc3JjL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQge1xuICBJbmZyYVNpZGVJbnB1dCxcbiAgSW5mcmFTaWRlT3V0cHV0LFxuICBPcHRpb24sXG4gIFVzZXJTaWRlSW5wdXQsXG4gIFVzZXJTaWRlT3V0cHV0LFxufSBmcm9tICd+L3R5cGVzL2NvbnZlcnRlcic7XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ29udmVydGVyIHtcbiAgZXhwb3J0IG5hbWVzcGFjZSBDb2xsZWN0aW9uIHtcbiAgICBleHBvcnQgY29uc3QgaW50b0luZnJhU2lkZSA9IChcbiAgICAgIGlucHV0OiBPcHRpb248VXNlclNpZGVJbnB1dC5Db2xsZWN0aW9uPiB8IHVuZGVmaW5lZCxcbiAgICApOiBPcHRpb248SW5mcmFTaWRlSW5wdXQuQ29sbGVjdGlvbj4gPT4ge1xuICAgICAgaWYgKCFpbnB1dCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2V5OiBpbnB1dC50b1B1YmxpY0tleSgpLFxuICAgICAgICB2ZXJpZmllZDogZmFsc2UsXG4gICAgICB9O1xuICAgIH07XG5cbiAgICBleHBvcnQgY29uc3QgaW50b1VzZXJTaWRlID0gKFxuICAgICAgb3V0cHV0OiBPcHRpb248SW5mcmFTaWRlT3V0cHV0LkNvbGxlY3Rpb24+LFxuICAgICk6IFVzZXJTaWRlT3V0cHV0LkNvbGxlY3Rpb24gfCB1bmRlZmluZWQgPT4ge1xuICAgICAgaWYgKCFvdXRwdXQpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYWRkcmVzczogb3V0cHV0LmtleS50b1N0cmluZygpLFxuICAgICAgICB2ZXJpZmllZDogb3V0cHV0LnZlcmlmaWVkLFxuICAgICAgfTtcbiAgICB9O1xuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgSW5mcmFTaWRlSW5wdXQsXG4gIEluZnJhU2lkZU91dHB1dCxcbiAgT3B0aW9uLFxuICBVc2VyU2lkZUlucHV0LFxuICBVc2VyU2lkZU91dHB1dCxcbn0gZnJvbSAnfi90eXBlcy9jb252ZXJ0ZXInO1xuXG5leHBvcnQgbmFtZXNwYWNlIENvbnZlcnRlciB7XG4gIGV4cG9ydCBuYW1lc3BhY2UgQ3JlYXRvcnMge1xuICAgIGV4cG9ydCBjb25zdCBpbnRvSW5mcmFTaWRlID0gKFxuICAgICAgaW5wdXQ6IE9wdGlvbjxVc2VyU2lkZUlucHV0LkNyZWF0b3JzW10+IHwgdW5kZWZpbmVkLFxuICAgICk6IE9wdGlvbjxJbmZyYVNpZGVJbnB1dC5DcmVhdG9yc1tdPiA9PiB7XG4gICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGlucHV0Lm1hcCgoZGF0YSkgPT4ge1xuICAgICAgICBsZXQgbW9kaWZ5OiBPcHRpb248SW5mcmFTaWRlSW5wdXQuQ3JlYXRvcnM+ID0gbnVsbDtcbiAgICAgICAgbW9kaWZ5ID0ge1xuICAgICAgICAgIGFkZHJlc3M6IGRhdGEuYWRkcmVzcy50b1B1YmxpY0tleSgpLFxuICAgICAgICAgIHNoYXJlOiBkYXRhLnNoYXJlLFxuICAgICAgICAgIHZlcmlmaWVkOiBkYXRhLnZlcmlmaWVkLFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2RpZnk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgZXhwb3J0IGNvbnN0IGludG9Vc2VyU2lkZSA9IChcbiAgICAgIG91dHB1dDogT3B0aW9uPEluZnJhU2lkZU91dHB1dC5DcmVhdG9yW10+LFxuICAgICk6IFVzZXJTaWRlT3V0cHV0LkNyZWF0b3JzW10gfCB1bmRlZmluZWQgPT4ge1xuICAgICAgaWYgKCFvdXRwdXQpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dHB1dC5tYXAoKGRhdGEpID0+IHtcbiAgICAgICAgY29uc3QgbW9kaWZ5ID0ge1xuICAgICAgICAgIGFkZHJlc3M6IGRhdGEuYWRkcmVzcy50b1N0cmluZygpLFxuICAgICAgICAgIHNoYXJlOiBkYXRhLnNoYXJlLFxuICAgICAgICAgIHZlcmlmaWVkOiBkYXRhLnZlcmlmaWVkLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gbW9kaWZ5O1xuICAgICAgfSk7XG4gICAgfTtcbiAgfVxufVxuIiwgImltcG9ydCB7IEluZnJhU2lkZU91dHB1dCwgT3B0aW9uLCBVc2VyU2lkZU91dHB1dCB9IGZyb20gJ34vdHlwZXMvY29udmVydGVyJztcblxuZXhwb3J0IG5hbWVzcGFjZSBDb252ZXJ0ZXIge1xuICBleHBvcnQgbmFtZXNwYWNlIFVzZXMge1xuICAgIGV4cG9ydCBjb25zdCBpbnRvVXNlclNpZGUgPSAoXG4gICAgICBvdXRwdXQ6IE9wdGlvbjxJbmZyYVNpZGVPdXRwdXQuVXNlcz4sXG4gICAgKTogVXNlclNpZGVPdXRwdXQuVXNlcyB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICBpZiAoIW91dHB1dCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9O1xuICB9XG59XG4iLCAiaW1wb3J0IHsgQ29tbWl0bWVudCwgUHVibGljS2V5IH0gZnJvbSAnQHNvbGFuYS93ZWIzLmpzJztcbmltcG9ydCBDb25maWcgZnJvbSAnQHNvbGFuYS1zdWl0ZS9jb25maWcnO1xuXG4vLyBXQVJOSU5HOiBOb3QgdG8gYmUgYSBjaXJjdWxhciByZWZlcmVuY2VcbmV4cG9ydCBuYW1lc3BhY2UgQ29uc3RhbnRzIHtcbiAgZXhwb3J0IGNvbnN0IGN1cnJlbnRDbHVzdGVyID0gQ29uZmlnLmNsdXN0ZXIudHlwZTtcbiAgZXhwb3J0IGNvbnN0IGN1c3RvbUNsdXN0ZXJVcmwgPSBDb25maWcuY2x1c3Rlci5jdXN0b21DbHVzdGVyVXJsO1xuICBleHBvcnQgY29uc3QgaXNEZWJ1Z2dpbmcgPSBDb25maWcuZGVidWdnaW5nO1xuICBleHBvcnQgY29uc3QgbmZ0U3RvcmFnZUFwaUtleSA9IENvbmZpZy5uZnRzdG9yYWdlLmFwaWtleTtcblxuICBleHBvcnQgZW51bSBDbHVzdGVyIHtcbiAgICBwcmQgPSAnbWFpbm5ldC1iZXRhJyxcbiAgICBwcmRNZXRhcGxleCA9ICdtYWlubmV0LWJldGEtbWV0YXBsZXgnLFxuICAgIGRldiA9ICdkZXZuZXQnLFxuICAgIHRlc3QgPSAndGVzdG5ldCcsXG4gICAgbG9jYWxob3N0ID0gJ2xvY2FsaG9zdC1kZXZuZXQnLFxuICB9XG5cbiAgZXhwb3J0IGVudW0gRW5kUG9pbnRVcmwge1xuICAgIHByZCA9ICdodHRwczovL2FwaS5tYWlubmV0LWJldGEuc29sYW5hLmNvbScsXG4gICAgcHJkTWV0YXBsZXggPSAnaHR0cHM6Ly9hcGkubWV0YXBsZXguc29sYW5hLmNvbScsXG4gICAgZGV2ID0gJ2h0dHBzOi8vYXBpLmRldm5ldC5zb2xhbmEuY29tJyxcbiAgICB0ZXN0ID0gJ2h0dHBzOi8vYXBpLnRlc3RuZXQuc29sYW5hLmNvbScsXG4gICAgbG9jYWxob3N0ID0gJ2h0dHA6Ly9hcGkuZGV2bmV0LnNvbGFuYS5jb20nLFxuICB9XG5cbiAgZXhwb3J0IGNvbnN0IHN3aXRjaENsdXN0ZXIgPSAocGFyYW06IHtcbiAgICBjbHVzdGVyPzogc3RyaW5nO1xuICAgIGN1c3RvbUNsdXN0ZXJVcmw/OiBzdHJpbmdbXTtcbiAgfSk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgeyBjbHVzdGVyOiBlbnYsIGN1c3RvbUNsdXN0ZXJVcmwgfSA9IHBhcmFtO1xuXG4gICAgLy8gaWYgc2V0dGVkIGN1c3RvbSB1cmwsIG1vc3QgcHJpb3JpdHlcbiAgICBpZiAoY3VzdG9tQ2x1c3RlclVybCAmJiBjdXN0b21DbHVzdGVyVXJsLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gRGF0ZS5ub3coKSAlIGN1c3RvbUNsdXN0ZXJVcmwubGVuZ3RoO1xuICAgICAgcmV0dXJuIGN1c3RvbUNsdXN0ZXJVcmxbaW5kZXhdO1xuICAgIH1cblxuICAgIHN3aXRjaCAoZW52KSB7XG4gICAgICBjYXNlIENvbnN0YW50cy5DbHVzdGVyLnByZDpcbiAgICAgICAgcmV0dXJuIENvbnN0YW50cy5FbmRQb2ludFVybC5wcmQ7XG4gICAgICBjYXNlIENvbnN0YW50cy5DbHVzdGVyLnByZE1ldGFwbGV4OlxuICAgICAgICByZXR1cm4gQ29uc3RhbnRzLkVuZFBvaW50VXJsLnByZE1ldGFwbGV4O1xuICAgICAgY2FzZSBDb25zdGFudHMuQ2x1c3Rlci50ZXN0OlxuICAgICAgICByZXR1cm4gQ29uc3RhbnRzLkVuZFBvaW50VXJsLnRlc3Q7XG4gICAgICBjYXNlIENvbnN0YW50cy5DbHVzdGVyLmRldjpcbiAgICAgICAgcmV0dXJuIENvbnN0YW50cy5FbmRQb2ludFVybC5kZXY7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gQ29uc3RhbnRzLkVuZFBvaW50VXJsLmxvY2FsaG9zdDtcbiAgICB9XG4gIH07XG5cbiAgZXhwb3J0IGNvbnN0IHN3aXRjaEJ1bmRsciA9IChlbnY6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgc3dpdGNoIChlbnYpIHtcbiAgICAgIGNhc2UgQ29uc3RhbnRzLkNsdXN0ZXIuZGV2OlxuICAgICAgY2FzZSBDb25zdGFudHMuQ2x1c3Rlci50ZXN0OlxuICAgICAgY2FzZSBDb25zdGFudHMuQ2x1c3Rlci5sb2NhbGhvc3Q6XG4gICAgICAgIHJldHVybiAnaHR0cHM6Ly9kZXZuZXQuYnVuZGxyLm5ldHdvcmsnO1xuICAgICAgZGVmYXVsdDoge1xuICAgICAgICBjb25zdCBpbmRleCA9IERhdGUubm93KCkgJSAyO1xuICAgICAgICBjb25zdCBjbHVzdGVycyA9IFtcbiAgICAgICAgICAnaHR0cHM6Ly9ub2RlMS5idW5kbHIubmV0d29yaycsXG4gICAgICAgICAgJ2h0dHBzOi8vbm9kZTIuYnVuZGxyLm5ldHdvcmsnLFxuICAgICAgICBdO1xuICAgICAgICByZXR1cm4gY2x1c3RlcnNbaW5kZXhdO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBleHBvcnQgY29uc3QgV1JBUFBFRF9UT0tFTl9QUk9HUkFNX0lEID0gbmV3IFB1YmxpY0tleShcbiAgICAnU28xMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMicsXG4gICk7XG4gIGV4cG9ydCBjb25zdCBNRU1PX1BST0dSQU1fSUQgPSBuZXcgUHVibGljS2V5KFxuICAgICdNZW1vMVVoa0pSZkh5dkxNY1Z1Y0p3eFhldUQ3MjhFcVZERHdRRHhGTU5vJyxcbiAgKTtcbiAgZXhwb3J0IGNvbnN0IE1FVEFQTEVYX1BST0dSQU1fSUQgPSBuZXcgUHVibGljS2V5KFxuICAgICdtZXRhcWJ4eFVlcmRxMjhjajFSYkFXa1lRbTN5YnpqYjZhOGJ0NTE4eDFzJyxcbiAgKTtcbiAgZXhwb3J0IGNvbnN0IENPTU1JVE1FTlQ6IENvbW1pdG1lbnQgPSAnY29uZmlybWVkJztcbiAgZXhwb3J0IGNvbnN0IE5GVF9TVE9SQUdFX0FQSV9LRVkgPVxuICAgICdleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKemRXSWlPaUprYVdRNlpYUm9jam93ZUVSR01qY3lOMlZrT0RaaFJHVTFSVE15WkRaRFpFSmxPRGMwWXpSRk5EbEVPRFkxT1dabU9FTWlMQ0pwYzNNaU9pSnVablF0YzNSdmNtRm5aU0lzSW1saGRDSTZNVFl5TURJMk5EazBNemN3Tml3aWJtRnRaU0k2SW1SbGJXOGlmUS5kNEo3MG1pa3hSQjhhNXZ3TnU2U081SERBOEphdWV1c2VBajdRX3l0TUNFJztcbiAgZXhwb3J0IGNvbnN0IE5GVF9TVE9SQUdFX0dBVEVXQVlfVVJMID0gJ2h0dHBzOi8vaXBmcy5pby9pcGZzJztcbiAgZXhwb3J0IGNvbnN0IEJVTkRMUl9ORVRXT1JLX1VSTCA9IHN3aXRjaEJ1bmRscihDb25maWcuY2x1c3Rlci50eXBlKTtcbn1cbiIsICIvLyBmb3JrZWQ6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYWRyYXAvcmVzdWx0LCB0aGFuayB5b3UgYWR2aWNlICBAanZpaWRlXG5pbXBvcnQgeyBUcmFuc2FjdGlvblNpZ25hdHVyZSB9IGZyb20gJ0Bzb2xhbmEvd2ViMy5qcyc7XG5cbmFic3RyYWN0IGNsYXNzIEFic3RyYWN0UmVzdWx0PFQsIEUgZXh0ZW5kcyBFcnJvcj4ge1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2NoYWluPFgsIFUgZXh0ZW5kcyBFcnJvcj4oXG4gICAgb2s6ICh2YWx1ZTogVCkgPT4gUmVzdWx0PFgsIFU+LFxuICAgIGVycjogKGVycm9yOiBFKSA9PiBSZXN1bHQ8WCwgVT4sXG4gICk6IFJlc3VsdDxYLCBVPjtcblxuICB1bndyYXAoKTogVDtcbiAgdW53cmFwPFU+KG9rOiAodmFsdWU6IFQpID0+IFUpOiBVO1xuICB1bndyYXA8VSwgVj4ob2s6ICh2YWx1ZTogVCkgPT4gVSwgZXJyOiAoZXJyb3I6IEUpID0+IFYpOiBVIHwgVjtcbiAgLy8gdW5pZmllZC1zaWduYXR1cmVzLiBpbnRvIGxpbmUgMTBcbiAgLy8gdW53cmFwPFU+KG9rOiAodmFsdWU6IFQpID0+IFUsIGVycjogKGVycm9yOiBFKSA9PiBVKTogVTtcbiAgdW53cmFwKG9rPzogKHZhbHVlOiBUKSA9PiB1bmtub3duLCBlcnI/OiAoZXJyb3I6IEUpID0+IHVua25vd24pOiB1bmtub3duIHtcbiAgICBjb25zdCByID0gdGhpcy5fY2hhaW4oXG4gICAgICAodmFsdWUpID0+IFJlc3VsdC5vayhvayA/IG9rKHZhbHVlKSA6IHZhbHVlKSxcbiAgICAgIChlcnJvcikgPT4gKGVyciA/IFJlc3VsdC5vayhlcnIoZXJyb3IpKSA6IFJlc3VsdC5lcnIoZXJyb3IpKSxcbiAgICApO1xuICAgIGlmIChyLmlzRXJyKSB7XG4gICAgICB0aHJvdyByLmVycm9yO1xuICAgIH1cbiAgICByZXR1cm4gci52YWx1ZTtcbiAgfVxuXG4gIC8vLy8gbWFwIC8vLy9cbiAgbWFwPFU+KG9rOiAodmFsdWU6IFQpID0+IFUpOiBSZXN1bHQ8VSwgRT47XG4gIG1hcDxVLCBGIGV4dGVuZHMgRXJyb3I+KFxuICAgIG9rOiAodmFsdWU6IFQpID0+IFUsXG4gICAgZXJyOiAoZXJyb3I6IEUpID0+IEYsXG4gICk6IFJlc3VsdDxVLCBGPjtcbiAgbWFwKG9rOiAodmFsdWU6IFQpID0+IHVua25vd24sIGVycj86IChlcnJvcjogRSkgPT4gRXJyb3IpOiBSZXN1bHQ8dW5rbm93bj4ge1xuICAgIHJldHVybiB0aGlzLl9jaGFpbihcbiAgICAgICh2YWx1ZSkgPT4gUmVzdWx0Lm9rKG9rKHZhbHVlKSksXG4gICAgICAoZXJyb3IpID0+IFJlc3VsdC5lcnIoZXJyID8gZXJyKGVycm9yKSA6IGVycm9yKSxcbiAgICApO1xuICB9XG5cbiAgLy8vLyBjaGFpbiAvLy8vXG4gIGNoYWluPFg+KG9rOiAodmFsdWU6IFQpID0+IFJlc3VsdDxYLCBFPik6IFJlc3VsdDxYLCBFPjtcbiAgY2hhaW48WD4ob2s6ICh2YWx1ZTogVCkgPT4gUmVzdWx0PFgsIEU+KTogLy8gdW5pZmllZC1zaWduYXR1cmVzLiBpbnRvIGxpbmUgMzdcbiAgLy8gZXJyOiAoZXJyb3I6IEUpID0+IFJlc3VsdDxYLCBFPlxuICBSZXN1bHQ8WCwgRT47XG4gIGNoYWluPFgsIFUgZXh0ZW5kcyBFcnJvcj4oXG4gICAgb2s6ICh2YWx1ZTogVCkgPT4gUmVzdWx0PFgsIFU+LFxuICAgIGVycjogKGVycm9yOiBFKSA9PiBSZXN1bHQ8WCwgVT4sXG4gICk6IFJlc3VsdDxYLCBVPjtcbiAgY2hhaW4oXG4gICAgb2s6ICh2YWx1ZTogVCkgPT4gUmVzdWx0PHVua25vd24+LFxuICAgIGVycj86IChlcnJvcjogRSkgPT4gUmVzdWx0PHVua25vd24+LFxuICApOiBSZXN1bHQ8dW5rbm93bj4ge1xuICAgIHJldHVybiB0aGlzLl9jaGFpbihvaywgZXJyIHx8ICgoZXJyb3IpID0+IFJlc3VsdC5lcnIoZXJyb3IpKSk7XG4gIH1cblxuICAvLy8vIG1hdGNoIC8vLy9cbiAgbWF0Y2g8VSwgRj4ob2s6ICh2YWx1ZTogVCkgPT4gVSwgZXJyOiAoZXJyb3I6IEUpID0+IEYpOiB2b2lkIHwgUHJvbWlzZTx2b2lkPjtcblxuICBtYXRjaChcbiAgICBvazogKHZhbHVlOiBUKSA9PiB1bmtub3duLFxuICAgIGVycjogKGVycm9yOiBFKSA9PiB1bmtub3duLFxuICApOiB2b2lkIHwgUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy5fY2hhaW4oXG4gICAgICAodmFsdWUpID0+IFJlc3VsdC5vayhvayh2YWx1ZSkpLFxuICAgICAgKGVycm9yKSA9PiBSZXN1bHQuZXJyKGVycihlcnJvcikgYXMgRXJyb3IpLFxuICAgICk7XG4gIH1cblxuICAvLy8gc3VibWl0IChhbGlhcyBJbnN0cnVjdGlvbi5zdWJtaXQpIC8vLy9cbiAgYXN5bmMgc3VibWl0KCk6IFByb21pc2U8UmVzdWx0PFRyYW5zYWN0aW9uU2lnbmF0dXJlLCBFcnJvcj4+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgaW5zdHJ1Y3Rpb24gPSB0aGlzLnVud3JhcCgpIGFzIGFueTtcbiAgICAgIGlmIChpbnN0cnVjdGlvbi5pbnN0cnVjdGlvbnMgJiYgaW5zdHJ1Y3Rpb24uc2lnbmVycykge1xuICAgICAgICByZXR1cm4gYXdhaXQgaW5zdHJ1Y3Rpb24uc3VibWl0KCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUmVzdWx0LmVycihFcnJvcignT25seSBJbnN0cnVjdGlvbiBvYmplY3QnKSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gUmVzdWx0LmVycihlcnIgYXMgRXJyb3IpO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBJbnRlcm5hbE9rPFQsIEUgZXh0ZW5kcyBFcnJvcj4gZXh0ZW5kcyBBYnN0cmFjdFJlc3VsdDxULCBFPiB7XG4gIHJlYWRvbmx5IGlzT2sgPSB0cnVlO1xuICByZWFkb25seSBpc0VyciA9IGZhbHNlO1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSB2YWx1ZTogVCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnMgKi9cbiAgcHJvdGVjdGVkIF9jaGFpbjxYLCBVIGV4dGVuZHMgRXJyb3I+KFxuICAgIG9rOiAodmFsdWU6IFQpID0+IFJlc3VsdDxYLCBVPixcbiAgICBfZXJyOiAoZXJyb3I6IEUpID0+IFJlc3VsdDxYLCBVPixcbiAgKTogUmVzdWx0PFgsIFU+IHtcbiAgICByZXR1cm4gb2sodGhpcy52YWx1ZSk7XG4gIH1cbn1cblxuY2xhc3MgSW50ZXJuYWxFcnI8VCwgRSBleHRlbmRzIEVycm9yPiBleHRlbmRzIEFic3RyYWN0UmVzdWx0PFQsIEU+IHtcbiAgcmVhZG9ubHkgaXNPayA9IGZhbHNlO1xuICByZWFkb25seSBpc0VyciA9IHRydWU7XG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGVycm9yOiBFKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY2hhaW48WCwgVSBleHRlbmRzIEVycm9yPihcbiAgICBfb2s6ICh2YWx1ZTogVCkgPT4gUmVzdWx0PFgsIFU+LFxuICAgIGVycjogKGVycm9yOiBFKSA9PiBSZXN1bHQ8WCwgVT4sXG4gICk6IFJlc3VsdDxYLCBVPiB7XG4gICAgcmV0dXJuIGVycih0aGlzLmVycm9yKTtcbiAgfVxufVxuXG5leHBvcnQgbmFtZXNwYWNlIFJlc3VsdCB7XG4gIGV4cG9ydCB0eXBlIE9rPFQsIEUgZXh0ZW5kcyBFcnJvcj4gPSBJbnRlcm5hbE9rPFQsIEU+O1xuICBleHBvcnQgdHlwZSBFcnI8VCwgRSBleHRlbmRzIEVycm9yPiA9IEludGVybmFsRXJyPFQsIEU+O1xuXG4gIGV4cG9ydCBmdW5jdGlvbiBvazxULCBFIGV4dGVuZHMgRXJyb3I+KHZhbHVlOiBUKTogUmVzdWx0PFQsIEU+IHtcbiAgICByZXR1cm4gbmV3IEludGVybmFsT2sodmFsdWUpO1xuICB9XG4gIGV4cG9ydCBmdW5jdGlvbiBlcnI8RSBleHRlbmRzIEVycm9yLCBUID0gbmV2ZXI+KGVycm9yPzogRSk6IFJlc3VsdDxULCBFPjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGVycjxFIGV4dGVuZHMgRXJyb3IsIFQgPSBuZXZlcj4oZXJyb3I6IEUpOiBSZXN1bHQ8VCwgRT4ge1xuICAgIHJldHVybiBuZXcgSW50ZXJuYWxFcnIoZXJyb3IgfHwgRXJyb3IoKSk7XG4gIH1cblxuICB0eXBlIFUgPSBSZXN1bHQ8dW5rbm93bj47XG4gIGV4cG9ydCBmdW5jdGlvbiBhbGw8XG4gICAgUjAgZXh0ZW5kcyBVLFxuICAgIFIxIGV4dGVuZHMgVSxcbiAgICBSMiBleHRlbmRzIFUsXG4gICAgUjMgZXh0ZW5kcyBVLFxuICAgIFI0IGV4dGVuZHMgVSxcbiAgICBSNSBleHRlbmRzIFUsXG4gICAgUjYgZXh0ZW5kcyBVLFxuICAgIFI3IGV4dGVuZHMgVSxcbiAgICBSOCBleHRlbmRzIFUsXG4gICAgUjkgZXh0ZW5kcyBVLFxuICAgIFIxMCBleHRlbmRzIFUsXG4gICAgUjExIGV4dGVuZHMgVSxcbiAgICBSMTIgZXh0ZW5kcyBVLFxuICAgIFIxMyBleHRlbmRzIFUsXG4gICAgUjE0IGV4dGVuZHMgVSxcbiAgICBSMTUgZXh0ZW5kcyBVLFxuICA+KFxuICAgIG9iajogW1IwLCBSMSwgUjIsIFIzLCBSNCwgUjUsIFI2LCBSNywgUjgsIFI5LCBSMTAsIFIxMSwgUjEyLCBSMTMsIFIxNCwgUjE1XSxcbiAgKTogUmVzdWx0PFxuICAgIFtcbiAgICAgIE9rVHlwZTxSMD4sXG4gICAgICBPa1R5cGU8UjE+LFxuICAgICAgT2tUeXBlPFIyPixcbiAgICAgIE9rVHlwZTxSMz4sXG4gICAgICBPa1R5cGU8UjQ+LFxuICAgICAgT2tUeXBlPFI1PixcbiAgICAgIE9rVHlwZTxSNj4sXG4gICAgICBPa1R5cGU8Ujc+LFxuICAgICAgT2tUeXBlPFI4PixcbiAgICAgIE9rVHlwZTxSOT4sXG4gICAgICBPa1R5cGU8UjEwPixcbiAgICAgIE9rVHlwZTxSMTE+LFxuICAgICAgT2tUeXBlPFIxMj4sXG4gICAgICBPa1R5cGU8UjEzPixcbiAgICAgIE9rVHlwZTxSMTQ+LFxuICAgICAgT2tUeXBlPFIxNT4sXG4gICAgXSxcbiAgICBFcnJUeXBlPFxuICAgICAgfCBSMFxuICAgICAgfCBSMVxuICAgICAgfCBSMlxuICAgICAgfCBSM1xuICAgICAgfCBSNFxuICAgICAgfCBSNVxuICAgICAgfCBSNlxuICAgICAgfCBSN1xuICAgICAgfCBSOFxuICAgICAgfCBSOVxuICAgICAgfCBSMTBcbiAgICAgIHwgUjExXG4gICAgICB8IFIxMlxuICAgICAgfCBSMTNcbiAgICAgIHwgUjE0XG4gICAgICB8IFIxNVxuICAgID5cbiAgPjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGFsbDxcbiAgICBSMCBleHRlbmRzIFUsXG4gICAgUjEgZXh0ZW5kcyBVLFxuICAgIFIyIGV4dGVuZHMgVSxcbiAgICBSMyBleHRlbmRzIFUsXG4gICAgUjQgZXh0ZW5kcyBVLFxuICAgIFI1IGV4dGVuZHMgVSxcbiAgICBSNiBleHRlbmRzIFUsXG4gICAgUjcgZXh0ZW5kcyBVLFxuICAgIFI4IGV4dGVuZHMgVSxcbiAgICBSOSBleHRlbmRzIFUsXG4gICAgUjEwIGV4dGVuZHMgVSxcbiAgICBSMTEgZXh0ZW5kcyBVLFxuICAgIFIxMiBleHRlbmRzIFUsXG4gICAgUjEzIGV4dGVuZHMgVSxcbiAgICBSMTQgZXh0ZW5kcyBVLFxuICA+KFxuICAgIG9iajogW1IwLCBSMSwgUjIsIFIzLCBSNCwgUjUsIFI2LCBSNywgUjgsIFI5LCBSMTAsIFIxMSwgUjEyLCBSMTMsIFIxNF0sXG4gICk6IFJlc3VsdDxcbiAgICBbXG4gICAgICBPa1R5cGU8UjA+LFxuICAgICAgT2tUeXBlPFIxPixcbiAgICAgIE9rVHlwZTxSMj4sXG4gICAgICBPa1R5cGU8UjM+LFxuICAgICAgT2tUeXBlPFI0PixcbiAgICAgIE9rVHlwZTxSNT4sXG4gICAgICBPa1R5cGU8UjY+LFxuICAgICAgT2tUeXBlPFI3PixcbiAgICAgIE9rVHlwZTxSOD4sXG4gICAgICBPa1R5cGU8Ujk+LFxuICAgICAgT2tUeXBlPFIxMD4sXG4gICAgICBPa1R5cGU8UjExPixcbiAgICAgIE9rVHlwZTxSMTI+LFxuICAgICAgT2tUeXBlPFIxMz4sXG4gICAgICBPa1R5cGU8UjE0PixcbiAgICBdLFxuICAgIEVyclR5cGU8XG4gICAgICB8IFIwXG4gICAgICB8IFIxXG4gICAgICB8IFIyXG4gICAgICB8IFIzXG4gICAgICB8IFI0XG4gICAgICB8IFI1XG4gICAgICB8IFI2XG4gICAgICB8IFI3XG4gICAgICB8IFI4XG4gICAgICB8IFI5XG4gICAgICB8IFIxMFxuICAgICAgfCBSMTFcbiAgICAgIHwgUjEyXG4gICAgICB8IFIxM1xuICAgICAgfCBSMTRcbiAgICA+XG4gID47XG4gIGV4cG9ydCBmdW5jdGlvbiBhbGw8XG4gICAgUjAgZXh0ZW5kcyBVLFxuICAgIFIxIGV4dGVuZHMgVSxcbiAgICBSMiBleHRlbmRzIFUsXG4gICAgUjMgZXh0ZW5kcyBVLFxuICAgIFI0IGV4dGVuZHMgVSxcbiAgICBSNSBleHRlbmRzIFUsXG4gICAgUjYgZXh0ZW5kcyBVLFxuICAgIFI3IGV4dGVuZHMgVSxcbiAgICBSOCBleHRlbmRzIFUsXG4gICAgUjkgZXh0ZW5kcyBVLFxuICAgIFIxMCBleHRlbmRzIFUsXG4gICAgUjExIGV4dGVuZHMgVSxcbiAgICBSMTIgZXh0ZW5kcyBVLFxuICAgIFIxMyBleHRlbmRzIFUsXG4gID4oXG4gICAgb2JqOiBbUjAsIFIxLCBSMiwgUjMsIFI0LCBSNSwgUjYsIFI3LCBSOCwgUjksIFIxMCwgUjExLCBSMTIsIFIxM10sXG4gICk6IFJlc3VsdDxcbiAgICBbXG4gICAgICBPa1R5cGU8UjA+LFxuICAgICAgT2tUeXBlPFIxPixcbiAgICAgIE9rVHlwZTxSMj4sXG4gICAgICBPa1R5cGU8UjM+LFxuICAgICAgT2tUeXBlPFI0PixcbiAgICAgIE9rVHlwZTxSNT4sXG4gICAgICBPa1R5cGU8UjY+LFxuICAgICAgT2tUeXBlPFI3PixcbiAgICAgIE9rVHlwZTxSOD4sXG4gICAgICBPa1R5cGU8Ujk+LFxuICAgICAgT2tUeXBlPFIxMD4sXG4gICAgICBPa1R5cGU8UjExPixcbiAgICAgIE9rVHlwZTxSMTI+LFxuICAgICAgT2tUeXBlPFIxMz4sXG4gICAgXSxcbiAgICBFcnJUeXBlPFxuICAgICAgUjAgfCBSMSB8IFIyIHwgUjMgfCBSNCB8IFI1IHwgUjYgfCBSNyB8IFI4IHwgUjkgfCBSMTAgfCBSMTEgfCBSMTIgfCBSMTNcbiAgICA+XG4gID47XG4gIGV4cG9ydCBmdW5jdGlvbiBhbGw8XG4gICAgUjAgZXh0ZW5kcyBVLFxuICAgIFIxIGV4dGVuZHMgVSxcbiAgICBSMiBleHRlbmRzIFUsXG4gICAgUjMgZXh0ZW5kcyBVLFxuICAgIFI0IGV4dGVuZHMgVSxcbiAgICBSNSBleHRlbmRzIFUsXG4gICAgUjYgZXh0ZW5kcyBVLFxuICAgIFI3IGV4dGVuZHMgVSxcbiAgICBSOCBleHRlbmRzIFUsXG4gICAgUjkgZXh0ZW5kcyBVLFxuICAgIFIxMCBleHRlbmRzIFUsXG4gICAgUjExIGV4dGVuZHMgVSxcbiAgICBSMTIgZXh0ZW5kcyBVLFxuICA+KFxuICAgIG9iajogW1IwLCBSMSwgUjIsIFIzLCBSNCwgUjUsIFI2LCBSNywgUjgsIFI5LCBSMTAsIFIxMSwgUjEyXSxcbiAgKTogUmVzdWx0PFxuICAgIFtcbiAgICAgIE9rVHlwZTxSMD4sXG4gICAgICBPa1R5cGU8UjE+LFxuICAgICAgT2tUeXBlPFIyPixcbiAgICAgIE9rVHlwZTxSMz4sXG4gICAgICBPa1R5cGU8UjQ+LFxuICAgICAgT2tUeXBlPFI1PixcbiAgICAgIE9rVHlwZTxSNj4sXG4gICAgICBPa1R5cGU8Ujc+LFxuICAgICAgT2tUeXBlPFI4PixcbiAgICAgIE9rVHlwZTxSOT4sXG4gICAgICBPa1R5cGU8UjEwPixcbiAgICAgIE9rVHlwZTxSMTE+LFxuICAgIF0sXG4gICAgRXJyVHlwZTxSMCB8IFIxIHwgUjIgfCBSMyB8IFI0IHwgUjUgfCBSNiB8IFI3IHwgUjggfCBSOSB8IFIxMCB8IFIxMT5cbiAgPjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGFsbDxcbiAgICBSMCBleHRlbmRzIFUsXG4gICAgUjEgZXh0ZW5kcyBVLFxuICAgIFIyIGV4dGVuZHMgVSxcbiAgICBSMyBleHRlbmRzIFUsXG4gICAgUjQgZXh0ZW5kcyBVLFxuICAgIFI1IGV4dGVuZHMgVSxcbiAgICBSNiBleHRlbmRzIFUsXG4gICAgUjcgZXh0ZW5kcyBVLFxuICAgIFI4IGV4dGVuZHMgVSxcbiAgICBSOSBleHRlbmRzIFUsXG4gICAgUjEwIGV4dGVuZHMgVSxcbiAgICBSMTEgZXh0ZW5kcyBVLFxuICA+KFxuICAgIG9iajogW1IwLCBSMSwgUjIsIFIzLCBSNCwgUjUsIFI2LCBSNywgUjgsIFI5LCBSMTAsIFIxMV0sXG4gICk6IFJlc3VsdDxcbiAgICBbXG4gICAgICBPa1R5cGU8UjA+LFxuICAgICAgT2tUeXBlPFIxPixcbiAgICAgIE9rVHlwZTxSMj4sXG4gICAgICBPa1R5cGU8UjM+LFxuICAgICAgT2tUeXBlPFI0PixcbiAgICAgIE9rVHlwZTxSNT4sXG4gICAgICBPa1R5cGU8UjY+LFxuICAgICAgT2tUeXBlPFI3PixcbiAgICAgIE9rVHlwZTxSOD4sXG4gICAgICBPa1R5cGU8Ujk+LFxuICAgICAgT2tUeXBlPFIxMD4sXG4gICAgICBPa1R5cGU8UjExPixcbiAgICBdLFxuICAgIEVyclR5cGU8UjAgfCBSMSB8IFIyIHwgUjMgfCBSNCB8IFI1IHwgUjYgfCBSNyB8IFI4IHwgUjkgfCBSMTAgfCBSMTE+XG4gID47XG4gIGV4cG9ydCBmdW5jdGlvbiBhbGw8XG4gICAgUjAgZXh0ZW5kcyBVLFxuICAgIFIxIGV4dGVuZHMgVSxcbiAgICBSMiBleHRlbmRzIFUsXG4gICAgUjMgZXh0ZW5kcyBVLFxuICAgIFI0IGV4dGVuZHMgVSxcbiAgICBSNSBleHRlbmRzIFUsXG4gICAgUjYgZXh0ZW5kcyBVLFxuICAgIFI3IGV4dGVuZHMgVSxcbiAgICBSOCBleHRlbmRzIFUsXG4gICAgUjkgZXh0ZW5kcyBVLFxuICAgIFIxMCBleHRlbmRzIFUsXG4gID4oXG4gICAgb2JqOiBbUjAsIFIxLCBSMiwgUjMsIFI0LCBSNSwgUjYsIFI3LCBSOCwgUjksIFIxMF0sXG4gICk6IFJlc3VsdDxcbiAgICBbXG4gICAgICBPa1R5cGU8UjA+LFxuICAgICAgT2tUeXBlPFIxPixcbiAgICAgIE9rVHlwZTxSMj4sXG4gICAgICBPa1R5cGU8UjM+LFxuICAgICAgT2tUeXBlPFI0PixcbiAgICAgIE9rVHlwZTxSNT4sXG4gICAgICBPa1R5cGU8UjY+LFxuICAgICAgT2tUeXBlPFI3PixcbiAgICAgIE9rVHlwZTxSOD4sXG4gICAgICBPa1R5cGU8Ujk+LFxuICAgICAgT2tUeXBlPFIxMD4sXG4gICAgXSxcbiAgICBFcnJUeXBlPFIwIHwgUjEgfCBSMiB8IFIzIHwgUjQgfCBSNSB8IFI2IHwgUjcgfCBSOCB8IFI5IHwgUjEwPlxuICA+O1xuICBleHBvcnQgZnVuY3Rpb24gYWxsPFxuICAgIFIwIGV4dGVuZHMgVSxcbiAgICBSMSBleHRlbmRzIFUsXG4gICAgUjIgZXh0ZW5kcyBVLFxuICAgIFIzIGV4dGVuZHMgVSxcbiAgICBSNCBleHRlbmRzIFUsXG4gICAgUjUgZXh0ZW5kcyBVLFxuICAgIFI2IGV4dGVuZHMgVSxcbiAgICBSNyBleHRlbmRzIFUsXG4gICAgUjggZXh0ZW5kcyBVLFxuICAgIFI5IGV4dGVuZHMgVSxcbiAgPihcbiAgICBvYmo6IFtSMCwgUjEsIFIyLCBSMywgUjQsIFI1LCBSNiwgUjcsIFI4LCBSOV0sXG4gICk6IFJlc3VsdDxcbiAgICBbXG4gICAgICBPa1R5cGU8UjA+LFxuICAgICAgT2tUeXBlPFIxPixcbiAgICAgIE9rVHlwZTxSMj4sXG4gICAgICBPa1R5cGU8UjM+LFxuICAgICAgT2tUeXBlPFI0PixcbiAgICAgIE9rVHlwZTxSNT4sXG4gICAgICBPa1R5cGU8UjY+LFxuICAgICAgT2tUeXBlPFI3PixcbiAgICAgIE9rVHlwZTxSOD4sXG4gICAgICBPa1R5cGU8Ujk+LFxuICAgIF0sXG4gICAgRXJyVHlwZTxSMCB8IFIxIHwgUjIgfCBSMyB8IFI0IHwgUjUgfCBSNiB8IFI3IHwgUjggfCBSOT5cbiAgPjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGFsbDxcbiAgICBSMCBleHRlbmRzIFUsXG4gICAgUjEgZXh0ZW5kcyBVLFxuICAgIFIyIGV4dGVuZHMgVSxcbiAgICBSMyBleHRlbmRzIFUsXG4gICAgUjQgZXh0ZW5kcyBVLFxuICAgIFI1IGV4dGVuZHMgVSxcbiAgICBSNiBleHRlbmRzIFUsXG4gICAgUjcgZXh0ZW5kcyBVLFxuICAgIFI4IGV4dGVuZHMgVSxcbiAgPihcbiAgICBvYmo6IFtSMCwgUjEsIFIyLCBSMywgUjQsIFI1LCBSNiwgUjcsIFI4XSxcbiAgKTogUmVzdWx0PFxuICAgIFtcbiAgICAgIE9rVHlwZTxSMD4sXG4gICAgICBPa1R5cGU8UjE+LFxuICAgICAgT2tUeXBlPFIyPixcbiAgICAgIE9rVHlwZTxSMz4sXG4gICAgICBPa1R5cGU8UjQ+LFxuICAgICAgT2tUeXBlPFI1PixcbiAgICAgIE9rVHlwZTxSNj4sXG4gICAgICBPa1R5cGU8Ujc+LFxuICAgICAgT2tUeXBlPFI4PixcbiAgICBdLFxuICAgIEVyclR5cGU8UjAgfCBSMSB8IFIyIHwgUjMgfCBSNCB8IFI1IHwgUjYgfCBSNyB8IFI4PlxuICA+O1xuICBleHBvcnQgZnVuY3Rpb24gYWxsPFxuICAgIFIwIGV4dGVuZHMgVSxcbiAgICBSMSBleHRlbmRzIFUsXG4gICAgUjIgZXh0ZW5kcyBVLFxuICAgIFIzIGV4dGVuZHMgVSxcbiAgICBSNCBleHRlbmRzIFUsXG4gICAgUjUgZXh0ZW5kcyBVLFxuICAgIFI2IGV4dGVuZHMgVSxcbiAgICBSNyBleHRlbmRzIFUsXG4gID4oXG4gICAgb2JqOiBbUjAsIFIxLCBSMiwgUjMsIFI0LCBSNSwgUjYsIFI3XSxcbiAgKTogUmVzdWx0PFxuICAgIFtcbiAgICAgIE9rVHlwZTxSMD4sXG4gICAgICBPa1R5cGU8UjE+LFxuICAgICAgT2tUeXBlPFIyPixcbiAgICAgIE9rVHlwZTxSMz4sXG4gICAgICBPa1R5cGU8UjQ+LFxuICAgICAgT2tUeXBlPFI1PixcbiAgICAgIE9rVHlwZTxSNj4sXG4gICAgICBPa1R5cGU8Ujc+LFxuICAgIF0sXG4gICAgRXJyVHlwZTxSMCB8IFIxIHwgUjIgfCBSMyB8IFI0IHwgUjUgfCBSNiB8IFI3PlxuICA+O1xuICBleHBvcnQgZnVuY3Rpb24gYWxsPFxuICAgIFIwIGV4dGVuZHMgVSxcbiAgICBSMSBleHRlbmRzIFUsXG4gICAgUjIgZXh0ZW5kcyBVLFxuICAgIFIzIGV4dGVuZHMgVSxcbiAgICBSNCBleHRlbmRzIFUsXG4gICAgUjUgZXh0ZW5kcyBVLFxuICAgIFI2IGV4dGVuZHMgVSxcbiAgPihcbiAgICBvYmo6IFtSMCwgUjEsIFIyLCBSMywgUjQsIFI1LCBSNl0sXG4gICk6IFJlc3VsdDxcbiAgICBbXG4gICAgICBPa1R5cGU8UjA+LFxuICAgICAgT2tUeXBlPFIxPixcbiAgICAgIE9rVHlwZTxSMj4sXG4gICAgICBPa1R5cGU8UjM+LFxuICAgICAgT2tUeXBlPFI0PixcbiAgICAgIE9rVHlwZTxSNT4sXG4gICAgICBPa1R5cGU8UjY+LFxuICAgIF0sXG4gICAgRXJyVHlwZTxSMCB8IFIxIHwgUjIgfCBSMyB8IFI0IHwgUjUgfCBSNj5cbiAgPjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGFsbDxcbiAgICBSMCBleHRlbmRzIFUsXG4gICAgUjEgZXh0ZW5kcyBVLFxuICAgIFIyIGV4dGVuZHMgVSxcbiAgICBSMyBleHRlbmRzIFUsXG4gICAgUjQgZXh0ZW5kcyBVLFxuICAgIFI1IGV4dGVuZHMgVSxcbiAgPihcbiAgICBvYmo6IFtSMCwgUjEsIFIyLCBSMywgUjQsIFI1XSxcbiAgKTogUmVzdWx0PFxuICAgIFtPa1R5cGU8UjA+LCBPa1R5cGU8UjE+LCBPa1R5cGU8UjI+LCBPa1R5cGU8UjM+LCBPa1R5cGU8UjQ+LCBPa1R5cGU8UjU+XSxcbiAgICBFcnJUeXBlPFIwIHwgUjEgfCBSMiB8IFIzIHwgUjQgfCBSNT5cbiAgPjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGFsbDxcbiAgICBSMCBleHRlbmRzIFUsXG4gICAgUjEgZXh0ZW5kcyBVLFxuICAgIFIyIGV4dGVuZHMgVSxcbiAgICBSMyBleHRlbmRzIFUsXG4gICAgUjQgZXh0ZW5kcyBVLFxuICA+KFxuICAgIG9iajogW1IwLCBSMSwgUjIsIFIzLCBSNF0sXG4gICk6IFJlc3VsdDxcbiAgICBbT2tUeXBlPFIwPiwgT2tUeXBlPFIxPiwgT2tUeXBlPFIyPiwgT2tUeXBlPFIzPiwgT2tUeXBlPFI0Pl0sXG4gICAgRXJyVHlwZTxSMCB8IFIxIHwgUjIgfCBSMyB8IFI0PlxuICA+O1xuICBleHBvcnQgZnVuY3Rpb24gYWxsPFIwIGV4dGVuZHMgVSwgUjEgZXh0ZW5kcyBVLCBSMiBleHRlbmRzIFUsIFIzIGV4dGVuZHMgVT4oXG4gICAgb2JqOiBbUjAsIFIxLCBSMiwgUjNdLFxuICApOiBSZXN1bHQ8XG4gICAgW09rVHlwZTxSMD4sIE9rVHlwZTxSMT4sIE9rVHlwZTxSMj4sIE9rVHlwZTxSMz5dLFxuICAgIEVyclR5cGU8UjAgfCBSMSB8IFIyIHwgUjM+XG4gID47XG4gIGV4cG9ydCBmdW5jdGlvbiBhbGw8UjAgZXh0ZW5kcyBVLCBSMSBleHRlbmRzIFUsIFIyIGV4dGVuZHMgVT4oXG4gICAgb2JqOiBbUjAsIFIxLCBSMl0sXG4gICk6IFJlc3VsdDxbT2tUeXBlPFIwPiwgT2tUeXBlPFIxPiwgT2tUeXBlPFIyPl0sIEVyclR5cGU8UjAgfCBSMSB8IFIyPj47XG4gIGV4cG9ydCBmdW5jdGlvbiBhbGw8UjAgZXh0ZW5kcyBVLCBSMSBleHRlbmRzIFU+KFxuICAgIG9iajogW1IwLCBSMV0sXG4gICk6IFJlc3VsdDxbT2tUeXBlPFIwPiwgT2tUeXBlPFIxPl0sIEVyclR5cGU8UjAgfCBSMT4+O1xuICBleHBvcnQgZnVuY3Rpb24gYWxsPFIwIGV4dGVuZHMgVT4oXG4gICAgb2JqOiBbUjBdLFxuICApOiBSZXN1bHQ8W09rVHlwZTxSMD5dLCBFcnJUeXBlPFIwPj47XG4gIGV4cG9ydCBmdW5jdGlvbiBhbGwob2JqOiBbXSk6IFJlc3VsdDxbXT47XG4gIGV4cG9ydCBmdW5jdGlvbiBhbGw8VCBleHRlbmRzIFVbXSB8IFJlY29yZDxzdHJpbmcsIFU+PihcbiAgICBvYmo6IFQsXG4gICk6IFJlc3VsdDxcbiAgICB7IFtLIGluIGtleW9mIFRdOiBUW0tdIGV4dGVuZHMgUmVzdWx0PGluZmVyIEk+ID8gSSA6IG5ldmVyIH0sXG4gICAge1xuICAgICAgW0sgaW4ga2V5b2YgVF06IFRbS10gZXh0ZW5kcyBSZXN1bHQ8dW5rbm93biwgaW5mZXIgRT4gPyBFIDogbmV2ZXI7XG4gICAgfVtrZXlvZiBUXVxuICA+O1xuICBleHBvcnQgZnVuY3Rpb24gYWxsKG9iajogdW5rbm93bik6IHVua25vd24ge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICAgIGNvbnN0IHJlc0FyciA9IFtdO1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIG9iaikge1xuICAgICAgICBpZiAoaXRlbS5pc0Vycikge1xuICAgICAgICAgIHJldHVybiBpdGVtIGFzIHVua25vd247XG4gICAgICAgIH1cbiAgICAgICAgcmVzQXJyLnB1c2goaXRlbS52YWx1ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gUmVzdWx0Lm9rKHJlc0Fycik7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9O1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmogYXMgUmVjb3JkPHN0cmluZywgVT4pO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSAob2JqIGFzIFJlY29yZDxzdHJpbmcsIFU+KVtrZXldO1xuICAgICAgaWYgKGl0ZW0uaXNFcnIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9XG4gICAgICByZXNba2V5XSA9IGl0ZW0udmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBSZXN1bHQub2socmVzKTtcbiAgfVxufVxuXG5leHBvcnQgdHlwZSBSZXN1bHQ8VCwgRSBleHRlbmRzIEVycm9yID0gRXJyb3I+ID1cbiAgfCBSZXN1bHQuT2s8VCwgRT5cbiAgfCBSZXN1bHQuRXJyPFQsIEU+O1xuXG50eXBlIE9rVHlwZTxSIGV4dGVuZHMgUmVzdWx0PHVua25vd24+PiA9IFIgZXh0ZW5kcyBSZXN1bHQ8aW5mZXIgTz4gPyBPIDogbmV2ZXI7XG50eXBlIEVyclR5cGU8UiBleHRlbmRzIFJlc3VsdDx1bmtub3duPj4gPSBSIGV4dGVuZHMgUmVzdWx0PHVua25vd24sIGluZmVyIEU+XG4gID8gRVxuICA6IG5ldmVyO1xuIiwgImltcG9ydCB7IEFueU9iamVjdCB9IGZyb20gJ34vdHlwZXMvc2hhcmVkJztcbmltcG9ydCB7IENvbnN0YW50cyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IFJlc3VsdCB9IGZyb20gJy4vcmVzdWx0JztcblxuLyoqXG4gKiBPdmVyd3JpdGUgSlMgT2JqZWN0XG4gKlxuICogQHBhcmFtIHt1bmtub3dufSBvYmplY3RcbiAqIEBwYXJhbSB7T3ZlcndyaXRlT2JqZWN0W119IHRhcmdldHNcbiAqIEByZXR1cm5zIE9iamVjdFxuICovXG5leHBvcnQgY29uc3Qgb3ZlcndyaXRlT2JqZWN0ID0gKFxuICBvYmplY3Q6IHVua25vd24sXG4gIHRhcmdldHM6IHtcbiAgICBleGlzdHNLZXk6IHN0cmluZztcbiAgICB3aWxsOiB7IGtleTogc3RyaW5nOyB2YWx1ZTogdW5rbm93biB9O1xuICB9W10sXG4pOiB1bmtub3duID0+IHtcbiAgY29uc3QgdGhhdDogQW55T2JqZWN0ID0gb2JqZWN0IGFzIEFueU9iamVjdDtcbiAgdGFyZ2V0cy5mb3JFYWNoKCh0YXJnZXQpID0+IHtcbiAgICBkZWxldGUgdGhhdFt0YXJnZXQuZXhpc3RzS2V5XTtcbiAgICB0aGF0W3RhcmdldC53aWxsLmtleV0gPSB0YXJnZXQud2lsbC52YWx1ZTtcbiAgfSk7XG4gIHJldHVybiB0aGF0O1xufTtcblxuLyoqXG4gKiBEaXNwbGF5IGxvZyBmb3Igc29sYW5hLXN1aXRlLWNvbmZpZy5qc1xuICpcbiAqIEBwYXJhbSB7dW5rbm93bn0gZGF0YTFcbiAqIEBwYXJhbSB7dW5rbm93bn0gZGF0YTJcbiAqIEBwYXJhbSB7dW5rbm93bn0gZGF0YTNcbiAqIEBwYXJhbSB7dW5rbm93bn0gZGF0YTRcbiAqIEByZXR1cm5zIHZvaWRcbiAqL1xuZXhwb3J0IGNvbnN0IGRlYnVnTG9nID0gKFxuICBkYXRhMTogdW5rbm93bixcbiAgZGF0YTI6IHVua25vd24gPSAnJyxcbiAgZGF0YTM6IHVua25vd24gPSAnJyxcbiAgZGF0YTQ6IHVua25vd24gPSAnJyxcbik6IHZvaWQgPT4ge1xuICBpZiAoQ29uc3RhbnRzLmlzRGVidWdnaW5nID09PSAndHJ1ZScgfHwgcHJvY2Vzcy5lbnYuREVCVUcgPT09ICd0cnVlJykge1xuICAgIGNvbnNvbGUubG9nKCdbREVCVUddJywgZGF0YTEsIGRhdGEyLCBkYXRhMywgZGF0YTQpO1xuICB9XG59O1xuXG4vKipcbiAqIHNsZWVwIHRpbWVyXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IHNlY1xuICogQHJldHVybnMgUHJvbWlzZTxudW1iZXI+XG4gKi9cbmV4cG9ydCBjb25zdCBzbGVlcCA9IGFzeW5jIChzZWM6IG51bWJlcik6IFByb21pc2U8bnVtYmVyPiA9PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCBzZWMgKiAxMDAwKSk7XG59O1xuXG4vKipcbiAqIE5vZGUuanMgb3IgQnJvd3NlciBqc1xuICpcbiAqIEByZXR1cm5zIGJvb2xlYW5cbiAqL1xuZXhwb3J0IGNvbnN0IGlzQnJvd3NlciA9ICgpOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93LmRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuICApO1xufTtcblxuLyoqXG4gKiBOb2RlLmpzIG9yIEJyb3dzZXIganNcbiAqXG4gKiBAcmV0dXJucyBib29sZWFuXG4gKi9cbmV4cG9ydCBjb25zdCBpc05vZGUgPSAoKTogYm9vbGVhbiA9PiB7XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmXG4gICAgcHJvY2Vzcy52ZXJzaW9ucyAhPSBudWxsICYmXG4gICAgcHJvY2Vzcy52ZXJzaW9ucy5ub2RlICE9IG51bGxcbiAgKTtcbn07XG5cbi8qKlxuICogYXJndW1lbnQgaXMgcHJvbWlzZSBvciBvdGhlclxuICpcbiAqIEBwYXJhbSB7dW5rbm93bn0gb2JqXG4gKiBAcmV0dXJucyBib29sZWFuXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSAqL1xuZXhwb3J0IGNvbnN0IGlzUHJvbWlzZSA9IChvYmo6IHVua25vd24pOiBvYmogaXMgUHJvbWlzZTx1bmtub3duPiA9PiB7XG4gIHJldHVybiAoXG4gICAgISFvYmogJiZcbiAgICAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJykgJiZcbiAgICB0eXBlb2YgKG9iaiBhcyBhbnkpLnRoZW4gPT09ICdmdW5jdGlvbidcbiAgKTtcbn07XG5cbi8qKlxuICogVHJ5IGFzeW5jIG1vbmFkXG4gKlxuICogQHJldHVybnMgUHJvbWlzZTxSZXN1bHQ8VCwgRT4+XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBUcnk8VCwgRSBleHRlbmRzIEVycm9yPihcbiAgYXN5bmNibG9jazogKCkgPT4gUHJvbWlzZTxUPixcbiAgZmluYWxseUlucHV0PzogKCkgPT4gdm9pZCxcbik6IFByb21pc2U8UmVzdWx0PFQsIEU+PjtcbmV4cG9ydCBmdW5jdGlvbiBUcnk8VCwgRSBleHRlbmRzIEVycm9yPihibG9jazogKCkgPT4gVCk6IFJlc3VsdDxULCBFPjtcbmV4cG9ydCBmdW5jdGlvbiBUcnk8VCwgRSBleHRlbmRzIEVycm9yPihcbiAgaW5wdXQ6ICgpID0+IFByb21pc2U8VD4sXG4gIGZpbmFsbHlJbnB1dD86ICgpID0+IHZvaWQsXG4pOiBSZXN1bHQ8VCwgRXJyb3I+IHwgUHJvbWlzZTxSZXN1bHQ8VCwgRXJyb3I+PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgdiA9IGlucHV0KCk7XG4gICAgaWYgKGlzUHJvbWlzZSh2KSkge1xuICAgICAgcmV0dXJuIHYudGhlbihcbiAgICAgICAgKHg6IFQpID0+IFJlc3VsdC5vayh4KSxcbiAgICAgICAgKGVycjogRSkgPT4gUmVzdWx0LmVycihlcnIpLFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFJlc3VsdC5vayh2KTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICByZXR1cm4gUmVzdWx0LmVycihlKTtcbiAgICB9XG4gICAgcmV0dXJuIFJlc3VsdC5lcnIoRXJyb3IoZSBhcyBzdHJpbmcpKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBpZiAoZmluYWxseUlucHV0KSB7XG4gICAgICBkZWJ1Z0xvZygnIyBmaW5hbGx5IGlucHV0OicsIGZpbmFsbHlJbnB1dCk7XG4gICAgICBmaW5hbGx5SW5wdXQoKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBhcmd1bWVudCBpcyBwcm9taXNlIG9yIG90aGVyXG4gKlxuICogQHBhcmFtIHtudW1iZXJ8dW5kZWZpbmVkfSBjcmVhdGVkX2F0XG4gKiBAcmV0dXJucyBEYXRlIHwgdW5kZWZpbmVkXG4gKi9cbmV4cG9ydCBjb25zdCBjb252ZXJ0VGltZXN0YW1wVG9EYXRlVGltZSA9IChcbiAgY3JlYXRlZF9hdDogbnVtYmVyIHwgdW5kZWZpbmVkLFxuKTogRGF0ZSB8IHVuZGVmaW5lZCA9PiB7XG4gIGlmIChjcmVhdGVkX2F0KSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKGNyZWF0ZWRfYXQgKiAxMDAwKTtcbiAgfVxuICByZXR1cm47XG59O1xuIiwgImltcG9ydCB7IEtleXBhaXIsIExBTVBPUlRTX1BFUl9TT0wsIFB1YmxpY0tleSB9IGZyb20gJ0Bzb2xhbmEvd2ViMy5qcyc7XG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnfi9ub2RlJztcbmltcG9ydCB7IENvbnN0YW50cywgZGVidWdMb2cgfSBmcm9tICd+L3NoYXJlZCc7XG5pbXBvcnQgeyBLZXlwYWlyQWNjb3VudCB9IGZyb20gJ34vYWNjb3VudCc7XG5pbXBvcnQgeyBCaWdOdW1iZXIgfSBmcm9tICdiaWdudW1iZXIuanMnO1xuaW1wb3J0IHsgRXhwbG9yZXIgfSBmcm9tICd+L3R5cGVzL2dsb2JhbCc7XG5pbXBvcnQgYnMgZnJvbSAnYnM1OCc7XG5cbi8qKlxuICogQ3JlYXRlIGV4cGxvcmVyIHVybCBmb3IgYWNjb3VudCBhZGRyZXNzIG9yIHNpZ25hdHVyZVxuICpcbiAqIEBzZWUge0BsaW5rIHR5cGVzL2dsb2JhbC50c31cbiAqIEByZXR1cm5zIHN0cmluZ1xuICovXG5TdHJpbmcucHJvdG90eXBlLnRvRXhwbG9yZXJVcmwgPSBmdW5jdGlvbiAoXG4gIGV4cGxvcmVyOiBFeHBsb3JlciA9IEV4cGxvcmVyLlNvbHNjYW4sXG4pIHtcbiAgY29uc3QgZW5kUG9pbnRVcmwgPSBOb2RlLmdldENvbm5lY3Rpb24oKS5ycGNFbmRwb2ludDtcbiAgZGVidWdMb2coJyMgdG9FeHBsb3JlclVybCBycGNFbmRwb2ludDonLCBlbmRQb2ludFVybCk7XG4gIGxldCBjbHVzdGVyID0gJyc7XG4gIGlmIChlbmRQb2ludFVybCA9PT0gQ29uc3RhbnRzLkVuZFBvaW50VXJsLnByZCkge1xuICAgIGNsdXN0ZXIgPSBDb25zdGFudHMuQ2x1c3Rlci5wcmQ7XG4gIH0gZWxzZSBpZiAoZW5kUG9pbnRVcmwgPT09IENvbnN0YW50cy5FbmRQb2ludFVybC50ZXN0KSB7XG4gICAgY2x1c3RlciA9IENvbnN0YW50cy5DbHVzdGVyLnRlc3Q7XG4gIH0gZWxzZSBpZiAoZW5kUG9pbnRVcmwgPT09IENvbnN0YW50cy5FbmRQb2ludFVybC5kZXYpIHtcbiAgICBjbHVzdGVyID0gQ29uc3RhbnRzLkNsdXN0ZXIuZGV2O1xuICB9IGVsc2Uge1xuICAgIGNsdXN0ZXIgPSBDb25zdGFudHMuQ2x1c3Rlci5kZXY7XG4gIH1cblxuICBjb25zdCBhZGRyZXNzT3JTaWduYXR1cmU6IHN0cmluZyA9IHRoaXMudG9TdHJpbmcoKTtcbiAgbGV0IHVybCA9ICcnO1xuICBpZiAoS2V5cGFpckFjY291bnQuaXNQdWJrZXkoYWRkcmVzc09yU2lnbmF0dXJlKSkge1xuICAgIC8vIGFkZHJlc3NcbiAgICBpZiAoZXhwbG9yZXIgPT09IEV4cGxvcmVyLlNvbGFuYUZNKSB7XG4gICAgICB1cmwgPSBgaHR0cHM6Ly9zb2xhbmEuZm0vYWRkcmVzcy8ke2FkZHJlc3NPclNpZ25hdHVyZX0/Y2x1c3Rlcj0ke2NsdXN0ZXJ9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgdXJsID0gYGh0dHBzOi8vc29sc2Nhbi5pby9hY2NvdW50LyR7YWRkcmVzc09yU2lnbmF0dXJlfT9jbHVzdGVyPSR7Y2x1c3Rlcn1gO1xuICAgIH1cbiAgICAvLyBzaWduYXR1cmVcbiAgfSBlbHNlIHtcbiAgICAvLyBmb3IgSW52YWxpZCB0eXBlIFwibmV2ZXJcIiBvZiBhZGRyZXNzT3JTaWduYXR1cmUsIHNvIGBhcyBzdHJpbmdgXG4gICAgaWYgKGV4cGxvcmVyID09PSBFeHBsb3Jlci5Tb2xhbmFGTSkge1xuICAgICAgdXJsID0gYGh0dHBzOi8vc29sYW5hLmZtL3R4LyR7XG4gICAgICAgIGFkZHJlc3NPclNpZ25hdHVyZSBhcyBzdHJpbmdcbiAgICAgIH0/Y2x1c3Rlcj0ke2NsdXN0ZXJ9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgdXJsID0gYGh0dHBzOi8vc29sc2Nhbi5pby90eC8ke1xuICAgICAgICBhZGRyZXNzT3JTaWduYXR1cmUgYXMgc3RyaW5nXG4gICAgICB9P2NsdXN0ZXI9JHtjbHVzdGVyfWA7XG4gICAgfVxuICB9XG4gIHJldHVybiB1cmw7XG59O1xuXG4vKipcbiAqIFB1YktleShAc29sYW5hLXN1aXRlKSB0byBQdWJsaWNLZXkoQHNvbGFuYS93ZWIzLmpzKVxuICpcbiAqIEBzZWUge0BsaW5rIHR5cGVzL2dsb2JhbC50c31cbiAqIEByZXR1cm5zIFB1YmxpY0tleVxuICovXG5TdHJpbmcucHJvdG90eXBlLnRvUHVibGljS2V5ID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIUtleXBhaXJBY2NvdW50LmlzUHVia2V5KHRoaXMudG9TdHJpbmcoKSkpIHtcbiAgICB0aHJvdyBFcnJvcihgTm8gbWF0Y2ggS2V5UGFpci5QdWJLZXk6ICR7dGhpcy50b1N0cmluZygpfWApO1xuICB9XG4gIHJldHVybiBuZXcgUHVibGljS2V5KHRoaXMpO1xufTtcblxuLyoqXG4gKiBTZWNyZXQoQHNvbGFuYS1zdWl0ZSkgdG8gS2V5cGFpcihAc29sYW5hL3dlYjMuanMpXG4gKlxuICogQHNlZSB7QGxpbmsgdHlwZXMvZ2xvYmFsLnRzfVxuICogQHJldHVybnMgS2V5cGFpclxuICovXG5TdHJpbmcucHJvdG90eXBlLnRvS2V5cGFpciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCFLZXlwYWlyQWNjb3VudC5pc1NlY3JldCh0aGlzLnRvU3RyaW5nKCkpKSB7XG4gICAgdGhyb3cgRXJyb3IoYE5vIG1hdGNoIEtleVBhaXIuU2VjcmV0OiAke3RoaXMudG9TdHJpbmcoKX1gKTtcbiAgfVxuICBjb25zdCBkZWNvZGVkID0gYnMuZGVjb2RlKHRoaXMgYXMgc3RyaW5nKTtcbiAgcmV0dXJuIEtleXBhaXIuZnJvbVNlY3JldEtleShkZWNvZGVkKTtcbn07XG5cbi8qKlxuICogTEFNUE9SVFMgdG8gU09MXG4gKlxuICogQHNlZSB7QGxpbmsgdHlwZXMvZ2xvYmFsLnRzfVxuICogQHJldHVybnMgbnVtYmVyXG4gKi9cbk51bWJlci5wcm90b3R5cGUudG9Tb2wgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBCaWdOdW1iZXIodGhpcyBhcyBudW1iZXIpXG4gICAgLmRpdihMQU1QT1JUU19QRVJfU09MKVxuICAgIC50b051bWJlcigpO1xufTtcblxuLyoqXG4gKiBTT0wgdG8gTEFNUE9SVFNcbiAqXG4gKiBAc2VlIHtAbGluayB0eXBlcy9nbG9iYWwudHN9XG4gKiBAcmV0dXJucyBudW1iZXJcbiAqL1xuTnVtYmVyLnByb3RvdHlwZS50b0xhbXBvcnRzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gQmlnTnVtYmVyKHRoaXMgYXMgbnVtYmVyKVxuICAgIC50aW1lcyhMQU1QT1JUU19QRVJfU09MKVxuICAgIC50b051bWJlcigpO1xufTtcbiIsICJpbXBvcnQgeyBDb25zdGFudHMsIFJlc3VsdCxkZWJ1Z0xvZyB9IGZyb20gJ34vc2hhcmVkJztcbmltcG9ydCB7IENvbW1pdG1lbnQsIENvbm5lY3Rpb24gfSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuXG5leHBvcnQgbmFtZXNwYWNlIE5vZGUge1xuICBjb25zdCBzZXR0ZWQgPSB7XG4gICAgY2x1c3RlclVybDogJycsXG4gICAgY29tbWl0bWVudDogQ29uc3RhbnRzLkNPTU1JVE1FTlQsXG4gICAgY3VzdG9tQ2x1c3RlclVybDogW10gYXMgc3RyaW5nW10sXG4gIH07XG5cbiAgZXhwb3J0IGNvbnN0IGdldENvbm5lY3Rpb24gPSAoKTogQ29ubmVjdGlvbiA9PiB7XG4gICAgZGVidWdMb2coJyMgW0JlZm9yZV0gc2V0dGVkOicsIHNldHRlZCk7XG4gICAgZGVidWdMb2coXG4gICAgICAnIyBbQmVmb3JlXSBDb25zdGFudHMuY3VzdG9tQ2x1c3RlclVybDonLFxuICAgICAgQ29uc3RhbnRzLmN1c3RvbUNsdXN0ZXJVcmwsXG4gICAgKTtcblxuICAgIGlmIChzZXR0ZWQuY3VzdG9tQ2x1c3RlclVybC5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBjdXN0b20gY2x1c3RlclxuICAgICAgc2V0dGVkLmNsdXN0ZXJVcmwgPSBDb25zdGFudHMuc3dpdGNoQ2x1c3Rlcih7XG4gICAgICAgIGN1c3RvbUNsdXN0ZXJVcmw6IHNldHRlZC5jdXN0b21DbHVzdGVyVXJsLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChDb25zdGFudHMuY3VzdG9tQ2x1c3RlclVybC5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBjdXN0b20gY2x1c3RlciBieSBqc29uIGNvbmZpZ1xuICAgICAgc2V0dGVkLmNsdXN0ZXJVcmwgPSBDb25zdGFudHMuc3dpdGNoQ2x1c3Rlcih7XG4gICAgICAgIGN1c3RvbUNsdXN0ZXJVcmw6IENvbnN0YW50cy5jdXN0b21DbHVzdGVyVXJsLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICghc2V0dGVkLmNsdXN0ZXJVcmwpIHtcbiAgICAgIC8vIGRlZmF1bHQgY2x1c3RlclxuICAgICAgc2V0dGVkLmNsdXN0ZXJVcmwgPSBDb25zdGFudHMuc3dpdGNoQ2x1c3Rlcih7XG4gICAgICAgIGNsdXN0ZXI6IENvbnN0YW50cy5jdXJyZW50Q2x1c3RlcixcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICghc2V0dGVkLmNvbW1pdG1lbnQpIHtcbiAgICAgIHNldHRlZC5jb21taXRtZW50ID0gQ29uc3RhbnRzLkNPTU1JVE1FTlQ7XG4gICAgfVxuXG4gICAgZGVidWdMb2coJyMgW0FmdGVyXSBzZXR0ZWQ6Jywgc2V0dGVkKTtcblxuICAgIHJldHVybiBuZXcgQ29ubmVjdGlvbihzZXR0ZWQuY2x1c3RlclVybCwgc2V0dGVkLmNvbW1pdG1lbnQpO1xuICB9O1xuXG4gIGV4cG9ydCBjb25zdCBjaGFuZ2VDb25uZWN0aW9uID0gKHBhcmFtOiB7XG4gICAgY2x1c3Rlcj86IHN0cmluZztcbiAgICBjb21taXRtZW50PzogQ29tbWl0bWVudDtcbiAgICBjdXN0b21DbHVzdGVyVXJsPzogc3RyaW5nW107XG4gIH0pOiB2b2lkID0+IHtcbiAgICAvLyBpbml0aWFsaXplXG4gICAgc2V0dGVkLmNsdXN0ZXJVcmwgPSAnJztcbiAgICBzZXR0ZWQuY3VzdG9tQ2x1c3RlclVybCA9IFtdO1xuICAgIHNldHRlZC5jb21taXRtZW50ID0gQ29uc3RhbnRzLkNPTU1JVE1FTlQ7XG5cbiAgICBjb25zdCB7IGNsdXN0ZXIsIGNvbW1pdG1lbnQsIGN1c3RvbUNsdXN0ZXJVcmwgfSA9IHBhcmFtO1xuICAgIGlmIChjb21taXRtZW50KSB7XG4gICAgICBzZXR0ZWQuY29tbWl0bWVudCA9IGNvbW1pdG1lbnQ7XG4gICAgICBkZWJ1Z0xvZygnIyBOb2RlIGNoYW5nZSBjb21taXRtZW50OiAnLCBzZXR0ZWQuY29tbWl0bWVudCk7XG4gICAgfVxuXG4gICAgaWYgKGNsdXN0ZXIpIHtcbiAgICAgIHNldHRlZC5jbHVzdGVyVXJsID0gQ29uc3RhbnRzLnN3aXRjaENsdXN0ZXIoeyBjbHVzdGVyOiBjbHVzdGVyIH0pO1xuICAgICAgZGVidWdMb2coJyMgTm9kZSBjaGFuZ2UgY2x1c3RlclVybDogJywgc2V0dGVkLmNsdXN0ZXJVcmwpO1xuICAgIH1cblxuICAgIGlmIChjdXN0b21DbHVzdGVyVXJsKSB7XG4gICAgICBkZWJ1Z0xvZygnIyBjdXN0b21DbHVzdGVyVXJsOiAnLCBjdXN0b21DbHVzdGVyVXJsKTtcbiAgICAgIHNldHRlZC5jbHVzdGVyVXJsID0gQ29uc3RhbnRzLnN3aXRjaENsdXN0ZXIoeyBjdXN0b21DbHVzdGVyVXJsIH0pO1xuICAgICAgc2V0dGVkLmN1c3RvbUNsdXN0ZXJVcmwgPSBjdXN0b21DbHVzdGVyVXJsO1xuICAgICAgZGVidWdMb2coXG4gICAgICAgICcjIE5vZGUgY2hhbmdlIGNsdXN0ZXIsIGN1c3RvbSBjbHVzdGVyIHVybDogJyxcbiAgICAgICAgc2V0dGVkLmNsdXN0ZXJVcmwsXG4gICAgICApO1xuICAgIH1cbiAgfTtcblxuICBleHBvcnQgY29uc3QgY29uZmlybWVkU2lnID0gYXN5bmMgKFxuICAgIHNpZ25hdHVyZTogc3RyaW5nLFxuICAgIGNvbW1pdG1lbnQ6IENvbW1pdG1lbnQgPSBDb25zdGFudHMuQ09NTUlUTUVOVCxcbiAgKSA9PiB7XG4gICAgY29uc3QgY29ubmVjdGlvbiA9IE5vZGUuZ2V0Q29ubmVjdGlvbigpO1xuICAgIGNvbnN0IGxhdGVzdEJsb2NraGFzaCA9IGF3YWl0IGNvbm5lY3Rpb24uZ2V0TGF0ZXN0QmxvY2toYXNoKCk7XG4gICAgcmV0dXJuIGF3YWl0IGNvbm5lY3Rpb25cbiAgICAgIC5jb25maXJtVHJhbnNhY3Rpb24oXG4gICAgICAgIHtcbiAgICAgICAgICBibG9ja2hhc2g6IGxhdGVzdEJsb2NraGFzaC5ibG9ja2hhc2gsXG4gICAgICAgICAgbGFzdFZhbGlkQmxvY2tIZWlnaHQ6IGxhdGVzdEJsb2NraGFzaC5sYXN0VmFsaWRCbG9ja0hlaWdodCxcbiAgICAgICAgICBzaWduYXR1cmUsXG4gICAgICAgIH0sXG4gICAgICAgIGNvbW1pdG1lbnQsXG4gICAgICApXG4gICAgICAudGhlbihSZXN1bHQub2spXG4gICAgICAuY2F0Y2goUmVzdWx0LmVycik7XG4gIH07XG59XG4iLCAiaW1wb3J0IHtcbiAgQ29uZmlybU9wdGlvbnMsXG4gIEtleXBhaXIsXG4gIHNlbmRBbmRDb25maXJtVHJhbnNhY3Rpb24sXG4gIFRyYW5zYWN0aW9uLFxuICBUcmFuc2FjdGlvbkluc3RydWN0aW9uLFxuICBUcmFuc2FjdGlvblNpZ25hdHVyZSxcbn0gZnJvbSAnQHNvbGFuYS93ZWIzLmpzJztcblxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJ34vbm9kZSc7XG5pbXBvcnQgeyBSZXN1bHQsIFRyeSB9IGZyb20gJ34vc2hhcmVkJztcbmltcG9ydCB7IE1BWF9SRVRSSUVTIH0gZnJvbSAnLi9kZWZpbmUnO1xuaW1wb3J0IHsgSW5zdHJ1Y3Rpb24gYXMgQmF0Y2ggfSBmcm9tICcuL2JhdGNoLXN1Ym1pdCc7XG5cbmV4cG9ydCBjbGFzcyBJbnN0cnVjdGlvbiB7XG4gIGluc3RydWN0aW9uczogVHJhbnNhY3Rpb25JbnN0cnVjdGlvbltdO1xuICBzaWduZXJzOiBLZXlwYWlyW107XG4gIGZlZVBheWVyPzogS2V5cGFpcjtcbiAgZGF0YT86IHVua25vd247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgaW5zdHJ1Y3Rpb25zOiBUcmFuc2FjdGlvbkluc3RydWN0aW9uW10sXG4gICAgc2lnbmVyczogS2V5cGFpcltdLFxuICAgIGZlZVBheWVyPzogS2V5cGFpcixcbiAgICBkYXRhPzogdW5rbm93bixcbiAgKSB7XG4gICAgdGhpcy5pbnN0cnVjdGlvbnMgPSBpbnN0cnVjdGlvbnM7XG4gICAgdGhpcy5zaWduZXJzID0gc2lnbmVycztcbiAgICB0aGlzLmZlZVBheWVyID0gZmVlUGF5ZXI7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgfVxuXG4gIHN1Ym1pdCA9IGFzeW5jICgpOiBQcm9taXNlPFJlc3VsdDxUcmFuc2FjdGlvblNpZ25hdHVyZSwgRXJyb3I+PiA9PiB7XG4gICAgcmV0dXJuIFRyeShhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgSW5zdHJ1Y3Rpb24pKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdvbmx5IEluc3RydWN0aW9uIG9iamVjdCB0aGF0IGNhbiB1c2UgdGhpcycpO1xuICAgICAgfVxuICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSBuZXcgVHJhbnNhY3Rpb24oKTtcblxuICAgICAgY29uc3QgYmxvY2toYXNoT2JqID0gYXdhaXQgTm9kZS5nZXRDb25uZWN0aW9uKCkuZ2V0TGF0ZXN0QmxvY2toYXNoKCk7XG4gICAgICB0cmFuc2FjdGlvbi5sYXN0VmFsaWRCbG9ja0hlaWdodCA9IGJsb2NraGFzaE9iai5sYXN0VmFsaWRCbG9ja0hlaWdodDtcbiAgICAgIHRyYW5zYWN0aW9uLnJlY2VudEJsb2NraGFzaCA9IGJsb2NraGFzaE9iai5ibG9ja2hhc2g7XG4gICAgICBsZXQgZmluYWxTaWduZXJzID0gdGhpcy5zaWduZXJzO1xuXG4gICAgICBpZiAodGhpcy5mZWVQYXllcikge1xuICAgICAgICB0cmFuc2FjdGlvbi5mZWVQYXllciA9IHRoaXMuZmVlUGF5ZXIucHVibGljS2V5O1xuICAgICAgICBmaW5hbFNpZ25lcnMgPSBbdGhpcy5mZWVQYXllciwgLi4udGhpcy5zaWduZXJzXTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pbnN0cnVjdGlvbnMuZm9yRWFjaCgoaW5zdCkgPT4gdHJhbnNhY3Rpb24uYWRkKGluc3QpKTtcblxuICAgICAgY29uc3Qgb3B0aW9uczogQ29uZmlybU9wdGlvbnMgPSB7XG4gICAgICAgIG1heFJldHJpZXM6IE1BWF9SRVRSSUVTLFxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIGF3YWl0IHNlbmRBbmRDb25maXJtVHJhbnNhY3Rpb24oXG4gICAgICAgIE5vZGUuZ2V0Q29ubmVjdGlvbigpLFxuICAgICAgICB0cmFuc2FjdGlvbixcbiAgICAgICAgZmluYWxTaWduZXJzLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcbn1cblxuLyoqXG4gKiBzZW5UcmFuc2FjdGlvbigpIFRyYW5zYWN0aW9uSW5zdHJ1Y3Rpb25cbiAqXG4gKiBAc2VlIHtAbGluayB0eXBlcy9nbG9iYWwudHN9XG4gKiBAcmV0dXJucyBQcm9taXNlPFJlc3VsdDxzdHJpbmcsIEVycm9yPj5cbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnQgKi9cbi8qIEB0cy1pZ25vcmUgKi9cbkFycmF5LnByb3RvdHlwZS5zdWJtaXQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGluc3RydWN0aW9uczogSW5zdHJ1Y3Rpb25bXSA9IFtdO1xuICAvLyBkb250IHVzZSBmb3JFYWNoXG4gIC8vIEl0IGlzIG5vdCBwb3NzaWJsZSB0byBzdG9wIHRoZSBwcm9jZXNzIGJ5IFJFVFVSTiBpbiB0aGUgbWlkZGxlIG9mIHRoZSBwcm9jZXNzLlxuICByZXR1cm4gVHJ5KGFzeW5jICgpID0+IHtcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBvYmogb2YgdGhpcykge1xuICAgICAgaWYgKG9iai5pc0Vycikge1xuICAgICAgICBjb25zdCBlcnJvck1lc3M6IHN0cmluZyA9IG9iai5lcnJvci5tZXNzYWdlIGFzIHN0cmluZztcbiAgICAgICAgdGhyb3cgRXJyb3IoYFtBcnJheSBpbmRleCBvZiBjYXVnaHQgJ1Jlc3VsdC5lcnInOiAke2l9XSR7ZXJyb3JNZXNzfWApO1xuICAgICAgfSBlbHNlIGlmIChvYmouaXNPaykge1xuICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChvYmoudmFsdWUgYXMgSW5zdHJ1Y3Rpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2gob2JqIGFzIEluc3RydWN0aW9uKTtcbiAgICAgIH1cbiAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIEJhdGNoLmJhdGNoU3VibWl0KGluc3RydWN0aW9ucyk7XG4gIH0pO1xufTtcbiIsICIvL0BpbnRlcm5hbHNcbmV4cG9ydCBjb25zdCBNQVhfUkVUUklFUyA9IDM7XG4iLCAiaW1wb3J0IHtcbiAgQ29uZmlybU9wdGlvbnMsXG4gIHNlbmRBbmRDb25maXJtVHJhbnNhY3Rpb24sXG4gIFRyYW5zYWN0aW9uLFxuICBUcmFuc2FjdGlvblNpZ25hdHVyZSxcbn0gZnJvbSAnQHNvbGFuYS93ZWIzLmpzJztcblxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJ34vbm9kZSc7XG5pbXBvcnQgeyBNQVhfUkVUUklFUyB9IGZyb20gJy4vZGVmaW5lJztcbmltcG9ydCB7IEluc3RydWN0aW9uIGFzIF9JbmRleCB9IGZyb20gJy4vJztcblxuZXhwb3J0IGNsYXNzIEluc3RydWN0aW9uIHtcbiAgc3RhdGljIGJhdGNoU3VibWl0ID0gYXN5bmMgKGFycjogX0luZGV4W10pOiBQcm9taXNlPFRyYW5zYWN0aW9uU2lnbmF0dXJlPiA9PiB7XG4gICAgbGV0IGkgPSAwO1xuICAgIGZvciAoY29uc3QgYSBvZiBhcnIpIHtcbiAgICAgIGlmICghYS5pbnN0cnVjdGlvbnMgJiYgIWEuc2lnbmVycykge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICBgb25seSBJbnN0cnVjdGlvbiBvYmplY3QgdGhhdCBjYW4gdXNlIGJhdGNoU3VibWl0KCkuXG4gICAgICAgICAgICBJbmRleDogJHtpfSwgU2V0IHZhbHVlOiAke0pTT04uc3RyaW5naWZ5KGEpfWAsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpKys7XG4gICAgfVxuXG4gICAgY29uc3QgaW5zdHJ1Y3Rpb25zID0gYXJyLmZsYXRNYXAoKGEpID0+IGEuaW5zdHJ1Y3Rpb25zKTtcbiAgICBjb25zdCBzaWduZXJzID0gYXJyLmZsYXRNYXAoKGEpID0+IGEuc2lnbmVycyk7XG4gICAgY29uc3QgZmVlUGF5ZXJzID0gYXJyLmZpbHRlcigoYSkgPT4gYS5mZWVQYXllciAhPT0gdW5kZWZpbmVkKTtcbiAgICBsZXQgZmVlUGF5ZXIgPSBzaWduZXJzWzBdO1xuICAgIGlmIChmZWVQYXllcnMubGVuZ3RoID4gMCAmJiBmZWVQYXllcnNbMF0uZmVlUGF5ZXIpIHtcbiAgICAgIGZlZVBheWVyID0gZmVlUGF5ZXJzWzBdLmZlZVBheWVyO1xuICAgIH1cblxuICAgIGNvbnN0IHRyYW5zYWN0aW9uID0gbmV3IFRyYW5zYWN0aW9uKCk7XG4gICAgbGV0IGZpbmFsU2lnbmVycyA9IHNpZ25lcnM7XG4gICAgaWYgKGZlZVBheWVyKSB7XG4gICAgICB0cmFuc2FjdGlvbi5mZWVQYXllciA9IGZlZVBheWVyLnB1YmxpY0tleTtcbiAgICAgIGZpbmFsU2lnbmVycyA9IFtmZWVQYXllciwgLi4uc2lnbmVyc107XG4gICAgfVxuICAgIGluc3RydWN0aW9ucy5tYXAoKGluc3QpID0+IHRyYW5zYWN0aW9uLmFkZChpbnN0KSk7XG5cbiAgICBjb25zdCBvcHRpb25zOiBDb25maXJtT3B0aW9ucyA9IHtcbiAgICAgIG1heFJldHJpZXM6IE1BWF9SRVRSSUVTLFxuICAgIH07XG5cbiAgICByZXR1cm4gYXdhaXQgc2VuZEFuZENvbmZpcm1UcmFuc2FjdGlvbihcbiAgICAgIE5vZGUuZ2V0Q29ubmVjdGlvbigpLFxuICAgICAgdHJhbnNhY3Rpb24sXG4gICAgICBmaW5hbFNpZ25lcnMsXG4gICAgICBvcHRpb25zLFxuICAgICk7XG4gIH07XG59XG4iLCAiaW1wb3J0IHtcbiAgQ29uZmlybU9wdGlvbnMsXG4gIEtleXBhaXIsXG4gIHNlbmRBbmRDb25maXJtVHJhbnNhY3Rpb24sXG4gIFRyYW5zYWN0aW9uLFxuICBUcmFuc2FjdGlvbkluc3RydWN0aW9uLFxuICBUcmFuc2FjdGlvblNpZ25hdHVyZSxcbn0gZnJvbSAnQHNvbGFuYS93ZWIzLmpzJztcblxuaW1wb3J0IHsgQ29uc3RhbnRzLCBkZWJ1Z0xvZywgUmVzdWx0LCBUcnkgfSBmcm9tICd+L3NoYXJlZCc7XG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnfi9ub2RlJztcbmltcG9ydCB7IE1BWF9SRVRSSUVTIH0gZnJvbSAnLi9pbnN0cnVjdGlvbi9kZWZpbmUnO1xuaW1wb3J0IHsgSW5zdHJ1Y3Rpb24gfSBmcm9tICcuL2luc3RydWN0aW9uJztcblxuZXhwb3J0IGNsYXNzIE1pbnRJbnN0cnVjdGlvbiBleHRlbmRzIEluc3RydWN0aW9uIHtcbiAgY29uc3RydWN0b3IoXG4gICAgaW5zdHJ1Y3Rpb25zOiBUcmFuc2FjdGlvbkluc3RydWN0aW9uW10sXG4gICAgc2lnbmVyczogS2V5cGFpcltdLFxuICAgIGZlZVBheWVyPzogS2V5cGFpcixcbiAgICBkYXRhPzogdW5rbm93bixcbiAgKSB7XG4gICAgc3VwZXIoaW5zdHJ1Y3Rpb25zLCBzaWduZXJzLCBmZWVQYXllciwgZGF0YSk7XG4gIH1cblxuICBzdWJtaXQgPSBhc3luYyAoKTogUHJvbWlzZTxSZXN1bHQ8VHJhbnNhY3Rpb25TaWduYXR1cmUsIEVycm9yPj4gPT4ge1xuICAgIHJldHVybiBUcnkoYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE1pbnRJbnN0cnVjdGlvbikpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ29ubHkgTWludEluc3RydWN0aW9uIG9iamVjdCB0aGF0IGNhbiB1c2UgdGhpcycpO1xuICAgICAgfVxuICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSBuZXcgVHJhbnNhY3Rpb24oKTtcbiAgICAgIGNvbnN0IGJsb2NraGFzaE9iaiA9IGF3YWl0IE5vZGUuZ2V0Q29ubmVjdGlvbigpLmdldExhdGVzdEJsb2NraGFzaCgpO1xuICAgICAgdHJhbnNhY3Rpb24ubGFzdFZhbGlkQmxvY2tIZWlnaHQgPSBibG9ja2hhc2hPYmoubGFzdFZhbGlkQmxvY2tIZWlnaHQ7XG4gICAgICB0cmFuc2FjdGlvbi5yZWNlbnRCbG9ja2hhc2ggPSBibG9ja2hhc2hPYmouYmxvY2toYXNoO1xuICAgICAgbGV0IGZpbmFsU2lnbmVycyA9IHRoaXMuc2lnbmVycztcblxuICAgICAgaWYgKHRoaXMuZmVlUGF5ZXIpIHtcbiAgICAgICAgdHJhbnNhY3Rpb24uZmVlUGF5ZXIgPSB0aGlzLmZlZVBheWVyLnB1YmxpY0tleTtcbiAgICAgICAgZmluYWxTaWduZXJzID0gW3RoaXMuZmVlUGF5ZXIsIC4uLnRoaXMuc2lnbmVyc107XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zLmZvckVhY2goKGluc3QpID0+IHRyYW5zYWN0aW9uLmFkZChpbnN0KSk7XG5cbiAgICAgIGNvbnN0IG9wdGlvbnM6IENvbmZpcm1PcHRpb25zID0ge1xuICAgICAgICBtYXhSZXRyaWVzOiBNQVhfUkVUUklFUyxcbiAgICAgIH07XG5cbiAgICAgIGlmIChOb2RlLmdldENvbm5lY3Rpb24oKS5ycGNFbmRwb2ludCA9PT0gQ29uc3RhbnRzLkVuZFBvaW50VXJsLnByZCkge1xuICAgICAgICBkZWJ1Z0xvZygnIyBDaGFuZ2UgbWV0YXBsZXggY2x1c3RlciBvbiBtYWlubmV0LWJldGEnKTtcbiAgICAgICAgTm9kZS5jaGFuZ2VDb25uZWN0aW9uKHsgY2x1c3RlcjogQ29uc3RhbnRzLkNsdXN0ZXIucHJkTWV0YXBsZXggfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhd2FpdCBzZW5kQW5kQ29uZmlybVRyYW5zYWN0aW9uKFxuICAgICAgICBOb2RlLmdldENvbm5lY3Rpb24oKSxcbiAgICAgICAgdHJhbnNhY3Rpb24sXG4gICAgICAgIGZpbmFsU2lnbmVycyxcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG59XG4iLCAiaW1wb3J0IHtcbiAgQ29uZmlybU9wdGlvbnMsXG4gIFRyYW5zYWN0aW9uLFxuICBUcmFuc2FjdGlvblNpZ25hdHVyZSxcbn0gZnJvbSAnQHNvbGFuYS93ZWIzLmpzJztcblxuaW1wb3J0IHsgUmVzdWx0LCBUcnkgfSBmcm9tICd+L3NoYXJlZCc7XG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnfi9ub2RlJztcbmltcG9ydCB7IFB1YmtleSwgU2VjcmV0IH0gZnJvbSAnfi90eXBlcy9hY2NvdW50JztcbmltcG9ydCB7IE1BWF9SRVRSSUVTIH0gZnJvbSAnLi9pbnN0cnVjdGlvbi9kZWZpbmUnO1xuXG5leHBvcnQgY2xhc3MgUGFydGlhbFNpZ25JbnN0cnVjdGlvbiB7XG4gIGhleEluc3RydWN0aW9uOiBzdHJpbmc7XG4gIGRhdGE/OiBQdWJrZXk7XG5cbiAgY29uc3RydWN0b3IoaW5zdHJ1Y3Rpb25zOiBzdHJpbmcsIG1pbnQ/OiBQdWJrZXkpIHtcbiAgICB0aGlzLmhleEluc3RydWN0aW9uID0gaW5zdHJ1Y3Rpb25zO1xuICAgIHRoaXMuZGF0YSA9IG1pbnQ7XG4gIH1cblxuICBzdWJtaXQgPSBhc3luYyAoXG4gICAgZmVlUGF5ZXI6IFNlY3JldCxcbiAgKTogUHJvbWlzZTxSZXN1bHQ8VHJhbnNhY3Rpb25TaWduYXR1cmUsIEVycm9yPj4gPT4ge1xuICAgIHJldHVybiBUcnkoYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFBhcnRpYWxTaWduSW5zdHJ1Y3Rpb24pKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdvbmx5IFBhcnRpYWxTaWduSW5zdHJ1Y3Rpb24gb2JqZWN0IHRoYXQgY2FuIHVzZSB0aGlzJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRlY29kZSA9IEJ1ZmZlci5mcm9tKHRoaXMuaGV4SW5zdHJ1Y3Rpb24sICdoZXgnKTtcbiAgICAgIGNvbnN0IHRyYW5zYWN0aW9uRnJvbUpzb24gPSBUcmFuc2FjdGlvbi5mcm9tKGRlY29kZSk7XG4gICAgICB0cmFuc2FjdGlvbkZyb21Kc29uLnBhcnRpYWxTaWduKGZlZVBheWVyLnRvS2V5cGFpcigpKTtcblxuICAgICAgY29uc3Qgb3B0aW9uczogQ29uZmlybU9wdGlvbnMgPSB7XG4gICAgICAgIG1heFJldHJpZXM6IE1BWF9SRVRSSUVTLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IHdpcmVUcmFuc2FjdGlvbiA9IHRyYW5zYWN0aW9uRnJvbUpzb24uc2VyaWFsaXplKCk7XG4gICAgICByZXR1cm4gYXdhaXQgTm9kZS5nZXRDb25uZWN0aW9uKCkuc2VuZFJhd1RyYW5zYWN0aW9uKFxuICAgICAgICB3aXJlVHJhbnNhY3Rpb24sXG4gICAgICAgIG9wdGlvbnMsXG4gICAgICApO1xuICAgIH0pO1xuICB9O1xufVxuIiwgImltcG9ydCB7IFRyYW5zYWN0aW9uSW5zdHJ1Y3Rpb24gfSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuaW1wb3J0IHsgZGVidWdMb2csIHNsZWVwIH0gZnJvbSAnfi9zaGFyZWQnO1xuXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnfi9ub2RlJztcbmltcG9ydCB7IEluc3RydWN0aW9uIH0gZnJvbSAnfi9pbnN0cnVjdGlvbic7XG5pbXBvcnQgeyBQdWJrZXksIFNlY3JldCB9IGZyb20gJ34vdHlwZXMvYWNjb3VudCc7XG5cbmltcG9ydCB7XG4gIEFTU09DSUFURURfVE9LRU5fUFJPR1JBTV9JRCxcbiAgY3JlYXRlQXNzb2NpYXRlZFRva2VuQWNjb3VudEluc3RydWN0aW9uLFxuICBnZXRBY2NvdW50LFxuICBnZXRBc3NvY2lhdGVkVG9rZW5BZGRyZXNzU3luYyxcbiAgVE9LRU5fUFJPR1JBTV9JRCxcbiAgVG9rZW5BY2NvdW50Tm90Rm91bmRFcnJvcixcbiAgVG9rZW5JbnZhbGlkQWNjb3VudE93bmVyRXJyb3IsXG59IGZyb20gJ0Bzb2xhbmEvc3BsLXRva2VuJztcblxuaW1wb3J0IHsgS2V5cGFpckFjY291bnQgfSBmcm9tICcuL2tleXBhaXItYWNjb3VudCc7XG5cbi8qKlxuICogR2V0IEFzc29jaWF0ZWQgdG9rZW4gQWNjb3VudC5cbiAqIGlmIG5vdCBjcmVhdGVkLCBjcmVhdGUgbmV3IHRva2VuIGFjY291aW50XG4gKlxuICogQHBhcmFtIHtQdWJrZXl9IG1pbnRcbiAqIEBwYXJhbSB7UHVia2V5fSBvd25lclxuICogQHBhcmFtIHtTZWNyZXR9IGZlZVBheWVyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFsbG93T3duZXJPZmZDdXJ2ZVxuICogQHJldHVybnMgUHJvbWlzZTxzdHJpbmcgfCBJbnN0cnVjdGlvbj5cbiAqL1xuZXhwb3J0IG5hbWVzcGFjZSBBc3NvY2lhdGVkQWNjb3VudCB7XG4gIGNvbnN0IFJFVFJZX09WRVJfTElNSVQgPSAxMDtcbiAgY29uc3QgUkVUUllfU0xFRVBfVElNRSA9IDM7XG4gIGNvbnN0IGdldCA9IGFzeW5jIChcbiAgICBtaW50OiBQdWJrZXksXG4gICAgb3duZXI6IFB1YmtleSxcbiAgICBmZWVQYXllcjogU2VjcmV0LFxuICAgIGFsbG93T3duZXJPZmZDdXJ2ZSA9IGZhbHNlLFxuICApOiBQcm9taXNlPHN0cmluZyB8IEluc3RydWN0aW9uPiA9PiB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgbWFrZU9yQ3JlYXRlSW5zdHJ1Y3Rpb24oXG4gICAgICBtaW50LFxuICAgICAgb3duZXIsXG4gICAgICBuZXcgS2V5cGFpckFjY291bnQoeyBzZWNyZXQ6IGZlZVBheWVyIH0pLnB1YmtleSxcbiAgICAgIGFsbG93T3duZXJPZmZDdXJ2ZSxcbiAgICApO1xuXG4gICAgaWYgKCFyZXMuaW5zdCkge1xuICAgICAgcmV0dXJuIHJlcy50b2tlbkFjY291bnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihcbiAgICAgIFtyZXMuaW5zdF0sXG4gICAgICBbXSxcbiAgICAgIGZlZVBheWVyLnRvS2V5cGFpcigpLFxuICAgICAgcmVzLnRva2VuQWNjb3VudCxcbiAgICApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXRyeSBmdW5jdGlvbiBpZiBjcmVhdGUgbmV3IHRva2VuIGFjY291aW50XG4gICAqXG4gICAqIEBwYXJhbSB7UHVia2V5fSBtaW50XG4gICAqIEBwYXJhbSB7UHVia2V5fSBvd25lclxuICAgKiBAcGFyYW0ge1NlY3JldH0gZmVlUGF5ZXJcbiAgICogQHJldHVybnMgUHJvbWlzZTxzdHJpbmc+XG4gICAqL1xuICBleHBvcnQgY29uc3QgcmV0cnlHZXRPckNyZWF0ZSA9IGFzeW5jIChcbiAgICBtaW50OiBQdWJrZXksXG4gICAgb3duZXI6IFB1YmtleSxcbiAgICBmZWVQYXllcjogU2VjcmV0LFxuICApOiBQcm9taXNlPHN0cmluZz4gPT4ge1xuICAgIGxldCBjb3VudGVyID0gMTtcbiAgICB3aGlsZSAoY291bnRlciA8IFJFVFJZX09WRVJfTElNSVQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGluc3QgPSBhd2FpdCBnZXQobWludCwgb3duZXIsIGZlZVBheWVyLCB0cnVlKTtcblxuICAgICAgICBpZiAoaW5zdCAmJiB0eXBlb2YgaW5zdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBkZWJ1Z0xvZygnIyBhc3NvY2lhdGVkVG9rZW5BY2NvdW50OiAnLCBpbnN0KTtcbiAgICAgICAgICByZXR1cm4gaW5zdDtcbiAgICAgICAgfSBlbHNlIGlmIChpbnN0IGluc3RhbmNlb2YgSW5zdHJ1Y3Rpb24pIHtcbiAgICAgICAgICAoYXdhaXQgaW5zdC5zdWJtaXQoKSkubWFwKFxuICAgICAgICAgICAgYXN5bmMgKG9rKSA9PiB7XG4gICAgICAgICAgICAgIGF3YWl0IE5vZGUuY29uZmlybWVkU2lnKG9rKTtcbiAgICAgICAgICAgICAgcmV0dXJuIGluc3QuZGF0YSBhcyBzdHJpbmc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgKGVycikgPT4ge1xuICAgICAgICAgICAgICBkZWJ1Z0xvZygnIyBFcnJvciBzdWJtaXQgcmV0cnlHZXRPckNyZWF0ZTogJywgZXJyKTtcbiAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRlYnVnTG9nKGAjIHJldHJ5OiAke2NvdW50ZXJ9IGNyZWF0ZSB0b2tlbiBhY2NvdW50OiBgLCBlKTtcbiAgICAgICAgZGVidWdMb2coYCMgbWludDogJHttaW50fSwgb3duZXI6ICR7b3duZXJ9LCBmZWVQYXllcjogJHtmZWVQYXllcn1gKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IHNsZWVwKFJFVFJZX1NMRUVQX1RJTUUpO1xuICAgICAgY291bnRlcisrO1xuICAgIH1cbiAgICB0aHJvdyBFcnJvcihgcmV0cnkgYWN0aW9uIGlzIG92ZXIgbGltaXQgJHtSRVRSWV9PVkVSX0xJTUlUfWApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBbTWFpbiBsb2dpY11HZXQgQXNzb2NpYXRlZCB0b2tlbiBBY2NvdW50LlxuICAgKiBpZiBub3QgY3JlYXRlZCwgY3JlYXRlIG5ldyB0b2tlbiBhY2NvdWludFxuICAgKlxuICAgKiBAcGFyYW0ge1B1YmtleX0gbWludFxuICAgKiBAcGFyYW0ge1B1YmtleX0gb3duZXJcbiAgICogQHBhcmFtIHtQdWJrZXl9IGZlZVBheWVyXG4gICAqIEByZXR1cm5zIFByb21pc2U8c3RyaW5nPlxuICAgKi9cbiAgZXhwb3J0IGNvbnN0IG1ha2VPckNyZWF0ZUluc3RydWN0aW9uID0gYXN5bmMgKFxuICAgIG1pbnQ6IFB1YmtleSxcbiAgICBvd25lcjogUHVia2V5LFxuICAgIGZlZVBheWVyPzogUHVia2V5LFxuICAgIGFsbG93T3duZXJPZmZDdXJ2ZSA9IGZhbHNlLFxuICApOiBQcm9taXNlPHtcbiAgICB0b2tlbkFjY291bnQ6IHN0cmluZztcbiAgICBpbnN0OiBUcmFuc2FjdGlvbkluc3RydWN0aW9uIHwgdW5kZWZpbmVkO1xuICB9PiA9PiB7XG4gICAgY29uc3QgYXNzb2NpYXRlZFRva2VuQWNjb3VudCA9IGdldEFzc29jaWF0ZWRUb2tlbkFkZHJlc3NTeW5jKFxuICAgICAgbWludC50b1B1YmxpY0tleSgpLFxuICAgICAgb3duZXIudG9QdWJsaWNLZXkoKSxcbiAgICAgIGFsbG93T3duZXJPZmZDdXJ2ZSxcbiAgICAgIFRPS0VOX1BST0dSQU1fSUQsXG4gICAgICBBU1NPQ0lBVEVEX1RPS0VOX1BST0dSQU1fSUQsXG4gICAgKTtcblxuICAgIGRlYnVnTG9nKCcjIGFzc29jaWF0ZWRUb2tlbkFjY291bnQ6ICcsIGFzc29jaWF0ZWRUb2tlbkFjY291bnQudG9TdHJpbmcoKSk7XG5cbiAgICB0cnkge1xuICAgICAgLy8gRG9udCB1c2UgUmVzdWx0XG4gICAgICBhd2FpdCBnZXRBY2NvdW50KFxuICAgICAgICBOb2RlLmdldENvbm5lY3Rpb24oKSxcbiAgICAgICAgYXNzb2NpYXRlZFRva2VuQWNjb3VudCxcbiAgICAgICAgTm9kZS5nZXRDb25uZWN0aW9uKCkuY29tbWl0bWVudCxcbiAgICAgICAgVE9LRU5fUFJPR1JBTV9JRCxcbiAgICAgICk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0b2tlbkFjY291bnQ6IGFzc29jaWF0ZWRUb2tlbkFjY291bnQudG9TdHJpbmcoKSxcbiAgICAgICAgaW5zdDogdW5kZWZpbmVkLFxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnJvcjogdW5rbm93bikge1xuICAgICAgaWYgKFxuICAgICAgICAhKGVycm9yIGluc3RhbmNlb2YgVG9rZW5BY2NvdW50Tm90Rm91bmRFcnJvcikgJiZcbiAgICAgICAgIShlcnJvciBpbnN0YW5jZW9mIFRva2VuSW52YWxpZEFjY291bnRPd25lckVycm9yKVxuICAgICAgKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdVbmV4cGVjdGVkIGVycm9yJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHBheWVyID0gIWZlZVBheWVyID8gb3duZXIgOiBmZWVQYXllcjtcblxuICAgICAgY29uc3QgaW5zdCA9IGNyZWF0ZUFzc29jaWF0ZWRUb2tlbkFjY291bnRJbnN0cnVjdGlvbihcbiAgICAgICAgcGF5ZXIudG9QdWJsaWNLZXkoKSxcbiAgICAgICAgYXNzb2NpYXRlZFRva2VuQWNjb3VudCxcbiAgICAgICAgb3duZXIudG9QdWJsaWNLZXkoKSxcbiAgICAgICAgbWludC50b1B1YmxpY0tleSgpLFxuICAgICAgICBUT0tFTl9QUk9HUkFNX0lELFxuICAgICAgICBBU1NPQ0lBVEVEX1RPS0VOX1BST0dSQU1fSUQsXG4gICAgICApO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB0b2tlbkFjY291bnQ6IGFzc29jaWF0ZWRUb2tlbkFjY291bnQudG9TdHJpbmcoKSxcbiAgICAgICAgaW5zdCxcbiAgICAgIH07XG4gICAgfVxuICB9O1xufVxuIiwgImltcG9ydCB7IEtleXBhaXIsIFB1YmxpY0tleSB9IGZyb20gJ0Bzb2xhbmEvd2ViMy5qcyc7XG5pbXBvcnQgeyBQdWJrZXksIFNlY3JldCB9IGZyb20gJ34vdHlwZXMvYWNjb3VudCc7XG5pbXBvcnQgYnMgZnJvbSAnYnM1OCc7XG5cbmV4cG9ydCBjbGFzcyBLZXlwYWlyQWNjb3VudCB7XG4gIHNlY3JldDogU2VjcmV0O1xuICBwdWJrZXk6IFB1YmtleTtcblxuICBjb25zdHJ1Y3RvcihwYXJhbXM6IHsgcHVia2V5PzogUHVia2V5OyBzZWNyZXQ6IFNlY3JldCB9KSB7XG4gICAgaWYgKCFwYXJhbXMucHVia2V5KSB7XG4gICAgICBjb25zdCBrZXlwYWlyID0gcGFyYW1zLnNlY3JldC50b0tleXBhaXIoKTtcbiAgICAgIHRoaXMucHVia2V5ID0ga2V5cGFpci5wdWJsaWNLZXkudG9TdHJpbmcoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wdWJrZXkgPSBwYXJhbXMucHVia2V5O1xuICAgIH1cbiAgICB0aGlzLnNlY3JldCA9IHBhcmFtcy5zZWNyZXQ7XG4gIH1cblxuICB0b1B1YmxpY0tleSgpOiBQdWJsaWNLZXkge1xuICAgIHJldHVybiBuZXcgUHVibGljS2V5KHRoaXMucHVia2V5KTtcbiAgfVxuXG4gIHRvS2V5cGFpcigpOiBLZXlwYWlyIHtcbiAgICBjb25zdCBkZWNvZGVkID0gYnMuZGVjb2RlKHRoaXMuc2VjcmV0KTtcbiAgICByZXR1cm4gS2V5cGFpci5mcm9tU2VjcmV0S2V5KGRlY29kZWQpO1xuICB9XG5cbiAgc3RhdGljIGlzUHVia2V5ID0gKHZhbHVlOiBzdHJpbmcpOiB2YWx1ZSBpcyBQdWJrZXkgPT5cbiAgICAvXlswLTlhLXpBLVpdezMyLDQ0fSQvLnRlc3QodmFsdWUpO1xuXG4gIHN0YXRpYyBpc1NlY3JldCA9ICh2YWx1ZTogc3RyaW5nKTogdmFsdWUgaXMgU2VjcmV0ID0+XG4gICAgL15bMC05YS16QS1aXXs4Nyw4OH0kLy50ZXN0KHZhbHVlKTtcblxuICBzdGF0aWMgY3JlYXRlID0gKCk6IEtleXBhaXJBY2NvdW50ID0+IHtcbiAgICBjb25zdCBrZXlwYWlyID0gS2V5cGFpci5nZW5lcmF0ZSgpO1xuICAgIHJldHVybiBuZXcgS2V5cGFpckFjY291bnQoe1xuICAgICAgcHVia2V5OiBrZXlwYWlyLnB1YmxpY0tleS50b1N0cmluZygpIGFzIFB1YmtleSxcbiAgICAgIHNlY3JldDogYnMuZW5jb2RlKGtleXBhaXIuc2VjcmV0S2V5KSBhcyBTZWNyZXQsXG4gICAgfSk7XG4gIH07XG5cbiAgc3RhdGljIHRvS2V5UGFpciA9IChrZXlwYWlyOiBLZXlwYWlyKTogS2V5cGFpckFjY291bnQgPT4ge1xuICAgIHJldHVybiBuZXcgS2V5cGFpckFjY291bnQoe1xuICAgICAgcHVia2V5OiBrZXlwYWlyLnB1YmxpY0tleS50b1N0cmluZygpIGFzIFB1YmtleSxcbiAgICAgIHNlY3JldDogYnMuZW5jb2RlKGtleXBhaXIuc2VjcmV0S2V5KSBhcyBTZWNyZXQsXG4gICAgfSk7XG4gIH07XG59XG4iLCAiaW1wb3J0IHsgUHVibGljS2V5IH0gZnJvbSAnQHNvbGFuYS93ZWIzLmpzJztcbmltcG9ydCB7IFBST0dSQU1fSUQgfSBmcm9tICdAbWV0YXBsZXgtZm91bmRhdGlvbi9tcGwtdG9rZW4tbWV0YWRhdGEnO1xuaW1wb3J0IHsgUHVia2V5IH0gZnJvbSAnfi90eXBlcy9hY2NvdW50JztcblxuZXhwb3J0IG5hbWVzcGFjZSBQZGEge1xuICBleHBvcnQgY29uc3QgZ2V0TWV0YWRhdGEgPSAobWludDogUHVia2V5KTogUHVibGljS2V5ID0+IHtcbiAgICBjb25zdCBbcHVibGljS2V5XSA9IFB1YmxpY0tleS5maW5kUHJvZ3JhbUFkZHJlc3NTeW5jKFxuICAgICAgW1xuICAgICAgICBCdWZmZXIuZnJvbSgnbWV0YWRhdGEnKSxcbiAgICAgICAgUFJPR1JBTV9JRC50b0J1ZmZlcigpLFxuICAgICAgICBtaW50LnRvUHVibGljS2V5KCkudG9CdWZmZXIoKSxcbiAgICAgIF0sXG4gICAgICBQUk9HUkFNX0lELFxuICAgICk7XG4gICAgcmV0dXJuIHB1YmxpY0tleTtcbiAgfTtcblxuICBleHBvcnQgY29uc3QgZ2V0TWFzdGVyRWRpdGlvbiA9IChtaW50OiBQdWJrZXkpOiBQdWJsaWNLZXkgPT4ge1xuICAgIGNvbnN0IFtwdWJsaWNLZXldID0gUHVibGljS2V5LmZpbmRQcm9ncmFtQWRkcmVzc1N5bmMoXG4gICAgICBbXG4gICAgICAgIEJ1ZmZlci5mcm9tKCdtZXRhZGF0YScpLFxuICAgICAgICBQUk9HUkFNX0lELnRvQnVmZmVyKCksXG4gICAgICAgIG1pbnQudG9QdWJsaWNLZXkoKS50b0J1ZmZlcigpLFxuICAgICAgICBCdWZmZXIuZnJvbSgnZWRpdGlvbicpLFxuICAgICAgXSxcbiAgICAgIFBST0dSQU1fSUQsXG4gICAgKTtcbiAgICByZXR1cm4gcHVibGljS2V5O1xuICB9O1xufVxuIiwgImltcG9ydCB7IENvbnZlcnRlciBhcyBfQ3JlYXRvcnMgfSBmcm9tICcuL2NyZWF0b3JzJztcbmltcG9ydCB7IENvbnZlcnRlciBhcyBfVXNlcyB9IGZyb20gJy4vdXNlcyc7XG5pbXBvcnQge1xuICBJbmZyYVNpZGVJbnB1dCxcbiAgSW5mcmFTaWRlT3V0cHV0LFxuICBVc2VyU2lkZUlucHV0LFxuICBVc2VyU2lkZU91dHB1dCxcbn0gZnJvbSAnfi90eXBlcy9jb252ZXJ0ZXInO1xuXG5pbXBvcnQgeyBjb252ZXJ0VGltZXN0YW1wVG9EYXRlVGltZSB9IGZyb20gJ34vc2hhcmVkJztcbmV4cG9ydCBuYW1lc3BhY2UgQ29udmVydGVyIHtcbiAgZXhwb3J0IG5hbWVzcGFjZSBUb2tlbk1ldGFkYXRhIHtcbiAgICBleHBvcnQgY29uc3QgaW50b0luZnJhU2lkZSA9IChcbiAgICAgIGlucHV0OiBVc2VyU2lkZUlucHV0LlRva2VuTWV0YWRhdGEsXG4gICAgICB1cmk6IHN0cmluZyxcbiAgICAgIHNlbGxlckZlZUJhc2lzUG9pbnRzOiBudW1iZXIsXG4gICAgKTogSW5mcmFTaWRlSW5wdXQuTWV0YXBsZXhEYXRhVjIgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogaW5wdXQubmFtZSxcbiAgICAgICAgc3ltYm9sOiBpbnB1dC5zeW1ib2wsXG4gICAgICAgIHVyaSxcbiAgICAgICAgc2VsbGVyRmVlQmFzaXNQb2ludHMsXG4gICAgICAgIGNyZWF0b3JzOiBfQ3JlYXRvcnMuQ3JlYXRvcnMuaW50b0luZnJhU2lkZShpbnB1dC5jcmVhdG9ycyksXG4gICAgICAgIGNvbGxlY3Rpb246IG51bGwsXG4gICAgICAgIHVzZXM6IGlucHV0LnVzZXMgfHwgbnVsbCxcbiAgICAgIH07XG4gICAgfTtcblxuICAgIGV4cG9ydCBjb25zdCBpbnRvVXNlclNpZGUgPSAoXG4gICAgICBvdXRwdXQ6IEluZnJhU2lkZU91dHB1dC5PbmNoYWluQW5kT2ZmY2hhaW4sXG4gICAgICB0b2tlbkFtb3VudDogc3RyaW5nLFxuICAgICk6IFVzZXJTaWRlT3V0cHV0LlRva2VuTWV0YWRhdGEgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWludDogb3V0cHV0Lm9uY2hhaW4ubWludC50b1N0cmluZygpLFxuICAgICAgICByb3lhbHR5OiBvdXRwdXQub25jaGFpbi5kYXRhLnNlbGxlckZlZUJhc2lzUG9pbnRzLFxuICAgICAgICBuYW1lOiBkZWxldGVOdWxsU3RyaW5ncyhvdXRwdXQub25jaGFpbi5kYXRhLm5hbWUpLFxuICAgICAgICBzeW1ib2w6IGRlbGV0ZU51bGxTdHJpbmdzKG91dHB1dC5vbmNoYWluLmRhdGEuc3ltYm9sKSxcbiAgICAgICAgdG9rZW5BbW91bnQ6IHRva2VuQW1vdW50LFxuICAgICAgICB1cmk6IGRlbGV0ZU51bGxTdHJpbmdzKG91dHB1dC5vbmNoYWluLmRhdGEudXJpKSxcbiAgICAgICAgY3JlYXRvcnM6IF9DcmVhdG9ycy5DcmVhdG9ycy5pbnRvVXNlclNpZGUob3V0cHV0Lm9uY2hhaW4uZGF0YS5jcmVhdG9ycyksXG4gICAgICAgIHVzZXM6IF9Vc2VzLlVzZXMuaW50b1VzZXJTaWRlKG91dHB1dC5vbmNoYWluLnVzZXMpLFxuICAgICAgICBkYXRlVGltZTogY29udmVydFRpbWVzdGFtcFRvRGF0ZVRpbWUob3V0cHV0Lm9mZmNoYWluLmNyZWF0ZWRfYXQpLFxuICAgICAgICBvZmZjaGFpbjogb3V0cHV0Lm9mZmNoYWluLFxuICAgICAgfTtcbiAgICB9O1xuICAgIC8vIGRlbGV0ZSBOVUxMKDB4MDApIHN0cmluZ3MgZnVuY3Rpb25cbiAgICBleHBvcnQgY29uc3QgZGVsZXRlTnVsbFN0cmluZ3MgPSAoc3RyOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXDAvZywgJycpO1xuICAgIH07XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBDb252ZXJ0ZXIgYXMgX0NvbGxlY3Rpb24gfSBmcm9tICcuL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIF9DcmVhdG9ycyB9IGZyb20gJy4vY3JlYXRvcnMnO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIF9Vc2VzIH0gZnJvbSAnLi91c2VzJztcbmltcG9ydCB7IENvbnZlcnRlciBhcyBfVG9rZW4gfSBmcm9tICcuL3Rva2VuLW1ldGFkYXRhJztcbmltcG9ydCB7XG4gIEluZnJhU2lkZUlucHV0LFxuICBJbmZyYVNpZGVPdXRwdXQsXG4gIFVzZXJTaWRlSW5wdXQsXG4gIFVzZXJTaWRlT3V0cHV0LFxufSBmcm9tICd+L3R5cGVzL2NvbnZlcnRlcic7XG5cbmltcG9ydCB7IGNvbnZlcnRUaW1lc3RhbXBUb0RhdGVUaW1lIH0gZnJvbSAnfi9zaGFyZWQnO1xuXG5leHBvcnQgbmFtZXNwYWNlIENvbnZlcnRlciB7XG4gIGV4cG9ydCBuYW1lc3BhY2UgTmZ0TWV0YWRhdGEge1xuICAgIGV4cG9ydCBjb25zdCBpbnRvSW5mcmFTaWRlID0gKFxuICAgICAgaW5wdXQ6IFVzZXJTaWRlSW5wdXQuTmZ0TWV0YWRhdGEsXG4gICAgICB1cmk6IHN0cmluZyxcbiAgICAgIHNlbGxlckZlZUJhc2lzUG9pbnRzOiBudW1iZXIsXG4gICAgKTogSW5mcmFTaWRlSW5wdXQuTWV0YXBsZXhEYXRhVjIgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogaW5wdXQubmFtZSxcbiAgICAgICAgc3ltYm9sOiBpbnB1dC5zeW1ib2wsXG4gICAgICAgIHVyaSxcbiAgICAgICAgc2VsbGVyRmVlQmFzaXNQb2ludHMsXG4gICAgICAgIGNyZWF0b3JzOiBfQ3JlYXRvcnMuQ3JlYXRvcnMuaW50b0luZnJhU2lkZShpbnB1dC5jcmVhdG9ycyksXG4gICAgICAgIGNvbGxlY3Rpb246IF9Db2xsZWN0aW9uLkNvbGxlY3Rpb24uaW50b0luZnJhU2lkZShpbnB1dC5jb2xsZWN0aW9uKSxcbiAgICAgICAgdXNlczogaW5wdXQudXNlcyB8fCBudWxsLFxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgZXhwb3J0IGNvbnN0IGludG9Vc2VyU2lkZSA9IChcbiAgICAgIG91dHB1dDogSW5mcmFTaWRlT3V0cHV0Lk9uY2hhaW5BbmRPZmZjaGFpbixcbiAgICAgIHRva2VuQW1vdW50OiBzdHJpbmcsXG4gICAgKTogVXNlclNpZGVPdXRwdXQuTmZ0TWV0YWRhdGEgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWludDogb3V0cHV0Lm9uY2hhaW4ubWludC50b1N0cmluZygpLFxuICAgICAgICB1cGRhdGVBdXRob3JpdHk6IG91dHB1dC5vbmNoYWluLnVwZGF0ZUF1dGhvcml0eS50b1N0cmluZygpLFxuICAgICAgICByb3lhbHR5OiBvdXRwdXQub25jaGFpbi5kYXRhLnNlbGxlckZlZUJhc2lzUG9pbnRzLFxuICAgICAgICBuYW1lOiBfVG9rZW4uVG9rZW5NZXRhZGF0YS5kZWxldGVOdWxsU3RyaW5ncyhvdXRwdXQub25jaGFpbi5kYXRhLm5hbWUpLFxuICAgICAgICBzeW1ib2w6IF9Ub2tlbi5Ub2tlbk1ldGFkYXRhLmRlbGV0ZU51bGxTdHJpbmdzKFxuICAgICAgICAgIG91dHB1dC5vbmNoYWluLmRhdGEuc3ltYm9sLFxuICAgICAgICApLFxuICAgICAgICB0b2tlbkFtb3VudDogdG9rZW5BbW91bnQsXG4gICAgICAgIHVyaTogX1Rva2VuLlRva2VuTWV0YWRhdGEuZGVsZXRlTnVsbFN0cmluZ3Mob3V0cHV0Lm9uY2hhaW4uZGF0YS51cmkpLFxuICAgICAgICBpc011dGFibGU6IG91dHB1dC5vbmNoYWluLmlzTXV0YWJsZSxcbiAgICAgICAgcHJpbWFyeVNhbGVIYXBwZW5lZDogb3V0cHV0Lm9uY2hhaW4ucHJpbWFyeVNhbGVIYXBwZW5lZCxcbiAgICAgICAgY3JlYXRvcnM6IF9DcmVhdG9ycy5DcmVhdG9ycy5pbnRvVXNlclNpZGUob3V0cHV0Lm9uY2hhaW4uZGF0YS5jcmVhdG9ycyksXG4gICAgICAgIGVkaXRpb25Ob25jZTogb3V0cHV0Lm9uY2hhaW4uZWRpdGlvbk5vbmNlLFxuICAgICAgICBjb2xsZWN0aW9uOiBfQ29sbGVjdGlvbi5Db2xsZWN0aW9uLmludG9Vc2VyU2lkZShcbiAgICAgICAgICBvdXRwdXQub25jaGFpbi5jb2xsZWN0aW9uLFxuICAgICAgICApLFxuICAgICAgICB1c2VzOiBfVXNlcy5Vc2VzLmludG9Vc2VyU2lkZShvdXRwdXQub25jaGFpbi51c2VzKSxcbiAgICAgICAgZGF0ZVRpbWU6IGNvbnZlcnRUaW1lc3RhbXBUb0RhdGVUaW1lKG91dHB1dC5vZmZjaGFpbi5jcmVhdGVkX2F0KSxcbiAgICAgICAgb2ZmY2hhaW46IG91dHB1dC5vZmZjaGFpbixcbiAgICAgIH07XG4gICAgfTtcbiAgfVxufVxuIiwgImltcG9ydCB7IG92ZXJ3cml0ZU9iamVjdCwgUmVzdWx0IH0gZnJvbSAnfi9zaGFyZWQnO1xuaW1wb3J0IHsgU2VjcmV0IH0gZnJvbSAnfi90eXBlcy9hY2NvdW50JztcbmltcG9ydCB7IEZpbGVDb250ZW50LCBJbmZyYVNpZGVJbnB1dCwgVXNlclNpZGVJbnB1dCB9IGZyb20gJ34vdHlwZXMvY29udmVydGVyJztcbmltcG9ydCB7IFN0b3JhZ2VUeXBlIH0gZnJvbSAnfi90eXBlcy9zdG9yYWdlJztcblxuZXhwb3J0IG5hbWVzcGFjZSBDb252ZXJ0ZXIge1xuICBleHBvcnQgbmFtZXNwYWNlIFByb3BlcnRpZXMge1xuICAgIGV4cG9ydCBjb25zdCBpbnRvSW5mcmFTaWRlID0gYXN5bmMgKFxuICAgICAgaW5wdXQ6IFVzZXJTaWRlSW5wdXQuUHJvcGVydGllcyB8IHVuZGVmaW5lZCxcbiAgICAgIHN0b3JhZ2VGdW5jOiAoXG4gICAgICAgIGRhdGE6IEZpbGVDb250ZW50LFxuICAgICAgICBzdG9yYWdlVHlwZTogU3RvcmFnZVR5cGUsXG4gICAgICAgIGZlZVBheWVyPzogU2VjcmV0LFxuICAgICAgKSA9PiBQcm9taXNlPFJlc3VsdDxzdHJpbmcsIEVycm9yPj4sXG4gICAgICBzdG9yYWdlVHlwZTogU3RvcmFnZVR5cGUsXG4gICAgICBmZWVQYXllcj86IFNlY3JldCxcbiAgICApOiBQcm9taXNlPEluZnJhU2lkZUlucHV0LlByb3BlcnRpZXM+ID0+IHtcbiAgICAgIGlmICghaW5wdXQgfHwgIWlucHV0LmZpbGVzKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgaW5wdXQuZmlsZXMubWFwKGFzeW5jIChmaWxlKSA9PiB7XG4gICAgICAgICAgaWYgKCFmaWxlLmZpbGVQYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHN0b3JhZ2VGdW5jKGZpbGUuZmlsZVBhdGgsIHN0b3JhZ2VUeXBlLCBmZWVQYXllcik7XG4gICAgICAgICAgaWYgKHJlcy5pc0Vycikge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IocmVzLmVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gb3ZlcndyaXRlT2JqZWN0KGZpbGUsIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZXhpc3RzS2V5OiAnZmlsZVBhdGgnLFxuICAgICAgICAgICAgICB3aWxsOiB7IGtleTogJ3VyaScsIHZhbHVlOiByZXMudmFsdWUgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcbiAgICAgIHJldHVybiB7IC4uLmlucHV0LCBmaWxlcyB9IGFzIEluZnJhU2lkZUlucHV0LlByb3BlcnRpZXM7XG4gICAgfTtcbiAgfVxufVxuIiwgImV4cG9ydCBuYW1lc3BhY2UgQ29udmVydGVyIHtcbiAgZXhwb3J0IG5hbWVzcGFjZSBSb3lhbHR5IHtcbiAgICBleHBvcnQgY29uc3QgVEhSRVNIT0xEID0gMTAwO1xuICAgIGV4cG9ydCBjb25zdCBpbnRvSW5mcmFTaWRlID0gKHBlcmNlbnRhZ2U6IG51bWJlcikgPT4ge1xuICAgICAgcmV0dXJuIHBlcmNlbnRhZ2UgKiBUSFJFU0hPTEQ7XG4gICAgfTtcbiAgfVxufVxuIiwgImltcG9ydCB7IENvbnZlcnRlciBhcyBDb2xsZWN0aW9uIH0gZnJvbSAnLi9jb2xsZWN0aW9uJztcbmltcG9ydCB7IENvbnZlcnRlciBhcyBDcmVhdG9ycyB9IGZyb20gJy4vY3JlYXRvcnMnO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIE5mdE1ldGFkYXRhIH0gZnJvbSAnLi9uZnQtbWV0YWRhdGEnO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIFByb3BlcnRpZXMgfSBmcm9tICcuL3Byb3BlcnRpZXMnO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIFJveWFsdHkgfSBmcm9tICcuL3JveWFsdHknO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIFRva2VuTWV0YWRhdGEgfSBmcm9tICcuL3Rva2VuLW1ldGFkYXRhJztcbmltcG9ydCB7IENvbnZlcnRlciBhcyBVc2VzIH0gZnJvbSAnLi91c2VzJztcblxuZXhwb3J0IGNvbnN0IENvbnZlcnRlciA9IHtcbiAgLi4uQ29sbGVjdGlvbixcbiAgLi4uQ3JlYXRvcnMsXG4gIC4uLk5mdE1ldGFkYXRhLFxuICAuLi5Qcm9wZXJ0aWVzLFxuICAuLi5Sb3lhbHR5LFxuICAuLi5Ub2tlbk1ldGFkYXRhLFxuICAuLi5Vc2VzLFxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFRTyxJQUFV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QUFBLEVBQ3ZCLEdBQUc7QUFBQSxFQUNILEdBQUdBO0FBQUEsRUFDSCxHQUFHQTtBQUFBLEVBQ0gsR0FBR0E7QUFBQSxFQUNILEdBQUdBO0FBQUEsRUFDSCxHQUFHQTtBQUFBLEVBQ0gsR0FBR0E7QUFDTDsiLAogICJuYW1lcyI6IFsiQ29udmVydGVyIiwgIkNvbGxlY3Rpb24iLCAiQ29udmVydGVyIiwgIkNyZWF0b3JzIiwgIkNvbnZlcnRlciIsICJVc2VzIiwgIkNvbnN0YW50cyIsICJDbHVzdGVyIiwgIkVuZFBvaW50VXJsIiwgImN1c3RvbUNsdXN0ZXJVcmwiLCAiUmVzdWx0IiwgIktleXBhaXIiLCAiUHVibGljS2V5IiwgIk5vZGUiLCAic2VuZEFuZENvbmZpcm1UcmFuc2FjdGlvbiIsICJUcmFuc2FjdGlvbiIsICJJbnN0cnVjdGlvbiIsICJUcmFuc2FjdGlvbiIsICJzZW5kQW5kQ29uZmlybVRyYW5zYWN0aW9uIiwgInNlbmRBbmRDb25maXJtVHJhbnNhY3Rpb24iLCAiVHJhbnNhY3Rpb24iLCAiVHJhbnNhY3Rpb24iLCAiS2V5cGFpciIsICJQdWJsaWNLZXkiLCAiQXNzb2NpYXRlZEFjY291bnQiLCAiSW5zdHJ1Y3Rpb24iLCAiUHVibGljS2V5IiwgIlBkYSIsICJicyIsICJQdWJsaWNLZXkiLCAiS2V5cGFpciIsICJDb252ZXJ0ZXIiLCAiVG9rZW5NZXRhZGF0YSIsICJDb252ZXJ0ZXIiLCAiTmZ0TWV0YWRhdGEiLCAiQ29udmVydGVyIiwgIlByb3BlcnRpZXMiLCAiQ29udmVydGVyIiwgIlJveWFsdHkiLCAiQ29udmVydGVyIl0KfQo=