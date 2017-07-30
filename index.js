const express = require('express')
const app = express()
const path = require('path');

app.use(express.static('public'))
app.use('/scripts', express.static(__dirname + '/node_modules/matter-js/build/'));
app.use('/jq', express.static(__dirname + '/node_modules/jquery/dist/'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})