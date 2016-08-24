"use strict";

var canvas_scroll = function canvas_scroll() {

	var items = [];
	var total_count = 50;

	var add_items = function add_items(new_items) {
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = new_items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				i = _step.value;

				items.append(new_items);
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		total_count = items.length;
	};

	this.init = function (configuration) {

		function _getConfigValue(value, fallbackValue) {
			if (config && typeof config[value] === 'function') {
				return config[value]();
			} else {
				return fallbackValue;
			}
		};

		var config = configuration || false;
		var thumb_size = _getConfigValue('thumbSize', 200);
		var margin = _getConfigValue('margin', 20);
		var item_size = thumb_size + margin;
		var canvas = document.querySelector('canvas');
		var ctx = canvas.getContext('2d');

		//initial values, they will change dynamically:
		var columns = 3;
		var rows = 1;
		var marginLeft = 0;
		var innerWidth = 0;
		var innerHeight = 0;

		var lowerBound = 0;
		var upperBound = 0;

		var positions = [];
		var drawn_positions = {};

		var on_scroll = function on_scroll() {
			set_bounds();
			update_content();
		};

		var set_bounds = function set_bounds() {
			var yOffset = window.pageYOffset;
			// console.log('yOffset', yOffset, 'columns', columns);
			//the lower bound is every row that hides above the page
			lowerBound = Math.floor(yOffset / item_size) * columns;
			//the visible bound is every row that currently displayed on the page
			// const visibleRowsCount = Math.ceil(innerHeight / item_size);
			//the bottom edge of the screen
			upperBound = Math.ceil((yOffset + innerHeight) / item_size) * columns;
			// upperBound = Math.min(lowerBound + visibleRowsCount * columns, total_count);

			// console.log('lowerBound', lowerBound, 'upperBound', upperBound);
		};

		var update_layout = function update_layout() {
			//get the inner window size:
			innerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			innerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

			//calculate the nr of columns, marginLeft and the total content height:
			columns = parseInt((innerWidth - margin) / item_size);
			marginLeft = Math.round((innerWidth - columns * item_size - margin) * 0.5);
			var rowModulus = total_count % columns;
			var rCount = total_count / columns;
			if (rowModulus == 0) {
				rows = rCount;
			} else {
				rows = Math.ceil(rCount);
			}

			//update canvas to be full-screen
			if (canvas.width != innerWidth) {
				canvas.width = innerWidth;
			}
			var content_height = rows * item_size + margin;
			if (canvas.height != content_height) {
				canvas.height = content_height;
			}

			set_bounds();
			pre_cache_positions();
			update_content();
		};

		var pre_cache_positions = function pre_cache_positions() {
			//pre-calculate the X positions in the columns as those will be repeated over and over in each row
			var colXPositions = [];
			for (var c = 0; c <= columns; c++) {
				var colWidth = marginLeft + margin + c % columns * item_size;
				colXPositions.push(colWidth);
			}

			//pre-cache all the positions:
			positions = [];
			for (var n = 0; n < total_count; n++) {
				// for (var n = total_count - 1; n >= 0; n--) {
				var posX = colXPositions[n % columns];
				var row = parseInt(n / columns);
				var posY = margin + row * item_size;
				positions[n] = [posX, posY, n];
			}
			//reset the drawn positions:
			drawn_positions = [];
		};

		var update_content = function update_content() {
			clear_canvas();
			draw_all_visible();
		};

		var draw_images = function draw_images(values) {
			ctx.fillStyle = "#AA0000";
			var toBeDrawns = values.filter(_filter_drawn);
			toBeDrawns.forEach(function (value) {
				draw_img(value[0], value[1]);
			});
		};

		var draw_texts = function draw_texts(values) {
			ctx.fillStyle = "#FFFFFF";
			ctx.font = "20px Arial";
			var textPadding = thumb_size * 0.5;
			var toBeDrawns = values.filter(_filter_drawn);
			toBeDrawns.forEach(function (value) {
				draw_text(value[0] + textPadding, value[1] + textPadding, value[2]);
				console.log('text drawn: ' + value[2]);
			});
		};

		var draw_img = function draw_img(posX, posY) {
			ctx.fillRect(posX, posY, thumb_size, thumb_size);
			// var img = document.getElementById("image_id");
			// ctx.drawImage(img,10,10);
		};

		var draw_text = function draw_text(posX, posY, value) {
			ctx.fillText(value, posX, posY);
		};

		var clear_canvas = function clear_canvas() {
			// const offset = window.pageYOffset;
			// ctx.clearRect(marginLeft, 0, canvas.width - marginLeft, offset);
			// ctx.clearRect(0, offset + innerHeight, )
			// ctx.clearRect(0, 0, canvas.width, canvas.height);
		};

		var draw_all_visible = function draw_all_visible() {
			var visibleValues = positions.slice(lowerBound, upperBound);
			draw_images(visibleValues);
			draw_texts(visibleValues);
			_set_drawn(visibleValues);
			// console.log('drawn: ' + lowerBound + '-' + upperBound);
		};

		var _set_drawn = function _set_drawn(values) {
			values.forEach(function (v) {
				drawn_positions[v[2]] = true;
			});
		};

		var _filter_drawn = function _filter_drawn(item, index, array) {
			return !(item[2] in drawn_positions);
		};

		// Returns a function, that, as long as it continues to be invoked, will not
		// be triggered. The function will be called after it stops being called for
		// N milliseconds. If `immediate` is passed, trigger the function on the
		// leading edge, instead of the trailing.
		function debounce(func, wait, immediate) {
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
		window.onresize = debounce(update_layout, 200);
		window.onscroll = debounce(on_scroll, 30);

		//init
		update_layout();
	};
};