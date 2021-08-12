const fse = require('fs-extra');

/**
 * @see https://l5d.li/p/get-files-recursive-with-the-nodejs-file-system-fs
 */
async function getFiles(path = './') {
    const entries = await fse.readdir(path, {withFileTypes: true});

    // Get files within the current directory and add a path key to the file objects
    const files = entries
        .filter(file => !file.isDirectory())
        .map(file => ({ ...file, path: path + file.name }));

    // Get folders within the current directory
    const folders = entries.filter(folder => folder.isDirectory());

    for (const folder of folders) {
        files.push(...await getFiles(`${path}${folder.name}/`));
    }

    return files;
}

const concatSCSS = async (inputPath = 'src/', outputPath = '.tmp') => {
    const files = await getFiles(inputPath);
    fse.mkdirsSync(outputPath);
    const constantsLogger = fse.createWriteStream(`${outputPath}/styles.scss`);

    for (let index = 0; index < files.length; index++) {
        const file = files[index];

        if (file.name.match(/.scss$/g)) {
            const contents = fse.readFileSync(file.path);
            constantsLogger.write(contents);
        }
    }
    constantsLogger.end();
};

module.exports.concatScss = concatSCSS;
