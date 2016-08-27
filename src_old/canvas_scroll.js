"use strict";

const canvas_scroll = function() {

	let items = [];
	let total_count = 0;
	let config = false;
	let thumb_size = _getConfigValue('thumbSize', 200);

	function _getConfigValue(value, fallbackValue) {
		if(config && typeof config[value] === 'function') {
			return config[value]();
		} else {
			return fallbackValue;
		}
	};

	this.add_items = (new_items) => {
		for (let i of new_items) {
			items.push(i);
		}
		total_count = items.length;
	}

	this.init = (configuration) => {

		config = configuration || false;
		
		const margin = _getConfigValue('margin', 20);
		const item_size = thumb_size + margin;
		const canvas = document.querySelector('canvas');
		const ctx = canvas.getContext('2d');

		//initial values, they will change dynamically:
		let columns = 3;
		let rows = 1;
		let marginLeft = 0;
		let innerWidth = 0;
		let innerHeight = 0;

		let lowerBound = 0;
		let upperBound = 0;

		let positions = [];
		let drawn_positions = {};

		const on_scroll = () => {
			set_bounds();
			update_content();
		};

		const set_bounds = () => {
			const yOffset = window.pageYOffset;
			//the lower bound is every row that hides above the page
			lowerBound = Math.floor(yOffset / item_size) * columns;
			//the visible bound is every row that currently displayed on the page
			upperBound = Math.ceil( (yOffset + innerHeight) / item_size) * columns;
		};

		const update_layout = () => {
			//get the inner window size:
			innerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;		
			innerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
			
			//calculate the nr of columns, marginLeft and the total content height:
			columns = parseInt((innerWidth - margin) / item_size);
			marginLeft = Math.round( (innerWidth - (columns * item_size) - margin) * 0.5 );
			const rowModulus = total_count % columns;
			const rCount = total_count / columns;
			if(rowModulus == 0) {
				rows = rCount;
			} else {
				rows = Math.ceil(rCount);
			}

			//update canvas to be full-screen
			if(canvas.width != innerWidth) {
				canvas.width = innerWidth;
			}
			const content_height = rows * item_size + margin;
			if(canvas.height != content_height) {
				canvas.height = content_height;	
			}

			set_bounds();
			pre_cache_positions();
			update_content();
		};


		const pre_cache_positions = () => {
			//pre-calculate the X positions in the columns as those will be repeated over and over in each row
			let colXPositions = [];
			for (var c = 0; c <= columns; c++) {
				const colWidth = marginLeft + margin + (c%columns)*item_size;
				colXPositions.push(colWidth);
			}

			//pre-cache all the positions:
			positions = [];
			for (var n = 0; n < total_count; n++) {
			// for (var n = total_count - 1; n >= 0; n--) {
				const posX = colXPositions[n%columns];
				let row = parseInt(n/columns);
				const posY = margin + row * item_size;
				positions[n] = [posX, posY, n];
			}
			//reset the drawn positions:
			drawn_positions = [];
		}

		const update_content = () => {
			clear_canvas();
			draw_all_visible();
		};

		const draw_images = (values) => {
			ctx.fillStyle = "#AA0000";
			const toBeDrawns = values.filter(_filter_drawn);
			toBeDrawns.forEach((value) => {
				draw_img(value[0], value[1]);
			});
		};

		const draw_texts = (values) => {
			ctx.fillStyle = "#FFFFFF";
			ctx.font = "20px Arial";
			const textPadding = thumb_size * 0.5;
			const toBeDrawns = values.filter(_filter_drawn);
			toBeDrawns.forEach((value) => {
				draw_text(value[0] + textPadding, value[1] + textPadding, value[2]);
				console.log('text drawn: ' + value[2]);
			});
		}

		const draw_img = (posX, posY) => {
			ctx.fillRect(posX, posY, thumb_size, thumb_size);
			// var img = document.getElementById("image_id");
			// ctx.drawImage(img,10,10);
		};

		const draw_text = (posX, posY, value) => {
			ctx.fillText(value, posX, posY);
		}

		const clear_canvas = () => {
			// const offset = window.pageYOffset;
			// ctx.clearRect(marginLeft, 0, canvas.width - marginLeft, offset);
			// ctx.clearRect(0, offset + innerHeight, )
			// ctx.clearRect(0, 0, canvas.width, canvas.height);
		};
		
		const draw_all_visible = () => {
			const visibleValues = positions.slice(lowerBound, upperBound);
			_draw_images(visibleValues);
			_draw_texts(visibleValues);
			_set_drawn(visibleValues);
			// console.log('drawn: ' + lowerBound + '-' + upperBound);
		};

		const _set_drawn = (values) => {
			values.forEach((v) => {
				drawn_positions[v[2]] = true;
			});
		};

		const _filter_drawn = (item, index, array) => {
			return !(item[2] in drawn_positions);
		};

		// Returns a function, that, as long as it continues to be invoked, will not
		// be triggered. The function will be called after it stops being called for
		// N milliseconds. If `immediate` is passed, trigger the function on the
		// leading edge, instead of the trailing.
		function debounce(func, wait, immediate) {
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
		window.onresize = debounce(update_layout, 200);
		window.onscroll = debounce(on_scroll, 30);

		//init
		update_layout();
		
	};

};

