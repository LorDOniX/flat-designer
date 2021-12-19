export default class Entity {
	constructor(data = {}) {
		this._data = Object.assign({
			id: "E"
		}, data);
	}

	get data() {
		return this._data;
	}

	get export() {
		return {
			type: "Entity",
			data: this._data
		};
	}

	getSize(pxToSize = 1) {
		return {
			width: 1,
			height: 1
		};
	}

	draw(ctx, color) {
	}

	intersection(x, y) {
		return false;
	}

	moveTest(diffX, diffY, minX, minY, maxX, maxY) {
		return true;
	}

	move(diffX, diffY) {
	}

	rotate(angle, minX, minY, maxX, maxY) {
	}
}
