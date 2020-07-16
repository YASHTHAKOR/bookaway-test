const {getToken} = require('./helpers/oauth');
const {
    getAllStations,
    getTripsBetweenStations,
    getTransferDetails,
    createBooking,
    payforBooking,
    checkBookingConfirmation
} = require('./helpers/bookings');
const {
    getRemainingCredits
} = require('./helpers/profile');
const {
    CITY_NAMES: {
        HANOI,
        SAPA
    }
} = require('./config/constants');

const tokenConfig = require('./config/token');


const runScript = async () => {
    let token = await getToken();

    console.log('token', token);

    tokenConfig.setToken(`Bearer ${token}`);

    let stations = await getAllStations();

    const hanoiStations = stations.filter((station) => {
        return station.city.city === HANOI
    });
    const sapaStations = stations.filter((station) => {
        return station.city.city === SAPA
    });

    console.log('Count of Hanoi Stations: ' + hanoiStations.length);

    console.log('Count of Sapa Stations: ' + sapaStations.length);

    const trips = await getTripsBetweenStations([hanoiStations[0].stationId], [sapaStations[0].stationId], '2020-07-26', 2);

    const tripsData = trips.data.filter((a) => a.isAvailable);

    tripsData.sort((a, b) => {

        if (a.price.amount === b.price.amount) {
            return new Date(a.arrival.data).getTime() - new Date(b.arrival.data).getTime()
        }

        return a.price.amount - b.price.amount
    });


    let selectedTrip = null;

    tripsData.some((trip) => {
        if(trip.isInstantConfirmation) {
            selectedTrip = trip;
            return true;
        }
    });

    if(!selectedTrip) { // If no instant conformation in done
        selectedTrip =  tripsData[0];
    }

    const credits = await getRemainingCredits();

    console.log('Remaining Credits', credits);


    // const getTranferDetails = getTransferDetails(tripsData[0].transferId);

    let bookingInfo = await createBooking({
        tripId: selectedTrip.id,
        passengers: [
            {
                firstName: "YASh",
                lastName: "Thakor",
                extraInfos: [
                    {
                        "definition": "58acdc6eb626ad00060bcea3",
                        "value": "Indian"
                    }
                ]
            },
            {
                firstName: "YASh1",
                lastName: "Thakor1",
                extraInfos: [
                    {
                        "definition": "58acdc6eb626ad00060bcea3",
                        "value": "Indian"
                    }]
            }
        ],
        contact: {
            email: "yashthakor4595@gmail.com",
            phone: "+91 (814) 045-4011"
        }
    });

    console.log('Booking reference: ' + bookingInfo.reference);


    await payforBooking(bookingInfo.id);

    await checkBookingConfirmation(bookingInfo.id); // call the api every 5 seconds

    const finalCredits = await getRemainingCredits();

    console.log('final Credits', finalCredits);

};


runScript();
