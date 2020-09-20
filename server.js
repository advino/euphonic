// Dependancies lmao
const express = require('express');
const app = express();
const port = 8000;
const server = app.listen(port, () => {
    console.log(`Server deployed on port ${port}`);
});
const request = require('request');
const cors = require('cors');
const helper = require('./helpers/helper.js');

// Firebase Admin for accessing Cloud Firestore
const admin = require('firebase-admin');
let serviceAccount = require('./tokens/euphonic-1c721-firebase-adminsdk-roi21-3087f18727.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://euphonic-1c721.firebaseio.com"
});
const db = admin.firestore();

app.use(express.static(__dirname + '/public'));

// Spotify client info for API calls
let SPOTIFY_CLIENT = {
    id: '1da8d85a91c241f68b2e046b6e89d8b3',
    secret: '65ad6e1ee89d49c789ea66ed9273c5c4'
}

// Authorization paramters for Spotify Web Token
let AUTH_OPTIONS = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (new Buffer(SPOTIFY_CLIENT.id + ':' + SPOTIFY_CLIENT.secret).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};

// Firebase reference for song submissions
const SUBMISSIONS_REF = db.collection('submissions');

// Get all submissions from Firebase
app.get('/submissions', async (req, res, next) => {
    try {
        // Reference submissions collection
        let snapshot = await db.collection('submissions').get();
        // Pull object data and push to array
        let submissions = [];
        snapshot.forEach(item => {
            let data = item.data();
            submissions.push(data);
        });
        // Clean data to contain only essentials
        let pubData = submissions.map(item => {
            return {
                name: item.name,
                id: item.id,
                url: item.url,
                x: item.x,
                y: item.y
            }
        });
        // Return response
        res.send(pubData);
    } catch (err) {
        // Log errors
        console.log("Error in retrieving data from firebase");
        console.log(err);
        // Return response
        res.status(404).end();
    }
});

// Spotify search endpoint
app.get('/spotifysearch', async (req, res, next) => {
    try {

        // Generate one-time auth token
        let token = await helper.generateToken(AUTH_OPTIONS);
        // Paramters for search request (track focused)
        let options = {
            url: `https://api.spotify.com/v1/search?q=${req.query.q}&type=track&limit=5`,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }

        // Making request to API
        request.get(options, (error, response, body) => {
            let b = JSON.parse(body);
            let cleaned = helper.cleanData(b);
            res.send(cleaned);
        });
    } catch (err) {
        console.log("Error retrieving data from Spotify");
        console.error(err);
    }
});



