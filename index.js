let express = require('express');
let apiReader = require('./apis/apiReader');

let app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

let cardInfo, validCardTickets, allowedTicketProviders, availableTariffs, saleTickets, orderTicket, cancelOrderTicket, payOrderTicket;
let paymentGateway, changePurseOnCard, customerProfiles, cardSubType, statuses, paymentType, ticketData, currency, spaceValidity, timeValidity;

// read data from files for Card Interface

apiReader.readFile('cardInfoDb').then(data => {
  cardInfo = JSON.parse(data);
});

apiReader.readFile('validCardTicketsDb').then(data => {
  validCardTickets = JSON.parse(data);
});

apiReader.readFile('allowedTicketProvidersDb').then(data => {
  allowedTicketProviders = JSON.parse(data);
});

apiReader.readFile('availableTariffsDb').then(data => {
  availableTariffs = JSON.parse(data);
});

apiReader.readFile('saleTicketsDb').then(data => {
    saleTickets = JSON.parse(data);
});

apiReader.readFile('orderTicketDb').then(data => {
  orderTicket = JSON.parse(data);
});

apiReader.readFile('cancelOrderTicketDb').then(data => {
  cancelOrderTicket = JSON.parse(data);
});

apiReader.readFile('payOrderTicketDb').then(data => {
  payOrderTicket = JSON.parse(data)[0];  //  [{payOrderTicketCard, payOrderTicketPurse}]; take first element
});

apiReader.readFile('paymentGatewayDb').then(data => {
  paymentGateway = JSON.parse(data);
});

apiReader.readFile('changePurseOnCardDb').then(data => {
  changePurseOnCard = JSON.parse(data);
});

// read data from files for Card Primary data

apiReader.readFile('customerProfilesDb').then(data => {
  let arr = JSON.parse(data);
  customerProfiles = arr.map((item) => {
      return { 'Id': item.Id, 'ValidTo': item.ValidTo, 'CardProvider': item.CardProvider, 'Template': item.Template, 'Name': item.Name };
  });

  cardSubType = arr.map((item) => {
      return { 'Id': item.Id, 'ValidTo': item.ValidTo, 'CardProvider': item.CardProvider, 'CustomerProfile': item.CustomerProfile, 'Name': item.Name };
  });

  statuses = arr.map((item) => {
      return { 'Id': item.Id, 'ValidTo': item.ValidTo, 'Name': item.Name };
  });

  paymentType = arr.map((item) => {
    return { 'Id': item.Id, 'CardProvider': item.CardProvider, 'ValidTo': item.ValidTo, 'Name': item.Name };
  });
});

// read data from files for Ticket Primary data

apiReader.readFile('ticketDataDb').then(data => {
  let arr = JSON.parse(data);
  ticketData = arr.map((item) => {              // this array will be used for getLanguage, GetTicketType, getCostumerProfile
      return { 'Id': item.Id, 'Name': item.Name };  // getStartValidity, getTimeUnit
  });

  currency = arr.map((item) => {
      return { 'Id': item.Id, 'Name': item.Name, 'Abbreviation': item.Abbreviation };
  });

  spaceValidity = arr.map((item) => {
      return { 'Id': item.Id, 'Name': item.Name, 'ValueFrom': item.ValueFrom, 'ValueTo': item.ValueTo, 'ValueText': item.ValueText,
        'GroupId': item.GroupId, 'GroupName': item.Name, 'SpaceFrom': item.SpaceFrom, 'SpaceTo': item.SpaceTo };
  });

  timeValidity = arr.map((item) => {
    return { 'Id': item.Id, 'Value': item.Value, 'UnitId': item.UnitId };
  });

});

// apis for Card Interface

app.post('/cardInfo', function (req, res) {
  let {cardSRN, Provider} = req.body;
  //let arr = cardInfo.filter(obj => obj.cardSRN == cardSRN);
  let arr = cardInfo;
  res.json(arr);
});

app.post('/validCardTickets', function (req, res) {
  let {cardSRN, Provider} = req.body;
  let arr = validCardTickets.filter(obj => obj.cardSRN == cardSRN);
  res.json(arr);
});

app.post('/allowedTicketProviders', function (req, res) {
  let {cardSRN, Provider} = req.body;
  let arr = allowedTicketProviders.filter(obj => obj.Provider == Provider);
  res.json(arr);
});

app.post('/availableTariffs', function (req, res) {
  let {cardSRN, Provider, TicketProvider} = req.body;
  let arr = availableTariffs.filter(obj => obj.TicketProvider == TicketProvider);
  res.json(arr);
});

app.post('/saleTickets', function (req, res) {
  let {cardSRN, Provider, TicketProvider, Ticket} = req.body;
  let arr = saleTickets.filter(obj => obj.cardSRN == cardSRN);
  res.json(arr);
});

app.post('/orderTicket', function (req, res) {
  let {cardSRN, Provider, TicketProvider, Order} = req.body;
  let arr = orderTicket.filter(obj => obj.cardSRN == cardSRN);
  res.json(arr);
});

// use saleTickets db file
app.post('/changeOrderTicket', function (req, res) {
  let {cardSRN, Provider, TicketProvider, Order, Ticket} = req.body;
  let arr = saleTickets.filter(obj => obj.cardSRN == cardSRN);
  res.json(arr);
});

app.post('/cancelOrderTicket', function (req, res) {
  let {cardSRN, Provider, TicketProvider, Order, Ticket} = req.body;
  let arr = cancelOrderTicket.filter(obj => obj.cardSRN == cardSRN);
  res.json(arr);
});

app.post('/payOrderTicket', function (req, res) {
  let {cardSRN, Provider, TicketProvider, Order, PaymentType} = req.body;
  let arr = {};
  if(PaymentType === 0){ //payment of type purse
    console.log(payOrderTicket.payOrderTicketPurse);
    arr = payOrderTicket.payOrderTicketPurse.filter(obj => obj.cardSRN == cardSRN);
  } else if(PaymentType === 1){ //payment of type ECARD
    arr = payOrderTicket.payOrderTicketCard.filter(obj => obj.cardSRN == cardSRN);
  }
  res.json(arr);
});

app.post('/paymentGateway', function (req, res) {
  let {cardSRN, Provider, TicketProvider, Order} = req.body;
  let arr = paymentGateway;
  res.json(arr);
});

app.post('/changePurseOnCard', function (req, res) {
  let {cardSRN, Provider, TicketProvider, Ticket, Value, Increment} = req.body;
  let arr = changePurseOnCard.filter(obj => obj.cardSRN == cardSRN);
  res.json(arr);
});

// apis for Card Primary Data

app.post('/customerProfiles', function (req, res) {
  let { Provider } = req.body;
  // let arr = customerProfiles.filter(obj => obj.cardSRN == cardSRN);
  let arr = customerProfiles;
  res.json(arr);
});

app.post('/cardSubType', function (req, res) {
  let { Provider } = req.body;
  // let arr = cardSubType.filter(obj => obj.cardSRN == cardSRN);
  let arr = cardSubType;
  res.json(arr);
});

app.post('/statuses', function (req, res) {
  let { Provider } = req.body;
  // let arr = statuses.filter(obj => obj.cardSRN == cardSRN);
  let arr = statuses;
  res.json(arr);
});

app.post('/paymentType', function (req, res) {
  let { Provider } = req.body;
  // let arr = paymentType.filter(obj => obj.cardSRN == cardSRN);
  let arr = paymentType;
  res.json(arr);
});

// apis for  Ticket Primary Data

app.post('/languages', function (req, res) {
  let { Id, TicketProvider } = req.body;
  let arr = ticketData.filter(obj => obj.Id == Id);
  res.json(arr);
});

app.post('/ticketType', function (req, res) {
  let { Id, TicketProvider } = req.body;
  let arr = ticketData.filter(obj => obj.Id == Id);
  res.json(arr);
});

app.post('/customerProfile', function (req, res) {
  let { TicketProvider } = req.body;
  //let arr = ticketData.filter(obj => obj.Id == Id);
  let arr = ticketData;
  res.json(arr);
});

app.post('/startValidity', function (req, res) {
  let { TicketProvider } = req.body;
  //let arr = ticketData.filter(obj => obj.Id == Id);
  let arr = ticketData;
  res.json(arr);
});

app.post('/timeUnit', function (req, res) {
  let { Id } = req.body;
  let arr = ticketData.filter(obj => obj.Id == Id);
  res.json(arr);
});

app.post('/currency', function (req, res) {
  let { Id, TicketProvider } = req.body;
  let arr = currency.filter(obj => obj.Id == Id);
  res.json(arr);
});

app.post('/spaceValidity', function (req, res) {
  let { Id, TicketProvider } = req.body;
  let arr = spaceValidity.filter(obj => obj.Id == Id);
  res.json(arr);
});

app.post('/timeValidity', function (req, res) {
  let { Id, TicketProvider } = req.body;
  let arr = timeValidity.filter(obj => obj.Id == Id);
  res.json(arr);
});



let server = app.listen(PORT, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port)
});
