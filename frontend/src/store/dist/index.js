"use strict";
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
exports.__esModule = true;
exports.useStore = exports.createStore = exports.provideStore = exports.store = exports.initialState = exports.initialStoreState = exports.iSS = void 0;
var vue_1 = require("vue");
var ajax_1 = require("../ajax");
var moment_1 = require("moment");
var useStorage_1 = require("../composables/useStorage");
var colorLog_1 = require("../utils/colorLog");
// https://stackoverflow.com/questions/32308370/what-is-the-syntax-for-typescript-arrow-functions-with-generics
function iSS() {
    return {
        ids: [],
        all: {},
        loaded: false,
        currentId: undefined
    };
}
exports.iSS = iSS;
exports.initialStoreState = function (x) { return ({
    ids: [],
    all: {},
    loaded: false,
    currentId: undefined
}); };
exports.initialState = function () { return ({
    // authors: iSS<IAuthor>(),
    posts: exports.initialStoreState({})
}); };
var delay = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
var localStorage = useStorage_1.useStorage();
var parseQuery = function (input) {
    return Object.entries(input).reduce(function (cur, _a) {
        var k = _a[0], v = _a[1];
        return typeof v != 'number'
            ? cur += k + ": \"\"\"" + v.toString().replace(/"/g, '\\"') + "\"\"\", "
            : cur += k + ": " + v + ", ";
    }, '');
};
var unParseQuery = function (input) {
    return Object.entries(input).forEach(function (_a) {
        var k = _a[0], v = _a[1];
        if (typeof v == 'string') {
            input[k] = v.replace(/(\\)+"/g, '"');
        }
    });
};
var Store = /** @class */ (function () {
    function Store(initialState) {
        this.state = vue_1.reactive(initialState);
    }
    Store.prototype.getState = function () {
        return vue_1.readonly(this.state);
    };
    Store.prototype.createPost = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var createPost, query, response, post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delete input['id'];
                        createPost = parseQuery(input);
                        query = "\n      mutation {\n        createPost (post: {" + createPost + "}) {\n          id\n          title\n          html\n          markdown\n          created\n        }\n      }\n    ";
                        return [4 /*yield*/, ajax_1.graphAxios(query)];
                    case 1:
                        response = _a.sent();
                        post = __assign(__assign({}, response.createPost), { created: moment_1["default"](response.createPost.created) });
                        unParseQuery(post);
                        this.state.posts.all[response.createPost.id] = post;
                        this.state.posts.ids.push(post.id.toString());
                        return [2 /*return*/];
                }
            });
        });
    };
    Store.prototype.updatePost = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var createPost, query, response, post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        createPost = parseQuery(input);
                        query = "\n      mutation {\n        updatePost (post: {" + createPost + "}) {\n          id\n          userId\n          title\n          html\n          markdown\n          created\n        }\n      }\n    ";
                        return [4 /*yield*/, ajax_1.graphAxios(query)];
                    case 1:
                        response = _a.sent();
                        post = __assign(__assign({}, response.updatePost), { created: moment_1["default"](response.updatePost.created) });
                        unParseQuery(post);
                        this.state.posts.all[response.updatePost.id] = post;
                        return [2 /*return*/];
                }
            });
        });
    };
    Store.prototype.deletePost = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        colorLog_1.colorLog("delete post with id: " + id);
                        query = "\n      mutation {\n        deletePost(id: \"" + id + "\")\n      }\n    ";
                        return [4 /*yield*/, ajax_1.graphAxios(query)];
                    case 1: 
                    // colorLog(await graphAxios(query))
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Store.prototype.fetchPosts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, response, posts, _i, posts_1, post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n      {\n        posts {\n          id\n          title\n          markdown\n          html\n          userId\n          created\n        }\n      }\n    ";
                        return [4 /*yield*/, ajax_1.graphAxios(query, 'posts')];
                    case 1:
                        response = _a.sent();
                        posts = response.posts.map(function (p) { return (__assign(__assign({}, p), { created: moment_1["default"](p.created) })); });
                        if (posts) {
                            for (_i = 0, posts_1 = posts; _i < posts_1.length; _i++) {
                                post = posts_1[_i];
                                unParseQuery(post);
                                if (!this.state.posts.ids.includes(post.id.toString())) {
                                    this.state.posts.ids.push(post.id.toString());
                                }
                                this.state.posts.all[post.id] = post;
                            }
                        }
                        this.state.posts.loaded = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    return Store;
}());
exports.store = new Store(exports.initialState());
exports.store.getState();
exports.provideStore = function () {
    vue_1.provide('store', exports.store);
};
// this way did not do default type checking without declaring type: State
// export const createStore = (initState?: State) => {
//   return initState
//     ? new Store(initState)
//     : new Store(initialState())
// }
exports.createStore = function (initState) {
    if (initState === void 0) { initState = exports.initialState(); }
    return new Store(initState);
};
exports.useStore = function () {
    var store = vue_1.inject('store');
    return store;
};
