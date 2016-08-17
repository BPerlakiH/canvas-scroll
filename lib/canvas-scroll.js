'use strict';

(function () {

	var thumb_size = 100;
	var margin = 20;
	var columns = 3; //initial value, it will change dynamically


	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext('2d');

	var update_canvas_size = function update_canvas_size() {
		var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		canvas.width = w;
		canvas.height = h;
		columns = parseInt((canvas.width - margin) / (thumb_size + margin));
		clear_canvas();
		draw_all();
	};

	window.onresize = function () {
		update_canvas_size();
		console.log('columns: ' + columns);
	};

	var draw_img = function draw_img(posX, posY) {
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(posX, posY, thumb_size, thumb_size);
	};

	var get_position = function get_position(n) {
		var posX = margin + n % columns * (thumb_size + margin);
		var row = parseInt(n / columns);
		var posY = margin + row * (thumb_size + margin);
		console.log(n, columns, row, posX, posY);
		return [posX, posY];
	};

	var clear_canvas = function clear_canvas() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	};

	var draw_all = function draw_all() {
		for (var i = 50; i >= 0; i--) {
			var pos = get_position(i);
			draw_img(pos[0], pos[1]);
		}
	};

	update_canvas_size();
})();