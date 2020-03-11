let express = require('express');
let apiReader = require('./apis/apiReader');

let app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

let validCardTickets, allowedTicketProviders, availableTickets;
apiReader.readFile('validCardTicketsDb').then(data => {
  validCardTickets = JSON.parse(data);
});

apiReader.readFile('allowedTicketProvidersDb').then(data => {
  allowedTicketProviders = JSON.parse(data);
});

apiReader.readFile('availableTicketsDb').then(data => {
    availableTickets = JSON.parse(data);
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

app.post('/availableTickets', function (req, res) {
  let {cardSRN, Provider, TicketProvider} = req.body;
  let arr = availableTickets.filter(obj => obj.TicketProvider == TicketProvider);
  res.json(arr);
});



let server = app.listen(PORT, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port)
});
