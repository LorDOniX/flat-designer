import Entity from "/js/entity.js";

export default class Circle extends Entity {
	constructor(x, y, radius, data) {
		super(data);

		this._x = x;
		this._y = y;
		this._radius = radius;
		this._data.id = "C";
	}

	get data() {
		return this._data;
	}

	draw(ctx, color) {
		ctx.beginPath();
		ctx.arc(this._x, this._y, this._radius, 0, 2 * Math.PI);
		ctx.lineWidth = 1;
		ctx.strokeStyle = color.getRGBA();
		ctx.stroke();
	}

	intersection(x, y) {
		let dx2 = Math.pow(this._x - x, 2);
		let dy2 = Math.pow(this._y - y, 2);
		let dist = Math.sqrt(dx2 + dy2);

		return (dist <= this._radius);
	}

	moveTest(diffX, diffY, minX, minY, maxX, maxY) {
		let x = this._x + diffX;
		let y = this._y + diffY;
		let r = this._radius;

		if (x - r < minX || y - r < minY || x + r > maxX || y + r > maxY) {
			test = false;
			return false;
		} else {
			return true;
		}
	}

	move(diffX, diffY) {
		this._x += diffX;
		this._y += diffY;
	}

	rotate() {}
}
