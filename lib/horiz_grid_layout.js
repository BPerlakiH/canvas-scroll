'use strict';

function HorizGridLayout(window_width, window_height) {

	//private
	var thumb_size = 200;
	var margin = 10;
	var item_size = thumb_size + margin;
	var innerWidth = 0;
	var innerHeight = 0;
	var items = [];
	var total_count = 0;
	var columns = 3;
	var rows = 1;
	var marginLeft = 0;
	var positions = [];
	var drawn_positions = {};

	var _add_items = function _add_items(new_items) {
		for (var item in new_items) {
			items.push(item);
		}
		total_count = items.length;
		_re_calculate();
	};

	var _setThumbSize = function _setThumbSize(value) {
		thumb_size = value;
		_re_calculate();
	};

	var _setMargin = function _setMargin(value) {
		margin = value;
		_re_calculate();
	};

	var _updateWindow = function _updateWindow(width, height) {
		//set the inner window size:
		innerWidth = width;
		innerHeight = height;
		_re_calculate();
	};

	var _re_calculate = function _re_calculate() {
		//calculate the nr of columns, marginLeft and the total content height:
		columns = parseInt((innerWidth - margin) / item_size);
		marginLeft = Math.round((innerWidth - columns * item_size - margin) * 0.5);

		rows = Math.ceil(total_count / columns);
		var content_height = rows * item_size + margin;
	};

	var _getPositions = function _getPositions() {
		return [];
	};

	//kick off the calculation on construction


	//public
	return {
		// constructor: (window_width, window_height) {
		// 	_updateWindow(window_width, window_width);
		// },
		updateWindow: function updateWindow(width, height) {
			_updateWindow(width, height);
		},
		setThumbSize: function setThumbSize(value) {
			_setThumbSize(value);
		},
		setMargin: function setMargin(value) {
			_setMargin(value);
		},
		addItems: function addItems(new_items) {
			_add_items(new_items);
		},
		getPositions: function getPositions() {
			return _getPositions();
		}
	};
};