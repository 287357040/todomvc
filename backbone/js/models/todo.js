/**global Backbone */
var app = app || {};

// 定义 todo item的Model
(function () {
	'use strict'

	app.Todo = Backbone.Model.extend({
		// 设置默认属性
		defaults: {
			title: '',
			completed: false
		},

		// 定义方法，是否完成状态切换
		toggle: function () {
			this.save({
				completed: !this.get('completed')
			});
		}
	});
})();