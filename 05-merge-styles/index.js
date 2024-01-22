const { stdout, exit } = process;
const fs = require('fs');
const path = require('path');
const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

function isCss(file) {
  return path.extname(file) === '.css';
}

fs.readdir(stylesDir, (error, files) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    exit(1);
  }
  const filesCSS = files.filter(isCss);
  const styles = [];
  let filesCounter = 0;

  filesCSS.forEach((file) => {
    const filePath = path.join(stylesDir, file);

    fs.readFile(filePath, 'utf8', (error, data) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        exit(1);
      }
      styles.push(data);
      filesCounter += 1;
      if (filesCounter === filesCSS.length) {
        const joinedStyles = styles.join('\n');
        fs.writeFile(outputFile, joinedStyles, (error) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            exit(1);
          }
          stdout.write('The bundle.css is in project-dist directory.');
        });
      }
    });
  });
});
