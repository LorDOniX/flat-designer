/**
 * Create Element from the configuration.
 *
 * @param  {Object} config
 * @param  {String} config.el Element name, default creates "div"
 * @param  {Array|Object} [config.child] Child nodes
 * @param  {String|Array} [config.class] Add CSS class/es
 * @param  {Object} [exported] to this object will be exported all marked elements (_exported attr.)
 * @return {Element}
 */
export function domCreate(config, exported) {
	let el;

	if (Array.isArray(config)) {
		el = document.createDocumentFragment();

		config.forEach(child => {
			el.appendChild(domCreate(child, exported));
		});
	} else {
		let elName = config.el || "div";

		if (elName instanceof HTMLElement) {
			el = elName;
		} else if (elName == "text") {
			el = document.createTextNode("");
		} else {
			el = document.createElement(elName);
		}

		Object.keys(config).forEach(key => {
			let value;

			switch (key) {
				case "el":
					break;

				case "child":
					value = config.child;

					if (!Array.isArray(value)) {
						value = [value];
					}

					value.forEach(child => {
						el.appendChild(domCreate(child, exported));
					});
					break;

				case "class":
					value = config.class;

					if (typeof value === "string") {
						const parts = value.split(" ");
						parts.forEach(part => {
							if (!part) return;
							el.classList.add(part);
						});
					} else if (Array.isArray(value)) {
						value.forEach(item => {
							if (!item) return;
							el.classList.add(item);
						});
					}
					break;

				case "_exported":
					exported[config._exported] = el;
					break;

				default:
					if (key.indexOf("on") == 0) {
						const event = key.replace("on", "");
						el.addEventListener(event, config[key]);
					} else {
						if (key.indexOf("data") != -1) {
							el.setAttribute(key, config[key]);
						} else {
							el[key] = config[key];
						}
					}
			}
		});
	}

	return el;
}

export function getDataBinds() {
	const dom = {};
	const allEls = Array.from(document.querySelectorAll("*[data-bind]"));
	allEls.forEach(el => {
		dom[el.getAttribute("data-bind")] = el;
	});

	return dom;
}

export function bindEvents(config) {
	const dom = {};
	const allEls = Array.from(document.querySelectorAll("*[data-event]"));
	allEls.forEach(el => {
		const parts = el.getAttribute("data-event").split(":");

		if (parts.length == 2) {
			el.addEventListener(parts[0], e => {
				if (typeof config[parts[1]] === "function") {
					config[parts[1]](e);
				}
			});
		}
	});

	return dom;
}
