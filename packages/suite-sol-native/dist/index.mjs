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
        return "https://devnet.irys.xyz";
      default: {
        const index = Date.now() % 2;
        const clusters = ["https://node1.irys.xyz", "https://node2.irys.xyz"];
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
  Constants2.IRYS_GATEWAY_URL = "https://gateway.irys.xyz";
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
((Result11) => {
  function ok(value) {
    return new InternalOk(value);
  }
  Result11.ok = ok;
  function err(error) {
    return new InternalErr(error || Error());
  }
  Result11.err = err;
  function all(obj) {
    if (Array.isArray(obj)) {
      const resArr = [];
      for (const item of obj) {
        if (item.isErr) {
          return item;
        }
        resArr.push(item.value);
      }
      return Result11.ok(resArr);
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
    return Result11.ok(res);
  }
  Result11.all = all;
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

// ../instruction/src/multisig-instruction.ts
import {
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction as TransactionInstruction3
} from "@solana/web3.js";
import { blob, struct, u8 } from "@solana/buffer-layout";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
var MultisigInstruction;
((MultisigInstruction2) => {
  const createLayoutPubKey = (property) => {
    return blob(32, property);
  };
  MultisigInstruction2.Layout = struct([
    u8("m"),
    u8("n"),
    u8("is_initialized"),
    createLayoutPubKey("signer1"),
    createLayoutPubKey("signer2"),
    createLayoutPubKey("signer3"),
    createLayoutPubKey("signer4"),
    createLayoutPubKey("signer5"),
    createLayoutPubKey("signer6"),
    createLayoutPubKey("signer7"),
    createLayoutPubKey("signer8"),
    createLayoutPubKey("signer9"),
    createLayoutPubKey("signer10"),
    createLayoutPubKey("signer11")
  ]);
  MultisigInstruction2.account = (newAccount, feePayer, balanceNeeded) => {
    return SystemProgram.createAccount({
      fromPubkey: feePayer.publicKey,
      newAccountPubkey: newAccount.publicKey,
      lamports: balanceNeeded,
      space: MultisigInstruction2.Layout.span,
      programId: TOKEN_PROGRAM_ID
    });
  };
  MultisigInstruction2.multisig = (m, feePayer, signerPubkey) => {
    const keys = [
      {
        pubkey: feePayer.publicKey,
        isSigner: false,
        isWritable: true
      },
      {
        pubkey: SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false
      }
    ];
    signerPubkey.forEach(
      (pubkey) => keys.push({
        pubkey,
        isSigner: false,
        isWritable: false
      })
    );
    const dataLayout = struct([
      u8("instruction"),
      u8("m")
    ]);
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode(
      {
        instruction: 2,
        m
      },
      data
    );
    return new TransactionInstruction3({
      keys,
      programId: TOKEN_PROGRAM_ID,
      data
    });
  };
})(MultisigInstruction || (MultisigInstruction = {}));

// ../instruction/src/partial-signInstruction.ts
import {
  Transaction as Transaction4
} from "@solana/web3.js";
var PartialSignInstruction = class _PartialSignInstruction {
  hexInstruction;
  data;
  constructor(instructions, mint) {
    this.hexInstruction = instructions;
    this.data = mint;
  }
  submit = async (feePayer) => {
    return Try(async () => {
      if (!(this instanceof _PartialSignInstruction)) {
        throw Error("only PartialSignInstruction object that can use this");
      }
      const decode = Buffer.from(this.hexInstruction, "hex");
      const transactionFromJson = Transaction4.from(decode);
      transactionFromJson.partialSign(feePayer.toKeypair());
      const options = {
        maxRetries: MAX_RETRIES
      };
      const wireTransaction = transactionFromJson.serialize();
      return await Node.getConnection().sendRawTransaction(
        wireTransaction,
        options
      );
    });
  };
};

// ../global/src/index.ts
import { Keypair as Keypair4, LAMPORTS_PER_SOL, PublicKey as PublicKey3 } from "@solana/web3.js";
import { BigNumber } from "bignumber.js";
import bs from "bs58";
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
  return new PublicKey3(this.toString());
};
String.prototype.toKeypair = function() {
  if (!KeypairAccount.isSecret(this.toString())) {
    throw Error(`No match KeyPair.Secret: ${this.toString()}`);
  }
  const decoded = bs.decode(this.toString());
  return Keypair4.fromSecretKey(decoded);
};
Number.prototype.toSol = function() {
  return BigNumber(this).div(LAMPORTS_PER_SOL).toNumber();
};
Number.prototype.toLamports = function() {
  return BigNumber(this).times(LAMPORTS_PER_SOL).toNumber();
};

// ../account/src/associated-account.ts
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID as TOKEN_PROGRAM_ID2,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError
} from "@solana/spl-token";

// ../account/src/keypair-account.ts
import { Keypair as Keypair5, PublicKey as PublicKey4 } from "@solana/web3.js";
import bs2 from "bs58";
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
    return new PublicKey4(this.pubkey);
  }
  toKeypair() {
    const decoded = bs2.decode(this.secret);
    return Keypair5.fromSecretKey(decoded);
  }
  static isPubkey = (value) => /^[0-9a-zA-Z]{32,44}$/.test(value);
  static isSecret = (value) => /^[0-9a-zA-Z]{87,88}$/.test(value);
  static create = () => {
    const keypair = Keypair5.generate();
    return new _KeypairAccount({
      pubkey: keypair.publicKey.toString(),
      secret: bs2.encode(keypair.secretKey)
    });
  };
  static toKeyPair = (keypair) => {
    return new _KeypairAccount({
      pubkey: keypair.publicKey.toString(),
      secret: bs2.encode(keypair.secretKey)
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
      TOKEN_PROGRAM_ID2,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    debugLog("# associatedTokenAccount: ", associatedTokenAccount.toString());
    try {
      await getAccount(
        Node.getConnection(),
        associatedTokenAccount,
        Node.getConnection().commitment,
        TOKEN_PROGRAM_ID2
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
        TOKEN_PROGRAM_ID2,
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
import { PublicKey as PublicKey5 } from "@solana/web3.js";
import { PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
var Pda;
((Pda2) => {
  Pda2.getMetadata = (mint) => {
    const [publicKey] = PublicKey5.findProgramAddressSync(
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
    const [publicKey] = PublicKey5.findProgramAddressSync(
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

// ../converter/src/collection.ts
var Converter;
((Converter13) => {
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
  })(Collection = Converter13.Collection || (Converter13.Collection = {}));
})(Converter || (Converter = {}));

// ../converter/src/creators.ts
var Converter2;
((Converter13) => {
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
  })(Creators = Converter13.Creators || (Converter13.Creators = {}));
})(Converter2 || (Converter2 = {}));

// ../converter/src/memo.ts
var Converter3;
((Converter13) => {
  let Memo;
  ((Memo2) => {
    Memo2.intoUserSide = (output, meta, outputTransfer, mappingTokenAccount) => {
      const history = {};
      if (outputTransfer && outputTransfer.program !== "") {
        if (mappingTokenAccount && outputTransfer.program === "spl-token") {
          const foundSource = mappingTokenAccount.find(
            (m) => m.account === outputTransfer.parsed.info.source
          );
          const foundDest = mappingTokenAccount.find(
            (m) => m.account === outputTransfer.parsed.info.destination
          );
          history.mint = outputTransfer.parsed.info.mint;
          foundSource && (history.source = foundSource.owner);
          foundDest && (history.destination = foundDest.owner);
        } else {
          history.source = outputTransfer.parsed.info.source;
          history.destination = outputTransfer.parsed.info.destination;
        }
      }
      history.memo = output.parsed;
      history.type = output.program;
      history.dateTime = convertTimestampToDateTime(meta.blockTime);
      history.sig = meta.transaction.signatures[0];
      history.innerInstruction = false;
      if (meta.meta?.innerInstructions && meta.meta?.innerInstructions.length !== 0) {
        history.innerInstruction = true;
      }
      return history;
    };
  })(Memo = Converter13.Memo || (Converter13.Memo = {}));
})(Converter3 || (Converter3 = {}));

// ../converter/src/mint.ts
var Converter4;
((Converter13) => {
  let Mint;
  ((Mint2) => {
    Mint2.intoUserSide = (output, meta) => {
      const history = {};
      history.mint = output.parsed.info.mint;
      history.mintAuthority = output.parsed.info.mintAuthority;
      history.tokenAmount = output.parsed.info.tokenAmount;
      history.account = output.parsed.info.account;
      history.type = output.program;
      history.dateTime = convertTimestampToDateTime(meta.blockTime);
      history.sig = meta.transaction.signatures[0];
      history.innerInstruction = false;
      if (meta.meta?.innerInstructions && meta.meta?.innerInstructions.length !== 0) {
        history.innerInstruction = true;
      }
      return history;
    };
  })(Mint = Converter13.Mint || (Converter13.Mint = {}));
})(Converter4 || (Converter4 = {}));

// ../converter/src/uses.ts
var Converter5;
((Converter13) => {
  let Uses;
  ((Uses2) => {
    Uses2.intoUserSide = (output) => {
      if (!output) {
        return void 0;
      }
      return output;
    };
  })(Uses = Converter13.Uses || (Converter13.Uses = {}));
})(Converter5 || (Converter5 = {}));

// ../converter/src/token-metadata.ts
var Converter6;
((Converter13) => {
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
        uses: Converter5.Uses.intoUserSide(output.onchain.uses),
        dateTime: convertTimestampToDateTime(output.offchain.created_at),
        offchain: output.offchain
      };
    };
    TokenMetadata2.deleteNullStrings = (str) => {
      return str.replace(/\0/g, "");
    };
  })(TokenMetadata = Converter13.TokenMetadata || (Converter13.TokenMetadata = {}));
})(Converter6 || (Converter6 = {}));

// ../converter/src/nft-metadata.ts
var Converter7;
((Converter13) => {
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
        name: Converter6.TokenMetadata.deleteNullStrings(output.onchain.data.name),
        symbol: Converter6.TokenMetadata.deleteNullStrings(
          output.onchain.data.symbol
        ),
        tokenAmount,
        uri: Converter6.TokenMetadata.deleteNullStrings(output.onchain.data.uri),
        isMutable: output.onchain.isMutable,
        primarySaleHappened: output.onchain.primarySaleHappened,
        creators: Converter2.Creators.intoUserSide(output.onchain.data.creators),
        editionNonce: output.onchain.editionNonce,
        collection: Converter.Collection.intoUserSide(
          output.onchain.collection
        ),
        uses: Converter5.Uses.intoUserSide(output.onchain.uses),
        dateTime: convertTimestampToDateTime(output.offchain.created_at),
        offchain: output.offchain
      };
    };
  })(NftMetadata = Converter13.NftMetadata || (Converter13.NftMetadata = {}));
})(Converter7 || (Converter7 = {}));

// ../converter/src/properties.ts
var Converter8;
((Converter13) => {
  let Properties;
  ((Properties2) => {
    Properties2.intoInfraSide = async (input, callbackFunc, storageType, feePayer) => {
      if (!input || !input.files) {
        return {};
      }
      const files = await Promise.all(
        input.files.map(async (file) => {
          if (!file.filePath) {
            return {};
          }
          const res = await callbackFunc(file.filePath, storageType, feePayer);
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
  })(Properties = Converter13.Properties || (Converter13.Properties = {}));
})(Converter8 || (Converter8 = {}));

// ../converter/src/royalty.ts
var Converter9;
((Converter13) => {
  let Royalty;
  ((Royalty2) => {
    Royalty2.THRESHOLD = 100;
    Royalty2.intoInfraSide = (percentage) => {
      return percentage * Royalty2.THRESHOLD;
    };
  })(Royalty = Converter13.Royalty || (Converter13.Royalty = {}));
})(Converter9 || (Converter9 = {}));

// ../converter/src/transfer-checked.ts
var Converter10;
((Converter13) => {
  let TransferChecked;
  ((TransferChecked2) => {
    TransferChecked2.intoUserSide = (output, meta, mappingTokenAccount) => {
      const history = {};
      if (mappingTokenAccount) {
        const foundSource = mappingTokenAccount.find(
          (m) => m.account === output.parsed.info.source
        );
        const foundDest = mappingTokenAccount.find(
          (m) => m.account === output.parsed.info.destination
        );
        foundSource && (history.source = foundSource.owner);
        foundDest && (history.destination = foundDest.owner);
      }
      history.tokenAmount = output.parsed.info.tokenAmount;
      history.mint = output.parsed.info.mint;
      history.multisigAuthority = output.parsed.info.multisigAuthority;
      history.signers = output.parsed.info.signers;
      history.type = output.program;
      history.dateTime = convertTimestampToDateTime(meta.blockTime);
      history.sig = meta.transaction.signatures[0];
      history.innerInstruction = false;
      if (meta.meta?.innerInstructions && meta.meta?.innerInstructions.length !== 0) {
        history.innerInstruction = true;
      }
      return history;
    };
  })(TransferChecked = Converter13.TransferChecked || (Converter13.TransferChecked = {}));
})(Converter10 || (Converter10 = {}));

// ../converter/src/transfer.ts
var Converter11;
((Converter13) => {
  let Transfer;
  ((Transfer2) => {
    Transfer2.intoUserSide = (output, meta) => {
      const history = {};
      if (!output.parsed.info.destination || !output.parsed.info.lamports) {
        return;
      }
      history.source = output.parsed.info.source;
      history.destination = output.parsed.info.destination;
      history.sol = output.parsed.info.lamports?.toSol().toString();
      history.type = output.program;
      history.dateTime = convertTimestampToDateTime(meta.blockTime);
      history.sig = meta.transaction.signatures[0];
      history.innerInstruction = false;
      if (meta.meta?.innerInstructions && meta.meta?.innerInstructions.length !== 0) {
        history.innerInstruction = true;
      }
      return history;
    };
  })(Transfer = Converter13.Transfer || (Converter13.Transfer = {}));
})(Converter11 || (Converter11 = {}));

// ../converter/src/index.ts
var Converter12 = {
  ...Converter,
  ...Converter2,
  ...Converter3,
  ...Converter4,
  ...Converter7,
  ...Converter8,
  ...Converter9,
  ...Converter6,
  ...Converter10,
  ...Converter11,
  ...Converter5
};

// ../validator/src/index.ts
var Validator;
((Validator2) => {
  let Message;
  ((Message2) => {
    Message2.SUCCESS = "success";
    Message2.SMALL_NUMBER = "too small";
    Message2.BIG_NUMBER = "too big";
    Message2.LONG_LENGTH = "too long";
    Message2.EMPTY = "invalid empty value";
    Message2.INVALID_URL = "invalid url";
    Message2.ONLY_NODE_JS = "`string` type is only Node.js";
  })(Message = Validator2.Message || (Validator2.Message = {}));
  Validator2.NAME_LENGTH = 32;
  Validator2.SYMBOL_LENGTH = 10;
  Validator2.URL_LENGTH = 200;
  Validator2.ROYALTY_MAX = 100;
  Validator2.SELLER_FEE_BASIS_POINTS_MAX = 1e4;
  Validator2.ROYALTY_MIN = 0;
  Validator2.isRoyalty = (royalty) => {
    return Try(() => {
      const key = "royalty";
      if (royalty !== 0 && !royalty) {
        throw createError(key, Message.EMPTY, royalty);
      }
      if (royalty < Validator2.ROYALTY_MIN) {
        throw createError(key, Message.SMALL_NUMBER, royalty, {
          threshold: Validator2.ROYALTY_MIN,
          condition: "underMin"
        });
      } else if (royalty > Validator2.ROYALTY_MAX) {
        throw createError(key, Message.BIG_NUMBER, royalty, {
          threshold: Validator2.ROYALTY_MAX,
          condition: "overMax"
        });
      }
      return Message.SUCCESS;
    });
  };
  Validator2.isSellerFeeBasisPoints = (royalty) => {
    return Try(() => {
      const key = "sellerFeeBasisPoints/seller_fee_basis_points";
      if (royalty !== 0 && !royalty) {
        throw createError(key, Message.EMPTY, royalty);
      }
      if (royalty < Validator2.ROYALTY_MIN) {
        throw createError(key, Message.SMALL_NUMBER, royalty, {
          threshold: Validator2.ROYALTY_MIN,
          condition: "underMin"
        });
      } else if (royalty > Validator2.ROYALTY_MAX * Converter12.Royalty.THRESHOLD) {
        throw createError(key, Message.BIG_NUMBER, royalty, {
          threshold: Validator2.SELLER_FEE_BASIS_POINTS_MAX,
          condition: "overMax"
        });
      }
      return Message.SUCCESS;
    });
  };
  Validator2.isName = (name) => {
    return Try(() => {
      const key = "name";
      if (!name) {
        throw createError(key, Message.EMPTY, name);
      }
      if (byteLength(name) > Validator2.NAME_LENGTH) {
        throw createError(key, Message.LONG_LENGTH, name, {
          threshold: Validator2.NAME_LENGTH,
          condition: "overMax"
        });
      }
      return Message.SUCCESS;
    });
  };
  Validator2.isSymbol = (symbol) => {
    return Try(() => {
      const key = "symbol";
      if (!symbol) {
        throw createError(key, Message.EMPTY, symbol);
      }
      if (byteLength(symbol) > Validator2.SYMBOL_LENGTH) {
        throw createError(key, Message.LONG_LENGTH, symbol, {
          threshold: Validator2.SYMBOL_LENGTH,
          condition: "overMax"
        });
      }
      return Message.SUCCESS;
    });
  };
  Validator2.isImageUrl = (image) => isUriOrImage(image, "image");
  Validator2.checkAll = (metadata) => {
    return Try(() => {
      const keys = Object.keys(metadata);
      const results = [];
      keys.map((key) => {
        let res;
        switch (key) {
          case "image":
            if (key in metadata && metadata.image) {
              res = (0, Validator2.isImageUrl)(metadata.image);
            }
            break;
          case "royalty":
            if (key in metadata) {
              res = (0, Validator2.isRoyalty)(metadata.royalty);
            }
            break;
          case "seller_fee_basis_points":
            if (key in metadata && metadata.seller_fee_basis_points) {
              res = (0, Validator2.isSellerFeeBasisPoints)(metadata.seller_fee_basis_points);
            }
            break;
          case "sellerFeeBasisPoints":
            if (key in metadata) {
              res = (0, Validator2.isSellerFeeBasisPoints)(metadata.sellerFeeBasisPoints);
            }
            break;
          case "name":
            if (metadata.name) {
              res = (0, Validator2.isName)(metadata.name);
            }
            break;
          case "symbol":
            if (metadata.symbol) {
              res = (0, Validator2.isSymbol)(metadata.symbol);
            }
            break;
        }
        if (res && res.isErr) {
          results.push(...res.error.details);
        }
      });
      if (results.length > 0) {
        const message = "Caught in the validation errors. see information e.g: err<ValidatorError>.details";
        throw new ValidatorError(message, results);
      }
      return Message.SUCCESS;
    });
  };
  const byteLength = (value) => {
    const text = new TextEncoder();
    return text.encode(value).length;
  };
  const createError = (key, message, actual, limit) => {
    let error;
    if (limit) {
      error = new ValidatorError(message, [{ key, message, actual, limit }]);
    } else {
      error = new ValidatorError(message, [{ key, message, actual }]);
    }
    return error;
  };
  const isUriOrImage = (imageOrUri, key) => {
    return Try(() => {
      if (!imageOrUri) {
        throw createError(key, Message.EMPTY, imageOrUri);
      }
      if (byteLength(imageOrUri) > Validator2.URL_LENGTH) {
        throw createError(key, Message.LONG_LENGTH, imageOrUri, {
          threshold: Validator2.URL_LENGTH,
          condition: "overMax"
        });
      }
      if (!/https?:\/\/[-_.!~*\\()a-zA-Z0-9;?:&=+,%#]+/g.test(imageOrUri)) {
        throw createError(key, Message.INVALID_URL, imageOrUri);
      }
      return Message.SUCCESS;
    });
  };
})(Validator || (Validator = {}));
var ValidatorError = class extends Error {
  details;
  constructor(message, details) {
    super(message);
    this.details = details;
  }
};

// ../types/src/transaction-filter/index.ts
var FilterType = /* @__PURE__ */ ((FilterType3) => {
  FilterType3["Memo"] = "memo";
  FilterType3["Mint"] = "mint";
  FilterType3["OnlyMemo"] = "only-memo";
  FilterType3["Transfer"] = "transfer";
  return FilterType3;
})(FilterType || {});
var ModuleName = /* @__PURE__ */ ((ModuleName2) => {
  ModuleName2["SolNative"] = "system";
  ModuleName2["SplToken"] = "spl-token";
  return ModuleName2;
})(ModuleName || {});
var FilterOptions = {
  Transfer: {
    program: ["system", "spl-token"],
    action: ["transfer", "transferChecked"]
  },
  Memo: {
    program: ["spl-memo"],
    action: ["*"]
  },
  Mint: {
    program: ["spl-token"],
    action: ["mintTo", "mintToChecked"]
  }
};

// ../transaction-filter/src/signatures.ts
var Signatures;
((Signatures2) => {
  const parseForTransaction = async (signature) => {
    const res = await Node.getConnection().getParsedTransaction(signature);
    if (!res) {
      return {};
    }
    return res;
  };
  Signatures2.getForAdress = async (pubkey, parser, callback, options, histories = []) => {
    try {
      debugLog("# options: ", options);
      const transactions = await Node.getConnection().getSignaturesForAddress(
        pubkey.toPublicKey(),
        {
          limit: options.narrowDown
        }
      );
      debugLog("# transactions count:", transactions.length);
      for (const transaction of transactions) {
        parseForTransaction(transaction.signature).then((signature) => {
          const history = parser(signature);
          if (history) {
            histories.push(history);
            callback(Result.ok(histories));
          }
        }).catch((e) => callback(Result.err(e)));
        await sleep(options.waitTime);
      }
    } catch (e) {
      if (e instanceof Error) {
        callback(Result.err(e));
      }
    }
  };
})(Signatures || (Signatures = {}));

// ../transaction-filter/src/transaction-filter.ts
var TransactionFilter;
((TransactionFilter2) => {
  const createPostTokenAccountList = (transaction) => {
    const postTokenAccount = [];
    if (Object.keys(transaction).length === 0) {
      return postTokenAccount;
    }
    const accountKeys = transaction.transaction.message.accountKeys.map(
      (t) => t.pubkey.toString()
    );
    transaction.meta?.postTokenBalances?.forEach((t) => {
      if (accountKeys[t.accountIndex] && t.owner) {
        const v = {
          account: accountKeys[t.accountIndex],
          owner: t.owner
        };
        postTokenAccount.push(v);
      }
    });
    return postTokenAccount;
  };
  TransactionFilter2.isParsedInstruction = (arg) => {
    return arg !== null && typeof arg === "object" && "parsed" in arg;
  };
  TransactionFilter2.parse = (filterType, moduleName) => (txMeta) => {
    let history;
    if (filterType === "mint" /* Mint */ && moduleName === "system" /* SolNative */) {
      throw Error(
        "This filterType('FilterType.Mint') can not use from SolNative module"
      );
    }
    if (!txMeta || !txMeta.transaction) {
      return history;
    }
    const postTokenAccount = createPostTokenAccountList(txMeta);
    txMeta.transaction.message.instructions.forEach((instruction) => {
      if ((0, TransactionFilter2.isParsedInstruction)(instruction)) {
        switch (filterType) {
          case "memo" /* Memo */: {
            if (FilterOptions.Memo.program.includes(instruction.program)) {
              let instructionTransfer;
              txMeta.transaction.message.instructions.forEach(
                (instruction2) => {
                  if ((0, TransactionFilter2.isParsedInstruction)(instruction2) && FilterOptions.Transfer.program.includes(
                    instruction2.program
                  )) {
                    instructionTransfer = instruction2;
                  }
                }
              );
              if (instructionTransfer && moduleName !== instructionTransfer["program"]) {
                debugLog(
                  "# FilterType.Memo break instruction: ",
                  instructionTransfer
                );
                break;
              }
              history = Converter12.Memo.intoUserSide(
                instruction,
                txMeta,
                instructionTransfer,
                postTokenAccount
              );
            }
            break;
          }
          case "only-memo" /* OnlyMemo */: {
            if (FilterOptions.Memo.program.includes(instruction.program)) {
              let instructionTransfer;
              history = Converter12.Memo.intoUserSide(
                instruction,
                txMeta,
                instructionTransfer,
                postTokenAccount
              );
            }
            break;
          }
          case "mint" /* Mint */: {
            if (FilterOptions.Mint.program.includes(instruction.program) && FilterOptions.Mint.action.includes(
              instruction.parsed.type
            )) {
              history = Converter12.Mint.intoUserSide(instruction, txMeta);
            }
            break;
          }
          case "transfer" /* Transfer */:
            if (moduleName === instruction.program && FilterOptions.Transfer.action.includes(
              instruction.parsed.type
            )) {
              if (instruction.parsed.type === "transferChecked") {
                history = Converter12.TransferChecked.intoUserSide(
                  instruction,
                  txMeta,
                  postTokenAccount
                );
              } else {
                history = Converter12.Transfer.intoUserSide(
                  instruction,
                  txMeta
                );
              }
            }
        }
      }
    });
    return history;
  };
})(TransactionFilter || (TransactionFilter = {}));

// src/find.ts
var SolNative;
((SolNative7) => {
  SolNative7.findByOwner = async (owner) => {
    return Try(async () => {
      const res = await Node.getConnection().getParsedAccountInfo(
        owner.toPublicKey()
      );
      const info = {
        sol: 0,
        lamports: 0,
        owner: owner.toString()
      };
      if (TransactionFilter.isParsedInstruction(res.value?.data)) {
        const parsedAccountData = res.value?.data;
        info.owner = parsedAccountData.parsed?.info?.owner;
      }
      if (res.value) {
        info.lamports = res.value?.lamports;
        info.sol = res.value?.lamports.toSol();
      }
      return info;
    });
  };
})(SolNative || (SolNative = {}));

// src/fee-payer-partial-sign-transfer.ts
import { SystemProgram as SystemProgram2, Transaction as Transaction5 } from "@solana/web3.js";
var SolNative2;
((SolNative7) => {
  const RADIX = 10;
  SolNative7.feePayerPartialSignTransfer = async (owner, dest, signers, amount, feePayer) => {
    return Try(async () => {
      const blockHashObj = await Node.getConnection().getLatestBlockhash();
      const tx = new Transaction5({
        blockhash: blockHashObj.blockhash,
        lastValidBlockHeight: blockHashObj.lastValidBlockHeight,
        feePayer: feePayer.toPublicKey()
      }).add(
        SystemProgram2.transfer({
          fromPubkey: owner.toPublicKey(),
          toPubkey: dest.toPublicKey(),
          lamports: parseInt(`${amount.toLamports()}`, RADIX)
        })
      );
      signers.forEach((signer) => {
        tx.partialSign(signer.toKeypair());
      });
      const serializedTx = tx.serialize({
        requireAllSignatures: false
      });
      const hex = serializedTx.toString("hex");
      return new PartialSignInstruction(hex);
    });
  };
})(SolNative2 || (SolNative2 = {}));

// src/history.ts
var SolNative3;
((SolNative7) => {
  SolNative7.getHistory = async (target, filterType, onOk, onErr, options = {}) => {
    try {
      const defaultValues = {
        waitTime: 0.03,
        narrowDown: 100
      };
      const mergedOptions = { ...defaultValues, ...options };
      const parser = TransactionFilter.parse(filterType, "system" /* SolNative */);
      await Signatures.getForAdress(
        target,
        parser,
        async (result) => await result.match(onOk, onErr),
        mergedOptions
      );
    } catch (e) {
      if (e instanceof Error) {
        onErr(e);
      }
    }
  };
})(SolNative3 || (SolNative3 = {}));

// src/transfer.ts
import { SystemProgram as SystemProgram3 } from "@solana/web3.js";
var SolNative4;
((SolNative7) => {
  const RADIX = 10;
  SolNative7.transfer = (source, dest, signers, amount, feePayer) => {
    return Try(() => {
      const inst = SystemProgram3.transfer({
        fromPubkey: source.toPublicKey(),
        toPubkey: dest.toPublicKey(),
        lamports: parseInt(`${amount.toLamports()}`, RADIX)
      });
      const payer = feePayer ? feePayer.toKeypair() : signers[0].toKeypair();
      return new Instruction2(
        [inst],
        signers.map((s) => s.toKeypair()),
        payer
      );
    });
  };
})(SolNative4 || (SolNative4 = {}));

// src/transfer-with-multisig.ts
import {
  createCloseAccountInstruction,
  createMint,
  createTransferInstruction,
  createWrappedNativeAccount
} from "@solana/spl-token";
var SolNative5;
((SolNative7) => {
  const RADIX = 10;
  SolNative7.transferWithMultisig = async (owner, dest, signers, amount, feePayer) => {
    return Try(async () => {
      const connection = Node.getConnection();
      const payer = feePayer ? feePayer : signers[0];
      const keypairs = signers.map((s) => s.toKeypair());
      const wrapped = await createWrappedNativeAccount(
        connection,
        payer.toKeypair(),
        owner.toPublicKey(),
        parseInt(`${amount.toLamports()}`, RADIX)
      );
      debugLog("# wrapped sol: ", wrapped.toBase58());
      const token = await createMint(
        connection,
        payer.toKeypair(),
        owner.toPublicKey(),
        owner.toPublicKey(),
        0
      );
      const sourceToken = await AssociatedAccount.retryGetOrCreate(
        token.toString(),
        owner,
        payer
      );
      debugLog("# sourceToken: ", sourceToken);
      const destToken = await AssociatedAccount.retryGetOrCreate(
        token.toString(),
        wrapped.toString(),
        payer
      );
      debugLog("# destToken: ", destToken);
      const inst1 = createTransferInstruction(
        sourceToken.toPublicKey(),
        destToken.toPublicKey(),
        owner.toPublicKey(),
        parseInt(`${amount}`, RADIX),
        // No lamports, its sol
        keypairs
      );
      const inst2 = createCloseAccountInstruction(
        wrapped,
        dest.toPublicKey(),
        owner.toPublicKey(),
        keypairs
      );
      return new Instruction2(
        [inst1, inst2],
        signers.map((s) => s.toKeypair()),
        feePayer?.toKeypair()
      );
    });
  };
})(SolNative5 || (SolNative5 = {}));

// src/index.ts
var SolNative6 = {
  ...SolNative,
  ...SolNative2,
  ...SolNative3,
  ...SolNative4,
  ...SolNative5
};
export {
  AssociatedAccount,
  FilterOptions,
  FilterType,
  KeypairAccount,
  ModuleName,
  Node,
  Pda,
  SolNative6 as SolNative,
  Validator,
  ValidatorError
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc2hhcmVkL3NyYy9jb25zdGFudHMudHMiLCAiLi4vLi4vc2hhcmVkL3NyYy9yZXN1bHQudHMiLCAiLi4vLi4vc2hhcmVkL3NyYy9zaGFyZWQudHMiLCAiLi4vLi4vbm9kZS9zcmMvaW5kZXgudHMiLCAiLi4vLi4vaW5zdHJ1Y3Rpb24vc3JjL2luc3RydWN0aW9uL2luZGV4LnRzIiwgIi4uLy4uL2luc3RydWN0aW9uL3NyYy9pbnN0cnVjdGlvbi9kZWZpbmUudHMiLCAiLi4vLi4vaW5zdHJ1Y3Rpb24vc3JjL2luc3RydWN0aW9uL2JhdGNoLXN1Ym1pdC50cyIsICIuLi8uLi9pbnN0cnVjdGlvbi9zcmMvbWludC1pbnN0cnVjdGlvbi50cyIsICIuLi8uLi9pbnN0cnVjdGlvbi9zcmMvbXVsdGlzaWctaW5zdHJ1Y3Rpb24udHMiLCAiLi4vLi4vaW5zdHJ1Y3Rpb24vc3JjL3BhcnRpYWwtc2lnbkluc3RydWN0aW9uLnRzIiwgIi4uLy4uL2dsb2JhbC9zcmMvaW5kZXgudHMiLCAiLi4vLi4vYWNjb3VudC9zcmMvYXNzb2NpYXRlZC1hY2NvdW50LnRzIiwgIi4uLy4uL2FjY291bnQvc3JjL2tleXBhaXItYWNjb3VudC50cyIsICIuLi8uLi9hY2NvdW50L3NyYy9wZGEudHMiLCAiLi4vLi4vY29udmVydGVyL3NyYy9jb2xsZWN0aW9uLnRzIiwgIi4uLy4uL2NvbnZlcnRlci9zcmMvY3JlYXRvcnMudHMiLCAiLi4vLi4vY29udmVydGVyL3NyYy9tZW1vLnRzIiwgIi4uLy4uL2NvbnZlcnRlci9zcmMvbWludC50cyIsICIuLi8uLi9jb252ZXJ0ZXIvc3JjL3VzZXMudHMiLCAiLi4vLi4vY29udmVydGVyL3NyYy90b2tlbi1tZXRhZGF0YS50cyIsICIuLi8uLi9jb252ZXJ0ZXIvc3JjL25mdC1tZXRhZGF0YS50cyIsICIuLi8uLi9jb252ZXJ0ZXIvc3JjL3Byb3BlcnRpZXMudHMiLCAiLi4vLi4vY29udmVydGVyL3NyYy9yb3lhbHR5LnRzIiwgIi4uLy4uL2NvbnZlcnRlci9zcmMvdHJhbnNmZXItY2hlY2tlZC50cyIsICIuLi8uLi9jb252ZXJ0ZXIvc3JjL3RyYW5zZmVyLnRzIiwgIi4uLy4uL2NvbnZlcnRlci9zcmMvaW5kZXgudHMiLCAiLi4vLi4vdmFsaWRhdG9yL3NyYy9pbmRleC50cyIsICIuLi8uLi90eXBlcy9zcmMvdHJhbnNhY3Rpb24tZmlsdGVyL2luZGV4LnRzIiwgIi4uLy4uL3RyYW5zYWN0aW9uLWZpbHRlci9zcmMvc2lnbmF0dXJlcy50cyIsICIuLi8uLi90cmFuc2FjdGlvbi1maWx0ZXIvc3JjL3RyYW5zYWN0aW9uLWZpbHRlci50cyIsICIuLi9zcmMvZmluZC50cyIsICIuLi9zcmMvZmVlLXBheWVyLXBhcnRpYWwtc2lnbi10cmFuc2Zlci50cyIsICIuLi9zcmMvaGlzdG9yeS50cyIsICIuLi9zcmMvdHJhbnNmZXIudHMiLCAiLi4vc3JjL3RyYW5zZmVyLXdpdGgtbXVsdGlzaWcudHMiLCAiLi4vc3JjL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBDb21taXRtZW50LCBQdWJsaWNLZXkgfSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuaW1wb3J0IENvbmZpZyBmcm9tICdAc29sYW5hLXN1aXRlL2NvbmZpZyc7XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ29uc3RhbnRzIHtcbiAgZXhwb3J0IGNvbnN0IGN1cnJlbnRDbHVzdGVyID0gQ29uZmlnLmNsdXN0ZXIudHlwZTtcbiAgZXhwb3J0IGNvbnN0IGN1c3RvbUNsdXN0ZXJVcmwgPSBDb25maWcuY2x1c3Rlci5jdXN0b21DbHVzdGVyVXJsO1xuICBleHBvcnQgY29uc3QgaXNEZWJ1Z2dpbmcgPSBDb25maWcuZGVidWdnaW5nO1xuICBleHBvcnQgY29uc3QgbmZ0U3RvcmFnZUFwaUtleSA9IENvbmZpZy5uZnRzdG9yYWdlLmFwaWtleTtcblxuICBleHBvcnQgZW51bSBDbHVzdGVyIHtcbiAgICBwcmQgPSAnbWFpbm5ldC1iZXRhJyxcbiAgICBwcmRNZXRhcGxleCA9ICdtYWlubmV0LWJldGEtbWV0YXBsZXgnLFxuICAgIGRldiA9ICdkZXZuZXQnLFxuICAgIHRlc3QgPSAndGVzdG5ldCcsXG4gICAgbG9jYWxob3N0ID0gJ2xvY2FsaG9zdC1kZXZuZXQnLFxuICB9XG5cbiAgZXhwb3J0IGVudW0gRW5kUG9pbnRVcmwge1xuICAgIHByZCA9ICdodHRwczovL2FwaS5tYWlubmV0LWJldGEuc29sYW5hLmNvbScsXG4gICAgcHJkTWV0YXBsZXggPSAnaHR0cHM6Ly9hcGkubWV0YXBsZXguc29sYW5hLmNvbScsXG4gICAgZGV2ID0gJ2h0dHBzOi8vYXBpLmRldm5ldC5zb2xhbmEuY29tJyxcbiAgICB0ZXN0ID0gJ2h0dHBzOi8vYXBpLnRlc3RuZXQuc29sYW5hLmNvbScsXG4gICAgbG9jYWxob3N0ID0gJ2h0dHA6Ly9hcGkuZGV2bmV0LnNvbGFuYS5jb20nLFxuICB9XG5cbiAgZXhwb3J0IGNvbnN0IHN3aXRjaENsdXN0ZXIgPSAocGFyYW06IHtcbiAgICBjbHVzdGVyPzogc3RyaW5nO1xuICAgIGN1c3RvbUNsdXN0ZXJVcmw/OiBzdHJpbmdbXTtcbiAgfSk6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgeyBjbHVzdGVyOiBlbnYsIGN1c3RvbUNsdXN0ZXJVcmwgfSA9IHBhcmFtO1xuXG4gICAgLy8gaWYgc2V0dGVkIGN1c3RvbSB1cmwsIG1vc3QgcHJpb3JpdHlcbiAgICBpZiAoY3VzdG9tQ2x1c3RlclVybCAmJiBjdXN0b21DbHVzdGVyVXJsLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gRGF0ZS5ub3coKSAlIGN1c3RvbUNsdXN0ZXJVcmwubGVuZ3RoO1xuICAgICAgcmV0dXJuIGN1c3RvbUNsdXN0ZXJVcmxbaW5kZXhdO1xuICAgIH1cblxuICAgIHN3aXRjaCAoZW52KSB7XG4gICAgICBjYXNlIENvbnN0YW50cy5DbHVzdGVyLnByZDpcbiAgICAgICAgcmV0dXJuIENvbnN0YW50cy5FbmRQb2ludFVybC5wcmQ7XG4gICAgICBjYXNlIENvbnN0YW50cy5DbHVzdGVyLnByZE1ldGFwbGV4OlxuICAgICAgICByZXR1cm4gQ29uc3RhbnRzLkVuZFBvaW50VXJsLnByZE1ldGFwbGV4O1xuICAgICAgY2FzZSBDb25zdGFudHMuQ2x1c3Rlci50ZXN0OlxuICAgICAgICByZXR1cm4gQ29uc3RhbnRzLkVuZFBvaW50VXJsLnRlc3Q7XG4gICAgICBjYXNlIENvbnN0YW50cy5DbHVzdGVyLmRldjpcbiAgICAgICAgcmV0dXJuIENvbnN0YW50cy5FbmRQb2ludFVybC5kZXY7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gQ29uc3RhbnRzLkVuZFBvaW50VXJsLmxvY2FsaG9zdDtcbiAgICB9XG4gIH07XG5cbiAgZXhwb3J0IGNvbnN0IHN3aXRjaEJ1bmRsciA9IChlbnY6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gICAgc3dpdGNoIChlbnYpIHtcbiAgICAgIGNhc2UgQ29uc3RhbnRzLkNsdXN0ZXIuZGV2OlxuICAgICAgY2FzZSBDb25zdGFudHMuQ2x1c3Rlci50ZXN0OlxuICAgICAgY2FzZSBDb25zdGFudHMuQ2x1c3Rlci5sb2NhbGhvc3Q6XG4gICAgICAgIHJldHVybiAnaHR0cHM6Ly9kZXZuZXQuaXJ5cy54eXonO1xuICAgICAgZGVmYXVsdDoge1xuICAgICAgICBjb25zdCBpbmRleCA9IERhdGUubm93KCkgJSAyO1xuICAgICAgICBjb25zdCBjbHVzdGVycyA9IFsnaHR0cHM6Ly9ub2RlMS5pcnlzLnh5eicsICdodHRwczovL25vZGUyLmlyeXMueHl6J107XG4gICAgICAgIHJldHVybiBjbHVzdGVyc1tpbmRleF07XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGV4cG9ydCBjb25zdCBXUkFQUEVEX1RPS0VOX1BST0dSQU1fSUQgPSBuZXcgUHVibGljS2V5KFxuICAgICdTbzExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEyJyxcbiAgKTtcbiAgZXhwb3J0IGNvbnN0IE1FTU9fUFJPR1JBTV9JRCA9IG5ldyBQdWJsaWNLZXkoXG4gICAgJ01lbW8xVWhrSlJmSHl2TE1jVnVjSnd4WGV1RDcyOEVxVkREd1FEeEZNTm8nLFxuICApO1xuICBleHBvcnQgY29uc3QgTUVUQVBMRVhfUFJPR1JBTV9JRCA9IG5ldyBQdWJsaWNLZXkoXG4gICAgJ21ldGFxYnh4VWVyZHEyOGNqMVJiQVdrWVFtM3liempiNmE4YnQ1MTh4MXMnLFxuICApO1xuICBleHBvcnQgY29uc3QgQ09NTUlUTUVOVDogQ29tbWl0bWVudCA9ICdjb25maXJtZWQnO1xuICBleHBvcnQgY29uc3QgTkZUX1NUT1JBR0VfQVBJX0tFWSA9XG4gICAgJ2V5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUp6ZFdJaU9pSmthV1E2WlhSb2Nqb3dlRVJHTWpjeU4yVmtPRFpoUkdVMVJUTXlaRFpEWkVKbE9EYzBZelJGTkRsRU9EWTFPV1ptT0VNaUxDSnBjM01pT2lKdVpuUXRjM1J2Y21GblpTSXNJbWxoZENJNk1UWXlNREkyTkRrME16Y3dOaXdpYm1GdFpTSTZJbVJsYlc4aWZRLmQ0SjcwbWlreFJCOGE1dndOdTZTTzVIREE4SmF1ZXVzZUFqN1FfeXRNQ0UnO1xuICBleHBvcnQgY29uc3QgTkZUX1NUT1JBR0VfR0FURVdBWV9VUkwgPSAnaHR0cHM6Ly9pcGZzLmlvL2lwZnMnO1xuICBleHBvcnQgY29uc3QgSVJZU19HQVRFV0FZX1VSTCA9ICdodHRwczovL2dhdGV3YXkuaXJ5cy54eXonO1xuICBleHBvcnQgY29uc3QgQlVORExSX05FVFdPUktfVVJMID0gc3dpdGNoQnVuZGxyKENvbmZpZy5jbHVzdGVyLnR5cGUpO1xufVxuIiwgIi8vIGZvcmtlZDogaHR0cHM6Ly9naXRodWIuY29tL2JhZHJhcC9yZXN1bHQsIHRoYW5rIHlvdSBhZHZpY2UgIEBqdmlpZGVcbmltcG9ydCB7IFRyYW5zYWN0aW9uU2lnbmF0dXJlIH0gZnJvbSAnQHNvbGFuYS93ZWIzLmpzJztcblxuYWJzdHJhY3QgY2xhc3MgQWJzdHJhY3RSZXN1bHQ8VCwgRSBleHRlbmRzIEVycm9yPiB7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfY2hhaW48WCwgVSBleHRlbmRzIEVycm9yPihcbiAgICBvazogKHZhbHVlOiBUKSA9PiBSZXN1bHQ8WCwgVT4sXG4gICAgZXJyOiAoZXJyb3I6IEUpID0+IFJlc3VsdDxYLCBVPixcbiAgKTogUmVzdWx0PFgsIFU+O1xuXG4gIHVud3JhcCgpOiBUO1xuICB1bndyYXA8VT4ob2s6ICh2YWx1ZTogVCkgPT4gVSk6IFU7XG4gIHVud3JhcDxVLCBWPihvazogKHZhbHVlOiBUKSA9PiBVLCBlcnI6IChlcnJvcjogRSkgPT4gVik6IFUgfCBWO1xuICAvLyB1bmlmaWVkLXNpZ25hdHVyZXMuIGludG8gbGluZSAxMFxuICAvLyB1bndyYXA8VT4ob2s6ICh2YWx1ZTogVCkgPT4gVSwgZXJyOiAoZXJyb3I6IEUpID0+IFUpOiBVO1xuICB1bndyYXAob2s/OiAodmFsdWU6IFQpID0+IHVua25vd24sIGVycj86IChlcnJvcjogRSkgPT4gdW5rbm93bik6IHVua25vd24ge1xuICAgIGNvbnN0IHIgPSB0aGlzLl9jaGFpbihcbiAgICAgICh2YWx1ZSkgPT4gUmVzdWx0Lm9rKG9rID8gb2sodmFsdWUpIDogdmFsdWUpLFxuICAgICAgKGVycm9yKSA9PiAoZXJyID8gUmVzdWx0Lm9rKGVycihlcnJvcikpIDogUmVzdWx0LmVycihlcnJvcikpLFxuICAgICk7XG4gICAgaWYgKHIuaXNFcnIpIHtcbiAgICAgIHRocm93IHIuZXJyb3I7XG4gICAgfVxuICAgIHJldHVybiByLnZhbHVlO1xuICB9XG5cbiAgLy8vLyBtYXAgLy8vL1xuICBtYXA8VT4ob2s6ICh2YWx1ZTogVCkgPT4gVSk6IFJlc3VsdDxVLCBFPjtcbiAgbWFwPFUsIEYgZXh0ZW5kcyBFcnJvcj4oXG4gICAgb2s6ICh2YWx1ZTogVCkgPT4gVSxcbiAgICBlcnI6IChlcnJvcjogRSkgPT4gRixcbiAgKTogUmVzdWx0PFUsIEY+O1xuICBtYXAob2s6ICh2YWx1ZTogVCkgPT4gdW5rbm93biwgZXJyPzogKGVycm9yOiBFKSA9PiBFcnJvcik6IFJlc3VsdDx1bmtub3duPiB7XG4gICAgcmV0dXJuIHRoaXMuX2NoYWluKFxuICAgICAgKHZhbHVlKSA9PiBSZXN1bHQub2sob2sodmFsdWUpKSxcbiAgICAgIChlcnJvcikgPT4gUmVzdWx0LmVycihlcnIgPyBlcnIoZXJyb3IpIDogZXJyb3IpLFxuICAgICk7XG4gIH1cblxuICAvLy8vIGNoYWluIC8vLy9cbiAgY2hhaW48WD4ob2s6ICh2YWx1ZTogVCkgPT4gUmVzdWx0PFgsIEU+KTogUmVzdWx0PFgsIEU+O1xuICBjaGFpbjxYPihvazogKHZhbHVlOiBUKSA9PiBSZXN1bHQ8WCwgRT4pOiAvLyB1bmlmaWVkLXNpZ25hdHVyZXMuIGludG8gbGluZSAzN1xuICAvLyBlcnI6IChlcnJvcjogRSkgPT4gUmVzdWx0PFgsIEU+XG4gIFJlc3VsdDxYLCBFPjtcbiAgY2hhaW48WCwgVSBleHRlbmRzIEVycm9yPihcbiAgICBvazogKHZhbHVlOiBUKSA9PiBSZXN1bHQ8WCwgVT4sXG4gICAgZXJyOiAoZXJyb3I6IEUpID0+IFJlc3VsdDxYLCBVPixcbiAgKTogUmVzdWx0PFgsIFU+O1xuICBjaGFpbihcbiAgICBvazogKHZhbHVlOiBUKSA9PiBSZXN1bHQ8dW5rbm93bj4sXG4gICAgZXJyPzogKGVycm9yOiBFKSA9PiBSZXN1bHQ8dW5rbm93bj4sXG4gICk6IFJlc3VsdDx1bmtub3duPiB7XG4gICAgcmV0dXJuIHRoaXMuX2NoYWluKG9rLCBlcnIgfHwgKChlcnJvcikgPT4gUmVzdWx0LmVycihlcnJvcikpKTtcbiAgfVxuXG4gIC8vLy8gbWF0Y2ggLy8vL1xuICBtYXRjaDxVLCBGPihvazogKHZhbHVlOiBUKSA9PiBVLCBlcnI6IChlcnJvcjogRSkgPT4gRik6IHZvaWQgfCBQcm9taXNlPHZvaWQ+O1xuXG4gIG1hdGNoKFxuICAgIG9rOiAodmFsdWU6IFQpID0+IHVua25vd24sXG4gICAgZXJyOiAoZXJyb3I6IEUpID0+IHVua25vd24sXG4gICk6IHZvaWQgfCBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLl9jaGFpbihcbiAgICAgICh2YWx1ZSkgPT4gUmVzdWx0Lm9rKG9rKHZhbHVlKSksXG4gICAgICAoZXJyb3IpID0+IFJlc3VsdC5lcnIoZXJyKGVycm9yKSBhcyBFcnJvciksXG4gICAgKTtcbiAgfVxuXG4gIC8vLyBzdWJtaXQgKGFsaWFzIEluc3RydWN0aW9uLnN1Ym1pdCkgLy8vL1xuICBhc3luYyBzdWJtaXQoKTogUHJvbWlzZTxSZXN1bHQ8VHJhbnNhY3Rpb25TaWduYXR1cmUsIEVycm9yPj4ge1xuICAgIHRyeSB7XG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG4gICAgICBjb25zdCBpbnN0cnVjdGlvbiA9IHRoaXMudW53cmFwKCkgYXMgYW55O1xuICAgICAgaWYgKGluc3RydWN0aW9uLmluc3RydWN0aW9ucyAmJiBpbnN0cnVjdGlvbi5zaWduZXJzKSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBpbnN0cnVjdGlvbi5zdWJtaXQoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBSZXN1bHQuZXJyKEVycm9yKCdPbmx5IEluc3RydWN0aW9uIG9iamVjdCcpKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBSZXN1bHQuZXJyKGVyciBhcyBFcnJvcik7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIEludGVybmFsT2s8VCwgRSBleHRlbmRzIEVycm9yPiBleHRlbmRzIEFic3RyYWN0UmVzdWx0PFQsIEU+IHtcbiAgcmVhZG9ubHkgaXNPayA9IHRydWU7XG4gIHJlYWRvbmx5IGlzRXJyID0gZmFsc2U7XG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHZhbHVlOiBUKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFycyAqL1xuICBwcm90ZWN0ZWQgX2NoYWluPFgsIFUgZXh0ZW5kcyBFcnJvcj4oXG4gICAgb2s6ICh2YWx1ZTogVCkgPT4gUmVzdWx0PFgsIFU+LFxuICAgIF9lcnI6IChlcnJvcjogRSkgPT4gUmVzdWx0PFgsIFU+LFxuICApOiBSZXN1bHQ8WCwgVT4ge1xuICAgIHJldHVybiBvayh0aGlzLnZhbHVlKTtcbiAgfVxufVxuXG5jbGFzcyBJbnRlcm5hbEVycjxULCBFIGV4dGVuZHMgRXJyb3I+IGV4dGVuZHMgQWJzdHJhY3RSZXN1bHQ8VCwgRT4ge1xuICByZWFkb25seSBpc09rID0gZmFsc2U7XG4gIHJlYWRvbmx5IGlzRXJyID0gdHJ1ZTtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgZXJyb3I6IEUpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jaGFpbjxYLCBVIGV4dGVuZHMgRXJyb3I+KFxuICAgIF9vazogKHZhbHVlOiBUKSA9PiBSZXN1bHQ8WCwgVT4sXG4gICAgZXJyOiAoZXJyb3I6IEUpID0+IFJlc3VsdDxYLCBVPixcbiAgKTogUmVzdWx0PFgsIFU+IHtcbiAgICByZXR1cm4gZXJyKHRoaXMuZXJyb3IpO1xuICB9XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgUmVzdWx0IHtcbiAgZXhwb3J0IHR5cGUgT2s8VCwgRSBleHRlbmRzIEVycm9yPiA9IEludGVybmFsT2s8VCwgRT47XG4gIGV4cG9ydCB0eXBlIEVycjxULCBFIGV4dGVuZHMgRXJyb3I+ID0gSW50ZXJuYWxFcnI8VCwgRT47XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIG9rPFQsIEUgZXh0ZW5kcyBFcnJvcj4odmFsdWU6IFQpOiBSZXN1bHQ8VCwgRT4ge1xuICAgIHJldHVybiBuZXcgSW50ZXJuYWxPayh2YWx1ZSk7XG4gIH1cbiAgZXhwb3J0IGZ1bmN0aW9uIGVycjxFIGV4dGVuZHMgRXJyb3IsIFQgPSBuZXZlcj4oZXJyb3I/OiBFKTogUmVzdWx0PFQsIEU+O1xuICBleHBvcnQgZnVuY3Rpb24gZXJyPEUgZXh0ZW5kcyBFcnJvciwgVCA9IG5ldmVyPihlcnJvcjogRSk6IFJlc3VsdDxULCBFPiB7XG4gICAgcmV0dXJuIG5ldyBJbnRlcm5hbEVycihlcnJvciB8fCBFcnJvcigpKTtcbiAgfVxuXG4gIHR5cGUgVSA9IFJlc3VsdDx1bmtub3duPjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGFsbDxcbiAgICBSMCBleHRlbmRzIFUsXG4gICAgUjEgZXh0ZW5kcyBVLFxuICAgIFIyIGV4dGVuZHMgVSxcbiAgICBSMyBleHRlbmRzIFUsXG4gICAgUjQgZXh0ZW5kcyBVLFxuICAgIFI1IGV4dGVuZHMgVSxcbiAgICBSNiBleHRlbmRzIFUsXG4gICAgUjcgZXh0ZW5kcyBVLFxuICAgIFI4IGV4dGVuZHMgVSxcbiAgICBSOSBleHRlbmRzIFUsXG4gICAgUjEwIGV4dGVuZHMgVSxcbiAgICBSMTEgZXh0ZW5kcyBVLFxuICAgIFIxMiBleHRlbmRzIFUsXG4gICAgUjEzIGV4dGVuZHMgVSxcbiAgICBSMTQgZXh0ZW5kcyBVLFxuICAgIFIxNSBleHRlbmRzIFUsXG4gID4oXG4gICAgb2JqOiBbUjAsIFIxLCBSMiwgUjMsIFI0LCBSNSwgUjYsIFI3LCBSOCwgUjksIFIxMCwgUjExLCBSMTIsIFIxMywgUjE0LCBSMTVdLFxuICApOiBSZXN1bHQ8XG4gICAgW1xuICAgICAgT2tUeXBlPFIwPixcbiAgICAgIE9rVHlwZTxSMT4sXG4gICAgICBPa1R5cGU8UjI+LFxuICAgICAgT2tUeXBlPFIzPixcbiAgICAgIE9rVHlwZTxSND4sXG4gICAgICBPa1R5cGU8UjU+LFxuICAgICAgT2tUeXBlPFI2PixcbiAgICAgIE9rVHlwZTxSNz4sXG4gICAgICBPa1R5cGU8Ujg+LFxuICAgICAgT2tUeXBlPFI5PixcbiAgICAgIE9rVHlwZTxSMTA+LFxuICAgICAgT2tUeXBlPFIxMT4sXG4gICAgICBPa1R5cGU8UjEyPixcbiAgICAgIE9rVHlwZTxSMTM+LFxuICAgICAgT2tUeXBlPFIxND4sXG4gICAgICBPa1R5cGU8UjE1PixcbiAgICBdLFxuICAgIEVyclR5cGU8XG4gICAgICB8IFIwXG4gICAgICB8IFIxXG4gICAgICB8IFIyXG4gICAgICB8IFIzXG4gICAgICB8IFI0XG4gICAgICB8IFI1XG4gICAgICB8IFI2XG4gICAgICB8IFI3XG4gICAgICB8IFI4XG4gICAgICB8IFI5XG4gICAgICB8IFIxMFxuICAgICAgfCBSMTFcbiAgICAgIHwgUjEyXG4gICAgICB8IFIxM1xuICAgICAgfCBSMTRcbiAgICAgIHwgUjE1XG4gICAgPlxuICA+O1xuICBleHBvcnQgZnVuY3Rpb24gYWxsPFxuICAgIFIwIGV4dGVuZHMgVSxcbiAgICBSMSBleHRlbmRzIFUsXG4gICAgUjIgZXh0ZW5kcyBVLFxuICAgIFIzIGV4dGVuZHMgVSxcbiAgICBSNCBleHRlbmRzIFUsXG4gICAgUjUgZXh0ZW5kcyBVLFxuICAgIFI2IGV4dGVuZHMgVSxcbiAgICBSNyBleHRlbmRzIFUsXG4gICAgUjggZXh0ZW5kcyBVLFxuICAgIFI5IGV4dGVuZHMgVSxcbiAgICBSMTAgZXh0ZW5kcyBVLFxuICAgIFIxMSBleHRlbmRzIFUsXG4gICAgUjEyIGV4dGVuZHMgVSxcbiAgICBSMTMgZXh0ZW5kcyBVLFxuICAgIFIxNCBleHRlbmRzIFUsXG4gID4oXG4gICAgb2JqOiBbUjAsIFIxLCBSMiwgUjMsIFI0LCBSNSwgUjYsIFI3LCBSOCwgUjksIFIxMCwgUjExLCBSMTIsIFIxMywgUjE0XSxcbiAgKTogUmVzdWx0PFxuICAgIFtcbiAgICAgIE9rVHlwZTxSMD4sXG4gICAgICBPa1R5cGU8UjE+LFxuICAgICAgT2tUeXBlPFIyPixcbiAgICAgIE9rVHlwZTxSMz4sXG4gICAgICBPa1R5cGU8UjQ+LFxuICAgICAgT2tUeXBlPFI1PixcbiAgICAgIE9rVHlwZTxSNj4sXG4gICAgICBPa1R5cGU8Ujc+LFxuICAgICAgT2tUeXBlPFI4PixcbiAgICAgIE9rVHlwZTxSOT4sXG4gICAgICBPa1R5cGU8UjEwPixcbiAgICAgIE9rVHlwZTxSMTE+LFxuICAgICAgT2tUeXBlPFIxMj4sXG4gICAgICBPa1R5cGU8UjEzPixcbiAgICAgIE9rVHlwZTxSMTQ+LFxuICAgIF0sXG4gICAgRXJyVHlwZTxcbiAgICAgIHwgUjBcbiAgICAgIHwgUjFcbiAgICAgIHwgUjJcbiAgICAgIHwgUjNcbiAgICAgIHwgUjRcbiAgICAgIHwgUjVcbiAgICAgIHwgUjZcbiAgICAgIHwgUjdcbiAgICAgIHwgUjhcbiAgICAgIHwgUjlcbiAgICAgIHwgUjEwXG4gICAgICB8IFIxMVxuICAgICAgfCBSMTJcbiAgICAgIHwgUjEzXG4gICAgICB8IFIxNFxuICAgID5cbiAgPjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGFsbDxcbiAgICBSMCBleHRlbmRzIFUsXG4gICAgUjEgZXh0ZW5kcyBVLFxuICAgIFIyIGV4dGVuZHMgVSxcbiAgICBSMyBleHRlbmRzIFUsXG4gICAgUjQgZXh0ZW5kcyBVLFxuICAgIFI1IGV4dGVuZHMgVSxcbiAgICBSNiBleHRlbmRzIFUsXG4gICAgUjcgZXh0ZW5kcyBVLFxuICAgIFI4IGV4dGVuZHMgVSxcbiAgICBSOSBleHRlbmRzIFUsXG4gICAgUjEwIGV4dGVuZHMgVSxcbiAgICBSMTEgZXh0ZW5kcyBVLFxuICAgIFIxMiBleHRlbmRzIFUsXG4gICAgUjEzIGV4dGVuZHMgVSxcbiAgPihcbiAgICBvYmo6IFtSMCwgUjEsIFIyLCBSMywgUjQsIFI1LCBSNiwgUjcsIFI4LCBSOSwgUjEwLCBSMTEsIFIxMiwgUjEzXSxcbiAgKTogUmVzdWx0PFxuICAgIFtcbiAgICAgIE9rVHlwZTxSMD4sXG4gICAgICBPa1R5cGU8UjE+LFxuICAgICAgT2tUeXBlPFIyPixcbiAgICAgIE9rVHlwZTxSMz4sXG4gICAgICBPa1R5cGU8UjQ+LFxuICAgICAgT2tUeXBlPFI1PixcbiAgICAgIE9rVHlwZTxSNj4sXG4gICAgICBPa1R5cGU8Ujc+LFxuICAgICAgT2tUeXBlPFI4PixcbiAgICAgIE9rVHlwZTxSOT4sXG4gICAgICBPa1R5cGU8UjEwPixcbiAgICAgIE9rVHlwZTxSMTE+LFxuICAgICAgT2tUeXBlPFIxMj4sXG4gICAgICBPa1R5cGU8UjEzPixcbiAgICBdLFxuICAgIEVyclR5cGU8XG4gICAgICBSMCB8IFIxIHwgUjIgfCBSMyB8IFI0IHwgUjUgfCBSNiB8IFI3IHwgUjggfCBSOSB8IFIxMCB8IFIxMSB8IFIxMiB8IFIxM1xuICAgID5cbiAgPjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGFsbDxcbiAgICBSMCBleHRlbmRzIFUsXG4gICAgUjEgZXh0ZW5kcyBVLFxuICAgIFIyIGV4dGVuZHMgVSxcbiAgICBSMyBleHRlbmRzIFUsXG4gICAgUjQgZXh0ZW5kcyBVLFxuICAgIFI1IGV4dGVuZHMgVSxcbiAgICBSNiBleHRlbmRzIFUsXG4gICAgUjcgZXh0ZW5kcyBVLFxuICAgIFI4IGV4dGVuZHMgVSxcbiAgICBSOSBleHRlbmRzIFUsXG4gICAgUjEwIGV4dGVuZHMgVSxcbiAgICBSMTEgZXh0ZW5kcyBVLFxuICAgIFIxMiBleHRlbmRzIFUsXG4gID4oXG4gICAgb2JqOiBbUjAsIFIxLCBSMiwgUjMsIFI0LCBSNSwgUjYsIFI3LCBSOCwgUjksIFIxMCwgUjExLCBSMTJdLFxuICApOiBSZXN1bHQ8XG4gICAgW1xuICAgICAgT2tUeXBlPFIwPixcbiAgICAgIE9rVHlwZTxSMT4sXG4gICAgICBPa1R5cGU8UjI+LFxuICAgICAgT2tUeXBlPFIzPixcbiAgICAgIE9rVHlwZTxSND4sXG4gICAgICBPa1R5cGU8UjU+LFxuICAgICAgT2tUeXBlPFI2PixcbiAgICAgIE9rVHlwZTxSNz4sXG4gICAgICBPa1R5cGU8Ujg+LFxuICAgICAgT2tUeXBlPFI5PixcbiAgICAgIE9rVHlwZTxSMTA+LFxuICAgICAgT2tUeXBlPFIxMT4sXG4gICAgXSxcbiAgICBFcnJUeXBlPFIwIHwgUjEgfCBSMiB8IFIzIHwgUjQgfCBSNSB8IFI2IHwgUjcgfCBSOCB8IFI5IHwgUjEwIHwgUjExPlxuICA+O1xuICBleHBvcnQgZnVuY3Rpb24gYWxsPFxuICAgIFIwIGV4dGVuZHMgVSxcbiAgICBSMSBleHRlbmRzIFUsXG4gICAgUjIgZXh0ZW5kcyBVLFxuICAgIFIzIGV4dGVuZHMgVSxcbiAgICBSNCBleHRlbmRzIFUsXG4gICAgUjUgZXh0ZW5kcyBVLFxuICAgIFI2IGV4dGVuZHMgVSxcbiAgICBSNyBleHRlbmRzIFUsXG4gICAgUjggZXh0ZW5kcyBVLFxuICAgIFI5IGV4dGVuZHMgVSxcbiAgICBSMTAgZXh0ZW5kcyBVLFxuICAgIFIxMSBleHRlbmRzIFUsXG4gID4oXG4gICAgb2JqOiBbUjAsIFIxLCBSMiwgUjMsIFI0LCBSNSwgUjYsIFI3LCBSOCwgUjksIFIxMCwgUjExXSxcbiAgKTogUmVzdWx0PFxuICAgIFtcbiAgICAgIE9rVHlwZTxSMD4sXG4gICAgICBPa1R5cGU8UjE+LFxuICAgICAgT2tUeXBlPFIyPixcbiAgICAgIE9rVHlwZTxSMz4sXG4gICAgICBPa1R5cGU8UjQ+LFxuICAgICAgT2tUeXBlPFI1PixcbiAgICAgIE9rVHlwZTxSNj4sXG4gICAgICBPa1R5cGU8Ujc+LFxuICAgICAgT2tUeXBlPFI4PixcbiAgICAgIE9rVHlwZTxSOT4sXG4gICAgICBPa1R5cGU8UjEwPixcbiAgICAgIE9rVHlwZTxSMTE+LFxuICAgIF0sXG4gICAgRXJyVHlwZTxSMCB8IFIxIHwgUjIgfCBSMyB8IFI0IHwgUjUgfCBSNiB8IFI3IHwgUjggfCBSOSB8IFIxMCB8IFIxMT5cbiAgPjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGFsbDxcbiAgICBSMCBleHRlbmRzIFUsXG4gICAgUjEgZXh0ZW5kcyBVLFxuICAgIFIyIGV4dGVuZHMgVSxcbiAgICBSMyBleHRlbmRzIFUsXG4gICAgUjQgZXh0ZW5kcyBVLFxuICAgIFI1IGV4dGVuZHMgVSxcbiAgICBSNiBleHRlbmRzIFUsXG4gICAgUjcgZXh0ZW5kcyBVLFxuICAgIFI4IGV4dGVuZHMgVSxcbiAgICBSOSBleHRlbmRzIFUsXG4gICAgUjEwIGV4dGVuZHMgVSxcbiAgPihcbiAgICBvYmo6IFtSMCwgUjEsIFIyLCBSMywgUjQsIFI1LCBSNiwgUjcsIFI4LCBSOSwgUjEwXSxcbiAgKTogUmVzdWx0PFxuICAgIFtcbiAgICAgIE9rVHlwZTxSMD4sXG4gICAgICBPa1R5cGU8UjE+LFxuICAgICAgT2tUeXBlPFIyPixcbiAgICAgIE9rVHlwZTxSMz4sXG4gICAgICBPa1R5cGU8UjQ+LFxuICAgICAgT2tUeXBlPFI1PixcbiAgICAgIE9rVHlwZTxSNj4sXG4gICAgICBPa1R5cGU8Ujc+LFxuICAgICAgT2tUeXBlPFI4PixcbiAgICAgIE9rVHlwZTxSOT4sXG4gICAgICBPa1R5cGU8UjEwPixcbiAgICBdLFxuICAgIEVyclR5cGU8UjAgfCBSMSB8IFIyIHwgUjMgfCBSNCB8IFI1IHwgUjYgfCBSNyB8IFI4IHwgUjkgfCBSMTA+XG4gID47XG4gIGV4cG9ydCBmdW5jdGlvbiBhbGw8XG4gICAgUjAgZXh0ZW5kcyBVLFxuICAgIFIxIGV4dGVuZHMgVSxcbiAgICBSMiBleHRlbmRzIFUsXG4gICAgUjMgZXh0ZW5kcyBVLFxuICAgIFI0IGV4dGVuZHMgVSxcbiAgICBSNSBleHRlbmRzIFUsXG4gICAgUjYgZXh0ZW5kcyBVLFxuICAgIFI3IGV4dGVuZHMgVSxcbiAgICBSOCBleHRlbmRzIFUsXG4gICAgUjkgZXh0ZW5kcyBVLFxuICA+KFxuICAgIG9iajogW1IwLCBSMSwgUjIsIFIzLCBSNCwgUjUsIFI2LCBSNywgUjgsIFI5XSxcbiAgKTogUmVzdWx0PFxuICAgIFtcbiAgICAgIE9rVHlwZTxSMD4sXG4gICAgICBPa1R5cGU8UjE+LFxuICAgICAgT2tUeXBlPFIyPixcbiAgICAgIE9rVHlwZTxSMz4sXG4gICAgICBPa1R5cGU8UjQ+LFxuICAgICAgT2tUeXBlPFI1PixcbiAgICAgIE9rVHlwZTxSNj4sXG4gICAgICBPa1R5cGU8Ujc+LFxuICAgICAgT2tUeXBlPFI4PixcbiAgICAgIE9rVHlwZTxSOT4sXG4gICAgXSxcbiAgICBFcnJUeXBlPFIwIHwgUjEgfCBSMiB8IFIzIHwgUjQgfCBSNSB8IFI2IHwgUjcgfCBSOCB8IFI5PlxuICA+O1xuICBleHBvcnQgZnVuY3Rpb24gYWxsPFxuICAgIFIwIGV4dGVuZHMgVSxcbiAgICBSMSBleHRlbmRzIFUsXG4gICAgUjIgZXh0ZW5kcyBVLFxuICAgIFIzIGV4dGVuZHMgVSxcbiAgICBSNCBleHRlbmRzIFUsXG4gICAgUjUgZXh0ZW5kcyBVLFxuICAgIFI2IGV4dGVuZHMgVSxcbiAgICBSNyBleHRlbmRzIFUsXG4gICAgUjggZXh0ZW5kcyBVLFxuICA+KFxuICAgIG9iajogW1IwLCBSMSwgUjIsIFIzLCBSNCwgUjUsIFI2LCBSNywgUjhdLFxuICApOiBSZXN1bHQ8XG4gICAgW1xuICAgICAgT2tUeXBlPFIwPixcbiAgICAgIE9rVHlwZTxSMT4sXG4gICAgICBPa1R5cGU8UjI+LFxuICAgICAgT2tUeXBlPFIzPixcbiAgICAgIE9rVHlwZTxSND4sXG4gICAgICBPa1R5cGU8UjU+LFxuICAgICAgT2tUeXBlPFI2PixcbiAgICAgIE9rVHlwZTxSNz4sXG4gICAgICBPa1R5cGU8Ujg+LFxuICAgIF0sXG4gICAgRXJyVHlwZTxSMCB8IFIxIHwgUjIgfCBSMyB8IFI0IHwgUjUgfCBSNiB8IFI3IHwgUjg+XG4gID47XG4gIGV4cG9ydCBmdW5jdGlvbiBhbGw8XG4gICAgUjAgZXh0ZW5kcyBVLFxuICAgIFIxIGV4dGVuZHMgVSxcbiAgICBSMiBleHRlbmRzIFUsXG4gICAgUjMgZXh0ZW5kcyBVLFxuICAgIFI0IGV4dGVuZHMgVSxcbiAgICBSNSBleHRlbmRzIFUsXG4gICAgUjYgZXh0ZW5kcyBVLFxuICAgIFI3IGV4dGVuZHMgVSxcbiAgPihcbiAgICBvYmo6IFtSMCwgUjEsIFIyLCBSMywgUjQsIFI1LCBSNiwgUjddLFxuICApOiBSZXN1bHQ8XG4gICAgW1xuICAgICAgT2tUeXBlPFIwPixcbiAgICAgIE9rVHlwZTxSMT4sXG4gICAgICBPa1R5cGU8UjI+LFxuICAgICAgT2tUeXBlPFIzPixcbiAgICAgIE9rVHlwZTxSND4sXG4gICAgICBPa1R5cGU8UjU+LFxuICAgICAgT2tUeXBlPFI2PixcbiAgICAgIE9rVHlwZTxSNz4sXG4gICAgXSxcbiAgICBFcnJUeXBlPFIwIHwgUjEgfCBSMiB8IFIzIHwgUjQgfCBSNSB8IFI2IHwgUjc+XG4gID47XG4gIGV4cG9ydCBmdW5jdGlvbiBhbGw8XG4gICAgUjAgZXh0ZW5kcyBVLFxuICAgIFIxIGV4dGVuZHMgVSxcbiAgICBSMiBleHRlbmRzIFUsXG4gICAgUjMgZXh0ZW5kcyBVLFxuICAgIFI0IGV4dGVuZHMgVSxcbiAgICBSNSBleHRlbmRzIFUsXG4gICAgUjYgZXh0ZW5kcyBVLFxuICA+KFxuICAgIG9iajogW1IwLCBSMSwgUjIsIFIzLCBSNCwgUjUsIFI2XSxcbiAgKTogUmVzdWx0PFxuICAgIFtcbiAgICAgIE9rVHlwZTxSMD4sXG4gICAgICBPa1R5cGU8UjE+LFxuICAgICAgT2tUeXBlPFIyPixcbiAgICAgIE9rVHlwZTxSMz4sXG4gICAgICBPa1R5cGU8UjQ+LFxuICAgICAgT2tUeXBlPFI1PixcbiAgICAgIE9rVHlwZTxSNj4sXG4gICAgXSxcbiAgICBFcnJUeXBlPFIwIHwgUjEgfCBSMiB8IFIzIHwgUjQgfCBSNSB8IFI2PlxuICA+O1xuICBleHBvcnQgZnVuY3Rpb24gYWxsPFxuICAgIFIwIGV4dGVuZHMgVSxcbiAgICBSMSBleHRlbmRzIFUsXG4gICAgUjIgZXh0ZW5kcyBVLFxuICAgIFIzIGV4dGVuZHMgVSxcbiAgICBSNCBleHRlbmRzIFUsXG4gICAgUjUgZXh0ZW5kcyBVLFxuICA+KFxuICAgIG9iajogW1IwLCBSMSwgUjIsIFIzLCBSNCwgUjVdLFxuICApOiBSZXN1bHQ8XG4gICAgW09rVHlwZTxSMD4sIE9rVHlwZTxSMT4sIE9rVHlwZTxSMj4sIE9rVHlwZTxSMz4sIE9rVHlwZTxSND4sIE9rVHlwZTxSNT5dLFxuICAgIEVyclR5cGU8UjAgfCBSMSB8IFIyIHwgUjMgfCBSNCB8IFI1PlxuICA+O1xuICBleHBvcnQgZnVuY3Rpb24gYWxsPFxuICAgIFIwIGV4dGVuZHMgVSxcbiAgICBSMSBleHRlbmRzIFUsXG4gICAgUjIgZXh0ZW5kcyBVLFxuICAgIFIzIGV4dGVuZHMgVSxcbiAgICBSNCBleHRlbmRzIFUsXG4gID4oXG4gICAgb2JqOiBbUjAsIFIxLCBSMiwgUjMsIFI0XSxcbiAgKTogUmVzdWx0PFxuICAgIFtPa1R5cGU8UjA+LCBPa1R5cGU8UjE+LCBPa1R5cGU8UjI+LCBPa1R5cGU8UjM+LCBPa1R5cGU8UjQ+XSxcbiAgICBFcnJUeXBlPFIwIHwgUjEgfCBSMiB8IFIzIHwgUjQ+XG4gID47XG4gIGV4cG9ydCBmdW5jdGlvbiBhbGw8UjAgZXh0ZW5kcyBVLCBSMSBleHRlbmRzIFUsIFIyIGV4dGVuZHMgVSwgUjMgZXh0ZW5kcyBVPihcbiAgICBvYmo6IFtSMCwgUjEsIFIyLCBSM10sXG4gICk6IFJlc3VsdDxcbiAgICBbT2tUeXBlPFIwPiwgT2tUeXBlPFIxPiwgT2tUeXBlPFIyPiwgT2tUeXBlPFIzPl0sXG4gICAgRXJyVHlwZTxSMCB8IFIxIHwgUjIgfCBSMz5cbiAgPjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGFsbDxSMCBleHRlbmRzIFUsIFIxIGV4dGVuZHMgVSwgUjIgZXh0ZW5kcyBVPihcbiAgICBvYmo6IFtSMCwgUjEsIFIyXSxcbiAgKTogUmVzdWx0PFtPa1R5cGU8UjA+LCBPa1R5cGU8UjE+LCBPa1R5cGU8UjI+XSwgRXJyVHlwZTxSMCB8IFIxIHwgUjI+PjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGFsbDxSMCBleHRlbmRzIFUsIFIxIGV4dGVuZHMgVT4oXG4gICAgb2JqOiBbUjAsIFIxXSxcbiAgKTogUmVzdWx0PFtPa1R5cGU8UjA+LCBPa1R5cGU8UjE+XSwgRXJyVHlwZTxSMCB8IFIxPj47XG4gIGV4cG9ydCBmdW5jdGlvbiBhbGw8UjAgZXh0ZW5kcyBVPihcbiAgICBvYmo6IFtSMF0sXG4gICk6IFJlc3VsdDxbT2tUeXBlPFIwPl0sIEVyclR5cGU8UjA+PjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGFsbChvYmo6IFtdKTogUmVzdWx0PFtdPjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGFsbDxUIGV4dGVuZHMgVVtdIHwgUmVjb3JkPHN0cmluZywgVT4+KFxuICAgIG9iajogVCxcbiAgKTogUmVzdWx0PFxuICAgIHsgW0sgaW4ga2V5b2YgVF06IFRbS10gZXh0ZW5kcyBSZXN1bHQ8aW5mZXIgST4gPyBJIDogbmV2ZXIgfSxcbiAgICB7XG4gICAgICBbSyBpbiBrZXlvZiBUXTogVFtLXSBleHRlbmRzIFJlc3VsdDx1bmtub3duLCBpbmZlciBFPiA/IEUgOiBuZXZlcjtcbiAgICB9W2tleW9mIFRdXG4gID47XG4gIGV4cG9ydCBmdW5jdGlvbiBhbGwob2JqOiB1bmtub3duKTogdW5rbm93biB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgY29uc3QgcmVzQXJyID0gW107XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygb2JqKSB7XG4gICAgICAgIGlmIChpdGVtLmlzRXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0gYXMgdW5rbm93bjtcbiAgICAgICAgfVxuICAgICAgICByZXNBcnIucHVzaChpdGVtLnZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBSZXN1bHQub2socmVzQXJyKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iaiBhcyBSZWNvcmQ8c3RyaW5nLCBVPik7XG4gICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgY29uc3QgaXRlbSA9IChvYmogYXMgUmVjb3JkPHN0cmluZywgVT4pW2tleV07XG4gICAgICBpZiAoaXRlbS5pc0Vycikge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgIH1cbiAgICAgIHJlc1trZXldID0gaXRlbS52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIFJlc3VsdC5vayhyZXMpO1xuICB9XG59XG5cbmV4cG9ydCB0eXBlIFJlc3VsdDxULCBFIGV4dGVuZHMgRXJyb3IgPSBFcnJvcj4gPVxuICB8IFJlc3VsdC5PazxULCBFPlxuICB8IFJlc3VsdC5FcnI8VCwgRT47XG5cbnR5cGUgT2tUeXBlPFIgZXh0ZW5kcyBSZXN1bHQ8dW5rbm93bj4+ID0gUiBleHRlbmRzIFJlc3VsdDxpbmZlciBPPiA/IE8gOiBuZXZlcjtcbnR5cGUgRXJyVHlwZTxSIGV4dGVuZHMgUmVzdWx0PHVua25vd24+PiA9IFIgZXh0ZW5kcyBSZXN1bHQ8dW5rbm93biwgaW5mZXIgRT5cbiAgPyBFXG4gIDogbmV2ZXI7XG4iLCAiaW1wb3J0IHsgQW55T2JqZWN0IH0gZnJvbSAnfi90eXBlcy9zaGFyZWQnO1xuaW1wb3J0IHsgQ29uc3RhbnRzIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgUmVzdWx0IH0gZnJvbSAnLi9yZXN1bHQnO1xuXG4vKipcbiAqIE92ZXJ3cml0ZSBKUyBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge3Vua25vd259IG9iamVjdFxuICogQHBhcmFtIHtPdmVyd3JpdGVPYmplY3RbXX0gdGFyZ2V0c1xuICogQHJldHVybnMgT2JqZWN0XG4gKi9cbmV4cG9ydCBjb25zdCBvdmVyd3JpdGVPYmplY3QgPSAoXG4gIG9iamVjdDogdW5rbm93bixcbiAgdGFyZ2V0czoge1xuICAgIGV4aXN0c0tleTogc3RyaW5nO1xuICAgIHdpbGw6IHsga2V5OiBzdHJpbmc7IHZhbHVlOiB1bmtub3duIH07XG4gIH1bXSxcbik6IHVua25vd24gPT4ge1xuICBjb25zdCB0aGF0OiBBbnlPYmplY3QgPSBvYmplY3QgYXMgQW55T2JqZWN0O1xuICB0YXJnZXRzLmZvckVhY2goKHRhcmdldCkgPT4ge1xuICAgIGRlbGV0ZSB0aGF0W3RhcmdldC5leGlzdHNLZXldO1xuICAgIHRoYXRbdGFyZ2V0LndpbGwua2V5XSA9IHRhcmdldC53aWxsLnZhbHVlO1xuICB9KTtcbiAgcmV0dXJuIHRoYXQ7XG59O1xuXG4vKipcbiAqIERpc3BsYXkgbG9nIGZvciBzb2xhbmEtc3VpdGUtY29uZmlnLmpzXG4gKlxuICogQHBhcmFtIHt1bmtub3dufSBkYXRhMVxuICogQHBhcmFtIHt1bmtub3dufSBkYXRhMlxuICogQHBhcmFtIHt1bmtub3dufSBkYXRhM1xuICogQHBhcmFtIHt1bmtub3dufSBkYXRhNFxuICogQHJldHVybnMgdm9pZFxuICovXG5leHBvcnQgY29uc3QgZGVidWdMb2cgPSAoXG4gIGRhdGExOiB1bmtub3duLFxuICBkYXRhMjogdW5rbm93biA9ICcnLFxuICBkYXRhMzogdW5rbm93biA9ICcnLFxuICBkYXRhNDogdW5rbm93biA9ICcnLFxuKTogdm9pZCA9PiB7XG4gIGlmIChDb25zdGFudHMuaXNEZWJ1Z2dpbmcgPT09ICd0cnVlJyB8fCBwcm9jZXNzLmVudi5ERUJVRyA9PT0gJ3RydWUnKSB7XG4gICAgY29uc29sZS5sb2coJ1tERUJVR10nLCBkYXRhMSwgZGF0YTIsIGRhdGEzLCBkYXRhNCk7XG4gIH1cbn07XG5cbi8qKlxuICogc2xlZXAgdGltZXJcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gc2VjXG4gKiBAcmV0dXJucyBQcm9taXNlPG51bWJlcj5cbiAqL1xuZXhwb3J0IGNvbnN0IHNsZWVwID0gYXN5bmMgKHNlYzogbnVtYmVyKTogUHJvbWlzZTxudW1iZXI+ID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIHNlYyAqIDEwMDApKTtcbn07XG5cbi8qKlxuICogTm9kZS5qcyBvciBCcm93c2VyIGpzXG4gKlxuICogQHJldHVybnMgYm9vbGVhblxuICovXG5leHBvcnQgY29uc3QgaXNCcm93c2VyID0gKCk6IGJvb2xlYW4gPT4ge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnXG4gICk7XG59O1xuXG4vKipcbiAqIE5vZGUuanMgb3IgQnJvd3NlciBqc1xuICpcbiAqIEByZXR1cm5zIGJvb2xlYW5cbiAqL1xuZXhwb3J0IGNvbnN0IGlzTm9kZSA9ICgpOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICBwcm9jZXNzLnZlcnNpb25zICE9IG51bGwgJiZcbiAgICBwcm9jZXNzLnZlcnNpb25zLm5vZGUgIT0gbnVsbFxuICApO1xufTtcblxuLyoqXG4gKiBhcmd1bWVudCBpcyBwcm9taXNlIG9yIG90aGVyXG4gKlxuICogQHBhcmFtIHt1bmtub3dufSBvYmpcbiAqIEByZXR1cm5zIGJvb2xlYW5cbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG5leHBvcnQgY29uc3QgaXNQcm9taXNlID0gKG9iajogdW5rbm93bik6IG9iaiBpcyBQcm9taXNlPHVua25vd24+ID0+IHtcbiAgcmV0dXJuIChcbiAgICAhIW9iaiAmJlxuICAgICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyB8fCB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nKSAmJlxuICAgIHR5cGVvZiAob2JqIGFzIGFueSkudGhlbiA9PT0gJ2Z1bmN0aW9uJ1xuICApO1xufTtcblxuLyoqXG4gKiBUcnkgYXN5bmMgbW9uYWRcbiAqXG4gKiBAcmV0dXJucyBQcm9taXNlPFJlc3VsdDxULCBFPj5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFRyeTxULCBFIGV4dGVuZHMgRXJyb3I+KFxuICBhc3luY2Jsb2NrOiAoKSA9PiBQcm9taXNlPFQ+LFxuICBmaW5hbGx5SW5wdXQ/OiAoKSA9PiB2b2lkLFxuKTogUHJvbWlzZTxSZXN1bHQ8VCwgRT4+O1xuZXhwb3J0IGZ1bmN0aW9uIFRyeTxULCBFIGV4dGVuZHMgRXJyb3I+KGJsb2NrOiAoKSA9PiBUKTogUmVzdWx0PFQsIEU+O1xuZXhwb3J0IGZ1bmN0aW9uIFRyeTxULCBFIGV4dGVuZHMgRXJyb3I+KFxuICBpbnB1dDogKCkgPT4gUHJvbWlzZTxUPixcbiAgZmluYWxseUlucHV0PzogKCkgPT4gdm9pZCxcbik6IFJlc3VsdDxULCBFcnJvcj4gfCBQcm9taXNlPFJlc3VsdDxULCBFcnJvcj4+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB2ID0gaW5wdXQoKTtcbiAgICBpZiAoaXNQcm9taXNlKHYpKSB7XG4gICAgICByZXR1cm4gdi50aGVuKFxuICAgICAgICAoeDogVCkgPT4gUmVzdWx0Lm9rKHgpLFxuICAgICAgICAoZXJyOiBFKSA9PiBSZXN1bHQuZXJyKGVyciksXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUmVzdWx0Lm9rKHYpO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIHJldHVybiBSZXN1bHQuZXJyKGUpO1xuICAgIH1cbiAgICByZXR1cm4gUmVzdWx0LmVycihFcnJvcihlIGFzIHN0cmluZykpO1xuICB9IGZpbmFsbHkge1xuICAgIGlmIChmaW5hbGx5SW5wdXQpIHtcbiAgICAgIGRlYnVnTG9nKCcjIGZpbmFsbHkgaW5wdXQ6JywgZmluYWxseUlucHV0KTtcbiAgICAgIGZpbmFsbHlJbnB1dCgpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIGFyZ3VtZW50IGlzIHByb21pc2Ugb3Igb3RoZXJcbiAqXG4gKiBAcGFyYW0ge251bWJlcnx1bmRlZmluZWR9IGNyZWF0ZWRfYXRcbiAqIEByZXR1cm5zIERhdGUgfCB1bmRlZmluZWRcbiAqL1xuZXhwb3J0IGNvbnN0IGNvbnZlcnRUaW1lc3RhbXBUb0RhdGVUaW1lID0gKFxuICBjcmVhdGVkX2F0OiBudW1iZXIgfCB1bmRlZmluZWQsXG4pOiBEYXRlIHwgdW5kZWZpbmVkID0+IHtcbiAgaWYgKGNyZWF0ZWRfYXQpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoY3JlYXRlZF9hdCAqIDEwMDApO1xuICB9XG4gIHJldHVybjtcbn07XG4iLCAiaW1wb3J0IHsgQ29uc3RhbnRzLCBSZXN1bHQsIGRlYnVnTG9nIH0gZnJvbSAnfi9zaGFyZWQnO1xuaW1wb3J0IHsgQ29tbWl0bWVudCwgQ29ubmVjdGlvbiB9IGZyb20gJ0Bzb2xhbmEvd2ViMy5qcyc7XG5cbmV4cG9ydCBuYW1lc3BhY2UgTm9kZSB7XG4gIGNvbnN0IHNldHRlZCA9IHtcbiAgICBjbHVzdGVyVXJsOiAnJyxcbiAgICBjb21taXRtZW50OiBDb25zdGFudHMuQ09NTUlUTUVOVCxcbiAgICBjdXN0b21DbHVzdGVyVXJsOiBbXSBhcyBzdHJpbmdbXSxcbiAgfTtcblxuICBleHBvcnQgY29uc3QgZ2V0Q29ubmVjdGlvbiA9ICgpOiBDb25uZWN0aW9uID0+IHtcbiAgICBkZWJ1Z0xvZygnIyBbQmVmb3JlXSBzZXR0ZWQ6Jywgc2V0dGVkKTtcbiAgICBkZWJ1Z0xvZyhcbiAgICAgICcjIFtCZWZvcmVdIENvbnN0YW50cy5jdXN0b21DbHVzdGVyVXJsOicsXG4gICAgICBDb25zdGFudHMuY3VzdG9tQ2x1c3RlclVybCxcbiAgICApO1xuXG4gICAgaWYgKHNldHRlZC5jdXN0b21DbHVzdGVyVXJsLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIGN1c3RvbSBjbHVzdGVyXG4gICAgICBzZXR0ZWQuY2x1c3RlclVybCA9IENvbnN0YW50cy5zd2l0Y2hDbHVzdGVyKHtcbiAgICAgICAgY3VzdG9tQ2x1c3RlclVybDogc2V0dGVkLmN1c3RvbUNsdXN0ZXJVcmwsXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKENvbnN0YW50cy5jdXN0b21DbHVzdGVyVXJsLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIGN1c3RvbSBjbHVzdGVyIGJ5IGpzb24gY29uZmlnXG4gICAgICBzZXR0ZWQuY2x1c3RlclVybCA9IENvbnN0YW50cy5zd2l0Y2hDbHVzdGVyKHtcbiAgICAgICAgY3VzdG9tQ2x1c3RlclVybDogQ29uc3RhbnRzLmN1c3RvbUNsdXN0ZXJVcmwsXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKCFzZXR0ZWQuY2x1c3RlclVybCkge1xuICAgICAgLy8gZGVmYXVsdCBjbHVzdGVyXG4gICAgICBzZXR0ZWQuY2x1c3RlclVybCA9IENvbnN0YW50cy5zd2l0Y2hDbHVzdGVyKHtcbiAgICAgICAgY2x1c3RlcjogQ29uc3RhbnRzLmN1cnJlbnRDbHVzdGVyLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFzZXR0ZWQuY29tbWl0bWVudCkge1xuICAgICAgc2V0dGVkLmNvbW1pdG1lbnQgPSBDb25zdGFudHMuQ09NTUlUTUVOVDtcbiAgICB9XG5cbiAgICBkZWJ1Z0xvZygnIyBbQWZ0ZXJdIHNldHRlZDonLCBzZXR0ZWQpO1xuXG4gICAgcmV0dXJuIG5ldyBDb25uZWN0aW9uKHNldHRlZC5jbHVzdGVyVXJsLCBzZXR0ZWQuY29tbWl0bWVudCk7XG4gIH07XG5cbiAgZXhwb3J0IGNvbnN0IGNoYW5nZUNvbm5lY3Rpb24gPSAocGFyYW06IHtcbiAgICBjbHVzdGVyPzogc3RyaW5nO1xuICAgIGNvbW1pdG1lbnQ/OiBDb21taXRtZW50O1xuICAgIGN1c3RvbUNsdXN0ZXJVcmw/OiBzdHJpbmdbXTtcbiAgfSk6IHZvaWQgPT4ge1xuICAgIC8vIGluaXRpYWxpemVcbiAgICBzZXR0ZWQuY2x1c3RlclVybCA9ICcnO1xuICAgIHNldHRlZC5jdXN0b21DbHVzdGVyVXJsID0gW107XG4gICAgc2V0dGVkLmNvbW1pdG1lbnQgPSBDb25zdGFudHMuQ09NTUlUTUVOVDtcblxuICAgIGNvbnN0IHsgY2x1c3RlciwgY29tbWl0bWVudCwgY3VzdG9tQ2x1c3RlclVybCB9ID0gcGFyYW07XG4gICAgaWYgKGNvbW1pdG1lbnQpIHtcbiAgICAgIHNldHRlZC5jb21taXRtZW50ID0gY29tbWl0bWVudDtcbiAgICAgIGRlYnVnTG9nKCcjIE5vZGUgY2hhbmdlIGNvbW1pdG1lbnQ6ICcsIHNldHRlZC5jb21taXRtZW50KTtcbiAgICB9XG5cbiAgICBpZiAoY2x1c3Rlcikge1xuICAgICAgc2V0dGVkLmNsdXN0ZXJVcmwgPSBDb25zdGFudHMuc3dpdGNoQ2x1c3Rlcih7IGNsdXN0ZXI6IGNsdXN0ZXIgfSk7XG4gICAgICBkZWJ1Z0xvZygnIyBOb2RlIGNoYW5nZSBjbHVzdGVyVXJsOiAnLCBzZXR0ZWQuY2x1c3RlclVybCk7XG4gICAgfVxuXG4gICAgaWYgKGN1c3RvbUNsdXN0ZXJVcmwpIHtcbiAgICAgIGRlYnVnTG9nKCcjIGN1c3RvbUNsdXN0ZXJVcmw6ICcsIGN1c3RvbUNsdXN0ZXJVcmwpO1xuICAgICAgc2V0dGVkLmNsdXN0ZXJVcmwgPSBDb25zdGFudHMuc3dpdGNoQ2x1c3Rlcih7IGN1c3RvbUNsdXN0ZXJVcmwgfSk7XG4gICAgICBzZXR0ZWQuY3VzdG9tQ2x1c3RlclVybCA9IGN1c3RvbUNsdXN0ZXJVcmw7XG4gICAgICBkZWJ1Z0xvZyhcbiAgICAgICAgJyMgTm9kZSBjaGFuZ2UgY2x1c3RlciwgY3VzdG9tIGNsdXN0ZXIgdXJsOiAnLFxuICAgICAgICBzZXR0ZWQuY2x1c3RlclVybCxcbiAgICAgICk7XG4gICAgfVxuICB9O1xuXG4gIGV4cG9ydCBjb25zdCBjb25maXJtZWRTaWcgPSBhc3luYyAoXG4gICAgc2lnbmF0dXJlOiBzdHJpbmcsXG4gICAgY29tbWl0bWVudDogQ29tbWl0bWVudCA9IENvbnN0YW50cy5DT01NSVRNRU5ULFxuICApID0+IHtcbiAgICBjb25zdCBjb25uZWN0aW9uID0gTm9kZS5nZXRDb25uZWN0aW9uKCk7XG4gICAgY29uc3QgbGF0ZXN0QmxvY2toYXNoID0gYXdhaXQgY29ubmVjdGlvbi5nZXRMYXRlc3RCbG9ja2hhc2goKTtcbiAgICByZXR1cm4gYXdhaXQgY29ubmVjdGlvblxuICAgICAgLmNvbmZpcm1UcmFuc2FjdGlvbihcbiAgICAgICAge1xuICAgICAgICAgIGJsb2NraGFzaDogbGF0ZXN0QmxvY2toYXNoLmJsb2NraGFzaCxcbiAgICAgICAgICBsYXN0VmFsaWRCbG9ja0hlaWdodDogbGF0ZXN0QmxvY2toYXNoLmxhc3RWYWxpZEJsb2NrSGVpZ2h0LFxuICAgICAgICAgIHNpZ25hdHVyZSxcbiAgICAgICAgfSxcbiAgICAgICAgY29tbWl0bWVudCxcbiAgICAgIClcbiAgICAgIC50aGVuKFJlc3VsdC5vaylcbiAgICAgIC5jYXRjaChSZXN1bHQuZXJyKTtcbiAgfTtcbn1cbiIsICJpbXBvcnQge1xuICBDb25maXJtT3B0aW9ucyxcbiAgS2V5cGFpcixcbiAgc2VuZEFuZENvbmZpcm1UcmFuc2FjdGlvbixcbiAgVHJhbnNhY3Rpb24sXG4gIFRyYW5zYWN0aW9uSW5zdHJ1Y3Rpb24sXG4gIFRyYW5zYWN0aW9uU2lnbmF0dXJlLFxufSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnfi9ub2RlJztcbmltcG9ydCB7IFJlc3VsdCwgVHJ5IH0gZnJvbSAnfi9zaGFyZWQnO1xuaW1wb3J0IHsgTUFYX1JFVFJJRVMgfSBmcm9tICcuL2RlZmluZSc7XG5pbXBvcnQgeyBJbnN0cnVjdGlvbiBhcyBCYXRjaCB9IGZyb20gJy4vYmF0Y2gtc3VibWl0JztcblxuZXhwb3J0IGNsYXNzIEluc3RydWN0aW9uIHtcbiAgaW5zdHJ1Y3Rpb25zOiBUcmFuc2FjdGlvbkluc3RydWN0aW9uW107XG4gIHNpZ25lcnM6IEtleXBhaXJbXTtcbiAgZmVlUGF5ZXI/OiBLZXlwYWlyO1xuICBkYXRhPzogdW5rbm93bjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBpbnN0cnVjdGlvbnM6IFRyYW5zYWN0aW9uSW5zdHJ1Y3Rpb25bXSxcbiAgICBzaWduZXJzOiBLZXlwYWlyW10sXG4gICAgZmVlUGF5ZXI/OiBLZXlwYWlyLFxuICAgIGRhdGE/OiB1bmtub3duLFxuICApIHtcbiAgICB0aGlzLmluc3RydWN0aW9ucyA9IGluc3RydWN0aW9ucztcbiAgICB0aGlzLnNpZ25lcnMgPSBzaWduZXJzO1xuICAgIHRoaXMuZmVlUGF5ZXIgPSBmZWVQYXllcjtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICB9XG5cbiAgc3VibWl0ID0gYXN5bmMgKCk6IFByb21pc2U8UmVzdWx0PFRyYW5zYWN0aW9uU2lnbmF0dXJlLCBFcnJvcj4+ID0+IHtcbiAgICByZXR1cm4gVHJ5KGFzeW5jICgpID0+IHtcbiAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBJbnN0cnVjdGlvbikpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ29ubHkgSW5zdHJ1Y3Rpb24gb2JqZWN0IHRoYXQgY2FuIHVzZSB0aGlzJyk7XG4gICAgICB9XG4gICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IG5ldyBUcmFuc2FjdGlvbigpO1xuXG4gICAgICBjb25zdCBibG9ja2hhc2hPYmogPSBhd2FpdCBOb2RlLmdldENvbm5lY3Rpb24oKS5nZXRMYXRlc3RCbG9ja2hhc2goKTtcbiAgICAgIHRyYW5zYWN0aW9uLmxhc3RWYWxpZEJsb2NrSGVpZ2h0ID0gYmxvY2toYXNoT2JqLmxhc3RWYWxpZEJsb2NrSGVpZ2h0O1xuICAgICAgdHJhbnNhY3Rpb24ucmVjZW50QmxvY2toYXNoID0gYmxvY2toYXNoT2JqLmJsb2NraGFzaDtcbiAgICAgIGxldCBmaW5hbFNpZ25lcnMgPSB0aGlzLnNpZ25lcnM7XG5cbiAgICAgIGlmICh0aGlzLmZlZVBheWVyKSB7XG4gICAgICAgIHRyYW5zYWN0aW9uLmZlZVBheWVyID0gdGhpcy5mZWVQYXllci5wdWJsaWNLZXk7XG4gICAgICAgIGZpbmFsU2lnbmVycyA9IFt0aGlzLmZlZVBheWVyLCAuLi50aGlzLnNpZ25lcnNdO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmluc3RydWN0aW9ucy5mb3JFYWNoKChpbnN0KSA9PiB0cmFuc2FjdGlvbi5hZGQoaW5zdCkpO1xuXG4gICAgICBjb25zdCBvcHRpb25zOiBDb25maXJtT3B0aW9ucyA9IHtcbiAgICAgICAgbWF4UmV0cmllczogTUFYX1JFVFJJRVMsXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gYXdhaXQgc2VuZEFuZENvbmZpcm1UcmFuc2FjdGlvbihcbiAgICAgICAgTm9kZS5nZXRDb25uZWN0aW9uKCksXG4gICAgICAgIHRyYW5zYWN0aW9uLFxuICAgICAgICBmaW5hbFNpZ25lcnMsXG4gICAgICAgIG9wdGlvbnMsXG4gICAgICApO1xuICAgIH0pO1xuICB9O1xufVxuXG4vKipcbiAqIHNlblRyYW5zYWN0aW9uKCkgVHJhbnNhY3Rpb25JbnN0cnVjdGlvblxuICpcbiAqIEBzZWUge0BsaW5rIHR5cGVzL2dsb2JhbC50c31cbiAqIEByZXR1cm5zIFByb21pc2U8UmVzdWx0PHN0cmluZywgRXJyb3I+PlxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudCAqL1xuLyogQHRzLWlnbm9yZSAqL1xuQXJyYXkucHJvdG90eXBlLnN1Ym1pdCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgaW5zdHJ1Y3Rpb25zOiBJbnN0cnVjdGlvbltdID0gW107XG4gIC8vIGRvbnQgdXNlIGZvckVhY2hcbiAgLy8gSXQgaXMgbm90IHBvc3NpYmxlIHRvIHN0b3AgdGhlIHByb2Nlc3MgYnkgUkVUVVJOIGluIHRoZSBtaWRkbGUgb2YgdGhlIHByb2Nlc3MuXG4gIHJldHVybiBUcnkoYXN5bmMgKCkgPT4ge1xuICAgIGxldCBpID0gMDtcbiAgICBmb3IgKGNvbnN0IG9iaiBvZiB0aGlzKSB7XG4gICAgICBpZiAob2JqLmlzRXJyKSB7XG4gICAgICAgIGNvbnN0IGVycm9yTWVzczogc3RyaW5nID0gb2JqLmVycm9yLm1lc3NhZ2UgYXMgc3RyaW5nO1xuICAgICAgICB0aHJvdyBFcnJvcihgW0FycmF5IGluZGV4IG9mIGNhdWdodCAnUmVzdWx0LmVycic6ICR7aX1dJHtlcnJvck1lc3N9YCk7XG4gICAgICB9IGVsc2UgaWYgKG9iai5pc09rKSB7XG4gICAgICAgIGluc3RydWN0aW9ucy5wdXNoKG9iai52YWx1ZSBhcyBJbnN0cnVjdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChvYmogYXMgSW5zdHJ1Y3Rpb24pO1xuICAgICAgfVxuICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gQmF0Y2guYmF0Y2hTdWJtaXQoaW5zdHJ1Y3Rpb25zKTtcbiAgfSk7XG59O1xuIiwgIi8vQGludGVybmFsc1xuZXhwb3J0IGNvbnN0IE1BWF9SRVRSSUVTID0gMztcbiIsICJpbXBvcnQge1xuICBDb25maXJtT3B0aW9ucyxcbiAgc2VuZEFuZENvbmZpcm1UcmFuc2FjdGlvbixcbiAgVHJhbnNhY3Rpb24sXG4gIFRyYW5zYWN0aW9uU2lnbmF0dXJlLFxufSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnfi9ub2RlJztcbmltcG9ydCB7IFRyeSB9IGZyb20gJ34vc2hhcmVkJztcbmltcG9ydCB7IE1BWF9SRVRSSUVTIH0gZnJvbSAnLi9kZWZpbmUnO1xuaW1wb3J0IHsgSW5zdHJ1Y3Rpb24gYXMgX0luZGV4IH0gZnJvbSAnLi8nO1xuXG5leHBvcnQgY2xhc3MgSW5zdHJ1Y3Rpb24ge1xuICBzdGF0aWMgYmF0Y2hTdWJtaXQgPSBhc3luYyAoYXJyOiBfSW5kZXhbXSk6IFByb21pc2U8VHJhbnNhY3Rpb25TaWduYXR1cmU+ID0+IHtcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBhIG9mIGFycikge1xuICAgICAgaWYgKCFhLmluc3RydWN0aW9ucyAmJiAhYS5zaWduZXJzKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgIGBvbmx5IEluc3RydWN0aW9uIG9iamVjdCB0aGF0IGNhbiB1c2UgYmF0Y2hTdWJtaXQoKS5cbiAgICAgICAgICAgIEluZGV4OiAke2l9LCBTZXQgdmFsdWU6ICR7SlNPTi5zdHJpbmdpZnkoYSl9YCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGkrKztcbiAgICB9XG5cbiAgICBjb25zdCBpbnN0cnVjdGlvbnMgPSBhcnIuZmxhdE1hcCgoYSkgPT4gYS5pbnN0cnVjdGlvbnMpO1xuICAgIGNvbnN0IHNpZ25lcnMgPSBhcnIuZmxhdE1hcCgoYSkgPT4gYS5zaWduZXJzKTtcbiAgICBjb25zdCBmZWVQYXllcnMgPSBhcnIuZmlsdGVyKChhKSA9PiBhLmZlZVBheWVyICE9PSB1bmRlZmluZWQpO1xuICAgIGxldCBmZWVQYXllciA9IHNpZ25lcnNbMF07XG4gICAgaWYgKGZlZVBheWVycy5sZW5ndGggPiAwICYmIGZlZVBheWVyc1swXS5mZWVQYXllcikge1xuICAgICAgZmVlUGF5ZXIgPSBmZWVQYXllcnNbMF0uZmVlUGF5ZXI7XG4gICAgfVxuXG4gICAgY29uc3QgdHJhbnNhY3Rpb24gPSBuZXcgVHJhbnNhY3Rpb24oKTtcbiAgICBsZXQgZmluYWxTaWduZXJzID0gc2lnbmVycztcbiAgICBpZiAoZmVlUGF5ZXIpIHtcbiAgICAgIHRyYW5zYWN0aW9uLmZlZVBheWVyID0gZmVlUGF5ZXIucHVibGljS2V5O1xuICAgICAgZmluYWxTaWduZXJzID0gW2ZlZVBheWVyLCAuLi5zaWduZXJzXTtcbiAgICB9XG4gICAgaW5zdHJ1Y3Rpb25zLm1hcCgoaW5zdCkgPT4gdHJhbnNhY3Rpb24uYWRkKGluc3QpKTtcblxuICAgIGNvbnN0IG9wdGlvbnM6IENvbmZpcm1PcHRpb25zID0ge1xuICAgICAgbWF4UmV0cmllczogTUFYX1JFVFJJRVMsXG4gICAgfTtcblxuICAgIHJldHVybiBhd2FpdCBzZW5kQW5kQ29uZmlybVRyYW5zYWN0aW9uKFxuICAgICAgTm9kZS5nZXRDb25uZWN0aW9uKCksXG4gICAgICB0cmFuc2FjdGlvbixcbiAgICAgIGZpbmFsU2lnbmVycyxcbiAgICAgIG9wdGlvbnMsXG4gICAgKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBzZW5UcmFuc2FjdGlvbigpIFRyYW5zYWN0aW9uSW5zdHJ1Y3Rpb25cbiAqXG4gKiBAc2VlIHtAbGluayB0eXBlcy9nbG9iYWwudHN9XG4gKiBAcmV0dXJucyBQcm9taXNlPFJlc3VsdDxzdHJpbmcsIEVycm9yPj5cbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnQgKi9cbi8qIEB0cy1pZ25vcmUgKi9cbkFycmF5LnByb3RvdHlwZS5zdWJtaXQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGluc3RydWN0aW9uczogX0luZGV4W10gPSBbXTtcbiAgLy8gZG9udCB1c2UgZm9yRWFjaFxuICAvLyBJdCBpcyBub3QgcG9zc2libGUgdG8gc3RvcCB0aGUgcHJvY2VzcyBieSBSRVRVUk4gaW4gdGhlIG1pZGRsZSBvZiB0aGUgcHJvY2Vzcy5cbiAgcmV0dXJuIFRyeShhc3luYyAoKSA9PiB7XG4gICAgbGV0IGkgPSAwO1xuICAgIGZvciAoY29uc3Qgb2JqIG9mIHRoaXMpIHtcbiAgICAgIGlmIChvYmouaXNFcnIpIHtcbiAgICAgICAgY29uc3QgZXJyb3JNZXNzOiBzdHJpbmcgPSBvYmouZXJyb3IubWVzc2FnZSBhcyBzdHJpbmc7XG4gICAgICAgIHRocm93IEVycm9yKGBbQXJyYXkgaW5kZXggb2YgY2F1Z2h0ICdSZXN1bHQuZXJyJzogJHtpfV0ke2Vycm9yTWVzc31gKTtcbiAgICAgIH0gZWxzZSBpZiAob2JqLmlzT2spIHtcbiAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2gob2JqLnZhbHVlIGFzIF9JbmRleCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChvYmogYXMgX0luZGV4KTtcbiAgICAgIH1cbiAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIEluc3RydWN0aW9uLmJhdGNoU3VibWl0KGluc3RydWN0aW9ucyk7XG4gIH0pO1xufTtcbiIsICJpbXBvcnQge1xuICBDb25maXJtT3B0aW9ucyxcbiAgS2V5cGFpcixcbiAgc2VuZEFuZENvbmZpcm1UcmFuc2FjdGlvbixcbiAgVHJhbnNhY3Rpb24sXG4gIFRyYW5zYWN0aW9uSW5zdHJ1Y3Rpb24sXG4gIFRyYW5zYWN0aW9uU2lnbmF0dXJlLFxufSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuXG5pbXBvcnQgeyBDb25zdGFudHMsIGRlYnVnTG9nLCBSZXN1bHQsIFRyeSB9IGZyb20gJ34vc2hhcmVkJztcbmltcG9ydCB7IE5vZGUgfSBmcm9tICd+L25vZGUnO1xuaW1wb3J0IHsgTUFYX1JFVFJJRVMgfSBmcm9tICcuL2luc3RydWN0aW9uL2RlZmluZSc7XG5pbXBvcnQgeyBJbnN0cnVjdGlvbiB9IGZyb20gJy4vaW5zdHJ1Y3Rpb24nO1xuXG5leHBvcnQgY2xhc3MgTWludEluc3RydWN0aW9uIGV4dGVuZHMgSW5zdHJ1Y3Rpb24ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBpbnN0cnVjdGlvbnM6IFRyYW5zYWN0aW9uSW5zdHJ1Y3Rpb25bXSxcbiAgICBzaWduZXJzOiBLZXlwYWlyW10sXG4gICAgZmVlUGF5ZXI/OiBLZXlwYWlyLFxuICAgIGRhdGE/OiB1bmtub3duLFxuICApIHtcbiAgICBzdXBlcihpbnN0cnVjdGlvbnMsIHNpZ25lcnMsIGZlZVBheWVyLCBkYXRhKTtcbiAgfVxuXG4gIHN1Ym1pdCA9IGFzeW5jICgpOiBQcm9taXNlPFJlc3VsdDxUcmFuc2FjdGlvblNpZ25hdHVyZSwgRXJyb3I+PiA9PiB7XG4gICAgcmV0dXJuIFRyeShhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTWludEluc3RydWN0aW9uKSkge1xuICAgICAgICB0aHJvdyBFcnJvcignb25seSBNaW50SW5zdHJ1Y3Rpb24gb2JqZWN0IHRoYXQgY2FuIHVzZSB0aGlzJyk7XG4gICAgICB9XG4gICAgICBjb25zdCB0cmFuc2FjdGlvbiA9IG5ldyBUcmFuc2FjdGlvbigpO1xuICAgICAgY29uc3QgYmxvY2toYXNoT2JqID0gYXdhaXQgTm9kZS5nZXRDb25uZWN0aW9uKCkuZ2V0TGF0ZXN0QmxvY2toYXNoKCk7XG4gICAgICB0cmFuc2FjdGlvbi5sYXN0VmFsaWRCbG9ja0hlaWdodCA9IGJsb2NraGFzaE9iai5sYXN0VmFsaWRCbG9ja0hlaWdodDtcbiAgICAgIHRyYW5zYWN0aW9uLnJlY2VudEJsb2NraGFzaCA9IGJsb2NraGFzaE9iai5ibG9ja2hhc2g7XG4gICAgICBsZXQgZmluYWxTaWduZXJzID0gdGhpcy5zaWduZXJzO1xuXG4gICAgICBpZiAodGhpcy5mZWVQYXllcikge1xuICAgICAgICB0cmFuc2FjdGlvbi5mZWVQYXllciA9IHRoaXMuZmVlUGF5ZXIucHVibGljS2V5O1xuICAgICAgICBmaW5hbFNpZ25lcnMgPSBbdGhpcy5mZWVQYXllciwgLi4udGhpcy5zaWduZXJzXTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pbnN0cnVjdGlvbnMuZm9yRWFjaCgoaW5zdCkgPT4gdHJhbnNhY3Rpb24uYWRkKGluc3QpKTtcblxuICAgICAgY29uc3Qgb3B0aW9uczogQ29uZmlybU9wdGlvbnMgPSB7XG4gICAgICAgIG1heFJldHJpZXM6IE1BWF9SRVRSSUVTLFxuICAgICAgfTtcblxuICAgICAgaWYgKE5vZGUuZ2V0Q29ubmVjdGlvbigpLnJwY0VuZHBvaW50ID09PSBDb25zdGFudHMuRW5kUG9pbnRVcmwucHJkKSB7XG4gICAgICAgIGRlYnVnTG9nKCcjIENoYW5nZSBtZXRhcGxleCBjbHVzdGVyIG9uIG1haW5uZXQtYmV0YScpO1xuICAgICAgICBOb2RlLmNoYW5nZUNvbm5lY3Rpb24oeyBjbHVzdGVyOiBDb25zdGFudHMuQ2x1c3Rlci5wcmRNZXRhcGxleCB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGF3YWl0IHNlbmRBbmRDb25maXJtVHJhbnNhY3Rpb24oXG4gICAgICAgIE5vZGUuZ2V0Q29ubmVjdGlvbigpLFxuICAgICAgICB0cmFuc2FjdGlvbixcbiAgICAgICAgZmluYWxTaWduZXJzLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcbn1cbiIsICJpbXBvcnQge1xuICBLZXlwYWlyLFxuICBQdWJsaWNLZXksXG4gIFN5c3RlbVByb2dyYW0sXG4gIFNZU1ZBUl9SRU5UX1BVQktFWSxcbiAgVHJhbnNhY3Rpb25JbnN0cnVjdGlvbixcbn0gZnJvbSAnQHNvbGFuYS93ZWIzLmpzJztcblxuaW1wb3J0IHsgYmxvYiwgc3RydWN0LCB1OCB9IGZyb20gJ0Bzb2xhbmEvYnVmZmVyLWxheW91dCc7XG5pbXBvcnQgeyBUT0tFTl9QUk9HUkFNX0lEIH0gZnJvbSAnQHNvbGFuYS9zcGwtdG9rZW4nO1xuXG5leHBvcnQgbmFtZXNwYWNlIE11bHRpc2lnSW5zdHJ1Y3Rpb24ge1xuICAvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG4gIGNvbnN0IGNyZWF0ZUxheW91dFB1YktleSA9IChwcm9wZXJ0eTogc3RyaW5nKTogYW55ID0+IHtcbiAgICByZXR1cm4gYmxvYigzMiwgcHJvcGVydHkpO1xuICB9O1xuXG4gIC8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtYXJndW1lbnQgKi9cbiAgZXhwb3J0IGNvbnN0IExheW91dCA9IHN0cnVjdDx7XG4gICAgbTogbnVtYmVyO1xuICAgIG46IG51bWJlcjtcbiAgICBpc19pbml0aWFsaXplZDogbnVtYmVyO1xuICAgIHNpZ25lcjE6IFB1YmxpY0tleTtcbiAgICBzaWduZXIyOiBQdWJsaWNLZXk7XG4gICAgc2lnbmVyMzogUHVibGljS2V5O1xuICAgIHNpZ25lcjQ6IFB1YmxpY0tleTtcbiAgICBzaWduZXI1OiBQdWJsaWNLZXk7XG4gICAgc2lnbmVyNjogUHVibGljS2V5O1xuICAgIHNpZ25lcjc6IFB1YmxpY0tleTtcbiAgICBzaWduZXI4OiBQdWJsaWNLZXk7XG4gICAgc2lnbmVyOTogUHVibGljS2V5O1xuICAgIHNpZ25lcjEwOiBQdWJsaWNLZXk7XG4gICAgc2lnbmVyMTE6IFB1YmxpY0tleTtcbiAgfT4oW1xuICAgIHU4KCdtJyksXG4gICAgdTgoJ24nKSxcbiAgICB1OCgnaXNfaW5pdGlhbGl6ZWQnKSxcbiAgICBjcmVhdGVMYXlvdXRQdWJLZXkoJ3NpZ25lcjEnKSxcbiAgICBjcmVhdGVMYXlvdXRQdWJLZXkoJ3NpZ25lcjInKSxcbiAgICBjcmVhdGVMYXlvdXRQdWJLZXkoJ3NpZ25lcjMnKSxcbiAgICBjcmVhdGVMYXlvdXRQdWJLZXkoJ3NpZ25lcjQnKSxcbiAgICBjcmVhdGVMYXlvdXRQdWJLZXkoJ3NpZ25lcjUnKSxcbiAgICBjcmVhdGVMYXlvdXRQdWJLZXkoJ3NpZ25lcjYnKSxcbiAgICBjcmVhdGVMYXlvdXRQdWJLZXkoJ3NpZ25lcjcnKSxcbiAgICBjcmVhdGVMYXlvdXRQdWJLZXkoJ3NpZ25lcjgnKSxcbiAgICBjcmVhdGVMYXlvdXRQdWJLZXkoJ3NpZ25lcjknKSxcbiAgICBjcmVhdGVMYXlvdXRQdWJLZXkoJ3NpZ25lcjEwJyksXG4gICAgY3JlYXRlTGF5b3V0UHViS2V5KCdzaWduZXIxMScpLFxuICBdKTtcblxuICBleHBvcnQgY29uc3QgYWNjb3VudCA9IChcbiAgICBuZXdBY2NvdW50OiBLZXlwYWlyLFxuICAgIGZlZVBheWVyOiBLZXlwYWlyLFxuICAgIGJhbGFuY2VOZWVkZWQ6IG51bWJlcixcbiAgKTogVHJhbnNhY3Rpb25JbnN0cnVjdGlvbiA9PiB7XG4gICAgcmV0dXJuIFN5c3RlbVByb2dyYW0uY3JlYXRlQWNjb3VudCh7XG4gICAgICBmcm9tUHVia2V5OiBmZWVQYXllci5wdWJsaWNLZXksXG4gICAgICBuZXdBY2NvdW50UHVia2V5OiBuZXdBY2NvdW50LnB1YmxpY0tleSxcbiAgICAgIGxhbXBvcnRzOiBiYWxhbmNlTmVlZGVkLFxuICAgICAgc3BhY2U6IExheW91dC5zcGFuLFxuICAgICAgcHJvZ3JhbUlkOiBUT0tFTl9QUk9HUkFNX0lELFxuICAgIH0pO1xuICB9O1xuXG4gIGV4cG9ydCBjb25zdCBtdWx0aXNpZyA9IChcbiAgICBtOiBudW1iZXIsXG4gICAgZmVlUGF5ZXI6IEtleXBhaXIsXG4gICAgc2lnbmVyUHVia2V5OiBQdWJsaWNLZXlbXSxcbiAgKTogVHJhbnNhY3Rpb25JbnN0cnVjdGlvbiA9PiB7XG4gICAgY29uc3Qga2V5cyA9IFtcbiAgICAgIHtcbiAgICAgICAgcHVia2V5OiBmZWVQYXllci5wdWJsaWNLZXksXG4gICAgICAgIGlzU2lnbmVyOiBmYWxzZSxcbiAgICAgICAgaXNXcml0YWJsZTogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHB1YmtleTogU1lTVkFSX1JFTlRfUFVCS0VZLFxuICAgICAgICBpc1NpZ25lcjogZmFsc2UsXG4gICAgICAgIGlzV3JpdGFibGU6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdO1xuICAgIHNpZ25lclB1YmtleS5mb3JFYWNoKChwdWJrZXkpID0+XG4gICAgICBrZXlzLnB1c2goe1xuICAgICAgICBwdWJrZXksXG4gICAgICAgIGlzU2lnbmVyOiBmYWxzZSxcbiAgICAgICAgaXNXcml0YWJsZTogZmFsc2UsXG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgY29uc3QgZGF0YUxheW91dCA9IHN0cnVjdDx7IGluc3RydWN0aW9uOiBudW1iZXI7IG06IG51bWJlciB9PihbXG4gICAgICB1OCgnaW5zdHJ1Y3Rpb24nKSxcbiAgICAgIHU4KCdtJyksXG4gICAgXSk7XG5cbiAgICBjb25zdCBkYXRhID0gQnVmZmVyLmFsbG9jKGRhdGFMYXlvdXQuc3Bhbik7XG5cbiAgICBkYXRhTGF5b3V0LmVuY29kZShcbiAgICAgIHtcbiAgICAgICAgaW5zdHJ1Y3Rpb246IDIsXG4gICAgICAgIG0sXG4gICAgICB9LFxuICAgICAgZGF0YSxcbiAgICApO1xuXG4gICAgcmV0dXJuIG5ldyBUcmFuc2FjdGlvbkluc3RydWN0aW9uKHtcbiAgICAgIGtleXMsXG4gICAgICBwcm9ncmFtSWQ6IFRPS0VOX1BST0dSQU1fSUQsXG4gICAgICBkYXRhLFxuICAgIH0pO1xuICB9O1xufVxuIiwgImltcG9ydCB7XG4gIENvbmZpcm1PcHRpb25zLFxuICBUcmFuc2FjdGlvbixcbiAgVHJhbnNhY3Rpb25TaWduYXR1cmUsXG59IGZyb20gJ0Bzb2xhbmEvd2ViMy5qcyc7XG5cbmltcG9ydCB7IFJlc3VsdCwgVHJ5IH0gZnJvbSAnfi9zaGFyZWQnO1xuaW1wb3J0IHsgTm9kZSB9IGZyb20gJ34vbm9kZSc7XG5pbXBvcnQgeyBQdWJrZXksIFNlY3JldCB9IGZyb20gJ34vdHlwZXMvYWNjb3VudCc7XG5pbXBvcnQgeyBNQVhfUkVUUklFUyB9IGZyb20gJy4vaW5zdHJ1Y3Rpb24vZGVmaW5lJztcblxuZXhwb3J0IGNsYXNzIFBhcnRpYWxTaWduSW5zdHJ1Y3Rpb24ge1xuICBoZXhJbnN0cnVjdGlvbjogc3RyaW5nO1xuICBkYXRhPzogUHVia2V5O1xuXG4gIGNvbnN0cnVjdG9yKGluc3RydWN0aW9uczogc3RyaW5nLCBtaW50PzogUHVia2V5KSB7XG4gICAgdGhpcy5oZXhJbnN0cnVjdGlvbiA9IGluc3RydWN0aW9ucztcbiAgICB0aGlzLmRhdGEgPSBtaW50O1xuICB9XG5cbiAgc3VibWl0ID0gYXN5bmMgKFxuICAgIGZlZVBheWVyOiBTZWNyZXQsXG4gICk6IFByb21pc2U8UmVzdWx0PFRyYW5zYWN0aW9uU2lnbmF0dXJlLCBFcnJvcj4+ID0+IHtcbiAgICByZXR1cm4gVHJ5KGFzeW5jICgpID0+IHtcbiAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBQYXJ0aWFsU2lnbkluc3RydWN0aW9uKSkge1xuICAgICAgICB0aHJvdyBFcnJvcignb25seSBQYXJ0aWFsU2lnbkluc3RydWN0aW9uIG9iamVjdCB0aGF0IGNhbiB1c2UgdGhpcycpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBkZWNvZGUgPSBCdWZmZXIuZnJvbSh0aGlzLmhleEluc3RydWN0aW9uLCAnaGV4Jyk7XG4gICAgICBjb25zdCB0cmFuc2FjdGlvbkZyb21Kc29uID0gVHJhbnNhY3Rpb24uZnJvbShkZWNvZGUpO1xuICAgICAgdHJhbnNhY3Rpb25Gcm9tSnNvbi5wYXJ0aWFsU2lnbihmZWVQYXllci50b0tleXBhaXIoKSk7XG5cbiAgICAgIGNvbnN0IG9wdGlvbnM6IENvbmZpcm1PcHRpb25zID0ge1xuICAgICAgICBtYXhSZXRyaWVzOiBNQVhfUkVUUklFUyxcbiAgICAgIH07XG4gICAgICBjb25zdCB3aXJlVHJhbnNhY3Rpb24gPSB0cmFuc2FjdGlvbkZyb21Kc29uLnNlcmlhbGl6ZSgpO1xuICAgICAgcmV0dXJuIGF3YWl0IE5vZGUuZ2V0Q29ubmVjdGlvbigpLnNlbmRSYXdUcmFuc2FjdGlvbihcbiAgICAgICAgd2lyZVRyYW5zYWN0aW9uLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcbn1cbiIsICJpbXBvcnQgeyBLZXlwYWlyLCBMQU1QT1JUU19QRVJfU09MLCBQdWJsaWNLZXkgfSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuaW1wb3J0IHsgTm9kZSB9IGZyb20gJ34vbm9kZSc7XG5pbXBvcnQgeyBDb25zdGFudHMsIGRlYnVnTG9nIH0gZnJvbSAnfi9zaGFyZWQnO1xuaW1wb3J0IHsgS2V5cGFpckFjY291bnQgfSBmcm9tICd+L2FjY291bnQnO1xuaW1wb3J0IHsgQmlnTnVtYmVyIH0gZnJvbSAnYmlnbnVtYmVyLmpzJztcbmltcG9ydCB7IEV4cGxvcmVyIH0gZnJvbSAnfi90eXBlcy9nbG9iYWwnO1xuaW1wb3J0IGJzIGZyb20gJ2JzNTgnO1xuXG4vKipcbiAqIENyZWF0ZSBleHBsb3JlciB1cmwgZm9yIGFjY291bnQgYWRkcmVzcyBvciBzaWduYXR1cmVcbiAqXG4gKiBAc2VlIHtAbGluayB0eXBlcy9nbG9iYWwudHN9XG4gKiBAcmV0dXJucyBzdHJpbmdcbiAqL1xuU3RyaW5nLnByb3RvdHlwZS50b0V4cGxvcmVyVXJsID0gZnVuY3Rpb24gKFxuICBleHBsb3JlcjogRXhwbG9yZXIgPSBFeHBsb3Jlci5Tb2xzY2FuLFxuKSB7XG4gIGNvbnN0IGVuZFBvaW50VXJsID0gTm9kZS5nZXRDb25uZWN0aW9uKCkucnBjRW5kcG9pbnQ7XG4gIGRlYnVnTG9nKCcjIHRvRXhwbG9yZXJVcmwgcnBjRW5kcG9pbnQ6JywgZW5kUG9pbnRVcmwpO1xuICBsZXQgY2x1c3RlciA9ICcnO1xuICBpZiAoZW5kUG9pbnRVcmwgPT09IENvbnN0YW50cy5FbmRQb2ludFVybC5wcmQpIHtcbiAgICBjbHVzdGVyID0gQ29uc3RhbnRzLkNsdXN0ZXIucHJkO1xuICB9IGVsc2UgaWYgKGVuZFBvaW50VXJsID09PSBDb25zdGFudHMuRW5kUG9pbnRVcmwudGVzdCkge1xuICAgIGNsdXN0ZXIgPSBDb25zdGFudHMuQ2x1c3Rlci50ZXN0O1xuICB9IGVsc2UgaWYgKGVuZFBvaW50VXJsID09PSBDb25zdGFudHMuRW5kUG9pbnRVcmwuZGV2KSB7XG4gICAgY2x1c3RlciA9IENvbnN0YW50cy5DbHVzdGVyLmRldjtcbiAgfSBlbHNlIHtcbiAgICBjbHVzdGVyID0gQ29uc3RhbnRzLkNsdXN0ZXIuZGV2O1xuICB9XG5cbiAgY29uc3QgYWRkcmVzc09yU2lnbmF0dXJlOiBzdHJpbmcgPSB0aGlzLnRvU3RyaW5nKCk7XG4gIGxldCB1cmwgPSAnJztcbiAgaWYgKEtleXBhaXJBY2NvdW50LmlzUHVia2V5KGFkZHJlc3NPclNpZ25hdHVyZSkpIHtcbiAgICAvLyBhZGRyZXNzXG4gICAgaWYgKGV4cGxvcmVyID09PSBFeHBsb3Jlci5Tb2xhbmFGTSkge1xuICAgICAgdXJsID0gYGh0dHBzOi8vc29sYW5hLmZtL2FkZHJlc3MvJHthZGRyZXNzT3JTaWduYXR1cmV9P2NsdXN0ZXI9JHtjbHVzdGVyfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVybCA9IGBodHRwczovL3NvbHNjYW4uaW8vYWNjb3VudC8ke2FkZHJlc3NPclNpZ25hdHVyZX0/Y2x1c3Rlcj0ke2NsdXN0ZXJ9YDtcbiAgICB9XG4gICAgLy8gc2lnbmF0dXJlXG4gIH0gZWxzZSB7XG4gICAgLy8gZm9yIEludmFsaWQgdHlwZSBcIm5ldmVyXCIgb2YgYWRkcmVzc09yU2lnbmF0dXJlLCBzbyBgYXMgc3RyaW5nYFxuICAgIGlmIChleHBsb3JlciA9PT0gRXhwbG9yZXIuU29sYW5hRk0pIHtcbiAgICAgIHVybCA9IGBodHRwczovL3NvbGFuYS5mbS90eC8ke1xuICAgICAgICBhZGRyZXNzT3JTaWduYXR1cmUgYXMgc3RyaW5nXG4gICAgICB9P2NsdXN0ZXI9JHtjbHVzdGVyfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVybCA9IGBodHRwczovL3NvbHNjYW4uaW8vdHgvJHtcbiAgICAgICAgYWRkcmVzc09yU2lnbmF0dXJlIGFzIHN0cmluZ1xuICAgICAgfT9jbHVzdGVyPSR7Y2x1c3Rlcn1gO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdXJsO1xufTtcblxuLyoqXG4gKiBQdWJLZXkoQHNvbGFuYS1zdWl0ZSkgdG8gUHVibGljS2V5KEBzb2xhbmEvd2ViMy5qcylcbiAqXG4gKiBAc2VlIHtAbGluayB0eXBlcy9nbG9iYWwudHN9XG4gKiBAcmV0dXJucyBQdWJsaWNLZXlcbiAqL1xuU3RyaW5nLnByb3RvdHlwZS50b1B1YmxpY0tleSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCFLZXlwYWlyQWNjb3VudC5pc1B1YmtleSh0aGlzLnRvU3RyaW5nKCkpKSB7XG4gICAgdGhyb3cgRXJyb3IoYE5vIG1hdGNoIEtleVBhaXIuUHViS2V5OiAke3RoaXMudG9TdHJpbmcoKX1gKTtcbiAgfVxuICByZXR1cm4gbmV3IFB1YmxpY0tleSh0aGlzLnRvU3RyaW5nKCkpO1xufTtcblxuLyoqXG4gKiBTZWNyZXQoQHNvbGFuYS1zdWl0ZSkgdG8gS2V5cGFpcihAc29sYW5hL3dlYjMuanMpXG4gKlxuICogQHNlZSB7QGxpbmsgdHlwZXMvZ2xvYmFsLnRzfVxuICogQHJldHVybnMgS2V5cGFpclxuICovXG5TdHJpbmcucHJvdG90eXBlLnRvS2V5cGFpciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCFLZXlwYWlyQWNjb3VudC5pc1NlY3JldCh0aGlzLnRvU3RyaW5nKCkpKSB7XG4gICAgdGhyb3cgRXJyb3IoYE5vIG1hdGNoIEtleVBhaXIuU2VjcmV0OiAke3RoaXMudG9TdHJpbmcoKX1gKTtcbiAgfVxuICBjb25zdCBkZWNvZGVkID0gYnMuZGVjb2RlKHRoaXMudG9TdHJpbmcoKSk7XG4gIHJldHVybiBLZXlwYWlyLmZyb21TZWNyZXRLZXkoZGVjb2RlZCk7XG59O1xuXG4vKipcbiAqIExBTVBPUlRTIHRvIFNPTFxuICpcbiAqIEBzZWUge0BsaW5rIHR5cGVzL2dsb2JhbC50c31cbiAqIEByZXR1cm5zIG51bWJlclxuICovXG5OdW1iZXIucHJvdG90eXBlLnRvU29sID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gQmlnTnVtYmVyKHRoaXMgYXMgbnVtYmVyKVxuICAgIC5kaXYoTEFNUE9SVFNfUEVSX1NPTClcbiAgICAudG9OdW1iZXIoKTtcbn07XG5cbi8qKlxuICogU09MIHRvIExBTVBPUlRTXG4gKlxuICogQHNlZSB7QGxpbmsgdHlwZXMvZ2xvYmFsLnRzfVxuICogQHJldHVybnMgbnVtYmVyXG4gKi9cbk51bWJlci5wcm90b3R5cGUudG9MYW1wb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIEJpZ051bWJlcih0aGlzIGFzIG51bWJlcilcbiAgICAudGltZXMoTEFNUE9SVFNfUEVSX1NPTClcbiAgICAudG9OdW1iZXIoKTtcbn07XG4iLCAiaW1wb3J0IHsgVHJhbnNhY3Rpb25JbnN0cnVjdGlvbiB9IGZyb20gJ0Bzb2xhbmEvd2ViMy5qcyc7XG5pbXBvcnQgeyBkZWJ1Z0xvZywgc2xlZXAgfSBmcm9tICd+L3NoYXJlZCc7XG5cbmltcG9ydCB7IE5vZGUgfSBmcm9tICd+L25vZGUnO1xuaW1wb3J0IHsgSW5zdHJ1Y3Rpb24gfSBmcm9tICd+L2luc3RydWN0aW9uJztcbmltcG9ydCB7IFB1YmtleSwgU2VjcmV0IH0gZnJvbSAnfi90eXBlcy9hY2NvdW50JztcblxuaW1wb3J0IHtcbiAgQVNTT0NJQVRFRF9UT0tFTl9QUk9HUkFNX0lELFxuICBjcmVhdGVBc3NvY2lhdGVkVG9rZW5BY2NvdW50SW5zdHJ1Y3Rpb24sXG4gIGdldEFjY291bnQsXG4gIGdldEFzc29jaWF0ZWRUb2tlbkFkZHJlc3NTeW5jLFxuICBUT0tFTl9QUk9HUkFNX0lELFxuICBUb2tlbkFjY291bnROb3RGb3VuZEVycm9yLFxuICBUb2tlbkludmFsaWRBY2NvdW50T3duZXJFcnJvcixcbn0gZnJvbSAnQHNvbGFuYS9zcGwtdG9rZW4nO1xuXG5pbXBvcnQgeyBLZXlwYWlyQWNjb3VudCB9IGZyb20gJy4va2V5cGFpci1hY2NvdW50JztcblxuLyoqXG4gKiBHZXQgQXNzb2NpYXRlZCB0b2tlbiBBY2NvdW50LlxuICogaWYgbm90IGNyZWF0ZWQsIGNyZWF0ZSBuZXcgdG9rZW4gYWNjb3VpbnRcbiAqXG4gKiBAcGFyYW0ge1B1YmtleX0gbWludFxuICogQHBhcmFtIHtQdWJrZXl9IG93bmVyXG4gKiBAcGFyYW0ge1NlY3JldH0gZmVlUGF5ZXJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWxsb3dPd25lck9mZkN1cnZlXG4gKiBAcmV0dXJucyBQcm9taXNlPHN0cmluZyB8IEluc3RydWN0aW9uPlxuICovXG5leHBvcnQgbmFtZXNwYWNlIEFzc29jaWF0ZWRBY2NvdW50IHtcbiAgY29uc3QgUkVUUllfT1ZFUl9MSU1JVCA9IDEwO1xuICBjb25zdCBSRVRSWV9TTEVFUF9USU1FID0gMztcbiAgY29uc3QgZ2V0ID0gYXN5bmMgKFxuICAgIG1pbnQ6IFB1YmtleSxcbiAgICBvd25lcjogUHVia2V5LFxuICAgIGZlZVBheWVyOiBTZWNyZXQsXG4gICAgYWxsb3dPd25lck9mZkN1cnZlID0gZmFsc2UsXG4gICk6IFByb21pc2U8c3RyaW5nIHwgSW5zdHJ1Y3Rpb24+ID0+IHtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBtYWtlT3JDcmVhdGVJbnN0cnVjdGlvbihcbiAgICAgIG1pbnQsXG4gICAgICBvd25lcixcbiAgICAgIG5ldyBLZXlwYWlyQWNjb3VudCh7IHNlY3JldDogZmVlUGF5ZXIgfSkucHVia2V5LFxuICAgICAgYWxsb3dPd25lck9mZkN1cnZlLFxuICAgICk7XG5cbiAgICBpZiAoIXJlcy5pbnN0KSB7XG4gICAgICByZXR1cm4gcmVzLnRva2VuQWNjb3VudDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEluc3RydWN0aW9uKFxuICAgICAgW3Jlcy5pbnN0XSxcbiAgICAgIFtdLFxuICAgICAgZmVlUGF5ZXIudG9LZXlwYWlyKCksXG4gICAgICByZXMudG9rZW5BY2NvdW50LFxuICAgICk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHJ5IGZ1bmN0aW9uIGlmIGNyZWF0ZSBuZXcgdG9rZW4gYWNjb3VpbnRcbiAgICpcbiAgICogQHBhcmFtIHtQdWJrZXl9IG1pbnRcbiAgICogQHBhcmFtIHtQdWJrZXl9IG93bmVyXG4gICAqIEBwYXJhbSB7U2VjcmV0fSBmZWVQYXllclxuICAgKiBAcmV0dXJucyBQcm9taXNlPHN0cmluZz5cbiAgICovXG4gIGV4cG9ydCBjb25zdCByZXRyeUdldE9yQ3JlYXRlID0gYXN5bmMgKFxuICAgIG1pbnQ6IFB1YmtleSxcbiAgICBvd25lcjogUHVia2V5LFxuICAgIGZlZVBheWVyOiBTZWNyZXQsXG4gICk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgbGV0IGNvdW50ZXIgPSAxO1xuICAgIHdoaWxlIChjb3VudGVyIDwgUkVUUllfT1ZFUl9MSU1JVCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgaW5zdCA9IGF3YWl0IGdldChtaW50LCBvd25lciwgZmVlUGF5ZXIsIHRydWUpO1xuXG4gICAgICAgIGlmIChpbnN0ICYmIHR5cGVvZiBpbnN0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGRlYnVnTG9nKCcjIGFzc29jaWF0ZWRUb2tlbkFjY291bnQ6ICcsIGluc3QpO1xuICAgICAgICAgIHJldHVybiBpbnN0O1xuICAgICAgICB9IGVsc2UgaWYgKGluc3QgaW5zdGFuY2VvZiBJbnN0cnVjdGlvbikge1xuICAgICAgICAgIChhd2FpdCBpbnN0LnN1Ym1pdCgpKS5tYXAoXG4gICAgICAgICAgICBhc3luYyAob2spID0+IHtcbiAgICAgICAgICAgICAgYXdhaXQgTm9kZS5jb25maXJtZWRTaWcob2spO1xuICAgICAgICAgICAgICByZXR1cm4gaW5zdC5kYXRhIGFzIHN0cmluZztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIGRlYnVnTG9nKCcjIEVycm9yIHN1Ym1pdCByZXRyeUdldE9yQ3JlYXRlOiAnLCBlcnIpO1xuICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGVidWdMb2coYCMgcmV0cnk6ICR7Y291bnRlcn0gY3JlYXRlIHRva2VuIGFjY291bnQ6IGAsIGUpO1xuICAgICAgICBkZWJ1Z0xvZyhgIyBtaW50OiAke21pbnR9LCBvd25lcjogJHtvd25lcn0sIGZlZVBheWVyOiAke2ZlZVBheWVyfWApO1xuICAgICAgfVxuICAgICAgYXdhaXQgc2xlZXAoUkVUUllfU0xFRVBfVElNRSk7XG4gICAgICBjb3VudGVyKys7XG4gICAgfVxuICAgIHRocm93IEVycm9yKGByZXRyeSBhY3Rpb24gaXMgb3ZlciBsaW1pdCAke1JFVFJZX09WRVJfTElNSVR9YCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFtNYWluIGxvZ2ljXUdldCBBc3NvY2lhdGVkIHRva2VuIEFjY291bnQuXG4gICAqIGlmIG5vdCBjcmVhdGVkLCBjcmVhdGUgbmV3IHRva2VuIGFjY291aW50XG4gICAqXG4gICAqIEBwYXJhbSB7UHVia2V5fSBtaW50XG4gICAqIEBwYXJhbSB7UHVia2V5fSBvd25lclxuICAgKiBAcGFyYW0ge1B1YmtleX0gZmVlUGF5ZXJcbiAgICogQHJldHVybnMgUHJvbWlzZTxzdHJpbmc+XG4gICAqL1xuICBleHBvcnQgY29uc3QgbWFrZU9yQ3JlYXRlSW5zdHJ1Y3Rpb24gPSBhc3luYyAoXG4gICAgbWludDogUHVia2V5LFxuICAgIG93bmVyOiBQdWJrZXksXG4gICAgZmVlUGF5ZXI/OiBQdWJrZXksXG4gICAgYWxsb3dPd25lck9mZkN1cnZlID0gZmFsc2UsXG4gICk6IFByb21pc2U8e1xuICAgIHRva2VuQWNjb3VudDogc3RyaW5nO1xuICAgIGluc3Q6IFRyYW5zYWN0aW9uSW5zdHJ1Y3Rpb24gfCB1bmRlZmluZWQ7XG4gIH0+ID0+IHtcbiAgICBjb25zdCBhc3NvY2lhdGVkVG9rZW5BY2NvdW50ID0gZ2V0QXNzb2NpYXRlZFRva2VuQWRkcmVzc1N5bmMoXG4gICAgICBtaW50LnRvUHVibGljS2V5KCksXG4gICAgICBvd25lci50b1B1YmxpY0tleSgpLFxuICAgICAgYWxsb3dPd25lck9mZkN1cnZlLFxuICAgICAgVE9LRU5fUFJPR1JBTV9JRCxcbiAgICAgIEFTU09DSUFURURfVE9LRU5fUFJPR1JBTV9JRCxcbiAgICApO1xuXG4gICAgZGVidWdMb2coJyMgYXNzb2NpYXRlZFRva2VuQWNjb3VudDogJywgYXNzb2NpYXRlZFRva2VuQWNjb3VudC50b1N0cmluZygpKTtcblxuICAgIHRyeSB7XG4gICAgICAvLyBEb250IHVzZSBSZXN1bHRcbiAgICAgIGF3YWl0IGdldEFjY291bnQoXG4gICAgICAgIE5vZGUuZ2V0Q29ubmVjdGlvbigpLFxuICAgICAgICBhc3NvY2lhdGVkVG9rZW5BY2NvdW50LFxuICAgICAgICBOb2RlLmdldENvbm5lY3Rpb24oKS5jb21taXRtZW50LFxuICAgICAgICBUT0tFTl9QUk9HUkFNX0lELFxuICAgICAgKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRva2VuQWNjb3VudDogYXNzb2NpYXRlZFRva2VuQWNjb3VudC50b1N0cmluZygpLFxuICAgICAgICBpbnN0OiB1bmRlZmluZWQsXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycm9yOiB1bmtub3duKSB7XG4gICAgICBpZiAoXG4gICAgICAgICEoZXJyb3IgaW5zdGFuY2VvZiBUb2tlbkFjY291bnROb3RGb3VuZEVycm9yKSAmJlxuICAgICAgICAhKGVycm9yIGluc3RhbmNlb2YgVG9rZW5JbnZhbGlkQWNjb3VudE93bmVyRXJyb3IpXG4gICAgICApIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ1VuZXhwZWN0ZWQgZXJyb3InKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcGF5ZXIgPSAhZmVlUGF5ZXIgPyBvd25lciA6IGZlZVBheWVyO1xuXG4gICAgICBjb25zdCBpbnN0ID0gY3JlYXRlQXNzb2NpYXRlZFRva2VuQWNjb3VudEluc3RydWN0aW9uKFxuICAgICAgICBwYXllci50b1B1YmxpY0tleSgpLFxuICAgICAgICBhc3NvY2lhdGVkVG9rZW5BY2NvdW50LFxuICAgICAgICBvd25lci50b1B1YmxpY0tleSgpLFxuICAgICAgICBtaW50LnRvUHVibGljS2V5KCksXG4gICAgICAgIFRPS0VOX1BST0dSQU1fSUQsXG4gICAgICAgIEFTU09DSUFURURfVE9LRU5fUFJPR1JBTV9JRCxcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRva2VuQWNjb3VudDogYXNzb2NpYXRlZFRva2VuQWNjb3VudC50b1N0cmluZygpLFxuICAgICAgICBpbnN0LFxuICAgICAgfTtcbiAgICB9XG4gIH07XG59XG4iLCAiaW1wb3J0IHsgS2V5cGFpciwgUHVibGljS2V5IH0gZnJvbSAnQHNvbGFuYS93ZWIzLmpzJztcbmltcG9ydCB7IFB1YmtleSwgU2VjcmV0IH0gZnJvbSAnfi90eXBlcy9hY2NvdW50JztcbmltcG9ydCBicyBmcm9tICdiczU4JztcblxuZXhwb3J0IGNsYXNzIEtleXBhaXJBY2NvdW50IHtcbiAgc2VjcmV0OiBTZWNyZXQ7XG4gIHB1YmtleTogUHVia2V5O1xuXG4gIGNvbnN0cnVjdG9yKHBhcmFtczogeyBwdWJrZXk/OiBQdWJrZXk7IHNlY3JldDogU2VjcmV0IH0pIHtcbiAgICBpZiAoIXBhcmFtcy5wdWJrZXkpIHtcbiAgICAgIGNvbnN0IGtleXBhaXIgPSBwYXJhbXMuc2VjcmV0LnRvS2V5cGFpcigpO1xuICAgICAgdGhpcy5wdWJrZXkgPSBrZXlwYWlyLnB1YmxpY0tleS50b1N0cmluZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnB1YmtleSA9IHBhcmFtcy5wdWJrZXk7XG4gICAgfVxuICAgIHRoaXMuc2VjcmV0ID0gcGFyYW1zLnNlY3JldDtcbiAgfVxuXG4gIHRvUHVibGljS2V5KCk6IFB1YmxpY0tleSB7XG4gICAgcmV0dXJuIG5ldyBQdWJsaWNLZXkodGhpcy5wdWJrZXkpO1xuICB9XG5cbiAgdG9LZXlwYWlyKCk6IEtleXBhaXIge1xuICAgIGNvbnN0IGRlY29kZWQgPSBicy5kZWNvZGUodGhpcy5zZWNyZXQpO1xuICAgIHJldHVybiBLZXlwYWlyLmZyb21TZWNyZXRLZXkoZGVjb2RlZCk7XG4gIH1cblxuICBzdGF0aWMgaXNQdWJrZXkgPSAodmFsdWU6IHN0cmluZyk6IHZhbHVlIGlzIFB1YmtleSA9PlxuICAgIC9eWzAtOWEtekEtWl17MzIsNDR9JC8udGVzdCh2YWx1ZSk7XG5cbiAgc3RhdGljIGlzU2VjcmV0ID0gKHZhbHVlOiBzdHJpbmcpOiB2YWx1ZSBpcyBTZWNyZXQgPT5cbiAgICAvXlswLTlhLXpBLVpdezg3LDg4fSQvLnRlc3QodmFsdWUpO1xuXG4gIHN0YXRpYyBjcmVhdGUgPSAoKTogS2V5cGFpckFjY291bnQgPT4ge1xuICAgIGNvbnN0IGtleXBhaXIgPSBLZXlwYWlyLmdlbmVyYXRlKCk7XG4gICAgcmV0dXJuIG5ldyBLZXlwYWlyQWNjb3VudCh7XG4gICAgICBwdWJrZXk6IGtleXBhaXIucHVibGljS2V5LnRvU3RyaW5nKCkgYXMgUHVia2V5LFxuICAgICAgc2VjcmV0OiBicy5lbmNvZGUoa2V5cGFpci5zZWNyZXRLZXkpIGFzIFNlY3JldCxcbiAgICB9KTtcbiAgfTtcblxuICBzdGF0aWMgdG9LZXlQYWlyID0gKGtleXBhaXI6IEtleXBhaXIpOiBLZXlwYWlyQWNjb3VudCA9PiB7XG4gICAgcmV0dXJuIG5ldyBLZXlwYWlyQWNjb3VudCh7XG4gICAgICBwdWJrZXk6IGtleXBhaXIucHVibGljS2V5LnRvU3RyaW5nKCkgYXMgUHVia2V5LFxuICAgICAgc2VjcmV0OiBicy5lbmNvZGUoa2V5cGFpci5zZWNyZXRLZXkpIGFzIFNlY3JldCxcbiAgICB9KTtcbiAgfTtcbn1cbiIsICJpbXBvcnQgeyBQdWJsaWNLZXkgfSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuaW1wb3J0IHsgUFJPR1JBTV9JRCB9IGZyb20gJ0BtZXRhcGxleC1mb3VuZGF0aW9uL21wbC10b2tlbi1tZXRhZGF0YSc7XG5pbXBvcnQgeyBQdWJrZXkgfSBmcm9tICd+L3R5cGVzL2FjY291bnQnO1xuXG5leHBvcnQgbmFtZXNwYWNlIFBkYSB7XG4gIGV4cG9ydCBjb25zdCBnZXRNZXRhZGF0YSA9IChtaW50OiBQdWJrZXkpOiBQdWJsaWNLZXkgPT4ge1xuICAgIGNvbnN0IFtwdWJsaWNLZXldID0gUHVibGljS2V5LmZpbmRQcm9ncmFtQWRkcmVzc1N5bmMoXG4gICAgICBbXG4gICAgICAgIEJ1ZmZlci5mcm9tKCdtZXRhZGF0YScpLFxuICAgICAgICBQUk9HUkFNX0lELnRvQnVmZmVyKCksXG4gICAgICAgIG1pbnQudG9QdWJsaWNLZXkoKS50b0J1ZmZlcigpLFxuICAgICAgXSxcbiAgICAgIFBST0dSQU1fSUQsXG4gICAgKTtcbiAgICByZXR1cm4gcHVibGljS2V5O1xuICB9O1xuXG4gIGV4cG9ydCBjb25zdCBnZXRNYXN0ZXJFZGl0aW9uID0gKG1pbnQ6IFB1YmtleSk6IFB1YmxpY0tleSA9PiB7XG4gICAgY29uc3QgW3B1YmxpY0tleV0gPSBQdWJsaWNLZXkuZmluZFByb2dyYW1BZGRyZXNzU3luYyhcbiAgICAgIFtcbiAgICAgICAgQnVmZmVyLmZyb20oJ21ldGFkYXRhJyksXG4gICAgICAgIFBST0dSQU1fSUQudG9CdWZmZXIoKSxcbiAgICAgICAgbWludC50b1B1YmxpY0tleSgpLnRvQnVmZmVyKCksXG4gICAgICAgIEJ1ZmZlci5mcm9tKCdlZGl0aW9uJyksXG4gICAgICBdLFxuICAgICAgUFJPR1JBTV9JRCxcbiAgICApO1xuICAgIHJldHVybiBwdWJsaWNLZXk7XG4gIH07XG59XG4iLCAiaW1wb3J0IHtcbiAgSW5mcmFJbnB1dCxcbiAgSW5mcmFPdXRwdXQsXG4gIE9wdGlvbixcbiAgVXNlcklucHV0LFxuICBVc2VyT3V0cHV0LFxufSBmcm9tICd+L3R5cGVzL2NvbnZlcnRlcic7XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ29udmVydGVyIHtcbiAgZXhwb3J0IG5hbWVzcGFjZSBDb2xsZWN0aW9uIHtcbiAgICBleHBvcnQgY29uc3QgaW50b0luZnJhU2lkZSA9IChcbiAgICAgIGlucHV0OiBPcHRpb248VXNlcklucHV0LkNvbGxlY3Rpb24+IHwgdW5kZWZpbmVkLFxuICAgICk6IE9wdGlvbjxJbmZyYUlucHV0LkNvbGxlY3Rpb24+ID0+IHtcbiAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGtleTogaW5wdXQudG9QdWJsaWNLZXkoKSxcbiAgICAgICAgdmVyaWZpZWQ6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgZXhwb3J0IGNvbnN0IGludG9Vc2VyU2lkZSA9IChcbiAgICAgIG91dHB1dDogT3B0aW9uPEluZnJhT3V0cHV0LkNvbGxlY3Rpb24+LFxuICAgICk6IFVzZXJPdXRwdXQuQ29sbGVjdGlvbiB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICBpZiAoIW91dHB1dCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBhZGRyZXNzOiBvdXRwdXQua2V5LnRvU3RyaW5nKCksXG4gICAgICAgIHZlcmlmaWVkOiBvdXRwdXQudmVyaWZpZWQsXG4gICAgICB9O1xuICAgIH07XG4gIH1cbn1cbiIsICJpbXBvcnQge1xuICBJbmZyYUlucHV0LFxuICBJbmZyYU91dHB1dCxcbiAgT3B0aW9uLFxuICBVc2VySW5wdXQsXG4gIFVzZXJPdXRwdXQsXG59IGZyb20gJ34vdHlwZXMvY29udmVydGVyJztcblxuZXhwb3J0IG5hbWVzcGFjZSBDb252ZXJ0ZXIge1xuICBleHBvcnQgbmFtZXNwYWNlIENyZWF0b3JzIHtcbiAgICBleHBvcnQgY29uc3QgaW50b0luZnJhU2lkZSA9IChcbiAgICAgIGlucHV0OiBPcHRpb248VXNlcklucHV0LkNyZWF0b3JzW10+IHwgdW5kZWZpbmVkLFxuICAgICk6IE9wdGlvbjxJbmZyYUlucHV0LkNyZWF0b3JzW10+ID0+IHtcbiAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gaW5wdXQubWFwKChkYXRhKSA9PiB7XG4gICAgICAgIGxldCBtb2RpZnk6IE9wdGlvbjxJbmZyYUlucHV0LkNyZWF0b3JzPiA9IG51bGw7XG4gICAgICAgIG1vZGlmeSA9IHtcbiAgICAgICAgICBhZGRyZXNzOiBkYXRhLmFkZHJlc3MudG9QdWJsaWNLZXkoKSxcbiAgICAgICAgICBzaGFyZTogZGF0YS5zaGFyZSxcbiAgICAgICAgICB2ZXJpZmllZDogZGF0YS52ZXJpZmllZCxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kaWZ5O1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGV4cG9ydCBjb25zdCBpbnRvVXNlclNpZGUgPSAoXG4gICAgICBvdXRwdXQ6IE9wdGlvbjxJbmZyYU91dHB1dC5DcmVhdG9yW10+LFxuICAgICk6IFVzZXJPdXRwdXQuQ3JlYXRvcnNbXSB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICBpZiAoIW91dHB1dCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3V0cHV0Lm1hcCgoZGF0YSkgPT4ge1xuICAgICAgICBjb25zdCBtb2RpZnkgPSB7XG4gICAgICAgICAgYWRkcmVzczogZGF0YS5hZGRyZXNzLnRvU3RyaW5nKCksXG4gICAgICAgICAgc2hhcmU6IGRhdGEuc2hhcmUsXG4gICAgICAgICAgdmVyaWZpZWQ6IGRhdGEudmVyaWZpZWQsXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBtb2RpZnk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG59XG4iLCAiaW1wb3J0IHsgUGFyc2VkVHJhbnNhY3Rpb25XaXRoTWV0YSB9IGZyb20gJ0Bzb2xhbmEvd2ViMy5qcyc7XG5pbXBvcnQgeyBjb252ZXJ0VGltZXN0YW1wVG9EYXRlVGltZSB9IGZyb20gJ34vc2hhcmVkJztcbmltcG9ydCB7IFBvc3RUb2tlbkFjY291bnQgfSBmcm9tICd+L3R5cGVzL3RyYW5zYWN0aW9uLWZpbHRlcic7XG5pbXBvcnQgeyBIaXN0b3J5IH0gZnJvbSAnfi90eXBlcy9oaXN0b3J5JztcbmltcG9ydCB7IEluZnJhT3V0cHV0IH0gZnJvbSAnfi90eXBlcy9jb252ZXJ0ZXInO1xuXG5leHBvcnQgbmFtZXNwYWNlIENvbnZlcnRlciB7XG4gIGV4cG9ydCBuYW1lc3BhY2UgTWVtbyB7XG4gICAgZXhwb3J0IGNvbnN0IGludG9Vc2VyU2lkZSA9IChcbiAgICAgIG91dHB1dDogSW5mcmFPdXRwdXQuTWVtbyxcbiAgICAgIG1ldGE6IFBhcnNlZFRyYW5zYWN0aW9uV2l0aE1ldGEsXG4gICAgICBvdXRwdXRUcmFuc2Zlcj86IEluZnJhT3V0cHV0LlRyYW5zZmVyQ2hlY2tlZCxcbiAgICAgIG1hcHBpbmdUb2tlbkFjY291bnQ/OiBQb3N0VG9rZW5BY2NvdW50W10sXG4gICAgKTogSGlzdG9yeSB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICBjb25zdCBoaXN0b3J5OiBIaXN0b3J5ID0ge307XG5cbiAgICAgIC8vIGNhc2U6IHRyYW5zZmVyIHdpdGggbWVtb1xuICAgICAgaWYgKG91dHB1dFRyYW5zZmVyICYmIG91dHB1dFRyYW5zZmVyLnByb2dyYW0gIT09ICcnKSB7XG4gICAgICAgIGlmIChtYXBwaW5nVG9rZW5BY2NvdW50ICYmIG91dHB1dFRyYW5zZmVyLnByb2dyYW0gPT09ICdzcGwtdG9rZW4nKSB7XG4gICAgICAgICAgY29uc3QgZm91bmRTb3VyY2UgPSBtYXBwaW5nVG9rZW5BY2NvdW50LmZpbmQoXG4gICAgICAgICAgICAobSkgPT4gbS5hY2NvdW50ID09PSBvdXRwdXRUcmFuc2Zlci5wYXJzZWQuaW5mby5zb3VyY2UsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjb25zdCBmb3VuZERlc3QgPSBtYXBwaW5nVG9rZW5BY2NvdW50LmZpbmQoXG4gICAgICAgICAgICAobSkgPT4gbS5hY2NvdW50ID09PSBvdXRwdXRUcmFuc2Zlci5wYXJzZWQuaW5mby5kZXN0aW5hdGlvbixcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaGlzdG9yeS5taW50ID0gb3V0cHV0VHJhbnNmZXIucGFyc2VkLmluZm8ubWludDtcbiAgICAgICAgICBmb3VuZFNvdXJjZSAmJiAoaGlzdG9yeS5zb3VyY2UgPSBmb3VuZFNvdXJjZS5vd25lcik7XG4gICAgICAgICAgZm91bmREZXN0ICYmIChoaXN0b3J5LmRlc3RpbmF0aW9uID0gZm91bmREZXN0Lm93bmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBoaXN0b3J5LnNvdXJjZSA9IG91dHB1dFRyYW5zZmVyLnBhcnNlZC5pbmZvLnNvdXJjZTtcbiAgICAgICAgICBoaXN0b3J5LmRlc3RpbmF0aW9uID0gb3V0cHV0VHJhbnNmZXIucGFyc2VkLmluZm8uZGVzdGluYXRpb247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaGlzdG9yeS5tZW1vID0gb3V0cHV0LnBhcnNlZDtcbiAgICAgIGhpc3RvcnkudHlwZSA9IG91dHB1dC5wcm9ncmFtO1xuICAgICAgaGlzdG9yeS5kYXRlVGltZSA9IGNvbnZlcnRUaW1lc3RhbXBUb0RhdGVUaW1lKG1ldGEuYmxvY2tUaW1lIGFzIG51bWJlcik7XG4gICAgICBoaXN0b3J5LnNpZyA9IG1ldGEudHJhbnNhY3Rpb24uc2lnbmF0dXJlc1swXTtcbiAgICAgIGhpc3RvcnkuaW5uZXJJbnN0cnVjdGlvbiA9IGZhbHNlO1xuXG4gICAgICBpZiAoXG4gICAgICAgIG1ldGEubWV0YT8uaW5uZXJJbnN0cnVjdGlvbnMgJiZcbiAgICAgICAgbWV0YS5tZXRhPy5pbm5lckluc3RydWN0aW9ucy5sZW5ndGggIT09IDBcbiAgICAgICkge1xuICAgICAgICAvLyBpbm5lciBpbnN0cnVjdGlvbnNcbiAgICAgICAgaGlzdG9yeS5pbm5lckluc3RydWN0aW9uID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoaXN0b3J5O1xuICAgIH07XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBQYXJzZWRUcmFuc2FjdGlvbldpdGhNZXRhIH0gZnJvbSAnQHNvbGFuYS93ZWIzLmpzJztcbmltcG9ydCB7IEluZnJhT3V0cHV0IH0gZnJvbSAnfi90eXBlcy9jb252ZXJ0ZXInO1xuaW1wb3J0IHsgSGlzdG9yeSB9IGZyb20gJ34vdHlwZXMvaGlzdG9yeSc7XG5pbXBvcnQgeyBjb252ZXJ0VGltZXN0YW1wVG9EYXRlVGltZSB9IGZyb20gJ34vc2hhcmVkJztcblxuZXhwb3J0IG5hbWVzcGFjZSBDb252ZXJ0ZXIge1xuICBleHBvcnQgbmFtZXNwYWNlIE1pbnQge1xuICAgIGV4cG9ydCBjb25zdCBpbnRvVXNlclNpZGUgPSAoXG4gICAgICBvdXRwdXQ6IEluZnJhT3V0cHV0Lk1pbnRUbyxcbiAgICAgIG1ldGE6IFBhcnNlZFRyYW5zYWN0aW9uV2l0aE1ldGEsXG4gICAgKTogSGlzdG9yeSB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICBjb25zdCBoaXN0b3J5OiBIaXN0b3J5ID0ge307XG5cbiAgICAgIGhpc3RvcnkubWludCA9IG91dHB1dC5wYXJzZWQuaW5mby5taW50O1xuICAgICAgaGlzdG9yeS5taW50QXV0aG9yaXR5ID0gb3V0cHV0LnBhcnNlZC5pbmZvLm1pbnRBdXRob3JpdHk7XG4gICAgICBoaXN0b3J5LnRva2VuQW1vdW50ID0gb3V0cHV0LnBhcnNlZC5pbmZvLnRva2VuQW1vdW50O1xuICAgICAgaGlzdG9yeS5hY2NvdW50ID0gb3V0cHV0LnBhcnNlZC5pbmZvLmFjY291bnQgYXMgc3RyaW5nO1xuICAgICAgaGlzdG9yeS50eXBlID0gb3V0cHV0LnByb2dyYW07XG4gICAgICBoaXN0b3J5LmRhdGVUaW1lID0gY29udmVydFRpbWVzdGFtcFRvRGF0ZVRpbWUobWV0YS5ibG9ja1RpbWUgYXMgbnVtYmVyKTtcbiAgICAgIGhpc3Rvcnkuc2lnID0gbWV0YS50cmFuc2FjdGlvbi5zaWduYXR1cmVzWzBdO1xuICAgICAgaGlzdG9yeS5pbm5lckluc3RydWN0aW9uID0gZmFsc2U7XG4gICAgICBpZiAoXG4gICAgICAgIG1ldGEubWV0YT8uaW5uZXJJbnN0cnVjdGlvbnMgJiZcbiAgICAgICAgbWV0YS5tZXRhPy5pbm5lckluc3RydWN0aW9ucy5sZW5ndGggIT09IDBcbiAgICAgICkge1xuICAgICAgICAvLyBpbm5lciBpbnN0cnVjdGlvbnNcbiAgICAgICAgaGlzdG9yeS5pbm5lckluc3RydWN0aW9uID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoaXN0b3J5O1xuICAgIH07XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBJbmZyYU91dHB1dCwgT3B0aW9uLCBVc2VyT3V0cHV0IH0gZnJvbSAnfi90eXBlcy9jb252ZXJ0ZXInO1xuXG5leHBvcnQgbmFtZXNwYWNlIENvbnZlcnRlciB7XG4gIGV4cG9ydCBuYW1lc3BhY2UgVXNlcyB7XG4gICAgZXhwb3J0IGNvbnN0IGludG9Vc2VyU2lkZSA9IChcbiAgICAgIG91dHB1dDogT3B0aW9uPEluZnJhT3V0cHV0LlVzZXM+LFxuICAgICk6IFVzZXJPdXRwdXQuVXNlcyB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICBpZiAoIW91dHB1dCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9O1xuICB9XG59XG4iLCAiaW1wb3J0IHsgQ29udmVydGVyIGFzIF9DcmVhdG9ycyB9IGZyb20gJy4vY3JlYXRvcnMnO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIF9Vc2VzIH0gZnJvbSAnLi91c2VzJztcbmltcG9ydCB7XG4gIEluZnJhSW5wdXQsXG4gIEluZnJhT3V0cHV0LFxuICBVc2VySW5wdXQsXG4gIFVzZXJPdXRwdXQsXG59IGZyb20gJ34vdHlwZXMvY29udmVydGVyJztcblxuaW1wb3J0IHsgY29udmVydFRpbWVzdGFtcFRvRGF0ZVRpbWUgfSBmcm9tICd+L3NoYXJlZCc7XG5leHBvcnQgbmFtZXNwYWNlIENvbnZlcnRlciB7XG4gIGV4cG9ydCBuYW1lc3BhY2UgVG9rZW5NZXRhZGF0YSB7XG4gICAgZXhwb3J0IGNvbnN0IGludG9JbmZyYVNpZGUgPSAoXG4gICAgICBpbnB1dDogVXNlcklucHV0LlRva2VuTWV0YWRhdGEsXG4gICAgICB1cmk6IHN0cmluZyxcbiAgICAgIHNlbGxlckZlZUJhc2lzUG9pbnRzOiBudW1iZXIsXG4gICAgKTogSW5mcmFJbnB1dC5NZXRhcGxleERhdGFWMiA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBpbnB1dC5uYW1lLFxuICAgICAgICBzeW1ib2w6IGlucHV0LnN5bWJvbCxcbiAgICAgICAgdXJpLFxuICAgICAgICBzZWxsZXJGZWVCYXNpc1BvaW50cyxcbiAgICAgICAgY3JlYXRvcnM6IF9DcmVhdG9ycy5DcmVhdG9ycy5pbnRvSW5mcmFTaWRlKGlucHV0LmNyZWF0b3JzKSxcbiAgICAgICAgY29sbGVjdGlvbjogbnVsbCxcbiAgICAgICAgdXNlczogaW5wdXQudXNlcyB8fCBudWxsLFxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgZXhwb3J0IGNvbnN0IGludG9Vc2VyU2lkZSA9IChcbiAgICAgIG91dHB1dDogSW5mcmFPdXRwdXQuT25jaGFpbkFuZE9mZmNoYWluLFxuICAgICAgdG9rZW5BbW91bnQ6IHN0cmluZyxcbiAgICApOiBVc2VyT3V0cHV0LlRva2VuTWV0YWRhdGEgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWludDogb3V0cHV0Lm9uY2hhaW4ubWludC50b1N0cmluZygpLFxuICAgICAgICByb3lhbHR5OiBvdXRwdXQub25jaGFpbi5kYXRhLnNlbGxlckZlZUJhc2lzUG9pbnRzLFxuICAgICAgICBuYW1lOiBkZWxldGVOdWxsU3RyaW5ncyhvdXRwdXQub25jaGFpbi5kYXRhLm5hbWUpLFxuICAgICAgICBzeW1ib2w6IGRlbGV0ZU51bGxTdHJpbmdzKG91dHB1dC5vbmNoYWluLmRhdGEuc3ltYm9sKSxcbiAgICAgICAgdG9rZW5BbW91bnQ6IHRva2VuQW1vdW50LFxuICAgICAgICB1cmk6IGRlbGV0ZU51bGxTdHJpbmdzKG91dHB1dC5vbmNoYWluLmRhdGEudXJpKSxcbiAgICAgICAgY3JlYXRvcnM6IF9DcmVhdG9ycy5DcmVhdG9ycy5pbnRvVXNlclNpZGUob3V0cHV0Lm9uY2hhaW4uZGF0YS5jcmVhdG9ycyksXG4gICAgICAgIHVzZXM6IF9Vc2VzLlVzZXMuaW50b1VzZXJTaWRlKG91dHB1dC5vbmNoYWluLnVzZXMpLFxuICAgICAgICBkYXRlVGltZTogY29udmVydFRpbWVzdGFtcFRvRGF0ZVRpbWUob3V0cHV0Lm9mZmNoYWluLmNyZWF0ZWRfYXQpLFxuICAgICAgICBvZmZjaGFpbjogb3V0cHV0Lm9mZmNoYWluLFxuICAgICAgfTtcbiAgICB9O1xuICAgIC8vIGRlbGV0ZSBOVUxMKDB4MDApIHN0cmluZ3MgZnVuY3Rpb25cbiAgICBleHBvcnQgY29uc3QgZGVsZXRlTnVsbFN0cmluZ3MgPSAoc3RyOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXDAvZywgJycpO1xuICAgIH07XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBDb252ZXJ0ZXIgYXMgX0NvbGxlY3Rpb24gfSBmcm9tICcuL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIF9DcmVhdG9ycyB9IGZyb20gJy4vY3JlYXRvcnMnO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIF9Vc2VzIH0gZnJvbSAnLi91c2VzJztcbmltcG9ydCB7IENvbnZlcnRlciBhcyBfVG9rZW4gfSBmcm9tICcuL3Rva2VuLW1ldGFkYXRhJztcbmltcG9ydCB7XG4gIEluZnJhSW5wdXQsXG4gIEluZnJhT3V0cHV0LFxuICBVc2VySW5wdXQsXG4gIFVzZXJPdXRwdXQsXG59IGZyb20gJ34vdHlwZXMvY29udmVydGVyJztcblxuaW1wb3J0IHsgY29udmVydFRpbWVzdGFtcFRvRGF0ZVRpbWUgfSBmcm9tICd+L3NoYXJlZCc7XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ29udmVydGVyIHtcbiAgZXhwb3J0IG5hbWVzcGFjZSBOZnRNZXRhZGF0YSB7XG4gICAgZXhwb3J0IGNvbnN0IGludG9JbmZyYVNpZGUgPSAoXG4gICAgICBpbnB1dDogVXNlcklucHV0Lk5mdE1ldGFkYXRhLFxuICAgICAgdXJpOiBzdHJpbmcsXG4gICAgICBzZWxsZXJGZWVCYXNpc1BvaW50czogbnVtYmVyLFxuICAgICk6IEluZnJhSW5wdXQuTWV0YXBsZXhEYXRhVjIgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogaW5wdXQubmFtZSxcbiAgICAgICAgc3ltYm9sOiBpbnB1dC5zeW1ib2wsXG4gICAgICAgIHVyaSxcbiAgICAgICAgc2VsbGVyRmVlQmFzaXNQb2ludHMsXG4gICAgICAgIGNyZWF0b3JzOiBfQ3JlYXRvcnMuQ3JlYXRvcnMuaW50b0luZnJhU2lkZShpbnB1dC5jcmVhdG9ycyksXG4gICAgICAgIGNvbGxlY3Rpb246IF9Db2xsZWN0aW9uLkNvbGxlY3Rpb24uaW50b0luZnJhU2lkZShpbnB1dC5jb2xsZWN0aW9uKSxcbiAgICAgICAgdXNlczogaW5wdXQudXNlcyB8fCBudWxsLFxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgZXhwb3J0IGNvbnN0IGludG9Vc2VyU2lkZSA9IChcbiAgICAgIG91dHB1dDogSW5mcmFPdXRwdXQuT25jaGFpbkFuZE9mZmNoYWluLFxuICAgICAgdG9rZW5BbW91bnQ6IHN0cmluZyxcbiAgICApOiBVc2VyT3V0cHV0Lk5mdE1ldGFkYXRhID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1pbnQ6IG91dHB1dC5vbmNoYWluLm1pbnQudG9TdHJpbmcoKSxcbiAgICAgICAgdXBkYXRlQXV0aG9yaXR5OiBvdXRwdXQub25jaGFpbi51cGRhdGVBdXRob3JpdHkudG9TdHJpbmcoKSxcbiAgICAgICAgcm95YWx0eTogb3V0cHV0Lm9uY2hhaW4uZGF0YS5zZWxsZXJGZWVCYXNpc1BvaW50cyxcbiAgICAgICAgbmFtZTogX1Rva2VuLlRva2VuTWV0YWRhdGEuZGVsZXRlTnVsbFN0cmluZ3Mob3V0cHV0Lm9uY2hhaW4uZGF0YS5uYW1lKSxcbiAgICAgICAgc3ltYm9sOiBfVG9rZW4uVG9rZW5NZXRhZGF0YS5kZWxldGVOdWxsU3RyaW5ncyhcbiAgICAgICAgICBvdXRwdXQub25jaGFpbi5kYXRhLnN5bWJvbCxcbiAgICAgICAgKSxcbiAgICAgICAgdG9rZW5BbW91bnQ6IHRva2VuQW1vdW50LFxuICAgICAgICB1cmk6IF9Ub2tlbi5Ub2tlbk1ldGFkYXRhLmRlbGV0ZU51bGxTdHJpbmdzKG91dHB1dC5vbmNoYWluLmRhdGEudXJpKSxcbiAgICAgICAgaXNNdXRhYmxlOiBvdXRwdXQub25jaGFpbi5pc011dGFibGUsXG4gICAgICAgIHByaW1hcnlTYWxlSGFwcGVuZWQ6IG91dHB1dC5vbmNoYWluLnByaW1hcnlTYWxlSGFwcGVuZWQsXG4gICAgICAgIGNyZWF0b3JzOiBfQ3JlYXRvcnMuQ3JlYXRvcnMuaW50b1VzZXJTaWRlKG91dHB1dC5vbmNoYWluLmRhdGEuY3JlYXRvcnMpLFxuICAgICAgICBlZGl0aW9uTm9uY2U6IG91dHB1dC5vbmNoYWluLmVkaXRpb25Ob25jZSxcbiAgICAgICAgY29sbGVjdGlvbjogX0NvbGxlY3Rpb24uQ29sbGVjdGlvbi5pbnRvVXNlclNpZGUoXG4gICAgICAgICAgb3V0cHV0Lm9uY2hhaW4uY29sbGVjdGlvbixcbiAgICAgICAgKSxcbiAgICAgICAgdXNlczogX1VzZXMuVXNlcy5pbnRvVXNlclNpZGUob3V0cHV0Lm9uY2hhaW4udXNlcyksXG4gICAgICAgIGRhdGVUaW1lOiBjb252ZXJ0VGltZXN0YW1wVG9EYXRlVGltZShvdXRwdXQub2ZmY2hhaW4uY3JlYXRlZF9hdCksXG4gICAgICAgIG9mZmNoYWluOiBvdXRwdXQub2ZmY2hhaW4sXG4gICAgICB9O1xuICAgIH07XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBvdmVyd3JpdGVPYmplY3QsIFJlc3VsdCB9IGZyb20gJ34vc2hhcmVkJztcbmltcG9ydCB7IFNlY3JldCB9IGZyb20gJ34vdHlwZXMvYWNjb3VudCc7XG5pbXBvcnQgeyBJbmZyYUlucHV0LCBVc2VySW5wdXQgfSBmcm9tICd+L3R5cGVzL2NvbnZlcnRlcic7XG5pbXBvcnQgeyBGaWxlVHlwZSwgU3RvcmFnZVR5cGUgfSBmcm9tICd+L3R5cGVzL3N0b3JhZ2UnO1xuXG5leHBvcnQgbmFtZXNwYWNlIENvbnZlcnRlciB7XG4gIGV4cG9ydCBuYW1lc3BhY2UgUHJvcGVydGllcyB7XG4gICAgZXhwb3J0IGNvbnN0IGludG9JbmZyYVNpZGUgPSBhc3luYyAoXG4gICAgICBpbnB1dDogVXNlcklucHV0LlByb3BlcnRpZXMgfCB1bmRlZmluZWQsXG4gICAgICBjYWxsYmFja0Z1bmM6IChcbiAgICAgICAgZmlsZVBhdGg6IEZpbGVUeXBlLFxuICAgICAgICBzdG9yYWdlVHlwZTogU3RvcmFnZVR5cGUsXG4gICAgICAgIGZlZVBheWVyPzogU2VjcmV0LFxuICAgICAgKSA9PiBQcm9taXNlPFJlc3VsdDxzdHJpbmcsIEVycm9yPj4sXG4gICAgICBzdG9yYWdlVHlwZTogU3RvcmFnZVR5cGUsXG4gICAgICBmZWVQYXllcj86IFNlY3JldCxcbiAgICApOiBQcm9taXNlPEluZnJhSW5wdXQuUHJvcGVydGllcz4gPT4ge1xuICAgICAgaWYgKCFpbnB1dCB8fCAhaW5wdXQuZmlsZXMpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmaWxlcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICBpbnB1dC5maWxlcy5tYXAoYXN5bmMgKGZpbGUpID0+IHtcbiAgICAgICAgICBpZiAoIWZpbGUuZmlsZVBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgY2FsbGJhY2tGdW5jKGZpbGUuZmlsZVBhdGgsIHN0b3JhZ2VUeXBlLCBmZWVQYXllcik7XG4gICAgICAgICAgaWYgKHJlcy5pc0Vycikge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IocmVzLmVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gb3ZlcndyaXRlT2JqZWN0KGZpbGUsIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZXhpc3RzS2V5OiAnZmlsZVBhdGgnLFxuICAgICAgICAgICAgICB3aWxsOiB7IGtleTogJ3VyaScsIHZhbHVlOiByZXMudmFsdWUgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSk7XG4gICAgICAgIH0pLFxuICAgICAgKTtcbiAgICAgIHJldHVybiB7IC4uLmlucHV0LCBmaWxlcyB9IGFzIEluZnJhSW5wdXQuUHJvcGVydGllcztcbiAgICB9O1xuICB9XG59XG4iLCAiZXhwb3J0IG5hbWVzcGFjZSBDb252ZXJ0ZXIge1xuICBleHBvcnQgbmFtZXNwYWNlIFJveWFsdHkge1xuICAgIGV4cG9ydCBjb25zdCBUSFJFU0hPTEQgPSAxMDA7XG4gICAgZXhwb3J0IGNvbnN0IGludG9JbmZyYVNpZGUgPSAocGVyY2VudGFnZTogbnVtYmVyKSA9PiB7XG4gICAgICByZXR1cm4gcGVyY2VudGFnZSAqIFRIUkVTSE9MRDtcbiAgICB9O1xuICB9XG59XG4iLCAiaW1wb3J0IHsgUGFyc2VkVHJhbnNhY3Rpb25XaXRoTWV0YSB9IGZyb20gJ0Bzb2xhbmEvd2ViMy5qcyc7XG5pbXBvcnQgeyBJbmZyYU91dHB1dCB9IGZyb20gJ34vdHlwZXMvY29udmVydGVyJztcbmltcG9ydCB7IFBvc3RUb2tlbkFjY291bnQgfSBmcm9tICd+L3R5cGVzL3RyYW5zYWN0aW9uLWZpbHRlcic7XG5pbXBvcnQgeyBIaXN0b3J5IH0gZnJvbSAnfi90eXBlcy9oaXN0b3J5JztcbmltcG9ydCB7IGNvbnZlcnRUaW1lc3RhbXBUb0RhdGVUaW1lIH0gZnJvbSAnfi9zaGFyZWQnO1xuXG5leHBvcnQgbmFtZXNwYWNlIENvbnZlcnRlciB7XG4gIGV4cG9ydCBuYW1lc3BhY2UgVHJhbnNmZXJDaGVja2VkIHtcbiAgICBleHBvcnQgY29uc3QgaW50b1VzZXJTaWRlID0gKFxuICAgICAgb3V0cHV0OiBJbmZyYU91dHB1dC5UcmFuc2ZlckNoZWNrZWQsXG4gICAgICBtZXRhOiBQYXJzZWRUcmFuc2FjdGlvbldpdGhNZXRhLFxuICAgICAgbWFwcGluZ1Rva2VuQWNjb3VudD86IFBvc3RUb2tlbkFjY291bnRbXSxcbiAgICApOiBIaXN0b3J5IHwgdW5kZWZpbmVkID0+IHtcbiAgICAgIGNvbnN0IGhpc3Rvcnk6IEhpc3RvcnkgPSB7fTtcblxuICAgICAgaWYgKG1hcHBpbmdUb2tlbkFjY291bnQpIHtcbiAgICAgICAgY29uc3QgZm91bmRTb3VyY2UgPSBtYXBwaW5nVG9rZW5BY2NvdW50LmZpbmQoXG4gICAgICAgICAgKG0pID0+IG0uYWNjb3VudCA9PT0gb3V0cHV0LnBhcnNlZC5pbmZvLnNvdXJjZSxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZm91bmREZXN0ID0gbWFwcGluZ1Rva2VuQWNjb3VudC5maW5kKFxuICAgICAgICAgIChtKSA9PiBtLmFjY291bnQgPT09IG91dHB1dC5wYXJzZWQuaW5mby5kZXN0aW5hdGlvbixcbiAgICAgICAgKTtcbiAgICAgICAgZm91bmRTb3VyY2UgJiYgKGhpc3Rvcnkuc291cmNlID0gZm91bmRTb3VyY2Uub3duZXIpO1xuICAgICAgICBmb3VuZERlc3QgJiYgKGhpc3RvcnkuZGVzdGluYXRpb24gPSBmb3VuZERlc3Qub3duZXIpO1xuICAgICAgfVxuXG4gICAgICBoaXN0b3J5LnRva2VuQW1vdW50ID0gb3V0cHV0LnBhcnNlZC5pbmZvLnRva2VuQW1vdW50O1xuICAgICAgaGlzdG9yeS5taW50ID0gb3V0cHV0LnBhcnNlZC5pbmZvLm1pbnQ7XG4gICAgICBoaXN0b3J5Lm11bHRpc2lnQXV0aG9yaXR5ID0gb3V0cHV0LnBhcnNlZC5pbmZvLm11bHRpc2lnQXV0aG9yaXR5O1xuICAgICAgaGlzdG9yeS5zaWduZXJzID0gb3V0cHV0LnBhcnNlZC5pbmZvLnNpZ25lcnM7XG4gICAgICBoaXN0b3J5LnR5cGUgPSBvdXRwdXQucHJvZ3JhbTtcbiAgICAgIGhpc3RvcnkuZGF0ZVRpbWUgPSBjb252ZXJ0VGltZXN0YW1wVG9EYXRlVGltZShtZXRhLmJsb2NrVGltZSBhcyBudW1iZXIpO1xuICAgICAgaGlzdG9yeS5zaWcgPSBtZXRhLnRyYW5zYWN0aW9uLnNpZ25hdHVyZXNbMF07XG4gICAgICBoaXN0b3J5LmlubmVySW5zdHJ1Y3Rpb24gPSBmYWxzZTtcblxuICAgICAgLy8gaW5uZXIgaW5zdHJ1Y3Rpb25zXG4gICAgICBpZiAoXG4gICAgICAgIG1ldGEubWV0YT8uaW5uZXJJbnN0cnVjdGlvbnMgJiZcbiAgICAgICAgbWV0YS5tZXRhPy5pbm5lckluc3RydWN0aW9ucy5sZW5ndGggIT09IDBcbiAgICAgICkge1xuICAgICAgICBoaXN0b3J5LmlubmVySW5zdHJ1Y3Rpb24gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaGlzdG9yeTtcbiAgICB9O1xuICB9XG59XG4iLCAiaW1wb3J0IHsgUGFyc2VkVHJhbnNhY3Rpb25XaXRoTWV0YSB9IGZyb20gJ0Bzb2xhbmEvd2ViMy5qcyc7XG5pbXBvcnQgeyBJbmZyYU91dHB1dCB9IGZyb20gJ34vdHlwZXMvY29udmVydGVyJztcbmltcG9ydCB7IEhpc3RvcnkgfSBmcm9tICd+L3R5cGVzL2hpc3RvcnknO1xuaW1wb3J0IHsgY29udmVydFRpbWVzdGFtcFRvRGF0ZVRpbWUgfSBmcm9tICd+L3NoYXJlZCc7XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ29udmVydGVyIHtcbiAgZXhwb3J0IG5hbWVzcGFjZSBUcmFuc2ZlciB7XG4gICAgZXhwb3J0IGNvbnN0IGludG9Vc2VyU2lkZSA9IChcbiAgICAgIG91dHB1dDogSW5mcmFPdXRwdXQuVHJhbnNmZXIsXG4gICAgICBtZXRhOiBQYXJzZWRUcmFuc2FjdGlvbldpdGhNZXRhLFxuICAgICk6IEhpc3RvcnkgfCB1bmRlZmluZWQgPT4ge1xuICAgICAgY29uc3QgaGlzdG9yeTogSGlzdG9yeSA9IHt9O1xuXG4gICAgICAvLyB2YWxpZGF0aW9uIGNoZWNrXG4gICAgICBpZiAoIW91dHB1dC5wYXJzZWQuaW5mby5kZXN0aW5hdGlvbiB8fCAhb3V0cHV0LnBhcnNlZC5pbmZvLmxhbXBvcnRzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaGlzdG9yeS5zb3VyY2UgPSBvdXRwdXQucGFyc2VkLmluZm8uc291cmNlO1xuICAgICAgaGlzdG9yeS5kZXN0aW5hdGlvbiA9IG91dHB1dC5wYXJzZWQuaW5mby5kZXN0aW5hdGlvbjtcbiAgICAgIGhpc3Rvcnkuc29sID0gb3V0cHV0LnBhcnNlZC5pbmZvLmxhbXBvcnRzPy50b1NvbCgpLnRvU3RyaW5nKCk7XG4gICAgICBoaXN0b3J5LnR5cGUgPSBvdXRwdXQucHJvZ3JhbTtcbiAgICAgIGhpc3RvcnkuZGF0ZVRpbWUgPSBjb252ZXJ0VGltZXN0YW1wVG9EYXRlVGltZShtZXRhLmJsb2NrVGltZSBhcyBudW1iZXIpO1xuICAgICAgaGlzdG9yeS5zaWcgPSBtZXRhLnRyYW5zYWN0aW9uLnNpZ25hdHVyZXNbMF07XG4gICAgICBoaXN0b3J5LmlubmVySW5zdHJ1Y3Rpb24gPSBmYWxzZTtcblxuICAgICAgLy8gaW5uZXIgaW5zdHJ1Y3Rpb25zXG4gICAgICBpZiAoXG4gICAgICAgIG1ldGEubWV0YT8uaW5uZXJJbnN0cnVjdGlvbnMgJiZcbiAgICAgICAgbWV0YS5tZXRhPy5pbm5lckluc3RydWN0aW9ucy5sZW5ndGggIT09IDBcbiAgICAgICkge1xuICAgICAgICBoaXN0b3J5LmlubmVySW5zdHJ1Y3Rpb24gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaGlzdG9yeTtcbiAgICB9O1xuICB9XG59XG4iLCAiaW1wb3J0IHsgQ29udmVydGVyIGFzIENvbGxlY3Rpb24gfSBmcm9tICcuL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIENyZWF0b3JzIH0gZnJvbSAnLi9jcmVhdG9ycyc7XG5pbXBvcnQgeyBDb252ZXJ0ZXIgYXMgTWVtbyB9IGZyb20gJy4vbWVtbyc7XG5pbXBvcnQgeyBDb252ZXJ0ZXIgYXMgTWludCB9IGZyb20gJy4vbWludCc7XG5pbXBvcnQgeyBDb252ZXJ0ZXIgYXMgTmZ0TWV0YWRhdGEgfSBmcm9tICcuL25mdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBDb252ZXJ0ZXIgYXMgUHJvcGVydGllcyB9IGZyb20gJy4vcHJvcGVydGllcyc7XG5pbXBvcnQgeyBDb252ZXJ0ZXIgYXMgUm95YWx0eSB9IGZyb20gJy4vcm95YWx0eSc7XG5pbXBvcnQgeyBDb252ZXJ0ZXIgYXMgVG9rZW5NZXRhZGF0YSB9IGZyb20gJy4vdG9rZW4tbWV0YWRhdGEnO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIFRyYW5zZmVyQ2hlY2tlZCB9IGZyb20gJy4vdHJhbnNmZXItY2hlY2tlZCc7XG5pbXBvcnQgeyBDb252ZXJ0ZXIgYXMgVHJhbnNmZXIgfSBmcm9tICcuL3RyYW5zZmVyJztcbmltcG9ydCB7IENvbnZlcnRlciBhcyBVc2VzIH0gZnJvbSAnLi91c2VzJztcblxuZXhwb3J0IGNvbnN0IENvbnZlcnRlciA9IHtcbiAgLi4uQ29sbGVjdGlvbixcbiAgLi4uQ3JlYXRvcnMsXG4gIC4uLk1lbW8sXG4gIC4uLk1pbnQsXG4gIC4uLk5mdE1ldGFkYXRhLFxuICAuLi5Qcm9wZXJ0aWVzLFxuICAuLi5Sb3lhbHR5LFxuICAuLi5Ub2tlbk1ldGFkYXRhLFxuICAuLi5UcmFuc2ZlckNoZWNrZWQsXG4gIC4uLlRyYW5zZmVyLFxuICAuLi5Vc2VzLFxufTtcbiIsICJpbXBvcnQgeyBSZXN1bHQsIFRyeSB9IGZyb20gJ34vc2hhcmVkJztcbmltcG9ydCB7IENvbnZlcnRlciB9IGZyb20gJ34vY29udmVydGVyJztcbmltcG9ydCB7IEluZnJhSW5wdXQsIFVzZXJJbnB1dCB9IGZyb20gJ34vdHlwZXMvY29udmVydGVyJztcbmltcG9ydCB7IERldGFpbHMsIExpbWl0IH0gZnJvbSAnfi90eXBlcy92YWxpZGF0b3InO1xuXG5leHBvcnQgbmFtZXNwYWNlIFZhbGlkYXRvciB7XG4gIGV4cG9ydCBuYW1lc3BhY2UgTWVzc2FnZSB7XG4gICAgZXhwb3J0IGNvbnN0IFNVQ0NFU1MgPSAnc3VjY2Vzcyc7XG4gICAgZXhwb3J0IGNvbnN0IFNNQUxMX05VTUJFUiA9ICd0b28gc21hbGwnO1xuICAgIGV4cG9ydCBjb25zdCBCSUdfTlVNQkVSID0gJ3RvbyBiaWcnO1xuICAgIGV4cG9ydCBjb25zdCBMT05HX0xFTkdUSCA9ICd0b28gbG9uZyc7XG4gICAgZXhwb3J0IGNvbnN0IEVNUFRZID0gJ2ludmFsaWQgZW1wdHkgdmFsdWUnO1xuICAgIGV4cG9ydCBjb25zdCBJTlZBTElEX1VSTCA9ICdpbnZhbGlkIHVybCc7XG4gICAgZXhwb3J0IGNvbnN0IE9OTFlfTk9ERV9KUyA9ICdgc3RyaW5nYCB0eXBlIGlzIG9ubHkgTm9kZS5qcyc7XG4gIH1cblxuICBleHBvcnQgY29uc3QgTkFNRV9MRU5HVEggPSAzMjtcbiAgZXhwb3J0IGNvbnN0IFNZTUJPTF9MRU5HVEggPSAxMDtcbiAgZXhwb3J0IGNvbnN0IFVSTF9MRU5HVEggPSAyMDA7XG4gIGV4cG9ydCBjb25zdCBST1lBTFRZX01BWCA9IDEwMDtcbiAgZXhwb3J0IGNvbnN0IFNFTExFUl9GRUVfQkFTSVNfUE9JTlRTX01BWCA9IDEwMDAwO1xuICBleHBvcnQgY29uc3QgUk9ZQUxUWV9NSU4gPSAwO1xuXG4gIGV4cG9ydCBjb25zdCBpc1JveWFsdHkgPSAoXG4gICAgcm95YWx0eTogbnVtYmVyLFxuICApOiBSZXN1bHQ8c3RyaW5nLCBWYWxpZGF0b3JFcnJvcj4gPT4ge1xuICAgIHJldHVybiBUcnkoKCkgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gJ3JveWFsdHknO1xuICAgICAgaWYgKHJveWFsdHkgIT09IDAgJiYgIXJveWFsdHkpIHtcbiAgICAgICAgdGhyb3cgY3JlYXRlRXJyb3Ioa2V5LCBNZXNzYWdlLkVNUFRZLCByb3lhbHR5KTtcbiAgICAgIH1cbiAgICAgIGlmIChyb3lhbHR5IDwgUk9ZQUxUWV9NSU4pIHtcbiAgICAgICAgdGhyb3cgY3JlYXRlRXJyb3Ioa2V5LCBNZXNzYWdlLlNNQUxMX05VTUJFUiwgcm95YWx0eSwge1xuICAgICAgICAgIHRocmVzaG9sZDogUk9ZQUxUWV9NSU4sXG4gICAgICAgICAgY29uZGl0aW9uOiAndW5kZXJNaW4nLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAocm95YWx0eSA+IFJPWUFMVFlfTUFYKSB7XG4gICAgICAgIHRocm93IGNyZWF0ZUVycm9yKGtleSwgTWVzc2FnZS5CSUdfTlVNQkVSLCByb3lhbHR5LCB7XG4gICAgICAgICAgdGhyZXNob2xkOiBST1lBTFRZX01BWCxcbiAgICAgICAgICBjb25kaXRpb246ICdvdmVyTWF4JyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gTWVzc2FnZS5TVUNDRVNTO1xuICAgIH0pO1xuICB9O1xuXG4gIGV4cG9ydCBjb25zdCBpc1NlbGxlckZlZUJhc2lzUG9pbnRzID0gKFxuICAgIHJveWFsdHk6IG51bWJlcixcbiAgKTogUmVzdWx0PHN0cmluZywgVmFsaWRhdG9yRXJyb3I+ID0+IHtcbiAgICByZXR1cm4gVHJ5KCgpID0+IHtcbiAgICAgIGNvbnN0IGtleSA9ICdzZWxsZXJGZWVCYXNpc1BvaW50cy9zZWxsZXJfZmVlX2Jhc2lzX3BvaW50cyc7XG4gICAgICBpZiAocm95YWx0eSAhPT0gMCAmJiAhcm95YWx0eSkge1xuICAgICAgICB0aHJvdyBjcmVhdGVFcnJvcihrZXksIE1lc3NhZ2UuRU1QVFksIHJveWFsdHkpO1xuICAgICAgfVxuICAgICAgaWYgKHJveWFsdHkgPCBST1lBTFRZX01JTikge1xuICAgICAgICB0aHJvdyBjcmVhdGVFcnJvcihrZXksIE1lc3NhZ2UuU01BTExfTlVNQkVSLCByb3lhbHR5LCB7XG4gICAgICAgICAgdGhyZXNob2xkOiBST1lBTFRZX01JTixcbiAgICAgICAgICBjb25kaXRpb246ICd1bmRlck1pbicsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChyb3lhbHR5ID4gUk9ZQUxUWV9NQVggKiBDb252ZXJ0ZXIuUm95YWx0eS5USFJFU0hPTEQpIHtcbiAgICAgICAgdGhyb3cgY3JlYXRlRXJyb3Ioa2V5LCBNZXNzYWdlLkJJR19OVU1CRVIsIHJveWFsdHksIHtcbiAgICAgICAgICB0aHJlc2hvbGQ6IFNFTExFUl9GRUVfQkFTSVNfUE9JTlRTX01BWCxcbiAgICAgICAgICBjb25kaXRpb246ICdvdmVyTWF4JyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gTWVzc2FnZS5TVUNDRVNTO1xuICAgIH0pO1xuICB9O1xuXG4gIGV4cG9ydCBjb25zdCBpc05hbWUgPSAobmFtZTogc3RyaW5nKTogUmVzdWx0PHN0cmluZywgVmFsaWRhdG9yRXJyb3I+ID0+IHtcbiAgICByZXR1cm4gVHJ5KCgpID0+IHtcbiAgICAgIGNvbnN0IGtleSA9ICduYW1lJztcbiAgICAgIGlmICghbmFtZSkge1xuICAgICAgICB0aHJvdyBjcmVhdGVFcnJvcihrZXksIE1lc3NhZ2UuRU1QVFksIG5hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKGJ5dGVMZW5ndGgobmFtZSkgPiBOQU1FX0xFTkdUSCkge1xuICAgICAgICB0aHJvdyBjcmVhdGVFcnJvcihrZXksIE1lc3NhZ2UuTE9OR19MRU5HVEgsIG5hbWUsIHtcbiAgICAgICAgICB0aHJlc2hvbGQ6IE5BTUVfTEVOR1RILFxuICAgICAgICAgIGNvbmRpdGlvbjogJ292ZXJNYXgnLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBNZXNzYWdlLlNVQ0NFU1M7XG4gICAgfSk7XG4gIH07XG5cbiAgZXhwb3J0IGNvbnN0IGlzU3ltYm9sID0gKHN5bWJvbDogc3RyaW5nKTogUmVzdWx0PHN0cmluZywgVmFsaWRhdG9yRXJyb3I+ID0+IHtcbiAgICByZXR1cm4gVHJ5KCgpID0+IHtcbiAgICAgIGNvbnN0IGtleSA9ICdzeW1ib2wnO1xuICAgICAgaWYgKCFzeW1ib2wpIHtcbiAgICAgICAgdGhyb3cgY3JlYXRlRXJyb3Ioa2V5LCBNZXNzYWdlLkVNUFRZLCBzeW1ib2wpO1xuICAgICAgfVxuICAgICAgaWYgKGJ5dGVMZW5ndGgoc3ltYm9sKSA+IFNZTUJPTF9MRU5HVEgpIHtcbiAgICAgICAgdGhyb3cgY3JlYXRlRXJyb3Ioa2V5LCBNZXNzYWdlLkxPTkdfTEVOR1RILCBzeW1ib2wsIHtcbiAgICAgICAgICB0aHJlc2hvbGQ6IFNZTUJPTF9MRU5HVEgsXG4gICAgICAgICAgY29uZGl0aW9uOiAnb3Zlck1heCcsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE1lc3NhZ2UuU1VDQ0VTUztcbiAgICB9KTtcbiAgfTtcblxuICBleHBvcnQgY29uc3QgaXNJbWFnZVVybCA9IChpbWFnZTogc3RyaW5nKTogUmVzdWx0PHN0cmluZywgVmFsaWRhdG9yRXJyb3I+ID0+XG4gICAgaXNVcmlPckltYWdlKGltYWdlLCAnaW1hZ2UnKTtcblxuICBleHBvcnQgY29uc3QgY2hlY2tBbGwgPSA8XG4gICAgVCBleHRlbmRzIFBpY2tOZnRTdG9yYWdlIHwgUGlja05mdFN0b3JhZ2VNZXRhcGxleCB8IFBpY2tNZXRhcGxleCxcbiAgPihcbiAgICBtZXRhZGF0YTogVCxcbiAgKTogUmVzdWx0PHN0cmluZywgVmFsaWRhdG9yRXJyb3I+ID0+IHtcbiAgICByZXR1cm4gVHJ5KCgpID0+IHtcbiAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhtZXRhZGF0YSk7XG4gICAgICBjb25zdCByZXN1bHRzOiBEZXRhaWxzW10gPSBbXTtcbiAgICAgIGtleXMubWFwKChrZXkpID0+IHtcbiAgICAgICAgbGV0IHJlcyE6IFJlc3VsdDxzdHJpbmcsIFZhbGlkYXRvckVycm9yPjtcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICBjYXNlICdpbWFnZSc6XG4gICAgICAgICAgICBpZiAoa2V5IGluIG1ldGFkYXRhICYmIG1ldGFkYXRhLmltYWdlKSB7XG4gICAgICAgICAgICAgIHJlcyA9IGlzSW1hZ2VVcmwobWV0YWRhdGEuaW1hZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncm95YWx0eSc6XG4gICAgICAgICAgICBpZiAoa2V5IGluIG1ldGFkYXRhKSB7XG4gICAgICAgICAgICAgIHJlcyA9IGlzUm95YWx0eShtZXRhZGF0YS5yb3lhbHR5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3NlbGxlcl9mZWVfYmFzaXNfcG9pbnRzJzpcbiAgICAgICAgICAgIGlmIChrZXkgaW4gbWV0YWRhdGEgJiYgbWV0YWRhdGEuc2VsbGVyX2ZlZV9iYXNpc19wb2ludHMpIHtcbiAgICAgICAgICAgICAgcmVzID0gaXNTZWxsZXJGZWVCYXNpc1BvaW50cyhtZXRhZGF0YS5zZWxsZXJfZmVlX2Jhc2lzX3BvaW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdzZWxsZXJGZWVCYXNpc1BvaW50cyc6XG4gICAgICAgICAgICBpZiAoa2V5IGluIG1ldGFkYXRhKSB7XG4gICAgICAgICAgICAgIHJlcyA9IGlzU2VsbGVyRmVlQmFzaXNQb2ludHMobWV0YWRhdGEuc2VsbGVyRmVlQmFzaXNQb2ludHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnbmFtZSc6XG4gICAgICAgICAgICBpZiAobWV0YWRhdGEubmFtZSkge1xuICAgICAgICAgICAgICByZXMgPSBpc05hbWUobWV0YWRhdGEubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgICAgICAgaWYgKG1ldGFkYXRhLnN5bWJvbCkge1xuICAgICAgICAgICAgICByZXMgPSBpc1N5bWJvbChtZXRhZGF0YS5zeW1ib2wpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlcyAmJiByZXMuaXNFcnIpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2goLi4ucmVzLmVycm9yLmRldGFpbHMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChyZXN1bHRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9XG4gICAgICAgICAgJ0NhdWdodCBpbiB0aGUgdmFsaWRhdGlvbiBlcnJvcnMuIHNlZSBpbmZvcm1hdGlvbiBlLmc6IGVycjxWYWxpZGF0b3JFcnJvcj4uZGV0YWlscyc7XG4gICAgICAgIHRocm93IG5ldyBWYWxpZGF0b3JFcnJvcihtZXNzYWdlLCByZXN1bHRzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBNZXNzYWdlLlNVQ0NFU1M7XG4gICAgfSk7XG4gIH07XG5cbiAgdHlwZSBQaWNrTmZ0U3RvcmFnZSA9IFBpY2s8XG4gICAgSW5mcmFJbnB1dC5PZmZjaGFpbixcbiAgICAnbmFtZScgfCAnc3ltYm9sJyB8ICdpbWFnZScgfCAnc2VsbGVyX2ZlZV9iYXNpc19wb2ludHMnXG4gID47XG4gIHR5cGUgUGlja05mdFN0b3JhZ2VNZXRhcGxleCA9IFBpY2s8XG4gICAgVXNlcklucHV0Lk5mdE1ldGFkYXRhLFxuICAgICduYW1lJyB8ICdzeW1ib2wnIHwgJ3JveWFsdHknIHwgJ2ZpbGVQYXRoJ1xuICA+O1xuICB0eXBlIFBpY2tNZXRhcGxleCA9IFBpY2s8XG4gICAgSW5mcmFJbnB1dC5NZXRhcGxleERhdGFWMixcbiAgICAnbmFtZScgfCAnc3ltYm9sJyB8ICd1cmknIHwgJ3NlbGxlckZlZUJhc2lzUG9pbnRzJ1xuICA+O1xuXG4gIGNvbnN0IGJ5dGVMZW5ndGggPSAodmFsdWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgY29uc3QgdGV4dCA9IG5ldyBUZXh0RW5jb2RlcigpO1xuICAgIHJldHVybiB0ZXh0LmVuY29kZSh2YWx1ZSkubGVuZ3RoO1xuICB9O1xuXG4gIGNvbnN0IGNyZWF0ZUVycm9yID0gKFxuICAgIGtleTogc3RyaW5nLFxuICAgIG1lc3NhZ2U6IHN0cmluZyxcbiAgICBhY3R1YWw6IHN0cmluZyB8IG51bWJlcixcbiAgICBsaW1pdD86IExpbWl0LFxuICApOiBWYWxpZGF0b3JFcnJvciA9PiB7XG4gICAgbGV0IGVycm9yOiBWYWxpZGF0b3JFcnJvcjtcbiAgICBpZiAobGltaXQpIHtcbiAgICAgIGVycm9yID0gbmV3IFZhbGlkYXRvckVycm9yKG1lc3NhZ2UsIFt7IGtleSwgbWVzc2FnZSwgYWN0dWFsLCBsaW1pdCB9XSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9yID0gbmV3IFZhbGlkYXRvckVycm9yKG1lc3NhZ2UsIFt7IGtleSwgbWVzc2FnZSwgYWN0dWFsIH1dKTtcbiAgICB9XG4gICAgcmV0dXJuIGVycm9yO1xuICB9O1xuXG4gIGNvbnN0IGlzVXJpT3JJbWFnZSA9IChcbiAgICBpbWFnZU9yVXJpOiBzdHJpbmcsXG4gICAga2V5OiBzdHJpbmcsXG4gICk6IFJlc3VsdDxzdHJpbmcsIFZhbGlkYXRvckVycm9yPiA9PiB7XG4gICAgcmV0dXJuIFRyeSgoKSA9PiB7XG4gICAgICBpZiAoIWltYWdlT3JVcmkpIHtcbiAgICAgICAgdGhyb3cgY3JlYXRlRXJyb3Ioa2V5LCBNZXNzYWdlLkVNUFRZLCBpbWFnZU9yVXJpKTtcbiAgICAgIH1cbiAgICAgIGlmIChieXRlTGVuZ3RoKGltYWdlT3JVcmkpID4gVVJMX0xFTkdUSCkge1xuICAgICAgICB0aHJvdyBjcmVhdGVFcnJvcihrZXksIE1lc3NhZ2UuTE9OR19MRU5HVEgsIGltYWdlT3JVcmksIHtcbiAgICAgICAgICB0aHJlc2hvbGQ6IFVSTF9MRU5HVEgsXG4gICAgICAgICAgY29uZGl0aW9uOiAnb3Zlck1heCcsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKCEvaHR0cHM/OlxcL1xcL1stXy4hfipcXFxcKClhLXpBLVowLTk7PzomPSssJSNdKy9nLnRlc3QoaW1hZ2VPclVyaSkpIHtcbiAgICAgICAgdGhyb3cgY3JlYXRlRXJyb3Ioa2V5LCBNZXNzYWdlLklOVkFMSURfVVJMLCBpbWFnZU9yVXJpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBNZXNzYWdlLlNVQ0NFU1M7XG4gICAgfSk7XG4gIH07XG59XG5cbmV4cG9ydCBjbGFzcyBWYWxpZGF0b3JFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgZGV0YWlsczogRGV0YWlsc1tdO1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcsIGRldGFpbHM6IERldGFpbHNbXSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMuZGV0YWlscyA9IGRldGFpbHM7XG4gIH1cbn1cbiIsICJleHBvcnQgZW51bSBGaWx0ZXJUeXBlIHtcbiAgTWVtbyA9ICdtZW1vJyxcbiAgTWludCA9ICdtaW50JyxcbiAgT25seU1lbW8gPSAnb25seS1tZW1vJyxcbiAgVHJhbnNmZXIgPSAndHJhbnNmZXInLFxufVxuXG5leHBvcnQgZW51bSBNb2R1bGVOYW1lIHtcbiAgU29sTmF0aXZlID0gJ3N5c3RlbScsXG4gIFNwbFRva2VuID0gJ3NwbC10b2tlbicsXG59XG5cbmV4cG9ydCBjb25zdCBGaWx0ZXJPcHRpb25zID0ge1xuICBUcmFuc2Zlcjoge1xuICAgIHByb2dyYW06IFsnc3lzdGVtJywgJ3NwbC10b2tlbiddLFxuICAgIGFjdGlvbjogWyd0cmFuc2ZlcicsICd0cmFuc2ZlckNoZWNrZWQnXSxcbiAgfSxcbiAgTWVtbzoge1xuICAgIHByb2dyYW06IFsnc3BsLW1lbW8nXSxcbiAgICBhY3Rpb246IFsnKiddLFxuICB9LFxuICBNaW50OiB7XG4gICAgcHJvZ3JhbTogWydzcGwtdG9rZW4nXSxcbiAgICBhY3Rpb246IFsnbWludFRvJywgJ21pbnRUb0NoZWNrZWQnXSxcbiAgfSxcbn07XG5cbmV4cG9ydCB0eXBlIFBvc3RUb2tlbkFjY291bnQgPSB7XG4gIGFjY291bnQ6IHN0cmluZztcbiAgb3duZXI6IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFdpdGhNZW1vID0ge1xuICBzaWc6IHN0cmluZ1tdO1xuICBtZW1vOiBzdHJpbmc7XG59O1xuIiwgImltcG9ydCB7IFBhcnNlZFRyYW5zYWN0aW9uV2l0aE1ldGEgfSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuaW1wb3J0IHsgTm9kZSB9IGZyb20gJ34vbm9kZSc7XG5pbXBvcnQgeyBkZWJ1Z0xvZywgUmVzdWx0LCBzbGVlcCB9IGZyb20gJ34vc2hhcmVkJztcbmltcG9ydCB7IFB1YmtleSB9IGZyb20gJ34vdHlwZXMvYWNjb3VudCc7XG5pbXBvcnQgeyBIaXN0b3J5IH0gZnJvbSAnfi90eXBlcy9oaXN0b3J5JztcblxuZXhwb3J0IG5hbWVzcGFjZSBTaWduYXR1cmVzIHtcbiAgY29uc3QgcGFyc2VGb3JUcmFuc2FjdGlvbiA9IGFzeW5jIChcbiAgICBzaWduYXR1cmU6IHN0cmluZyxcbiAgKTogUHJvbWlzZTxQYXJzZWRUcmFuc2FjdGlvbldpdGhNZXRhPiA9PiB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgTm9kZS5nZXRDb25uZWN0aW9uKCkuZ2V0UGFyc2VkVHJhbnNhY3Rpb24oc2lnbmF0dXJlKTtcbiAgICBpZiAoIXJlcykge1xuICAgICAgcmV0dXJuIHt9IGFzIFBhcnNlZFRyYW5zYWN0aW9uV2l0aE1ldGE7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH07XG5cbiAgZXhwb3J0IGNvbnN0IGdldEZvckFkcmVzcyA9IGFzeW5jIChcbiAgICBwdWJrZXk6IFB1YmtleSxcbiAgICBwYXJzZXI6ICh0cmFuc2FjdGlvbjogUGFyc2VkVHJhbnNhY3Rpb25XaXRoTWV0YSkgPT4gSGlzdG9yeSB8IHVuZGVmaW5lZCxcbiAgICBjYWxsYmFjazogKGhpc3Rvcnk6IFJlc3VsdDxIaXN0b3J5W10sIEVycm9yPikgPT4gdm9pZCxcbiAgICBvcHRpb25zOiB7XG4gICAgICB3YWl0VGltZTogbnVtYmVyO1xuICAgICAgbmFycm93RG93bjogbnVtYmVyO1xuICAgIH0sXG4gICAgaGlzdG9yaWVzOiBIaXN0b3J5W10gPSBbXSxcbiAgKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGRlYnVnTG9nKCcjIG9wdGlvbnM6ICcsIG9wdGlvbnMpO1xuICAgICAgY29uc3QgdHJhbnNhY3Rpb25zID0gYXdhaXQgTm9kZS5nZXRDb25uZWN0aW9uKCkuZ2V0U2lnbmF0dXJlc0ZvckFkZHJlc3MoXG4gICAgICAgIHB1YmtleS50b1B1YmxpY0tleSgpLFxuICAgICAgICB7XG4gICAgICAgICAgbGltaXQ6IG9wdGlvbnMubmFycm93RG93bixcbiAgICAgICAgfSxcbiAgICAgICk7XG5cbiAgICAgIGRlYnVnTG9nKCcjIHRyYW5zYWN0aW9ucyBjb3VudDonLCB0cmFuc2FjdGlvbnMubGVuZ3RoKTtcblxuICAgICAgZm9yIChjb25zdCB0cmFuc2FjdGlvbiBvZiB0cmFuc2FjdGlvbnMpIHtcbiAgICAgICAgcGFyc2VGb3JUcmFuc2FjdGlvbih0cmFuc2FjdGlvbi5zaWduYXR1cmUpXG4gICAgICAgICAgLnRoZW4oKHNpZ25hdHVyZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGlzdG9yeSA9IHBhcnNlcihzaWduYXR1cmUpO1xuICAgICAgICAgICAgaWYgKGhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgaGlzdG9yaWVzLnB1c2goaGlzdG9yeSk7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKFJlc3VsdC5vayhoaXN0b3JpZXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaCgoZSkgPT4gY2FsbGJhY2soUmVzdWx0LmVycihlKSkpO1xuICAgICAgICBhd2FpdCBzbGVlcChvcHRpb25zLndhaXRUaW1lKTsgLy8gYXZvaWQgNDI5IGVycm9yXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICBjYWxsYmFjayhSZXN1bHQuZXJyKGUpKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iLCAiaW1wb3J0IHsgQ29udmVydGVyIH0gZnJvbSAnfi9jb252ZXJ0ZXInO1xuaW1wb3J0IHsgUGFyc2VkSW5zdHJ1Y3Rpb24sIFBhcnNlZFRyYW5zYWN0aW9uV2l0aE1ldGEgfSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuaW1wb3J0IHtcbiAgRmlsdGVyT3B0aW9ucyxcbiAgRmlsdGVyVHlwZSxcbiAgTW9kdWxlTmFtZSxcbiAgUG9zdFRva2VuQWNjb3VudCxcbn0gZnJvbSAnfi90eXBlcy90cmFuc2FjdGlvbi1maWx0ZXInO1xuaW1wb3J0IHsgSGlzdG9yeSB9IGZyb20gJ34vdHlwZXMvaGlzdG9yeSc7XG5pbXBvcnQgeyBkZWJ1Z0xvZyB9IGZyb20gJ34vc2hhcmVkJztcblxuZXhwb3J0IG5hbWVzcGFjZSBUcmFuc2FjdGlvbkZpbHRlciB7XG4gIGNvbnN0IGNyZWF0ZVBvc3RUb2tlbkFjY291bnRMaXN0ID0gKFxuICAgIHRyYW5zYWN0aW9uOiBQYXJzZWRUcmFuc2FjdGlvbldpdGhNZXRhLFxuICApOiBQb3N0VG9rZW5BY2NvdW50W10gPT4ge1xuICAgIGNvbnN0IHBvc3RUb2tlbkFjY291bnQ6IFBvc3RUb2tlbkFjY291bnRbXSA9IFtdO1xuXG4gICAgaWYgKE9iamVjdC5rZXlzKHRyYW5zYWN0aW9uKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBwb3N0VG9rZW5BY2NvdW50O1xuICAgIH1cbiAgICBjb25zdCBhY2NvdW50S2V5cyA9IHRyYW5zYWN0aW9uLnRyYW5zYWN0aW9uLm1lc3NhZ2UuYWNjb3VudEtleXMubWFwKCh0KSA9PlxuICAgICAgdC5wdWJrZXkudG9TdHJpbmcoKSxcbiAgICApO1xuXG4gICAgdHJhbnNhY3Rpb24ubWV0YT8ucG9zdFRva2VuQmFsYW5jZXM/LmZvckVhY2goKHQpID0+IHtcbiAgICAgIGlmIChhY2NvdW50S2V5c1t0LmFjY291bnRJbmRleF0gJiYgdC5vd25lcikge1xuICAgICAgICBjb25zdCB2ID0ge1xuICAgICAgICAgIGFjY291bnQ6IGFjY291bnRLZXlzW3QuYWNjb3VudEluZGV4XSxcbiAgICAgICAgICBvd25lcjogdC5vd25lcixcbiAgICAgICAgfTtcbiAgICAgICAgcG9zdFRva2VuQWNjb3VudC5wdXNoKHYpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBwb3N0VG9rZW5BY2NvdW50O1xuICB9O1xuXG4gIGV4cG9ydCBjb25zdCBpc1BhcnNlZEluc3RydWN0aW9uID0gKFxuICAgIGFyZzogdW5rbm93bixcbiAgKTogYXJnIGlzIFBhcnNlZEluc3RydWN0aW9uID0+IHtcbiAgICByZXR1cm4gYXJnICE9PSBudWxsICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmICdwYXJzZWQnIGluIGFyZztcbiAgfTtcblxuICBleHBvcnQgY29uc3QgcGFyc2UgPVxuICAgIChmaWx0ZXJUeXBlOiBGaWx0ZXJUeXBlLCBtb2R1bGVOYW1lOiBNb2R1bGVOYW1lKSA9PlxuICAgICh0eE1ldGE6IFBhcnNlZFRyYW5zYWN0aW9uV2l0aE1ldGEpOiBIaXN0b3J5IHwgdW5kZWZpbmVkID0+IHtcbiAgICAgIGxldCBoaXN0b3J5OiBIaXN0b3J5IHwgdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoXG4gICAgICAgIGZpbHRlclR5cGUgPT09IEZpbHRlclR5cGUuTWludCAmJlxuICAgICAgICBtb2R1bGVOYW1lID09PSBNb2R1bGVOYW1lLlNvbE5hdGl2ZVxuICAgICAgKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgIFwiVGhpcyBmaWx0ZXJUeXBlKCdGaWx0ZXJUeXBlLk1pbnQnKSBjYW4gbm90IHVzZSBmcm9tIFNvbE5hdGl2ZSBtb2R1bGVcIixcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0eE1ldGEgfHwgIXR4TWV0YS50cmFuc2FjdGlvbikge1xuICAgICAgICByZXR1cm4gaGlzdG9yeTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcG9zdFRva2VuQWNjb3VudCA9IGNyZWF0ZVBvc3RUb2tlbkFjY291bnRMaXN0KHR4TWV0YSk7XG4gICAgICB0eE1ldGEudHJhbnNhY3Rpb24ubWVzc2FnZS5pbnN0cnVjdGlvbnMuZm9yRWFjaCgoaW5zdHJ1Y3Rpb24pID0+IHtcbiAgICAgICAgaWYgKGlzUGFyc2VkSW5zdHJ1Y3Rpb24oaW5zdHJ1Y3Rpb24pKSB7XG4gICAgICAgICAgc3dpdGNoIChmaWx0ZXJUeXBlKSB7XG4gICAgICAgICAgICBjYXNlIEZpbHRlclR5cGUuTWVtbzoge1xuICAgICAgICAgICAgICBpZiAoRmlsdGVyT3B0aW9ucy5NZW1vLnByb2dyYW0uaW5jbHVkZXMoaW5zdHJ1Y3Rpb24ucHJvZ3JhbSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgaW5zdHJ1Y3Rpb25UcmFuc2ZlcjtcblxuICAgICAgICAgICAgICAgIC8vIGZldGNoICB0cmFuc2ZlciB0cmFuc2FjdGlvbiBmb3IgcmVsYXRpb25hbCBtZW1vXG4gICAgICAgICAgICAgICAgdHhNZXRhLnRyYW5zYWN0aW9uLm1lc3NhZ2UuaW5zdHJ1Y3Rpb25zLmZvckVhY2goXG4gICAgICAgICAgICAgICAgICAoaW5zdHJ1Y3Rpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgIGlzUGFyc2VkSW5zdHJ1Y3Rpb24oaW5zdHJ1Y3Rpb24pICYmXG4gICAgICAgICAgICAgICAgICAgICAgRmlsdGVyT3B0aW9ucy5UcmFuc2Zlci5wcm9ncmFtLmluY2x1ZGVzKFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb24ucHJvZ3JhbSxcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgIGluc3RydWN0aW9uVHJhbnNmZXIgPSBpbnN0cnVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgLy8gc3BsLXRva2VuIG9yIHN5c3RlbVxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgIGluc3RydWN0aW9uVHJhbnNmZXIgJiZcbiAgICAgICAgICAgICAgICAgIG1vZHVsZU5hbWUgIT09IGluc3RydWN0aW9uVHJhbnNmZXJbJ3Byb2dyYW0nXVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgZGVidWdMb2coXG4gICAgICAgICAgICAgICAgICAgICcjIEZpbHRlclR5cGUuTWVtbyBicmVhayBpbnN0cnVjdGlvbjogJyxcbiAgICAgICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb25UcmFuc2ZlcixcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBmZXRjaCBtZW1vIG9ubHkgdHJhbnNhY3Rpb25cbiAgICAgICAgICAgICAgICBoaXN0b3J5ID0gQ29udmVydGVyLk1lbW8uaW50b1VzZXJTaWRlKFxuICAgICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb24sXG4gICAgICAgICAgICAgICAgICB0eE1ldGEsXG4gICAgICAgICAgICAgICAgICBpbnN0cnVjdGlvblRyYW5zZmVyLFxuICAgICAgICAgICAgICAgICAgcG9zdFRva2VuQWNjb3VudCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBGaWx0ZXJUeXBlLk9ubHlNZW1vOiB7XG4gICAgICAgICAgICAgIGlmIChGaWx0ZXJPcHRpb25zLk1lbW8ucHJvZ3JhbS5pbmNsdWRlcyhpbnN0cnVjdGlvbi5wcm9ncmFtKSkge1xuICAgICAgICAgICAgICAgIGxldCBpbnN0cnVjdGlvblRyYW5zZmVyO1xuXG4gICAgICAgICAgICAgICAgaGlzdG9yeSA9IENvbnZlcnRlci5NZW1vLmludG9Vc2VyU2lkZShcbiAgICAgICAgICAgICAgICAgIGluc3RydWN0aW9uLFxuICAgICAgICAgICAgICAgICAgdHhNZXRhLFxuICAgICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb25UcmFuc2ZlcixcbiAgICAgICAgICAgICAgICAgIHBvc3RUb2tlbkFjY291bnQsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgRmlsdGVyVHlwZS5NaW50OiB7XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBGaWx0ZXJPcHRpb25zLk1pbnQucHJvZ3JhbS5pbmNsdWRlcyhpbnN0cnVjdGlvbi5wcm9ncmFtKSAmJlxuICAgICAgICAgICAgICAgIEZpbHRlck9wdGlvbnMuTWludC5hY3Rpb24uaW5jbHVkZXMoXG4gICAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbi5wYXJzZWQudHlwZSBhcyBzdHJpbmcsXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBoaXN0b3J5ID0gQ29udmVydGVyLk1pbnQuaW50b1VzZXJTaWRlKGluc3RydWN0aW9uLCB0eE1ldGEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBGaWx0ZXJUeXBlLlRyYW5zZmVyOlxuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgbW9kdWxlTmFtZSA9PT0gaW5zdHJ1Y3Rpb24ucHJvZ3JhbSAmJlxuICAgICAgICAgICAgICAgIEZpbHRlck9wdGlvbnMuVHJhbnNmZXIuYWN0aW9uLmluY2x1ZGVzKFxuICAgICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb24ucGFyc2VkLnR5cGUgYXMgc3RyaW5nLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluc3RydWN0aW9uLnBhcnNlZC50eXBlID09PSAndHJhbnNmZXJDaGVja2VkJykge1xuICAgICAgICAgICAgICAgICAgaGlzdG9yeSA9IENvbnZlcnRlci5UcmFuc2ZlckNoZWNrZWQuaW50b1VzZXJTaWRlKFxuICAgICAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgdHhNZXRhLFxuICAgICAgICAgICAgICAgICAgICBwb3N0VG9rZW5BY2NvdW50LFxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgaGlzdG9yeSA9IENvbnZlcnRlci5UcmFuc2Zlci5pbnRvVXNlclNpZGUoXG4gICAgICAgICAgICAgICAgICAgIGluc3RydWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICB0eE1ldGEsXG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gaGlzdG9yeTtcbiAgICB9O1xufVxuIiwgImltcG9ydCB7IFBhcnNlZEFjY291bnREYXRhIH0gZnJvbSAnQHNvbGFuYS93ZWIzLmpzJztcbmltcG9ydCB7IFJlc3VsdCwgVHJ5IH0gZnJvbSAnfi9zaGFyZWQnO1xuaW1wb3J0IHsgTm9kZSB9IGZyb20gJ34vbm9kZSc7XG5pbXBvcnQgeyBQdWJrZXksIE93bmVySW5mbyB9IGZyb20gJ34vdHlwZXMvYWNjb3VudCc7XG5pbXBvcnQgeyBUcmFuc2FjdGlvbkZpbHRlciB9IGZyb20gJ34vdHJhbnNhY3Rpb24tZmlsdGVyJztcblxuZXhwb3J0IG5hbWVzcGFjZSBTb2xOYXRpdmUge1xuICBleHBvcnQgY29uc3QgZmluZEJ5T3duZXIgPSBhc3luYyAoXG4gICAgb3duZXI6IFB1YmtleSxcbiAgKTogUHJvbWlzZTxSZXN1bHQ8T3duZXJJbmZvLCBFcnJvcj4+ID0+IHtcbiAgICByZXR1cm4gVHJ5KGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IE5vZGUuZ2V0Q29ubmVjdGlvbigpLmdldFBhcnNlZEFjY291bnRJbmZvKFxuICAgICAgICBvd25lci50b1B1YmxpY0tleSgpLFxuICAgICAgKTtcblxuICAgICAgY29uc3QgaW5mbyA9IHtcbiAgICAgICAgc29sOiAwLFxuICAgICAgICBsYW1wb3J0czogMCxcbiAgICAgICAgb3duZXI6IG93bmVyLnRvU3RyaW5nKCksXG4gICAgICB9O1xuXG4gICAgICBpZiAoVHJhbnNhY3Rpb25GaWx0ZXIuaXNQYXJzZWRJbnN0cnVjdGlvbihyZXMudmFsdWU/LmRhdGEpKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlZEFjY291bnREYXRhID0gcmVzLnZhbHVlPy5kYXRhIGFzIFBhcnNlZEFjY291bnREYXRhO1xuICAgICAgICBpbmZvLm93bmVyID0gcGFyc2VkQWNjb3VudERhdGEucGFyc2VkPy5pbmZvPy5vd25lciBhcyBzdHJpbmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXMudmFsdWUpIHtcbiAgICAgICAgaW5mby5sYW1wb3J0cyA9IHJlcy52YWx1ZT8ubGFtcG9ydHM7XG4gICAgICAgIGluZm8uc29sID0gcmVzLnZhbHVlPy5sYW1wb3J0cy50b1NvbCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfSk7XG4gIH07XG59XG4iLCAiaW1wb3J0IHsgU3lzdGVtUHJvZ3JhbSwgVHJhbnNhY3Rpb24gfSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuXG5pbXBvcnQgeyBSZXN1bHQsIFRyeSB9IGZyb20gJ34vc2hhcmVkJztcblxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJ34vbm9kZSc7XG5pbXBvcnQgeyBQYXJ0aWFsU2lnbkluc3RydWN0aW9uIH0gZnJvbSAnfi9pbnN0cnVjdGlvbic7XG5pbXBvcnQgeyBQdWJrZXksIFNlY3JldCB9IGZyb20gJ34vdHlwZXMvYWNjb3VudCc7XG5cbmV4cG9ydCBuYW1lc3BhY2UgU29sTmF0aXZlIHtcbiAgY29uc3QgUkFESVggPSAxMDtcbiAgZXhwb3J0IGNvbnN0IGZlZVBheWVyUGFydGlhbFNpZ25UcmFuc2ZlciA9IGFzeW5jIChcbiAgICBvd25lcjogUHVia2V5LFxuICAgIGRlc3Q6IFB1YmtleSxcbiAgICBzaWduZXJzOiBTZWNyZXRbXSxcbiAgICBhbW91bnQ6IG51bWJlcixcbiAgICBmZWVQYXllcjogUHVia2V5LFxuICApOiBQcm9taXNlPFJlc3VsdDxQYXJ0aWFsU2lnbkluc3RydWN0aW9uLCBFcnJvcj4+ID0+IHtcbiAgICByZXR1cm4gVHJ5KGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGJsb2NrSGFzaE9iaiA9IGF3YWl0IE5vZGUuZ2V0Q29ubmVjdGlvbigpLmdldExhdGVzdEJsb2NraGFzaCgpO1xuICAgICAgY29uc3QgdHggPSBuZXcgVHJhbnNhY3Rpb24oe1xuICAgICAgICBibG9ja2hhc2g6IGJsb2NrSGFzaE9iai5ibG9ja2hhc2gsXG4gICAgICAgIGxhc3RWYWxpZEJsb2NrSGVpZ2h0OiBibG9ja0hhc2hPYmoubGFzdFZhbGlkQmxvY2tIZWlnaHQsXG4gICAgICAgIGZlZVBheWVyOiBmZWVQYXllci50b1B1YmxpY0tleSgpLFxuICAgICAgfSkuYWRkKFxuICAgICAgICBTeXN0ZW1Qcm9ncmFtLnRyYW5zZmVyKHtcbiAgICAgICAgICBmcm9tUHVia2V5OiBvd25lci50b1B1YmxpY0tleSgpLFxuICAgICAgICAgIHRvUHVia2V5OiBkZXN0LnRvUHVibGljS2V5KCksXG4gICAgICAgICAgbGFtcG9ydHM6IHBhcnNlSW50KGAke2Ftb3VudC50b0xhbXBvcnRzKCl9YCwgUkFESVgpLFxuICAgICAgICB9KSxcbiAgICAgICk7XG5cbiAgICAgIHNpZ25lcnMuZm9yRWFjaCgoc2lnbmVyKSA9PiB7XG4gICAgICAgIHR4LnBhcnRpYWxTaWduKHNpZ25lci50b0tleXBhaXIoKSk7XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc2VyaWFsaXplZFR4ID0gdHguc2VyaWFsaXplKHtcbiAgICAgICAgcmVxdWlyZUFsbFNpZ25hdHVyZXM6IGZhbHNlLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBoZXggPSBzZXJpYWxpemVkVHgudG9TdHJpbmcoJ2hleCcpO1xuICAgICAgcmV0dXJuIG5ldyBQYXJ0aWFsU2lnbkluc3RydWN0aW9uKGhleCk7XG4gICAgfSk7XG4gIH07XG59XG4iLCAiaW1wb3J0IHsgUHVia2V5IH0gZnJvbSAnfi90eXBlcy9hY2NvdW50JztcbmltcG9ydCB7IEhpc3RvcnksIEhpc3RvcnlPcHRpb25zIH0gZnJvbSAnfi90eXBlcy9oaXN0b3J5JztcbmltcG9ydCB7IEZpbHRlclR5cGUsIE1vZHVsZU5hbWUgfSBmcm9tICd+L3R5cGVzL3RyYW5zYWN0aW9uLWZpbHRlcic7XG5pbXBvcnQgeyBPbkVyciwgT25PayB9IGZyb20gJ34vdHlwZXMvc2hhcmVkJztcbmltcG9ydCB7IFNpZ25hdHVyZXMsIFRyYW5zYWN0aW9uRmlsdGVyIH0gZnJvbSAnfi90cmFuc2FjdGlvbi1maWx0ZXInO1xuXG5leHBvcnQgbmFtZXNwYWNlIFNvbE5hdGl2ZSB7XG4gIGV4cG9ydCBjb25zdCBnZXRIaXN0b3J5ID0gYXN5bmMgKFxuICAgIHRhcmdldDogUHVia2V5LFxuICAgIGZpbHRlclR5cGU6IEZpbHRlclR5cGUsXG4gICAgb25PazogT25PazxIaXN0b3J5PixcbiAgICBvbkVycjogT25FcnIsXG4gICAgb3B0aW9uczogUGFydGlhbDxIaXN0b3J5T3B0aW9ucz4gPSB7fSxcbiAgKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRWYWx1ZXM6IEhpc3RvcnlPcHRpb25zID0ge1xuICAgICAgICB3YWl0VGltZTogMC4wMyxcbiAgICAgICAgbmFycm93RG93bjogMTAwLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IG1lcmdlZE9wdGlvbnMgPSB7IC4uLmRlZmF1bHRWYWx1ZXMsIC4uLm9wdGlvbnMgfTtcblxuICAgICAgY29uc3QgcGFyc2VyID0gVHJhbnNhY3Rpb25GaWx0ZXIucGFyc2UoZmlsdGVyVHlwZSwgTW9kdWxlTmFtZS5Tb2xOYXRpdmUpO1xuICAgICAgYXdhaXQgU2lnbmF0dXJlcy5nZXRGb3JBZHJlc3MoXG4gICAgICAgIHRhcmdldCxcbiAgICAgICAgcGFyc2VyLFxuICAgICAgICBhc3luYyAocmVzdWx0KSA9PiBhd2FpdCByZXN1bHQubWF0Y2gob25Paywgb25FcnIpLFxuICAgICAgICBtZXJnZWRPcHRpb25zLFxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIG9uRXJyKGUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cbiIsICJpbXBvcnQgeyBTeXN0ZW1Qcm9ncmFtIH0gZnJvbSAnQHNvbGFuYS93ZWIzLmpzJztcbmltcG9ydCB7IFB1YmtleSwgU2VjcmV0IH0gZnJvbSAnfi90eXBlcy9hY2NvdW50JztcbmltcG9ydCB7IFJlc3VsdCwgVHJ5IH0gZnJvbSAnfi9zaGFyZWQnO1xuaW1wb3J0IHsgSW5zdHJ1Y3Rpb24gfSBmcm9tICd+L2luc3RydWN0aW9uJztcblxuZXhwb3J0IG5hbWVzcGFjZSBTb2xOYXRpdmUge1xuICBjb25zdCBSQURJWCA9IDEwO1xuICBleHBvcnQgY29uc3QgdHJhbnNmZXIgPSAoXG4gICAgc291cmNlOiBQdWJrZXksXG4gICAgZGVzdDogUHVia2V5LFxuICAgIHNpZ25lcnM6IFNlY3JldFtdLFxuICAgIGFtb3VudDogbnVtYmVyLFxuICAgIGZlZVBheWVyPzogU2VjcmV0LFxuICApOiBSZXN1bHQ8SW5zdHJ1Y3Rpb24sIEVycm9yPiA9PiB7XG4gICAgcmV0dXJuIFRyeSgoKSA9PiB7XG4gICAgICBjb25zdCBpbnN0ID0gU3lzdGVtUHJvZ3JhbS50cmFuc2Zlcih7XG4gICAgICAgIGZyb21QdWJrZXk6IHNvdXJjZS50b1B1YmxpY0tleSgpLFxuICAgICAgICB0b1B1YmtleTogZGVzdC50b1B1YmxpY0tleSgpLFxuICAgICAgICBsYW1wb3J0czogcGFyc2VJbnQoYCR7YW1vdW50LnRvTGFtcG9ydHMoKX1gLCBSQURJWCksXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgcGF5ZXIgPSBmZWVQYXllciA/IGZlZVBheWVyLnRvS2V5cGFpcigpIDogc2lnbmVyc1swXS50b0tleXBhaXIoKTtcblxuICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihcbiAgICAgICAgW2luc3RdLFxuICAgICAgICBzaWduZXJzLm1hcCgocykgPT4gcy50b0tleXBhaXIoKSksXG4gICAgICAgIHBheWVyLFxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcbn1cbiIsICJpbXBvcnQge1xuICBjcmVhdGVDbG9zZUFjY291bnRJbnN0cnVjdGlvbixcbiAgY3JlYXRlTWludCxcbiAgY3JlYXRlVHJhbnNmZXJJbnN0cnVjdGlvbixcbiAgY3JlYXRlV3JhcHBlZE5hdGl2ZUFjY291bnQsXG59IGZyb20gJ0Bzb2xhbmEvc3BsLXRva2VuJztcblxuaW1wb3J0IHsgZGVidWdMb2csIFJlc3VsdCwgVHJ5IH0gZnJvbSAnfi9zaGFyZWQnO1xuaW1wb3J0IHsgSW5zdHJ1Y3Rpb24gfSBmcm9tICd+L2luc3RydWN0aW9uJztcbmltcG9ydCB7IE5vZGUgfSBmcm9tICd+L25vZGUnO1xuaW1wb3J0IHsgUHVia2V5LCBTZWNyZXQgfSBmcm9tICd+L3R5cGVzL2FjY291bnQnO1xuaW1wb3J0IHsgQXNzb2NpYXRlZEFjY291bnQgfSBmcm9tICd+L2FjY291bnQnO1xuXG5leHBvcnQgbmFtZXNwYWNlIFNvbE5hdGl2ZSB7XG4gIGNvbnN0IFJBRElYID0gMTA7XG5cbiAgLy8gTk9USUNFOiBUaGVyZSBpcyBhIGxhbXBvcnRzIGZsdWN0dWF0aW9uIHdoZW4gdHJhbnNmZXIgdW5kZXIgMC4wMDEgc29sXG4gIC8vIGZvciBtdWx0aVNpZyBvbmx5IGZ1bmN0aW9uXG4gIGV4cG9ydCBjb25zdCB0cmFuc2ZlcldpdGhNdWx0aXNpZyA9IGFzeW5jIChcbiAgICBvd25lcjogUHVia2V5LFxuICAgIGRlc3Q6IFB1YmtleSxcbiAgICBzaWduZXJzOiBTZWNyZXRbXSxcbiAgICBhbW91bnQ6IG51bWJlcixcbiAgICBmZWVQYXllcj86IFNlY3JldCxcbiAgKTogUHJvbWlzZTxSZXN1bHQ8SW5zdHJ1Y3Rpb24sIEVycm9yPj4gPT4ge1xuICAgIHJldHVybiBUcnkoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgY29ubmVjdGlvbiA9IE5vZGUuZ2V0Q29ubmVjdGlvbigpO1xuICAgICAgY29uc3QgcGF5ZXIgPSBmZWVQYXllciA/IGZlZVBheWVyIDogc2lnbmVyc1swXTtcbiAgICAgIGNvbnN0IGtleXBhaXJzID0gc2lnbmVycy5tYXAoKHMpID0+IHMudG9LZXlwYWlyKCkpO1xuICAgICAgY29uc3Qgd3JhcHBlZCA9IGF3YWl0IGNyZWF0ZVdyYXBwZWROYXRpdmVBY2NvdW50KFxuICAgICAgICBjb25uZWN0aW9uLFxuICAgICAgICBwYXllci50b0tleXBhaXIoKSxcbiAgICAgICAgb3duZXIudG9QdWJsaWNLZXkoKSxcbiAgICAgICAgcGFyc2VJbnQoYCR7YW1vdW50LnRvTGFtcG9ydHMoKX1gLCBSQURJWCksXG4gICAgICApO1xuXG4gICAgICBkZWJ1Z0xvZygnIyB3cmFwcGVkIHNvbDogJywgd3JhcHBlZC50b0Jhc2U1OCgpKTtcblxuICAgICAgY29uc3QgdG9rZW4gPSBhd2FpdCBjcmVhdGVNaW50KFxuICAgICAgICBjb25uZWN0aW9uLFxuICAgICAgICBwYXllci50b0tleXBhaXIoKSxcbiAgICAgICAgb3duZXIudG9QdWJsaWNLZXkoKSxcbiAgICAgICAgb3duZXIudG9QdWJsaWNLZXkoKSxcbiAgICAgICAgMCxcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHNvdXJjZVRva2VuID0gYXdhaXQgQXNzb2NpYXRlZEFjY291bnQucmV0cnlHZXRPckNyZWF0ZShcbiAgICAgICAgdG9rZW4udG9TdHJpbmcoKSxcbiAgICAgICAgb3duZXIsXG4gICAgICAgIHBheWVyLFxuICAgICAgKTtcblxuICAgICAgZGVidWdMb2coJyMgc291cmNlVG9rZW46ICcsIHNvdXJjZVRva2VuKTtcblxuICAgICAgY29uc3QgZGVzdFRva2VuID0gYXdhaXQgQXNzb2NpYXRlZEFjY291bnQucmV0cnlHZXRPckNyZWF0ZShcbiAgICAgICAgdG9rZW4udG9TdHJpbmcoKSxcbiAgICAgICAgd3JhcHBlZC50b1N0cmluZygpLFxuICAgICAgICBwYXllcixcbiAgICAgICk7XG5cbiAgICAgIGRlYnVnTG9nKCcjIGRlc3RUb2tlbjogJywgZGVzdFRva2VuKTtcblxuICAgICAgY29uc3QgaW5zdDEgPSBjcmVhdGVUcmFuc2Zlckluc3RydWN0aW9uKFxuICAgICAgICBzb3VyY2VUb2tlbi50b1B1YmxpY0tleSgpLFxuICAgICAgICBkZXN0VG9rZW4udG9QdWJsaWNLZXkoKSxcbiAgICAgICAgb3duZXIudG9QdWJsaWNLZXkoKSxcbiAgICAgICAgcGFyc2VJbnQoYCR7YW1vdW50fWAsIFJBRElYKSwgLy8gTm8gbGFtcG9ydHMsIGl0cyBzb2xcbiAgICAgICAga2V5cGFpcnMsXG4gICAgICApO1xuXG4gICAgICBjb25zdCBpbnN0MiA9IGNyZWF0ZUNsb3NlQWNjb3VudEluc3RydWN0aW9uKFxuICAgICAgICB3cmFwcGVkLFxuICAgICAgICBkZXN0LnRvUHVibGljS2V5KCksXG4gICAgICAgIG93bmVyLnRvUHVibGljS2V5KCksXG4gICAgICAgIGtleXBhaXJzLFxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIG5ldyBJbnN0cnVjdGlvbihcbiAgICAgICAgW2luc3QxLCBpbnN0Ml0sXG4gICAgICAgIHNpZ25lcnMubWFwKChzKSA9PiBzLnRvS2V5cGFpcigpKSxcbiAgICAgICAgZmVlUGF5ZXI/LnRvS2V5cGFpcigpLFxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcbn1cbiIsICJpbXBvcnQgeyBTb2xOYXRpdmUgYXMgRmluZCB9IGZyb20gJy4vZmluZCc7XG5pbXBvcnQgeyBTb2xOYXRpdmUgYXMgRmVlUGF5ZXIgfSBmcm9tICcuL2ZlZS1wYXllci1wYXJ0aWFsLXNpZ24tdHJhbnNmZXInO1xuaW1wb3J0IHsgU29sTmF0aXZlIGFzIEhpc3RvcnkgfSBmcm9tICcuL2hpc3RvcnknO1xuaW1wb3J0IHsgU29sTmF0aXZlIGFzIFRyYW5zZmVyIH0gZnJvbSAnLi90cmFuc2Zlcic7XG5pbXBvcnQgeyBTb2xOYXRpdmUgYXMgVHJhbnNmZXJXaXRoTXVsdGlzaWcgfSBmcm9tICcuL3RyYW5zZmVyLXdpdGgtbXVsdGlzaWcnO1xuaW1wb3J0ICd+L3R5cGVzL2luc3RydWN0aW9uJztcbmltcG9ydCAnfi9pbnN0cnVjdGlvbic7XG5cbmV4cG9ydCBjb25zdCBTb2xOYXRpdmUgPSB7XG4gIC4uLkZpbmQsXG4gIC4uLkZlZVBheWVyLFxuICAuLi5IaXN0b3J5LFxuICAuLi5UcmFuc2ZlcixcbiAgLi4uVHJhbnNmZXJXaXRoTXVsdGlzaWcsXG59O1xuZXhwb3J0ICogZnJvbSAnfi9zaGFyZWQvZXhwb3J0cyc7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsU0FBcUIsaUJBQWlCO0FBQ3RDLE9BQU8sWUFBWTtBQUVaLElBQVU7QUFBQSxDQUFWLENBQVVBLGVBQVY7QUFDRSxFQUFNQSxXQUFBLGlCQUFpQixPQUFPLFFBQVE7QUFDdEMsRUFBTUEsV0FBQSxtQkFBbUIsT0FBTyxRQUFRO0FBQ3hDLEVBQU1BLFdBQUEsY0FBYyxPQUFPO0FBQzNCLEVBQU1BLFdBQUEsbUJBQW1CLE9BQU8sV0FBVztBQUUzQyxNQUFLO0FBQUwsSUFBS0MsYUFBTDtBQUNMLElBQUFBLFNBQUEsU0FBTTtBQUNOLElBQUFBLFNBQUEsaUJBQWM7QUFDZCxJQUFBQSxTQUFBLFNBQU07QUFDTixJQUFBQSxTQUFBLFVBQU87QUFDUCxJQUFBQSxTQUFBLGVBQVk7QUFBQSxLQUxGLFVBQUFELFdBQUEsWUFBQUEsV0FBQTtBQVFMLE1BQUs7QUFBTCxJQUFLRSxpQkFBTDtBQUNMLElBQUFBLGFBQUEsU0FBTTtBQUNOLElBQUFBLGFBQUEsaUJBQWM7QUFDZCxJQUFBQSxhQUFBLFNBQU07QUFDTixJQUFBQSxhQUFBLFVBQU87QUFDUCxJQUFBQSxhQUFBLGVBQVk7QUFBQSxLQUxGLGNBQUFGLFdBQUEsZ0JBQUFBLFdBQUE7QUFRTCxFQUFNQSxXQUFBLGdCQUFnQixDQUFDLFVBR2hCO0FBQ1osVUFBTSxFQUFFLFNBQVMsS0FBSyxrQkFBQUcsa0JBQWlCLElBQUk7QUFHM0MsUUFBSUEscUJBQW9CQSxrQkFBaUIsU0FBUyxHQUFHO0FBQ25ELFlBQU0sUUFBUSxLQUFLLElBQUksSUFBSUEsa0JBQWlCO0FBQzVDLGFBQU9BLGtCQUFpQixLQUFLO0FBQUEsSUFDL0I7QUFFQSxZ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LEdBQUcsTUFBTSxJQUFJLEtBQUs7QUFBQTtBQUFBLFFBQzNCO0FBQUEsTUFDRjtBQUVBLFlBQU0sUUFBUTtBQUFBLFFBQ1o7QUFBQSxRQUNBLEtBQUssWUFBWTtBQUFBLFFBQ2pCLE1BQU0sWUFBWTtBQUFBLFFBQ2xCO0FBQUEsTUFDRjtBQUVBLGFBQU8sSUFBSUM7QUFBQSxRQUNULENBQUMsT0FBTyxLQUFLO0FBQUEsUUFDYixRQUFRLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDO0FBQUEsUUFDaEMsVUFBVSxVQUFVO0FBQUEsTUFDdEI7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsR0F0RWVELDRCQUFBOzs7QUNMVixJQUFNRSxhQUFZO0FBQUEsRUFDdkIsR0FBRztBQUFBLEVBQ0gsR0FBR0E7QUFBQSxFQUNILEdBQUdBO0FBQUEsRUFDSCxHQUFHQTtBQUFBLEVBQ0gsR0FBR0E7QUFDTDsiLAogICJuYW1lcyI6IFsiQ29uc3RhbnRzIiwgIkNsdXN0ZXIiLCAiRW5kUG9pbnRVcmwiLCAiY3VzdG9tQ2x1c3RlclVybCIsICJSZXN1bHQiLCAiTm9kZSIsICJzZW5kQW5kQ29uZmlybVRyYW5zYWN0aW9uIiwgIlRyYW5zYWN0aW9uIiwgIkluc3RydWN0aW9uIiwgIlRyYW5zYWN0aW9uIiwgInNlbmRBbmRDb25maXJtVHJhbnNhY3Rpb24iLCAic2VuZEFuZENvbmZpcm1UcmFuc2FjdGlvbiIsICJUcmFuc2FjdGlvbiIsICJUcmFuc2FjdGlvbkluc3RydWN0aW9uIiwgIk11bHRpc2lnSW5zdHJ1Y3Rpb24iLCAiVHJhbnNhY3Rpb24iLCAiVHJhbnNhY3Rpb24iLCAiS2V5cGFpciIsICJQdWJsaWNLZXkiLCAiUHVibGljS2V5IiwgIktleXBhaXIiLCAiVE9LRU5fUFJPR1JBTV9JRCIsICJLZXlwYWlyIiwgIlB1YmxpY0tleSIsICJicyIsICJBc3NvY2lhdGVkQWNjb3VudCIsICJJbnN0cnVjdGlvbiIsICJUT0tFTl9QUk9HUkFNX0lEIiwgIlB1YmxpY0tleSIsICJQZGEiLCAiQ29udmVydGVyIiwgIkNvbGxlY3Rpb24iLCAiQ29udmVydGVyIiwgIkNyZWF0b3JzIiwgIkNvbnZlcnRlciIsICJNZW1vIiwgIkNvbnZlcnRlciIsICJNaW50IiwgIkNvbnZlcnRlciIsICJVc2VzIiwgIkNvbnZlcnRlciIsICJUb2tlbk1ldGFkYXRhIiwgIkNvbnZlcnRlciIsICJOZnRNZXRhZGF0YSIsICJDb252ZXJ0ZXIiLCAiUHJvcGVydGllcyIsICJDb252ZXJ0ZXIiLCAiUm95YWx0eSIsICJDb252ZXJ0ZXIiLCAiVHJhbnNmZXJDaGVja2VkIiwgIkNvbnZlcnRlciIsICJUcmFuc2ZlciIsICJDb252ZXJ0ZXIiLCAiVmFsaWRhdG9yIiwgIk1lc3NhZ2UiLCAiQ29udmVydGVyIiwgIkZpbHRlclR5cGUiLCAiTW9kdWxlTmFtZSIsICJTaWduYXR1cmVzIiwgIlRyYW5zYWN0aW9uRmlsdGVyIiwgImluc3RydWN0aW9uIiwgIkNvbnZlcnRlciIsICJTb2xOYXRpdmUiLCAiU3lzdGVtUHJvZ3JhbSIsICJUcmFuc2FjdGlvbiIsICJTb2xOYXRpdmUiLCAiVHJhbnNhY3Rpb24iLCAiU3lzdGVtUHJvZ3JhbSIsICJTb2xOYXRpdmUiLCAiU3lzdGVtUHJvZ3JhbSIsICJTb2xOYXRpdmUiLCAiU3lzdGVtUHJvZ3JhbSIsICJJbnN0cnVjdGlvbiIsICJTb2xOYXRpdmUiLCAiSW5zdHJ1Y3Rpb24iLCAiU29sTmF0aXZlIl0KfQo=