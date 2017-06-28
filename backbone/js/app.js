/*global $ */
/*jshint unused:false */
var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;

// 文档加载完成后 开始初始化
$(function () {
    'use strict';
    // kick things off by creating the `App`
    new app.AppView();
});