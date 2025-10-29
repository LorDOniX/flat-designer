import App from "/js/app.js";
import Popup from "/js/popup.js";
import Color from "/js/color.js";
import { domCreate, getDataBinds, bindEvents } from "/js/dom.js";
import { downloadJsonFile, getDate, downloadJPGFile } from "/js/utils.js";

/**
 * TODO:
 * okna
 * dvere
 * select pro veci
 * config pro mistnost
 * ulozeni confu
 * nacteni confu
 * naprcani confu do local storage, export do souboru?
 * https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser json jako soubor ke stažení
 */
const dom = getDataBinds();
const padding = 50;
const canWidth = 852;
const NEW_PROJECT = "new-project";
const DEFAULT_STATE = [{
	name: NEW_PROJECT,
	date: getDate(),
	list: []
}];
let selAppItem = null;
let selProject = "";
let popup = null;
let projectsData = null;
let serverProjects = [];

function showSelected(contEl, item, app) {
	contEl.innerHTML = "";

	if (item) {
		const size = app.getSize(item);

		contEl.append(domCreate([{
			el: "p",
			innerHTML: `Rozměry: šířka <strong>${size.width * 100 >>> 0} cm</strong>, <strong>výška ${size.height * 100 >>> 0} cm</strong>`
		}, {
			el: "p",
			innerHTML: `Název: <strong>${item.data.title}</strong>`
		}, {
			el: "button",
			type: "button",
			textContent: "Smazat",
			onclick: e => deleteCb(),
		}, {
			el: "button",
			type: "button",
			textContent: "Otočit",
			onclick: e => rotateCb(),
		}]));
	}
}

function deleteCb() {
	if (!selAppItem) {
		return;
	}

	app.remove(selAppItem);
	app.redraw();
	dom.infoEl.innerHTML = "";
}

function rotateCb() {
	if (!selAppItem) {
		return;
	}

	app.rotate(selAppItem, 90);
	app.redraw();
	showSelected(dom.infoEl, selAppItem, app);
}

const app = new App({
	target: dom.canvasPlaceholder,
	moveOutside: 0,
	onClick: item => {
		selAppItem = item;
		showSelected(dom.infoEl, item, app);
	},
	selColor: new Color(255, 0, 0),
	onClickDom: dom.infoEl
});

function bindKeys() {
	document.addEventListener("keydown", e => {
		if (["input"].indexOf(e.target.nodeName.toLowerCase()) != -1) {
			return;
		}

		switch (e.which) {
			case 27:
				if (popup) {
					popup.close();
				}
			case 46:
			case 68:
				deleteCb();
				break;
			case 82:
				rotateCb();
				break;
		}
	})
}

function setBtn() {
	const width = parseFloat(dom.inputWidth.value) || 0;
	const height = parseFloat(dom.inputHeight.value) || 0;

	app.set({
		canWidth: canWidth - padding * 2,
		dimWidth: width,
		dimHeight: height,
		padding,
	});
}

function userClean() {
	app.clear();
}

function userAdd() {
	popup = new Popup(app);
	popup.onClose = () => {
		popup = null
	};
}

function saveList() {
	const name = dom.listName.value.trim() || "default";
	const filtered = selProject.list.filter(item => item.name == name);
	// update
	if (filtered.length == 1) {
		filtered[0].data = app.export();
	} else {
		// insert
		selProject.list.push({
			name,
			data: app.export()
		});
		fillLists();
		// nastavime
		dom.projectList.value = name;
	}

	saveLsData();
}

function loadListName(name) {
	const filtered = selProject.list.filter(item => item.name == name);

	if (filtered.length == 1) {
		const appData = filtered[0].data;

		dom.inputWidth.value = appData.config.dimWidth;
		dom.inputHeight.value = appData.config.dimHeight;
		dom.listName.value = name;

		app.import(appData);
	}
}

function loadList() {
	const name = dom.projectList.value;

	loadListName(name);
}

function saveLsData() {
	localStorage.setItem("flatData", JSON.stringify(projectsData));
}

function getLsData() {
	try {
		return JSON.parse(localStorage.getItem("flatData")) || DEFAULT_STATE;
	} catch (ex) {
		return DEFAULT_STATE;
	}
}

function fillProjects() {
	dom.projectsList.innerHTML = "";
	projectsData.sort((aItem, bItem) => aItem.name.localeCompare(bItem.name)).forEach(item => {
		const option = domCreate({
			el: "option",
			value: item.name,
			textContent: item.name
		});
		dom.projectsList.append(option);
	});
}

function fillLists() {
	dom.projectList.innerHTML = "";
	selProject.list.sort((aItem, bItem) => aItem.name.localeCompare(bItem.name)).forEach(item => {
		const option = domCreate({
			el: "option",
			value: item.name,
			textContent: item.name,
		});
		dom.projectList.append(option);
	});
}

function setProjectsData(data) {
	projectsData = data;
	saveLsData();
	fillProjects();
	setProject();
}

function loadJSON() {
	if (dom.jsonFile.files.length) {
		const fr = new FileReader();
		fr.addEventListener("load", e => {
			setProjectsData(JSON.parse(fr.result));
		});
		fr.readAsText(dom.jsonFile.files[0]);
	}
}

function clearMemory() {
	if (confirm("Opravdu smazat všechno z paměti?")) {
		setProjectsData(DEFAULT_STATE);
	}
}

function setProjectName(name) {
	const filtered = projectsData.filter(item => item.name == name);
	selProject = filtered.length ? filtered[0] : projectsData[0];
	dom.projectsList.value = selProject.name;
}

function addProject() {
	const name = dom.inputProject.value.trim();
	const filtered = projectsData.filter(item => item.name == name);

	if (!filtered.length) {
		setProjectsData([...projectsData, {
			name,
			date: getDate(),
			list: []
		}]);
	}
}

function projectChange() {
	const name = dom.projectsList.value;

	setProject(name);
}

function removeList() {
	const name = dom.listName.value.trim() || "default";

	for (let ind = 0, max = selProject.list.length; ind < max; ind++) {
		const item = selProject.list[ind];

		if (item.name == name) {
			selProject.list.splice(ind, 1);
			break;
		}
	}

	saveLsData();
	fillLists();
}

function setProject(name) {
	setProjectName(name);
	fillLists();
	loadListName(dom.projectList.value);
}

function saveJSON() {
	downloadJsonFile(`${selProject.name}.json`, projectsData);
}

async function saveAsImage() {
	const blobData = await app.getBlob();
	downloadJPGFile(`${selProject.name} - ${dom.projectList.value}.png`, blobData);
}

async function loadProjects() {
	const data = await fetch("/projects");
	const json = await data.json();

	serverProjects = json.projects;

	for (const project of json.projects) {
		dom.projects.append(domCreate({
			el: "a",
			text: `${project.json[0].name} (${project.json[0].date})`,
			href: "#",
			onclick: event => {
				event.stopPropagation();
				event.preventDefault();
				setProjectsData(project.json);
			},
		}));
	}
}

async function overwrite() {
	const filtered = serverProjects.filter(item => item.json[0].name === projectsData[0].name)[0];

	if (!filtered) {
		return;
	}

	const request = await fetch("/update-project", {
		method: "POST",
		headers: {
			"Accept": 'application/json',
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name: filtered.name,
			json: projectsData,
		}),
	});
	const json = await request.json();

	console.log(json);
}

function main() {
	projectsData = getLsData();

	bindEvents({
		setBtn,
		userClean,
		userAdd,
		saveList,
		loadList,
		saveJSON,
		loadJSON,
		clearMemory,
		addProject,
		projectChange,
		removeList,
		saveAsImage,
		overwrite,
	});
	bindKeys();
	setBtn();
	fillProjects();
	setProject(projectsData[0].name);
	loadProjects();
}

main();
