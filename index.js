// const express = require('express');
// const path = require('path');
// const port = process.env.PORT || 5000;

// var app = express();

// app.get('/', function (req, res) {
//   res.send('hello world');
// })

// app.get('/live/:device/:command', function (req, res) {
//   res.send(req.params.command + ' for ' + req.params.device + ' is ' + Math.random());
// })

// app.get('/trivia', function (req, res) {
// 	var request = require('sync-request');
// 	var out = request('GET', 'http://numbersapi.com/random/trivia');
// 	res.send(out.body.toString('utf-8'))
// })

// app.listen(port, () => console.log(`qos-bot-api app listening on port ${port}!`))

// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))

//==============================

// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
// 'use strict';
 
// // const functions = require('firebase-functions');
// const {WebhookClient} = require('dialogflow-fulfillment');
// const {Card, Suggestion} = require('dialogflow-fulfillment'); 
// const express = require('express');
// const path = require('path');
// const port = process.env.PORT || 5000;

// var app = express();

// process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
// app.get('/', function (req, res) {
//   res.send('Welcome to qos-bot API host!');
// })

// app.post('/dialogflowFirebaseFulfillment', function (req, res) {

// 	console.log('request = ' + req);
// 	const agent = new WebhookClient({
// 	  request: req,
// 	  response: res
// 	});
// 	// console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
// 	// console.log('Dialogflow Request body: ' + JSON.stringify(req.body));

// 	function livestatus(agent) {
// 	  const device = agent.parameters.device;
// 	  const command = agent.parameters.command;
// 	  agent.add(`${command} for ${device} is ` + Math.random());
// 	}

//     function trivia(agent){
//       console.log("1");
//     	var trivia_req = require('sync-request');
//       console.log("2");
//     	var trivia_res = trivia_req('GET', 'http://numbersapi.com/random/trivia');
//       console.log("3");
//     	agent.add(trivia_res.body.toString('utf-8'));
//     }

// 	let intentMap = new Map();
// 	intentMap.set('live status', livestatus);
// 	intentMap.set('trivia', trivia);
// 	agent.handleRequest(intentMap);
// })

//=========================================

'use strict';

const {WebhookClient} = require('dialogflow-fulfillment');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



function welcome (agent) {
    agent.add(`Welcome to Express.JS webhook!`);
}

function fallback (agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
}

function WebhookProcessing(req, res) {
    const agent = new WebhookClient({request: req, response: res});
    console.info(`agent set`);

    let intentMap = new Map();
    intentMap.set('trivia', welcome);
    // intentMap.set('Default Fallback Intent', fallback);
// intentMap.set('<INTENT_NAME_HERE>', yourFunctionHandler);
    agent.handleRequest(intentMap);
}


// Webhook
app.post('/dialogflowFirebaseFulfillment', function (req, res) {
    console.info(`\n\n>>>>>>> S E R V E R   H I T <<<<<<<`);
    WebhookProcessing(req, res);
});


app.listen(port, () => console.log(`qos-bot-api app listening on port ${port}!`))

