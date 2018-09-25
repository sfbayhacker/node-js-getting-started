const express = require('express')
const path = require('path')
const port = process.env.PORT || 5000

var app = express()

app.get('/', function (req, res) {
  res.send('hello world')
})

app.get('/live/:device/:command', function (req, res) {
  res.send(req.params.command + ' for ' + req.params.device + ' is ' + Math.random())
})

app.get('/trivia', function (req, res) {
	var request = new XMLHttpRequest();
	request.open('GET', 'http://numbersapi.com/random/trivia', false);  // `false` makes the request synchronous
	request.send(null);

	if (request.status === 200) {
	  	return request.responseText;
	} else {
		return "Sorry, unable to play trivia right now!";
	}

	// res.send('5600 is the number of metres above sea level of the highest bridge in the world, located in the Himalayan mountains.')
})

app.listen(port, () => console.log(`qos-bot-api app listening on port ${port}!`))

// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))
