export enum FilterType {
  Memo = 'memo',
  Mint = 'mint',
  OnlyMemo = 'only-memo',
  Transfer = 'transfer',
}

export enum ModuleName {
  SolNative = 'system',
  SplToken = 'spl-token',
}

export const FilterOptions = {
  Transfer: {
    program: ['system', 'spl-token'],
    action: ['transfer', 'transferChecked'],
  },
  Memo: {
    program: ['spl-memo'],
    action: ['*'],
  },
  Mint: {
    program: ['spl-token'],
    action: ['mintTo', 'mintToChecked'],
  },
};

export type PostTokenAccount = {
  account: string;
  owner: string;
};

export type WithMemo = {
  sig: string[];
  memo: string;
};
