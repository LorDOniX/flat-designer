import Entity from "/js/entity.js";
import { rotatePoint, round } from "/js/math.js";

export default class Polygon extends Entity {
	constructor(points, data = {}) {
		super(data);

		this._points = null;
		this._pointsData = null;
		this._fontSize = 15;

		this._setPoints(points);
	}

	get data() {
		return this._data;
	}

	get export() {
		return {
			type: "Polygon",
			points: this._points,
			data: this._data
		};
	}

	getSize(pxToSize = 1) {
		return {
			width: round((this._pointsData.max[0] - this._pointsData.min[0]) / pxToSize, 2),
			height: round((this._pointsData.max[1] - this._pointsData.min[1]) / pxToSize, 2)
		};
	}

	draw(ctx, color, cycle = true) {
		if (this._points.length == 1) {
			this._putPixel(ctx, color, this._points[0].x, this._points[0].y);
		} else {
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.strokeStyle = color.getRGBA();
			ctx.lineCap = "square";
			ctx.textAlign = "start";
			ctx.textBaseline = 'top';
			ctx.font = `${this._fontSize}px Arial`;

			let len = this._points.length;

			for (let i = 0; i < len; i++) {
				let start = i;
				let end = i + 1 < len ? i + 1 : 0;

				if (i + 1 >= len && !cycle) break;

				ctx.moveTo(this._points[start].x, this._points[start].y);
				ctx.lineTo(this._points[end].x, this._points[end].y);
			}

			ctx.stroke();

			if (len == 4) {
				this._drawDiagonals(ctx);
			}

			this._drawId(ctx, color);
		}
	}

	_drawDiagonals(ctx) {
		// uhlopricka 1
		ctx.beginPath();
		ctx.moveTo(this._pointsData.min[0], this._pointsData.min[1]);
		ctx.lineTo(this._pointsData.max[0], this._pointsData.max[1]);
		ctx.stroke();
		// uhlopricka 2
		ctx.beginPath();
		ctx.moveTo(this._pointsData.min[0], this._pointsData.max[1]);
		ctx.lineTo(this._pointsData.max[0], this._pointsData.min[1]);
		ctx.stroke();
	}

	_drawId(ctx, color) {
		// vykreslime ID
		const width = ctx.measureText(this._data.id).width;
		ctx.fillStyle = "#fff";
		const textX = this._pointsData.middle[0] - width / 2;
		ctx.fillRect(textX, this._pointsData.middle[1] - this._fontSize, width, this._fontSize * 2);
		ctx.fillStyle = color.getRGBA();
		ctx.fillText(this._data.id, textX, this._pointsData.middle[1] - this._fontSize / 2);
	}

	intersection(x, y) {
		let vertLen = this._points.length;
		let test = false;

		for (let i = 0, j = vertLen - 1; i < vertLen; j = i++) {
			if (
				((this._points[i].y > y) != (this._points[j].y > y)) &&
				(x < (this._points[j].x - this._points[i].x) * (y - this._points[i].y) / (this._points[j].y - this._points[i].y) + this._points[i].x)) {
				test = !test;
			}
		}

		return test;
	}

	moveTest(diffX, diffY, minX, minY, maxX, maxY) {
		let test = true;

		this._points.every(point => {
			let x = point.x + diffX;
			let y = point.y + diffY;

			if (x < minX || y < minY || x > maxX || y > maxY) {
				test = false;
				return false;
			} else {
				return true;
			}
		});

		return test;
	}

	move(diffX, diffY) {
		this._setPoints(this._points.map(point => {
			return {
				x: point.x + diffX,
				y: point.y + diffY,
			}
		}));
	}

	rotate(angle, minX, minY, maxX, maxY) {
		const middle = this._pointsData.middle;

		this._setPoints(this._points.map(point => {
			return rotatePoint(middle[0], middle[1], point.x, point.y, angle);
		}));

		// test, jestli jsme cajk
		let diffX = 0;
		let diffY = 0;

		if (this._pointsData.min[0] < minX) {
			diffX = -this._pointsData.min[0];
		} else if (this._pointsData.max[0] > maxX) {
			diffX = -this._pointsData.max[0] + maxX;
		}
		if (this._pointsData.min[1] < minY) {
			diffY = -this._pointsData.min[1];
		} else if (this._pointsData.max[1] > maxY) {
			diffY = -this._pointsData.max[1] + maxY;
		}

		if (diffX != 0 || diffY != 0) {
			this.move(diffX, diffY);
		}
	}

	_putPixel(ctx, color, x, y) {
		ctx.putImageData(color.getPixel(ctx), x, y);
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
			middle: [min[0] + (max[0] - min[0]) / 2, min[1] + (max[1] - min[1]) / 2]
		};
	}
}
