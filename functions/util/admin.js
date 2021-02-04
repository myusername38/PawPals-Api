const { credential } = require('firebase-admin');
const admin = require('firebase-admin');
const credentials = require('../adminConfig.js');

admin.initializeApp({
    databaseURL: "'https://redredistribution.firebaseio.com'",
    credential: admin.credential.cert(credentials),
});

const db = admin.firestore();

module.exports = { admin, db };