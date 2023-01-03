var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { debugLog, Try } from '@solana-suite/shared';
import { Filter } from '../types/history';
import { SolNative as _Filter } from './filter-transaction';
import { SolNative as _Get } from './get-by-address';
export var SolNative;
(function (SolNative) {
    SolNative.getHistory = (searchPubkey, options) => __awaiter(this, void 0, void 0, function* () {
        return Try(() => __awaiter(this, void 0, void 0, function* () {
            if (options === undefined || !Object.keys(options).length) {
                options = {
                    limit: 0,
                    actionFilter: [],
                    directionFilter: undefined,
                };
            }
            const actionFilter = (options === null || options === void 0 ? void 0 : options.actionFilter) !== undefined && options.actionFilter.length > 0
                ? options.actionFilter
                : [Filter.Transfer, Filter.TransferChecked];
            let bufferedLimit = 0;
            if (options.limit && options.limit < 50) {
                bufferedLimit = options.limit * 1.5; // To get more data, threshold
            }
            else {
                bufferedLimit = 10;
                options.limit = 10;
            }
            let hist = [];
            let before;
            for (;;) {
                const transactions = yield _Get.getByAddress(searchPubkey, bufferedLimit, before);
                debugLog('# getTransactionHistory loop');
                const res = _Filter.filterTransactions(searchPubkey, transactions, actionFilter, false, options.directionFilter);
                hist = hist.concat(res);
                if (hist.length >= options.limit || res.length === 0) {
                    hist = hist.slice(0, options.limit);
                    break;
                }
                before = hist[hist.length - 1].sig;
            }
            return hist;
        }));
    });
})(SolNative || (SolNative = {}));
