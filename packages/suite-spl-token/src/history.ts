import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { debugLog } from '~/shared';
import { Node } from '~/node';
import { Pubkey } from '~/types/account';
import { OnErr, OnOk } from '~/types/shared';
import { History, HistoryOptions } from '~/types/history';
import { FilterType, ModuleName } from '~/types/transaction-filter';
import { Signatures, TransactionFilter } from '~/transaction-filter';

export namespace SplToken {
  export const getHistory = async (
    target: Pubkey,
    filterType: FilterType,
    onOk: OnOk<History>,
    onErr: OnErr,
    options: Partial<HistoryOptions> = {},
  ): Promise<void> => {
    try {
      const defaultValues: HistoryOptions = {
        waitTime: 0.03,
        narrowDown: 100,
      };
      const mergedOptions = { ...defaultValues, ...options };
      const tokenAccounts =
        await Node.getConnection().getParsedTokenAccountsByOwner(
          target.toPublicKey(),
          {
            programId: TOKEN_PROGRAM_ID,
          },
        );
      const storedHistories: History[] = [];
      debugLog('# tokenAccounts size: ', tokenAccounts.value.length);
      for (const account of tokenAccounts.value) {
        const parser = TransactionFilter.parse(filterType, ModuleName.SplToken);
        await Signatures.getForAdress(
          account.pubkey.toString(),
          parser,
          (result) => result.match(onOk, onErr),
          mergedOptions,
          storedHistories,
        );
      }
    } catch (e) {
      if (e instanceof Error) {
        onErr(e);
      }
    }
  };
}
