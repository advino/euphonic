const express = require('express');
const app = express();
const port = 8000;
const server = app.listen(port, () => {
    console.log(`Server deployed on port ${port}`);
});

let request = require('request');
let cors = require('cors');

app.use(express.static(__dirname + '/public'));

let client_id = '1da8d85a91c241f68b2e046b6e89d8b3';
let client_secret = '65ad6e1ee89d49c789ea66ed9273c5c4';

let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};


app.get('/euphonic', async (req, res, next) => {
    try {
        let token = await generateToken(authOptions);
        let options = {
            url: `https://api.spotify.com/v1/playlists/4VPnm1uyzUTnmLnbqq6xZd/tracks`,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }

        request.get(options, (error, response, body) => {
            let b = JSON.parse(body);
            res.send(b);
        });
    } catch {

    }
});

function generateToken(options) {
    let token;
    request.post(options, (error, response, body) => {

        token = body.access_token;
    });

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(token)
        }, 1000);
    });
}