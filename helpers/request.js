const request = require('request-promise');


const apiPost = async (url, payload, headers) => {

    let options = {
        method: 'POST',
        uri: url,
        body: payload,
        json: true,
        headers
    };

    let response = await request.post(options);

    return response;

};

const apiGet = async (url, headers) => {

    let options = {
        method: 'GET',
        uri: url,
        headers
    };
    let response = await request.get(options);

    return response;
};

module.exports = {
    apiPost,
    apiGet
}
