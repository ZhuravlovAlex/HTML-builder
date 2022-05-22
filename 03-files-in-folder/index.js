

const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname,  'secret-folder');

//Чтение папки
fs.readdir(folder, (err, files) => {
	if (err) throw err;
	files.map(file => {
		const stats = fs.stat(path.join(folder, file), (err, stats) => {
			if (stats.isDirectory()) return;

			const size = stats.size;
			
			const extension = path.extname(path.join(folder, file)).substring(1);

			console.log(`${file}	- ${extension} - ${size} bytes`);
		})
	})
});


// чтение инфо из файла
// fs.readFile(
// 	path.join(__dirname, 'notes', 'mynotes.txt'),
// 	'utf-8',
// 	(err, data) => {
// 		if (err) throw err;
// 		console.log(data);
// 	}
// );