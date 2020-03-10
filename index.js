let express = require('express');
let faker = require('faker');
let fs = require('fs');

let app = express();
const PORT = process.env.PORT || 5000;
const LIMIT = 1000;

let validCardTickets = [];

for (let index = 0; index < LIMIT; index++) {

  let cardSRN = faker.random.uuid();
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

app.get('/', function (req, res) {
  console.log("Got a GET request for the homepage");
  res.json(validCardTickets);
});


// This responds a POST request for the homepage
app.post('/', function (req, res) {
  console.log("Got a POST request for the homepage");
  res.send('Hello POST');
});

// This responds a GET request for the /list_user page.
app.get('/list_user', function (req, res) {
  console.log("Got a GET request for /list_user");
  res.send('Page Listing');
});

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get('/ab*cd', function(req, res) {
  console.log("Got a GET request for /ab*cd");
  res.send('Page Pattern Match');
});

let server = app.listen(PORT, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port)
});