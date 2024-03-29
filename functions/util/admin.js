const admin = require('firebase-admin');
const credentials = require('../adminConfig.js');

admin.initializeApp({
    databaseURL: "'pawpals-api.firebaseapp.com'",
    credential: admin.credential.cert(credentials),
});

const db = admin.firestore();

module.exports = { admin, db };