// src/create.ts
import { TransactionInstruction as TransactionInstruction3 } from "@solana/web3.js";

// ../transaction/src/batch.ts
import {
  sendAndConfirmTransaction,
  Transaction as Tx
} from "@solana/web3.js";

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
((Result7) => {
  function ok(value) {
    return new InternalOk(value);
  }
  Result7.ok = ok;
  function err(error) {
    return new InternalErr(error || Error());
  }
  Result7.err = err;
  function all(obj) {
    if (Array.isArray(obj)) {
      const resArr = [];
      for (const item of obj) {
        if (item.isErr) {
          return item;
        }
        resArr.push(item.value);
      }
      return Result7.ok(resArr);
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
    return Result7.ok(res);
  }
  Result7.all = all;
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

// ../account/src/associated.ts
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError
} from "@solana/spl-token";

// ../account/src/keypair.ts
import { Keypair as Original, PublicKey as PublicKey2 } from "@solana/web3.js";
import bs from "bs58";
var Account;
((Account5) => {
  class Keypair4 {
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
      return Original.fromSecretKey(decoded);
    }
    static isPubkey = (value) => /^[0-9a-zA-Z]{32,44}$/.test(value);
    static isSecret = (value) => /^[0-9a-zA-Z]{87,88}$/.test(value);
    static create = () => {
      const keypair = Original.generate();
      return new Keypair4({
        pubkey: keypair.publicKey.toString(),
        secret: bs.encode(keypair.secretKey)
      });
    };
    static toKeyPair = (keypair) => {
      return new Keypair4({
        pubkey: keypair.publicKey.toString(),
        secret: bs.encode(keypair.secretKey)
      });
    };
  }
  Account5.Keypair = Keypair4;
})(Account || (Account = {}));

// ../account/src/associated.ts
var Account2;
((Account5) => {
  let Associated;
  ((Associated2) => {
    const RETRY_OVER_LIMIT = 10;
    const RETRY_SLEEP_TIME = 3;
    const get = async (mint, owner, feePayer, allowOwnerOffCurve = false) => {
      const res = await (0, Associated2.makeOrCreateInstruction)(
        mint,
        owner,
        new Account.Keypair({ secret: feePayer }).pubkey,
        allowOwnerOffCurve
      );
      if (!res.inst) {
        return res.tokenAccount;
      }
      return new Transaction(
        [res.inst],
        [],
        feePayer.toKeypair(),
        res.tokenAccount
      );
    };
    Associated2.retryGetOrCreate = async (mint, owner, feePayer) => {
      let counter = 1;
      while (counter < RETRY_OVER_LIMIT) {
        try {
          const inst = await get(mint, owner, feePayer, true);
          if (inst && typeof inst === "string") {
            debugLog("# associatedTokenAccount: ", inst);
            return inst;
          } else if (inst instanceof Transaction) {
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
    Associated2.makeOrCreateInstruction = async (mint, owner, feePayer, allowOwnerOffCurve = false) => {
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
  })(Associated = Account5.Associated || (Account5.Associated = {}));
})(Account2 || (Account2 = {}));

// ../account/src/pda.ts
import { PublicKey as PublicKey3 } from "@solana/web3.js";
import { PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { MPL_BUBBLEGUM_PROGRAM_ID } from "@metaplex-foundation/mpl-bubblegum";
import BN from "bn.js";
var Account3;
((Account5) => {
  let Pda;
  ((Pda2) => {
    Pda2.getMetadata = (address) => {
      const [publicKey] = PublicKey3.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          PROGRAM_ID.toBuffer(),
          address.toPublicKey().toBuffer()
        ],
        PROGRAM_ID
      );
      return publicKey;
    };
    Pda2.getMasterEdition = (address) => {
      const [publicKey] = PublicKey3.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          PROGRAM_ID.toBuffer(),
          address.toPublicKey().toBuffer(),
          Buffer.from("edition")
        ],
        PROGRAM_ID
      );
      return publicKey;
    };
    Pda2.getTreeAuthority = (address) => {
      const [publicKey] = PublicKey3.findProgramAddressSync(
        [address.toPublicKey().toBuffer()],
        MPL_BUBBLEGUM_PROGRAM_ID.toPublicKey()
      );
      return publicKey;
    };
    Pda2.getBgumSigner = () => {
      const [publicKey] = PublicKey3.findProgramAddressSync(
        [Buffer.from("collection_cpi", "utf8")],
        MPL_BUBBLEGUM_PROGRAM_ID.toPublicKey()
      );
      return publicKey;
    };
    Pda2.getAssetId = (address, leafIndex) => {
      const node = new BN.BN(leafIndex);
      const [assetId] = PublicKey3.findProgramAddressSync(
        [
          Buffer.from("asset", "utf8"),
          address.toPublicKey().toBuffer(),
          Uint8Array.from(node.toArray("le", 8))
        ],
        MPL_BUBBLEGUM_PROGRAM_ID.toPublicKey()
      );
      return assetId.toString();
    };
  })(Pda = Account5.Pda || (Account5.Pda = {}));
})(Account3 || (Account3 = {}));

// ../account/src/index.ts
var Account4 = {
  ...Account2,
  ...Account,
  ...Account3
};

// ../converter/src/collection.ts
var Converter;
((Converter15) => {
  let Collection;
  ((Collection2) => {
    Collection2.intoInfra = (input) => {
      if (!input) {
        return null;
      }
      return {
        key: input.toPublicKey(),
        verified: false
      };
    };
    Collection2.intoUser = (output) => {
      if (!output) {
        return void 0;
      }
      return {
        address: output.key.toString(),
        verified: output.verified
      };
    };
  })(Collection = Converter15.Collection || (Converter15.Collection = {}));
})(Converter || (Converter = {}));

// ../converter/src/creators.ts
var Converter2;
((Converter15) => {
  let Creators;
  ((Creators2) => {
    Creators2.intoInfra = (input) => {
      if (!input) {
        return null;
      }
      return input.map((data) => {
        let modify = null;
        modify = {
          address: data.address.toPublicKey(),
          share: data.share,
          verified: false
        };
        return modify;
      });
    };
    Creators2.intoCompressedNftInfra = (input) => {
      if (!input) {
        return [];
      }
      return input.map((data) => {
        let modify;
        modify = {
          address: data.address.toPublicKey(),
          share: data.share,
          verified: false
        };
        return modify;
      });
    };
    Creators2.intoUser = (output) => {
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
  })(Creators = Converter15.Creators || (Converter15.Creators = {}));
})(Converter2 || (Converter2 = {}));

// ../converter/src/royalty.ts
var Converter3;
((Converter15) => {
  let Royalty;
  ((Royalty2) => {
    Royalty2.THRESHOLD = 100;
    Royalty2.intoInfra = (percentage) => {
      return percentage * Royalty2.THRESHOLD;
    };
    Royalty2.intoUser = (percentage) => {
      return percentage * Royalty2.THRESHOLD;
    };
  })(Royalty = Converter15.Royalty || (Converter15.Royalty = {}));
})(Converter3 || (Converter3 = {}));

// ../converter/src/compressed-nft-metadata.ts
import {
  TokenProgramVersion,
  TokenStandard
} from "mpl-bubblegum-instruction";
var Converter4;
((Converter15) => {
  let CompressedNftMetadata;
  ((CompressedNftMetadata2) => {
    CompressedNftMetadata2.intoInfra = (input, uri, sellerFeeBasisPoints) => {
      return {
        name: input.name,
        symbol: input.symbol,
        uri,
        sellerFeeBasisPoints,
        creators: Converter2.Creators.intoCompressedNftInfra(input.creators),
        collection: Converter.Collection.intoInfra(input.collection),
        uses: input.uses || null,
        primarySaleHappened: false,
        isMutable: input.isMutable ?? false,
        editionNonce: 0,
        tokenStandard: TokenStandard.NonFungible,
        tokenProgramVersion: TokenProgramVersion.Original
      };
    };
    CompressedNftMetadata2.intoUser = (output) => {
      console.log(output.onchain.grouping);
      console.log(output.onchain.creators);
      return {
        mint: output.onchain.id.toString(),
        collectionMint: "output.onchain.grouping[0].group_value",
        authorities: output.onchain.authorities,
        royalty: Converter3.Royalty.intoUser(output.onchain.royalty.percent),
        name: output.onchain.content.metadata.name,
        symbol: output.onchain.content.metadata.symbol,
        uri: output.onchain.content.json_uri,
        creators: Converter2.Creators.intoUser(output.onchain.creators),
        treeAddress: output.onchain.compression.tree,
        isMutable: output.onchain.mutable,
        isBurn: output.onchain.burnt,
        editionNonce: output.onchain.supply.edition_nonce,
        primarySaleHappened: output.onchain.royalty.primary_sale_happened,
        dateTime: convertTimestampToDateTime(output.offchain.created_at),
        offchain: output.offchain
      };
    };
  })(CompressedNftMetadata = Converter15.CompressedNftMetadata || (Converter15.CompressedNftMetadata = {}));
})(Converter4 || (Converter4 = {}));

// ../converter/src/memo.ts
var Converter5;
((Converter15) => {
  let Memo4;
  ((Memo5) => {
    Memo5.intoUserSide = (output, meta, outputTransfer, mappingTokenAccount) => {
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
  })(Memo4 = Converter15.Memo || (Converter15.Memo = {}));
})(Converter5 || (Converter5 = {}));

// ../converter/src/mint.ts
var Converter6;
((Converter15) => {
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
  })(Mint = Converter15.Mint || (Converter15.Mint = {}));
})(Converter6 || (Converter6 = {}));

// ../converter/src/collection-details.ts
var Converter7;
((Converter15) => {
  let CollectionDetails;
  ((CollectionDetails2) => {
    CollectionDetails2.intoUser = (output) => {
      if (!output) {
        return void 0;
      }
      return {
        __kind: output.__kind,
        size: parseInt(output.size.toString(10))
      };
    };
  })(CollectionDetails = Converter15.CollectionDetails || (Converter15.CollectionDetails = {}));
})(Converter7 || (Converter7 = {}));

// ../converter/src/uses.ts
var Converter8;
((Converter15) => {
  let Uses;
  ((Uses2) => {
    Uses2.intoUserSide = (output) => {
      if (!output) {
        return void 0;
      }
      return output;
    };
  })(Uses = Converter15.Uses || (Converter15.Uses = {}));
})(Converter8 || (Converter8 = {}));

// ../converter/src/token-metadata.ts
var Converter9;
((Converter15) => {
  let TokenMetadata;
  ((TokenMetadata2) => {
    TokenMetadata2.intoInfra = (input, uri, sellerFeeBasisPoints) => {
      return {
        name: input.name,
        symbol: input.symbol,
        uri,
        sellerFeeBasisPoints,
        creators: Converter2.Creators.intoInfra(input.creators),
        collection: null,
        uses: input.uses || null
      };
    };
    TokenMetadata2.intoUser = (output, tokenAmount) => {
      return {
        mint: output.onchain.mint.toString(),
        royalty: output.onchain.data.sellerFeeBasisPoints,
        name: (0, TokenMetadata2.deleteNullStrings)(output.onchain.data.name),
        symbol: (0, TokenMetadata2.deleteNullStrings)(output.onchain.data.symbol),
        tokenAmount,
        uri: (0, TokenMetadata2.deleteNullStrings)(output.onchain.data.uri),
        creators: Converter2.Creators.intoUser(output.onchain.data.creators),
        uses: Converter8.Uses.intoUserSide(output.onchain.uses),
        dateTime: convertTimestampToDateTime(output.offchain.created_at),
        offchain: output.offchain
      };
    };
    TokenMetadata2.deleteNullStrings = (str) => {
      return str.replace(/\0/g, "");
    };
  })(TokenMetadata = Converter15.TokenMetadata || (Converter15.TokenMetadata = {}));
})(Converter9 || (Converter9 = {}));

// ../converter/src/regular-nft-metadata.ts
var Converter10;
((Converter15) => {
  let RegularNftMetadata;
  ((RegularNftMetadata2) => {
    RegularNftMetadata2.intoInfra = (input, uri, sellerFeeBasisPoints) => {
      return {
        name: input.name,
        symbol: input.symbol,
        uri,
        sellerFeeBasisPoints,
        creators: Converter2.Creators.intoInfra(input.creators),
        collection: Converter.Collection.intoInfra(input.collection),
        uses: input.uses || null
      };
    };
    RegularNftMetadata2.intoUser = (output) => {
      return {
        mint: output.onchain.mint.toString(),
        updateAuthority: output.onchain.updateAuthority.toString(),
        royalty: output.onchain.data.sellerFeeBasisPoints,
        name: Converter9.TokenMetadata.deleteNullStrings(output.onchain.data.name),
        symbol: Converter9.TokenMetadata.deleteNullStrings(
          output.onchain.data.symbol
        ),
        uri: Converter9.TokenMetadata.deleteNullStrings(output.onchain.data.uri),
        isMutable: output.onchain.isMutable,
        primarySaleHappened: output.onchain.primarySaleHappened,
        creators: Converter2.Creators.intoUser(output.onchain.data.creators),
        editionNonce: output.onchain.editionNonce,
        collection: Converter.Collection.intoUser(output.onchain.collection),
        collectionDetails: Converter7.CollectionDetails.intoUser(
          output.onchain.collectionDetails
        ),
        uses: Converter8.Uses.intoUserSide(output.onchain.uses),
        dateTime: convertTimestampToDateTime(output.offchain.created_at),
        offchain: output.offchain
      };
    };
  })(RegularNftMetadata = Converter15.RegularNftMetadata || (Converter15.RegularNftMetadata = {}));
})(Converter10 || (Converter10 = {}));

// ../converter/src/properties.ts
var Converter11;
((Converter15) => {
  let Properties;
  ((Properties2) => {
    Properties2.intoInfra = async (input, callbackFunc, storageType, feePayer) => {
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
  })(Properties = Converter15.Properties || (Converter15.Properties = {}));
})(Converter11 || (Converter11 = {}));

// ../converter/src/transfer-checked.ts
var Converter12;
((Converter15) => {
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
  })(TransferChecked = Converter15.TransferChecked || (Converter15.TransferChecked = {}));
})(Converter12 || (Converter12 = {}));

// ../converter/src/transfer.ts
var Converter13;
((Converter15) => {
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
  })(Transfer = Converter15.Transfer || (Converter15.Transfer = {}));
})(Converter13 || (Converter13 = {}));

// ../converter/src/index.ts
var Converter14 = {
  ...Converter4,
  ...Converter,
  ...Converter2,
  ...Converter5,
  ...Converter6,
  ...Converter10,
  ...Converter11,
  ...Converter3,
  ...Converter9,
  ...Converter12,
  ...Converter13,
  ...Converter8
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
      } else if (royalty > Validator2.ROYALTY_MAX * Converter14.Royalty.THRESHOLD) {
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
var FilterType = /* @__PURE__ */ ((FilterType2) => {
  FilterType2["Memo"] = "memo";
  FilterType2["Mint"] = "mint";
  FilterType2["OnlyMemo"] = "only-memo";
  FilterType2["Transfer"] = "transfer";
  return FilterType2;
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

// ../global/src/index.ts
import { Keypair, LAMPORTS_PER_SOL, PublicKey as PublicKey4 } from "@solana/web3.js";
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
  if (Account4.Keypair.isPubkey(addressOrSignature)) {
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
  if (!Account4.Keypair.isPubkey(this.toString())) {
    throw Error(`No match KeyPair.PubKey: ${this.toString()}`);
  }
  return new PublicKey4(this.toString());
};
String.prototype.toKeypair = function() {
  if (!Account4.Keypair.isSecret(this.toString())) {
    throw Error(`No match KeyPair.Secret: ${this.toString()}`);
  }
  const decoded = bs2.decode(this.toString());
  return Keypair.fromSecretKey(decoded);
};
Number.prototype.toSol = function() {
  return BigNumber(this).div(LAMPORTS_PER_SOL).toNumber();
};
Number.prototype.toLamports = function() {
  return BigNumber(this).times(LAMPORTS_PER_SOL).toNumber();
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

// ../transaction/src/define.ts
var MAX_RETRIES = 3;

// ../transaction/src/batch.ts
var BatchTransaction = class {
  static submit = async (arr) => {
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
    const transaction = new Tx();
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
    return BatchTransaction.submit(instructions);
  });
};

// ../transaction/src/default.ts
import {
  sendAndConfirmTransaction as sendAndConfirmTransaction2,
  Transaction as Tx2
} from "@solana/web3.js";
var Transaction = class _Transaction {
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
      if (!(this instanceof _Transaction)) {
        throw Error("only Instruction object that can use this");
      }
      const transaction = new Tx2();
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
    return BatchTransaction.submit(instructions);
  });
};

// ../transaction/src/mint.ts
import {
  sendAndConfirmTransaction as sendAndConfirmTransaction3,
  Transaction as Tx3
} from "@solana/web3.js";

// ../transaction/src/partial-sign.ts
import {
  Transaction as Tx4
} from "@solana/web3.js";

// src/create.ts
import bs3 from "bs58";
var Memo;
((Memo4) => {
  Memo4.decode = (encoded) => bs3.decode(encoded).toString();
  Memo4.encode = (data) => Buffer.from(data);
  Memo4.create = (data, owner, signer, feePayer) => {
    const key = owner.toPublicKey() ? [
      {
        pubkey: owner.toPublicKey(),
        isSigner: true,
        isWritable: true
      }
    ] : [];
    const instruction = new TransactionInstruction3({
      programId: Constants.MEMO_PROGRAM_ID,
      data: (0, Memo4.encode)(data),
      keys: key
    });
    const payer = feePayer || signer;
    return new Transaction(
      [instruction],
      [signer.toKeypair()],
      payer.toKeypair()
    );
  };
})(Memo || (Memo = {}));

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
              history = Converter14.Memo.intoUserSide(
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
              history = Converter14.Memo.intoUserSide(
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
              history = Converter14.Mint.intoUserSide(instruction, txMeta);
            }
            break;
          }
          case "transfer" /* Transfer */:
            if (moduleName === instruction.program && FilterOptions.Transfer.action.includes(
              instruction.parsed.type
            )) {
              if (instruction.parsed.type === "transferChecked") {
                history = Converter14.TransferChecked.intoUserSide(
                  instruction,
                  txMeta,
                  postTokenAccount
                );
              } else {
                history = Converter14.Transfer.intoUserSide(
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
var Memo2;
((Memo4) => {
  Memo4.findByOwner = async (target, onOk, onErr, options = {}) => {
    try {
      const defaultValues = {
        waitTime: 0.03,
        narrowDown: 100
      };
      const mergedOptions = { ...defaultValues, ...options };
      const parser = TransactionFilter.parse(
        "only-memo" /* OnlyMemo */,
        "system" /* SolNative */
      );
      await Signatures.getForAdress(
        target,
        parser,
        (result) => result.match(onOk, onErr),
        mergedOptions
      );
    } catch (e) {
      if (e instanceof Error) {
        onErr(e);
      }
    }
  };
})(Memo2 || (Memo2 = {}));

// src/index.ts
var Memo3 = { ...Memo, ...Memo2 };
export {
  Account4 as Account,
  FilterOptions,
  FilterType,
  Memo3 as Memo,
  ModuleName,
  Node,
  Validator,
  ValidatorError
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL2NyZWF0ZS50cyIsICIuLi8uLi90cmFuc2FjdGlvbi9zcmMvYmF0Y2gudHMiLCAiLi4vLi4vc2hhcmVkL3NyYy9jb25zdGFudHMudHMiLCAiLi4vLi4vc2hhcmVkL3NyYy9yZXN1bHQudHMiLCAiLi4vLi4vc2hhcmVkL3NyYy9zaGFyZWQudHMiLCAiLi4vLi4vYWNjb3VudC9zcmMvYXNzb2NpYXRlZC50cyIsICIuLi8uLi9hY2NvdW50L3NyYy9rZXlwYWlyLnRzIiwgIi4uLy4uL2FjY291bnQvc3JjL3BkYS50cyIsICIuLi8uLi9hY2NvdW50L3NyYy9pbmRleC50cyIsICIuLi8uLi9jb252ZXJ0ZXIvc3JjL2NvbGxlY3Rpb24udHMiLCAiLi4vLi4vY29udmVydGVyL3NyYy9jcmVhdG9ycy50cyIsICIuLi8uLi9jb252ZXJ0ZXIvc3JjL3JveWFsdHkudHMiLCAiLi4vLi4vY29udmVydGVyL3NyYy9jb21wcmVzc2VkLW5mdC1tZXRhZGF0YS50cyIsICIuLi8uLi9jb252ZXJ0ZXIvc3JjL21lbW8udHMiLCAiLi4vLi4vY29udmVydGVyL3NyYy9taW50LnRzIiwgIi4uLy4uL2NvbnZlcnRlci9zcmMvY29sbGVjdGlvbi1kZXRhaWxzLnRzIiwgIi4uLy4uL2NvbnZlcnRlci9zcmMvdXNlcy50cyIsICIuLi8uLi9jb252ZXJ0ZXIvc3JjL3Rva2VuLW1ldGFkYXRhLnRzIiwgIi4uLy4uL2NvbnZlcnRlci9zcmMvcmVndWxhci1uZnQtbWV0YWRhdGEudHMiLCAiLi4vLi4vY29udmVydGVyL3NyYy9wcm9wZXJ0aWVzLnRzIiwgIi4uLy4uL2NvbnZlcnRlci9zcmMvdHJhbnNmZXItY2hlY2tlZC50cyIsICIuLi8uLi9jb252ZXJ0ZXIvc3JjL3RyYW5zZmVyLnRzIiwgIi4uLy4uL2NvbnZlcnRlci9zcmMvaW5kZXgudHMiLCAiLi4vLi4vdmFsaWRhdG9yL3NyYy9pbmRleC50cyIsICIuLi8uLi90eXBlcy9zcmMvdHJhbnNhY3Rpb24tZmlsdGVyL2luZGV4LnRzIiwgIi4uLy4uL2dsb2JhbC9zcmMvaW5kZXgudHMiLCAiLi4vLi4vbm9kZS9zcmMvaW5kZXgudHMiLCAiLi4vLi4vdHJhbnNhY3Rpb24vc3JjL2RlZmluZS50cyIsICIuLi8uLi90cmFuc2FjdGlvbi9zcmMvZGVmYXVsdC50cyIsICIuLi8uLi90cmFuc2FjdGlvbi9zcmMvbWludC50cyIsICIuLi8uLi90cmFuc2FjdGlvbi9zcmMvcGFydGlhbC1zaWduLnRzIiwgIi4uLy4uL3RyYW5zYWN0aW9uLWZpbHRlci9zcmMvc2lnbmF0dXJlcy50cyIsICIuLi8uLi90cmFuc2FjdGlvbi1maWx0ZXIvc3JjL3RyYW5zYWN0aW9uLWZpbHRlci50cyIsICIuLi9zcmMvZmluZC50cyIsICIuLi9zcmMvaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IFRyYW5zYWN0aW9uSW5zdHJ1Y3Rpb24gfSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuaW1wb3J0IHsgVHJhbnNhY3Rpb24gfSBmcm9tICd+L3RyYW5zYWN0aW9uJztcbmltcG9ydCB7IENvbnN0YW50cyB9IGZyb20gJ34vc2hhcmVkJztcbmltcG9ydCB7IFB1YmtleSwgU2VjcmV0IH0gZnJvbSAnfi90eXBlcy9hY2NvdW50JztcbmltcG9ydCBicyBmcm9tICdiczU4JztcblxuZXhwb3J0IG5hbWVzcGFjZSBNZW1vIHtcbiAgZXhwb3J0IGNvbnN0IGRlY29kZSA9IChlbmNvZGVkOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICBicy5kZWNvZGUoZW5jb2RlZCkudG9TdHJpbmcoKTtcblxuICBleHBvcnQgY29uc3QgZW5jb2RlID0gKGRhdGE6IHN0cmluZyk6IEJ1ZmZlciA9PiBCdWZmZXIuZnJvbShkYXRhKTtcblxuICAvLyB0b2RvOiB1c2UgVHJ5XG4gIGV4cG9ydCBjb25zdCBjcmVhdGUgPSAoXG4gICAgZGF0YTogc3RyaW5nLFxuICAgIG93bmVyOiBQdWJrZXksXG4gICAgc2lnbmVyOiBTZWNyZXQsXG4gICAgZmVlUGF5ZXI/OiBTZWNyZXQsXG4gICk6IFRyYW5zYWN0aW9uID0+IHtcbiAgICBjb25zdCBrZXkgPSBvd25lci50b1B1YmxpY0tleSgpXG4gICAgICA/IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBwdWJrZXk6IG93bmVyLnRvUHVibGljS2V5KCksXG4gICAgICAgICAgICBpc1NpZ25lcjogdHJ1ZSxcbiAgICAgICAgICAgIGlzV3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgXVxuICAgICAgOiBbXTtcblxuICAgIGNvbnN0IGluc3RydWN0aW9uID0gbmV3IFRyYW5zYWN0aW9uSW5zdHJ1Y3Rpb24oe1xuICAgICAgcHJvZ3JhbUlkOiBDb25zdGFudHMuTUVNT19QUk9HUkFNX0lELFxuICAgICAgZGF0YTogZW5jb2RlKGRhdGEpLFxuICAgICAga2V5czoga2V5LFxuICAgIH0pO1xuXG4gICAgY29uc3QgcGF5ZXIgPSBmZWVQYXllciB8fCBzaWduZXI7XG5cbiAgICByZXR1cm4gbmV3IFRyYW5zYWN0aW9uKFxuICAgICAgW2luc3RydWN0aW9uXSxcbiAgICAgIFtzaWduZXIudG9LZXlwYWlyKCldLFxuICAgICAgcGF5ZXIudG9LZXlwYWlyKCksXG4gICAgKTtcbiAgfTtcbn1cbiIsICJpbXBvcnQge1xuICBDb25maXJtT3B0aW9ucyxcbiAgc2VuZEFuZENvbmZpcm1UcmFuc2FjdGlvbixcbiAgVHJhbnNhY3Rpb24gYXMgVHgsXG4gIFRyYW5zYWN0aW9uU2lnbmF0dXJlLFxufSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnfi9ub2RlJztcbmltcG9ydCB7IFRyeSB9IGZyb20gJ34vc2hhcmVkJztcbmltcG9ydCB7IE1BWF9SRVRSSUVTIH0gZnJvbSAnLi9kZWZpbmUnO1xuaW1wb3J0IHsgVHJhbnNhY3Rpb24gfSBmcm9tICcuL2RlZmF1bHQnO1xuXG5leHBvcnQgY2xhc3MgQmF0Y2hUcmFuc2FjdGlvbiB7XG4gIHN0YXRpYyBzdWJtaXQgPSBhc3luYyAoYXJyOiBUcmFuc2FjdGlvbltdKTogUHJvbWlzZTxUcmFuc2FjdGlvblNpZ25hdHVyZT4gPT4ge1xuICAgIGxldCBpID0gMDtcbiAgICBmb3IgKGNvbnN0IGEgb2YgYXJyKSB7XG4gICAgICBpZiAoIWEuaW5zdHJ1Y3Rpb25zICYmICFhLnNpZ25lcnMpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgYG9ubHkgSW5zdHJ1Y3Rpb24gb2JqZWN0IHRoYXQgY2FuIHVzZSBiYXRjaFN1Ym1pdCgpLlxuICAgICAgICAgICAgSW5kZXg6ICR7aX0sIFNldCB2YWx1ZTogJHtKU09OLnN0cmluZ2lmeShhKX1gLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaSsrO1xuICAgIH1cblxuICAgIGNvbnN0IGluc3RydWN0aW9ucyA9IGFyci5mbGF0TWFwKChhKSA9PiBhLmluc3RydWN0aW9ucyk7XG4gICAgY29uc3Qgc2lnbmVycyA9IGFyci5mbGF0TWFwKChhKSA9PiBhLnNpZ25lcnMpO1xuICAgIGNvbnN0IGZlZVBheWVycyA9IGFyci5maWx0ZXIoKGEpID0+IGEuZmVlUGF5ZXIgIT09IHVuZGVmaW5lZCk7XG4gICAgbGV0IGZlZVBheWVyID0gc2lnbmVyc1swXTtcbiAgICBpZiAoZmVlUGF5ZXJzLmxlbmd0aCA+IDAgJiYgZmVlUGF5ZXJzWzBdLmZlZVBheWVyKSB7XG4gICAgICBmZWVQYXllciA9IGZlZVBheWVyc1swXS5mZWVQYXllcjtcbiAgICB9XG5cbiAgICBjb25zdCB0cmFuc2FjdGlvbiA9IG5ldyBUeCgpO1xuICAgIGxldCBmaW5hbFNpZ25lcnMgPSBzaWduZXJzO1xuICAgIGlmIChmZWVQYXllcikge1xuICAgICAgdHJhbnNhY3Rpb24uZmVlUGF5ZXIgPSBmZWVQYXllci5wdWJsaWNLZXk7XG4gICAgICBmaW5hbFNpZ25lcnMgPSBbZmVlUGF5ZXIsIC4uLnNpZ25lcnNdO1xuICAgIH1cbiAgICBpbnN0cnVjdGlvbnMubWFwKChpbnN0KSA9PiB0cmFuc2FjdGlvbi5hZGQoaW5zdCkpO1xuXG4gICAgY29uc3Qgb3B0aW9uczogQ29uZmlybU9wdGlvbnMgPSB7XG4gICAgICBtYXhSZXRyaWVzOiBNQVhfUkVUUklFUyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIGF3YWl0IHNlbmRBbmRDb25maXJtVHJhbnNhY3Rpb24oXG4gICAgICBOb2RlLmdldENvbm5lY3Rpb24oKSxcbiAgICAgIHRyYW5zYWN0aW9uLFxuICAgICAgZmluYWxTaWduZXJzLFxuICAgICAgb3B0aW9ucyxcbiAgICApO1xuICB9O1xufVxuXG4vKipcbiAqIHNlblRyYW5zYWN0aW9uKCkgVHJhbnNhY3Rpb25JbnN0cnVjdGlvblxuICpcbiAqIEBzZWUge0BsaW5rIHR5cGVzL2dsb2JhbC50c31cbiAqIEByZXR1cm5zIFByb21pc2U8UmVzdWx0PHN0cmluZywgRXJyb3I+PlxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHMtY29tbWVudCAqL1xuLyogQHRzLWlnbm9yZSAqL1xuQXJyYXkucHJvdG90eXBlLnN1Ym1pdCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgaW5zdHJ1Y3Rpb25zOiBUcmFuc2FjdGlvbltdID0gW107XG4gIC8vIGRvbnQgdXNlIGZvckVhY2hcbiAgLy8gSXQgaXMgbm90IHBvc3NpYmxlIHRvIHN0b3AgdGhlIHByb2Nlc3MgYnkgUkVUVVJOIGluIHRoZSBtaWRkbGUgb2YgdGhlIHByb2Nlc3MuXG4gIHJldHVybiBUcnkoYXN5bmMgKCkgPT4ge1xuICAgIGxldCBpID0gMDtcbiAgICBmb3IgKGNvbnN0IG9iaiBvZiB0aGlzKSB7XG4gICAgICBpZiAob2JqLmlzRXJyKSB7XG4gICAgICAgIGNvbnN0IGVycm9yTWVzczogc3RyaW5nID0gb2JqLmVycm9yLm1lc3NhZ2UgYXMgc3RyaW5nO1xuICAgICAgICB0aHJvdyBFcnJvcihgW0FycmF5IGluZGV4IG9mIGNhdWdodCAnUmVzdWx0LmVycic6ICR7aX1dJHtlcnJvck1lc3N9YCk7XG4gICAgICB9IGVsc2UgaWYgKG9iai5pc09rKSB7XG4gICAgICAgIGluc3RydWN0aW9ucy5wdXNoKG9iai52YWx1ZSBhcyBUcmFuc2FjdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChvYmogYXMgVHJhbnNhY3Rpb24pO1xuICAgICAgfVxuICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gQmF0Y2hUcmFuc2FjdGlvbi5zdWJtaXQoaW5zdHJ1Y3Rpb25zKTtcbiAgfSk7XG59O1xuIiwgImltcG9ydCB7IENvbW1pdG1lbnQsIFB1YmxpY0tleSB9IGZyb20gJ0Bzb2xhbmEvd2ViMy5qcyc7XG5pbXBvcnQgQ29uZmlnIGZyb20gJ0Bzb2xhbmEtc3VpdGUvY29uZmlnJztcblxuZXhwb3J0IG5hbWVzcGFjZSBDb25zdGFudHMge1xuICBleHBvcnQgY29uc3QgY3VycmVudENsdXN0ZXIgPSBDb25maWcuY2x1c3Rlci50eXBlO1xuICBleHBvcnQgY29uc3QgY3VzdG9tQ2x1c3RlclVybCA9IENvbmZpZy5jbHVzdGVyLmN1c3RvbUNsdXN0ZXJVcmw7XG4gIGV4cG9ydCBjb25zdCBpc0RlYnVnZ2luZyA9IENvbmZpZy5kZWJ1Z2dpbmc7XG4gIGV4cG9ydCBjb25zdCBuZnRTdG9yYWdlQXBpS2V5ID0gQ29uZmlnLm5mdHN0b3JhZ2UuYXBpa2V5O1xuXG4gIGV4cG9ydCBlbnVtIENsdXN0ZXIge1xuICAgIHByZCA9ICdtYWlubmV0LWJldGEnLFxuICAgIHByZE1ldGFwbGV4ID0gJ21haW5uZXQtYmV0YS1tZXRhcGxleCcsXG4gICAgZGV2ID0gJ2Rldm5ldCcsXG4gICAgdGVzdCA9ICd0ZXN0bmV0JyxcbiAgICBsb2NhbGhvc3QgPSAnbG9jYWxob3N0LWRldm5ldCcsXG4gIH1cblxuICBleHBvcnQgZW51bSBFbmRQb2ludFVybCB7XG4gICAgcHJkID0gJ2h0dHBzOi8vYXBpLm1haW5uZXQtYmV0YS5zb2xhbmEuY29tJyxcbiAgICBwcmRNZXRhcGxleCA9ICdodHRwczovL2FwaS5tZXRhcGxleC5zb2xhbmEuY29tJyxcbiAgICBkZXYgPSAnaHR0cHM6Ly9hcGkuZGV2bmV0LnNvbGFuYS5jb20nLFxuICAgIHRlc3QgPSAnaHR0cHM6Ly9hcGkudGVzdG5ldC5zb2xhbmEuY29tJyxcbiAgICBsb2NhbGhvc3QgPSAnaHR0cDovL2FwaS5kZXZuZXQuc29sYW5hLmNvbScsXG4gIH1cblxuICBleHBvcnQgY29uc3Qgc3dpdGNoQ2x1c3RlciA9IChwYXJhbToge1xuICAgIGNsdXN0ZXI/OiBzdHJpbmc7XG4gICAgY3VzdG9tQ2x1c3RlclVybD86IHN0cmluZ1tdO1xuICB9KTogc3RyaW5nID0+IHtcbiAgICBjb25zdCB7IGNsdXN0ZXI6IGVudiwgY3VzdG9tQ2x1c3RlclVybCB9ID0gcGFyYW07XG5cbiAgICAvLyBpZiBzZXR0ZWQgY3VzdG9tIHVybCwgbW9zdCBwcmlvcml0eVxuICAgIGlmIChjdXN0b21DbHVzdGVyVXJsICYmIGN1c3RvbUNsdXN0ZXJVcmwubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgaW5kZXggPSBEYXRlLm5vdygpICUgY3VzdG9tQ2x1c3RlclVybC5sZW5ndGg7XG4gICAgICByZXR1cm4gY3VzdG9tQ2x1c3RlclVybFtpbmRleF07XG4gICAgfVxuXG4gICAgc3dpdGNoIChlbnYpIHtcbiAgICAgIGNhc2UgQ29uc3RhbnRzLkNsdXN0ZXIucHJkOlxuICAgICAgICByZXR1cm4gQ29uc3RhbnRzLkVuZFBvaW50VXJsLnByZDtcbiAgICAgIGNhc2UgQ29uc3RhbnRzLkNsdXN0ZXIucHJkTWV0YXBsZXg6XG4gICAgICAgIHJldHVybiBDb25zdGFudHMuRW5kUG9pbnRVcmwucHJkTWV0YXBsZXg7XG4gICAgICBjYXNlIENvbnN0YW50cy5DbHVzdGVyLnRlc3Q6XG4gICAgICAgIHJldHVybiBDb25zdGFudHMuRW5kUG9pbnRVcmwudGVzdDtcbiAgICAgIGNhc2UgQ29uc3RhbnRzLkNsdXN0ZXIuZGV2OlxuICAgICAgICByZXR1cm4gQ29uc3RhbnRzLkVuZFBvaW50VXJsLmRldjtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBDb25zdGFudHMuRW5kUG9pbnRVcmwubG9jYWxob3N0O1xuICAgIH1cbiAgfTtcblxuICBleHBvcnQgY29uc3Qgc3dpdGNoQnVuZGxyID0gKGVudjogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBzd2l0Y2ggKGVudikge1xuICAgICAgY2FzZSBDb25zdGFudHMuQ2x1c3Rlci5kZXY6XG4gICAgICBjYXNlIENvbnN0YW50cy5DbHVzdGVyLnRlc3Q6XG4gICAgICBjYXNlIENvbnN0YW50cy5DbHVzdGVyLmxvY2FsaG9zdDpcbiAgICAgICAgcmV0dXJuICdodHRwczovL2Rldm5ldC5pcnlzLnh5eic7XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gRGF0ZS5ub3coKSAlIDI7XG4gICAgICAgIGNvbnN0IGNsdXN0ZXJzID0gWydodHRwczovL25vZGUxLmlyeXMueHl6JywgJ2h0dHBzOi8vbm9kZTIuaXJ5cy54eXonXTtcbiAgICAgICAgcmV0dXJuIGNsdXN0ZXJzW2luZGV4XTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZXhwb3J0IGNvbnN0IFdSQVBQRURfVE9LRU5fUFJPR1JBTV9JRCA9IG5ldyBQdWJsaWNLZXkoXG4gICAgJ1NvMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTInLFxuICApO1xuICBleHBvcnQgY29uc3QgTUVNT19QUk9HUkFNX0lEID0gbmV3IFB1YmxpY0tleShcbiAgICAnTWVtbzFVaGtKUmZIeXZMTWNWdWNKd3hYZXVENzI4RXFWRER3UUR4Rk1ObycsXG4gICk7XG4gIGV4cG9ydCBjb25zdCBNRVRBUExFWF9QUk9HUkFNX0lEID0gbmV3IFB1YmxpY0tleShcbiAgICAnbWV0YXFieHhVZXJkcTI4Y2oxUmJBV2tZUW0zeWJ6amI2YThidDUxOHgxcycsXG4gICk7XG4gIGV4cG9ydCBjb25zdCBDT01NSVRNRU5UOiBDb21taXRtZW50ID0gJ2NvbmZpcm1lZCc7XG4gIGV4cG9ydCBjb25zdCBORlRfU1RPUkFHRV9BUElfS0VZID1cbiAgICAnZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnpkV0lpT2lKa2FXUTZaWFJvY2pvd2VFUkdNamN5TjJWa09EWmhSR1UxUlRNeVpEWkRaRUpsT0RjMFl6UkZORGxFT0RZMU9XWm1PRU1pTENKcGMzTWlPaUp1Wm5RdGMzUnZjbUZuWlNJc0ltbGhkQ0k2TVRZeU1ESTJORGswTXpjd05pd2libUZ0WlNJNkltUmxiVzhpZlEuZDRKNzBtaWt4UkI4YTV2d051NlNPNUhEQThKYXVldXNlQWo3UV95dE1DRSc7XG4gIGV4cG9ydCBjb25zdCBORlRfU1RPUkFHRV9HQVRFV0FZX1VSTCA9ICdodHRwczovL2lwZnMuaW8vaXBmcyc7XG4gIGV4cG9ydCBjb25zdCBJUllTX0dBVEVXQVlfVVJMID0gJ2h0dHBzOi8vZ2F0ZXdheS5pcnlzLnh5eic7XG4gIGV4cG9ydCBjb25zdCBCVU5ETFJfTkVUV09SS19VUkwgPSBzd2l0Y2hCdW5kbHIoQ29uZmlnLmNsdXN0ZXIudHlwZSk7XG59XG4iLCAiLy8gZm9ya2VkOiBodHRwczovL2dpdGh1Yi5jb20vYmFkcmFwL3Jlc3VsdCwgdGhhbmsgeW91IGFkdmljZSAgQGp2aWlkZVxuaW1wb3J0IHsgVHJhbnNhY3Rpb25TaWduYXR1cmUgfSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuXG5hYnN0cmFjdCBjbGFzcyBBYnN0cmFjdFJlc3VsdDxULCBFIGV4dGVuZHMgRXJyb3I+IHtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9jaGFpbjxYLCBVIGV4dGVuZHMgRXJyb3I+KFxuICAgIG9rOiAodmFsdWU6IFQpID0+IFJlc3VsdDxYLCBVPixcbiAgICBlcnI6IChlcnJvcjogRSkgPT4gUmVzdWx0PFgsIFU+LFxuICApOiBSZXN1bHQ8WCwgVT47XG5cbiAgdW53cmFwKCk6IFQ7XG4gIHVud3JhcDxVPihvazogKHZhbHVlOiBUKSA9PiBVKTogVTtcbiAgdW53cmFwPFUsIFY+KG9rOiAodmFsdWU6IFQpID0+IFUsIGVycjogKGVycm9yOiBFKSA9PiBWKTogVSB8IFY7XG4gIC8vIHVuaWZpZWQtc2lnbmF0dXJlcy4gaW50byBsaW5lIDEwXG4gIC8vIHVud3JhcDxVPihvazogKHZhbHVlOiBUKSA9PiBVLCBlcnI6IChlcnJvcjogRSkgPT4gVSk6IFU7XG4gIHVud3JhcChvaz86ICh2YWx1ZTogVCkgPT4gdW5rbm93biwgZXJyPzogKGVycm9yOiBFKSA9PiB1bmtub3duKTogdW5rbm93biB7XG4gICAgY29uc3QgciA9IHRoaXMuX2NoYWluKFxuICAgICAgKHZhbHVlKSA9PiBSZXN1bHQub2sob2sgPyBvayh2YWx1ZSkgOiB2YWx1ZSksXG4gICAgICAoZXJyb3IpID0+IChlcnIgPyBSZXN1bHQub2soZXJyKGVycm9yKSkgOiBSZXN1bHQuZXJyKGVycm9yKSksXG4gICAgKTtcbiAgICBpZiAoci5pc0Vycikge1xuICAgICAgdGhyb3cgci5lcnJvcjtcbiAgICB9XG4gICAgcmV0dXJuIHIudmFsdWU7XG4gIH1cblxuICAvLy8vIG1hcCAvLy8vXG4gIG1hcDxVPihvazogKHZhbHVlOiBUKSA9PiBVKTogUmVzdWx0PFUsIEU+O1xuICBtYXA8VSwgRiBleHRlbmRzIEVycm9yPihcbiAgICBvazogKHZhbHVlOiBUKSA9PiBVLFxuICAgIGVycjogKGVycm9yOiBFKSA9PiBGLFxuICApOiBSZXN1bHQ8VSwgRj47XG4gIG1hcChvazogKHZhbHVlOiBUKSA9PiB1bmtub3duLCBlcnI/OiAoZXJyb3I6IEUpID0+IEVycm9yKTogUmVzdWx0PHVua25vd24+IHtcbiAgICByZXR1cm4gdGhpcy5fY2hhaW4oXG4gICAgICAodmFsdWUpID0+IFJlc3VsdC5vayhvayh2YWx1ZSkpLFxuICAgICAgKGVycm9yKSA9PiBSZXN1bHQuZXJyKGVyciA/IGVycihlcnJvcikgOiBlcnJvciksXG4gICAgKTtcbiAgfVxuXG4gIC8vLy8gY2hhaW4gLy8vL1xuICBjaGFpbjxYPihvazogKHZhbHVlOiBUKSA9PiBSZXN1bHQ8WCwgRT4pOiBSZXN1bHQ8WCwgRT47XG4gIGNoYWluPFg+KG9rOiAodmFsdWU6IFQpID0+IFJlc3VsdDxYLCBFPik6IC8vIHVuaWZpZWQtc2lnbmF0dXJlcy4gaW50byBsaW5lIDM3XG4gIC8vIGVycjogKGVycm9yOiBFKSA9PiBSZXN1bHQ8WCwgRT5cbiAgUmVzdWx0PFgsIEU+O1xuICBjaGFpbjxYLCBVIGV4dGVuZHMgRXJyb3I+KFxuICAgIG9rOiAodmFsdWU6IFQpID0+IFJlc3VsdDxYLCBVPixcbiAgICBlcnI6IChlcnJvcjogRSkgPT4gUmVzdWx0PFgsIFU+LFxuICApOiBSZXN1bHQ8WCwgVT47XG4gIGNoYWluKFxuICAgIG9rOiAodmFsdWU6IFQpID0+IFJlc3VsdDx1bmtub3duPixcbiAgICBlcnI/OiAoZXJyb3I6IEUpID0+IFJlc3VsdDx1bmtub3duPixcbiAgKTogUmVzdWx0PHVua25vd24+IHtcbiAgICByZXR1cm4gdGhpcy5fY2hhaW4ob2ssIGVyciB8fCAoKGVycm9yKSA9PiBSZXN1bHQuZXJyKGVycm9yKSkpO1xuICB9XG5cbiAgLy8vLyBtYXRjaCAvLy8vXG4gIG1hdGNoPFUsIEY+KG9rOiAodmFsdWU6IFQpID0+IFUsIGVycjogKGVycm9yOiBFKSA9PiBGKTogdm9pZCB8IFByb21pc2U8dm9pZD47XG5cbiAgbWF0Y2goXG4gICAgb2s6ICh2YWx1ZTogVCkgPT4gdW5rbm93bixcbiAgICBlcnI6IChlcnJvcjogRSkgPT4gdW5rbm93bixcbiAgKTogdm9pZCB8IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuX2NoYWluKFxuICAgICAgKHZhbHVlKSA9PiBSZXN1bHQub2sob2sodmFsdWUpKSxcbiAgICAgIChlcnJvcikgPT4gUmVzdWx0LmVycihlcnIoZXJyb3IpIGFzIEVycm9yKSxcbiAgICApO1xuICB9XG5cbiAgLy8vIHN1Ym1pdCAoYWxpYXMgSW5zdHJ1Y3Rpb24uc3VibWl0KSAvLy8vXG4gIGFzeW5jIHN1Ym1pdCgpOiBQcm9taXNlPFJlc3VsdDxUcmFuc2FjdGlvblNpZ25hdHVyZSwgRXJyb3I+PiB7XG4gICAgdHJ5IHtcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbiAgICAgIGNvbnN0IGluc3RydWN0aW9uID0gdGhpcy51bndyYXAoKSBhcyBhbnk7XG4gICAgICBpZiAoaW5zdHJ1Y3Rpb24uaW5zdHJ1Y3Rpb25zICYmIGluc3RydWN0aW9uLnNpZ25lcnMpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IGluc3RydWN0aW9uLnN1Ym1pdCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFJlc3VsdC5lcnIoRXJyb3IoJ09ubHkgSW5zdHJ1Y3Rpb24gb2JqZWN0JykpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIFJlc3VsdC5lcnIoZXJyIGFzIEVycm9yKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgSW50ZXJuYWxPazxULCBFIGV4dGVuZHMgRXJyb3I+IGV4dGVuZHMgQWJzdHJhY3RSZXN1bHQ8VCwgRT4ge1xuICByZWFkb25seSBpc09rID0gdHJ1ZTtcbiAgcmVhZG9ubHkgaXNFcnIgPSBmYWxzZTtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgdmFsdWU6IFQpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzICovXG4gIHByb3RlY3RlZCBfY2hhaW48WCwgVSBleHRlbmRzIEVycm9yPihcbiAgICBvazogKHZhbHVlOiBUKSA9PiBSZXN1bHQ8WCwgVT4sXG4gICAgX2VycjogKGVycm9yOiBFKSA9PiBSZXN1bHQ8WCwgVT4sXG4gICk6IFJlc3VsdDxYLCBVPiB7XG4gICAgcmV0dXJuIG9rKHRoaXMudmFsdWUpO1xuICB9XG59XG5cbmNsYXNzIEludGVybmFsRXJyPFQsIEUgZXh0ZW5kcyBFcnJvcj4gZXh0ZW5kcyBBYnN0cmFjdFJlc3VsdDxULCBFPiB7XG4gIHJlYWRvbmx5IGlzT2sgPSBmYWxzZTtcbiAgcmVhZG9ubHkgaXNFcnIgPSB0cnVlO1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBlcnJvcjogRSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NoYWluPFgsIFUgZXh0ZW5kcyBFcnJvcj4oXG4gICAgX29rOiAodmFsdWU6IFQpID0+IFJlc3VsdDxYLCBVPixcbiAgICBlcnI6IChlcnJvcjogRSkgPT4gUmVzdWx0PFgsIFU+LFxuICApOiBSZXN1bHQ8WCwgVT4ge1xuICAgIHJldHVybiBlcnIodGhpcy5lcnJvcik7XG4gIH1cbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBSZXN1bHQge1xuICBleHBvcnQgdHlwZSBPazxULCBFIGV4dGVuZHMgRXJyb3I+ID0gSW50ZXJuYWxPazxULCBFPjtcbiAgZXhwb3J0IHR5cGUgRXJyPFQsIEUgZXh0ZW5kcyBFcnJvcj4gPSBJbnRlcm5hbEVycjxULCBFPjtcblxuICBleHBvcnQgZnVuY3Rpb24gb2s8VCwgRSBleHRlbmRzIEVycm9yPih2YWx1ZTogVCk6IFJlc3VsdDxULCBFPiB7XG4gICAgcmV0dXJuIG5ldyBJbnRlcm5hbE9rKHZhbHVlKTtcbiAgfVxuICBleHBvcnQgZnVuY3Rpb24gZXJyPEUgZXh0ZW5kcyBFcnJvciwgVCA9IG5ldmVyPihlcnJvcj86IEUpOiBSZXN1bHQ8VCwgRT47XG4gIGV4cG9ydCBmdW5jdGlvbiBlcnI8RSBleHRlbmRzIEVycm9yLCBUID0gbmV2ZXI+KGVycm9yOiBFKTogUmVzdWx0PFQsIEU+IHtcbiAgICByZXR1cm4gbmV3IEludGVybmFsRXJyKGVycm9yIHx8IEVycm9yKCkpO1xuICB9XG5cbiAgdHlwZSBVID0gUmVzdWx0PHVua25vd24+O1xuICBleHBvcnQgZnVuY3Rpb24gYWxsPFxuICAgIFIwIGV4dGVuZHMgVSxcbiAgICBSMSBleHRlbmRzIFUsXG4gICAgUjIgZXh0ZW5kcyBVLFxuICAgIFIzIGV4dGVuZHMgVSxcbiAgICBSNCBleHRlbmRzIFUsXG4gICAgUjUgZXh0ZW5kcyBVLFxuICAgIFI2IGV4dGVuZHMgVSxcbiAgICBSNyBleHRlbmRzIFUsXG4gICAgUjggZXh0ZW5kcyBVLFxuICAgIFI5IGV4dGVuZHMgVSxcbiAgICBSMTAgZXh0ZW5kcyBVLFxuICAgIFIxMSBleHRlbmRzIFUsXG4gICAgUjEyIGV4dGVuZHMgVSxcbiAgICBSMTMgZXh0ZW5kcyBVLFxuICAgIFIxNCBleHRlbmRzIFUsXG4gICAgUjE1IGV4dGVuZHMgVSxcbiAgPihcbiAgICBvYmo6IFtSMCwgUjEsIFIyLCBSMywgUjQsIFI1LCBSNiwgUjcsIFI4LCBSOSwgUjEwLCBSMTEsIFIxMiwgUjEzLCBSMTQsIFIxNV0sXG4gICk6IFJlc3VsdDxcbiAgICBbXG4gICAgICBPa1R5cGU8UjA+LFxuICAgICAgT2tUeXBlPFIxPixcbiAgICAgIE9rVHlwZTxSMj4sXG4gICAgICBPa1R5cGU8UjM+LFxuICAgICAgT2tUeXBlPFI0PixcbiAgICAgIE9rVHlwZTxSNT4sXG4gICAgICBPa1R5cGU8UjY+LFxuICAgICAgT2tUeXBlPFI3PixcbiAgICAgIE9rVHlwZTxSOD4sXG4gICAgICBPa1R5cGU8Ujk+LFxuICAgICAgT2tUeXBlPFIxMD4sXG4gICAgICBPa1R5cGU8UjExPixcbiAgICAgIE9rVHlwZTxSMTI+LFxuICAgICAgT2tUeXBlPFIxMz4sXG4gICAgICBPa1R5cGU8UjE0PixcbiAgICAgIE9rVHlwZTxSMTU+LFxuICAgIF0sXG4gICAgRXJyVHlwZTxcbiAgICAgIHwgUjBcbiAgICAgIHwgUjFcbiAgICAgIHwgUjJcbiAgICAgIHwgUjNcbiAgICAgIHwgUjRcbiAgICAgIHwgUjVcbiAgICAgIHwgUjZcbiAgICAgIHwgUjdcbiAgICAgIHwgUjhcbiAgICAgIHwgUjlcbiAgICAgIHwgUjEwXG4gICAgICB8IFIxMVxuICAgICAgfCBSMTJcbiAgICAgIHwgUjEzXG4gICAgICB8IFIxNFxuICAgICAgfCBSMTVcbiAgICA+XG4gID47XG4gIGV4cG9ydCBmdW5jdGlvbiBhbGw8XG4gICAgUjAgZXh0ZW5kcyBVLFxuICAgIFIxIGV4dGVuZHMgVSxcbiAgICBSMiBleHRlbmRzIFUsXG4gICAgUjMgZXh0ZW5kcyBVLFxuICAgIFI0IGV4dGVuZHMgVSxcbiAgICBSNSBleHRlbmRzIFUsXG4gICAgUjYgZXh0ZW5kcyBVLFxuICAgIFI3IGV4dGVuZHMgVSxcbiAgICBSOCBleHRlbmRzIFUsXG4gICAgUjkgZXh0ZW5kcyBVLFxuICAgIFIxMCBleHRlbmRzIFUsXG4gICAgUjExIGV4dGVuZHMgVSxcbiAgICBSMTIgZXh0ZW5kcyBVLFxuICAgIFIxMyBleHRlbmRzIFUsXG4gICAgUjE0IGV4dGVuZHMgVSxcbiAgPihcbiAgICBvYmo6IFtSMCwgUjEsIFIyLCBSMywgUjQsIFI1LCBSNiwgUjcsIFI4LCBSOSwgUjEwLCBSMTEsIFIxMiwgUjEzLCBSMTRdLFxuICApOiBSZXN1bHQ8XG4gICAgW1xuICAgICAgT2tUeXBlPFIwPixcbiAgICAgIE9rVHlwZTxSMT4sXG4gICAgICBPa1R5cGU8UjI+LFxuICAgICAgT2tUeXBlPFIzPixcbiAgICAgIE9rVHlwZTxSND4sXG4gICAgICBPa1R5cGU8UjU+LFxuICAgICAgT2tUeXBlPFI2PixcbiAgICAgIE9rVHlwZTxSNz4sXG4gICAgICBPa1R5cGU8Ujg+LFxuICAgICAgT2tUeXBlPFI5PixcbiAgICAgIE9rVHlwZTxSMTA+LFxuICAgICAgT2tUeXBlPFIxMT4sXG4gICAgICBPa1R5cGU8UjEyPixcbiAgICAgIE9rVHlwZTxSMTM+LFxuICAgICAgT2tUeXBlPFIxND4sXG4gICAgXSxcbiAgICBFcnJUeXBlPFxuICAgICAgfCBSMFxuICAgICAgfCBSMVxuICAgICAgfCBSMlxuICAgICAgfCBSM1xuICAgICAgfCBSNFxuICAgICAgfCBSNVxuICAgICAgfCBSNlxuICAgICAgfCBSN1xuICAgICAgfCBSOFxuICAgICAgfCBSOVxuICAgICAgfCBSMTBcbiAgICAgIHwgUjExXG4gICAgICB8IFIxMlxuICAgICAgfCBSMTNcbiAgICAgIHwgUjE0XG4gICAgPlxuICA+O1xuICBleHBvcnQgZnVuY3Rpb24gYWxsPFxuICAgIFIwIGV4dGVuZHMgVSxcbiAgICBSMSBleHRlbmRzIFUsXG4gICAgUjIgZXh0ZW5kcyBVLFxuICAgIFIzIGV4dGVuZHMgVSxcbiAgICBSNCBleHRlbmRzIFUsXG4gICAgUjUgZXh0ZW5kcyBVLFxuICAgIFI2IGV4dGVuZHMgVSxcbiAgICBSNyBleHRlbmRzIFUsXG4gICAgUjggZXh0ZW5kcyBVLFxuICAgIFI5IGV4dGVuZHMgVSxcbiAgICBSMTAgZXh0ZW5kcyBVLFxuICAgIFIxMSBleHRlbmRzIFUsXG4gICAgUjEyIGV4dGVuZHMgVSxcbiAgICBSMTMgZXh0ZW5kcyBVLFxuICA+KFxuICAgIG9iajogW1IwLCBSMSwgUjIsIFIzLCBSNCwgUjUsIFI2LCBSNywgUjgsIFI5LCBSMTAsIFIxMSwgUjEyLCBSMTNdLFxuICApOiBSZXN1bHQ8XG4gICAgW1xuICAgICAgT2tUeXBlPFIwPixcbiAgICAgIE9rVHlwZTxSMT4sXG4gICAgICBPa1R5cGU8UjI+LFxuICAgICAgT2tUeXBlPFIzPixcbiAgICAgIE9rVHlwZTxSND4sXG4gICAgICBPa1R5cGU8UjU+LFxuICAgICAgT2tUeXBlPFI2PixcbiAgICAgIE9rVHlwZTxSNz4sXG4gICAgICBPa1R5cGU8Ujg+LFxuICAgICAgT2tUeXBlPFI5PixcbiAgICAgIE9rVHlwZTxSMTA+LFxuICAgICAgT2tUeXBlPFIxMT4sXG4gICAgICBPa1R5cGU8UjEyPixcbiAgICAgIE9rVHlwZTxSMTM+LFxuICAgIF0sXG4gICAgRXJyVHlwZTxcbiAgICAgIFIwIHwgUjEgfCBSMiB8IFIzIHwgUjQgfCBSNSB8IFI2IHwgUjcgfCBSOCB8IFI5IHwgUjEwIHwgUjExIHwgUjEyIHwgUjEzXG4gICAgPlxuICA+O1xuICBleHBvcnQgZnVuY3Rpb24gYWxsPFxuICAgIFIwIGV4dGVuZHMgVSxcbiAgICBSMSBleHRlbmRzIFUsXG4gICAgUjIgZXh0ZW5kcyBVLFxuICAgIFIzIGV4dGVuZHMgVSxcbiAgICBSNCBleHRlbmRzIFUsXG4gICAgUjUgZXh0ZW5kcyBVLFxuICAgIFI2IGV4dGVuZHMgVSxcbiAgICBSNyBleHRlbmRzIFUsXG4gICAgUjggZXh0ZW5kcyBVLFxuICAgIFI5IGV4dGVuZHMgVSxcbiAgICBSMTAgZXh0ZW5kcyBVLFxuICAgIFIxMSBleHRlbmRzIFUsXG4gICAgUjEyIGV4dGVuZHMgVSxcbiAgPihcbiAgICBvYmo6IFtSMCwgUjEsIFIyLCBSMywgUjQsIFI1LCBSNiwgUjcsIFI4LCBSOSwgUjEwLCBSMTEsIFIxMl0sXG4gICk6IFJlc3VsdDxcbiAgICBbXG4gICAgICBPa1R5cGU8UjA+LFxuICAgICAgT2tUeXBlPFIxPixcbiAgICAgIE9rVHlwZTxSMj4sXG4gICAgICBPa1R5cGU8UjM+LFxuICAgICAgT2tUeXBlPFI0PixcbiAgICAgIE9rVHlwZTxSNT4sXG4gICAgICBPa1R5cGU8UjY+LFxuICAgICAgT2tUeXBlPFI3PixcbiAgICAgIE9rVHlwZTxSOD4sXG4gICAgICBPa1R5cGU8Ujk+LFxuICAgICAgT2tUeXBlPFIxMD4sXG4gICAgICBPa1R5cGU8UjExPixcbiAgICBdLFxuICAgIEVyclR5cGU8UjAgfCBSMSB8IFIyIHwgUjMgfCBSNCB8IFI1IHwgUjYgfCBSNyB8IFI4IHwgUjkgfCBSMTAgfCBSMTE+XG4gID47XG4gIGV4cG9ydCBmdW5jdGlvbiBhbGw8XG4gICAgUjAgZXh0ZW5kcyBVLFxuICAgIFIxIGV4dGVuZHMgVSxcbiAgICBSMiBleHRlbmRzIFUsXG4gICAgUjMgZXh0ZW5kcyBVLFxuICAgIFI0IGV4dGVuZHMgVSxcbiAgICBSNSBleHRlbmRzIFUsXG4gICAgUjYgZXh0ZW5kcyBVLFxuICAgIFI3IGV4dGVuZHMgVSxcbiAgICBSOCBleHRlbmRzIFUsXG4gICAgUjkgZXh0ZW5kcyBVLFxuICAgIFIxMCBleHRlbmRzIFUsXG4gICAgUjExIGV4dGVuZHMgVSxcbiAgPihcbiAgICBvYmo6IFtSMCwgUjEsIFIyLCBSMywgUjQsIFI1LCBSNiwgUjcsIFI4LCBSOSwgUjEwLCBSMTFdLFxuICApOiBSZXN1bHQ8XG4gICAgW1xuICAgICAgT2tUeXBlPFIwPixcbiAgICAgIE9rVHlwZTxSMT4sXG4gICAgICBPa1R5cGU8UjI+LFxuICAgICAgT2tUeXBlPFIzPixcbiAgICAgIE9rVHlwZTxSND4sXG4gICAgICBPa1R5cGU8UjU+LFxuICAgICAgT2tUeXBlPFI2PixcbiAgICAgIE9rVHlwZTxSNz4sXG4gICAgICBPa1R5cGU8Ujg+LFxuICAgICAgT2tUeXBlPFI5PixcbiAgICAgIE9rVHlwZTxSMTA+LFxuICAgICAgT2tUeXBlPFIxMT4sXG4gICAgXSxcbiAgICBFcnJUeXBlPFIwIHwgUjEgfCBSMiB8IFIzIHwgUjQgfCBSNSB8IFI2IHwgUjcgfCBSOCB8IFI5IHwgUjEwIHwgUjExPlxuICA+O1xuICBleHBvcnQgZnVuY3Rpb24gYWxsPFxuICAgIFIwIGV4dGVuZHMgVSxcbiAgICBSMSBleHRlbmRzIFUsXG4gICAgUjIgZXh0ZW5kcyBVLFxuICAgIFIzIGV4dGVuZHMgVSxcbiAgICBSNCBleHRlbmRzIFUsXG4gICAgUjUgZXh0ZW5kcyBVLFxuICAgIFI2IGV4dGVuZHMgVSxcbiAgICBSNyBleHRlbmRzIFUsXG4gICAgUjggZXh0ZW5kcyBVLFxuICAgIFI5IGV4dGVuZHMgVSxcbiAgICBSMTAgZXh0ZW5kcyBVLFxuICA+KFxuICAgIG9iajogW1IwLCBSMSwgUjIsIFIzLCBSNCwgUjUsIFI2LCBSNywgUjgsIFI5LCBSMTBdLFxuICApOiBSZXN1bHQ8XG4gICAgW1xuICAgICAgT2tUeXBlPFIwPixcbiAgICAgIE9rVHlwZTxSMT4sXG4gICAgICBPa1R5cGU8UjI+LFxuICAgICAgT2tUeXBlPFIzPixcbiAgICAgIE9rVHlwZTxSND4sXG4gICAgICBPa1R5cGU8UjU+LFxuICAgICAgT2tUeXBlPFI2PixcbiAgICAgIE9rVHlwZTxSNz4sXG4gICAgICBPa1R5cGU8Ujg+LFxuICAgICAgT2tUeXBlPFI5PixcbiAgICAgIE9rVHlwZTxSMTA+LFxuICAgIF0sXG4gICAgRXJyVHlwZTxSMCB8IFIxIHwgUjIgfCBSMyB8IFI0IHwgUjUgfCBSNiB8IFI3IHwgUjggfCBSOSB8IFIxMD5cbiAgPjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGFsbDxcbiAgICBSMCBleHRlbmRzIFUsXG4gICAgUjEgZXh0ZW5kcyBVLFxuICAgIFIyIGV4dGVuZHMgVSxcbiAgICBSMyBleHRlbmRzIFUsXG4gICAgUjQgZXh0ZW5kcyBVLFxuICAgIFI1IGV4dGVuZHMgVSxcbiAgICBSNiBleHRlbmRzIFUsXG4gICAgUjcgZXh0ZW5kcyBVLFxuICAgIFI4IGV4dGVuZHMgVSxcbiAgICBSOSBleHRlbmRzIFUsXG4gID4oXG4gICAgb2JqOiBbUjAsIFIxLCBSMiwgUjMsIFI0LCBSNSwgUjYsIFI3LCBSOCwgUjldLFxuICApOiBSZXN1bHQ8XG4gICAgW1xuICAgICAgT2tUeXBlPFIwPixcbiAgICAgIE9rVHlwZTxSMT4sXG4gICAgICBPa1R5cGU8UjI+LFxuICAgICAgT2tUeXBlPFIzPixcbiAgICAgIE9rVHlwZTxSND4sXG4gICAgICBPa1R5cGU8UjU+LFxuICAgICAgT2tUeXBlPFI2PixcbiAgICAgIE9rVHlwZTxSNz4sXG4gICAgICBPa1R5cGU8Ujg+LFxuICAgICAgT2tUeXBlPFI5PixcbiAgICBdLFxuICAgIEVyclR5cGU8UjAgfCBSMSB8IFIyIHwgUjMgfCBSNCB8IFI1IHwgUjYgfCBSNyB8IFI4IHwgUjk+XG4gID47XG4gIGV4cG9ydCBmdW5jdGlvbiBhbGw8XG4gICAgUjAgZXh0ZW5kcyBVLFxuICAgIFIxIGV4dGVuZHMgVSxcbiAgICBSMiBleHRlbmRzIFUsXG4gICAgUjMgZXh0ZW5kcyBVLFxuICAgIFI0IGV4dGVuZHMgVSxcbiAgICBSNSBleHRlbmRzIFUsXG4gICAgUjYgZXh0ZW5kcyBVLFxuICAgIFI3IGV4dGVuZHMgVSxcbiAgICBSOCBleHRlbmRzIFUsXG4gID4oXG4gICAgb2JqOiBbUjAsIFIxLCBSMiwgUjMsIFI0LCBSNSwgUjYsIFI3LCBSOF0sXG4gICk6IFJlc3VsdDxcbiAgICBbXG4gICAgICBPa1R5cGU8UjA+LFxuICAgICAgT2tUeXBlPFIxPixcbiAgICAgIE9rVHlwZTxSMj4sXG4gICAgICBPa1R5cGU8UjM+LFxuICAgICAgT2tUeXBlPFI0PixcbiAgICAgIE9rVHlwZTxSNT4sXG4gICAgICBPa1R5cGU8UjY+LFxuICAgICAgT2tUeXBlPFI3PixcbiAgICAgIE9rVHlwZTxSOD4sXG4gICAgXSxcbiAgICBFcnJUeXBlPFIwIHwgUjEgfCBSMiB8IFIzIHwgUjQgfCBSNSB8IFI2IHwgUjcgfCBSOD5cbiAgPjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGFsbDxcbiAgICBSMCBleHRlbmRzIFUsXG4gICAgUjEgZXh0ZW5kcyBVLFxuICAgIFIyIGV4dGVuZHMgVSxcbiAgICBSMyBleHRlbmRzIFUsXG4gICAgUjQgZXh0ZW5kcyBVLFxuICAgIFI1IGV4dGVuZHMgVSxcbiAgICBSNiBleHRlbmRzIFUsXG4gICAgUjcgZXh0ZW5kcyBVLFxuICA+KFxuICAgIG9iajogW1IwLCBSMSwgUjIsIFIzLCBSNCwgUjUsIFI2LCBSN10sXG4gICk6IFJlc3VsdDxcbiAgICBbXG4gICAgICBPa1R5cGU8UjA+LFxuICAgICAgT2tUeXBlPFIxPixcbiAgICAgIE9rVHlwZTxSMj4sXG4gICAgICBPa1R5cGU8UjM+LFxuICAgICAgT2tUeXBlPFI0PixcbiAgICAgIE9rVHlwZTxSNT4sXG4gICAgICBPa1R5cGU8UjY+LFxuICAgICAgT2tUeXBlPFI3PixcbiAgICBdLFxuICAgIEVyclR5cGU8UjAgfCBSMSB8IFIyIHwgUjMgfCBSNCB8IFI1IHwgUjYgfCBSNz5cbiAgPjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGFsbDxcbiAgICBSMCBleHRlbmRzIFUsXG4gICAgUjEgZXh0ZW5kcyBVLFxuICAgIFIyIGV4dGVuZHMgVSxcbiAgICBSMyBleHRlbmRzIFUsXG4gICAgUjQgZXh0ZW5kcyBVLFxuICAgIFI1IGV4dGVuZHMgVSxcbiAgICBSNiBleHRlbmRzIFUsXG4gID4oXG4gICAgb2JqOiBbUjAsIFIxLCBSMiwgUjMsIFI0LCBSNSwgUjZdLFxuICApOiBSZXN1bHQ8XG4gICAgW1xuICAgICAgT2tUeXBlPFIwPixcbiAgICAgIE9rVHlwZTxSMT4sXG4gICAgICBPa1R5cGU8UjI+LFxuICAgICAgT2tUeXBlPFIzPixcbiAgICAgIE9rVHlwZTxSND4sXG4gICAgICBPa1R5cGU8UjU+LFxuICAgICAgT2tUeXBlPFI2PixcbiAgICBdLFxuICAgIEVyclR5cGU8UjAgfCBSMSB8IFIyIHwgUjMgfCBSNCB8IFI1IHwgUjY+XG4gID47XG4gIGV4cG9ydCBmdW5jdGlvbiBhbGw8XG4gICAgUjAgZXh0ZW5kcyBVLFxuICAgIFIxIGV4dGVuZHMgVSxcbiAgICBSMiBleHRlbmRzIFUsXG4gICAgUjMgZXh0ZW5kcyBVLFxuICAgIFI0IGV4dGVuZHMgVSxcbiAgICBSNSBleHRlbmRzIFUsXG4gID4oXG4gICAgb2JqOiBbUjAsIFIxLCBSMiwgUjMsIFI0LCBSNV0sXG4gICk6IFJlc3VsdDxcbiAgICBbT2tUeXBlPFIwPiwgT2tUeXBlPFIxPiwgT2tUeXBlPFIyPiwgT2tUeXBlPFIzPiwgT2tUeXBlPFI0PiwgT2tUeXBlPFI1Pl0sXG4gICAgRXJyVHlwZTxSMCB8IFIxIHwgUjIgfCBSMyB8IFI0IHwgUjU+XG4gID47XG4gIGV4cG9ydCBmdW5jdGlvbiBhbGw8XG4gICAgUjAgZXh0ZW5kcyBVLFxuICAgIFIxIGV4dGVuZHMgVSxcbiAgICBSMiBleHRlbmRzIFUsXG4gICAgUjMgZXh0ZW5kcyBVLFxuICAgIFI0IGV4dGVuZHMgVSxcbiAgPihcbiAgICBvYmo6IFtSMCwgUjEsIFIyLCBSMywgUjRdLFxuICApOiBSZXN1bHQ8XG4gICAgW09rVHlwZTxSMD4sIE9rVHlwZTxSMT4sIE9rVHlwZTxSMj4sIE9rVHlwZTxSMz4sIE9rVHlwZTxSND5dLFxuICAgIEVyclR5cGU8UjAgfCBSMSB8IFIyIHwgUjMgfCBSND5cbiAgPjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGFsbDxSMCBleHRlbmRzIFUsIFIxIGV4dGVuZHMgVSwgUjIgZXh0ZW5kcyBVLCBSMyBleHRlbmRzIFU+KFxuICAgIG9iajogW1IwLCBSMSwgUjIsIFIzXSxcbiAgKTogUmVzdWx0PFxuICAgIFtPa1R5cGU8UjA+LCBPa1R5cGU8UjE+LCBPa1R5cGU8UjI+LCBPa1R5cGU8UjM+XSxcbiAgICBFcnJUeXBlPFIwIHwgUjEgfCBSMiB8IFIzPlxuICA+O1xuICBleHBvcnQgZnVuY3Rpb24gYWxsPFIwIGV4dGVuZHMgVSwgUjEgZXh0ZW5kcyBVLCBSMiBleHRlbmRzIFU+KFxuICAgIG9iajogW1IwLCBSMSwgUjJdLFxuICApOiBSZXN1bHQ8W09rVHlwZTxSMD4sIE9rVHlwZTxSMT4sIE9rVHlwZTxSMj5dLCBFcnJUeXBlPFIwIHwgUjEgfCBSMj4+O1xuICBleHBvcnQgZnVuY3Rpb24gYWxsPFIwIGV4dGVuZHMgVSwgUjEgZXh0ZW5kcyBVPihcbiAgICBvYmo6IFtSMCwgUjFdLFxuICApOiBSZXN1bHQ8W09rVHlwZTxSMD4sIE9rVHlwZTxSMT5dLCBFcnJUeXBlPFIwIHwgUjE+PjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGFsbDxSMCBleHRlbmRzIFU+KFxuICAgIG9iajogW1IwXSxcbiAgKTogUmVzdWx0PFtPa1R5cGU8UjA+XSwgRXJyVHlwZTxSMD4+O1xuICBleHBvcnQgZnVuY3Rpb24gYWxsKG9iajogW10pOiBSZXN1bHQ8W10+O1xuICBleHBvcnQgZnVuY3Rpb24gYWxsPFQgZXh0ZW5kcyBVW10gfCBSZWNvcmQ8c3RyaW5nLCBVPj4oXG4gICAgb2JqOiBULFxuICApOiBSZXN1bHQ8XG4gICAgeyBbSyBpbiBrZXlvZiBUXTogVFtLXSBleHRlbmRzIFJlc3VsdDxpbmZlciBJPiA/IEkgOiBuZXZlciB9LFxuICAgIHtcbiAgICAgIFtLIGluIGtleW9mIFRdOiBUW0tdIGV4dGVuZHMgUmVzdWx0PHVua25vd24sIGluZmVyIEU+ID8gRSA6IG5ldmVyO1xuICAgIH1ba2V5b2YgVF1cbiAgPjtcbiAgZXhwb3J0IGZ1bmN0aW9uIGFsbChvYmo6IHVua25vd24pOiB1bmtub3duIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgICBjb25zdCByZXNBcnIgPSBbXTtcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBvYmopIHtcbiAgICAgICAgaWYgKGl0ZW0uaXNFcnIpIHtcbiAgICAgICAgICByZXR1cm4gaXRlbSBhcyB1bmtub3duO1xuICAgICAgICB9XG4gICAgICAgIHJlc0Fyci5wdXNoKGl0ZW0udmFsdWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFJlc3VsdC5vayhyZXNBcnIpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fTtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqIGFzIFJlY29yZDxzdHJpbmcsIFU+KTtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XG4gICAgICBjb25zdCBpdGVtID0gKG9iaiBhcyBSZWNvcmQ8c3RyaW5nLCBVPilba2V5XTtcbiAgICAgIGlmIChpdGVtLmlzRXJyKSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfVxuICAgICAgcmVzW2tleV0gPSBpdGVtLnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gUmVzdWx0Lm9rKHJlcyk7XG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgUmVzdWx0PFQsIEUgZXh0ZW5kcyBFcnJvciA9IEVycm9yPiA9XG4gIHwgUmVzdWx0Lk9rPFQsIEU+XG4gIHwgUmVzdWx0LkVycjxULCBFPjtcblxudHlwZSBPa1R5cGU8UiBleHRlbmRzIFJlc3VsdDx1bmtub3duPj4gPSBSIGV4dGVuZHMgUmVzdWx0PGluZmVyIE8+ID8gTyA6IG5ldmVyO1xudHlwZSBFcnJUeXBlPFIgZXh0ZW5kcyBSZXN1bHQ8dW5rbm93bj4+ID0gUiBleHRlbmRzIFJlc3VsdDx1bmtub3duLCBpbmZlciBFPlxuICA/IEVcbiAgOiBuZXZlcjtcbiIsICJpbXBvcnQgeyBBbnlPYmplY3QgfSBmcm9tICd+L3R5cGVzL3NoYXJlZCc7XG5pbXBvcnQgeyBDb25zdGFudHMgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBSZXN1bHQgfSBmcm9tICcuL3Jlc3VsdCc7XG5cbi8qKlxuICogY29udmVydCBidWZmZXIgdG8gQXJyYXlcbiAqXG4gKiBAcGFyYW0ge0J1ZmZlcn0gYnVmZmVyXG4gKiBAcmV0dXJucyBudW1iZXJbXVxuICovXG5cbmV4cG9ydCBjb25zdCBidWZmZXJUb0FycmF5ID0gKGJ1ZmZlcjogQnVmZmVyKTogbnVtYmVyW10gPT4ge1xuICBjb25zdCBudW1zID0gW107XG4gIGZvciAoY29uc3QgYnl0ZSBvZiBidWZmZXIpIHtcbiAgICBudW1zLnB1c2goYnVmZmVyW2J5dGVdKTtcbiAgfVxuICByZXR1cm4gbnVtcztcbn07XG5cbi8qKlxuICogT3ZlcndyaXRlIEpTIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7dW5rbm93bn0gb2JqZWN0XG4gKiBAcGFyYW0ge092ZXJ3cml0ZU9iamVjdFtdfSB0YXJnZXRzXG4gKiBAcmV0dXJucyBPYmplY3RcbiAqL1xuZXhwb3J0IGNvbnN0IG92ZXJ3cml0ZU9iamVjdCA9IChcbiAgb2JqZWN0OiB1bmtub3duLFxuICB0YXJnZXRzOiB7XG4gICAgZXhpc3RzS2V5OiBzdHJpbmc7XG4gICAgd2lsbDogeyBrZXk6IHN0cmluZzsgdmFsdWU6IHVua25vd24gfTtcbiAgfVtdLFxuKTogdW5rbm93biA9PiB7XG4gIGNvbnN0IHRoYXQ6IEFueU9iamVjdCA9IG9iamVjdCBhcyBBbnlPYmplY3Q7XG4gIHRhcmdldHMuZm9yRWFjaCgodGFyZ2V0KSA9PiB7XG4gICAgZGVsZXRlIHRoYXRbdGFyZ2V0LmV4aXN0c0tleV07XG4gICAgdGhhdFt0YXJnZXQud2lsbC5rZXldID0gdGFyZ2V0LndpbGwudmFsdWU7XG4gIH0pO1xuICByZXR1cm4gdGhhdDtcbn07XG5cbi8qKlxuICogRGlzcGxheSBsb2cgZm9yIHNvbGFuYS1zdWl0ZS1jb25maWcuanNcbiAqXG4gKiBAcGFyYW0ge3Vua25vd259IGRhdGExXG4gKiBAcGFyYW0ge3Vua25vd259IGRhdGEyXG4gKiBAcGFyYW0ge3Vua25vd259IGRhdGEzXG4gKiBAcGFyYW0ge3Vua25vd259IGRhdGE0XG4gKiBAcmV0dXJucyB2b2lkXG4gKi9cbmV4cG9ydCBjb25zdCBkZWJ1Z0xvZyA9IChcbiAgZGF0YTE6IHVua25vd24sXG4gIGRhdGEyOiB1bmtub3duID0gJycsXG4gIGRhdGEzOiB1bmtub3duID0gJycsXG4gIGRhdGE0OiB1bmtub3duID0gJycsXG4pOiB2b2lkID0+IHtcbiAgaWYgKENvbnN0YW50cy5pc0RlYnVnZ2luZyA9PT0gJ3RydWUnIHx8IHByb2Nlc3MuZW52LkRFQlVHID09PSAndHJ1ZScpIHtcbiAgICBjb25zb2xlLmxvZygnW0RFQlVHXScsIGRhdGExLCBkYXRhMiwgZGF0YTMsIGRhdGE0KTtcbiAgfVxufTtcblxuLyoqXG4gKiBzbGVlcCB0aW1lclxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBzZWNcbiAqIEByZXR1cm5zIFByb21pc2U8bnVtYmVyPlxuICovXG5leHBvcnQgY29uc3Qgc2xlZXAgPSBhc3luYyAoc2VjOiBudW1iZXIpOiBQcm9taXNlPG51bWJlcj4gPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHIpID0+IHNldFRpbWVvdXQociwgc2VjICogMTAwMCkpO1xufTtcblxuLyoqXG4gKiBOb2RlLmpzIG9yIEJyb3dzZXIganNcbiAqXG4gKiBAcmV0dXJucyBib29sZWFuXG4gKi9cbmV4cG9ydCBjb25zdCBpc0Jyb3dzZXIgPSAoKTogYm9vbGVhbiA9PiB7XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5kb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCdcbiAgKTtcbn07XG5cbi8qKlxuICogTm9kZS5qcyBvciBCcm93c2VyIGpzXG4gKlxuICogQHJldHVybnMgYm9vbGVhblxuICovXG5leHBvcnQgY29uc3QgaXNOb2RlID0gKCk6IGJvb2xlYW4gPT4ge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHByb2Nlc3MudmVyc2lvbnMgIT0gbnVsbCAmJlxuICAgIHByb2Nlc3MudmVyc2lvbnMubm9kZSAhPSBudWxsXG4gICk7XG59O1xuXG4vKipcbiAqIGFyZ3VtZW50IGlzIHByb21pc2Ugb3Igb3RoZXJcbiAqXG4gKiBAcGFyYW0ge3Vua25vd259IG9ialxuICogQHJldHVybnMgYm9vbGVhblxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbmV4cG9ydCBjb25zdCBpc1Byb21pc2UgPSAob2JqOiB1bmtub3duKTogb2JqIGlzIFByb21pc2U8dW5rbm93bj4gPT4ge1xuICByZXR1cm4gKFxuICAgICEhb2JqICYmXG4gICAgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnIHx8IHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbicpICYmXG4gICAgdHlwZW9mIChvYmogYXMgYW55KS50aGVuID09PSAnZnVuY3Rpb24nXG4gICk7XG59O1xuXG4vKipcbiAqIFRyeSBhc3luYyBtb25hZFxuICpcbiAqIEByZXR1cm5zIFByb21pc2U8UmVzdWx0PFQsIEU+PlxuICovXG5leHBvcnQgZnVuY3Rpb24gVHJ5PFQsIEUgZXh0ZW5kcyBFcnJvcj4oXG4gIGFzeW5jYmxvY2s6ICgpID0+IFByb21pc2U8VD4sXG4gIGZpbmFsbHlJbnB1dD86ICgpID0+IHZvaWQsXG4pOiBQcm9taXNlPFJlc3VsdDxULCBFPj47XG5leHBvcnQgZnVuY3Rpb24gVHJ5PFQsIEUgZXh0ZW5kcyBFcnJvcj4oYmxvY2s6ICgpID0+IFQpOiBSZXN1bHQ8VCwgRT47XG5leHBvcnQgZnVuY3Rpb24gVHJ5PFQsIEUgZXh0ZW5kcyBFcnJvcj4oXG4gIGlucHV0OiAoKSA9PiBQcm9taXNlPFQ+LFxuICBmaW5hbGx5SW5wdXQ/OiAoKSA9PiB2b2lkLFxuKTogUmVzdWx0PFQsIEVycm9yPiB8IFByb21pc2U8UmVzdWx0PFQsIEVycm9yPj4ge1xuICB0cnkge1xuICAgIGNvbnN0IHYgPSBpbnB1dCgpO1xuICAgIGlmIChpc1Byb21pc2UodikpIHtcbiAgICAgIHJldHVybiB2LnRoZW4oXG4gICAgICAgICh4OiBUKSA9PiBSZXN1bHQub2soeCksXG4gICAgICAgIChlcnI6IEUpID0+IFJlc3VsdC5lcnIoZXJyKSxcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBSZXN1bHQub2sodik7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGUgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgcmV0dXJuIFJlc3VsdC5lcnIoZSk7XG4gICAgfVxuICAgIHJldHVybiBSZXN1bHQuZXJyKEVycm9yKGUgYXMgc3RyaW5nKSk7XG4gIH0gZmluYWxseSB7XG4gICAgaWYgKGZpbmFsbHlJbnB1dCkge1xuICAgICAgZGVidWdMb2coJyMgZmluYWxseSBpbnB1dDonLCBmaW5hbGx5SW5wdXQpO1xuICAgICAgZmluYWxseUlucHV0KCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogYXJndW1lbnQgaXMgcHJvbWlzZSBvciBvdGhlclxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfHVuZGVmaW5lZH0gY3JlYXRlZF9hdFxuICogQHJldHVybnMgRGF0ZSB8IHVuZGVmaW5lZFxuICovXG5leHBvcnQgY29uc3QgY29udmVydFRpbWVzdGFtcFRvRGF0ZVRpbWUgPSAoXG4gIGNyZWF0ZWRfYXQ6IG51bWJlciB8IHVuZGVmaW5lZCxcbik6IERhdGUgfCB1bmRlZmluZWQgPT4ge1xuICBpZiAoY3JlYXRlZF9hdCkge1xuICAgIHJldHVybiBuZXcgRGF0ZShjcmVhdGVkX2F0ICogMTAwMCk7XG4gIH1cbiAgcmV0dXJuO1xufTtcbiIsICJpbXBvcnQgeyBUcmFuc2FjdGlvbkluc3RydWN0aW9uIH0gZnJvbSAnQHNvbGFuYS93ZWIzLmpzJztcbmltcG9ydCB7IGRlYnVnTG9nLCBzbGVlcCB9IGZyb20gJ34vc2hhcmVkJztcbmltcG9ydCB7IE5vZGUgfSBmcm9tICd+L25vZGUnO1xuaW1wb3J0IHsgVHJhbnNhY3Rpb24gfSBmcm9tICd+L3RyYW5zYWN0aW9uJztcbmltcG9ydCB7IFB1YmtleSwgU2VjcmV0IH0gZnJvbSAnfi90eXBlcy9hY2NvdW50JztcblxuaW1wb3J0IHtcbiAgQVNTT0NJQVRFRF9UT0tFTl9QUk9HUkFNX0lELFxuICBjcmVhdGVBc3NvY2lhdGVkVG9rZW5BY2NvdW50SW5zdHJ1Y3Rpb24sXG4gIGdldEFjY291bnQsXG4gIGdldEFzc29jaWF0ZWRUb2tlbkFkZHJlc3NTeW5jLFxuICBUT0tFTl9QUk9HUkFNX0lELFxuICBUb2tlbkFjY291bnROb3RGb3VuZEVycm9yLFxuICBUb2tlbkludmFsaWRBY2NvdW50T3duZXJFcnJvcixcbn0gZnJvbSAnQHNvbGFuYS9zcGwtdG9rZW4nO1xuXG5pbXBvcnQgeyBBY2NvdW50IGFzIEtleXBhaXIgfSBmcm9tICcuL2tleXBhaXInO1xuXG4vKipcbiAqIEdldCBBc3NvY2lhdGVkIHRva2VuIEFjY291bnQuXG4gKiBpZiBub3QgY3JlYXRlZCwgY3JlYXRlIG5ldyB0b2tlbiBhY2NvdWludFxuICpcbiAqIEBwYXJhbSB7UHVia2V5fSBtaW50XG4gKiBAcGFyYW0ge1B1YmtleX0gb3duZXJcbiAqIEBwYXJhbSB7U2VjcmV0fSBmZWVQYXllclxuICogQHBhcmFtIHtib29sZWFufSBhbGxvd093bmVyT2ZmQ3VydmVcbiAqIEByZXR1cm5zIFByb21pc2U8c3RyaW5nIHwgSW5zdHJ1Y3Rpb24+XG4gKi9cbmV4cG9ydCBuYW1lc3BhY2UgQWNjb3VudCB7XG4gIGV4cG9ydCBuYW1lc3BhY2UgQXNzb2NpYXRlZCB7XG4gICAgY29uc3QgUkVUUllfT1ZFUl9MSU1JVCA9IDEwO1xuICAgIGNvbnN0IFJFVFJZX1NMRUVQX1RJTUUgPSAzO1xuICAgIC8vQGludGVybmFsXG4gICAgY29uc3QgZ2V0ID0gYXN5bmMgKFxuICAgICAgbWludDogUHVia2V5LFxuICAgICAgb3duZXI6IFB1YmtleSxcbiAgICAgIGZlZVBheWVyOiBTZWNyZXQsXG4gICAgICBhbGxvd093bmVyT2ZmQ3VydmUgPSBmYWxzZSxcbiAgICApOiBQcm9taXNlPHN0cmluZyB8IFRyYW5zYWN0aW9uPiA9PiB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBtYWtlT3JDcmVhdGVJbnN0cnVjdGlvbihcbiAgICAgICAgbWludCxcbiAgICAgICAgb3duZXIsXG4gICAgICAgIG5ldyBLZXlwYWlyLktleXBhaXIoeyBzZWNyZXQ6IGZlZVBheWVyIH0pLnB1YmtleSxcbiAgICAgICAgYWxsb3dPd25lck9mZkN1cnZlLFxuICAgICAgKTtcblxuICAgICAgaWYgKCFyZXMuaW5zdCkge1xuICAgICAgICByZXR1cm4gcmVzLnRva2VuQWNjb3VudDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBUcmFuc2FjdGlvbihcbiAgICAgICAgW3Jlcy5pbnN0XSxcbiAgICAgICAgW10sXG4gICAgICAgIGZlZVBheWVyLnRvS2V5cGFpcigpLFxuICAgICAgICByZXMudG9rZW5BY2NvdW50LFxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0cnkgZnVuY3Rpb24gaWYgY3JlYXRlIG5ldyB0b2tlbiBhY2NvdWludFxuICAgICAqXG4gICAgICogQHBhcmFtIHtQdWJrZXl9IG1pbnRcbiAgICAgKiBAcGFyYW0ge1B1YmtleX0gb3duZXJcbiAgICAgKiBAcGFyYW0ge1NlY3JldH0gZmVlUGF5ZXJcbiAgICAgKiBAcmV0dXJucyBQcm9taXNlPHN0cmluZz5cbiAgICAgKi9cbiAgICBleHBvcnQgY29uc3QgcmV0cnlHZXRPckNyZWF0ZSA9IGFzeW5jIChcbiAgICAgIG1pbnQ6IFB1YmtleSxcbiAgICAgIG93bmVyOiBQdWJrZXksXG4gICAgICBmZWVQYXllcjogU2VjcmV0LFxuICAgICk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgICBsZXQgY291bnRlciA9IDE7XG4gICAgICB3aGlsZSAoY291bnRlciA8IFJFVFJZX09WRVJfTElNSVQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBpbnN0ID0gYXdhaXQgZ2V0KG1pbnQsIG93bmVyLCBmZWVQYXllciwgdHJ1ZSk7XG5cbiAgICAgICAgICBpZiAoaW5zdCAmJiB0eXBlb2YgaW5zdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRlYnVnTG9nKCcjIGFzc29jaWF0ZWRUb2tlbkFjY291bnQ6ICcsIGluc3QpO1xuICAgICAgICAgICAgcmV0dXJuIGluc3Q7XG4gICAgICAgICAgfSBlbHNlIGlmIChpbnN0IGluc3RhbmNlb2YgVHJhbnNhY3Rpb24pIHtcbiAgICAgICAgICAgIChhd2FpdCBpbnN0LnN1Ym1pdCgpKS5tYXAoXG4gICAgICAgICAgICAgIGFzeW5jIChvaykgPT4ge1xuICAgICAgICAgICAgICAgIGF3YWl0IE5vZGUuY29uZmlybWVkU2lnKG9rKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5zdC5kYXRhIGFzIHN0cmluZztcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGRlYnVnTG9nKCcjIEVycm9yIHN1Ym1pdCByZXRyeUdldE9yQ3JlYXRlOiAnLCBlcnIpO1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgZGVidWdMb2coYCMgcmV0cnk6ICR7Y291bnRlcn0gY3JlYXRlIHRva2VuIGFjY291bnQ6IGAsIGUpO1xuICAgICAgICAgIGRlYnVnTG9nKGAjIG1pbnQ6ICR7bWludH0sIG93bmVyOiAke293bmVyfSwgZmVlUGF5ZXI6ICR7ZmVlUGF5ZXJ9YCk7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgc2xlZXAoUkVUUllfU0xFRVBfVElNRSk7XG4gICAgICAgIGNvdW50ZXIrKztcbiAgICAgIH1cbiAgICAgIHRocm93IEVycm9yKGByZXRyeSBhY3Rpb24gaXMgb3ZlciBsaW1pdCAke1JFVFJZX09WRVJfTElNSVR9YCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFtNYWluIGxvZ2ljXUdldCBBc3NvY2lhdGVkIHRva2VuIEFjY291bnQuXG4gICAgICogaWYgbm90IGNyZWF0ZWQsIGNyZWF0ZSBuZXcgdG9rZW4gYWNjb3VpbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UHVia2V5fSBtaW50XG4gICAgICogQHBhcmFtIHtQdWJrZXl9IG93bmVyXG4gICAgICogQHBhcmFtIHtQdWJrZXl9IGZlZVBheWVyXG4gICAgICogQHJldHVybnMgUHJvbWlzZTxzdHJpbmc+XG4gICAgICovXG4gICAgZXhwb3J0IGNvbnN0IG1ha2VPckNyZWF0ZUluc3RydWN0aW9uID0gYXN5bmMgKFxuICAgICAgbWludDogUHVia2V5LFxuICAgICAgb3duZXI6IFB1YmtleSxcbiAgICAgIGZlZVBheWVyPzogUHVia2V5LFxuICAgICAgYWxsb3dPd25lck9mZkN1cnZlID0gZmFsc2UsXG4gICAgKTogUHJvbWlzZTx7XG4gICAgICB0b2tlbkFjY291bnQ6IHN0cmluZztcbiAgICAgIGluc3Q6IFRyYW5zYWN0aW9uSW5zdHJ1Y3Rpb24gfCB1bmRlZmluZWQ7XG4gICAgfT4gPT4ge1xuICAgICAgY29uc3QgYXNzb2NpYXRlZFRva2VuQWNjb3VudCA9IGdldEFzc29jaWF0ZWRUb2tlbkFkZHJlc3NTeW5jKFxuICAgICAgICBtaW50LnRvUHVibGljS2V5KCksXG4gICAgICAgIG93bmVyLnRvUHVibGljS2V5KCksXG4gICAgICAgIGFsbG93T3duZXJPZmZDdXJ2ZSxcbiAgICAgICAgVE9LRU5fUFJPR1JBTV9JRCxcbiAgICAgICAgQVNTT0NJQVRFRF9UT0tFTl9QUk9HUkFNX0lELFxuICAgICAgKTtcblxuICAgICAgZGVidWdMb2coJyMgYXNzb2NpYXRlZFRva2VuQWNjb3VudDogJywgYXNzb2NpYXRlZFRva2VuQWNjb3VudC50b1N0cmluZygpKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gRG9udCB1c2UgUmVzdWx0XG4gICAgICAgIGF3YWl0IGdldEFjY291bnQoXG4gICAgICAgICAgTm9kZS5nZXRDb25uZWN0aW9uKCksXG4gICAgICAgICAgYXNzb2NpYXRlZFRva2VuQWNjb3VudCxcbiAgICAgICAgICBOb2RlLmdldENvbm5lY3Rpb24oKS5jb21taXRtZW50LFxuICAgICAgICAgIFRPS0VOX1BST0dSQU1fSUQsXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdG9rZW5BY2NvdW50OiBhc3NvY2lhdGVkVG9rZW5BY2NvdW50LnRvU3RyaW5nKCksXG4gICAgICAgICAgaW5zdDogdW5kZWZpbmVkLFxuICAgICAgICB9O1xuICAgICAgfSBjYXRjaCAoZXJyb3I6IHVua25vd24pIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICEoZXJyb3IgaW5zdGFuY2VvZiBUb2tlbkFjY291bnROb3RGb3VuZEVycm9yKSAmJlxuICAgICAgICAgICEoZXJyb3IgaW5zdGFuY2VvZiBUb2tlbkludmFsaWRBY2NvdW50T3duZXJFcnJvcilcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhyb3cgRXJyb3IoJ1VuZXhwZWN0ZWQgZXJyb3InKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBheWVyID0gIWZlZVBheWVyID8gb3duZXIgOiBmZWVQYXllcjtcblxuICAgICAgICBjb25zdCBpbnN0ID0gY3JlYXRlQXNzb2NpYXRlZFRva2VuQWNjb3VudEluc3RydWN0aW9uKFxuICAgICAgICAgIHBheWVyLnRvUHVibGljS2V5KCksXG4gICAgICAgICAgYXNzb2NpYXRlZFRva2VuQWNjb3VudCxcbiAgICAgICAgICBvd25lci50b1B1YmxpY0tleSgpLFxuICAgICAgICAgIG1pbnQudG9QdWJsaWNLZXkoKSxcbiAgICAgICAgICBUT0tFTl9QUk9HUkFNX0lELFxuICAgICAgICAgIEFTU09DSUFURURfVE9LRU5fUFJPR1JBTV9JRCxcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRva2VuQWNjb3VudDogYXNzb2NpYXRlZFRva2VuQWNjb3VudC50b1N0cmluZygpLFxuICAgICAgICAgIGluc3QsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuIiwgImltcG9ydCB7IEtleXBhaXIgYXMgT3JpZ2luYWwsIFB1YmxpY0tleSB9IGZyb20gJ0Bzb2xhbmEvd2ViMy5qcyc7XG5pbXBvcnQgeyBQdWJrZXksIFNlY3JldCB9IGZyb20gJ34vdHlwZXMvYWNjb3VudCc7XG5pbXBvcnQgYnMgZnJvbSAnYnM1OCc7XG5cbmV4cG9ydCBuYW1lc3BhY2UgQWNjb3VudCB7XG4gIGV4cG9ydCBjbGFzcyBLZXlwYWlyIHtcbiAgICBzZWNyZXQ6IFNlY3JldDtcbiAgICBwdWJrZXk6IFB1YmtleTtcblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtczogeyBwdWJrZXk/OiBQdWJrZXk7IHNlY3JldDogU2VjcmV0IH0pIHtcbiAgICAgIGlmICghcGFyYW1zLnB1YmtleSkge1xuICAgICAgICBjb25zdCBrZXlwYWlyID0gcGFyYW1zLnNlY3JldC50b0tleXBhaXIoKTtcbiAgICAgICAgdGhpcy5wdWJrZXkgPSBrZXlwYWlyLnB1YmxpY0tleS50b1N0cmluZygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wdWJrZXkgPSBwYXJhbXMucHVia2V5O1xuICAgICAgfVxuICAgICAgdGhpcy5zZWNyZXQgPSBwYXJhbXMuc2VjcmV0O1xuICAgIH1cblxuICAgIHRvUHVibGljS2V5KCk6IFB1YmxpY0tleSB7XG4gICAgICByZXR1cm4gbmV3IFB1YmxpY0tleSh0aGlzLnB1YmtleSk7XG4gICAgfVxuXG4gICAgdG9LZXlwYWlyKCk6IE9yaWdpbmFsIHtcbiAgICAgIGNvbnN0IGRlY29kZWQgPSBicy5kZWNvZGUodGhpcy5zZWNyZXQpO1xuICAgICAgcmV0dXJuIE9yaWdpbmFsLmZyb21TZWNyZXRLZXkoZGVjb2RlZCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGlzUHVia2V5ID0gKHZhbHVlOiBzdHJpbmcpOiB2YWx1ZSBpcyBQdWJrZXkgPT5cbiAgICAgIC9eWzAtOWEtekEtWl17MzIsNDR9JC8udGVzdCh2YWx1ZSk7XG5cbiAgICBzdGF0aWMgaXNTZWNyZXQgPSAodmFsdWU6IHN0cmluZyk6IHZhbHVlIGlzIFNlY3JldCA9PlxuICAgICAgL15bMC05YS16QS1aXXs4Nyw4OH0kLy50ZXN0KHZhbHVlKTtcblxuICAgIHN0YXRpYyBjcmVhdGUgPSAoKTogS2V5cGFpciA9PiB7XG4gICAgICBjb25zdCBrZXlwYWlyID0gT3JpZ2luYWwuZ2VuZXJhdGUoKTtcbiAgICAgIHJldHVybiBuZXcgS2V5cGFpcih7XG4gICAgICAgIHB1YmtleToga2V5cGFpci5wdWJsaWNLZXkudG9TdHJpbmcoKSBhcyBQdWJrZXksXG4gICAgICAgIHNlY3JldDogYnMuZW5jb2RlKGtleXBhaXIuc2VjcmV0S2V5KSBhcyBTZWNyZXQsXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgc3RhdGljIHRvS2V5UGFpciA9IChrZXlwYWlyOiBPcmlnaW5hbCk6IEtleXBhaXIgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBLZXlwYWlyKHtcbiAgICAgICAgcHVia2V5OiBrZXlwYWlyLnB1YmxpY0tleS50b1N0cmluZygpIGFzIFB1YmtleSxcbiAgICAgICAgc2VjcmV0OiBicy5lbmNvZGUoa2V5cGFpci5zZWNyZXRLZXkpIGFzIFNlY3JldCxcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBQdWJsaWNLZXkgfSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuaW1wb3J0IHsgUFJPR1JBTV9JRCB9IGZyb20gJ0BtZXRhcGxleC1mb3VuZGF0aW9uL21wbC10b2tlbi1tZXRhZGF0YSc7XG5pbXBvcnQgeyBQdWJrZXkgfSBmcm9tICd+L3R5cGVzL2FjY291bnQnO1xuaW1wb3J0IHsgTVBMX0JVQkJMRUdVTV9QUk9HUkFNX0lEIH0gZnJvbSAnQG1ldGFwbGV4LWZvdW5kYXRpb24vbXBsLWJ1YmJsZWd1bSc7XG5pbXBvcnQgQk4gZnJvbSAnYm4uanMnO1xuXG5leHBvcnQgbmFtZXNwYWNlIEFjY291bnQge1xuICBleHBvcnQgbmFtZXNwYWNlIFBkYSB7XG4gICAgZXhwb3J0IGNvbnN0IGdldE1ldGFkYXRhID0gKGFkZHJlc3M6IFB1YmtleSk6IFB1YmxpY0tleSA9PiB7XG4gICAgICBjb25zdCBbcHVibGljS2V5XSA9IFB1YmxpY0tleS5maW5kUHJvZ3JhbUFkZHJlc3NTeW5jKFxuICAgICAgICBbXG4gICAgICAgICAgQnVmZmVyLmZyb20oJ21ldGFkYXRhJyksXG4gICAgICAgICAgUFJPR1JBTV9JRC50b0J1ZmZlcigpLFxuICAgICAgICAgIGFkZHJlc3MudG9QdWJsaWNLZXkoKS50b0J1ZmZlcigpLFxuICAgICAgICBdLFxuICAgICAgICBQUk9HUkFNX0lELFxuICAgICAgKTtcbiAgICAgIHJldHVybiBwdWJsaWNLZXk7XG4gICAgfTtcblxuICAgIGV4cG9ydCBjb25zdCBnZXRNYXN0ZXJFZGl0aW9uID0gKGFkZHJlc3M6IFB1YmtleSk6IFB1YmxpY0tleSA9PiB7XG4gICAgICBjb25zdCBbcHVibGljS2V5XSA9IFB1YmxpY0tleS5maW5kUHJvZ3JhbUFkZHJlc3NTeW5jKFxuICAgICAgICBbXG4gICAgICAgICAgQnVmZmVyLmZyb20oJ21ldGFkYXRhJyksXG4gICAgICAgICAgUFJPR1JBTV9JRC50b0J1ZmZlcigpLFxuICAgICAgICAgIGFkZHJlc3MudG9QdWJsaWNLZXkoKS50b0J1ZmZlcigpLFxuICAgICAgICAgIEJ1ZmZlci5mcm9tKCdlZGl0aW9uJyksXG4gICAgICAgIF0sXG4gICAgICAgIFBST0dSQU1fSUQsXG4gICAgICApO1xuICAgICAgcmV0dXJuIHB1YmxpY0tleTtcbiAgICB9O1xuXG4gICAgZXhwb3J0IGNvbnN0IGdldFRyZWVBdXRob3JpdHkgPSAoYWRkcmVzczogUHVia2V5KTogUHVibGljS2V5ID0+IHtcbiAgICAgIGNvbnN0IFtwdWJsaWNLZXldID0gUHVibGljS2V5LmZpbmRQcm9ncmFtQWRkcmVzc1N5bmMoXG4gICAgICAgIFthZGRyZXNzLnRvUHVibGljS2V5KCkudG9CdWZmZXIoKV0sXG4gICAgICAgIE1QTF9CVUJCTEVHVU1fUFJPR1JBTV9JRC50b1B1YmxpY0tleSgpLFxuICAgICAgKTtcbiAgICAgIHJldHVybiBwdWJsaWNLZXk7XG4gICAgfTtcblxuICAgIGV4cG9ydCBjb25zdCBnZXRCZ3VtU2lnbmVyID0gKCk6IFB1YmxpY0tleSA9PiB7XG4gICAgICBjb25zdCBbcHVibGljS2V5XSA9IFB1YmxpY0tleS5maW5kUHJvZ3JhbUFkZHJlc3NTeW5jKFxuICAgICAgICBbQnVmZmVyLmZyb20oJ2NvbGxlY3Rpb25fY3BpJywgJ3V0ZjgnKV0sXG4gICAgICAgIE1QTF9CVUJCTEVHVU1fUFJPR1JBTV9JRC50b1B1YmxpY0tleSgpLFxuICAgICAgKTtcbiAgICAgIHJldHVybiBwdWJsaWNLZXk7XG4gICAgfTtcblxuICAgIGV4cG9ydCBjb25zdCBnZXRBc3NldElkID0gKGFkZHJlc3M6IFB1YmtleSwgbGVhZkluZGV4OiBudW1iZXIpOiBQdWJrZXkgPT4ge1xuICAgICAgY29uc3Qgbm9kZSA9IG5ldyBCTi5CTihsZWFmSW5kZXgpO1xuICAgICAgY29uc3QgW2Fzc2V0SWRdID0gUHVibGljS2V5LmZpbmRQcm9ncmFtQWRkcmVzc1N5bmMoXG4gICAgICAgIFtcbiAgICAgICAgICBCdWZmZXIuZnJvbSgnYXNzZXQnLCAndXRmOCcpLFxuICAgICAgICAgIGFkZHJlc3MudG9QdWJsaWNLZXkoKS50b0J1ZmZlcigpLFxuICAgICAgICAgIFVpbnQ4QXJyYXkuZnJvbShub2RlLnRvQXJyYXkoJ2xlJywgOCkpLFxuICAgICAgICBdLFxuICAgICAgICBNUExfQlVCQkxFR1VNX1BST0dSQU1fSUQudG9QdWJsaWNLZXkoKSxcbiAgICAgICk7XG4gICAgICByZXR1cm4gYXNzZXRJZC50b1N0cmluZygpO1xuICAgIH07XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBBY2NvdW50IGFzIEFzc29jaWF0ZWQgfSBmcm9tICcuL2Fzc29jaWF0ZWQnO1xuaW1wb3J0IHsgQWNjb3VudCBhcyBLZXlwYWlyIH0gZnJvbSAnLi9rZXlwYWlyJztcbmltcG9ydCB7IEFjY291bnQgYXMgUGRhIH0gZnJvbSAnLi9wZGEnO1xuXG5leHBvcnQgY29uc3QgQWNjb3VudCA9IHtcbiAgLi4uQXNzb2NpYXRlZCxcbiAgLi4uS2V5cGFpcixcbiAgLi4uUGRhLFxufTtcbiIsICJpbXBvcnQgeyBJbnRlcm5hbENvbGxlY3Rpb24gfSBmcm9tICd+L3R5cGVzL2NvbnZlcnRlcic7XG5pbXBvcnQgeyBDb2xsZWN0aW9uLCBJbnB1dENvbGxlY3Rpb24sIE9wdGlvbiB9IGZyb20gJ34vdHlwZXMvcmVndWxhci1uZnQnO1xuXG5leHBvcnQgbmFtZXNwYWNlIENvbnZlcnRlciB7XG4gIGV4cG9ydCBuYW1lc3BhY2UgQ29sbGVjdGlvbiB7XG4gICAgZXhwb3J0IGNvbnN0IGludG9JbmZyYSA9IChcbiAgICAgIGlucHV0OiBPcHRpb248SW5wdXRDb2xsZWN0aW9uPiB8IHVuZGVmaW5lZCxcbiAgICApOiBPcHRpb248SW50ZXJuYWxDb2xsZWN0aW9uPiA9PiB7XG4gICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBrZXk6IGlucHV0LnRvUHVibGljS2V5KCksXG4gICAgICAgIHZlcmlmaWVkOiBmYWxzZSxcbiAgICAgIH07XG4gICAgfTtcblxuICAgIGV4cG9ydCBjb25zdCBpbnRvVXNlciA9IChcbiAgICAgIG91dHB1dDogT3B0aW9uPEludGVybmFsQ29sbGVjdGlvbj4sXG4gICAgKTogQ29sbGVjdGlvbiB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICBpZiAoIW91dHB1dCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBhZGRyZXNzOiBvdXRwdXQua2V5LnRvU3RyaW5nKCksXG4gICAgICAgIHZlcmlmaWVkOiBvdXRwdXQudmVyaWZpZWQsXG4gICAgICB9O1xuICAgIH07XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBDcmVhdG9ycywgSW5wdXRDcmVhdG9ycywgT3B0aW9uIH0gZnJvbSAnfi90eXBlcy9yZWd1bGFyLW5mdCc7XG5pbXBvcnQgeyBJbnRlcm5hbENyZWF0b3JzIH0gZnJvbSAnfi90eXBlcy9jb252ZXJ0ZXInO1xuXG5leHBvcnQgbmFtZXNwYWNlIENvbnZlcnRlciB7XG4gIGV4cG9ydCBuYW1lc3BhY2UgQ3JlYXRvcnMge1xuICAgIGV4cG9ydCBjb25zdCBpbnRvSW5mcmEgPSAoXG4gICAgICBpbnB1dDogT3B0aW9uPElucHV0Q3JlYXRvcnNbXT4gfCB1bmRlZmluZWQsXG4gICAgKTogT3B0aW9uPEludGVybmFsQ3JlYXRvcnNbXT4gPT4ge1xuICAgICAgaWYgKCFpbnB1dCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpbnB1dC5tYXAoKGRhdGEpID0+IHtcbiAgICAgICAgbGV0IG1vZGlmeTogT3B0aW9uPEludGVybmFsQ3JlYXRvcnM+ID0gbnVsbDtcbiAgICAgICAgbW9kaWZ5ID0ge1xuICAgICAgICAgIGFkZHJlc3M6IGRhdGEuYWRkcmVzcy50b1B1YmxpY0tleSgpLFxuICAgICAgICAgIHNoYXJlOiBkYXRhLnNoYXJlLFxuICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZSxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kaWZ5O1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGV4cG9ydCBjb25zdCBpbnRvQ29tcHJlc3NlZE5mdEluZnJhID0gKFxuICAgICAgaW5wdXQ6IE9wdGlvbjxJbnB1dENyZWF0b3JzW10+IHwgdW5kZWZpbmVkLFxuICAgICk6IEludGVybmFsQ3JlYXRvcnNbXSA9PiB7XG4gICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpbnB1dCEubWFwKChkYXRhKSA9PiB7XG4gICAgICAgIGxldCBtb2RpZnk6IEludGVybmFsQ3JlYXRvcnM7XG4gICAgICAgIG1vZGlmeSA9IHtcbiAgICAgICAgICBhZGRyZXNzOiBkYXRhLmFkZHJlc3MudG9QdWJsaWNLZXkoKSxcbiAgICAgICAgICBzaGFyZTogZGF0YS5zaGFyZSxcbiAgICAgICAgICB2ZXJpZmllZDogZmFsc2UsXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZGlmeTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBleHBvcnQgY29uc3QgaW50b1VzZXIgPSAoXG4gICAgICBvdXRwdXQ6IE9wdGlvbjxJbnRlcm5hbENyZWF0b3JzW10+LFxuICAgICk6IENyZWF0b3JzW10gfCB1bmRlZmluZWQgPT4ge1xuICAgICAgaWYgKCFvdXRwdXQpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dHB1dC5tYXAoKGRhdGEpID0+IHtcbiAgICAgICAgY29uc3QgbW9kaWZ5ID0ge1xuICAgICAgICAgIGFkZHJlc3M6IGRhdGEuYWRkcmVzcy50b1N0cmluZygpLFxuICAgICAgICAgIHNoYXJlOiBkYXRhLnNoYXJlLFxuICAgICAgICAgIHZlcmlmaWVkOiBkYXRhLnZlcmlmaWVkLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gbW9kaWZ5O1xuICAgICAgfSk7XG4gICAgfTtcbiAgfVxufVxuIiwgImV4cG9ydCBuYW1lc3BhY2UgQ29udmVydGVyIHtcbiAgZXhwb3J0IG5hbWVzcGFjZSBSb3lhbHR5IHtcbiAgICBleHBvcnQgY29uc3QgVEhSRVNIT0xEID0gMTAwO1xuICAgIGV4cG9ydCBjb25zdCBpbnRvSW5mcmEgPSAocGVyY2VudGFnZTogbnVtYmVyKSA9PiB7XG4gICAgICByZXR1cm4gcGVyY2VudGFnZSAqIFRIUkVTSE9MRDtcbiAgICB9O1xuXG4gICAgZXhwb3J0IGNvbnN0IGludG9Vc2VyID0gKHBlcmNlbnRhZ2U6IG51bWJlcikgPT4ge1xuICAgICAgcmV0dXJuIHBlcmNlbnRhZ2UgKiBUSFJFU0hPTEQ7XG4gICAgfTtcbiAgfVxufVxuIiwgImltcG9ydCB7IENvbnZlcnRlciBhcyBDb2xsZWN0aW9uIH0gZnJvbSAnLi9jb2xsZWN0aW9uJztcbmltcG9ydCB7IENvbnZlcnRlciBhcyBDcmVhdG9ycyB9IGZyb20gJy4vY3JlYXRvcnMnO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIFJveWFsdHkgfSBmcm9tICcuL3JveWFsdHknO1xuaW1wb3J0IHsgY29udmVydFRpbWVzdGFtcFRvRGF0ZVRpbWUgfSBmcm9tICd+L3NoYXJlZCc7XG5pbXBvcnQgeyBJbnB1dE5mdE1ldGFkYXRhIH0gZnJvbSAnfi90eXBlcy9yZWd1bGFyLW5mdCc7XG5pbXBvcnQgeyBDb21wcmVzc2VkTmZ0TWV0YWRhdGEgfSBmcm9tICd+L3R5cGVzL2NvbXByZXNzZWQtbmZ0JztcbmltcG9ydCB7XG4gIE1ldGFkYXRhQXJncyxcbiAgVG9rZW5Qcm9ncmFtVmVyc2lvbixcbiAgVG9rZW5TdGFuZGFyZCxcbn0gZnJvbSAnbXBsLWJ1YmJsZWd1bS1pbnN0cnVjdGlvbic7XG5pbXBvcnQgeyBBc3NldEFuZE9mZmNoYWluIH0gZnJvbSAnfi90eXBlcy9zdG9yYWdlJztcblxuZXhwb3J0IG5hbWVzcGFjZSBDb252ZXJ0ZXIge1xuICBleHBvcnQgbmFtZXNwYWNlIENvbXByZXNzZWROZnRNZXRhZGF0YSB7XG4gICAgZXhwb3J0IGNvbnN0IGludG9JbmZyYSA9IChcbiAgICAgIGlucHV0OiBJbnB1dE5mdE1ldGFkYXRhLFxuICAgICAgdXJpOiBzdHJpbmcsXG4gICAgICBzZWxsZXJGZWVCYXNpc1BvaW50czogbnVtYmVyLFxuICAgICk6IE1ldGFkYXRhQXJncyA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBpbnB1dC5uYW1lLFxuICAgICAgICBzeW1ib2w6IGlucHV0LnN5bWJvbCxcbiAgICAgICAgdXJpLFxuICAgICAgICBzZWxsZXJGZWVCYXNpc1BvaW50cyxcbiAgICAgICAgY3JlYXRvcnM6IENyZWF0b3JzLkNyZWF0b3JzLmludG9Db21wcmVzc2VkTmZ0SW5mcmEoaW5wdXQuY3JlYXRvcnMpLFxuICAgICAgICBjb2xsZWN0aW9uOiBDb2xsZWN0aW9uLkNvbGxlY3Rpb24uaW50b0luZnJhKGlucHV0LmNvbGxlY3Rpb24pLFxuICAgICAgICB1c2VzOiBpbnB1dC51c2VzIHx8IG51bGwsXG4gICAgICAgIHByaW1hcnlTYWxlSGFwcGVuZWQ6IGZhbHNlLFxuICAgICAgICBpc011dGFibGU6IGlucHV0LmlzTXV0YWJsZSA/PyBmYWxzZSxcbiAgICAgICAgZWRpdGlvbk5vbmNlOiAwLFxuICAgICAgICB0b2tlblN0YW5kYXJkOiBUb2tlblN0YW5kYXJkLk5vbkZ1bmdpYmxlLFxuICAgICAgICB0b2tlblByb2dyYW1WZXJzaW9uOiBUb2tlblByb2dyYW1WZXJzaW9uLk9yaWdpbmFsLFxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgZXhwb3J0IGNvbnN0IGludG9Vc2VyID0gKFxuICAgICAgb3V0cHV0OiBBc3NldEFuZE9mZmNoYWluLFxuICAgICk6IENvbXByZXNzZWROZnRNZXRhZGF0YSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhvdXRwdXQub25jaGFpbi5ncm91cGluZyk7XG4gICAgICBjb25zb2xlLmxvZyhvdXRwdXQub25jaGFpbi5jcmVhdG9ycyk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtaW50OiBvdXRwdXQub25jaGFpbi5pZC50b1N0cmluZygpLFxuICAgICAgICBjb2xsZWN0aW9uTWludDogJ291dHB1dC5vbmNoYWluLmdyb3VwaW5nWzBdLmdyb3VwX3ZhbHVlJyxcbiAgICAgICAgYXV0aG9yaXRpZXM6IG91dHB1dC5vbmNoYWluLmF1dGhvcml0aWVzLFxuICAgICAgICByb3lhbHR5OiBSb3lhbHR5LlJveWFsdHkuaW50b1VzZXIob3V0cHV0Lm9uY2hhaW4ucm95YWx0eS5wZXJjZW50KSxcbiAgICAgICAgbmFtZTogb3V0cHV0Lm9uY2hhaW4uY29udGVudC5tZXRhZGF0YS5uYW1lLFxuICAgICAgICBzeW1ib2w6IG91dHB1dC5vbmNoYWluLmNvbnRlbnQubWV0YWRhdGEuc3ltYm9sLFxuICAgICAgICB1cmk6IG91dHB1dC5vbmNoYWluLmNvbnRlbnQuanNvbl91cmksXG4gICAgICAgIGNyZWF0b3JzOiBDcmVhdG9ycy5DcmVhdG9ycy5pbnRvVXNlcihvdXRwdXQub25jaGFpbi5jcmVhdG9ycykhLFxuICAgICAgICB0cmVlQWRkcmVzczogb3V0cHV0Lm9uY2hhaW4uY29tcHJlc3Npb24udHJlZSxcbiAgICAgICAgaXNNdXRhYmxlOiBvdXRwdXQub25jaGFpbi5tdXRhYmxlLFxuICAgICAgICBpc0J1cm46IG91dHB1dC5vbmNoYWluLmJ1cm50LFxuICAgICAgICBlZGl0aW9uTm9uY2U6IG91dHB1dC5vbmNoYWluLnN1cHBseS5lZGl0aW9uX25vbmNlLFxuICAgICAgICBwcmltYXJ5U2FsZUhhcHBlbmVkOiBvdXRwdXQub25jaGFpbi5yb3lhbHR5LnByaW1hcnlfc2FsZV9oYXBwZW5lZCxcbiAgICAgICAgZGF0ZVRpbWU6IGNvbnZlcnRUaW1lc3RhbXBUb0RhdGVUaW1lKG91dHB1dC5vZmZjaGFpbi5jcmVhdGVkX2F0KSEsXG4gICAgICAgIG9mZmNoYWluOiBvdXRwdXQub2ZmY2hhaW4sXG4gICAgICB9O1xuICAgIH07XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBQYXJzZWRUcmFuc2FjdGlvbldpdGhNZXRhIH0gZnJvbSAnQHNvbGFuYS93ZWIzLmpzJztcbmltcG9ydCB7IGNvbnZlcnRUaW1lc3RhbXBUb0RhdGVUaW1lIH0gZnJvbSAnfi9zaGFyZWQnO1xuaW1wb3J0IHsgUG9zdFRva2VuQWNjb3VudCB9IGZyb20gJ34vdHlwZXMvdHJhbnNhY3Rpb24tZmlsdGVyJztcbmltcG9ydCB7IEhpc3RvcnkgfSBmcm9tICd+L3R5cGVzL2hpc3RvcnknO1xuaW1wb3J0IHsgTWVtbywgVHJhbnNmZXJDaGVja2VkIH0gZnJvbSAnfi90eXBlcy90cmFuc2FjdGlvbi1maWx0ZXInO1xuXG5leHBvcnQgbmFtZXNwYWNlIENvbnZlcnRlciB7XG4gIGV4cG9ydCBuYW1lc3BhY2UgTWVtbyB7XG4gICAgZXhwb3J0IGNvbnN0IGludG9Vc2VyU2lkZSA9IChcbiAgICAgIG91dHB1dDogTWVtbyxcbiAgICAgIG1ldGE6IFBhcnNlZFRyYW5zYWN0aW9uV2l0aE1ldGEsXG4gICAgICBvdXRwdXRUcmFuc2Zlcj86IFRyYW5zZmVyQ2hlY2tlZCxcbiAgICAgIG1hcHBpbmdUb2tlbkFjY291bnQ/OiBQb3N0VG9rZW5BY2NvdW50W10sXG4gICAgKTogSGlzdG9yeSB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICBjb25zdCBoaXN0b3J5OiBIaXN0b3J5ID0ge307XG5cbiAgICAgIC8vIGNhc2U6IHRyYW5zZmVyIHdpdGggbWVtb1xuICAgICAgaWYgKG91dHB1dFRyYW5zZmVyICYmIG91dHB1dFRyYW5zZmVyLnByb2dyYW0gIT09ICcnKSB7XG4gICAgICAgIGlmIChtYXBwaW5nVG9rZW5BY2NvdW50ICYmIG91dHB1dFRyYW5zZmVyLnByb2dyYW0gPT09ICdzcGwtdG9rZW4nKSB7XG4gICAgICAgICAgY29uc3QgZm91bmRTb3VyY2UgPSBtYXBwaW5nVG9rZW5BY2NvdW50LmZpbmQoXG4gICAgICAgICAgICAobSkgPT4gbS5hY2NvdW50ID09PSBvdXRwdXRUcmFuc2Zlci5wYXJzZWQuaW5mby5zb3VyY2UsXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjb25zdCBmb3VuZERlc3QgPSBtYXBwaW5nVG9rZW5BY2NvdW50LmZpbmQoXG4gICAgICAgICAgICAobSkgPT4gbS5hY2NvdW50ID09PSBvdXRwdXRUcmFuc2Zlci5wYXJzZWQuaW5mby5kZXN0aW5hdGlvbixcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaGlzdG9yeS5taW50ID0gb3V0cHV0VHJhbnNmZXIucGFyc2VkLmluZm8ubWludDtcbiAgICAgICAgICBmb3VuZFNvdXJjZSAmJiAoaGlzdG9yeS5zb3VyY2UgPSBmb3VuZFNvdXJjZS5vd25lcik7XG4gICAgICAgICAgZm91bmREZXN0ICYmIChoaXN0b3J5LmRlc3RpbmF0aW9uID0gZm91bmREZXN0Lm93bmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBoaXN0b3J5LnNvdXJjZSA9IG91dHB1dFRyYW5zZmVyLnBhcnNlZC5pbmZvLnNvdXJjZTtcbiAgICAgICAgICBoaXN0b3J5LmRlc3RpbmF0aW9uID0gb3V0cHV0VHJhbnNmZXIucGFyc2VkLmluZm8uZGVzdGluYXRpb247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaGlzdG9yeS5tZW1vID0gb3V0cHV0LnBhcnNlZDtcbiAgICAgIGhpc3RvcnkudHlwZSA9IG91dHB1dC5wcm9ncmFtO1xuICAgICAgaGlzdG9yeS5kYXRlVGltZSA9IGNvbnZlcnRUaW1lc3RhbXBUb0RhdGVUaW1lKG1ldGEuYmxvY2tUaW1lIGFzIG51bWJlcik7XG4gICAgICBoaXN0b3J5LnNpZyA9IG1ldGEudHJhbnNhY3Rpb24uc2lnbmF0dXJlc1swXTtcbiAgICAgIGhpc3RvcnkuaW5uZXJJbnN0cnVjdGlvbiA9IGZhbHNlO1xuXG4gICAgICBpZiAoXG4gICAgICAgIG1ldGEubWV0YT8uaW5uZXJJbnN0cnVjdGlvbnMgJiZcbiAgICAgICAgbWV0YS5tZXRhPy5pbm5lckluc3RydWN0aW9ucy5sZW5ndGggIT09IDBcbiAgICAgICkge1xuICAgICAgICAvLyBpbm5lciBpbnN0cnVjdGlvbnNcbiAgICAgICAgaGlzdG9yeS5pbm5lckluc3RydWN0aW9uID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBoaXN0b3J5O1xuICAgIH07XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBQYXJzZWRUcmFuc2FjdGlvbldpdGhNZXRhIH0gZnJvbSAnQHNvbGFuYS93ZWIzLmpzJztcbmltcG9ydCB7IE1pbnRUbyB9IGZyb20gJ34vdHlwZXMvdHJhbnNhY3Rpb24tZmlsdGVyJztcbmltcG9ydCB7IEhpc3RvcnkgfSBmcm9tICd+L3R5cGVzL2hpc3RvcnknO1xuaW1wb3J0IHsgY29udmVydFRpbWVzdGFtcFRvRGF0ZVRpbWUgfSBmcm9tICd+L3NoYXJlZCc7XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ29udmVydGVyIHtcbiAgZXhwb3J0IG5hbWVzcGFjZSBNaW50IHtcbiAgICBleHBvcnQgY29uc3QgaW50b1VzZXJTaWRlID0gKFxuICAgICAgb3V0cHV0OiBNaW50VG8sXG4gICAgICBtZXRhOiBQYXJzZWRUcmFuc2FjdGlvbldpdGhNZXRhLFxuICAgICk6IEhpc3RvcnkgfCB1bmRlZmluZWQgPT4ge1xuICAgICAgY29uc3QgaGlzdG9yeTogSGlzdG9yeSA9IHt9O1xuXG4gICAgICBoaXN0b3J5Lm1pbnQgPSBvdXRwdXQucGFyc2VkLmluZm8ubWludDtcbiAgICAgIGhpc3RvcnkubWludEF1dGhvcml0eSA9IG91dHB1dC5wYXJzZWQuaW5mby5taW50QXV0aG9yaXR5O1xuICAgICAgaGlzdG9yeS50b2tlbkFtb3VudCA9IG91dHB1dC5wYXJzZWQuaW5mby50b2tlbkFtb3VudDtcbiAgICAgIGhpc3RvcnkuYWNjb3VudCA9IG91dHB1dC5wYXJzZWQuaW5mby5hY2NvdW50IGFzIHN0cmluZztcbiAgICAgIGhpc3RvcnkudHlwZSA9IG91dHB1dC5wcm9ncmFtO1xuICAgICAgaGlzdG9yeS5kYXRlVGltZSA9IGNvbnZlcnRUaW1lc3RhbXBUb0RhdGVUaW1lKG1ldGEuYmxvY2tUaW1lIGFzIG51bWJlcik7XG4gICAgICBoaXN0b3J5LnNpZyA9IG1ldGEudHJhbnNhY3Rpb24uc2lnbmF0dXJlc1swXTtcbiAgICAgIGhpc3RvcnkuaW5uZXJJbnN0cnVjdGlvbiA9IGZhbHNlO1xuICAgICAgaWYgKFxuICAgICAgICBtZXRhLm1ldGE/LmlubmVySW5zdHJ1Y3Rpb25zICYmXG4gICAgICAgIG1ldGEubWV0YT8uaW5uZXJJbnN0cnVjdGlvbnMubGVuZ3RoICE9PSAwXG4gICAgICApIHtcbiAgICAgICAgLy8gaW5uZXIgaW5zdHJ1Y3Rpb25zXG4gICAgICAgIGhpc3RvcnkuaW5uZXJJbnN0cnVjdGlvbiA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gaGlzdG9yeTtcbiAgICB9O1xuICB9XG59XG4iLCAiaW1wb3J0IHsgQ29sbGVjdGlvbkRldGFpbHMgYXMgTWV0YXBsZXhDb2xsZWN0aW9uRGV0YWlscyB9IGZyb20gJ0BtZXRhcGxleC1mb3VuZGF0aW9uL21wbC10b2tlbi1tZXRhZGF0YSc7XG5pbXBvcnQgeyBDb2xsZWN0aW9uRGV0YWlscywgT3B0aW9uIH0gZnJvbSAnfi90eXBlcy9yZWd1bGFyLW5mdCc7XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ29udmVydGVyIHtcbiAgZXhwb3J0IG5hbWVzcGFjZSBDb2xsZWN0aW9uRGV0YWlscyB7XG4gICAgZXhwb3J0IGNvbnN0IGludG9Vc2VyID0gKFxuICAgICAgb3V0cHV0OiBPcHRpb248TWV0YXBsZXhDb2xsZWN0aW9uRGV0YWlscz4sXG4gICAgKTogQ29sbGVjdGlvbkRldGFpbHMgfCB1bmRlZmluZWQgPT4ge1xuICAgICAgaWYgKCFvdXRwdXQpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX19raW5kOiBvdXRwdXQuX19raW5kLFxuICAgICAgICBzaXplOiBwYXJzZUludChvdXRwdXQuc2l6ZS50b1N0cmluZygxMCkpLFxuICAgICAgfTtcbiAgICB9O1xuICB9XG59XG4iLCAiaW1wb3J0IHsgT3B0aW9uLCBVc2VzIH0gZnJvbSAnfi90eXBlcy9yZWd1bGFyLW5mdCc7XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ29udmVydGVyIHtcbiAgZXhwb3J0IG5hbWVzcGFjZSBVc2VzIHtcbiAgICBleHBvcnQgY29uc3QgaW50b1VzZXJTaWRlID0gKG91dHB1dDogT3B0aW9uPFVzZXM+KTogVXNlcyB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICBpZiAoIW91dHB1dCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9O1xuICB9XG59XG4iLCAiaW1wb3J0IHsgQ29udmVydGVyIGFzIF9DcmVhdG9ycyB9IGZyb20gJy4vY3JlYXRvcnMnO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIF9Vc2VzIH0gZnJvbSAnLi91c2VzJztcbmltcG9ydCB7IElucHV0VG9rZW5NZXRhZGF0YSwgVG9rZW5NZXRhZGF0YSB9IGZyb20gJ34vdHlwZXMvc3BsLXRva2VuJztcbmltcG9ydCB7IE1ldGFkYXRhQW5kT2ZmY2hhaW4gfSBmcm9tICd+L3R5cGVzL3N0b3JhZ2UnO1xuaW1wb3J0IHsgY29udmVydFRpbWVzdGFtcFRvRGF0ZVRpbWUgfSBmcm9tICd+L3NoYXJlZCc7XG5pbXBvcnQgeyBEYXRhVjIgfSBmcm9tICdAbWV0YXBsZXgtZm91bmRhdGlvbi9tcGwtdG9rZW4tbWV0YWRhdGEnO1xuXG5leHBvcnQgbmFtZXNwYWNlIENvbnZlcnRlciB7XG4gIGV4cG9ydCBuYW1lc3BhY2UgVG9rZW5NZXRhZGF0YSB7XG4gICAgZXhwb3J0IGNvbnN0IGludG9JbmZyYSA9IChcbiAgICAgIGlucHV0OiBJbnB1dFRva2VuTWV0YWRhdGEsXG4gICAgICB1cmk6IHN0cmluZyxcbiAgICAgIHNlbGxlckZlZUJhc2lzUG9pbnRzOiBudW1iZXIsXG4gICAgKTogRGF0YVYyID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IGlucHV0Lm5hbWUsXG4gICAgICAgIHN5bWJvbDogaW5wdXQuc3ltYm9sLFxuICAgICAgICB1cmksXG4gICAgICAgIHNlbGxlckZlZUJhc2lzUG9pbnRzLFxuICAgICAgICBjcmVhdG9yczogX0NyZWF0b3JzLkNyZWF0b3JzLmludG9JbmZyYShpbnB1dC5jcmVhdG9ycyksXG4gICAgICAgIGNvbGxlY3Rpb246IG51bGwsXG4gICAgICAgIHVzZXM6IGlucHV0LnVzZXMgfHwgbnVsbCxcbiAgICAgIH07XG4gICAgfTtcblxuICAgIGV4cG9ydCBjb25zdCBpbnRvVXNlciA9IChcbiAgICAgIG91dHB1dDogTWV0YWRhdGFBbmRPZmZjaGFpbixcbiAgICAgIHRva2VuQW1vdW50OiBzdHJpbmcsXG4gICAgKTogVG9rZW5NZXRhZGF0YSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtaW50OiBvdXRwdXQub25jaGFpbi5taW50LnRvU3RyaW5nKCksXG4gICAgICAgIHJveWFsdHk6IG91dHB1dC5vbmNoYWluLmRhdGEuc2VsbGVyRmVlQmFzaXNQb2ludHMsXG4gICAgICAgIG5hbWU6IGRlbGV0ZU51bGxTdHJpbmdzKG91dHB1dC5vbmNoYWluLmRhdGEubmFtZSksXG4gICAgICAgIHN5bWJvbDogZGVsZXRlTnVsbFN0cmluZ3Mob3V0cHV0Lm9uY2hhaW4uZGF0YS5zeW1ib2wpLFxuICAgICAgICB0b2tlbkFtb3VudDogdG9rZW5BbW91bnQsXG4gICAgICAgIHVyaTogZGVsZXRlTnVsbFN0cmluZ3Mob3V0cHV0Lm9uY2hhaW4uZGF0YS51cmkpLFxuICAgICAgICBjcmVhdG9yczogX0NyZWF0b3JzLkNyZWF0b3JzLmludG9Vc2VyKG91dHB1dC5vbmNoYWluLmRhdGEuY3JlYXRvcnMpLFxuICAgICAgICB1c2VzOiBfVXNlcy5Vc2VzLmludG9Vc2VyU2lkZShvdXRwdXQub25jaGFpbi51c2VzKSxcbiAgICAgICAgZGF0ZVRpbWU6IGNvbnZlcnRUaW1lc3RhbXBUb0RhdGVUaW1lKG91dHB1dC5vZmZjaGFpbi5jcmVhdGVkX2F0KSxcbiAgICAgICAgb2ZmY2hhaW46IG91dHB1dC5vZmZjaGFpbixcbiAgICAgIH07XG4gICAgfTtcbiAgICAvLyBkZWxldGUgTlVMTCgweDAwKSBzdHJpbmdzIGZ1bmN0aW9uXG4gICAgZXhwb3J0IGNvbnN0IGRlbGV0ZU51bGxTdHJpbmdzID0gKHN0cjogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFwwL2csICcnKTtcbiAgICB9O1xuICB9XG59XG4iLCAiaW1wb3J0IHsgQ29udmVydGVyIGFzIENvbGxlY3Rpb24gfSBmcm9tICcuL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIENvbGxlY3Rpb25EZXRhaWxzIH0gZnJvbSAnLi9jb2xsZWN0aW9uLWRldGFpbHMnO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIENyZWF0b3JzIH0gZnJvbSAnLi9jcmVhdG9ycyc7XG5pbXBvcnQgeyBDb252ZXJ0ZXIgYXMgVXNlcyB9IGZyb20gJy4vdXNlcyc7XG5pbXBvcnQgeyBDb252ZXJ0ZXIgYXMgVG9rZW4gfSBmcm9tICcuL3Rva2VuLW1ldGFkYXRhJztcbmltcG9ydCB7IGNvbnZlcnRUaW1lc3RhbXBUb0RhdGVUaW1lIH0gZnJvbSAnfi9zaGFyZWQnO1xuaW1wb3J0IHsgSW5wdXROZnRNZXRhZGF0YSwgUmVndWxhck5mdE1ldGFkYXRhIH0gZnJvbSAnfi90eXBlcy9yZWd1bGFyLW5mdCc7XG5pbXBvcnQgeyBEYXRhVjIgfSBmcm9tICdAbWV0YXBsZXgtZm91bmRhdGlvbi9tcGwtdG9rZW4tbWV0YWRhdGEnO1xuaW1wb3J0IHsgTWV0YWRhdGFBbmRPZmZjaGFpbiB9IGZyb20gJ34vdHlwZXMvc3RvcmFnZSc7XG5cbmV4cG9ydCBuYW1lc3BhY2UgQ29udmVydGVyIHtcbiAgZXhwb3J0IG5hbWVzcGFjZSBSZWd1bGFyTmZ0TWV0YWRhdGEge1xuICAgIGV4cG9ydCBjb25zdCBpbnRvSW5mcmEgPSAoXG4gICAgICBpbnB1dDogSW5wdXROZnRNZXRhZGF0YSxcbiAgICAgIHVyaTogc3RyaW5nLFxuICAgICAgc2VsbGVyRmVlQmFzaXNQb2ludHM6IG51bWJlcixcbiAgICApOiBEYXRhVjIgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogaW5wdXQubmFtZSxcbiAgICAgICAgc3ltYm9sOiBpbnB1dC5zeW1ib2wsXG4gICAgICAgIHVyaSxcbiAgICAgICAgc2VsbGVyRmVlQmFzaXNQb2ludHMsXG4gICAgICAgIGNyZWF0b3JzOiBDcmVhdG9ycy5DcmVhdG9ycy5pbnRvSW5mcmEoaW5wdXQuY3JlYXRvcnMpLFxuICAgICAgICBjb2xsZWN0aW9uOiBDb2xsZWN0aW9uLkNvbGxlY3Rpb24uaW50b0luZnJhKGlucHV0LmNvbGxlY3Rpb24pLFxuICAgICAgICB1c2VzOiBpbnB1dC51c2VzIHx8IG51bGwsXG4gICAgICB9O1xuICAgIH07XG5cbiAgICBleHBvcnQgY29uc3QgaW50b1VzZXIgPSAoXG4gICAgICBvdXRwdXQ6IE1ldGFkYXRhQW5kT2ZmY2hhaW4sXG4gICAgKTogUmVndWxhck5mdE1ldGFkYXRhID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1pbnQ6IG91dHB1dC5vbmNoYWluLm1pbnQudG9TdHJpbmcoKSxcbiAgICAgICAgdXBkYXRlQXV0aG9yaXR5OiBvdXRwdXQub25jaGFpbi51cGRhdGVBdXRob3JpdHkudG9TdHJpbmcoKSxcbiAgICAgICAgcm95YWx0eTogb3V0cHV0Lm9uY2hhaW4uZGF0YS5zZWxsZXJGZWVCYXNpc1BvaW50cyxcbiAgICAgICAgbmFtZTogVG9rZW4uVG9rZW5NZXRhZGF0YS5kZWxldGVOdWxsU3RyaW5ncyhvdXRwdXQub25jaGFpbi5kYXRhLm5hbWUpLFxuICAgICAgICBzeW1ib2w6IFRva2VuLlRva2VuTWV0YWRhdGEuZGVsZXRlTnVsbFN0cmluZ3MoXG4gICAgICAgICAgb3V0cHV0Lm9uY2hhaW4uZGF0YS5zeW1ib2wsXG4gICAgICAgICksXG4gICAgICAgIHVyaTogVG9rZW4uVG9rZW5NZXRhZGF0YS5kZWxldGVOdWxsU3RyaW5ncyhvdXRwdXQub25jaGFpbi5kYXRhLnVyaSksXG4gICAgICAgIGlzTXV0YWJsZTogb3V0cHV0Lm9uY2hhaW4uaXNNdXRhYmxlLFxuICAgICAgICBwcmltYXJ5U2FsZUhhcHBlbmVkOiBvdXRwdXQub25jaGFpbi5wcmltYXJ5U2FsZUhhcHBlbmVkLFxuICAgICAgICBjcmVhdG9yczogQ3JlYXRvcnMuQ3JlYXRvcnMuaW50b1VzZXIob3V0cHV0Lm9uY2hhaW4uZGF0YS5jcmVhdG9ycyksXG4gICAgICAgIGVkaXRpb25Ob25jZTogb3V0cHV0Lm9uY2hhaW4uZWRpdGlvbk5vbmNlLFxuICAgICAgICBjb2xsZWN0aW9uOiBDb2xsZWN0aW9uLkNvbGxlY3Rpb24uaW50b1VzZXIob3V0cHV0Lm9uY2hhaW4uY29sbGVjdGlvbiksXG4gICAgICAgIGNvbGxlY3Rpb25EZXRhaWxzOiBDb2xsZWN0aW9uRGV0YWlscy5Db2xsZWN0aW9uRGV0YWlscy5pbnRvVXNlcihcbiAgICAgICAgICBvdXRwdXQub25jaGFpbi5jb2xsZWN0aW9uRGV0YWlscyxcbiAgICAgICAgKSxcbiAgICAgICAgdXNlczogVXNlcy5Vc2VzLmludG9Vc2VyU2lkZShvdXRwdXQub25jaGFpbi51c2VzKSxcbiAgICAgICAgZGF0ZVRpbWU6IGNvbnZlcnRUaW1lc3RhbXBUb0RhdGVUaW1lKG91dHB1dC5vZmZjaGFpbi5jcmVhdGVkX2F0KSxcbiAgICAgICAgb2ZmY2hhaW46IG91dHB1dC5vZmZjaGFpbixcbiAgICAgIH07XG4gICAgfTtcbiAgfVxufVxuIiwgImltcG9ydCB7IG92ZXJ3cml0ZU9iamVjdCwgUmVzdWx0IH0gZnJvbSAnfi9zaGFyZWQnO1xuaW1wb3J0IHsgU2VjcmV0IH0gZnJvbSAnfi90eXBlcy9hY2NvdW50JztcbmltcG9ydCB7fSBmcm9tICd+L3R5cGVzL2NvbnZlcnRlcic7XG5pbXBvcnQgeyBGaWxlVHlwZSwgUHJvcGVydGllcywgU3RvcmFnZVR5cGUgfSBmcm9tICd+L3R5cGVzL3N0b3JhZ2UnO1xuXG5leHBvcnQgbmFtZXNwYWNlIENvbnZlcnRlciB7XG4gIGV4cG9ydCBuYW1lc3BhY2UgUHJvcGVydGllcyB7XG4gICAgZXhwb3J0IGNvbnN0IGludG9JbmZyYSA9IGFzeW5jIChcbiAgICAgIGlucHV0OiBQcm9wZXJ0aWVzIHwgdW5kZWZpbmVkLFxuICAgICAgY2FsbGJhY2tGdW5jOiAoXG4gICAgICAgIGZpbGVQYXRoOiBGaWxlVHlwZSxcbiAgICAgICAgc3RvcmFnZVR5cGU6IFN0b3JhZ2VUeXBlLFxuICAgICAgICBmZWVQYXllcj86IFNlY3JldCxcbiAgICAgICkgPT4gUHJvbWlzZTxSZXN1bHQ8c3RyaW5nLCBFcnJvcj4+LFxuICAgICAgc3RvcmFnZVR5cGU6IFN0b3JhZ2VUeXBlLFxuICAgICAgZmVlUGF5ZXI/OiBTZWNyZXQsXG4gICAgKTogUHJvbWlzZTxQcm9wZXJ0aWVzPiA9PiB7XG4gICAgICBpZiAoIWlucHV0IHx8ICFpbnB1dC5maWxlcykge1xuICAgICAgICByZXR1cm4ge307XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIGlucHV0LmZpbGVzLm1hcChhc3luYyAoZmlsZSkgPT4ge1xuICAgICAgICAgIGlmICghZmlsZS5maWxlUGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBjYWxsYmFja0Z1bmMoZmlsZS5maWxlUGF0aCwgc3RvcmFnZVR5cGUsIGZlZVBheWVyKTtcbiAgICAgICAgICBpZiAocmVzLmlzRXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihyZXMuZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBvdmVyd3JpdGVPYmplY3QoZmlsZSwgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBleGlzdHNLZXk6ICdmaWxlUGF0aCcsXG4gICAgICAgICAgICAgIHdpbGw6IHsga2V5OiAndXJpJywgdmFsdWU6IHJlcy52YWx1ZSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuICAgICAgcmV0dXJuIHsgLi4uaW5wdXQsIGZpbGVzIH0gYXMgUHJvcGVydGllcztcbiAgICB9O1xuICB9XG59XG4iLCAiaW1wb3J0IHsgUGFyc2VkVHJhbnNhY3Rpb25XaXRoTWV0YSB9IGZyb20gJ0Bzb2xhbmEvd2ViMy5qcyc7XG5pbXBvcnQgeyBQb3N0VG9rZW5BY2NvdW50IH0gZnJvbSAnfi90eXBlcy90cmFuc2FjdGlvbi1maWx0ZXInO1xuaW1wb3J0IHsgSGlzdG9yeSB9IGZyb20gJ34vdHlwZXMvaGlzdG9yeSc7XG5pbXBvcnQgeyBUcmFuc2ZlckNoZWNrZWQgfSBmcm9tICd+L3R5cGVzL3RyYW5zYWN0aW9uLWZpbHRlcic7XG5pbXBvcnQgeyBjb252ZXJ0VGltZXN0YW1wVG9EYXRlVGltZSB9IGZyb20gJ34vc2hhcmVkJztcblxuZXhwb3J0IG5hbWVzcGFjZSBDb252ZXJ0ZXIge1xuICBleHBvcnQgbmFtZXNwYWNlIFRyYW5zZmVyQ2hlY2tlZCB7XG4gICAgZXhwb3J0IGNvbnN0IGludG9Vc2VyU2lkZSA9IChcbiAgICAgIG91dHB1dDogVHJhbnNmZXJDaGVja2VkLFxuICAgICAgbWV0YTogUGFyc2VkVHJhbnNhY3Rpb25XaXRoTWV0YSxcbiAgICAgIG1hcHBpbmdUb2tlbkFjY291bnQ/OiBQb3N0VG9rZW5BY2NvdW50W10sXG4gICAgKTogSGlzdG9yeSB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICBjb25zdCBoaXN0b3J5OiBIaXN0b3J5ID0ge307XG5cbiAgICAgIGlmIChtYXBwaW5nVG9rZW5BY2NvdW50KSB7XG4gICAgICAgIGNvbnN0IGZvdW5kU291cmNlID0gbWFwcGluZ1Rva2VuQWNjb3VudC5maW5kKFxuICAgICAgICAgIChtKSA9PiBtLmFjY291bnQgPT09IG91dHB1dC5wYXJzZWQuaW5mby5zb3VyY2UsXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGZvdW5kRGVzdCA9IG1hcHBpbmdUb2tlbkFjY291bnQuZmluZChcbiAgICAgICAgICAobSkgPT4gbS5hY2NvdW50ID09PSBvdXRwdXQucGFyc2VkLmluZm8uZGVzdGluYXRpb24sXG4gICAgICAgICk7XG4gICAgICAgIGZvdW5kU291cmNlICYmIChoaXN0b3J5LnNvdXJjZSA9IGZvdW5kU291cmNlLm93bmVyKTtcbiAgICAgICAgZm91bmREZXN0ICYmIChoaXN0b3J5LmRlc3RpbmF0aW9uID0gZm91bmREZXN0Lm93bmVyKTtcbiAgICAgIH1cblxuICAgICAgaGlzdG9yeS50b2tlbkFtb3VudCA9IG91dHB1dC5wYXJzZWQuaW5mby50b2tlbkFtb3VudDtcbiAgICAgIGhpc3RvcnkubWludCA9IG91dHB1dC5wYXJzZWQuaW5mby5taW50O1xuICAgICAgaGlzdG9yeS5tdWx0aXNpZ0F1dGhvcml0eSA9IG91dHB1dC5wYXJzZWQuaW5mby5tdWx0aXNpZ0F1dGhvcml0eTtcbiAgICAgIGhpc3Rvcnkuc2lnbmVycyA9IG91dHB1dC5wYXJzZWQuaW5mby5zaWduZXJzO1xuICAgICAgaGlzdG9yeS50eXBlID0gb3V0cHV0LnByb2dyYW07XG4gICAgICBoaXN0b3J5LmRhdGVUaW1lID0gY29udmVydFRpbWVzdGFtcFRvRGF0ZVRpbWUobWV0YS5ibG9ja1RpbWUgYXMgbnVtYmVyKTtcbiAgICAgIGhpc3Rvcnkuc2lnID0gbWV0YS50cmFuc2FjdGlvbi5zaWduYXR1cmVzWzBdO1xuICAgICAgaGlzdG9yeS5pbm5lckluc3RydWN0aW9uID0gZmFsc2U7XG5cbiAgICAgIC8vIGlubmVyIGluc3RydWN0aW9uc1xuICAgICAgaWYgKFxuICAgICAgICBtZXRhLm1ldGE/LmlubmVySW5zdHJ1Y3Rpb25zICYmXG4gICAgICAgIG1ldGEubWV0YT8uaW5uZXJJbnN0cnVjdGlvbnMubGVuZ3RoICE9PSAwXG4gICAgICApIHtcbiAgICAgICAgaGlzdG9yeS5pbm5lckluc3RydWN0aW9uID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGhpc3Rvcnk7XG4gICAgfTtcbiAgfVxufVxuIiwgImltcG9ydCB7IFBhcnNlZFRyYW5zYWN0aW9uV2l0aE1ldGEgfSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuaW1wb3J0IHsgVHJhbnNmZXIgfSBmcm9tICd+L3R5cGVzL3RyYW5zYWN0aW9uLWZpbHRlcic7XG5pbXBvcnQgeyBIaXN0b3J5IH0gZnJvbSAnfi90eXBlcy9oaXN0b3J5JztcbmltcG9ydCB7IGNvbnZlcnRUaW1lc3RhbXBUb0RhdGVUaW1lIH0gZnJvbSAnfi9zaGFyZWQnO1xuXG5leHBvcnQgbmFtZXNwYWNlIENvbnZlcnRlciB7XG4gIGV4cG9ydCBuYW1lc3BhY2UgVHJhbnNmZXIge1xuICAgIGV4cG9ydCBjb25zdCBpbnRvVXNlclNpZGUgPSAoXG4gICAgICBvdXRwdXQ6IFRyYW5zZmVyLFxuICAgICAgbWV0YTogUGFyc2VkVHJhbnNhY3Rpb25XaXRoTWV0YSxcbiAgICApOiBIaXN0b3J5IHwgdW5kZWZpbmVkID0+IHtcbiAgICAgIGNvbnN0IGhpc3Rvcnk6IEhpc3RvcnkgPSB7fTtcblxuICAgICAgLy8gdmFsaWRhdGlvbiBjaGVja1xuICAgICAgaWYgKCFvdXRwdXQucGFyc2VkLmluZm8uZGVzdGluYXRpb24gfHwgIW91dHB1dC5wYXJzZWQuaW5mby5sYW1wb3J0cykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGhpc3Rvcnkuc291cmNlID0gb3V0cHV0LnBhcnNlZC5pbmZvLnNvdXJjZTtcbiAgICAgIGhpc3RvcnkuZGVzdGluYXRpb24gPSBvdXRwdXQucGFyc2VkLmluZm8uZGVzdGluYXRpb247XG4gICAgICBoaXN0b3J5LnNvbCA9IG91dHB1dC5wYXJzZWQuaW5mby5sYW1wb3J0cz8udG9Tb2woKS50b1N0cmluZygpO1xuICAgICAgaGlzdG9yeS50eXBlID0gb3V0cHV0LnByb2dyYW07XG4gICAgICBoaXN0b3J5LmRhdGVUaW1lID0gY29udmVydFRpbWVzdGFtcFRvRGF0ZVRpbWUobWV0YS5ibG9ja1RpbWUgYXMgbnVtYmVyKTtcbiAgICAgIGhpc3Rvcnkuc2lnID0gbWV0YS50cmFuc2FjdGlvbi5zaWduYXR1cmVzWzBdO1xuICAgICAgaGlzdG9yeS5pbm5lckluc3RydWN0aW9uID0gZmFsc2U7XG5cbiAgICAgIC8vIGlubmVyIGluc3RydWN0aW9uc1xuICAgICAgaWYgKFxuICAgICAgICBtZXRhLm1ldGE/LmlubmVySW5zdHJ1Y3Rpb25zICYmXG4gICAgICAgIG1ldGEubWV0YT8uaW5uZXJJbnN0cnVjdGlvbnMubGVuZ3RoICE9PSAwXG4gICAgICApIHtcbiAgICAgICAgaGlzdG9yeS5pbm5lckluc3RydWN0aW9uID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGhpc3Rvcnk7XG4gICAgfTtcbiAgfVxufVxuIiwgImltcG9ydCB7IENvbnZlcnRlciBhcyBDb21wcmVzc2VkTmZ0TWV0YWRhdGEgfSBmcm9tICcuL2NvbXByZXNzZWQtbmZ0LW1ldGFkYXRhJztcbmltcG9ydCB7IENvbnZlcnRlciBhcyBDb2xsZWN0aW9uIH0gZnJvbSAnLi9jb2xsZWN0aW9uJztcbmltcG9ydCB7IENvbnZlcnRlciBhcyBDcmVhdG9ycyB9IGZyb20gJy4vY3JlYXRvcnMnO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIE1lbW8gfSBmcm9tICcuL21lbW8nO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIE1pbnQgfSBmcm9tICcuL21pbnQnO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIFJlZ3VsYXJOZnRNZXRhZGF0YSB9IGZyb20gJy4vcmVndWxhci1uZnQtbWV0YWRhdGEnO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIFByb3BlcnRpZXMgfSBmcm9tICcuL3Byb3BlcnRpZXMnO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIFJveWFsdHkgfSBmcm9tICcuL3JveWFsdHknO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIFRva2VuTWV0YWRhdGEgfSBmcm9tICcuL3Rva2VuLW1ldGFkYXRhJztcbmltcG9ydCB7IENvbnZlcnRlciBhcyBUcmFuc2ZlckNoZWNrZWQgfSBmcm9tICcuL3RyYW5zZmVyLWNoZWNrZWQnO1xuaW1wb3J0IHsgQ29udmVydGVyIGFzIFRyYW5zZmVyIH0gZnJvbSAnLi90cmFuc2Zlcic7XG5pbXBvcnQgeyBDb252ZXJ0ZXIgYXMgVXNlcyB9IGZyb20gJy4vdXNlcyc7XG5cbmV4cG9ydCBjb25zdCBDb252ZXJ0ZXIgPSB7XG4gIC4uLkNvbXByZXNzZWROZnRNZXRhZGF0YSxcbiAgLi4uQ29sbGVjdGlvbixcbiAgLi4uQ3JlYXRvcnMsXG4gIC4uLk1lbW8sXG4gIC4uLk1pbnQsXG4gIC4uLlJlZ3VsYXJOZnRNZXRhZGF0YSxcbiAgLi4uUHJvcGVydGllcyxcbiAgLi4uUm95YWx0eSxcbiAgLi4uVG9rZW5NZXRhZGF0YSxcbiAgLi4uVHJhbnNmZXJDaGVja2VkLFxuICAuLi5UcmFuc2ZlcixcbiAgLi4uVXNlcyxcbn07XG4iLCAiaW1wb3J0IHsgUmVzdWx0LCBUcnkgfSBmcm9tICd+L3NoYXJlZCc7XG5pbXBvcnQgeyBDb252ZXJ0ZXIgfSBmcm9tICd+L2NvbnZlcnRlcic7XG5pbXBvcnQgeyBEZXRhaWxzLCBMaW1pdCB9IGZyb20gJ34vdHlwZXMvdmFsaWRhdG9yJztcbmltcG9ydCB7IElucHV0TmZ0TWV0YWRhdGEgfSBmcm9tICd+L3R5cGVzL3JlZ3VsYXItbmZ0JztcbmltcG9ydCB7IE9mZmNoYWluIH0gZnJvbSAnfi90eXBlcy9zdG9yYWdlJztcbmltcG9ydCB7IERhdGFWMiB9IGZyb20gJ0BtZXRhcGxleC1mb3VuZGF0aW9uL21wbC10b2tlbi1tZXRhZGF0YSc7XG5cbmV4cG9ydCBuYW1lc3BhY2UgVmFsaWRhdG9yIHtcbiAgZXhwb3J0IG5hbWVzcGFjZSBNZXNzYWdlIHtcbiAgICBleHBvcnQgY29uc3QgU1VDQ0VTUyA9ICdzdWNjZXNzJztcbiAgICBleHBvcnQgY29uc3QgU01BTExfTlVNQkVSID0gJ3RvbyBzbWFsbCc7XG4gICAgZXhwb3J0IGNvbnN0IEJJR19OVU1CRVIgPSAndG9vIGJpZyc7XG4gICAgZXhwb3J0IGNvbnN0IExPTkdfTEVOR1RIID0gJ3RvbyBsb25nJztcbiAgICBleHBvcnQgY29uc3QgRU1QVFkgPSAnaW52YWxpZCBlbXB0eSB2YWx1ZSc7XG4gICAgZXhwb3J0IGNvbnN0IElOVkFMSURfVVJMID0gJ2ludmFsaWQgdXJsJztcbiAgICBleHBvcnQgY29uc3QgT05MWV9OT0RFX0pTID0gJ2BzdHJpbmdgIHR5cGUgaXMgb25seSBOb2RlLmpzJztcbiAgfVxuXG4gIGV4cG9ydCBjb25zdCBOQU1FX0xFTkdUSCA9IDMyO1xuICBleHBvcnQgY29uc3QgU1lNQk9MX0xFTkdUSCA9IDEwO1xuICBleHBvcnQgY29uc3QgVVJMX0xFTkdUSCA9IDIwMDtcbiAgZXhwb3J0IGNvbnN0IFJPWUFMVFlfTUFYID0gMTAwO1xuICBleHBvcnQgY29uc3QgU0VMTEVSX0ZFRV9CQVNJU19QT0lOVFNfTUFYID0gMTAwMDA7XG4gIGV4cG9ydCBjb25zdCBST1lBTFRZX01JTiA9IDA7XG5cbiAgZXhwb3J0IGNvbnN0IGlzUm95YWx0eSA9IChcbiAgICByb3lhbHR5OiBudW1iZXIsXG4gICk6IFJlc3VsdDxzdHJpbmcsIFZhbGlkYXRvckVycm9yPiA9PiB7XG4gICAgcmV0dXJuIFRyeSgoKSA9PiB7XG4gICAgICBjb25zdCBrZXkgPSAncm95YWx0eSc7XG4gICAgICBpZiAocm95YWx0eSAhPT0gMCAmJiAhcm95YWx0eSkge1xuICAgICAgICB0aHJvdyBjcmVhdGVFcnJvcihrZXksIE1lc3NhZ2UuRU1QVFksIHJveWFsdHkpO1xuICAgICAgfVxuICAgICAgaWYgKHJveWFsdHkgPCBST1lBTFRZX01JTikge1xuICAgICAgICB0aHJvdyBjcmVhdGVFcnJvcihrZXksIE1lc3NhZ2UuU01BTExfTlVNQkVSLCByb3lhbHR5LCB7XG4gICAgICAgICAgdGhyZXNob2xkOiBST1lBTFRZX01JTixcbiAgICAgICAgICBjb25kaXRpb246ICd1bmRlck1pbicsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChyb3lhbHR5ID4gUk9ZQUxUWV9NQVgpIHtcbiAgICAgICAgdGhyb3cgY3JlYXRlRXJyb3Ioa2V5LCBNZXNzYWdlLkJJR19OVU1CRVIsIHJveWFsdHksIHtcbiAgICAgICAgICB0aHJlc2hvbGQ6IFJPWUFMVFlfTUFYLFxuICAgICAgICAgIGNvbmRpdGlvbjogJ292ZXJNYXgnLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBNZXNzYWdlLlNVQ0NFU1M7XG4gICAgfSk7XG4gIH07XG5cbiAgZXhwb3J0IGNvbnN0IGlzU2VsbGVyRmVlQmFzaXNQb2ludHMgPSAoXG4gICAgcm95YWx0eTogbnVtYmVyLFxuICApOiBSZXN1bHQ8c3RyaW5nLCBWYWxpZGF0b3JFcnJvcj4gPT4ge1xuICAgIHJldHVybiBUcnkoKCkgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gJ3NlbGxlckZlZUJhc2lzUG9pbnRzL3NlbGxlcl9mZWVfYmFzaXNfcG9pbnRzJztcbiAgICAgIGlmIChyb3lhbHR5ICE9PSAwICYmICFyb3lhbHR5KSB7XG4gICAgICAgIHRocm93IGNyZWF0ZUVycm9yKGtleSwgTWVzc2FnZS5FTVBUWSwgcm95YWx0eSk7XG4gICAgICB9XG4gICAgICBpZiAocm95YWx0eSA8IFJPWUFMVFlfTUlOKSB7XG4gICAgICAgIHRocm93IGNyZWF0ZUVycm9yKGtleSwgTWVzc2FnZS5TTUFMTF9OVU1CRVIsIHJveWFsdHksIHtcbiAgICAgICAgICB0aHJlc2hvbGQ6IFJPWUFMVFlfTUlOLFxuICAgICAgICAgIGNvbmRpdGlvbjogJ3VuZGVyTWluJyxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHJveWFsdHkgPiBST1lBTFRZX01BWCAqIENvbnZlcnRlci5Sb3lhbHR5LlRIUkVTSE9MRCkge1xuICAgICAgICB0aHJvdyBjcmVhdGVFcnJvcihrZXksIE1lc3NhZ2UuQklHX05VTUJFUiwgcm95YWx0eSwge1xuICAgICAgICAgIHRocmVzaG9sZDogU0VMTEVSX0ZFRV9CQVNJU19QT0lOVFNfTUFYLFxuICAgICAgICAgIGNvbmRpdGlvbjogJ292ZXJNYXgnLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBNZXNzYWdlLlNVQ0NFU1M7XG4gICAgfSk7XG4gIH07XG5cbiAgZXhwb3J0IGNvbnN0IGlzTmFtZSA9IChuYW1lOiBzdHJpbmcpOiBSZXN1bHQ8c3RyaW5nLCBWYWxpZGF0b3JFcnJvcj4gPT4ge1xuICAgIHJldHVybiBUcnkoKCkgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gJ25hbWUnO1xuICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIHRocm93IGNyZWF0ZUVycm9yKGtleSwgTWVzc2FnZS5FTVBUWSwgbmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAoYnl0ZUxlbmd0aChuYW1lKSA+IE5BTUVfTEVOR1RIKSB7XG4gICAgICAgIHRocm93IGNyZWF0ZUVycm9yKGtleSwgTWVzc2FnZS5MT05HX0xFTkdUSCwgbmFtZSwge1xuICAgICAgICAgIHRocmVzaG9sZDogTkFNRV9MRU5HVEgsXG4gICAgICAgICAgY29uZGl0aW9uOiAnb3Zlck1heCcsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE1lc3NhZ2UuU1VDQ0VTUztcbiAgICB9KTtcbiAgfTtcblxuICBleHBvcnQgY29uc3QgaXNTeW1ib2wgPSAoc3ltYm9sOiBzdHJpbmcpOiBSZXN1bHQ8c3RyaW5nLCBWYWxpZGF0b3JFcnJvcj4gPT4ge1xuICAgIHJldHVybiBUcnkoKCkgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gJ3N5bWJvbCc7XG4gICAgICBpZiAoIXN5bWJvbCkge1xuICAgICAgICB0aHJvdyBjcmVhdGVFcnJvcihrZXksIE1lc3NhZ2UuRU1QVFksIHN5bWJvbCk7XG4gICAgICB9XG4gICAgICBpZiAoYnl0ZUxlbmd0aChzeW1ib2wpID4gU1lNQk9MX0xFTkdUSCkge1xuICAgICAgICB0aHJvdyBjcmVhdGVFcnJvcihrZXksIE1lc3NhZ2UuTE9OR19MRU5HVEgsIHN5bWJvbCwge1xuICAgICAgICAgIHRocmVzaG9sZDogU1lNQk9MX0xFTkdUSCxcbiAgICAgICAgICBjb25kaXRpb246ICdvdmVyTWF4JyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gTWVzc2FnZS5TVUNDRVNTO1xuICAgIH0pO1xuICB9O1xuXG4gIGV4cG9ydCBjb25zdCBpc0ltYWdlVXJsID0gKGltYWdlOiBzdHJpbmcpOiBSZXN1bHQ8c3RyaW5nLCBWYWxpZGF0b3JFcnJvcj4gPT5cbiAgICBpc1VyaU9ySW1hZ2UoaW1hZ2UsICdpbWFnZScpO1xuXG4gIGV4cG9ydCBjb25zdCBjaGVja0FsbCA9IDxcbiAgICBUIGV4dGVuZHMgUGlja05mdFN0b3JhZ2UgfCBQaWNrTmZ0U3RvcmFnZU1ldGFwbGV4IHwgUGlja01ldGFwbGV4LFxuICA+KFxuICAgIG1ldGFkYXRhOiBULFxuICApOiBSZXN1bHQ8c3RyaW5nLCBWYWxpZGF0b3JFcnJvcj4gPT4ge1xuICAgIHJldHVybiBUcnkoKCkgPT4ge1xuICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG1ldGFkYXRhKTtcbiAgICAgIGNvbnN0IHJlc3VsdHM6IERldGFpbHNbXSA9IFtdO1xuICAgICAga2V5cy5tYXAoKGtleSkgPT4ge1xuICAgICAgICBsZXQgcmVzITogUmVzdWx0PHN0cmluZywgVmFsaWRhdG9yRXJyb3I+O1xuICAgICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgICAgIGNhc2UgJ2ltYWdlJzpcbiAgICAgICAgICAgIGlmIChrZXkgaW4gbWV0YWRhdGEgJiYgbWV0YWRhdGEuaW1hZ2UpIHtcbiAgICAgICAgICAgICAgcmVzID0gaXNJbWFnZVVybChtZXRhZGF0YS5pbWFnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdyb3lhbHR5JzpcbiAgICAgICAgICAgIGlmIChrZXkgaW4gbWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgcmVzID0gaXNSb3lhbHR5KG1ldGFkYXRhLnJveWFsdHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnc2VsbGVyX2ZlZV9iYXNpc19wb2ludHMnOlxuICAgICAgICAgICAgaWYgKGtleSBpbiBtZXRhZGF0YSAmJiBtZXRhZGF0YS5zZWxsZXJfZmVlX2Jhc2lzX3BvaW50cykge1xuICAgICAgICAgICAgICByZXMgPSBpc1NlbGxlckZlZUJhc2lzUG9pbnRzKG1ldGFkYXRhLnNlbGxlcl9mZWVfYmFzaXNfcG9pbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3NlbGxlckZlZUJhc2lzUG9pbnRzJzpcbiAgICAgICAgICAgIGlmIChrZXkgaW4gbWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgcmVzID0gaXNTZWxsZXJGZWVCYXNpc1BvaW50cyhtZXRhZGF0YS5zZWxsZXJGZWVCYXNpc1BvaW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICduYW1lJzpcbiAgICAgICAgICAgIGlmIChtZXRhZGF0YS5uYW1lKSB7XG4gICAgICAgICAgICAgIHJlcyA9IGlzTmFtZShtZXRhZGF0YS5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgICAgICAgICBpZiAobWV0YWRhdGEuc3ltYm9sKSB7XG4gICAgICAgICAgICAgIHJlcyA9IGlzU3ltYm9sKG1ldGFkYXRhLnN5bWJvbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzICYmIHJlcy5pc0Vycikge1xuICAgICAgICAgIHJlc3VsdHMucHVzaCguLi5yZXMuZXJyb3IuZGV0YWlscyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBtZXNzYWdlID1cbiAgICAgICAgICAnQ2F1Z2h0IGluIHRoZSB2YWxpZGF0aW9uIGVycm9ycy4gc2VlIGluZm9ybWF0aW9uIGUuZzogZXJyPFZhbGlkYXRvckVycm9yPi5kZXRhaWxzJztcbiAgICAgICAgdGhyb3cgbmV3IFZhbGlkYXRvckVycm9yKG1lc3NhZ2UsIHJlc3VsdHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE1lc3NhZ2UuU1VDQ0VTUztcbiAgICB9KTtcbiAgfTtcblxuICB0eXBlIFBpY2tOZnRTdG9yYWdlID0gUGljazxcbiAgICBPZmZjaGFpbixcbiAgICAnbmFtZScgfCAnc3ltYm9sJyB8ICdpbWFnZScgfCAnc2VsbGVyX2ZlZV9iYXNpc19wb2ludHMnXG4gID47XG4gIHR5cGUgUGlja05mdFN0b3JhZ2VNZXRhcGxleCA9IFBpY2s8XG4gICAgSW5wdXROZnRNZXRhZGF0YSxcbiAgICAnbmFtZScgfCAnc3ltYm9sJyB8ICdyb3lhbHR5JyB8ICdmaWxlUGF0aCdcbiAgPjtcbiAgdHlwZSBQaWNrTWV0YXBsZXggPSBQaWNrPFxuICAgIERhdGFWMixcbiAgICAnbmFtZScgfCAnc3ltYm9sJyB8ICd1cmknIHwgJ3NlbGxlckZlZUJhc2lzUG9pbnRzJ1xuICA+O1xuXG4gIGNvbnN0IGJ5dGVMZW5ndGggPSAodmFsdWU6IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgY29uc3QgdGV4dCA9IG5ldyBUZXh0RW5jb2RlcigpO1xuICAgIHJldHVybiB0ZXh0LmVuY29kZSh2YWx1ZSkubGVuZ3RoO1xuICB9O1xuXG4gIGNvbnN0IGNyZWF0ZUVycm9yID0gKFxuICAgIGtleTogc3RyaW5nLFxuICAgIG1lc3NhZ2U6IHN0cmluZyxcbiAgICBhY3R1YWw6IHN0cmluZyB8IG51bWJlcixcbiAgICBsaW1pdD86IExpbWl0LFxuICApOiBWYWxpZGF0b3JFcnJvciA9PiB7XG4gICAgbGV0IGVycm9yOiBWYWxpZGF0b3JFcnJvcjtcbiAgICBpZiAobGltaXQpIHtcbiAgICAgIGVycm9yID0gbmV3IFZhbGlkYXRvckVycm9yKG1lc3NhZ2UsIFt7IGtleSwgbWVzc2FnZSwgYWN0dWFsLCBsaW1pdCB9XSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9yID0gbmV3IFZhbGlkYXRvckVycm9yKG1lc3NhZ2UsIFt7IGtleSwgbWVzc2FnZSwgYWN0dWFsIH1dKTtcbiAgICB9XG4gICAgcmV0dXJuIGVycm9yO1xuICB9O1xuXG4gIGNvbnN0IGlzVXJpT3JJbWFnZSA9IChcbiAgICBpbWFnZU9yVXJpOiBzdHJpbmcsXG4gICAga2V5OiBzdHJpbmcsXG4gICk6IFJlc3VsdDxzdHJpbmcsIFZhbGlkYXRvckVycm9yPiA9PiB7XG4gICAgcmV0dXJuIFRyeSgoKSA9PiB7XG4gICAgICBpZiAoIWltYWdlT3JVcmkpIHtcbiAgICAgICAgdGhyb3cgY3JlYXRlRXJyb3Ioa2V5LCBNZXNzYWdlLkVNUFRZLCBpbWFnZU9yVXJpKTtcbiAgICAgIH1cbiAgICAgIGlmIChieXRlTGVuZ3RoKGltYWdlT3JVcmkpID4gVVJMX0xFTkdUSCkge1xuICAgICAgICB0aHJvdyBjcmVhdGVFcnJvcihrZXksIE1lc3NhZ2UuTE9OR19MRU5HVEgsIGltYWdlT3JVcmksIHtcbiAgICAgICAgICB0aHJlc2hvbGQ6IFVSTF9MRU5HVEgsXG4gICAgICAgICAgY29uZGl0aW9uOiAnb3Zlck1heCcsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKCEvaHR0cHM/OlxcL1xcL1stXy4hfipcXFxcKClhLXpBLVowLTk7PzomPSssJSNdKy9nLnRlc3QoaW1hZ2VPclVyaSkpIHtcbiAgICAgICAgdGhyb3cgY3JlYXRlRXJyb3Ioa2V5LCBNZXNzYWdlLklOVkFMSURfVVJMLCBpbWFnZU9yVXJpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBNZXNzYWdlLlNVQ0NFU1M7XG4gICAgfSk7XG4gIH07XG59XG5cbmV4cG9ydCBjbGFzcyBWYWxpZGF0b3JFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgZGV0YWlsczogRGV0YWlsc1tdO1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcsIGRldGFpbHM6IERldGFpbHNbXSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMuZGV0YWlscyA9IGRldGFpbHM7XG4gIH1cbn1cbiIsICJpbXBvcnQgeyBQdWJsaWNLZXkgfSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuaW1wb3J0IHsgUHVia2V5IH0gZnJvbSAnLi4vYWNjb3VudCc7XG5cbmV4cG9ydCBlbnVtIEZpbHRlclR5cGUge1xuICBNZW1vID0gJ21lbW8nLFxuICBNaW50ID0gJ21pbnQnLFxuICBPbmx5TWVtbyA9ICdvbmx5LW1lbW8nLFxuICBUcmFuc2ZlciA9ICd0cmFuc2ZlcicsXG59XG5cbmV4cG9ydCBlbnVtIE1vZHVsZU5hbWUge1xuICBTb2xOYXRpdmUgPSAnc3lzdGVtJyxcbiAgU3BsVG9rZW4gPSAnc3BsLXRva2VuJyxcbn1cblxuZXhwb3J0IGNvbnN0IEZpbHRlck9wdGlvbnMgPSB7XG4gIFRyYW5zZmVyOiB7XG4gICAgcHJvZ3JhbTogWydzeXN0ZW0nLCAnc3BsLXRva2VuJ10sXG4gICAgYWN0aW9uOiBbJ3RyYW5zZmVyJywgJ3RyYW5zZmVyQ2hlY2tlZCddLFxuICB9LFxuICBNZW1vOiB7XG4gICAgcHJvZ3JhbTogWydzcGwtbWVtbyddLFxuICAgIGFjdGlvbjogWycqJ10sXG4gIH0sXG4gIE1pbnQ6IHtcbiAgICBwcm9ncmFtOiBbJ3NwbC10b2tlbiddLFxuICAgIGFjdGlvbjogWydtaW50VG8nLCAnbWludFRvQ2hlY2tlZCddLFxuICB9LFxufTtcblxuZXhwb3J0IHR5cGUgUG9zdFRva2VuQWNjb3VudCA9IHtcbiAgYWNjb3VudDogc3RyaW5nO1xuICBvd25lcjogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgV2l0aE1lbW8gPSB7XG4gIHNpZzogc3RyaW5nW107XG4gIG1lbW86IHN0cmluZztcbn07XG5cbmV4cG9ydCB0eXBlIFRyYW5zZmVyID0ge1xuICBwYXJzZWQ6IHtcbiAgICBpbmZvOiB7XG4gICAgICBkZXN0aW5hdGlvbjogUHVia2V5O1xuICAgICAgc291cmNlOiBQdWJrZXk7XG4gICAgICBsYW1wb3J0czogbnVtYmVyO1xuICAgIH07XG4gICAgdHlwZTogc3RyaW5nO1xuICB9O1xuICBwcm9ncmFtOiBzdHJpbmc7XG4gIHByb2dyYW1JZD86IFB1YmxpY0tleTtcbn07XG5cbmV4cG9ydCB0eXBlIE1pbnRUbyA9IHtcbiAgcGFyc2VkOiB7XG4gICAgaW5mbzoge1xuICAgICAgYWNjb3VudDogUHVia2V5O1xuICAgICAgbWludDogUHVia2V5O1xuICAgICAgbWludEF1dGhvcml0eTogUHVia2V5O1xuICAgICAgdG9rZW5BbW91bnQ6IHN0cmluZztcbiAgICB9O1xuICAgIHR5cGU6IHN0cmluZztcbiAgfTtcbiAgcHJvZ3JhbTogc3RyaW5nO1xuICBwcm9ncmFtSWQ/OiBQdWJsaWNLZXk7XG59O1xuXG5leHBvcnQgdHlwZSBNaW50VG9DaGVja2VkID0gTWludFRvO1xuXG5leHBvcnQgdHlwZSBUcmFuc2ZlckNoZWNrZWQgPSB7XG4gIHBhcnNlZDoge1xuICAgIGluZm86IHtcbiAgICAgIGRlc3RpbmF0aW9uOiBQdWJrZXk7XG4gICAgICBtaW50OiBQdWJrZXk7XG4gICAgICBtdWx0aXNpZ0F1dGhvcml0eTogUHVia2V5O1xuICAgICAgc2lnbmVyczogUHVia2V5W107XG4gICAgICBzb3VyY2U6IFB1YmtleTtcbiAgICAgIHRva2VuQW1vdW50OiBzdHJpbmc7XG4gICAgfTtcbiAgICB0eXBlOiBzdHJpbmc7XG4gIH07XG4gIHByb2dyYW06IHN0cmluZztcbiAgcHJvZ3JhbUlkPzogUHVibGljS2V5O1xufTtcblxuZXhwb3J0IHR5cGUgTWVtbyA9IHtcbiAgcGFyc2VkOiBzdHJpbmc7XG4gIHByb2dyYW06IHN0cmluZztcbiAgcHJvZ3JhbUlkOiBQdWJsaWNLZXk7XG59O1xuIiwgImltcG9ydCB7IEtleXBhaXIsIExBTVBPUlRTX1BFUl9TT0wsIFB1YmxpY0tleSB9IGZyb20gJ0Bzb2xhbmEvd2ViMy5qcyc7XG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnfi9ub2RlJztcbmltcG9ydCB7IENvbnN0YW50cywgZGVidWdMb2cgfSBmcm9tICd+L3NoYXJlZCc7XG5pbXBvcnQgeyBBY2NvdW50IH0gZnJvbSAnfi9hY2NvdW50JztcbmltcG9ydCB7IEJpZ051bWJlciB9IGZyb20gJ2JpZ251bWJlci5qcyc7XG5pbXBvcnQgeyBFeHBsb3JlciB9IGZyb20gJ34vdHlwZXMvZ2xvYmFsJztcbmltcG9ydCBicyBmcm9tICdiczU4JztcblxuLyoqXG4gKiBDcmVhdGUgZXhwbG9yZXIgdXJsIGZvciBhY2NvdW50IGFkZHJlc3Mgb3Igc2lnbmF0dXJlXG4gKlxuICogQHNlZSB7QGxpbmsgdHlwZXMvZ2xvYmFsLnRzfVxuICogQHJldHVybnMgc3RyaW5nXG4gKi9cblN0cmluZy5wcm90b3R5cGUudG9FeHBsb3JlclVybCA9IGZ1bmN0aW9uIChcbiAgZXhwbG9yZXI6IEV4cGxvcmVyID0gRXhwbG9yZXIuU29sc2Nhbixcbikge1xuICBjb25zdCBlbmRQb2ludFVybCA9IE5vZGUuZ2V0Q29ubmVjdGlvbigpLnJwY0VuZHBvaW50O1xuICBkZWJ1Z0xvZygnIyB0b0V4cGxvcmVyVXJsIHJwY0VuZHBvaW50OicsIGVuZFBvaW50VXJsKTtcbiAgbGV0IGNsdXN0ZXIgPSAnJztcbiAgaWYgKGVuZFBvaW50VXJsID09PSBDb25zdGFudHMuRW5kUG9pbnRVcmwucHJkKSB7XG4gICAgY2x1c3RlciA9IENvbnN0YW50cy5DbHVzdGVyLnByZDtcbiAgfSBlbHNlIGlmIChlbmRQb2ludFVybCA9PT0gQ29uc3RhbnRzLkVuZFBvaW50VXJsLnRlc3QpIHtcbiAgICBjbHVzdGVyID0gQ29uc3RhbnRzLkNsdXN0ZXIudGVzdDtcbiAgfSBlbHNlIGlmIChlbmRQb2ludFVybCA9PT0gQ29uc3RhbnRzLkVuZFBvaW50VXJsLmRldikge1xuICAgIGNsdXN0ZXIgPSBDb25zdGFudHMuQ2x1c3Rlci5kZXY7XG4gIH0gZWxzZSB7XG4gICAgY2x1c3RlciA9IENvbnN0YW50cy5DbHVzdGVyLmRldjtcbiAgfVxuXG4gIGNvbnN0IGFkZHJlc3NPclNpZ25hdHVyZTogc3RyaW5nID0gdGhpcy50b1N0cmluZygpO1xuICBsZXQgdXJsID0gJyc7XG4gIGlmIChBY2NvdW50LktleXBhaXIuaXNQdWJrZXkoYWRkcmVzc09yU2lnbmF0dXJlKSkge1xuICAgIC8vIGFkZHJlc3NcbiAgICBpZiAoZXhwbG9yZXIgPT09IEV4cGxvcmVyLlNvbGFuYUZNKSB7XG4gICAgICB1cmwgPSBgaHR0cHM6Ly9zb2xhbmEuZm0vYWRkcmVzcy8ke2FkZHJlc3NPclNpZ25hdHVyZX0/Y2x1c3Rlcj0ke2NsdXN0ZXJ9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgdXJsID0gYGh0dHBzOi8vc29sc2Nhbi5pby9hY2NvdW50LyR7YWRkcmVzc09yU2lnbmF0dXJlfT9jbHVzdGVyPSR7Y2x1c3Rlcn1gO1xuICAgIH1cbiAgICAvLyBzaWduYXR1cmVcbiAgfSBlbHNlIHtcbiAgICAvLyBmb3IgSW52YWxpZCB0eXBlIFwibmV2ZXJcIiBvZiBhZGRyZXNzT3JTaWduYXR1cmUsIHNvIGBhcyBzdHJpbmdgXG4gICAgaWYgKGV4cGxvcmVyID09PSBFeHBsb3Jlci5Tb2xhbmFGTSkge1xuICAgICAgdXJsID0gYGh0dHBzOi8vc29sYW5hLmZtL3R4LyR7XG4gICAgICAgIGFkZHJlc3NPclNpZ25hdHVyZSBhcyBzdHJpbmdcbiAgICAgIH0/Y2x1c3Rlcj0ke2NsdXN0ZXJ9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgdXJsID0gYGh0dHBzOi8vc29sc2Nhbi5pby90eC8ke1xuICAgICAgICBhZGRyZXNzT3JTaWduYXR1cmUgYXMgc3RyaW5nXG4gICAgICB9P2NsdXN0ZXI9JHtjbHVzdGVyfWA7XG4gICAgfVxuICB9XG4gIHJldHVybiB1cmw7XG59O1xuXG4vKipcbiAqIFB1YktleShAc29sYW5hLXN1aXRlKSB0byBQdWJsaWNLZXkoQHNvbGFuYS93ZWIzLmpzKVxuICpcbiAqIEBzZWUge0BsaW5rIHR5cGVzL2dsb2JhbC50c31cbiAqIEByZXR1cm5zIFB1YmxpY0tleVxuICovXG5TdHJpbmcucHJvdG90eXBlLnRvUHVibGljS2V5ID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIUFjY291bnQuS2V5cGFpci5pc1B1YmtleSh0aGlzLnRvU3RyaW5nKCkpKSB7XG4gICAgdGhyb3cgRXJyb3IoYE5vIG1hdGNoIEtleVBhaXIuUHViS2V5OiAke3RoaXMudG9TdHJpbmcoKX1gKTtcbiAgfVxuICByZXR1cm4gbmV3IFB1YmxpY0tleSh0aGlzLnRvU3RyaW5nKCkpO1xufTtcblxuLyoqXG4gKiBTZWNyZXQoQHNvbGFuYS1zdWl0ZSkgdG8gS2V5cGFpcihAc29sYW5hL3dlYjMuanMpXG4gKlxuICogQHNlZSB7QGxpbmsgdHlwZXMvZ2xvYmFsLnRzfVxuICogQHJldHVybnMgS2V5cGFpclxuICovXG5TdHJpbmcucHJvdG90eXBlLnRvS2V5cGFpciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCFBY2NvdW50LktleXBhaXIuaXNTZWNyZXQodGhpcy50b1N0cmluZygpKSkge1xuICAgIHRocm93IEVycm9yKGBObyBtYXRjaCBLZXlQYWlyLlNlY3JldDogJHt0aGlzLnRvU3RyaW5nKCl9YCk7XG4gIH1cbiAgY29uc3QgZGVjb2RlZCA9IGJzLmRlY29kZSh0aGlzLnRvU3RyaW5nKCkpO1xuICByZXR1cm4gS2V5cGFpci5mcm9tU2VjcmV0S2V5KGRlY29kZWQpO1xufTtcblxuLyoqXG4gKiBMQU1QT1JUUyB0byBTT0xcbiAqXG4gKiBAc2VlIHtAbGluayB0eXBlcy9nbG9iYWwudHN9XG4gKiBAcmV0dXJucyBudW1iZXJcbiAqL1xuTnVtYmVyLnByb3RvdHlwZS50b1NvbCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIEJpZ051bWJlcih0aGlzIGFzIG51bWJlcilcbiAgICAuZGl2KExBTVBPUlRTX1BFUl9TT0wpXG4gICAgLnRvTnVtYmVyKCk7XG59O1xuXG4vKipcbiAqIFNPTCB0byBMQU1QT1JUU1xuICpcbiAqIEBzZWUge0BsaW5rIHR5cGVzL2dsb2JhbC50c31cbiAqIEByZXR1cm5zIG51bWJlclxuICovXG5OdW1iZXIucHJvdG90eXBlLnRvTGFtcG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBCaWdOdW1iZXIodGhpcyBhcyBudW1iZXIpXG4gICAgLnRpbWVzKExBTVBPUlRTX1BFUl9TT0wpXG4gICAgLnRvTnVtYmVyKCk7XG59O1xuIiwgImltcG9ydCB7IENvbnN0YW50cywgZGVidWdMb2csIFJlc3VsdCB9IGZyb20gJ34vc2hhcmVkJztcbmltcG9ydCB7IENvbW1pdG1lbnQsIENvbm5lY3Rpb24gfSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuXG5leHBvcnQgbmFtZXNwYWNlIE5vZGUge1xuICBjb25zdCBzZXR0ZWQgPSB7XG4gICAgY2x1c3RlclVybDogJycsXG4gICAgY29tbWl0bWVudDogQ29uc3RhbnRzLkNPTU1JVE1FTlQsXG4gICAgY3VzdG9tQ2x1c3RlclVybDogW10gYXMgc3RyaW5nW10sXG4gIH07XG5cbiAgZXhwb3J0IGNvbnN0IGdldENvbm5lY3Rpb24gPSAoKTogQ29ubmVjdGlvbiA9PiB7XG4gICAgaWYgKHNldHRlZC5jdXN0b21DbHVzdGVyVXJsLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIGN1c3RvbSBjbHVzdGVyXG4gICAgICBzZXR0ZWQuY2x1c3RlclVybCA9IENvbnN0YW50cy5zd2l0Y2hDbHVzdGVyKHtcbiAgICAgICAgY3VzdG9tQ2x1c3RlclVybDogc2V0dGVkLmN1c3RvbUNsdXN0ZXJVcmwsXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKENvbnN0YW50cy5jdXN0b21DbHVzdGVyVXJsLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIGN1c3RvbSBjbHVzdGVyIGJ5IGpzb24gY29uZmlnXG4gICAgICBzZXR0ZWQuY2x1c3RlclVybCA9IENvbnN0YW50cy5zd2l0Y2hDbHVzdGVyKHtcbiAgICAgICAgY3VzdG9tQ2x1c3RlclVybDogQ29uc3RhbnRzLmN1c3RvbUNsdXN0ZXJVcmwsXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKCFzZXR0ZWQuY2x1c3RlclVybCkge1xuICAgICAgLy8gZGVmYXVsdCBjbHVzdGVyXG4gICAgICBzZXR0ZWQuY2x1c3RlclVybCA9IENvbnN0YW50cy5zd2l0Y2hDbHVzdGVyKHtcbiAgICAgICAgY2x1c3RlcjogQ29uc3RhbnRzLmN1cnJlbnRDbHVzdGVyLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFzZXR0ZWQuY29tbWl0bWVudCkge1xuICAgICAgc2V0dGVkLmNvbW1pdG1lbnQgPSBDb25zdGFudHMuQ09NTUlUTUVOVDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IENvbm5lY3Rpb24oc2V0dGVkLmNsdXN0ZXJVcmwsIHNldHRlZC5jb21taXRtZW50KTtcbiAgfTtcblxuICBleHBvcnQgY29uc3QgY2hhbmdlQ29ubmVjdGlvbiA9IChwYXJhbToge1xuICAgIGNsdXN0ZXI/OiBzdHJpbmc7XG4gICAgY29tbWl0bWVudD86IENvbW1pdG1lbnQ7XG4gICAgY3VzdG9tQ2x1c3RlclVybD86IHN0cmluZ1tdO1xuICB9KTogdm9pZCA9PiB7XG4gICAgLy8gaW5pdGlhbGl6ZVxuICAgIHNldHRlZC5jbHVzdGVyVXJsID0gJyc7XG4gICAgc2V0dGVkLmN1c3RvbUNsdXN0ZXJVcmwgPSBbXTtcbiAgICBzZXR0ZWQuY29tbWl0bWVudCA9IENvbnN0YW50cy5DT01NSVRNRU5UO1xuXG4gICAgY29uc3QgeyBjbHVzdGVyLCBjb21taXRtZW50LCBjdXN0b21DbHVzdGVyVXJsIH0gPSBwYXJhbTtcbiAgICBpZiAoY29tbWl0bWVudCkge1xuICAgICAgc2V0dGVkLmNvbW1pdG1lbnQgPSBjb21taXRtZW50O1xuICAgICAgZGVidWdMb2coJyMgTm9kZSBjaGFuZ2UgY29tbWl0bWVudDogJywgc2V0dGVkLmNvbW1pdG1lbnQpO1xuICAgIH1cblxuICAgIGlmIChjbHVzdGVyKSB7XG4gICAgICBzZXR0ZWQuY2x1c3RlclVybCA9IENvbnN0YW50cy5zd2l0Y2hDbHVzdGVyKHsgY2x1c3RlcjogY2x1c3RlciB9KTtcbiAgICAgIGRlYnVnTG9nKCcjIE5vZGUgY2hhbmdlIGNsdXN0ZXJVcmw6ICcsIHNldHRlZC5jbHVzdGVyVXJsKTtcbiAgICB9XG5cbiAgICBpZiAoY3VzdG9tQ2x1c3RlclVybCkge1xuICAgICAgZGVidWdMb2coJyMgY3VzdG9tQ2x1c3RlclVybDogJywgY3VzdG9tQ2x1c3RlclVybCk7XG4gICAgICBzZXR0ZWQuY2x1c3RlclVybCA9IENvbnN0YW50cy5zd2l0Y2hDbHVzdGVyKHsgY3VzdG9tQ2x1c3RlclVybCB9KTtcbiAgICAgIHNldHRlZC5jdXN0b21DbHVzdGVyVXJsID0gY3VzdG9tQ2x1c3RlclVybDtcbiAgICAgIGRlYnVnTG9nKFxuICAgICAgICAnIyBOb2RlIGNoYW5nZSBjbHVzdGVyLCBjdXN0b20gY2x1c3RlciB1cmw6ICcsXG4gICAgICAgIHNldHRlZC5jbHVzdGVyVXJsLFxuICAgICAgKTtcbiAgICB9XG4gIH07XG5cbiAgZXhwb3J0IGNvbnN0IGNvbmZpcm1lZFNpZyA9IGFzeW5jIChcbiAgICBzaWduYXR1cmU6IHN0cmluZyxcbiAgICBjb21taXRtZW50OiBDb21taXRtZW50ID0gQ29uc3RhbnRzLkNPTU1JVE1FTlQsXG4gICkgPT4ge1xuICAgIGNvbnN0IGNvbm5lY3Rpb24gPSBOb2RlLmdldENvbm5lY3Rpb24oKTtcbiAgICBjb25zdCBsYXRlc3RCbG9ja2hhc2ggPSBhd2FpdCBjb25uZWN0aW9uLmdldExhdGVzdEJsb2NraGFzaCgpO1xuICAgIHJldHVybiBhd2FpdCBjb25uZWN0aW9uXG4gICAgICAuY29uZmlybVRyYW5zYWN0aW9uKFxuICAgICAgICB7XG4gICAgICAgICAgYmxvY2toYXNoOiBsYXRlc3RCbG9ja2hhc2guYmxvY2toYXNoLFxuICAgICAgICAgIGxhc3RWYWxpZEJsb2NrSGVpZ2h0OiBsYXRlc3RCbG9ja2hhc2gubGFzdFZhbGlkQmxvY2tIZWlnaHQsXG4gICAgICAgICAgc2lnbmF0dXJlLFxuICAgICAgICB9LFxuICAgICAgICBjb21taXRtZW50LFxuICAgICAgKVxuICAgICAgLnRoZW4oUmVzdWx0Lm9rKVxuICAgICAgLmNhdGNoKFJlc3VsdC5lcnIpO1xuICB9O1xufVxuIiwgIi8vQGludGVybmFsc1xuZXhwb3J0IGNvbnN0IE1BWF9SRVRSSUVTID0gMztcbiIsICJpbXBvcnQge1xuICBDb25maXJtT3B0aW9ucyxcbiAgS2V5cGFpcixcbiAgc2VuZEFuZENvbmZpcm1UcmFuc2FjdGlvbixcbiAgVHJhbnNhY3Rpb24gYXMgVHgsXG4gIFRyYW5zYWN0aW9uSW5zdHJ1Y3Rpb24sXG4gIFRyYW5zYWN0aW9uU2lnbmF0dXJlLFxufSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnfi9ub2RlJztcbmltcG9ydCB7IFJlc3VsdCwgVHJ5IH0gZnJvbSAnfi9zaGFyZWQnO1xuaW1wb3J0IHsgTUFYX1JFVFJJRVMgfSBmcm9tICcuL2RlZmluZSc7XG5pbXBvcnQgeyBCYXRjaFRyYW5zYWN0aW9uIH0gZnJvbSAnLi9iYXRjaCc7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2FjdGlvbiB7XG4gIGluc3RydWN0aW9uczogVHJhbnNhY3Rpb25JbnN0cnVjdGlvbltdO1xuICBzaWduZXJzOiBLZXlwYWlyW107XG4gIGZlZVBheWVyPzogS2V5cGFpcjtcbiAgZGF0YT86IHVua25vd247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgaW5zdHJ1Y3Rpb25zOiBUcmFuc2FjdGlvbkluc3RydWN0aW9uW10sXG4gICAgc2lnbmVyczogS2V5cGFpcltdLFxuICAgIGZlZVBheWVyPzogS2V5cGFpcixcbiAgICBkYXRhPzogdW5rbm93bixcbiAgKSB7XG4gICAgdGhpcy5pbnN0cnVjdGlvbnMgPSBpbnN0cnVjdGlvbnM7XG4gICAgdGhpcy5zaWduZXJzID0gc2lnbmVycztcbiAgICB0aGlzLmZlZVBheWVyID0gZmVlUGF5ZXI7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgfVxuXG4gIHN1Ym1pdCA9IGFzeW5jICgpOiBQcm9taXNlPFJlc3VsdDxUcmFuc2FjdGlvblNpZ25hdHVyZSwgRXJyb3I+PiA9PiB7XG4gICAgcmV0dXJuIFRyeShhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgVHJhbnNhY3Rpb24pKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdvbmx5IEluc3RydWN0aW9uIG9iamVjdCB0aGF0IGNhbiB1c2UgdGhpcycpO1xuICAgICAgfVxuICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSBuZXcgVHgoKTtcblxuICAgICAgY29uc3QgYmxvY2toYXNoT2JqID0gYXdhaXQgTm9kZS5nZXRDb25uZWN0aW9uKCkuZ2V0TGF0ZXN0QmxvY2toYXNoKCk7XG4gICAgICB0cmFuc2FjdGlvbi5sYXN0VmFsaWRCbG9ja0hlaWdodCA9IGJsb2NraGFzaE9iai5sYXN0VmFsaWRCbG9ja0hlaWdodDtcbiAgICAgIHRyYW5zYWN0aW9uLnJlY2VudEJsb2NraGFzaCA9IGJsb2NraGFzaE9iai5ibG9ja2hhc2g7XG4gICAgICBsZXQgZmluYWxTaWduZXJzID0gdGhpcy5zaWduZXJzO1xuXG4gICAgICBpZiAodGhpcy5mZWVQYXllcikge1xuICAgICAgICB0cmFuc2FjdGlvbi5mZWVQYXllciA9IHRoaXMuZmVlUGF5ZXIucHVibGljS2V5O1xuICAgICAgICBmaW5hbFNpZ25lcnMgPSBbdGhpcy5mZWVQYXllciwgLi4udGhpcy5zaWduZXJzXTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pbnN0cnVjdGlvbnMuZm9yRWFjaCgoaW5zdCkgPT4gdHJhbnNhY3Rpb24uYWRkKGluc3QpKTtcblxuICAgICAgY29uc3Qgb3B0aW9uczogQ29uZmlybU9wdGlvbnMgPSB7XG4gICAgICAgIG1heFJldHJpZXM6IE1BWF9SRVRSSUVTLFxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIGF3YWl0IHNlbmRBbmRDb25maXJtVHJhbnNhY3Rpb24oXG4gICAgICAgIE5vZGUuZ2V0Q29ubmVjdGlvbigpLFxuICAgICAgICB0cmFuc2FjdGlvbixcbiAgICAgICAgZmluYWxTaWduZXJzLFxuICAgICAgICBvcHRpb25zLFxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcbn1cblxuLyoqXG4gKiBzZW5UcmFuc2FjdGlvbigpIFRyYW5zYWN0aW9uSW5zdHJ1Y3Rpb25cbiAqXG4gKiBAc2VlIHtAbGluayB0eXBlcy9nbG9iYWwudHN9XG4gKiBAcmV0dXJucyBQcm9taXNlPFJlc3VsdDxzdHJpbmcsIEVycm9yPj5cbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnQgKi9cbi8qIEB0cy1pZ25vcmUgKi9cbkFycmF5LnByb3RvdHlwZS5zdWJtaXQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGluc3RydWN0aW9uczogVHJhbnNhY3Rpb25bXSA9IFtdO1xuICAvLyBkb250IHVzZSBmb3JFYWNoXG4gIC8vIEl0IGlzIG5vdCBwb3NzaWJsZSB0byBzdG9wIHRoZSBwcm9jZXNzIGJ5IFJFVFVSTiBpbiB0aGUgbWlkZGxlIG9mIHRoZSBwcm9jZXNzLlxuICByZXR1cm4gVHJ5KGFzeW5jICgpID0+IHtcbiAgICBsZXQgaSA9IDA7XG4gICAgZm9yIChjb25zdCBvYmogb2YgdGhpcykge1xuICAgICAgaWYgKG9iai5pc0Vycikge1xuICAgICAgICBjb25zdCBlcnJvck1lc3M6IHN0cmluZyA9IG9iai5lcnJvci5tZXNzYWdlIGFzIHN0cmluZztcbiAgICAgICAgdGhyb3cgRXJyb3IoYFtBcnJheSBpbmRleCBvZiBjYXVnaHQgJ1Jlc3VsdC5lcnInOiAke2l9XSR7ZXJyb3JNZXNzfWApO1xuICAgICAgfSBlbHNlIGlmIChvYmouaXNPaykge1xuICAgICAgICBpbnN0cnVjdGlvbnMucHVzaChvYmoudmFsdWUgYXMgVHJhbnNhY3Rpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2gob2JqIGFzIFRyYW5zYWN0aW9uKTtcbiAgICAgIH1cbiAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIEJhdGNoVHJhbnNhY3Rpb24uc3VibWl0KGluc3RydWN0aW9ucyk7XG4gIH0pO1xufTtcbiIsICJpbXBvcnQge1xuICBDb25maXJtT3B0aW9ucyxcbiAgS2V5cGFpcixcbiAgc2VuZEFuZENvbmZpcm1UcmFuc2FjdGlvbixcbiAgVHJhbnNhY3Rpb24gYXMgVHgsXG4gIFRyYW5zYWN0aW9uSW5zdHJ1Y3Rpb24sXG4gIFRyYW5zYWN0aW9uU2lnbmF0dXJlLFxufSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuXG5pbXBvcnQgeyBDb25zdGFudHMsIGRlYnVnTG9nLCBSZXN1bHQsIFRyeSB9IGZyb20gJ34vc2hhcmVkJztcbmltcG9ydCB7IE5vZGUgfSBmcm9tICd+L25vZGUnO1xuaW1wb3J0IHsgTUFYX1JFVFJJRVMgfSBmcm9tICcuL2RlZmluZSc7XG5cbmV4cG9ydCBjbGFzcyBNaW50VHJhbnNhY3Rpb248VD4ge1xuICBpbnN0cnVjdGlvbnM6IFRyYW5zYWN0aW9uSW5zdHJ1Y3Rpb25bXTtcbiAgc2lnbmVyczogS2V5cGFpcltdO1xuICBmZWVQYXllcj86IEtleXBhaXI7XG4gIGRhdGE/OiBUO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGluc3RydWN0aW9uczogVHJhbnNhY3Rpb25JbnN0cnVjdGlvbltdLFxuICAgIHNpZ25lcnM6IEtleXBhaXJbXSxcbiAgICBmZWVQYXllcj86IEtleXBhaXIsXG4gICAgZGF0YT86IFQsXG4gICkge1xuICAgIHRoaXMuaW5zdHJ1Y3Rpb25zID0gaW5zdHJ1Y3Rpb25zO1xuICAgIHRoaXMuc2lnbmVycyA9IHNpZ25lcnM7XG4gICAgdGhpcy5mZWVQYXllciA9IGZlZVBheWVyO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gIH1cblxuICBzdWJtaXQgPSBhc3luYyAoKTogUHJvbWlzZTxSZXN1bHQ8VHJhbnNhY3Rpb25TaWduYXR1cmUsIEVycm9yPj4gPT4ge1xuICAgIHJldHVybiBUcnkoYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIE1pbnRUcmFuc2FjdGlvbikpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ29ubHkgTWludEluc3RydWN0aW9uIG9iamVjdCB0aGF0IGNhbiB1c2UgdGhpcycpO1xuICAgICAgfVxuICAgICAgY29uc3QgdHJhbnNhY3Rpb24gPSBuZXcgVHgoKTtcbiAgICAgIGNvbnN0IGJsb2NraGFzaE9iaiA9IGF3YWl0IE5vZGUuZ2V0Q29ubmVjdGlvbigpLmdldExhdGVzdEJsb2NraGFzaCgpO1xuICAgICAgdHJhbnNhY3Rpb24ubGFzdFZhbGlkQmxvY2tIZWlnaHQgPSBibG9ja2hhc2hPYmoubGFzdFZhbGlkQmxvY2tIZWlnaHQ7XG4gICAgICB0cmFuc2FjdGlvbi5yZWNlbnRCbG9ja2hhc2ggPSBibG9ja2hhc2hPYmouYmxvY2toYXNoO1xuICAgICAgbGV0IGZpbmFsU2lnbmVycyA9IHRoaXMuc2lnbmVycztcblxuICAgICAgaWYgKHRoaXMuZmVlUGF5ZXIpIHtcbiAgICAgICAgdHJhbnNhY3Rpb24uZmVlUGF5ZXIgPSB0aGlzLmZlZVBheWVyLnB1YmxpY0tleTtcbiAgICAgICAgZmluYWxTaWduZXJzID0gW3RoaXMuZmVlUGF5ZXIsIC4uLnRoaXMuc2lnbmVyc107XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zLmZvckVhY2goKGluc3QpID0+IHRyYW5zYWN0aW9uLmFkZChpbnN0KSk7XG5cbiAgICAgIGNvbnN0IG9wdGlvbnM6IENvbmZpcm1PcHRpb25zID0ge1xuICAgICAgICBtYXhSZXRyaWVzOiBNQVhfUkVUUklFUyxcbiAgICAgIH07XG5cbiAgICAgIGlmIChOb2RlLmdldENvbm5lY3Rpb24oKS5ycGNFbmRwb2ludCA9PT0gQ29uc3RhbnRzLkVuZFBvaW50VXJsLnByZCkge1xuICAgICAgICBkZWJ1Z0xvZygnIyBDaGFuZ2UgbWV0YXBsZXggY2x1c3RlciBvbiBtYWlubmV0LWJldGEnKTtcbiAgICAgICAgTm9kZS5jaGFuZ2VDb25uZWN0aW9uKHsgY2x1c3RlcjogQ29uc3RhbnRzLkNsdXN0ZXIucHJkTWV0YXBsZXggfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhd2FpdCBzZW5kQW5kQ29uZmlybVRyYW5zYWN0aW9uKFxuICAgICAgICBOb2RlLmdldENvbm5lY3Rpb24oKSxcbiAgICAgICAgdHJhbnNhY3Rpb24sXG4gICAgICAgIGZpbmFsU2lnbmVycyxcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG59XG4iLCAiaW1wb3J0IHtcbiAgQ29uZmlybU9wdGlvbnMsXG4gIFRyYW5zYWN0aW9uIGFzIFR4LFxuICBUcmFuc2FjdGlvblNpZ25hdHVyZSxcbn0gZnJvbSAnQHNvbGFuYS93ZWIzLmpzJztcblxuaW1wb3J0IHsgUmVzdWx0LCBUcnkgfSBmcm9tICd+L3NoYXJlZCc7XG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnfi9ub2RlJztcbmltcG9ydCB7IFB1YmtleSwgU2VjcmV0IH0gZnJvbSAnfi90eXBlcy9hY2NvdW50JztcbmltcG9ydCB7IE1BWF9SRVRSSUVTIH0gZnJvbSAnLi9kZWZpbmUnO1xuXG5leHBvcnQgY2xhc3MgUGFydGlhbFNpZ25UcmFuc2FjdGlvbiB7XG4gIGhleEluc3RydWN0aW9uOiBzdHJpbmc7XG4gIGRhdGE/OiBQdWJrZXk7XG5cbiAgY29uc3RydWN0b3IoaW5zdHJ1Y3Rpb25zOiBzdHJpbmcsIG1pbnQ/OiBQdWJrZXkpIHtcbiAgICB0aGlzLmhleEluc3RydWN0aW9uID0gaW5zdHJ1Y3Rpb25zO1xuICAgIHRoaXMuZGF0YSA9IG1pbnQ7XG4gIH1cblxuICBzdWJtaXQgPSBhc3luYyAoXG4gICAgZmVlUGF5ZXI6IFNlY3JldCxcbiAgKTogUHJvbWlzZTxSZXN1bHQ8VHJhbnNhY3Rpb25TaWduYXR1cmUsIEVycm9yPj4gPT4ge1xuICAgIHJldHVybiBUcnkoYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFBhcnRpYWxTaWduVHJhbnNhY3Rpb24pKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdvbmx5IFBhcnRpYWxTaWduSW5zdHJ1Y3Rpb24gb2JqZWN0IHRoYXQgY2FuIHVzZSB0aGlzJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRlY29kZSA9IEJ1ZmZlci5mcm9tKHRoaXMuaGV4SW5zdHJ1Y3Rpb24sICdoZXgnKTtcbiAgICAgIGNvbnN0IHRyYW5zYWN0aW9uRnJvbUpzb24gPSBUeC5mcm9tKGRlY29kZSk7XG4gICAgICB0cmFuc2FjdGlvbkZyb21Kc29uLnBhcnRpYWxTaWduKGZlZVBheWVyLnRvS2V5cGFpcigpKTtcblxuICAgICAgY29uc3Qgb3B0aW9uczogQ29uZmlybU9wdGlvbnMgPSB7XG4gICAgICAgIG1heFJldHJpZXM6IE1BWF9SRVRSSUVTLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IHdpcmVUcmFuc2FjdGlvbiA9IHRyYW5zYWN0aW9uRnJvbUpzb24uc2VyaWFsaXplKCk7XG4gICAgICByZXR1cm4gYXdhaXQgTm9kZS5nZXRDb25uZWN0aW9uKCkuc2VuZFJhd1RyYW5zYWN0aW9uKFxuICAgICAgICB3aXJlVHJhbnNhY3Rpb24sXG4gICAgICAgIG9wdGlvbnMsXG4gICAgICApO1xuICAgIH0pO1xuICB9O1xufVxuIiwgImltcG9ydCB7IFBhcnNlZFRyYW5zYWN0aW9uV2l0aE1ldGEgfSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuaW1wb3J0IHsgTm9kZSB9IGZyb20gJ34vbm9kZSc7XG5pbXBvcnQgeyBkZWJ1Z0xvZywgUmVzdWx0LCBzbGVlcCB9IGZyb20gJ34vc2hhcmVkJztcbmltcG9ydCB7IFB1YmtleSB9IGZyb20gJ34vdHlwZXMvYWNjb3VudCc7XG5pbXBvcnQgeyBIaXN0b3J5IH0gZnJvbSAnfi90eXBlcy9oaXN0b3J5JztcblxuZXhwb3J0IG5hbWVzcGFjZSBTaWduYXR1cmVzIHtcbiAgY29uc3QgcGFyc2VGb3JUcmFuc2FjdGlvbiA9IGFzeW5jIChcbiAgICBzaWduYXR1cmU6IHN0cmluZyxcbiAgKTogUHJvbWlzZTxQYXJzZWRUcmFuc2FjdGlvbldpdGhNZXRhPiA9PiB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgTm9kZS5nZXRDb25uZWN0aW9uKCkuZ2V0UGFyc2VkVHJhbnNhY3Rpb24oc2lnbmF0dXJlKTtcbiAgICBpZiAoIXJlcykge1xuICAgICAgcmV0dXJuIHt9IGFzIFBhcnNlZFRyYW5zYWN0aW9uV2l0aE1ldGE7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH07XG5cbiAgZXhwb3J0IGNvbnN0IGdldEZvckFkcmVzcyA9IGFzeW5jIChcbiAgICBwdWJrZXk6IFB1YmtleSxcbiAgICBwYXJzZXI6ICh0cmFuc2FjdGlvbjogUGFyc2VkVHJhbnNhY3Rpb25XaXRoTWV0YSkgPT4gSGlzdG9yeSB8IHVuZGVmaW5lZCxcbiAgICBjYWxsYmFjazogKGhpc3Rvcnk6IFJlc3VsdDxIaXN0b3J5W10sIEVycm9yPikgPT4gdm9pZCxcbiAgICBvcHRpb25zOiB7XG4gICAgICB3YWl0VGltZTogbnVtYmVyO1xuICAgICAgbmFycm93RG93bjogbnVtYmVyO1xuICAgIH0sXG4gICAgaGlzdG9yaWVzOiBIaXN0b3J5W10gPSBbXSxcbiAgKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGRlYnVnTG9nKCcjIG9wdGlvbnM6ICcsIG9wdGlvbnMpO1xuICAgICAgY29uc3QgdHJhbnNhY3Rpb25zID0gYXdhaXQgTm9kZS5nZXRDb25uZWN0aW9uKCkuZ2V0U2lnbmF0dXJlc0ZvckFkZHJlc3MoXG4gICAgICAgIHB1YmtleS50b1B1YmxpY0tleSgpLFxuICAgICAgICB7XG4gICAgICAgICAgbGltaXQ6IG9wdGlvbnMubmFycm93RG93bixcbiAgICAgICAgfSxcbiAgICAgICk7XG5cbiAgICAgIGRlYnVnTG9nKCcjIHRyYW5zYWN0aW9ucyBjb3VudDonLCB0cmFuc2FjdGlvbnMubGVuZ3RoKTtcblxuICAgICAgZm9yIChjb25zdCB0cmFuc2FjdGlvbiBvZiB0cmFuc2FjdGlvbnMpIHtcbiAgICAgICAgcGFyc2VGb3JUcmFuc2FjdGlvbih0cmFuc2FjdGlvbi5zaWduYXR1cmUpXG4gICAgICAgICAgLnRoZW4oKHNpZ25hdHVyZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGlzdG9yeSA9IHBhcnNlcihzaWduYXR1cmUpO1xuICAgICAgICAgICAgaWYgKGhpc3RvcnkpIHtcbiAgICAgICAgICAgICAgaGlzdG9yaWVzLnB1c2goaGlzdG9yeSk7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKFJlc3VsdC5vayhoaXN0b3JpZXMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaCgoZSkgPT4gY2FsbGJhY2soUmVzdWx0LmVycihlKSkpO1xuICAgICAgICBhd2FpdCBzbGVlcChvcHRpb25zLndhaXRUaW1lKTsgLy8gYXZvaWQgNDI5IGVycm9yXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICBjYWxsYmFjayhSZXN1bHQuZXJyKGUpKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iLCAiaW1wb3J0IHsgQ29udmVydGVyIH0gZnJvbSAnfi9jb252ZXJ0ZXInO1xuaW1wb3J0IHsgUGFyc2VkSW5zdHJ1Y3Rpb24sIFBhcnNlZFRyYW5zYWN0aW9uV2l0aE1ldGEgfSBmcm9tICdAc29sYW5hL3dlYjMuanMnO1xuaW1wb3J0IHtcbiAgRmlsdGVyT3B0aW9ucyxcbiAgRmlsdGVyVHlwZSxcbiAgTW9kdWxlTmFtZSxcbiAgUG9zdFRva2VuQWNjb3VudCxcbn0gZnJvbSAnfi90eXBlcy90cmFuc2FjdGlvbi1maWx0ZXInO1xuaW1wb3J0IHsgSGlzdG9yeSB9IGZyb20gJ34vdHlwZXMvaGlzdG9yeSc7XG5pbXBvcnQgeyBkZWJ1Z0xvZyB9IGZyb20gJ34vc2hhcmVkJztcblxuZXhwb3J0IG5hbWVzcGFjZSBUcmFuc2FjdGlvbkZpbHRlciB7XG4gIGNvbnN0IGNyZWF0ZVBvc3RUb2tlbkFjY291bnRMaXN0ID0gKFxuICAgIHRyYW5zYWN0aW9uOiBQYXJzZWRUcmFuc2FjdGlvbldpdGhNZXRhLFxuICApOiBQb3N0VG9rZW5BY2NvdW50W10gPT4ge1xuICAgIGNvbnN0IHBvc3RUb2tlbkFjY291bnQ6IFBvc3RUb2tlbkFjY291bnRbXSA9IFtdO1xuXG4gICAgaWYgKE9iamVjdC5rZXlzKHRyYW5zYWN0aW9uKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBwb3N0VG9rZW5BY2NvdW50O1xuICAgIH1cbiAgICBjb25zdCBhY2NvdW50S2V5cyA9IHRyYW5zYWN0aW9uLnRyYW5zYWN0aW9uLm1lc3NhZ2UuYWNjb3VudEtleXMubWFwKCh0KSA9PlxuICAgICAgdC5wdWJrZXkudG9TdHJpbmcoKSxcbiAgICApO1xuXG4gICAgdHJhbnNhY3Rpb24ubWV0YT8ucG9zdFRva2VuQmFsYW5jZXM/LmZvckVhY2goKHQpID0+IHtcbiAgICAgIGlmIChhY2NvdW50S2V5c1t0LmFjY291bnRJbmRleF0gJiYgdC5vd25lcikge1xuICAgICAgICBjb25zdCB2ID0ge1xuICAgICAgICAgIGFjY291bnQ6IGFjY291bnRLZXlzW3QuYWNjb3VudEluZGV4XSxcbiAgICAgICAgICBvd25lcjogdC5vd25lcixcbiAgICAgICAgfTtcbiAgICAgICAgcG9zdFRva2VuQWNjb3VudC5wdXNoKHYpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBwb3N0VG9rZW5BY2NvdW50O1xuICB9O1xuXG4gIGV4cG9ydCBjb25zdCBpc1BhcnNlZEluc3RydWN0aW9uID0gKFxuICAgIGFyZzogdW5rbm93bixcbiAgKTogYXJnIGlzIFBhcnNlZEluc3RydWN0aW9uID0+IHtcbiAgICByZXR1cm4gYXJnICE9PSBudWxsICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmICdwYXJzZWQnIGluIGFyZztcbiAgfTtcblxuICBleHBvcnQgY29uc3QgcGFyc2UgPVxuICAgIChmaWx0ZXJUeXBlOiBGaWx0ZXJUeXBlLCBtb2R1bGVOYW1lOiBNb2R1bGVOYW1lKSA9PlxuICAgICh0eE1ldGE6IFBhcnNlZFRyYW5zYWN0aW9uV2l0aE1ldGEpOiBIaXN0b3J5IHwgdW5kZWZpbmVkID0+IHtcbiAgICAgIGxldCBoaXN0b3J5OiBIaXN0b3J5IHwgdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoXG4gICAgICAgIGZpbHRlclR5cGUgPT09IEZpbHRlclR5cGUuTWludCAmJlxuICAgICAgICBtb2R1bGVOYW1lID09PSBNb2R1bGVOYW1lLlNvbE5hdGl2ZVxuICAgICAgKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgIFwiVGhpcyBmaWx0ZXJUeXBlKCdGaWx0ZXJUeXBlLk1pbnQnKSBjYW4gbm90IHVzZSBmcm9tIFNvbE5hdGl2ZSBtb2R1bGVcIixcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0eE1ldGEgfHwgIXR4TWV0YS50cmFuc2FjdGlvbikge1xuICAgICAgICByZXR1cm4gaGlzdG9yeTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcG9zdFRva2VuQWNjb3VudCA9IGNyZWF0ZVBvc3RUb2tlbkFjY291bnRMaXN0KHR4TWV0YSk7XG4gICAgICB0eE1ldGEudHJhbnNhY3Rpb24ubWVzc2FnZS5pbnN0cnVjdGlvbnMuZm9yRWFjaCgoaW5zdHJ1Y3Rpb24pID0+IHtcbiAgICAgICAgaWYgKGlzUGFyc2VkSW5zdHJ1Y3Rpb24oaW5zdHJ1Y3Rpb24pKSB7XG4gICAgICAgICAgc3dpdGNoIChmaWx0ZXJUeXBlKSB7XG4gICAgICAgICAgICBjYXNlIEZpbHRlclR5cGUuTWVtbzoge1xuICAgICAgICAgICAgICBpZiAoRmlsdGVyT3B0aW9ucy5NZW1vLnByb2dyYW0uaW5jbHVkZXMoaW5zdHJ1Y3Rpb24ucHJvZ3JhbSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgaW5zdHJ1Y3Rpb25UcmFuc2ZlcjtcblxuICAgICAgICAgICAgICAgIC8vIGZldGNoICB0cmFuc2ZlciB0cmFuc2FjdGlvbiBmb3IgcmVsYXRpb25hbCBtZW1vXG4gICAgICAgICAgICAgICAgdHhNZXRhLnRyYW5zYWN0aW9uLm1lc3NhZ2UuaW5zdHJ1Y3Rpb25zLmZvckVhY2goXG4gICAgICAgICAgICAgICAgICAoaW5zdHJ1Y3Rpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgIGlzUGFyc2VkSW5zdHJ1Y3Rpb24oaW5zdHJ1Y3Rpb24pICYmXG4gICAgICAgICAgICAgICAgICAgICAgRmlsdGVyT3B0aW9ucy5UcmFuc2Zlci5wcm9ncmFtLmluY2x1ZGVzKFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb24ucHJvZ3JhbSxcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgIGluc3RydWN0aW9uVHJhbnNmZXIgPSBpbnN0cnVjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgLy8gc3BsLXRva2VuIG9yIHN5c3RlbVxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgIGluc3RydWN0aW9uVHJhbnNmZXIgJiZcbiAgICAgICAgICAgICAgICAgIG1vZHVsZU5hbWUgIT09IGluc3RydWN0aW9uVHJhbnNmZXJbJ3Byb2dyYW0nXVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgZGVidWdMb2coXG4gICAgICAgICAgICAgICAgICAgICcjIEZpbHRlclR5cGUuTWVtbyBicmVhayBpbnN0cnVjdGlvbjogJyxcbiAgICAgICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb25UcmFuc2ZlcixcbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBmZXRjaCBtZW1vIG9ubHkgdHJhbnNhY3Rpb25cbiAgICAgICAgICAgICAgICBoaXN0b3J5ID0gQ29udmVydGVyLk1lbW8uaW50b1VzZXJTaWRlKFxuICAgICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb24sXG4gICAgICAgICAgICAgICAgICB0eE1ldGEsXG4gICAgICAgICAgICAgICAgICBpbnN0cnVjdGlvblRyYW5zZmVyLFxuICAgICAgICAgICAgICAgICAgcG9zdFRva2VuQWNjb3VudCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBGaWx0ZXJUeXBlLk9ubHlNZW1vOiB7XG4gICAgICAgICAgICAgIGlmIChGaWx0ZXJPcHRpb25zLk1lbW8ucHJvZ3JhbS5pbmNsdWRlcyhpbnN0cnVjdGlvbi5wcm9ncmFtKSkge1xuICAgICAgICAgICAgICAgIGxldCBpbnN0cnVjdGlvblRyYW5zZmVyO1xuXG4gICAgICAgICAgICAgICAgaGlzdG9yeSA9IENvbnZlcnRlci5NZW1vLmludG9Vc2VyU2lkZShcbiAgICAgICAgICAgICAgICAgIGluc3RydWN0aW9uLFxuICAgICAgICAgICAgICAgICAgdHhNZXRhLFxuICAgICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb25UcmFuc2ZlcixcbiAgICAgICAgICAgICAgICAgIHBvc3RUb2tlbkFjY291bnQsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgRmlsdGVyVHlwZS5NaW50OiB7XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBGaWx0ZXJPcHRpb25zLk1pbnQucHJvZ3JhbS5pbmNsdWRlcyhpbnN0cnVjdGlvbi5wcm9ncmFtKSAmJlxuICAgICAgICAgICAgICAgIEZpbHRlck9wdGlvbnMuTWludC5hY3Rpb24uaW5jbHVkZXMoXG4gICAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbi5wYXJzZWQudHlwZSBhcyBzdHJpbmcsXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBoaXN0b3J5ID0gQ29udmVydGVyLk1pbnQuaW50b1VzZXJTaWRlKGluc3RydWN0aW9uLCB0eE1ldGEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBGaWx0ZXJUeXBlLlRyYW5zZmVyOlxuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgbW9kdWxlTmFtZSA9PT0gaW5zdHJ1Y3Rpb24ucHJvZ3JhbSAmJlxuICAgICAgICAgICAgICAgIEZpbHRlck9wdGlvbnMuVHJhbnNmZXIuYWN0aW9uLmluY2x1ZGVzKFxuICAgICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb24ucGFyc2VkLnR5cGUgYXMgc3RyaW5nLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluc3RydWN0aW9uLnBhcnNlZC50eXBlID09PSAndHJhbnNmZXJDaGVja2VkJykge1xuICAgICAgICAgICAgICAgICAgaGlzdG9yeSA9IENvbnZlcnRlci5UcmFuc2ZlckNoZWNrZWQuaW50b1VzZXJTaWRlKFxuICAgICAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgdHhNZXRhLFxuICAgICAgICAgICAgICAgICAgICBwb3N0VG9rZW5BY2NvdW50LFxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgaGlzdG9yeSA9IENvbnZlcnRlci5UcmFuc2Zlci5pbnRvVXNlclNpZGUoXG4gICAgICAgICAgICAgICAgICAgIGluc3RydWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICB0eE1ldGEsXG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gaGlzdG9yeTtcbiAgICB9O1xufVxuIiwgImltcG9ydCB7IFB1YmtleSB9IGZyb20gJ34vdHlwZXMvYWNjb3VudCc7XG5pbXBvcnQgeyBIaXN0b3J5LCBIaXN0b3J5T3B0aW9ucyB9IGZyb20gJ34vdHlwZXMvaGlzdG9yeSc7XG5pbXBvcnQgeyBPbkVyciwgT25PayB9IGZyb20gJ34vdHlwZXMvc2hhcmVkJztcbmltcG9ydCB7IEZpbHRlclR5cGUsIE1vZHVsZU5hbWUgfSBmcm9tICd+L3R5cGVzL3RyYW5zYWN0aW9uLWZpbHRlcic7XG5pbXBvcnQgeyBTaWduYXR1cmVzLCBUcmFuc2FjdGlvbkZpbHRlciB9IGZyb20gJ34vdHJhbnNhY3Rpb24tZmlsdGVyJztcblxuZXhwb3J0IG5hbWVzcGFjZSBNZW1vIHtcbiAgZXhwb3J0IGNvbnN0IGZpbmRCeU93bmVyID0gYXN5bmMgKFxuICAgIHRhcmdldDogUHVia2V5LFxuICAgIG9uT2s6IE9uT2s8SGlzdG9yeT4sXG4gICAgb25FcnI6IE9uRXJyLFxuICAgIG9wdGlvbnM6IFBhcnRpYWw8SGlzdG9yeU9wdGlvbnM+ID0ge30sXG4gICk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkZWZhdWx0VmFsdWVzOiBIaXN0b3J5T3B0aW9ucyA9IHtcbiAgICAgICAgd2FpdFRpbWU6IDAuMDMsXG4gICAgICAgIG5hcnJvd0Rvd246IDEwMCxcbiAgICAgIH07XG4gICAgICBjb25zdCBtZXJnZWRPcHRpb25zID0geyAuLi5kZWZhdWx0VmFsdWVzLCAuLi5vcHRpb25zIH07XG4gICAgICBjb25zdCBwYXJzZXIgPSBUcmFuc2FjdGlvbkZpbHRlci5wYXJzZShcbiAgICAgICAgRmlsdGVyVHlwZS5Pbmx5TWVtbyxcbiAgICAgICAgTW9kdWxlTmFtZS5Tb2xOYXRpdmUsXG4gICAgICApO1xuICAgICAgYXdhaXQgU2lnbmF0dXJlcy5nZXRGb3JBZHJlc3MoXG4gICAgICAgIHRhcmdldCxcbiAgICAgICAgcGFyc2VyLFxuICAgICAgICAocmVzdWx0KSA9PiByZXN1bHQubWF0Y2gob25Paywgb25FcnIpLFxuICAgICAgICBtZXJnZWRPcHRpb25zLFxuICAgICAgKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIG9uRXJyKGUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cbiIsICJpbXBvcnQgeyBNZW1vIGFzIENyZWF0ZSB9IGZyb20gJy4vY3JlYXRlJztcbmltcG9ydCB7IE1lbW8gYXMgRmluZCB9IGZyb20gJy4vZmluZCc7XG5pbXBvcnQgJ34vdHlwZXMvdHJhbnNhY3Rpb24nO1xuaW1wb3J0ICd+L3RyYW5zYWN0aW9uJztcblxuZXhwb3J0ICogZnJvbSAnfi9zaGFyZWQvZXhwb3J0cyc7XG5leHBvcnQgY29uc3QgTWVtbyA9IHsgLi4uQ3JlYXRlLCAuLi5GaW5kIH07XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsU0FBUywwQkFBQUEsK0JBQThCOzs7QUNBdkM7QUFBQSxFQUVFO0FBQUEsRUFDQSxlQUFlO0FBQUEsT0FFVjs7O0FDTFAsU0FBcUIsaUJBQWlCO0FBQ3RDLE9BQU8sWUFBWTtBQUVaLElBQVU7QUFBQSxDQUFWLENBQVVDLGVBQVY7QUFDRSxFQUFNQSxXQUFBLGlCQUFpQixPQUFPLFFBQVE7QUFDdEMsRUFBTUEsV0FBQSxtQkFBbUIsT0FBTyxRQUFRO0FBQ3hDLEVBQU1BLFdBQUEsY0FBYyxPQUFPO0FBQzNCLEVBQU1BLFdBQUEsbUJBQW1CLE9BQU8sV0FBVztBQUUzQyxNQUFLO0FBQUwsSUFBS0MsYUFBTDtBQUNMLElBQUFBLFNBQUEsU0FBTTtBQUNOLElBQUFBLFNBQUEsaUJBQWM7QUFDZCxJQUFBQSxTQUFBLFNBQU07QUFDTixJQUFBQSxTQUFBLFVBQU87QUFDUCxJQUFBQSxTQUFBLGVBQVk7QUFBQSxLQUxGLFVBQUFELFdBQUEsWUFBQUEsV0FBQTtBQVFMLE1BQUs7QUFBTCxJQUFLRSxpQkFBTDtBQUNMLElBQUFBLGFBQUEsU0FBTTtBQUNOLElBQUFBLGFBQUEsaUJBQWM7QUFDZCxJQUFBQSxhQUFBLFNBQU07QUFDTixJQUFBQSxhQUFBLFVBQU87QUFDUCxJQUFBQSxhQUFBLGVBQVk7QUFBQSxLQUxGLGNBQUFGLFdBQUEsZ0JBQUFBLFdBQUE7QUFRTCxFQUFNQSxXQUFBLGdCQUFnQixDQUFDLFVBR2hCO0FBQ1osVUFBTSxFQUFFLFNBQVMsS0FBSyxrQkFBQUcsa0JBQWlCLElBQUk7QUFHM0MsUUFBSUEscUJBQW9CQSxrQkFBaUIsU0FBUyxHQUFHO0FBQ25ELFlBQU0sUUFBUSxLQUFLLElBQUksSUFBSUEsa0JBQWlCO0FBQzVDLGFBQU9BLGtCQUFpQixLQUFL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O0FBQUEsWUFDRjtBQUFBLFFBQ0o7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQ0QsV0FBTztBQUFBLEVBQ1Q7QUFBQSxHQTdJYTs7O0FDTFYsSUFBVUM7QUFBQSxDQUFWLENBQVVBLFVBQVY7QUFDRSxFQUFNQSxNQUFBLGNBQWMsT0FDekIsUUFDQSxNQUNBLE9BQ0EsVUFBbUMsQ0FBQyxNQUNsQjtBQUNsQixRQUFJO0FBQ0YsWUFBTSxnQkFBZ0M7QUFBQSxRQUNwQyxVQUFVO0FBQUEsUUFDVixZQUFZO0FBQUEsTUFDZDtBQUNBLFlBQU0sZ0JBQWdCLEVBQUUsR0FBRyxlQUFlLEdBQUcsUUFBUTtBQUNyRCxZQUFNLFNBQVMsa0JBQWtCO0FBQUE7QUFBQTtBQUFBLE1BR2pDO0FBQ0EsWUFBTSxXQUFXO0FBQUEsUUFDZjtBQUFBLFFBQ0E7QUFBQSxRQUNBLENBQUMsV0FBVyxPQUFPLE1BQU0sTUFBTSxLQUFLO0FBQUEsUUFDcEM7QUFBQSxNQUNGO0FBQUEsSUFDRixTQUFTLEdBQUc7QUFDVixVQUFJLGFBQWEsT0FBTztBQUN0QixjQUFNLENBQUM7QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxHQTVCZUEsa0JBQUE7OztBQ0FWLElBQU1DLFFBQU8sRUFBRSxHQUFHLE1BQVEsR0FBR0EsTUFBSzsiLAogICJuYW1lcyI6IFsiVHJhbnNhY3Rpb25JbnN0cnVjdGlvbiIsICJDb25zdGFudHMiLCAiQ2x1c3RlciIsICJFbmRQb2ludFVybCIsICJjdXN0b21DbHVzdGVyVXJsIiwgIlJlc3VsdCIsICJQdWJsaWNLZXkiLCAiQWNjb3VudCIsICJLZXlwYWlyIiwgIkFjY291bnQiLCAiQXNzb2NpYXRlZCIsICJQdWJsaWNLZXkiLCAiQWNjb3VudCIsICJQZGEiLCAiQWNjb3VudCIsICJDb252ZXJ0ZXIiLCAiQ29sbGVjdGlvbiIsICJDb252ZXJ0ZXIiLCAiQ3JlYXRvcnMiLCAiQ29udmVydGVyIiwgIlJveWFsdHkiLCAiQ29udmVydGVyIiwgIkNvbXByZXNzZWROZnRNZXRhZGF0YSIsICJDb252ZXJ0ZXIiLCAiTWVtbyIsICJDb252ZXJ0ZXIiLCAiTWludCIsICJDb252ZXJ0ZXIiLCAiQ29sbGVjdGlvbkRldGFpbHMiLCAiQ29udmVydGVyIiwgIlVzZXMiLCAiQ29udmVydGVyIiwgIlRva2VuTWV0YWRhdGEiLCAiQ29udmVydGVyIiwgIlJlZ3VsYXJOZnRNZXRhZGF0YSIsICJDb252ZXJ0ZXIiLCAiUHJvcGVydGllcyIsICJDb252ZXJ0ZXIiLCAiVHJhbnNmZXJDaGVja2VkIiwgIkNvbnZlcnRlciIsICJUcmFuc2ZlciIsICJDb252ZXJ0ZXIiLCAiVmFsaWRhdG9yIiwgIk1lc3NhZ2UiLCAiQ29udmVydGVyIiwgIkZpbHRlclR5cGUiLCAiTW9kdWxlTmFtZSIsICJQdWJsaWNLZXkiLCAiYnMiLCAiQWNjb3VudCIsICJQdWJsaWNLZXkiLCAiTm9kZSIsICJzZW5kQW5kQ29uZmlybVRyYW5zYWN0aW9uIiwgIlR4IiwgIlR4IiwgInNlbmRBbmRDb25maXJtVHJhbnNhY3Rpb24iLCAic2VuZEFuZENvbmZpcm1UcmFuc2FjdGlvbiIsICJUeCIsICJUeCIsICJicyIsICJNZW1vIiwgIlRyYW5zYWN0aW9uSW5zdHJ1Y3Rpb24iLCAiU2lnbmF0dXJlcyIsICJUcmFuc2FjdGlvbkZpbHRlciIsICJpbnN0cnVjdGlvbiIsICJDb252ZXJ0ZXIiLCAiTWVtbyIsICJNZW1vIl0KfQo=