import Entity from "/js/entity.js";
import { getQuadrantAngle, round } from "/js/math.js";

export default class Door extends Entity {
	constructor(points, width, quadrant, data = {}) {
		super(data);

		this._width = width;
		this._points = null;
		this._pointsData = null;
		this._quadrant = quadrant;

		this._setPoints(points);
	}

	get export() {
		return {
			type: "Door",
			points: this._points,
			width: this._width,
			quadrant: this._quadrant,
			data: this._data
		};
	}

	getSize(pxToSize = 1) {
		return {
			width: round(this._width / pxToSize, 1),
			height: round(this._width / pxToSize, 1)
		};
	}

	draw(ctx, color) {
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = color.getRGBA();
		ctx.lineCap = "square";

		ctx.moveTo(this._points[0].x, this._points[0].y);
		ctx.lineTo(this._points[1].x, this._points[1].y);
		ctx.moveTo(this._points[1].x, this._points[1].y);
		ctx.lineTo(this._points[2].x, this._points[2].y);

		ctx.stroke();
		ctx.beginPath();
		const qadAngle = getQuadrantAngle(this._quadrant);
		ctx.arc(this._points[1].x, this._points[1].y, this._width, qadAngle.start, qadAngle.end);
		ctx.stroke();
	}

	move(diffX, diffY) {
		this._setPoints(this._points.map(point => {
			return {
				x: point.x + diffX,
				y: point.y + diffY,
			}
		}));
	}

	intersection(x, y) {
		const pd = this._pointsData;

		return x >= pd.min[0] && x <= pd.max[0] && y >= pd.min[1] && y <= pd.max[1];
	}

	moveToStart(diffX, diffY) {
		const newDiffX = this._pointsData.min[0] * (this._pointsData.min[0] > 0 ? 1 : -1) + diffX;
		const newDiffY = this._pointsData.min[1] * (this._pointsData.min[1] > 0 ? 1 : -1) + diffY;

		this.move(newDiffX, newDiffY);
	}

	_setPoints(points) {
		this._points = points;
		this._pointsData = this._getPointsData();
	}

	_getPointsData() {
		const min = [Infinity, Infinity];
		const max = [-Infinity, -Infinity];

		for (let ind = 0, len = this._points.length; ind < len; ind++) {
			min[0] = Math.min(min[0], this._points[ind].x);
			min[1] = Math.min(min[1], this._points[ind].y);
			max[0] = Math.max(max[0], this._points[ind].x);
			max[1] = Math.max(max[1], this._points[ind].y);
		}

		return {
			min,
			max,
		};
	}
}
