import Polygon from "/js/polygon.js";

export default class Window extends Polygon {
	constructor(points, data = {}) {
		super(points, data);
	}

	get export() {
		return {
			type: "Window",
			points: this._points,
			data: this._data
		};
	}

	moveTest() {
		return true;
	}

	_drawDiagonals() {}
	_drawId() {}
}
