"use strict";
exports.__esModule = true;
require("highlight.js/styles/solarized-dark.css");
var vue_1 = require("vue");
var App_vue_1 = require("./App.vue");
var router_1 = require("./router");
vue_1.createApp(App_vue_1["default"]).use(router_1["default"]).mount('#app');
