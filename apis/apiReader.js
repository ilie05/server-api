let fs = require('fs');
const util = require('util');

module.exports = {
    readFile: function (fileName, data) {

        let content;
        const readFile = util.promisify(fs.readFile);
        // fs.readFile(`db/${fileName}.json`, 'utf8', function (err, data) {
        //     if (err)
        //         throw err;
        //     content = JSON.parse(data);
        //     console.log(content)
        // });
        return readFile(`db/${fileName}.json`, 'utf8');

      //  let content = JSON.parse(fs.readFileSync(`db/${fileName}.json`, 'utf8'));
      //   return content;
    }
};


