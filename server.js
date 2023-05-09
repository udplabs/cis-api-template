const express = require('express');
const cors = require('cors');
const OktaJwtVerifier = require('@okta/jwt-verifier');

const config = require('./config.js');
const endpointHandlers = require('./endpointHandlers.js');
const webHookHandlers = require('./webHookHandlers.js');

const app = express();
app.use(cors());
const port = 3000;

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: config.OKTA_ISSUER,
  clientId: config.OKTA_CLIENT_ID
});


app.get('/', (req, res) => {
  res.send('This is the token hook API');
});


app.get('/api/public', (req, res) => {
    endpointHandlers.handlePublic(req, res);
});


app.get('/api/private', (req, res) => {
    endpointHandlers.handlePrivate(req, res, oktaJwtVerifier);
});


app.get('/api/scoped', (req, res) => {
    endpointHandlers.handleScoped(req, res, oktaJwtVerifier);
});


app.get('/api/access', (req, res) => {
  endpointHandlers.handleAccess(req, res, oktaJwtVerifier);
});


app.post('/api/access-hook', (req, res) => {
  webHookHandlers.tokenHandler(req, res);
});


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))