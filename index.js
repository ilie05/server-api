let express = require('express');
let apiReader = require('./apis/apiReader');

let app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

let validCardTickets, allowedTicketProviders, availableTariffs, saleTickets, orderTicket;

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



let server = app.listen(PORT, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port)
});
