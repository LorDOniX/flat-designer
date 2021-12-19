// cx origin x, cy origin y, x point x, y point y, angle 90 deg
export function rotatePoint(cx, cy, x, y, angle) {
	var radians = (Math.PI / 180) * angle,
		cos = Math.cos(radians),
		sin = Math.sin(radians),
		nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
		ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

	return {
		x:  nx,
		y: ny
	}
}

export function round(value, precision) {
	return value.toFixed(precision);
}

export function getQuadrantAngle(quadrant) {
	let start = 0;
	let end = 0;

	switch (quadrant) {
		case 1:
			start = Math.PI * 1.5;
			end = 0;
			break;
		case 2:
			start = 0;
			end = 0.5 * Math.PI;
			break;
		case 3:
			start = 0.5 * Math.PI;
			end = Math.PI;
			break;
		case 4:
			start = Math.PI;
			end = Math.PI * 1.5;
			break;
	}

	return {
		start,
		end
	};
}
