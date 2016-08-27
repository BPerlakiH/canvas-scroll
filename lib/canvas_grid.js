"use strict";

var canvasGrid = function CanvasGrid() {

	//private
	var canv = document.querySelector('canvas');
	if (canv == null) {
		canv = document.createElement('canvas');
	}
	var canvas = canv;
	var ctx = canvas.getContext('2d');
	if (ctx == null) {
		throw new Error('canvas not supported');
	}

	//initial values, they will change dynamically:
	var thumb_size = void 0;
	var margin = void 0;
	var item_size = void 0;
	var config = false;
	var total_count = 0;
	var items = [];
	var columns = 3;
	var rows = 1;
	var marginLeft = 0;
	var innerWidth = 0;
	var innerHeight = 0;

	var positions = [];
	var drawn_positions = {};

	var _config = function _config(configuration) {
		config = configuration || false;
		margin = _getConfigValue('margin', 20);
		thumb_size = _getConfigValue('thumbSize', 200);
		item_size = thumb_size + margin;
		_update_layout();
	};

	var _add_items = function _add_items(new_items) {
		for (var i in new_items) {
			items.push(i);
		}
		total_count = items.length;
		_update_layout();
	};

	var _on_scroll = function _on_scroll() {
		_update_content();
	};

	function _getConfigValue(value, fallbackValue) {
		if (config) {
			if (typeof config[value] === 'function') {
				return config[value]();
			} else if (config.hasOwnProperty(value)) {
				return config[value];
			}
		} else {
			return fallbackValue;
		}
	};

	var _update_layout = function _update_layout() {
		//get the inner window size:
		innerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		innerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

		//calculate the nr of columns, marginLeft and the total content height:
		columns = parseInt((innerWidth - margin) / item_size);
		marginLeft = Math.round((innerWidth - columns * item_size - margin) * 0.5);
		// const rowModulus = total_count % columns;
		// const rCount = total_count / columns;
		// if(rowModulus == 0) {
		// rows = rCount;
		// } else {
		// rows = Math.ceil(rCount);
		// }
		rows = Math.ceil(total_count / columns);

		_set_canvas_size();
		_pre_cache_positions();
		_update_content();
	};

	var _update_content = function _update_content() {
		_clear_canvas();
		_draw_all_visible();
	};

	var _set_canvas_size = function _set_canvas_size() {
		//go full screen:
		if (canvas.width != innerWidth) {
			canvas.width = innerWidth;
		}
		var content_height = rows * item_size + margin;
		if (canvas.height != content_height) {
			canvas.height = content_height;
		}
	};

	var _pre_cache_positions = function _pre_cache_positions() {
		//pre-calculate the X positions in the columns as those will be repeated over and over in each row
		var colXPositions = [];
		for (var c = 0; c <= columns; c++) {
			var colWidth = marginLeft + margin + c % columns * item_size;
			colXPositions.push(colWidth);
		}

		//pre-cache all the positions:
		positions = [];
		for (var n = 0; n <= total_count; n++) {
			var posX = colXPositions[n % columns];
			var row = parseInt(n / columns);
			var posY = margin + row * item_size;
			positions[n] = [posX, posY, n];
		}
		//reset the drawn positions:
		drawn_positions = [];
	};

	var _get_bounds = function _get_bounds() {
		var yOffset = window.pageYOffset;
		//the lower bound is every row that hides above the page
		var lowerBound = Math.floor(yOffset / item_size) * columns;
		//the visible bound is every row that currently displayed on the page
		var upperBound = Math.ceil((yOffset + innerHeight) / item_size) * columns;
		return [lowerBound, upperBound];
	};

	var _get_visible_items = function _get_visible_items() {
		var bounds = _get_bounds();
		return items.slice(bounds[0], bounds[1]);
	};

	var _get_visible_positions = function _get_visible_positions() {
		var bounds = _get_bounds();
		return positions.slice(bounds[0], bounds[1]);
	};

	//drawing:
	var _draw_all_visible = function _draw_all_visible() {
		var visibleValues = _get_visible_positions().filter(_filter_drawn);
		_draw_images(visibleValues);
		_draw_texts(visibleValues);
		_set_drawn(visibleValues);
		console.log('drawn: ' + visibleValues);
	};

	var _draw_images = function _draw_images(values) {
		ctx.fillStyle = "#AA0000";
		for (var value in values) {
			// console.log('img drawn: ' + value[2]);
			_draw_img(value[0], value[1]);
		}
	};

	var _draw_texts = function _draw_texts(values) {
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "20px Arial";
		var textPadding = thumb_size * 0.5;
		for (var value in values) {
			_draw_text(value[0] + textPadding, value[1] + textPadding, value[2]);
			// console.log('text drawn: ' + value[2]);
		}
	};

	var _set_drawn = function _set_drawn(values) {
		for (var v in values) {
			drawn_positions[v[2]] = true;
		}
		// console.log('drawn_positions: ' + drawn_positions);
	};

	var _draw_img = function _draw_img(posX, posY) {
		ctx.fillRect(posX, posY, thumb_size, thumb_size);
		// var img = document.getElementById("image_id");
		// ctx.drawImage(img,10,10);
	};

	var _draw_text = function _draw_text(posX, posY, value) {
		ctx.fillText(value, posX, posY);
	};

	var _clear_canvas = function _clear_canvas() {
		var bounds = _get_bounds();
		var lowerBound = 0 < bounds[0] ? bounds[0] - 1 : 0;
		var upperBound = bounds[1] < total_count ? bounds[1] : total_count;
		var fullWidth = canvas.width;

		var clearedPositions = positions.splice(0, lowerBound).concat(positions.splice(upperBound, total_count));

		for (var pos in clearedPositions) {
			console.log('delete: ' + pos[2]);
			delete drawn_positions[pos[2]];
		}
		// ctx.fillStyle = "#ADADAD";
		ctx.clearRect(0, 0, fullWidth, positions[lowerBound][1]);
		ctx.clearRect(0, positions[upperBound[1]], fullWidth, canvas.height);
		// ctx.fillRect(0, 0, fullWidth, positions[lowerBound][1]);
		// console.log('_clear_canvas until: ' + lowerBound);
		// const offset = window.pageYOffset;
		// ctx.clearRect(marginLeft, 0, canvas.width - marginLeft, offset);
		// ctx.clearRect(0, offset + innerHeight, )
		// ctx.clearRect(0, 0, canvas.width, canvas.height);
	};

	var _filter_drawn = function _filter_drawn(item, index, array) {
		return !(item[2] in drawn_positions);
	};

	// Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds. If `immediate` is passed, trigger the function on the
	// leading edge, instead in the trailing.
	function _debounce(func, wait, immediate) {
		var _this = this,
		    _arguments = arguments;

		var timeout;
		return function () {
			var context = _this,
			    args = _arguments;
			var later = function later() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	//event handling
	window.onresize = _debounce(_update_layout, 200);
	window.onscroll = _debounce(_on_scroll, 30);

	//public
	return {
		init: function init(configuration) {
			_config(config);
		},
		add_items: function add_items(new_items) {
			_add_items(new_items);
		}
	};
}();