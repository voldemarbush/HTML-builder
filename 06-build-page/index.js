const { stdout, exit } = process;
const fs = require('fs');
const path = require('path');
const destDir = path.join(__dirname, 'project-dist');
const stylesDir = path.join(__dirname, 'styles');
const outputFile = path.join(destDir, 'style.css');
const assetsDir = path.join(__dirname, 'assets');
const destAssetsDir = path.join(destDir, 'assets');

function bundleHTML() {
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

      bundleCSS();
      copyAssets();

      const templateFile = path.join(__dirname, 'template.html');
      fs.readFile(templateFile, 'utf-8', (error, templateContent) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          exit(1);
        }

        const tags = templateContent.match(/{{(.*?)}}/g) || [];
        const componentsDir = path.join(__dirname, 'components');
        let replacedContent = templateContent;
        replaceTags(0);

        function replaceTags(index) {
          if (index < tags.length) {
            const tag = tags[index];
            const componentName = tag.slice(2, -2).trim();
            const componentFile = path.join(
              componentsDir,
              `${componentName}.html`,
            );

            fs.access(componentFile, (error) => {
              if (!error) {
                fs.readFile(
                  componentFile,
                  'utf-8',
                  (error, componentContent) => {
                    if (!error) {
                      replacedContent = replacedContent.replace(
                        tag,
                        componentContent,
                      );
                    }
                    replaceTags(index + 1);
                  },
                );
              } else {
                replaceTags(index + 1);
              }
            });
          } else {
            const indexFile = path.join(destDir, 'index.html');
            fs.writeFile(indexFile, replacedContent, (error) => {
              if (error) {
                console.error(`Error writing html file: ${error.message}`);
                exit(1);
              }
              stdout.write('The index.html is in project-dist directory.\n');
            });
          }
        }
      });
    });
  });
}

function isCss(file) {
  return path.extname(file) === '.css';
}

function bundleCSS() {
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
            stdout.write('The style.css is in project-dist directory.\n');
          });
        }
      });
    });
  });
}

function copyDir(srcDir, destDir) {
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
            stdout.write(
              `The ${file} is copied to assets in project-dist directory.\n`,
            );
          });
        });
      });
    });
  });
}

function copyAssets() {
  fs.mkdir(destAssetsDir, (error) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      exit(1);
    }
    fs.readdir(assetsDir, { withFileTypes: true }, (error, items) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        exit(1);
      }

      items.forEach((item) => {
        const srcDir = path.join(assetsDir, item.name);
        const destDir = path.join(destAssetsDir, item.name);
        copyDir(srcDir, destDir);
      });
    });
  });
}

bundleHTML();
