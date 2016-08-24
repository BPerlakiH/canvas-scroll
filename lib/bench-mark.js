'use strict';

(function () {

	function floor(value) {
		var x = Math.floor(value);
	};

	function ceil(value) {
		var x = Math.ceil(value);
	};

	function parser(value) {
		var x = parseInt(value);
		// console.log(value, x);
	};

	var values = [];
	for (var i = 0; i < 1000; i++) {
		values[i] = Math.random() * 10;
	}

	console.time('Math.floor');
	values.forEach(function (v) {
		floor(v);
	});
	console.timeEnd('Math.floor');

	console.time('Math.ceil');
	values.forEach(function (v) {
		ceil(v);
	});
	console.timeEnd('Math.ceil');

	console.time('parseInt');
	values.forEach(function (v) {
		parser(v);
	});
	console.timeEnd('Math.parseInt');
})();