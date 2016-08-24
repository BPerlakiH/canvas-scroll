( () => {

	function floor (value) {
		let x = Math.floor(value);
	};

	function ceil (value) {
		let x = Math.ceil(value);
	};

	function parser(value) {
		let x = parseInt(value);
		// console.log(value, x);
	};

	let values = [];
	for (var i = 0; i < 1000; i++) {
		values[i] = Math.random() * 10;
	}

	console.time('Math.floor');
	values.forEach((v) => {floor(v)});
	console.timeEnd('Math.floor');

	console.time('Math.ceil');
	values.forEach((v) => {ceil(v)});
	console.timeEnd('Math.ceil');

	console.time('parseInt');
	values.forEach((v) => {parser(v)});
	console.timeEnd('Math.parseInt');

	

	


})();