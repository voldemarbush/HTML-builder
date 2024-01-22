const { stdin, stdout, exit } = process;
const fs = require('fs');
const path = require('path');
const filename = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filename, { flags: 'a' });

function closeProgram() {
  stdout.write('\nGood bye!!!');
  writeStream.end();
  exit();
}

stdout.write('Enter the text below:\n>');
stdin.on('data', (data) => {
  const text = data.toString().trim();
  if (text === 'exit') {
    closeProgram();
  } else {
    writeStream.write(text + '\n');
    stdout.write('>');
  }
});

process.on('SIGINT', () => {
  closeProgram();
});

writeStream.on('error', (error) => {
  console.error(`Error writing the file: ${error.message}`);
  exit(1);
});
