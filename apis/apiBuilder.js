let fs = require('fs');
const util = require('util');
let faker = require('faker');

const LIMIT = 1000;
const dbDir = 'db';

module.exports = {
    createDb: function () {
        init();

        let promises = [];

        promises.push(builders.validCardTickets());
        promises.push(builders.anotherApi());

        return Promise.all(promises);
    }
};

let builders = {
    validCardTickets: function () {
        let validCardTickets = [];

        for (let index = 0; index < LIMIT; index++) {
            let cardSRN = faker.random.number({min: 1000000000, max: 9999999999}).toString();  //cardSRN 10 number string
            let tariff = faker.random.number({min: 5, max: 200});
            let tariffName = faker.random.word();
            let ticketProvider = faker.random.number();
            let ticketType = faker.random.number({min: 10, max: 99});
            let validFrom = new Date(faker.date.past()).getTime() / 1000 | 0;
            let validTo = new Date(faker.date.future()).getTime() / 1000 | 0;
            let spaceValidity = faker.random.number();
            let zoneName = faker.address.streetName();
            let status = faker.random.number({min: 0, max: 9});

            validCardTickets.push({
                cardSRN,
                tariff,
                tariffName,
                ticketProvider,
                ticketType,
                validFrom,
                validTo,
                spaceValidity,
                zoneName,
                status
            });
        }
        const filename = dbDir + '/validCardTicketsDb.json';
        try{
            fs.unlinkSync(filename);
        }catch (e) {
            console.log(e);
        }

        const writeFile = util.promisify(fs.writeFile);
        return writeFile(filename, JSON.stringify([...validCardTickets]));
    },
    anotherApi: function () {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("foo");
            }, 1000);
        });
    }
};

function init(){
    if (!fs.existsSync(dbDir)){
        fs.mkdirSync(dbDir);
    }
}
