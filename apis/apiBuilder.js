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

        promises.push(this.buildCardInterface());
        promises.push(this.buildCardPrimaryData());

        return Promise.all(promises);
    },
    buildCardInterface: function() {
        let promises = [];

        promises.push(cardInterfaceBuild.cardInfo());
        promises.push(cardInterfaceBuild.validCardTickets());
        promises.push(cardInterfaceBuild.allowedTicketProviders());
        promises.push(cardInterfaceBuild.availableTariffs());
        promises.push(cardInterfaceBuild.saleTickets());
        promises.push(cardInterfaceBuild.orderTicket());
        promises.push(cardInterfaceBuild.cancelOrderTicket());
        promises.push(cardInterfaceBuild.payOrderTicket());
        promises.push(cardInterfaceBuild.paymentGateway());
        promises.push(cardInterfaceBuild.changePurseOnCard());

        return Promise.all(promises);
    },

    buildCardPrimaryData: function () {
        let promises = [];

        promises.push(cardPrimaryDataBuild.customerProfiles());

        return Promise.all(promises);
    }
};

let cardInterfaceBuild = {
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

            validCardTickets.push({cardSRN, tariff, tariffName, ticketProvider, ticketType, validFrom, validTo,
                spaceValidity, zoneName, status});
        }
        const filename = dbDir + '/validCardTicketsDb.json';
        return writeFile(filename, validCardTickets);
    },

    cardInfo: function () {
        let cardInfo = [];
        for (let index = 0; index < LIMIT; index++) {
            let cardName = casual.username;
            let CustProfile = faker.random.number({min: 1000000000, max: 9999999999});
            let CustProfileName = casual.username;
            let CardSubType = faker.random.number({min: 10, max: 99});
            let CardSubTypeName = casual.username;
            let CardPublisher = faker.random.number({min: 10, max: 99});
            let CardPublisherName = casual.username;
            let CardProvider = faker.random.number({min: 10, max: 99});
            let CardProviderName = casual.username;
            let isValid = faker.random.boolean();
            let isBlocked = faker.random.boolean();
            let cardValidityDate = new Date(faker.date.future()).getTime() / 1000 | 0;
            let discountValidityDate = new Date(faker.date.future()).getTime() / 1000 | 0;
            let soldDate = new Date(faker.date.future()).getTime() / 1000 | 0;
            let blockedDate = new Date(faker.date.future()).getTime() / 1000 | 0;
            let purseValueInCents = Number(faker.finance.amount());
            let lastPurseUpdateDate = new Date(faker.date.past()).getTime() / 1000 | 0;
            let purseWaitingOperationsInCents = Number(faker.finance.amount());
            let purseCurrencyCode = casual.currency_symbol;
            let purseValidFrom = new Date(faker.date.past()).getTime() / 1000 | 0;
            let purseValidTo = new Date(faker.date.future()).getTime() / 1000 | 0;
            let purseActive = faker.random.boolean();
            let ownerFirstName = faker.name.firstName();
            let ownerLastName = faker.name.lastName();
            let ownerEmail = faker.internet.email();
            let ownerStreet = faker.name.firstName();
            let ownerPostCode = faker.address.zipCode();
            let ownerCity = faker.address.city();
            let templateCode = faker.address.zipCode();
            let ownerPersonalNumber = faker.random.number({min: 1000000000, max: 9999999999}).toString();

            cardInfo.push({cardName, CustProfile, CustProfileName, CardSubType, CardSubTypeName, CardPublisher,
                CardPublisherName, CardProvider, CardProviderName, isValid, isBlocked,cardValidityDate, discountValidityDate,
                soldDate, blockedDate, purseValueInCents, lastPurseUpdateDate, purseWaitingOperationsInCents, purseCurrencyCode,
                purseValidFrom, purseValidTo, purseActive, ownerFirstName, ownerLastName, ownerEmail, ownerStreet,
                ownerPostCode, ownerCity, templateCode, ownerPersonalNumber});
        }
        const filename = dbDir + '/cardInfoDb.json';
        return writeFile(filename, cardInfo);
    }
};

let cardPrimaryDataBuild = {
    customerProfiles: function () {
        let customerProfiles = [];
        for (let index = 0; index < LIMIT; index++) {
            let Id = faker.random.number({min: 1000000000, max: 9999999999});
            let ValidTo = new Date(faker.date.future()).getTime() / 1000 | 0;
            let CardProvider = faker.random.number({min: 10, max: 99});
            let Template = faker.random.number({min: 1000000000, max: 9999999999});
            let CustomerProfile = faker.random.number({min: 1000000000, max: 9999999999});
            let Name = casual.name;

            customerProfiles.push({Id, ValidTo, CardProvider, CustomerProfile, Template, Name});
        }
        const filename = dbDir + '/customerProfilesDb.json';
        return writeFile(filename, customerProfiles);
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