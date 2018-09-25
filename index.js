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
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.get('/', function (req, res) {
	res.send('Welcome to qos-bot API host!');
})

app.get('/live/test', function (req, res) {
	var device = 'Branch1';
	var command = 'system/uptime'; 
	var url = 'https://10.48.27.2:9182/vnms/dashboard/appliance/' + device + '/live?command=' + command;
	// var liveresp = syncRequest('GET', url);
	var liveresp = syncRequest('GET', url, {
		headers: {
			'Authorization': 'Basic QWRtaW5pc3RyYXRvcjpWZXJzYUAxMjM=',
			'Accept': 'application/json'
		},
	});
	var jsonStr = liveresp.body.toString('utf-8');
	var result = JSON.parse(jsonStr);
	console.log('uptime = ' + result.collection["system:uptime"][0]["svcuptime"]);
	res.send(result.collection["system:uptime"][0]["svcuptime"]);
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

		var url = 'https://207.47.61.70:9182/vnms/dashboard/appliance/' + device + '/live?command=' + command;
    	// var liveresp = syncRequest('GET', url);
		var liveresp = syncRequest('GET', url, {
			headers: {
				'Authorization': 'Basic QWRtaW5pc3RyYXRvcjpWZXJzYUAxMjM=',
				'Accept': 'application/json'
			},
		});
    	var jsonStr = liveresp.body.toString('utf-8');
		// var jsonStr = `{
		// 			    "collection": {
		// 				        "system:uptime": [
		// 				            {
		// 				                "starttime": "Fri Sep  7 10:50:07 2018",
		// 				                "svcuptime": "17 days, 12 hours, 10 minutes, 8 seconds",
		// 				                "date-time": "Mon Sep 24 23:00:09 2018",
		// 				                "svcuptime-msec": "1512608",
		// 				                "timezone": "America/Los_Angeles (PDT, --700)"
		// 				            }
		// 				        ]
		// 				    }
		// 				}`;
    	var result = JSON.parse(jsonStr);
    	console.log('uptime = ' + result.collection["system:uptime"][0]["svcuptime"]);
    	agent.add(result.collection["system:uptime"][0]["svcuptime"]);
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