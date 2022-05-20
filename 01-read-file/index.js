const fs = require('fs');
const Path = require('path');

const file = Path.join(__dirname, 'text.txt');

const stream = new fs.ReadStream(file);

stream.on("data", data => {
	console.log(data.toString());
});



