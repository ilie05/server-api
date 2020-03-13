let express = require('express');
let apiReader = require('./apis/apiReader');

let app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

let validCardTickets, allowedTicketProviders, availableTariffs, saleTickets, orderTicket, cancelOrderTicket, payOrderTicket;
let paymentGateway;

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


app.get('/', function (req, res) {

  console.log("Got a GET request for the homepage");
  res.json(validCardTickets);
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



let server = app.listen(PORT, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port)
});
