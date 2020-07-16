const {
    apiPost,
    apiGet
} = require('./request');

const tokenConfig =  require('../config/token');
const {
    BOOKING_BASE_URL
} = require('../config/constants');

const getRemainingCredits = async () => {
    const response = await apiGet(`${BOOKING_BASE_URL}/credits`, {
        Authorization: tokenConfig.getToken()
    });

    return JSON.parse(response);
};

module.exports= {
    getRemainingCredits
};
