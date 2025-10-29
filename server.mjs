import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonParser = bodyParser.json()

app.use("/js", express.static(`./js`, {
	maxAge: "7d",
	etag: false,
}));
app.use("/css", express.static(`./css`, {
	maxAge: "7d",
	etag: false,
}));
app.use("/img", express.static(`./img`, {
	maxAge: "7d",
	etag: false,
}));
app.get("/projects", (req, res) => {
	const files = readdirSync("./projects");
	const projects = [];

	for (const file of files) {
		try {
			const data = readFileSync(path.join("projects", file), "utf8");
			const json = JSON.parse(data);

			projects.push({
				name: file.replace(".json", ""),
				json,
			});
		} catch (exc) {
			console.log(exc);
		}
	}

	res.json({
		projects,
	});
});
app.post("/update-project", jsonParser, (req, res) => {
	try {
		writeFileSync(path.join("projects", `${req.body.name}.json`), JSON.stringify(req.body.json, null, "\t"), "utf8");
		res.json({
			error: false,
		});
	} catch (exc) {
		res.status(500).json({
			error: exc.toString(),
		});
	}
});
app.get("/", (req, res) => {
	res.sendFile("index.html", { root: __dirname });
});
app.listen(8080, () => {
	console.log(`http://localhost:8080`);
});
