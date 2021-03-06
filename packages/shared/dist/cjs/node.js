"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
const constants_1 = require("./constants");
const web3_js_1 = require("@solana/web3.js");
var Node;
(function (Node) {
    let cluster;
    let commitment;
    Node.getConnection = () => {
        // default setting
        if (!cluster) {
            cluster = constants_1.ConstantsFunc.switchApi(constants_1.Constants.currentCluster);
        }
        // default setting
        if (!commitment) {
            commitment = constants_1.Constants.COMMITMENT;
        }
        console.debug('# Node info: ', cluster, commitment);
        return new web3_js_1.Connection(cluster, commitment);
    };
    Node.changeConnection = (param) => {
        if (param.commitment) {
            console.debug('# Node change commitment: ', commitment);
            commitment = param.commitment;
        }
        if (param.cluster) {
            console.debug('# Node change cluster: ', cluster);
            cluster = constants_1.ConstantsFunc.switchApi(param.cluster);
        }
    };
})(Node = exports.Node || (exports.Node = {}));
