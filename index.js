let express = require('express');
let apiReader = require('./apis/apiReader');

let app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

let validCardTickets, allowedTicketProviders;
apiReader.readFile('validCardTicketsDb').then(data => {
  validCardTickets = JSON.parse(data);
});

apiReader.readFile('allowedTicketProvidersDb').then(data => {
  allowedTicketProviders = JSON.parse(data);
});


app.get('/', function (req, res) {
  apiReader.readFile('validCardTicketsDb').then(data => {
    fileContent = JSON.parse(data);
  });
  console.log("Got a GET request for the homepage");
  res.json(validCardTicketsDb);
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



let server = app.listen(PORT, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port)
});
