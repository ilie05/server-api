let fs = require('fs');
let faker = require('faker');

const LIMIT = 1000;

module.exports = {
    createDb: function () {
        builders.validCardTickets();
        builders.anotherApi();
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
            //let randomCard = faker.helpers.createCard(); // random contact card containing many properties

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
        fs.writeFile('db/validCardTicketsDb.json',JSON.stringify({validCardTickets}), 'utf8', () => {});
    },
    anotherApi: function () {
        // whatever
    }
};

module.exports.createDb();
