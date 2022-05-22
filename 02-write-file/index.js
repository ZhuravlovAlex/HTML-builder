const fs = require('fs');
const Path = require('path');

const file = Path.join(__dirname, 'text.txt');
const writeFile = fs.createWriteStream(file);

process.on('SIGINT', () => {
	console.log('Goodbye!');
	process.exit(2);
});
process.on('SIGHUP', () => {
	console.log('Goodbye!');
	process.exit(1);
});
process.on('SIGQUIT', () => {
	console.log('Goodbye!');
	process.exit(3);
});

process.stdin.on('data', (data) => {
	writeFile.write(data.toString())
})

console.log('Hello. PLease input text below.');


