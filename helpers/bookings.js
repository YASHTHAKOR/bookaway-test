const {
    apiPost,
    apiGet
} = require('./request');

const {
    BOOKING_BASE_URL
} = require('../config/constants');

const tokenConfig =  require('../config/token');

const getAllStations = async () => {

    const response = await apiGet(`${BOOKING_BASE_URL}/stations`, {
        Authorization: tokenConfig.getToken()
    });

    return JSON.parse(response);


};

const getTripsBetweenStations = async (departureStation, arrivalStation, date, passengers) => {
    let paramString = `departure=${date}&passengers=${passengers}`;

    departureStation.forEach((stationId) => {
        paramString+=`&departureStation=${stationId}`
    });
    arrivalStation.forEach((stationId) => {
        paramString+=`&arrivalStation=${stationId}`
    });

    const response = await apiGet(`${BOOKING_BASE_URL}/trips?${paramString}`, {
        Authorization: tokenConfig.getToken()
    });

    return JSON.parse(response);

};

const getTransferDetails = async (transferId) => {
    const response = await apiGet(`${BOOKING_BASE_URL}/transfers`, {
        Authorization: tokenConfig.getToken()
    });

    let transferDetails =  JSON.parse(response);

    transferDetails = transferDetails.filter((transfer) => transferId === transfer.id);

    return transferDetails;
};

const bookTripStatus = async (bookingId) => {
        let response = await apiGet(`${BOOKING_BASE_URL}/bookings/${bookingId}`, {
            Authorization: tokenConfig.getToken()
        });

        let bookingInfo = JSON.parse(response);

        return bookingInfo.status === 'approved';

};



const checkBookingConfirmation = (bookingId) => {
    return new Promise((resolve, reject) => {
        let initialTime = new Date().getTime();

        let isConfirmed = false;

        let intervalId = setInterval(async () => {

            if(new Date().getTime()- initialTime >= 120000 || isConfirmed) {
                clearInterval(intervalId);
                return resolve(isConfirmed);
            }

            isConfirmed = await  bookTripStatus(bookingId);
        }, 5000);
    });

};

const createBooking = async (bookingInfo) => {

    let response = await apiPost(`${BOOKING_BASE_URL}/bookings`, bookingInfo, {
        Authorization: tokenConfig.getToken()
    });

    return response;

};

const payforBooking = async (bookingId) => {
    let response = await apiPost(`${BOOKING_BASE_URL}/bookings/${bookingId}/pay`, {}, {
        Authorization: tokenConfig.getToken()
    });

    return response;

};

module.exports =  {
    getAllStations,
    getTripsBetweenStations,
    bookTripStatus,
    checkBookingConfirmation,
    getTransferDetails,
    createBooking,
    payforBooking
};
