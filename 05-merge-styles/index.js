const fs = require('fs');
const path = require('path');

//Чтение папки и проверки
const folder = path.join(__dirname,  'styles');
const result = path.join(__dirname, 'bundle.css');

fs.readdir(folder, (err, files) => {
	if (err) throw err;
	fs.open(result, 'r', (err) => {
		if(err) throw err;
		files.forEach(file => {
			fs.stat(path.join(folder, file), (err, stats) => {
				if (stats.isDirectory()) return;
				
				const extension = path.extname(path.join(folder, file)).substring(1);
				if (extension !== "css") return;

				fs.readFile(path.join(folder, file), 'utf-8', (err, data) => {
					if (err) throw err;
					fs.appendFile(result, data, (err) => {
						if(err) throw err;
						console.log('Data has been replaced!');
					});
				})
			})
		})
		
	});
	
});





