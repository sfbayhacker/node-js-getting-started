'use strict';
 
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment'); 
const express = require('express');
const path = require('path');
const port = process.env.PORT || 5000;

const bodyParser = require('body-parser');
const syncRequest = require('sync-request');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
app.get('/', function (req, res) {
	res.send('Welcome to qos-bot API host!');
})

app.post('/dialogflowFirebaseFulfillment', function (req, res) {

	// console.log('request = ' + req);
	// console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
	// console.log('Dialogflow Request body: ' + JSON.stringify(req.body));

	const agent = new WebhookClient({
		request: req,
		response: res
	});

	function random(agent) {
		const device = agent.parameters.device;
		const command = agent.parameters.command;
		agent.add(`${command} for ${device} is ` + Math.random());
	}

	function livestatus() {
		const device = agent.parameters.device;
		const command = agent.parameters.command;
    	var trivia_res = syncRequest('GET', 'http://numbersapi.com/random/trivia');
    	agent.add(trivia_res.body.toString('utf-8'));
	}

    function trivia(agent){
    	var trivia_res = syncRequest('GET', 'http://numbersapi.com/random/trivia');
    	agent.add(trivia_res.body.toString('utf-8'));
    }

	let intentMap = new Map();
	intentMap.set('live status', random);
	intentMap.set('trivia', trivia);
	agent.handleRequest(intentMap);
})

app.listen(port, () => console.log(`qos-bot-api app listening on port ${port}!`))