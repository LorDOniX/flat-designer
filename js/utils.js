export function scaleDim(width, height, maxWidth, maxHeight) {
	let dimWidth = width;
	let dimHeight = height;

	if (width > height) {
		if (width > maxWidth) {
			dimWidth = maxWidth;
			dimHeight = maxWidth * height / width;
		}
	} else {
		if (height > maxHeight) {
			dimHeight = maxHeight;
			dimWidth = maxHeight * width / height;
		}
	}

	return {
		dimWidth,
		dimHeight
	};
}

export function getDoorPoints(isInside, isLeft, width) {
	const points = [];

	if (isInside) {
		if (isLeft) {
			points.push({ x: width, y: 0 });
			points.push({ x: 0, y: 0 });
			points.push({ x: 0, y: -width });
		} else {
			points.push({ x: 0, y: 0 });
			points.push({ x: 0, y: -width });
			points.push({ x: width, y: -width });
		}
	} else {
		if (isLeft) {
			points.push({ x: -width, y: 0 });
			points.push({ x: 0, y: 0 });
			points.push({ x: 0, y: -width });
		} else {
			points.push({ x: 0, y: width });
			points.push({ x: 0, y: 0 });
			points.push({ x: -width, y: 0 });
		}
	}

	return points;
}

export function getDoorQuadrant(isInside, isLeft) {
	if (isInside) {
		if (isLeft) {
			return 1;
		} else {
			return 2;
		}
	} else {
		if (isLeft) {
			return 4;
		} else {
			return 3;
		}
	}
}

export function downloadJsonFile(filename, data) {
	// Creating a blob object from non-blob data using the Blob constructor
	const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	// Create a new anchor element
	const a = document.createElement('a');
	a.href = url;
	a.download = filename || 'download';
	a.click();
	a.remove();
}

export function downloadJPGFile(filename, imgData) {
	// Creating a blob object from non-blob data using the Blob constructor
	const blob = new Blob([imgData], { type: 'image/png' });
	const url = URL.createObjectURL(blob);
	// Create a new anchor element
	const a = document.createElement('a');
	a.href = url;
	a.download = filename || 'download';
	a.click();
	a.remove();
}

export function getDate() {
	const date = new Date();
	return new Intl.DateTimeFormat('cs-CZ').format(date);
}
