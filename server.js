const express = require('express');
const app = express();
const port = 8000;
const server = app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
let cors = require('cors');
let querystring = require('querystring');
let cookieparser = require('cookie-parser');
let request = require('request');
const { emitWarning } = require('process');

app.use(express.static(__dirname + "/public"))
    .use(cors())
    .use(cookieparser());

let credentials = {
    clientId: "1da8d85a91c241f68b2e046b6e89d8b3",
    clientSecret: "65ad6e1ee89d49c789ea66ed9273c5c4",
    redirectUrl: "http://localhost:8000/auth"
}


let generateRandomString = length => {
    let text = '';
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

let stateKey = 'spotify_auth_state';

app.get('/login', (req, res, next) => {
    let state = generateRandomString(16);
    res.cookie(stateKey, state);

    let scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: credentials.clientId,
            scope: scope,
            redirect_uri: credentials.redirectUrl,
            state: state
        }));
});


app.get('/auth', (req, res, next) => {

    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: credentials.redirectUrl,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(credentials.clientId + ':' + credentials.clientSecret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let access_token = body.access_token,
                    refresh_token = body.refresh_token;

                let options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                request.get(options, (error, response, body) => {
                    console.log(body);
                });

                res.redirect('/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    })
                );
            }
        })

    }
});

app.get('/refresh_token', (req, res, next) => {
    let refresh_token = req.query.refresh_token;
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorizations': 'Basic ' + (new Buffer(credentials.clientId + ':' + credentials.clientSecret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            let access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});