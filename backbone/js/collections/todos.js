/*global Backbone */
var app = app || {};

// 定义todo的集合
// 1、声明集合中的实体类型
// 2、声明使用backbone LocalStorage
// 3、定义接口
// 3.1 completed 返回所有完成的任务 3.2remaining 返回所有未完成的任务 3.3 nextOrder 获取下一排序 3.4 comparator 比较器 
// 实例化
(function () {
	var Todos = Backbone.Collection.extend({

		model: app.Todo,

		localStorage: new Backbone.LocalStorage('todos-backbone'),

		completed: function () {
			return this.where({ completed: true });
		},

		remaining: function () {
			return this.where({ completed: false });
		},

		nextOrder: function () {
			return this.length > 1 ? this.last().get('order') + 1 : 1;
		},

		comparator: 'order'
	});

	app.todos = new Todos();
})();