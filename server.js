const express = require('express');
const app = express();

app.use('/js', express.static(`./js`, {
	maxAge: '7d',
	etag: false,
}));
app.use('/css', express.static(`./css`, {
	maxAge: '7d',
	etag: false,
}));
app.use('/img', express.static(`./img`, {
	maxAge: '7d',
	etag: false,
}));
app.get('/', (req, res) => {
	res.sendFile('index.html', { root: __dirname });
});
app.listen(8080, () => {
	console.log("When Server Starts, Log This");
});
