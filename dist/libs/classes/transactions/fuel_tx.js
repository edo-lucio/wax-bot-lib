"use strict";
/* eslint-disable require-jsdoc */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuelTransaction = void 0;
var eosjs_1 = require("eosjs");
var eosjs_ecc_1 = __importDefault(require("eosjs-ecc"));
var consts_1 = require("../../../consts");
var FuelTransaction = /** @class */ (function () {
    function FuelTransaction(wallet) {
        this.wallet = wallet;
    }
    FuelTransaction.prototype.send = function (txData) {
        return __awaiter(this, void 0, void 0, function () {
            var newTxData, signers, signer, transaction, deserializedTransaction, cosigned, json, data, _a, _b, modifiedTransaction, signedTransaction, response, error_1, _c, modifiedTransaction, signedTransaction, response, error_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        newTxData = JSON.parse(JSON.stringify(txData));
                        signers = txData.actions[0].authorization;
                        signer = signers.length > 1 ? signers[1] : signers[0];
                        // add it to transaction data
                        newTxData.actions[0].authorization = [signer];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 17, , 18]);
                        return [4 /*yield*/, this.wallet.api.transact(newTxData, {
                                useLastIrreversible: true,
                                expireSeconds: 300,
                                broadcast: false,
                                sign: false,
                            })];
                    case 2:
                        transaction = _d.sent();
                        deserializedTransaction = this.wallet.api.deserializeTransaction(transaction.serializedTransaction);
                        return [4 /*yield*/, this.wallet.rpc.fetchBuiltin(consts_1.consts.RESOURCE_PROVIDER_ENDPOINT, {
                                body: JSON.stringify({
                                    signer: signer,
                                    transaction: deserializedTransaction,
                                }),
                                method: "POST",
                            })];
                    case 3:
                        cosigned = _d.sent();
                        return [4 /*yield*/, cosigned.json()];
                    case 4:
                        json = _d.sent();
                        console.log("\nResponse (".concat(json.code, ") from resource provider api..."));
                        console.log(json);
                        data = json.data;
                        _a = json.code;
                        switch (_a) {
                            case 402: return [3 /*break*/, 5];
                            case 200: return [3 /*break*/, 11];
                            case 400: return [3 /*break*/, 15];
                        }
                        return [3 /*break*/, 16];
                    case 5:
                        _b = data.request, modifiedTransaction = _b[1];
                        console.log("\n\nResource Provider provided signature in exchange for a fee\n");
                        // Ensure the modifed transaction is what the application expects
                        // These validation methods will throw an exception if invalid data exists
                        return [4 /*yield*/, this.validateTransaction(signer, modifiedTransaction, deserializedTransaction, data.costs)];
                    case 6:
                        // Ensure the modifed transaction is what the application expects
                        // These validation methods will throw an exception if invalid data exists
                        _d.sent();
                        return [4 /*yield*/, this.signModifiedTransaction(modifiedTransaction)];
                    case 7:
                        signedTransaction = _d.sent();
                        // Merge signatures from the user and the cosigned responsetab
                        signedTransaction.signatures = __spreadArray(__spreadArray([], signedTransaction.signatures, true), data.signatures, true);
                        console.log("\n\nSigned transaction using both cosigner and specified account\n");
                        _d.label = 8;
                    case 8:
                        _d.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, this.wallet.api.pushSignedTransaction(signedTransaction)];
                    case 9:
                        response = _d.sent();
                        console.log("\n\nBroadcast response from API:\n");
                        console.log(response);
                        return [2 /*return*/, [response, undefined]];
                    case 10:
                        error_1 = _d.sent();
                        return [2 /*return*/, [undefined, error_1]];
                    case 11:
                        _c = data.request, modifiedTransaction = _c[1];
                        console.log("\n\nResource Provider provided signature for free\n");
                        // Ensure the modifed transaction is what the application expects
                        // These validation methods will throw an exception if invalid data exists
                        return [4 /*yield*/, this.validateTransaction(signer, modifiedTransaction, deserializedTransaction, data.costs)];
                    case 12:
                        // Ensure the modifed transaction is what the application expects
                        // These validation methods will throw an exception if invalid data exists
                        _d.sent();
                        return [4 /*yield*/, this.signModifiedTransaction(modifiedTransaction)];
                    case 13:
                        signedTransaction = _d.sent();
                        // Merge signatures from the user and the cosigned responsetab
                        signedTransaction.signatures = __spreadArray(__spreadArray([], signedTransaction.signatures, true), data.signatures, true);
                        console.log("\n\nSigned transaction using both cosigner and specified account\n");
                        console.log(signedTransaction);
                        return [4 /*yield*/, this.wallet.api.pushSignedTransaction(signedTransaction)];
                    case 14:
                        response = _d.sent();
                        console.log("\n\nBroadcast response from API:\n");
                        console.log(response);
                        return [2 /*return*/, [response, undefined]];
                    case 15:
                        {
                            console.log("\nResource Provider refused to sign the transaction\n");
                            return [2 /*return*/, [null, "Refused"]];
                        }
                        _d.label = 16;
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        error_2 = _d.sent();
                        if (error_2 instanceof eosjs_1.RpcError) {
                            console.log("Fuel error", error_2.details[0].message);
                            return [2 /*return*/, [undefined, String(error_2.details[0].message)]];
                        }
                        return [2 /*return*/, [undefined, String(error_2)]];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    FuelTransaction.prototype.signModifiedTransaction = function (modifiedTransaction) {
        return __awaiter(this, void 0, void 0, function () {
            var publicKey, abis, serializedContextFreeData, serializedTransaction, _a, _b, _c, signedTransaction;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        publicKey = eosjs_ecc_1.default.privateToPublic(this.wallet.executorPrivateKey);
                        return [4 /*yield*/, this.wallet.api.getTransactionAbis(modifiedTransaction)];
                    case 1:
                        abis = _e.sent();
                        serializedContextFreeData = this.wallet.api.serializeContextFreeData(modifiedTransaction.context_free_data);
                        _b = (_a = this.wallet.api).serializeTransaction;
                        _c = [__assign({}, modifiedTransaction)];
                        _d = {};
                        return [4 /*yield*/, this.wallet.api.serializeActions(modifiedTransaction.context_free_actions || [])];
                    case 2:
                        serializedTransaction = _b.apply(_a, [__assign.apply(void 0, _c.concat([(_d.context_free_actions = _e.sent(), _d.actions = modifiedTransaction.actions, _d)]))]);
                        return [4 /*yield*/, this.wallet.api.signatureProvider.sign({
                                chainId: consts_1.consts.CHAIN_ID,
                                requiredKeys: [publicKey],
                                serializedTransaction: serializedTransaction,
                                serializedContextFreeData: serializedContextFreeData,
                                abis: abis,
                            })];
                    case 3:
                        signedTransaction = _e.sent();
                        return [2 /*return*/, signedTransaction];
                }
            });
        });
    };
    // Validate the transaction
    FuelTransaction.prototype.validateTransaction = function (signer, modifiedTransaction, serializedTransaction, costs) {
        if (costs === void 0) { costs = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Ensure the first action is the `greymassnoop:noop`
                        this.validateNoop(modifiedTransaction);
                        // Ensure the actions within the transaction match what was provided
                        return [4 /*yield*/, this.validateActions(signer, modifiedTransaction, serializedTransaction, costs)];
                    case 1:
                        // Ensure the actions within the transaction match what was provided
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Validate the actions of the modified transaction vs the original transaction
    FuelTransaction.prototype.validateActions = function (signer, modifiedTransaction, deserializedTransaction, costs) {
        return __awaiter(this, void 0, void 0, function () {
            var expectedNewActions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedNewActions = this.determineExpectedActionsLength(costs);
                        // Ensure the proper number of actions was returned
                        this.validateActionsLength(expectedNewActions, modifiedTransaction, deserializedTransaction);
                        // Ensure the appended actions were expected
                        return [4 /*yield*/, this.validateActionsContent(signer, expectedNewActions, modifiedTransaction, deserializedTransaction)];
                    case 1:
                        // Ensure the appended actions were expected
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Validate the number of actions is the number expected
    FuelTransaction.prototype.determineExpectedActionsLength = function (costs) {
        // By default, 1 new action is appended (noop)
        var expectedNewActions = 1;
        // If there are costs associated with this transaction, 1 new actions is added (the fee)
        if (costs) {
            expectedNewActions += 1;
            // If there is a RAM cost associated with this transaction, 1 new actio is added (the ram purchase)
            console.log(costs);
            if (costs.ram !== "0.0000 EOS") {
                expectedNewActions += 1;
            }
        }
        return expectedNewActions;
    };
    // Validate the contents of each action
    FuelTransaction.prototype.validateActionsContent = function (signer, expectedNewActions, modifiedTransaction, deserializedTransaction) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Make sure the originally requested actions are still intact and unmodified
                        this.validateActionsOriginalContent(expectedNewActions, modifiedTransaction, deserializedTransaction);
                        if (!(expectedNewActions > 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.validateActionsFeeContent(signer, modifiedTransaction)];
                    case 1:
                        _a.sent();
                        if (!(expectedNewActions > 2)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.validateActionsRamContent(signer, modifiedTransaction)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Ensure the transaction fee transfer is valid
    FuelTransaction.prototype.validateActionsFeeContent = function (signer, modifiedTransaction) {
        return __awaiter(this, void 0, void 0, function () {
            var maxFee, feeAction, amount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        maxFee = 0;
                        return [4 /*yield*/, this.wallet.api.deserializeActions([
                                modifiedTransaction.actions[1],
                            ])];
                    case 1:
                        feeAction = (_a.sent())[0];
                        amount = parseFloat(feeAction.data.quantity.split(" ")[0]);
                        if (amount > maxFee) {
                            throw new Error("Fee of ".concat(amount, " exceeds the maximum fee of ").concat(maxFee, "."));
                        }
                        if (feeAction.account !== "eosio.token" ||
                            feeAction.name !== "transfer" ||
                            feeAction.data.to !== "fuel.gm") {
                            throw new Error("Fee action was deemed invalid.");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Ensure the RAM purchasing action is valid
    FuelTransaction.prototype.validateActionsRamContent = function (signer, modifiedTransaction) {
        return __awaiter(this, void 0, void 0, function () {
            var ramAction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.wallet.api.deserializeActions([
                            modifiedTransaction.actions[2],
                        ])];
                    case 1:
                        ramAction = (_a.sent())[0];
                        if (ramAction.account !== "eosio" ||
                            !["buyram", "buyrambytes"].includes(ramAction.name) ||
                            ramAction.data.payer !== "greymassfuel" ||
                            ramAction.data.receiver !== signer.actor) {
                            throw new Error("RAM action was deemed invalid.");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // Make sure the actions returned in the API response match what was submitted
    FuelTransaction.prototype.validateActionsOriginalContent = function (expectedNewActions, modifiedTransaction, deserializedTransaction) {
        for (var _i = 0, _a = modifiedTransaction.actions.entries(); _i < _a.length; _i++) {
            var i = _a[_i][0];
            // Skip the expected new actions
            if (i < expectedNewActions)
                continue;
            // Compare each action to the originally generated actions
            if (!modifiedTransaction.actions[i] ||
                modifiedTransaction.actions[i].account !==
                    deserializedTransaction.actions[i - expectedNewActions]
                        .account ||
                modifiedTransaction.actions[i].name !==
                    deserializedTransaction.actions[i - expectedNewActions]
                        .name ||
                modifiedTransaction.actions[i].authorization.length !==
                    deserializedTransaction.actions[i - expectedNewActions]
                        .authorization.length ||
                modifiedTransaction.actions[i].authorization[0].actor !==
                    deserializedTransaction.actions[i - expectedNewActions]
                        .authorization[0].actor ||
                modifiedTransaction.actions[i].authorization[0].permission !==
                    deserializedTransaction.actions[i - expectedNewActions]
                        .authorization[0].permission ||
                modifiedTransaction.actions[i].data.toLowerCase() !==
                    deserializedTransaction.actions[i - expectedNewActions].data.toLowerCase()) {
                var _b = deserializedTransaction.actions[i - expectedNewActions], account = _b.account, name = _b.name;
                throw new Error("Transaction returned by API has non-matching action at index ".concat(i, " (").concat(account, ":").concat(name, ")"));
            }
        }
    };
    // Ensure no unexpected actions were appended in the response
    FuelTransaction.prototype.validateActionsLength = function (expectedNewActions, modifiedTransaction, deserializedTransaction) {
        if (modifiedTransaction.actions.length !==
            deserializedTransaction.actions.length + expectedNewActions) {
            throw new Error("Transaction returned contains additional actions.");
        }
    };
    // Make sure the first action is the greymassnoop:noop and properly defined
    FuelTransaction.prototype.validateNoop = function (modifiedTransaction) {
        if (modifiedTransaction.actions[0].account !== "greymassnoop" ||
            modifiedTransaction.actions[0].name !== "noop" ||
            modifiedTransaction.actions[0].authorization[0].actor !==
                "greymassfuel" ||
            modifiedTransaction.actions[0].authorization[0].permission !==
                "cosign" ||
            modifiedTransaction.actions[0].data !== "") {
            throw new Error("First action within transaction response is not valid greymassnoop:noop.");
        }
    };
    return FuelTransaction;
}());
exports.FuelTransaction = FuelTransaction;
