const express = require('express');
const path = require('path');
const port = process.env.PORT || 5000;

var app = express();

app.get('/', function (req, res) {
  res.send('hello world');
})

app.get('/live/:device/:command', function (req, res) {
  res.send(req.params.command + ' for ' + req.params.device + ' is ' + Math.random());
})

app.get('/trivia', function (req, res) {
	var request = require('sync-request');
	var out = request('GET', 'http://numbersapi.com/random/trivia');
	res.send(out.body.toString('utf-8'))
})

app.listen(port, () => console.log(`qos-bot-api app listening on port ${port}!`))

// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))
