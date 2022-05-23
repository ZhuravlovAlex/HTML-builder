const fs = require('fs');
const Path = require('path');

const dist = Path.join(__dirname, 'project-dist');
const distCss = Path.join(dist, 'style.css');
const distHtml = Path.join(dist, 'index.html');
const distAssets = Path.join(dist, "assets");

const components = Path.join(__dirname, 'components');
const template = Path.join(__dirname, 'template.html');
const styles = Path.join(__dirname, 'styles');
const assets = Path.join(__dirname, 'assets');


function checkDistFolder () {
	return new Promise((resolve, reject) => {
		fs.readdir(dist, (err) => {
			if (err && err.code === 'ENOENT') {
					fs.mkdir(dist, () => resolve())
			} else if (!err) resolve();
			else reject();
		});
	});
}

function checkDistCss () {
	return new Promise((resolve, reject) => {
		fs.readFile(distCss, (err, data) => {
			if (err && err.code === 'ENOENT') {
					fs.appendFile(distCss, '', 'utf-8', () => resolve())
			} else if (!err) fs.writeFile(distCss, '', () => resolve())
			else reject();
		});
	});
}

function checkDistHtml () {
	return new Promise((resolve, reject) => {
		fs.readFile(distHtml, (err, data) => {
			if (err && err.code === 'ENOENT') {
					fs.appendFile(distHtml, '', 'utf-8', () => resolve())
			} else if (!err) fs.writeFile(distHtml, '', () => resolve())
			else reject();
		});
	})
}

function checkAssetsDist () {
	return new Promise((resolve, reject) => {

		const promises = [];
		fs.readdir(distAssets, (err) => {
			if (err && err.code === 'ENOENT') {
					fs.mkdir(distAssets, () => {
						promises.push(
							createSubAssetsFolder('fonts'),
							createSubAssetsFolder('img'),
							createSubAssetsFolder('svg')
						);

						Promise.all(promises).then(() => resolve());
					})
			} else if (!err) {
					promises.push(
						clearSubAssetsFolder('fonts'),
						clearSubAssetsFolder('img'),
						clearSubAssetsFolder('svg')
					);

					Promise.all(promises).then(() => resolve());
			}
			else reject();
		});
	});
}

function createSubAssetsFolder(name) {
	return new Promise((resolve, reject) => {
		fs.mkdir(Path.join(distAssets, name), () => resolve())
	});
}

function clearSubAssetsFolder(name) {
	return new Promise((resolve, reject) => {
		fs.readdir(Path.join(distAssets, name), (err, files) => {
			Promise.all(files.map(file => {
					return new Promise((resolve, reject) => {
						fs.unlink(Path.join(distAssets, name, file), () => resolve);
					})
			}))
			.then(() => resolve());
		});
	});
}

function createCssBundle () {
	return new Promise((resolve, reject) => {
		fs.readdir(styles, (err, files) => {
			Promise.all(files.map(file => new Promise((resolve, reject) => {
					fs.readFile(Path.join(styles, file), (err, data) => {
						resolve(data.toString());
					})
			})))
			.then(res => {
					fs.appendFile(distCss, res.join('\n'), () => resolve())
			});
		});
	});
}

function createHtml () {
	return new Promise((resolve, reject) => {
		fs.readFile(template, (err, data) => {
			data = data.toString();

			const promises = [];
			let startIndex = data.indexOf('{{');

			while (startIndex >= 0) {
					const endIndex = data.indexOf('}}', startIndex);
					const component = data.substring(startIndex + 2, endIndex);
					promises.push(
						new Promise((resolve, reject) => {
							fs.readFile(Path.join(components, `${component}.html`), (err, data) => {
									resolve({
										component: component,
										data: data ? data.toString() : ''
									});
							})
						})
					);
					startIndex = data.indexOf('{{', startIndex + 1);
            }

            Promise.all(promises)
            .then(res => {
					res.forEach(r => {
						if (r.data.length) data = data.replace(`{{${r.component}}}`, `\n${r.data}\n`);
					});
					fs.appendFile(distHtml, data, () => resolve());
			})
		})
	})
}

function copyAssets () {
	return new Promise((resolve, reject) => {
		fs.readdir(assets, (err, files) => {
			Promise.all(files.map(file => copyFolder(file)))
			.then(() => resolve())
		});
	});
}

function copyFolder (folder) {
	return new Promise((resolve, reject) => {
		fs.readdir(Path.join(assets, folder), (err, files) => {
			Promise.all(files.map(file => {
					return new Promise((resolve, reject) => {
						fs.copyFile(Path.join(assets, folder, file), Path.join(distAssets, folder, file), () => resolve())
					})
			}))
			.then(() => resolve());
		});
	});
}

checkDistFolder()
.then(() => checkAssetsDist())
	.then(() => checkDistCss()
		.then(() => checkDistHtml()
			.then(() => createCssBundle()
					.then(() => createHtml()
						.then(() => copyAssets()
							.then(() => console.log('Finish!!!')))))));


							
// const fs = require('fs');
// const path = require('path');
// const { start } = require('repl');

// //Создаём папку project-dist
// const target = path.join(__dirname, 'project-dist');
// const stylesFolder = path.join(__dirname,  'styles');
// const stylesResult = path.join(target, 'style.css');

// const htmlTemplate = path.join(__dirname, 'template.html');
// const components = path.join(__dirname, 'components');
// const htmlResult = path.join(target, 'index.html');

// const assetsFrom = path.join(__dirname, 'assets');
// const assetsTo = path.join(target, 'assets');



// const checkCssBundle = function(callback) {
// 	fs.stat(stylesResult, (err, stat) => {
// 		if (err && err.code === 'ENOENT') {
// 			fs.appendFile(stylesResult, '', () => callback)
// 		} else callback;
// 	})
// }

// checkProjectFolder(
// 	checkCssBundle(
// 		checkAssetsFolder(
// 			checkHtml(
// 				createCssBundle(
// 					copyAssets(processHtml))))));


// function checkProjectFolder(callback) {
// 	fs.readdir(target, (err, files) => {
// 		if (err && err.code === 'ENOENT') {
// 			fs.mkdir(target, () => callback);
// 		} else callback;
// 	})
// }



// function checkHtml(callback) {
// 	fs.stat(htmlResult, (err, stat) => {
// 		if (err && err.code === 'ENOENT') {
// 			fs.appendFile(htmlResult, '', () => callback)
// 		} else callback;
// 	})
// }

// function checkAssetsFolder(callback) {
// 	fs.readdir(assetsTo, (err, files) => {
// 		if (err && err.code === 'ENOENT') {
// 			fs.mkdir(assetsTo, () => callback);
// 		} else callback;
// 	})
// }

// function createCssBundle(callback) {
// 	fs.readdir(stylesFolder, (err, files) => {
// 		files.forEach(file => {
// 			fs.stat(path.join(stylesFolder, file), (err, stats) => {
// 					if (stats.isDirectory()) return;
					
// 					const extension = path.extname(path.join(stylesFolder, file)).substring(1);
// 					if (extension !== "css") return;

// 					fs.readFile(path.join(stylesFolder, file), 'utf-8', (err, data) => {
// 						if (err) throw err;
// 						fs.appendFile(stylesResult, data, (err) => {
// 							if(err) throw err;
// 							console.log('Styles has been created!');
// 						});
// 					})
// 				})
// 		});

// 		callback;
// 	})
// }


// function copyAssets(callback) {
// 	fs.readdir(assetsTo, (err, files) => {
// 		files.forEach(file => {
// 			fs.unlink(path.join(assetsTo, file), () => {})
// 		});
// 		fs.readdir(assetsFrom, (err, files) => {
// 			if(err) throw err; 
// 			files.forEach(file => {
// 				fs.copyFile(path.join(assetsFrom, file), path.join(assetsTo, file), err => {
// 					if(err) throw err; // не удалось скопировать файл
// 					console.log('Файл успешно скопирован');
// 				});
// 			})
// 		});

// 		callback;
// 	})
// }

// function processHtml () {
// 	const stream = new fs.ReadStream(htmlTemplate);
// 	let string = '';
//    stream.on("data", data => {
// 	   string += data.toString();
//    });
// 	stream.on('end', () => {
// 		let startIndex = string.indexOf('{{');
// 		while (startIndex >= 0) {
// 			let endIndex = string.indexOf('}}', startIndex);
// 			let component = string.substring(startIndex + 2, endIndex);
// 			fs.readFile(path.join(components, `${component}.html`), 'utf-8', (err, input) => {
// 				string.replace(`{{${component}}}`, input)
// 			});

// 			startIndex = string.indexOf('{{', startIndex + 1);
// 		}
// 		fs.unlink(htmlResult, (err) => {
// 			fs.appendFile(htmlResult, string,  () => {});
// 		})
// 	})
// }

