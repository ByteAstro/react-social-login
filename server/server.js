import express, { response } from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200, // For legacy browser support
}));
app.use(bodyParser.json());

app.get('/getAccessToken', async (req, res) => {
    await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            client_id: process.env.GITHUBLOGIN_CLIENTID,
            client_secret: process.env.GITHUBLOGIN_CLIENTSECRET,
            code: req.query.githublogincode,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            return res.json(data);
        })
})

app.get('/getUserDetails', async (req, res) => {
    req.get('Authorization');
    await fetch("https://api.github.com/user", {
        method: 'GET',
        headers: {
            Authorization: req.get('Authorization')
        }
    })
        .then((response) => response.json())
        .then((data) => {
            return res.json(data);
        })
})

app.listen(4500, () => {
    console.log(`Server running on port: 4500`);
})