import { domCreate, getDataBinds, bindEvents } from "/js/dom.js";
import { ITEMS, DOOR_TYPES, DOOR_OPENING, SIZES } from "/js/items.js";
import { getDoorPoints, getDoorQuadrant } from "/js/utils.js";
import Door from "/js/door.js";
import Color from "/js/color.js";

const CANVAS_SIZE = 50;
const HTML = `
	<div>
		<ul>
			<li data-event="click:setTab" data-tab-name="tabItems">Prvky</li>
			<li data-event="click:setTab" data-tab-name="tabDoor">Dveře</li>
			<li data-event="click:setTab" data-tab-name="tabWindow">Okno</li>
			<li data-event="click:setTab" data-tab-name="tabObsticle">Překážka</li>
			<li data-event="click:setTab" data-tab-name="tabUser">Vlastní</li>
		</ul>
	</div>
	<div data-bind="tabItems" data-tab="1">
		<div data-bind="itemsCategories"></div>
		<div data-bind="itemsList"></div>
	</div>
	<div data-bind="tabDoor" data-tab="1">
		<select data-bind="doorsTypeSelect" data-event="change:redrawPreview"></select>
		<select data-bind="doorsOpeniningSelect" data-event="change:redrawPreview"></select>
		<select data-bind="doorsSizesSelect"></select>
		<div style="text-align: center; margin: 20px 0;">
			<canvas data-bind="doorPreview" width="${CANVAS_SIZE}" height="${CANVAS_SIZE}"></canvas>
		</div>
		<div>
			<button type="button" data-event="click:addDoorBtn">Přidat dveře</button>
		</div>
	</div>
	<div data-bind="tabWindow" data-tab="1">
		<label>
			Šířka [m] <input type="text" value="1" placeholder="[m]" data-bind="inputWindowWidth" />
		</label>
		<label>
			Výška [m] <input type="text" value="0.1" placeholder="[m]" data-bind="inputWindowHeight" />
		</label>
		<div>
			<button type="button" data-event="click:addWindow">Přidat okno</button>
		</div>
	</div>
	<div data-bind="tabObsticle" data-tab="1">
		<label>
			Šířka [m] <input type="text" value="1" placeholder="[m]" data-bind="inputObsticleWidth" />
		</label>
		<label>
			Výška [m] <input type="text" value="1" placeholder="[m]" data-bind="inputObsticleHeight" />
		</label>
		<div>
			<button type="button" data-event="click:addObsticle">Přidat překážku</button>
		</div>
	</div>
	<div data-bind="tabUser" data-tab="1">
		<label>
			Šířka [m] <input type="text" value="1" placeholder="[m]" data-bind="inputUserWidth" />
		</label>
		<label>
			Výška [m] <input type="text" value="1" placeholder="[m]" data-bind="inputUserHeight" />
		</label>
		<label>
			Název <input type="text" value="" placeholder="vlastní název" data-bind="inputUserTitle" />
		</label>
		<label>
			Id <input type="text" value="U" placeholder="vlastní id" data-bind="inputUserId" />
		</label>
		<div>
			<button type="button" data-event="click:addUser">Přidat vlastní položku</button>
		</div>
	</div>`;

export default class Popup {
	constructor(app) {
		this._app = app;
		this._dom = {};
		this._onClose = () => {};
		this._container = domCreate({
			el: "div",
			class: "popup-cover",
			onclick: e => {
				if (!this._dom.popup.contains(e.target)) {
					this.close();
				}
			},
			child: {
				el: "div",
				class: "popup",
				innerHTML: HTML,
				_exported: "popup"
			}
		}, this._dom);

		document.body.append(this._container);

		this._init();
	}

	close() {
		this._container.remove();
		this._onClose();
	}

	set onClose(onClose) {
		this._onClose = onClose;
	}

	_init() {
		Object.assign(this._dom, getDataBinds());
		this._fillCategories();
		this._fillDoors();

		const addDoorBtn = () => {
			const isInside = this._dom.doorsTypeSelect.value == DOOR_TYPES[0].id;
			const isLeft = this._dom.doorsOpeniningSelect.value == DOOR_OPENING[0].id;
			const sizeId = this._dom.doorsSizesSelect.value;
			const size = SIZES.filter(item => item.id == sizeId);
			const dimSize = size.length ? size[0].dimWidth : 1;

			this._app.addDoor(isInside, isLeft, dimSize, {
				title: "Dveře",
				id: "D"
			});
			this.close();
		};

		const addWindow = () => {
			const width = parseFloat(this._dom.inputWindowWidth.value) || 0;
			const height = parseFloat(this._dom.inputWindowHeight.value) || 0;

			this._app.addWindow(width, height, {
				title: "Okno",
				id: "W"
			});
			this.close();
		};

		const addObsticle = () => {
			const width = parseFloat(this._dom.inputObsticleWidth.value) || 0;
			const height = parseFloat(this._dom.inputObsticleHeight.value) || 0;

			this._app.addObsticle(width, height, {
				title: "Překážka",
				id: "O"
			});
			this.close();
		};

		const addUser = () => {
			const width = parseFloat(this._dom.inputUserWidth.value) || 0;
			const height = parseFloat(this._dom.inputUserHeight.value) || 0;
			const title = this._dom.inputUserTitle.value.trim() || "title";
			const id = this._dom.inputUserId.value.trim() || "id";

			this._app.addRectangleType(width, height, {
				id,
				title,
			});
			this.close();
		};

		const setTab = e => {
			this._setTab(e.target.getAttribute("data-tab-name"));
		};

		const redrawPreview = () => {
			this._drawDoorPreview();
		};

		bindEvents({
			addDoorBtn,
			addWindow,
			addObsticle,
			addUser,
			setTab,
			redrawPreview
		});

		this._setTab("tabItems");
		this._drawDoorPreview();
	}

	_addItem(id) {
		const itemsData = ITEMS.filter(item => item.id == id);
		const item = itemsData[0];

		if (item.type == "LRight") {
			this._app.addLRightType(item.dimWidth, item.dimHeight, item.dimSideWidth, item.dimSideHeight, {
				id: item.id,
				title: item.title
			});
		} else {
			this._app.addRectangleType(item.dimWidth, item.dimHeight, {
				id: item.id,
				title: item.title
			});
		}
	}

	_fillItems(items) {
		this._dom.itemsList.innerHTML = "";
		this._dom.itemsList.append(domCreate({
			el: "ul",
			class: "category-list",
			child: items.map(catItem => {
				return {
					el: "li",
					onclick: () => {
						this._addItem(catItem.id);
						this.close();
					},
					textContent: `${catItem.title} (${catItem.dimWidth}m x ${catItem.dimHeight}m)`
				}
			})
		}));
	}

	_fillCategories() {
		const categories = {};
		ITEMS.forEach(item => {
			if (!categories[item.place]) {
				categories[item.place] = [];
			}
			categories[item.place].push(item);
		});

		const exported = {};

		this._dom.itemsCategories.append(domCreate({
			el: "ul",
			class: "categories-list",
			child: Object.keys(categories).map((categoryName, ind) => {
				return {
					el: "li",
					class: ind === 0 ? "active" : "",
					onclick: () => {
						Object.keys(exported).forEach(expName => {
							exported[expName].classList.remove("active");
							exported[categoryName].classList.add("active");

							this._fillItems(categories[categoryName]);
						});
					},
					textContent: categoryName,
					_exported: categoryName
				}
			})
		}, exported));

		const firstCategory = categories[Object.keys(categories)[0]];

		this._fillItems(firstCategory);
	}

	_fillDoors() {
		DOOR_TYPES.forEach(item => {
			const option = domCreate({
				el: "option",
				value: item.id,
				textContent: `${item.title}`
			});
			this._dom.doorsTypeSelect.append(option);
		});

		DOOR_OPENING.forEach(item => {
			const option = domCreate({
				el: "option",
				value: item.id,
				textContent: `${item.title}`
			});
			this._dom.doorsOpeniningSelect.append(option);
		});

		SIZES.forEach(item => {
			const option = domCreate({
				el: "option",
				value: item.id,
				textContent: `${item.title}`
			});
			this._dom.doorsSizesSelect.append(option);
		});
	}

	_setTab(name) {
		Array.from(document.querySelectorAll("*[data-tab='1']")).forEach(el => {
			el.classList.add("hide");
		});
		Array.from(document.querySelectorAll("*[data-tab-name]")).forEach(el => {
			el.classList.remove("active");
		});
		this._dom[name].classList.remove("hide");
		document.querySelector(`[data-tab-name='${name}']`).classList.add("active");
	}

	_drawDoorPreview() {
		const ctx = this._dom.doorPreview.getContext("2d");
		const isInside = this._dom.doorsTypeSelect.value == DOOR_TYPES[0].id;
		const isLeft = this._dom.doorsOpeniningSelect.value == DOOR_OPENING[0].id;
		const points = getDoorPoints(isInside, isLeft, CANVAS_SIZE);
		const quadrant = getDoorQuadrant(isInside, isLeft);
		const door = new Door(points, CANVAS_SIZE, quadrant, { id: "D" });
		door.moveToStart(0, 0);
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
		door.draw(ctx, new Color(0, 0, 0));
	}
}
