import { Pubkey } from './account.mjs';

type History = {
    sol?: string;
    account?: string;
    destination?: Pubkey;
    source?: Pubkey;
    authority?: Pubkey;
    multisigAuthority?: Pubkey;
    signers?: Pubkey[];
    mint?: Pubkey;
    mintAuthority?: Pubkey;
    tokenAmount?: string;
    memo?: string;
    dateTime?: Date;
    type?: string;
    sig?: string;
    innerInstruction?: boolean;
};
type FindOptions = {
    waitTime: number;
    narrowDown: number;
};

export type { FindOptions, History };
