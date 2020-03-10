let fs = require('fs');
const util = require('util');

module.exports = {
    readFile: function (fileName, data) {
        const readFile = util.promisify(fs.readFile);
        return readFile(`db/${fileName}.json`);
    }
};


