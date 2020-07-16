const dotEnv = require('dotenv');
const path = require('path');

let envPath = path.join(__dirname, '../.env');

dotEnv.config({path: envPath})

const {
    apiPost,
} = require('./request');

const constants = require('../config/constants');


const getToken = async () => {
    const response = await apiPost(constants.OAUTH_URL, {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        scope: "b2b",
        grant_type: "client_credentials"
    }, {
        "Content-Type": "application/json"
    });

    return response.access_token;
};

module.exports = {
    getToken
};
