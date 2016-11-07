"use strict";

	describe("Horizontal grid layout suite", () => {

		it("should manage added items", () => {
			const layout = new HorizGridLayout();
			layout.setWindowSize(1024, 768);
			layout.setThumbSize(200);
			expect(layout.getPositions().length).toEqual(0);
			layout.addItems([0]);
			expect(layout.getPositions().length).toEqual(1);
			layout.addItems([1,2,3]);
			expect(layout.getPositions().length).toEqual(4);

			//it should still be visible on a single page:
			let contentSize = layout.getContentSize();
			let contentWidth = contentSize[0];
			let contentHeight = contentSize[1];
			expect(contentWidth).toEqual(1024);
			expect(contentHeight).toBeLessThan(768);

			layout.addItems([4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]);

			contentSize = layout.getContentSize();
			contentWidth = contentSize[0];
			contentHeight = contentSize[1];
			expect(contentHeight).toBeGreaterThan(768);


			//reduce the thumbsize
			layout.setThumbSize(20);

			contentSize = layout.getContentSize();
			contentWidth = contentSize[0];
			contentHeight = contentSize[1];

			//which should result in a smaller contentHeight
			expect(contentHeight).toBeLessThan(768);

			//revert
			layout.setThumbSize(500);

			const positions = layout.getPositions();
			console.log(positions[0], positions[1]);
			expect(positions[0][0]).toEqual(7);

		});

		it('should layout equally with valid integer values', () => {
			const layout = new HorizGridLayout();
			layout.setWindowSize(500, 500);
			layout.setThumbSize(100);
			layout.setMargin(10);
			//row width: 4*100 + 3*10 = 430 (centered with 35 L + 35 R margins)
			layout.addItems([0,1,2,3,4,5,6,7,8,9]);

			const positions = layout.getPositions();

			console.log('positions', positions);
			for (var i = 0; i < positions.length; i++) {
				const pos = positions[i];
				expect(pos[0]).not.toBe(undefined);
				expect(pos[1]).not.toBe(undefined);
				expect(pos[2]).not.toBe(undefined);
			}
			expect(positions[0][0]).toEqual(35);
		});

		it('should filter to visible positions via scroll values', () => {
			const layout = new HorizGridLayout();
			layout.setWindowSize(500, 120);
			layout.setThumbSize(100);
			layout.setMargin(10);
			layout.addItems([0,1,2,3,4,5,6,7,8,9]);
			//row 35 + 100|10|100|10|100|10|100 + 35   (35+400+30+35 = 500)  4 columns
			//columns 10|100|10  = 120
			// let visibles = layout.getVisiblePositions();
			// console.log('visibles', visibles);
			// expect(visibles.length).toEqual(4);

			layout.setWindowSize(500, 121);
			expect(layout.getVisiblePositions().length).toEqual(8);

		});

	});

