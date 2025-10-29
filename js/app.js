import Polygon from "/js/polygon.js";
import Color from "/js/color.js";
import Door from "/js/door.js";
import Window from "/js/window.js";
import Obsticle from "/js/obsticle.js";
import { domCreate } from "/js/dom.js";
import { scaleDim, getDoorPoints, getDoorQuadrant } from "/js/utils.js";

export default class App {
	constructor(optsArg) {
		this._opts = Object.assign({
			target: null,
			onClick: item => {},
			onClickDom: null,
			moveOutside: false,
			color: new Color(0, 0, 0),
			selColor: new Color(0, 255),
			paddingColor: "#cdcdcd",
			fontSize: 15
		}, optsArg);

		this._canvas = domCreate({
			el: "canvas"
		});
		this._config = {};
		this._ctx = this._canvas.getContext("2d");
		this._mouse = {
			x: 0,
			y: 0
		};

		document.addEventListener("mousedown", e => {
			this._mouseDown(e);
		})
		document.addEventListener("keydown", e => {
			this._keyDown(e.which || e.keyCode, e);
		});

		this._selected = null;
		this._items = [];

		this._opts.target.append(this._canvas);
		this.set();
	}

	set(configArgs) {
		this._config = Object.assign({
			dimWidth: 1, // [m]
			dimHeight: 1, // [m],
			canWidth: 100, // canvas width, height in ratio [px]
			padding: 50, // okraje
		}, configArgs);

		const ratio = this._config.dimWidth / this._config.dimHeight;
		let canWidth = this._config.canWidth;
		let width = this._config.canWidth;
		let height = Math.floor(canWidth / ratio);

		if (height > canWidth) {
			height = canWidth;
			width = Math.floor(canWidth * ratio);
			canWidth = width;
		}

		const pad2 = this._config.padding * 2;

		width += pad2;
		height += pad2;

		Object.assign(this._config, {
			ratio,
			width,
			height,
			pad2,
			dimToPx: this._config.dimWidth / canWidth,
			pxToDim: canWidth / this._config.dimWidth
		});

		this._canvas.width = width;
		this._canvas.height = height;

		this.redraw();
	}

	addRectangleType(dimWidth, dimHeight, data) {
		const scaled = scaleDim(dimWidth, dimHeight, this._config.dimWidth, this._config.dimHeight);
		Object.assign(data, {
			width: scaled.dimWidth,
			height: scaled.dimHeight
		});
		const width = Math.floor(scaled.dimWidth / this._config.dimToPx);
		const height = Math.floor(scaled.dimHeight / this._config.dimToPx);
		const polygon = new Polygon([{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, { x: 0, y: height }], data);
		polygon.move(this._config.padding, this._config.padding);
		this.add(polygon);

		return polygon;
	}

	addLLeftType(dimWidth, dimHeight, dimSideWidth, dimSideHeight, data) {
		const scaled = scaleDim(dimWidth, dimHeight, this._config.dimWidth, this._config.dimHeight);
		Object.assign(data, {
			width: scaled.dimWidth,
			height: scaled.dimHeight
		});
		const width = Math.floor(scaled.dimWidth / this._config.dimToPx);
		const height = Math.floor(scaled.dimHeight / this._config.dimToPx);
		const sideWidth = Math.floor(dimSideWidth / this._config.dimToPx);
		const sideHeight = Math.floor(dimSideHeight / this._config.dimToPx);
		const polygon = new Polygon([{ x: 0, y: height }, { x: width, y: height }, { x: width, y: height - sideHeight }, { x: sideWidth, y: height - sideHeight },
									{ x: sideWidth, y: 0 }, { x: 0, y: 0 }], data);
		polygon.move(this._config.padding, this._config.padding);
		this.add(polygon);

		return polygon;
	}

	addLRightType(dimWidth, dimHeight, dimSideWidth, dimSideHeight, data) {
		const scaled = scaleDim(dimWidth, dimHeight, this._config.dimWidth, this._config.dimHeight);
		Object.assign(data, {
			width: scaled.dimWidth,
			height: scaled.dimHeight
		});
		const width = Math.floor(scaled.dimWidth / this._config.dimToPx);
		const height = Math.floor(scaled.dimHeight / this._config.dimToPx);
		const sideWidth = Math.floor(dimSideWidth / this._config.dimToPx);
		const sideHeight = Math.floor(dimSideHeight / this._config.dimToPx);
		const polygon = new Polygon([{ x: 0, y: height}, { x: width, y: height}, { x: width, y: 0 }, { x: width - sideWidth, y: 0 }, { x: width - sideWidth, y: sideHeight }, { x: 0, y: sideHeight }], data);
		polygon.move(this._config.padding, this._config.padding);
		this.add(polygon);

		return polygon;
	}

	addUType(dimWidth, dimHeight, dimSideLeftWidth, dimSideRightWidth, dimSideHeight, data) {
		const scaled = scaleDim(dimWidth, dimHeight, this._config.dimWidth, this._config.dimHeight);
		Object.assign(data, {
			width: scaled.dimWidth,
			height: scaled.dimHeight
		});
		const width = Math.floor(scaled.dimWidth / this._config.dimToPx);
		const height = Math.floor(scaled.dimHeight / this._config.dimToPx);
		const sideLeftWidth = Math.floor(dimSideLeftWidth / this._config.dimToPx);
		const sideRightWidth = Math.floor(dimSideRightWidth / this._config.dimToPx);
		const sideHeight = Math.floor(dimSideHeight / this._config.dimToPx);
		const polygon = new Polygon([{ x: 0, y: height }, { x: width, y: height }, { x: width, y: 0 }, { x: width - sideRightWidth, y: 0 }, { x: width - sideRightWidth, y: sideHeight },
									{ x: sideLeftWidth, y: sideHeight }, { x: sideLeftWidth, y: 0 }, { x: 0, y: 0 }], data);
		polygon.move(this._config.padding, this._config.padding);
		this.add(polygon);

		return polygon;
	}

	addDoor(isInside, isLeft, dimSize, data) {
		const scaled = scaleDim(dimSize, dimSize, this._config.dimWidth, this._config.dimHeight);
		Object.assign(data, {
			width: scaled.dimWidth,
			height: scaled.dimHeight
		});
		const width = Math.floor(scaled.dimWidth / this._config.dimToPx);
		const points = getDoorPoints(isInside, isLeft, width);
		const quadrant = getDoorQuadrant(isInside, isLeft);
		const door = new Door(points, width, quadrant, data);
		this.add(door);
		door.moveToStart(this._config.padding, this._config.padding);
		this.redraw();

		return door;
	}

	addWindow(dimWidth, dimHeight, data) {
		const scaled = scaleDim(dimWidth, dimHeight, this._config.dimWidth, this._config.dimHeight);
		Object.assign(data, {
			width: scaled.dimWidth,
			height: scaled.dimHeight
		});
		const width = Math.floor(scaled.dimWidth / this._config.dimToPx);
		const height = Math.floor(scaled.dimHeight / this._config.dimToPx);
		const window = new Window([{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, { x: 0, y: height }], data);
		window.move(this._config.padding, this._config.padding);
		this.add(window);

		return window;
	}

	addObsticle(dimWidth, dimHeight, data) {
		const scaled = scaleDim(dimWidth, dimHeight, this._config.dimWidth, this._config.dimHeight);
		Object.assign(data, {
			width: scaled.dimWidth,
			height: scaled.dimHeight
		});
		const width = Math.floor(scaled.dimWidth / this._config.dimToPx);
		const height = Math.floor(scaled.dimHeight / this._config.dimToPx);
		const obsticle = new Obsticle([{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, { x: 0, y: height }], data);
		obsticle.move(this._config.padding, this._config.padding);
		this.add(obsticle);

		return obsticle;
	}

	add(item) {
		this._items.push({
			item,
			zIndex: -1
		});

		this.redraw();
	}

	remove(item) {
		for (let ind = 0, max = this._items.length; ind < max; ind++) {
			if (this._items[ind].item == item) {
				this._items.splice(ind, 1);
				this.redraw();
				break;
			}
		}
	}

	clear() {
		this._items.length = 0;

		this.redraw();
	}

	rotate(item, angle) {
		item.rotate(angle, this._config.padding, this._config.padding, this._config.width - this._config.pad2, this._config.height - this._config.pad2);

		if (item.export.type == "Polygon") {
			item.move(this._config.padding, this._config.padding);
		}
	}

	export() {
		return {
			config: this._config,
			items: this._items.map(item => item.item.export)
		};
	}

	getBlob(scale = 1) {
		return new Promise(resolve => {
			const newCanvas = document.createElement("canvas");
			const ctx = newCanvas.getContext("2d");

			newCanvas.width = this._canvas.width * scale;
			newCanvas.height = this._canvas.height * scale;

			ctx.drawImage(this._canvas, 0, 0, this._canvas.width, this._canvas.height, 0, 0, newCanvas.width, newCanvas.height);
			newCanvas.toBlob(resolve);
		});
	}

	// pole items
	import(strValue) {
		try {
			this._items.length = 0;
			this.redraw();

			const data = typeof strValue === "string" ? JSON.parse(strValue) : strValue;

			this.set(data.config);
			data.items.forEach(item => {
				let newItem = null;

				switch (item.type) {
					case "Polygon":
						newItem = new Polygon(item.points, item.data);
						break;
					case "Door":
						newItem = new Door(item.points, item.width, item.quadrant, item.data);
						break;
					case "Obsticle":
						newItem = new Obsticle(item.points, item.data);
						break;
					case "Window":
						newItem = new Window(item.points, item.data);
						break;
				}

				if (newItem) {
					this.add(newItem);
				}
			});
		} catch (ex) {
			console.error(ex);
		}
	}

	getSize(item) {
		return item.getSize(this._config.pxToDim);
	}

	handleEvent(e) {
		switch (e.type) {
			case "mousemove":
				this._mouseMove(e);
				break;
			case "mouseup":
				this._mouseUp(e);
				break;
		}
	}

	_clear() {
		this._ctx.clearRect(0, 0, this._config.width, this._config.height);
		this._ctx.fillStyle = this._opts.paddingColor;
		this._ctx.fillRect(0, 0, this._config.width, this._config.height);
		this._ctx.fillStyle = "#fff";
		this._ctx.fillRect(this._config.padding, this._config.padding, this._config.width - 2 * this._config.padding, this._config.height - 2 * this._config.padding);
	}

	_drawMeassureLines() {
		const pad = this._config.padding;

		// obvodova mrizka
		this._ctx.fillStyle = "#666";

		this._ctx.fillRect(pad - 2, pad - 2, this._config.width - this._config.pad2 + 2, 1);
		this._ctx.fillRect(pad - 2, this._config.height - pad + 1, this._config.width - this._config.pad2 + 2, 1);

		this._ctx.fillRect(pad - 2, pad - 2, 1, this._config.height - this._config.pad2 + 2);
		this._ctx.fillRect(this._config.width - pad + 1, pad - 2, 1, this._config.height - this._config.pad2 + 3);

		// cislovani a mriznky
		const oneMeter = Math.floor(1 / this._config.dimToPx);
		const halfMeter = Math.floor(oneMeter / 2);
		let x = pad;
		let y = pad;
		let x2 = pad + halfMeter;
		let y2 = pad + halfMeter;
		const padHalf = Math.floor(pad / 2);
		this._ctx.textAlign = "center";
		this._ctx.textBaseline = "alphabetic";
		this._ctx.font = `${this._opts.fontSize}px Arial`;

		for (let ind = 0, max = this._config.dimWidth >>> 0; ind <= max; ind++) {
			const yStart1 = this._config.height - pad;
			const yStart2 = 0;

			this._ctx.fillRect(x, yStart1, 1, pad);
			this._ctx.fillRect(x, 0, 1, pad);
			this._ctx.fillText(ind, x + pad / 5, yStart1 + this._opts.fontSize);
			this._ctx.fillText(ind, x + pad / 5, yStart2 + this._opts.fontSize);
			x += oneMeter;

			// 0.5
			this._ctx.fillRect(x2, yStart1, 1, padHalf);
			this._ctx.fillRect(x2, padHalf, 1, padHalf);
			this._ctx.fillText(ind + 0.5, x2, this._opts.fontSize);
			this._ctx.fillText(ind + 0.5, x2, yStart1 + this._opts.fontSize);
			x2 += oneMeter;
		}

		for (let ind = 0, max = this._config.dimHeight >>> 0; ind <= max; ind++) {
			const xStart1 = 0;
			const xStart2 = this._config.width - pad;

			this._ctx.fillRect(xStart1, y, pad, 1);
			this._ctx.fillRect(xStart2, y, pad, 1);
			this._ctx.fillText(ind, xStart1 + pad / 4, y + this._opts.fontSize);
			this._ctx.fillText(ind, xStart2 + pad / 4, y + this._opts.fontSize);
			y += oneMeter;

			this._ctx.fillRect(padHalf, y2, padHalf, 1);
			this._ctx.fillRect(xStart2, y2, padHalf, 1);
			this._ctx.fillText(ind + 0.5, xStart1 + pad / 3, y2 + this._opts.fontSize);
			this._ctx.fillText(ind + 0.5, xStart2 + pad / 3, y2 + this._opts.fontSize);
			y2 += oneMeter;
		}
	}

	redraw() {
		this._clear();

		this._items.forEach((item, ind) => {
			let color = this._opts.color;

			item.zIndex = ind;

			if (item == this._selected) {
				color = this._opts.selColor;
			}

			item.item.draw(this._ctx, color);
		});

		this._drawMeassureLines();
	}

	_getIntersection(x, y) {
		let output = null;

		this._items.forEach(item => {
			let test = item.item.intersection(x, y);

			if (test && (!output || (output && item.zIndex > output.zIndex))) {
				output = item;
			}
		});

		return output;
	}

	_canMove(item, dir) {
		let diffX = dir.x || 0;
		let diffY = dir.y || 0;

		return item.moveTest(diffX, diffY, this._config.padding, this._config.padding, this._config.width - this._config.padding, this._config.height - this._config.padding);
	}

	_moveItem(item, dir) {
		let diffX = dir.x || 0;
		let diffY = dir.y || 0;

		item.move(diffX, diffY);
	}

	_keyDown(keyCode, e) {
		if (!this._selected) return;

		let dir = null;
		let moveFactor = e.shiftKey ? 10 : 1;

		switch (keyCode) {
			case 38:
			case 87:
				// up
				dir = { x: 0, y: -moveFactor };
				break;

			case 40:
			case 83:
				// down
				dir = { x: 0, y: moveFactor };
				break;

			case 37:
			case 65:
				// left
				dir = { x: -moveFactor, y: 0 };
				break;

			case 39:
			case 68:
				// right
				dir = { x: moveFactor, y: 0 };
				break;
		}

		if (dir && (this._opts.moveOutside || this._canMove(this._selected.item, dir))) {
			this._moveItem(this._selected.item, dir);
			this.redraw();
		}
	}

	_mouseDown(e) {
		if (this._canvas != e.target) {
			return;
		}
		if (this._opts.onClickDom && this._opts.onClickDom.contains(e.target)) return;

		const bcr = this._canvas.getBoundingClientRect();

		this._mouse.x = e.clientX - bcr.x;
		this._mouse.y = e.clientY - bcr.y;

		this._selected = this._getIntersection(this._mouse.x, this._mouse.y);
		this._opts.onClick(this._selected?.item);
		this.redraw();
		document.addEventListener("mousemove", this);
		document.addEventListener("mouseup", this);
	}

	_mouseMove(e) {
		e.preventDefault();
		e.stopPropagation();

		const bcr = this._canvas.getBoundingClientRect();

		let diffX = e.clientX - bcr.x - this._mouse.x;
		let diffY = e.clientY - bcr.y - this._mouse.y;
		let dir = { x: diffX, y: diffY };

		if (this._selected && (this._opts.moveOutside || this._canMove(this._selected.item, dir))) {
			this._moveItem(this._selected.item, dir);
			this.redraw();
		}

		this._mouse.x = e.clientX - bcr.x;
		this._mouse.y = e.clientY - bcr.y;
	}

	_mouseUp(e) {
		e.preventDefault();
		e.stopPropagation();

		document.removeEventListener("mousemove", this);
		document.removeEventListener("mouseup", this);
	}
}
