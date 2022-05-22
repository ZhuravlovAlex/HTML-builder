const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'files');
const target = path.join(__dirname, 'files-copy');

//  Создание папки, если ее нет
// Проверка наличия папки
fs.stat(target, function(err) {
	if (err && err.code === 'ENOENT') {
		fs.mkdir(target, err => {
   		if(err) throw err; // не удалось создать папку
			console.log('Папка успешно создана');
		});
	}


	fs.readdir(target, (err, files) => {
		files.forEach(file => {
			fs.unlink(path.join(target, file), () => {})
		});
		fs.readdir(source, (err, files) => {
		if(err) throw err; 
		files.forEach(file => {
			fs.copyFile(path.join(source, file), path.join(target, file), err => {
				if(err) throw err; // не удалось скопировать файл
				console.log('Файл успешно скопирован');
			});
		})
	});
	})
	
});






