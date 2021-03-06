'use strict';

angular.module('app').service('stdout', ['$window', function($window) {
	var callback = undefined;
	var websocket = undefined;
	var token = localStorage.getItem('access_token');

	this.subscribe = function(path, _callback) {
		callback = _callback;

		var proto = ($window.location.protocol == 'https:' ? 'wss' : 'ws');
		var route = [proto, "://", $window.location.host, '/api/stream/stdout/', path, '?access_token=', token].join('');

		websocket = new WebSocket(route);
		websocket.onmessage = function(event) {
			if (callback != undefined) {
				callback(event.data);
			}
		};
		websocket.onclose = function(event) {
			console.log('websocket closed at '+path);
		};
	};

	this.unsubscribe = function() {
		callback = undefined;
		if (websocket != undefined) {
			console.log('unsubscribing websocket at '+websocket.url);
			websocket.close();
		}
	};
}]);
