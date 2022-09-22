"use strict";
/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
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
exports.Sender = void 0;
var helpers_1 = require("./helpers");
var reg_tx_1 = require("./reg_tx");
var fuel_tx_1 = require("./fuel_tx");
var helpers_2 = require("./helpers");
/* - Send transaction
   - There are two main scenarios: one where the wallet needs a fuel tx, and one where it doesn't
   - Need it case: first it tries to send a fuel tx; if fails sends a regular one with executor auth; if fails sends a cosigned one (if cosigner is specified)
   - Other case: If cpu is available tries to send a regular tx with wallet's resources; if fails sends a cosigned one (cosigner must be specified)
   */
var Sender = /** @class */ (function () {
    function Sender(wallet, maxTxFee) {
        this.wallet = wallet;
        this.maxTxFee = maxTxFee || 0;
        this.reg = new reg_tx_1.RegularTransaction(wallet);
        this.fuel = new fuel_tx_1.FuelTransaction(wallet, this.maxTxFee);
    }
    Sender.prototype.sendTx = function (txData, fuelTx) {
        return __awaiter(this, void 0, void 0, function () {
            var fullTxData, _a, accepted, rejected, _b, success_1, error_1, _c, success, error;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        fullTxData = (0, helpers_1.setTxData)(this.wallet, txData);
                        // set cosign if needed
                        if (this.wallet.coSignAddress) {
                            fullTxData = (0, helpers_2.setCosign)(this.wallet, fullTxData);
                        }
                        if (!fuelTx) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.fuel.send(fullTxData)];
                    case 1:
                        _a = _d.sent(), accepted = _a[0], rejected = _a[1];
                        if (accepted)
                            return [2 /*return*/, [accepted, null]];
                        return [4 /*yield*/, this.reg.send(fullTxData)];
                    case 2:
                        _b = _d.sent(), success_1 = _b[0], error_1 = _b[1];
                        if (success_1)
                            return [2 /*return*/, [success_1, null]];
                        // return possible dapp errors
                        return [2 /*return*/, [null, error_1]];
                    case 3: return [4 /*yield*/, this.reg.send(fullTxData)];
                    case 4:
                        _c = _d.sent(), success = _c[0], error = _c[1];
                        if (success)
                            return [2 /*return*/, [success, null]];
                        // return possible dapp errors
                        return [2 /*return*/, [null, error]];
                }
            });
        });
    };
    return Sender;
}());
exports.Sender = Sender;
