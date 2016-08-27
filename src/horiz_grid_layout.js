'use strict';

function HorizGridLayout() {
	
	//private
	let thumb_size = 200;
	let margin = 10;
	let innerWidth = 0;
	let innerHeight = 0;
	let items = [];
	let columns = 3;
	let rows = 1;
	let marginLeft = 0;
	let positions = [];
	let drawn_positions = {};
	let content_width = 0;
	let content_height = 0;
	let yOffset = 0;

	const _add_items = (new_items) => {
		const new_items_length = new_items.length;
		for (let i = 0; i < new_items_length; i++) {
			items.push(new_items[i]);
		}
	};

	const _setThumbSize = (value) => {
		thumb_size = value;
	};

	const _setMargin = (value) => {
		margin = value;
	};

	const _setWindowSize = (width, height) => {
		//set the inner window size:
		innerWidth = width;
		innerHeight = height;
	};

	const _re_calculate = () => {
		const total_count = items.length;
		const item_size = thumb_size + margin;
		//calculate the nr of columns, marginLeft and the total content height:
		columns = Math.round((innerWidth - margin) / item_size);
		marginLeft = Math.round( (innerWidth - (columns * item_size) - margin) * 0.5 );

		rows = Math.ceil(total_count / columns);
		console.log('rows', rows, 'total_count', total_count, 'columns', columns);
		content_width = innerWidth;
		content_height = rows * item_size + margin;
		_calc_positions();
	};

	const _calc_positions = () => {
		const item_size = thumb_size + margin;
		//pre-calculate the X positions in the columns as those will be repeated over and over in each row
		let colXPositions = [];
		for (let c = 0; c < columns; c++) {
			const colWidth = marginLeft + margin + (c%columns)*item_size;
			colXPositions.push(colWidth);
		}
		console.log('colXPositions', colXPositions);

		//pre-cache all the positions:
		positions = [];
		const total_count = items.length;
		for (let n = 0; n < total_count; n++) {
			const posX = colXPositions[n%columns];
			// console.log('posX', posX, 'n', n, 'columns', columns);
			let row = Math.round(n/columns);
			const posY = margin + row * item_size;
			positions.push([posX, posY, n]);
		}
		//reset the drawn positions:
		drawn_positions = [];
	};

	const _getPositions = () => {
		_re_calculate();
		return positions;
	};

	const _getContentSize = () => {
		_re_calculate();
		return [content_width, content_height];
	};

	const _scrollTo = (yPos) => {
		yOffset = yPos;
	};

	const _getVisiblePositions = () => {
		_re_calculate();
		const bounds = _get_bounds();
		console.log('visible bounds: ', bounds);
		return positions.slice(bounds[0], bounds[1]);
	};

	const _get_bounds = () => {
		const item_size = thumb_size + margin;
		//the lower bound is every row that hides above the page
		const lowerBound = Math.floor(yOffset / item_size) * columns;
		//the visible bound is every row that currently displayed on the page
		const upperBound = Math.ceil( (yOffset + innerHeight) / item_size) * columns;
		console.log('_get_bounds innerHeight', innerHeight);
		return [lowerBound, upperBound];
	};


	//public
	return function() {
		return {
			setWindowSize: function(width, height) {
				_setWindowSize(width, height);
			},
			setThumbSize: function(value) {
				_setThumbSize(value);
			},
			setMargin: function(value) {
				_setMargin(value);
			},
			addItems: function(new_items) {
				 _add_items(new_items);
			},
			getPositions: function() {
				return _getPositions();
			},
			getContentSize: function() {
				return _getContentSize();
			},
			scrollTo: function(yPos) {
				return _scrollTo(yPos);
			},
			getVisiblePositions: function() {
				return _getVisiblePositions();
			}
		}
	}();
};
