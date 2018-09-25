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

// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
// const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment'); 
const express = require('express');
const path = require('path');
const port = process.env.PORT || 5000;

var app = express();

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
app.post('/dialogflowFirebaseFulfillment', function (req, res) {

	const agent = new WebhookClient({ request, response });
	console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
	console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

	function livestatus(agent) {
	  const device = agent.parameters.device;
	  const command = agent.parameters.command;
	  agent.add(`${command} for ${device} is ` + Math.random());
	}

    function trivia(agent){
      console.log("1");
    	var request = require('sync-request');
      console.log("2");
    	var out = request('GET', 'http://numbersapi.com/random/trivia');
      console.log("3");
    	agent.add(out.body.toString('utf-8'));
    }

	let intentMap = new Map();
	intentMap.set('live status', livestatus);
	intentMap.set('trivia', trivia);
	agent.handleRequest(intentMap);
})

app.listen(port, () => console.log(`qos-bot-api app listening on port ${port}!`))

// exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
//   const agent = new WebhookClient({ request, response });
//   console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
//   console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
// //   function welcome(agent) {
// //     agent.add(`Welcome to my agent!`);
// //   }
 
// //   function fallback(agent) {
// //     agent.add(`I didn't understand`);
// //     agent.add(`I'm sorry, can you try again?`);
// //   }

//   function livestatus(agent) {
//       const device = agent.parameters.device;
//       const command = agent.parameters.command;
//       agent.add(`${command} for ${device} is ` + Math.random());
//   }
  
// //   function trivia(agent) {
// //         const Http = new XMLHttpRequest();
// //         const url='http://numbersapi.com/random/trivia';
// //         Http.open("GET", url);
// //         Http.send();
// //         Http.onreadystatechange=(e)=>{
// //             agent.add(Http.responseText)
// //         }
        
        
// //   }

//     function trivia(agent){
//       console.log("1");
//     	var request = require('sync-request');
//       console.log("2");
//     	var out = request('GET', 'http://numbersapi.com/random/trivia');
//       console.log("3");
//     	agent.add(out.body.toString('utf-8'));
//     }

//   // // Uncomment and edit to make your own intent handler
//   // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
//   // // below to get this function to be run when a Dialogflow intent is matched
//   // function yourFunctionHandler(agent) {
//   //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
//   //   agent.add(new Card({
//   //       title: `Title: this is a card title`,
//   //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
//   //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
//   //       buttonText: 'This is a button',
//   //       buttonUrl: 'https://assistant.google.com/'
//   //     })
//   //   );
//   //   agent.add(new Suggestion(`Quick Reply`));
//   //   agent.add(new Suggestion(`Suggestion`));
//   //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
//   // }

//   // // Uncomment and edit to make your own Google Assistant intent handler
//   // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
//   // // below to get this function to be run when a Dialogflow intent is matched
//   // function googleAssistantHandler(agent) {
//   //   let conv = agent.conv(); // Get Actions on Google library conv instance
//   //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
//   //   agent.add(conv); // Add Actions on Google library responses to your agent's response
//   // }
//   // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
//   // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

//   // Run the proper function handler based on the matched Dialogflow intent name
//   let intentMap = new Map();
// //   intentMap.set('Default Welcome Intent', welcome);
// //   intentMap.set('Default Fallback Intent', fallback);
//   intentMap.set('live status', livestatus);
//   intentMap.set('trivia', trivia);
//   // intentMap.set('your intent name here', yourFunctionHandler);
//   // intentMap.set('your intent name here', googleAssistantHandler);
//   agent.handleRequest(intentMap);
// });
