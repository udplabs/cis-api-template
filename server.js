import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import OktaJwtVerifier from '@okta/jwt-verifier';
import config from './config.js';
import endpointHandlers from './endpointHandlers.js'
import webHookHandlers from './webHookHandlers.js'

dotenv.config();

const app = express();
app.use(cors());
const port = process.env.port || 3000;
const oktaJwtVerifier = new OktaJwtVerifier({issuer: process.env.ISSUER});

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


app.listen(port, () => console.log(`CIS API listening on port ${port}!`))