/**
 * global angular
 */
angular.module('todomvc', ['ngRoute', 'ngResource'])
    .config(function ($routeProvider) {
        'use strict'

        var routerConfig = {
            controller: 'TodoCtrl',
            templateUrl: 'todomvc-index.html',
            resolve: {
                store: function (todoStorage) {
                    // Get the correct module (API or localStorage).
                    return todoStorage.then(function (module) {
                        module.get(); // Fetch the todo records in the background.
                        return module;
                    });
                }
            }
        };
        $routeProvider
            .when('/', routerConfig)
            .when('/:status', routerConfig)
            .otherwise({
                redirectTo: '/'
            })
    });