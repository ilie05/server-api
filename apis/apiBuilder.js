let fs = require('fs');
const util = require('util');
let faker = require('faker');
let casual = require('casual');

const LIMIT = 1000;
const dbDir = 'db';

module.exports = {
    createDb: function () {
        init();

        let promises = [];

        promises.push(builders.validCardTickets());
        promises.push(builders.allowedTicketProviders());
        promises.push(builders.availableTariffs());
        promises.push(builders.saleTickets());
        promises.push(builders.orderTicket());
        promises.push(builders.cancelOrderTicket());
        promises.push(builders.payOrderTicket());
        promises.push(builders.paymentGateway());
        promises.push(builders.changePurseOnCard());

        return Promise.all(promises);
    }
};

let builders = {
    changePurseOnCard: function(){
        let changePurseOnCard = [];
        for (let index = 0; index < LIMIT; index++) {
            let cardSRN = faker.random.number({min: 1000000000, max: 9999999999}).toString();
            let Order = faker.random.number({min: 1000000000, max: 9999999999});
            let OperationId = faker.random.number({min: 1000000000, max: 9999999999});
            let BalanceBefore =  faker.random.number({min: 1, max: 100000});
            let BalanceAfter =  faker.random.number({min: 0, max: BalanceBefore});

            changePurseOnCard.push({cardSRN, Order, "PurseResponse": { OperationId, BalanceBefore, BalanceAfter }});
        }
        const filename = dbDir + '/changePurseOnCardDb.json';
        return writeFile(filename, changePurseOnCard);
    },

    paymentGateway: function(){
        let paymentGateway = [];
        for (let index = 0; index < LIMIT; index++) {
            let RedirectPath  = "/" + faker.system.fileName();
            let Parameters = {
                "EshopId": faker.random.number({min: 0, max: 100}),
                "Key": faker.random.number({min: 10000, max: 99999})
            };

            paymentGateway.push({RedirectPath, Parameters});
        }
        const filename = dbDir + '/paymentGatewayDb.json';
        return writeFile(filename, paymentGateway);
    },

    payOrderTicket: function(){
        let payOrderTicketCard = [];
        let payOrderTicketPurse = [];
        for (let index = 0; index < LIMIT; index++) {
            let cardSRN = faker.random.number({min: 1000000000, max: 9999999999}).toString();
            let Order = faker.random.number({min: 1000000000, max: 9999999999});
            let Pay = faker.random.boolean();

            let OperationId = faker.random.number({min: 1000000000, max: 9999999999});
            let BalanceBefore =  faker.random.number({min: 1, max: 100000});
            let BalanceAfter =  faker.random.number({min: 0, max: BalanceBefore});

            let PostId = faker.random.number({min: 1000000000, max: 9999999999});
            let Tid = faker.random.number({min: 1000000000, max: 9999999999});
            let Mid = faker.random.number({min: 1000000000, max: 9999999999});
            let CardNumber = casual.card_number();
            let CardSetName = casual.card_type;
            let Currency = casual.currency_symbol;
            let ReturnCode = faker.random.number({min: 0, max: 100});
            let Amount = faker.finance.amount();
            let PosTransactionId = faker.random.number({min: 1000000000, max: 9999999999});

            payOrderTicketPurse.push({cardSRN, Order, Pay, "TransactionInformation": { OperationId, BalanceBefore, BalanceAfter }});
            payOrderTicketCard.push({cardSRN, Order, Pay, "TransactionInformation": { PostId, Tid, Mid, CardNumber,CardSetName, Currency, ReturnCode, Amount, PosTransactionId }});
        }
        const filename = dbDir + '/payOrderTicketDb.json';
        return writeFile(filename, [{payOrderTicketCard, payOrderTicketPurse}]);
    },

    cancelOrderTicket: function(){
        let cancelOrderTicket = [];
        for (let index = 0; index < LIMIT; index++) {
            let cardSRN = faker.random.number({min: 1000000000, max: 9999999999}).toString();
            let Order = faker.random.number({min: 1000000000, max: 9999999999});
            let Cancel = faker.random.boolean();

            cancelOrderTicket.push({cardSRN, Order, Cancel});
        }
        const filename = dbDir + '/cancelOrderTicketDb.json';
        return writeFile(filename, cancelOrderTicket);
    },

    orderTicket: function(){
        let orderTicket = [];
        for (let index = 0; index < LIMIT; index++) {
            let cardSRN = faker.random.number({min: 1000000000, max: 9999999999}).toString();
            let tariff = faker.random.number({min: 5, max: 200});
            let tariffName = faker.random.word();
            let ticketProvider = faker.random.number();
            let ticketType = faker.random.number({min: 10, max: 99});
            let validFrom = new Date(faker.date.past()).getTime() / 1000 | 0;
            let validTo = new Date(faker.date.future()).getTime() / 1000 | 0;
            let zone = faker.random.number({min: 0, max: 99});
            let zoneName = faker.address.streetName();
            let status = faker.random.number({min: 0, max: 9});
            let Price = faker.random.number({min: 0, max: 10000});

            orderTicket.push({cardSRN, tariff, tariffName, ticketProvider, ticketType, validFrom, validTo, zone, zoneName, status, Price});
        }
        const filename = dbDir + '/orderTicketDb.json';
        return writeFile(filename, orderTicket);
    },

    saleTickets: function(){
        let saleTickets = [];
        for (let index = 0; index < LIMIT; index++) {
            let cardSRN = faker.random.number({min: 1000000000, max: 9999999999}).toString();
            let Order = faker.random.number({min: 1000000000, max: 9999999999});
            let Price = faker.random.number({min: 0, max: 10000});

            saleTickets.push({cardSRN, Order, Price});
        }
        const filename = dbDir + '/saleTicketsDb.json';
        return writeFile(filename, saleTickets);
    },

    availableTariffs: function(){
        let availableTariffs = [];
        for (let index = 0; index < LIMIT; index++) {
            let TicketProvider = faker.random.number({min: 1000000000, max: 9999999999});
            let timeValidity = faker.hacker.noun();
            let spaceValidity = faker.random.number({min: 1000000000, max: 9999999999});
            let tariff = faker.random.number({min: 5, max: 200});
            let tariffName = faker.random.word();

            availableTariffs.push({TicketProvider, timeValidity, spaceValidity, tariff, tariffName});
        }
        const filename = dbDir + '/availableTariffsDb.json';
        return writeFile(filename, availableTariffs);
    },

    allowedTicketProviders: function(){
        let allowedTicketProviders = [];
        for (let index = 0; index < LIMIT; index++) {
            let Provider = faker.random.number({min: 1000000000, max: 9999999999});
            let providerName = faker.company.companyName();
            let providerColor = faker.internet.color();
            let providerLogo = faker.company.companySuffix();
            let providerTimeZone = faker.address.city();

            allowedTicketProviders.push({Provider, providerName, providerColor, providerLogo, providerTimeZone});
        }
        const filename = dbDir + '/allowedTicketProvidersDb.json';
        return writeFile(filename, allowedTicketProviders);
    },

    validCardTickets: function () {
        let validCardTickets = [];
        for (let index = 0; index < LIMIT; index++) {
            let cardSRN = faker.random.number({min: 1000000000, max: 9999999999}).toString();
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
        return writeFile(filename, validCardTickets);
    }
};

function init(){
    if (!fs.existsSync(dbDir)){
        fs.mkdirSync(dbDir);
    }
}

function writeFile(filename, data){
    try{
        fs.unlinkSync(filename);
    }catch (e) {
        console.log(e.message);
    }
    const writeFile = util.promisify(fs.writeFile);
    return writeFile(filename, JSON.stringify([...data]));
}