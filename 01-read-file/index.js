const { stdout } = process;
const fs = require('fs');
const path = require('path');
const filename = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filename);

readStream.pipe(stdout);

readStream.on('error', (error) => {
  console.error(`Error reading the file: ${error.message}`);
  exit(1);
});
