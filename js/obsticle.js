import Polygon from "/js/polygon.js";

export default class Obsticle extends Polygon {
	constructor(points, data = {}) {
		super(points, data);
	}

	get export() {
		return {
			type: "Obsticle",
			points: this._points,
			data: this._data
		};
	}

	moveTest() {
		return true;
	}

	draw(ctx, color, cycle = true) {
		super.draw(ctx, color, cycle);

		const pd = this._pointsData;
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(pd.min[0], pd.min[1], pd.max[0] - pd.min[0], pd.max[1] - pd.min[1]);
	}
}
