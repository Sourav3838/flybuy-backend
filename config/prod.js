module.exports = {
	googleProjectID: 'graceful-tenure-286415',
	dialogFlowSessionID: process.env.DIALOGFLOW_SESSION_ID,
	dialogFlowSessionLanguageCode: process.env.DIALOGFLOW_LANGUAGE_CODE,
	googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL,
	googlePrivateKey: JSON.parse(process.env.GOOGLE_PRIVATE_KEY),
	mongoURI: process.env.MONGO_URI,
};
