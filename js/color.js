export default class Color {
	constructor(r, g, b, a) {
		this._color = {
			r: r || 0,
			g: g || 0,
			b: b || 0,
			a: a || 255
		};
	}

	getPixel(ctx) {
		let imData = ctx.createImageData(1, 1);
		let d = imData.data;
		d[0] = this._color.r;
		d[1] = this._color.g;
		d[2] = this._color.b;
		d[3] = this._color.a;

		return imData;
	}

	getRGBA() {
		return (`rgba(${this._color.r}, ${this._color.g}, ${this._color.b}, ${Math.round(this._color.a / 255)})`);
	}

	toString() {
		return this.getRGBA();
	}
}
