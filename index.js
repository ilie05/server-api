let express = require('express');
let apiReader = require('./apis/apiReader');

let app = express();
const PORT = process.env.PORT || 5000;

let fileContent;


apiReader.readFile('validCardTicketsDb').then(data => {
  fileContent = JSON.parse(data);
});

app.get('/', function (req, res) {
  console.log("Got a GET request for the homepage");
  res.json(fileContent);
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