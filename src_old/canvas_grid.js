"use strict";

const canvasGrid = (function CanvasGrid() {

	//private
	let canv = document.querySelector('canvas');
	if(canv == null) {
		canv = document.createElement('canvas');
	}
	const canvas = canv;
	const ctx = canvas.getContext('2d');
	if(ctx == null) {
		throw new Error('canvas not supported');
	}

	//initial values, they will change dynamically:
	let thumb_size;
	let margin;
	let item_size;
	let config = false;
	let total_count = 0;
	let items = [];
	let columns = 3;
	let rows = 1;
	let marginLeft = 0;
	let innerWidth = 0;
	let innerHeight = 0;

	let positions = [];
	let drawn_positions = {};

	const _config = (configuration) => {
		config = configuration || false;
		margin = _getConfigValue('margin', 20);
		thumb_size = _getConfigValue('thumbSize', 200);
		item_size = thumb_size + margin;
		_update_layout();
	};

	const _add_items = (new_items) => {
		for(const i in new_items) {
			items.push(i);
		}
		total_count = items.length;
		_update_layout();
	};

	const _on_scroll = () => {
		_update_content();
	};

	function _getConfigValue(value, fallbackValue) {
		if(config) {
			if(typeof config[value] === 'function') {
				return config[value]();
			} else if (config.hasOwnProperty(value)) {
				return config[value];
			}
		} else {
			return fallbackValue;
		}
	};

	const _update_layout = () => {
		//get the inner window size:
		innerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;		
		innerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		
		//calculate the nr of columns, marginLeft and the total content height:
		columns = parseInt((innerWidth - margin) / item_size);
		marginLeft = Math.round( (innerWidth - (columns * item_size) - margin) * 0.5 );
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

	const _update_content = () => {
		_clear_canvas();
		_draw_all_visible();
	};

	const _set_canvas_size = () => {
		//go full screen:
		if(canvas.width != innerWidth) {
			canvas.width = innerWidth;
		}
		const content_height = rows * item_size + margin;
		if(canvas.height != content_height) {
			canvas.height = content_height;	
		}
	};

	const _pre_cache_positions = () => {
		//pre-calculate the X positions in the columns as those will be repeated over and over in each row
		let colXPositions = [];
		for (var c = 0; c <= columns; c++) {
			const colWidth = marginLeft + margin + (c%columns)*item_size;
			colXPositions.push(colWidth);
		}

		//pre-cache all the positions:
		positions = [];
		for (let n = 0; n <= total_count; n++) {
			const posX = colXPositions[n%columns];
			let row = parseInt(n/columns);
			const posY = margin + row * item_size;
			positions[n] = [posX, posY, n];
		}
		//reset the drawn positions:
		drawn_positions = [];
	};

	const _get_bounds = () => {
		const yOffset = window.pageYOffset;
		//the lower bound is every row that hides above the page
		const lowerBound = Math.floor(yOffset / item_size) * columns;
		//the visible bound is every row that currently displayed on the page
		const upperBound = Math.ceil( (yOffset + innerHeight) / item_size) * columns;
		return [lowerBound, upperBound];
	};

	const _get_visible_items = () => {
		const bounds = _get_bounds();
		return items.slice(bounds[0], bounds[1]);
	};

	const _get_visible_positions = () => {
		const bounds = _get_bounds();
		return positions.slice(bounds[0], bounds[1]);
	};

	//drawing:
	const _draw_all_visible = () => {
		const visibleValues = _get_visible_positions().filter(_filter_drawn);
		_draw_images(visibleValues);
		_draw_texts(visibleValues);
		_set_drawn(visibleValues);
		console.log('drawn: ' + visibleValues);
	};

	const _draw_images = (values) => {
		ctx.fillStyle = "#AA0000";
		for(const value in values) {
			// console.log('img drawn: ' + value[2]);
			_draw_img(value[0], value[1]);
		}
	};

	const _draw_texts = (values) => {
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "20px Arial";
		const textPadding = thumb_size * 0.5;
		for(const value in values) {
			_draw_text(value[0] + textPadding, value[1] + textPadding, value[2]);
			// console.log('text drawn: ' + value[2]);
		}
	}

	const _set_drawn = (values) => {
		for(const v in values) {
			drawn_positions[v[2]] = true;
		}
		// console.log('drawn_positions: ' + drawn_positions);
	};

	const _draw_img = (posX, posY) => {
		ctx.fillRect(posX, posY, thumb_size, thumb_size);
		// var img = document.getElementById("image_id");
		// ctx.drawImage(img,10,10);
	};

	const _draw_text = (posX, posY, value) => {
		ctx.fillText(value, posX, posY);
	}

	const _clear_canvas = () => {
		const bounds = _get_bounds();
		const lowerBound = (0 < bounds[0]) ? bounds[0]-1 : 0;
		const upperBound = (bounds[1] < total_count) ? bounds[1] : total_count;
		const fullWidth = canvas.width;

		const clearedPositions = positions.splice(0, lowerBound).concat(positions.splice(upperBound, total_count));
		
		for(const pos in clearedPositions) {
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

	const _filter_drawn = (item, index, array) => {
		return !(item[2] in drawn_positions);
	};

	// Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds. If `immediate` is passed, trigger the function on the
	// leading edge, instead in the trailing.
	function _debounce(func, wait, immediate) {
		var timeout;
		return () => {
			var context = this, args = arguments;
			var later = function() {
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
		init: function(configuration) {
			_config(config);
		},
		add_items: function(new_items) {
			_add_items(new_items);
		}
	}

})();