( () => {

	const thumb_size = 100;
	const margin = 20;
	let columns = 3; //initial value, it will change dynamically


	const canvas = document.querySelector('canvas');
	const ctx = canvas.getContext('2d');


	const update_canvas_size = () => {
		const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		canvas.width = w;
		canvas.height = h;
		columns = parseInt((canvas.width - margin) / (thumb_size + margin));
		clear_canvas();
		draw_all();
	};
	
	window.onresize = () => {
		update_canvas_size();
		console.log('columns: ' + columns);
	};

	const draw_img = (posX, posY) => {
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(posX, posY, thumb_size, thumb_size);
	};

	const get_position = (n) => {
		const posX = margin + (n%columns)*(thumb_size + margin);
		let row = parseInt(n/columns);	
		const posY = margin + row * (thumb_size + margin);
		console.log(n, columns, row, posX, posY);
		return [posX, posY];
	}

	const clear_canvas = () => {
		ctx.clearRect( 0, 0, canvas.width, canvas.height);
	}
	
	const draw_all = () => {
		for (var i = 50; i >= 0; i--) {
			const pos = get_position(i);
			draw_img(pos[0], pos[1]);
		}
	}


	update_canvas_size();
	

})();