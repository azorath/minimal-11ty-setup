const fse = require('fs-extra');
const sass = require('node-sass');
const {concatScss} = require('./concat-css')

module.exports = eleventyConfig => {
    eleventyConfig.dir = {
        input: 'src',
        output: 'build'
    };

    eleventyConfig.on('beforeBuild', () => {
        concatScss();
    });

    eleventyConfig.on('afterBuild', () => {
        const sassConfig = {
            file: '.tmp/styles.scss',
            outputStyle: 'compressed',
            outFile: `${eleventyConfig.dir.output}/style.css`,
            sourceMap: true,
        };

        sass.render(sassConfig, function(error, result) {
            if (error) {
                console.log(`CSS error in line #${error.line}`);
                console.log(error.message);
            } else {
                if (!error) {
                    fse.writeFile(sassConfig.outFile, result.css);
                    if (sassConfig.sourceMap) {
                        fse.writeFile(`${sassConfig.outFile}.map`, result.map);
                    }
                }
            }
        });
        fse.remove('.tmp');
    });

    return eleventyConfig;
};
