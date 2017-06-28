/** golbal Backbone,jQuery,_,ENTER_KEY  */

var app = app || {};
/**
 * todos实体对应的视图
 * 1、设置el 
 * 2、设置状态的模板 statsTemplate 使用undercore 的template方法
 * 3、事件绑定：.new-todo keydown 事件, .clear-completed click事件 .toggle-all click事件
 * 4、初始化 监听模型的add reset filter all change:completed事件
 * 5、暴露接口： render渲染接口
 */
(function ($) {
	app.AppView = Backbone.View.extend({
		el: '.todoapp',

		statsTemplate: _.template($('#stats-template').html()),

		events: {
			'keypress .new-todo': 'createOnEnter',
			'click .clear-completed': 'clearCompleted',
			'click .toggle-all': 'toggleAllComplete'
		},

		initialize: function () {
			this.allCheckbox = this.$('.toggle-all')[0];
			this.$input = $('.new-todo');
			this.$list = this.$('.todo-list');
			this.$footer = this.$('.footer');
			this.$main = this.$('.main');

			this.listenTo(app.todos, 'add', this.addOne);
			this.listenTo(app.todos, 'reset', this.addAll);
			this.listenTo(app.todos, 'change:completed', this.filterOne);
			this.listenTo(app.todos, 'filter', this.filterAll);
			this.listenTo(app.todos, 'all', _.debounce(this.render, 0));

			// 初始化数据
			app.todos.fetch({ reset: true });
		},
		render: function () {
			var completed = app.todos.completed().length;
			var remaining = app.todos.remaining().length;

			if (app.todos.length) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.statsTemplate({
					completed: completed,
					remaining: remaining
				}));

				this.$('.filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (app.TodoFilter || '') + '"]')
					.addClass('selected');
			} else {
				this.$main.hide();
				this.$footer.hide();
			}
		},
		addOne: function (todo) {
			var view = new app.TodoView({ model: todo });
			this.$list.append(view.render().el);
		},
		// Add all items in the **Todos** collection at once.
		addAll: function () {
			this.$list.html('');
			app.todos.each(this.addOne, this);
		},
		filterOne: function (todo) {
			todo.trigger('visible');
		},
		filterAll: function () {
			app.todos.each(this.filterOne, this);
		},
		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
				order: app.todos.nextOrder(),
				completed: false
			}
		},
		createOnEnter: function (e) {
			if (e.which === ENTER_KEY && this.$input.val().trim()) {
				app.todos.create(this.newAttributes());
				this.$input.val('');
			}
		},
		clearCompleted: function (e) {
			_.invoke(app.todos.completed(), 'destroy');
			return false;
		},
		toggleAllComplete: function (e) {
			var completed = this.allCheckbox.checked;
			app.todos.each(function (todo) {
				todo.save({
					completed: completed
				});
			});
		}
	});

})(jQuery)