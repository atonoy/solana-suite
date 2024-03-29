import {
  ComputeBudgetProgram,
  Keypair,
  RecentPrioritizationFees,
  TransactionInstruction,
} from '@solana/web3.js';

import { debugLog } from '~/suite-utils';
import { Node } from '~/node';
import { TransactionBuilder as ComputeUnit } from './compute-unit';

export namespace TransactionBuilder {
  export namespace PriorityFee {
    const MAX_RECENT_PRIORITY_FEE_ACCOUNTS = 128;
    const MICRO_LAMPORTS_PER_LAMPORT = 1_000_000;

    export const createInstruction = async (
      instructions: TransactionInstruction[],
      addSolPriorityFee?: number,
      feePayer?: Keypair,
    ) => {
      let unitPrice = 0;
      if (addSolPriorityFee && feePayer) {
        const microLamports =
          addSolPriorityFee.toLamports() * MICRO_LAMPORTS_PER_LAMPORT;
        const cu = await ComputeUnit.ComputeUnit.simulate(
          instructions,
          feePayer,
        );
        unitPrice = Math.trunc(microLamports / cu);
      } else {
        unitPrice = await estimatePriorityFee(instructions);
      }
      debugLog('# unit price(microLamports): ', unitPrice);
      return ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: unitPrice,
      });
    };

    // thanks https://github.com/blockworks-foundation/mango-v4/blob/57a9835aa8f636b6d231ba2c4008bfe89cbf08ba/ts/client/src/client.ts#L4552
    export const estimatePriorityFee = async (
      instructions: TransactionInstruction[],
    ): Promise<number> => {
      const writableAccounts = instructions
        .map((inst) =>
          inst.keys
            .filter((account) => account.isWritable)
            .map((key) => key.pubkey),
        )
        .flat();

      const uniqWritableAccounts = [
        ...new Set(writableAccounts.map((account) => account.toBase58())),
      ]
        .map((account) => account.toPublicKey())
        .slice(0, MAX_RECENT_PRIORITY_FEE_ACCOUNTS);

      const priorityFees =
        await Node.getConnection().getRecentPrioritizationFees({
          lockedWritableAccounts: uniqWritableAccounts,
        });

      if (priorityFees.length < 1) {
        debugLog('# get recent priority fees: ', priorityFees);
        return 0;
      }

      const groupBySlot = priorityFees.reduce(
        (acc, fee) => {
          const key = fee.slot;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(fee);
          return acc;
        },
        {} as Record<string, RecentPrioritizationFees[]>,
      );

      const maxFeeBySlot = Object.keys(groupBySlot).reduce(
        (acc, slot) => {
          acc[slot] = groupBySlot[slot].reduce((max, fee) => {
            return fee.prioritizationFee > max.prioritizationFee ? fee : max;
          });
          return acc;
        },
        {} as Record<string, RecentPrioritizationFees>,
      );
      const maximumFees = Object.values(maxFeeBySlot).sort(
        (a: RecentPrioritizationFees, b: RecentPrioritizationFees) =>
          a.slot - b.slot,
      ) as RecentPrioritizationFees[];

      // get median of last 20 fees
      const recentFees = maximumFees.slice(
        Math.max(maximumFees.length - 20, 0),
      );
      const mid = Math.floor(recentFees.length / 2);
      const medianFee =
        recentFees.length % 2 !== 0
          ? recentFees[mid].prioritizationFee
          : (recentFees[mid - 1].prioritizationFee +
              recentFees[mid].prioritizationFee) /
            2;

      debugLog('# median fee: ', medianFee);

      return Math.ceil(medianFee);
    };
  }
}
