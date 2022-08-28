"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcWrapper = void 0;
/* eslint-disable require-jsdoc */
var utils_1 = require("../../utils/utils");
var RpcWrapper = /** @class */ (function () {
    function RpcWrapper(rpc) {
        this.rpc = rpc;
    }
    RpcWrapper.prototype.fetchTable = function (contractName, contractScope, contractTable, indexPosition, lowerBound, upperBound, key, reverse) {
        return __awaiter(this, void 0, void 0, function () {
            var tableOptions, res, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tableOptions = {
                            code: contractName,
                            scope: contractScope,
                            table: contractTable,
                            index_position: indexPosition || 1,
                            limit: 1000,
                            lower_bound: lowerBound || null,
                            upper_bound: upperBound || null,
                            reverse: reverse || true,
                            show_payer: false,
                            json: true,
                            key_type: key,
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, this.rpc.get_table_rows(tableOptions)];
                    case 2:
                        res = _a.sent();
                        return [2 /*return*/, res];
                    case 3:
                        error_1 = _a.sent();
                        console.log("\nCaught exception: " + error_1);
                        return [4 /*yield*/, utils_1.Utils.sleep(8000)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, this.fetchTable(contractName, contractScope, contractTable, indexPosition, lowerBound, upperBound, key, reverse)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    RpcWrapper.prototype.getAssetBalance = function (tokenDomain, walletAddress, tokenSymbol) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenBalance, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, this.rpc.get_currency_balance(tokenDomain, walletAddress, tokenSymbol)];
                    case 1:
                        tokenBalance = _a.sent();
                        if (tokenBalance.length) {
                            return [2 /*return*/, parseFloat(tokenBalance[0].replace(/[A-Za-z]+/g, ""))];
                        }
                        return [2 /*return*/, 0.0];
                    case 2:
                        error_2 = _a.sent();
                        console.log("\nCaught exception: " + error_2);
                        return [4 /*yield*/, utils_1.Utils.sleep(8000)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, this.getAssetBalance(tokenDomain, walletAddress, tokenSymbol)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RpcWrapper.prototype.getAccount = function (walletAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var accountData, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, this.rpc.get_account(walletAddress)];
                    case 1:
                        accountData = _a.sent();
                        return [2 /*return*/, accountData];
                    case 2:
                        error_3 = _a.sent();
                        return [4 /*yield*/, utils_1.Utils.sleep(4000)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, this.getAccount(walletAddress)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return RpcWrapper;
}());
exports.RpcWrapper = RpcWrapper;
