/*global angular */
/**
 * 获取持久化数据，从本地的localstorage 或者从后台服务获取
 * 两者都是采用相同改的Api
 *
 */

angular.module('todomvc')
    .factory('todoStorage', function ($http, $injector) {
        'use strict'
        // $http.get 返回一个promise包装对象的，在then中 第一个参数是callback，第二个参数是errback，
        return $http.get('/api')
            .then(function () {
                return $injector.get('api');
            }, function () {
                return $injector.get('localStorage');
            });
    })
    .factory('api', function ($resource) {
        'use strict';

        var store = {
            todos: [],

            api: $resource('/api/todos/:id', null,
                {
                    update: { method: 'PUT' }
                }
            ),

            clearCompleted: function () {
                var originalTodos = store.todos.slice(0);

                var incompleteTodos = store.todos.filter(function (todo) {
                    return !todo.completed;
                });

                angular.copy(incompleteTodos, store.todos);

                return store.api.delete(function () {
                }, function error() {
                    angular.copy(originalTodos, store.todos);
                });
            },

            delete: function (todo) {
                var originalTodos = store.todos.slice(0);

                store.todos.splice(store.todos.indexOf(todo), 1);
                return store.api.delete({ id: todo.id },
                    function () {
                    }, function error() {
                        angular.copy(originalTodos, store.todos);
                    });
            },

            get: function () {
                return store.api.query(function (resp) {
                    angular.copy(resp, store.todos);
                });
            },

            insert: function (todo) {
                var originalTodos = store.todos.slice(0);

                return store.api.save(todo,
                    function success(resp) {
                        todo.id = resp.id;
                        store.todos.push(todo);
                    }, function error() {
                        angular.copy(originalTodos, store.todos);
                    })
                    .$promise;
            },

            put: function (todo) {
                return store.api.update({ id: todo.id }, todo)
                    .$promise;
            }
        };

        return store;
    })
    .factory('localStorage', function ($q) {
'use strict';

		var STORAGE_ID = 'todos-angularjs';

		var store = {
			todos: [],

			_getFromLocalStorage: function () {
				return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
			},

			_saveToLocalStorage: function (todos) {
				localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
			},

			clearCompleted: function () {
				var deferred = $q.defer();

				var incompleteTodos = this.todos.filter(function (todo) {
					return !todo.completed;
				});

				angular.copy(incompleteTodos, this.todos);

				this._saveToLocalStorage(this.todos);
				deferred.resolve(store.todos);

				return deferred.promise;
			},

			delete: function (todo) {
				var deferred = $q.defer();

				store.todos.splice(store.todos.indexOf(todo), 1);

				store._saveToLocalStorage(store.todos);
				deferred.resolve(store.todos);

				return deferred.promise;
			},

			get: function () {
				var deferred = $q.defer();

				angular.copy(store._getFromLocalStorage(), store.todos);
				deferred.resolve(store.todos);

				return deferred.promise;
			},

			insert: function (todo) {
				var deferred = $q.defer();

				store.todos.push(todo);

				store._saveToLocalStorage(store.todos);
				deferred.resolve(store.todos);

				return deferred.promise;
			},

			put: function (todo, index) {
				var deferred = $q.defer();

				store.todos[index] = todo;

				store._saveToLocalStorage(store.todos);
				deferred.resolve(store.todos);

				return deferred.promise;
			}
		};

		return store;
    })


