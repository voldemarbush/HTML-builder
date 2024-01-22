const { stdout, exit } = process;
const fs = require('fs');
const path = require('path');
const directory = path.join(__dirname, 'secret-folder');

fs.readdir(directory, { withFileTypes: true }, (error, items) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    exit(1);
  }

  items.forEach((item) => {
    if (item.isFile()) {
      const itemPath = path.join(item.path, item.name);
      fs.stat(itemPath, (error, stats) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          exit(1);
        }
        const fileName = item.name.split('.')[0];
        const fileExt = path.extname(item.name).slice(1);
        stdout.write(
          `${fileName} - ${fileExt} - ${(stats.size / 1024).toFixed(3)}kb\n`,
        );
      });
    }
  });
});
