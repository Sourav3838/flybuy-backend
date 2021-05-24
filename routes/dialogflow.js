import express from 'express';
const apiRoute = express.Router();
// import structjson from './structjson.js';
import dialogflow from 'dialogflow';
import Queries from '../dbQuery.js';
import uuid from 'uuid';

const projectId = 'graceful-tenure-286415';
const sessionId = 'bot-session';
const languageCode = 'en-US';

// Create a new session
const sessionClient = new dialogflow.SessionsClient({
	keyFilename: './graceful-tenure-286415-4fc96ea80ad4.json',
});
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// We will make two routes

// Text Query Route

apiRoute.post('/textQuery/:userId', async (req, res) => {
	//We need to send some information that comes from the client to Dialogflow API
	// The text query request.
	const { userId } = req.params;
	const request = {
		session: sessionPath,
		queryInput: {
			text: {
				// The query to send to the dialogflow agent
				text: req.body.text,
				// The language used by the client (en-US)
				languageCode: languageCode,
			},
		},
	};

	// Send request and log result
	const responses = await sessionClient.detectIntent(request);
	console.log('Detected intent');
	const result = responses[0].queryResult;
	console.log(`  Query: ${result.queryText}`);
	console.log(`  Response: ${result.fulfillmentText}`);
	if (result.fulfillmentText.includes('we will get back to you soon')) {
		const data = {
			userId: userId,
			query: result.parameters,
			status: 'Open',
			admin_comment: '',
		};

		Queries.create(data, (err, data) => {
			if (err) {
				console.log(`error occurred while saving a query`);
			} else {
				console.log(`data`, data);
			}
		});

		console.log(`it includes`, result.parameters);
	}
	res.send(result);
});

//Event Query Route

apiRoute.post('/eventQuery/:userId', async (req, res) => {
	//We need to send some information that comes from the client to Dialogflow API
	// The text query request.
	const request = {
		session: sessionPath,
		queryInput: {
			event: {
				// The query to send to the dialogflow agent
				name: req.body.event,
				// The language used by the client (en-US)
				languageCode: languageCode,
			},
		},
	};

	// Send request and log result
	const responses = await sessionClient.detectIntent(request);
	console.log('Detected intent');
	const result = responses[0].queryResult;
	console.log(`  Query: ${result.queryText}`);
	console.log(`  Response: ${result.fulfillmentText}`);

	res.send(result);
});

export default apiRoute;
