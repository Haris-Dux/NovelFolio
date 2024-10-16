"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _AuthorizationError_instances, _AuthorizationError_stringifyAuthParams;
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("./CustomError"));
class AuthorizationError extends CustomError_1.default {
    constructor(message, statusCode, authParams) {
        super(message, statusCode || 401);
        _AuthorizationError_instances.add(this);
        this.authorizationError = true;
        this.authParams = authParams;
        this.authHeaders = {
            "WWW-Authenticate": `Bearer ${__classPrivateFieldGet(this, _AuthorizationError_instances, "m", _AuthorizationError_stringifyAuthParams).call(this)}`,
        };
    }
}
_AuthorizationError_instances = new WeakSet(), _AuthorizationError_stringifyAuthParams = function _AuthorizationError_stringifyAuthParams() {
    let str = "";
    let _a = this.authParams || {}, { realm } = _a, others = __rest(_a, ["realm"]);
    realm = realm || "Access to user account";
    str = `realm=${realm}`;
    const otherParams = Object.keys(others);
    if (otherParams.length < 1)
        return str;
    otherParams.forEach((authParam, index, array) => {
        // Delete other `realm(s)` if exists
        if (authParam.toLowerCase() === "realm") {
            delete others[authParam];
        }
        let comma = ",";
        // If is last Item then no comma
        if (array.length - 1 === index)
            comma = "";
        str = str + ` ${authParam}=${this.authParams[authParam]}${comma}`;
    });
    return str;
};
exports.default = AuthorizationError;
