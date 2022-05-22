

const fs = require('fs');
const path = require('path');

//Чтение папки
fs.readdir("../secret-folder", (err, files) => {
	if (err) throw err;
	return files;
});


// чтение инфо из файла
fs.readFile(
	path.join(__dirname, 'notes', 'mynotes.txt'),
	'utf-8',
	(err, data) => {
		if (err) throw err;
		console.log(data);
	}
);