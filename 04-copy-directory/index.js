const { exit } = process;
const fs = require('fs');
const path = require('path');
const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

fs.rm(destDir, { recursive: true, force: true }, (error) => {
  if (error) {
    console.error('Error deleting the folder:', error);
    exit(1);
  }
  fs.mkdir(destDir, (error) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      exit(1);
    }

    fs.readdir(srcDir, (error, files) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        exit(1);
      }

      files.forEach((file) => {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, file);

        fs.readFile(srcPath, (error, data) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            exit(1);
          }

          fs.writeFile(destPath, data, (error) => {
            if (error) {
              console.error(`Error: ${error.message}`);
              exit(1);
            }
          });
        });
      });
    });
  });
});
