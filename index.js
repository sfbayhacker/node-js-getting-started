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

app.get('/live/dummy', function (req, res) {
	var payload = '{\
					    "collection": {\
						        "system:uptime": [\
						            {\
						                "starttime": "Fri Sep  7 10:50:07 2018",\
						                "svcuptime": "17 days, 12 hours, 10 minutes, 8 seconds",\
						                "date-time": "Mon Sep 24 23:00:09 2018",\
						                "svcuptime-msec": 1512608,\
						                "timezone": "America/Los_Angeles (PDT, --700)"\
						            }\
						        ]\
						    }\
						}';
	res.send(payload);
})

app.get('/live/:device', function (req, res) {
	var command = req.query.command;
	res.send('Sorry, not implemented yet!');
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
		//var url = '/live/' + device + '?command=' + command;
    	// var liveresp = syncRequest('GET', url);
    	// var jsonStr = liveresp.body.toString('utf-8');
		var jsonStr = `{
					    "collection": {
						        "system:uptime": [
						            {
						                "starttime": "Fri Sep  7 10:50:07 2018",
						                "svcuptime": "17 days, 12 hours, 10 minutes, 8 seconds",
						                "date-time": "Mon Sep 24 23:00:09 2018",
						                "svcuptime-msec": "1512608",
						                "timezone": "America/Los_Angeles (PDT, --700)"
						            }
						        ]
						    }
						}`;
    	console.log(jsonStr);
    	var result = JSON.parse(jsonStr);
    	console.log(JSON.stringify(result));
    	console.log('uptime = ' + result.collection["system:uptime"]["svcuptime"]);
    	agent.add(result.collection["system:uptime"]["svcuptime"]);
	}

    function trivia(agent){
    	var trivia_res = syncRequest('GET', 'http://numbersapi.com/random/trivia');
    	agent.add(trivia_res.body.toString('utf-8'));
    }

	let intentMap = new Map();
	intentMap.set('live status', livestatus);
	intentMap.set('trivia', trivia);
	agent.handleRequest(intentMap);
})

app.listen(port, () => console.log(`qos-bot-api app listening on port ${port}!`))