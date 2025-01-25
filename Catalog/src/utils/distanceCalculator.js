const axios = require("axios");
const cityData = require("../data/city.json");

// helper function to calcuate distance in km
function distanceCalculator(lat1, lon1, lat2, lon2) {
    // lat1 & lon1 -> Users latitude and longitude | Lat2 & lon2 -> Outlet latitude and longitude

    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(parseFloat(lat2) - parseFloat(lat1));
    const dLon = toRad(parseFloat(lon2) - parseFloat(lon1));
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(parseFloat(lat1))) * Math.cos(toRad(parseFloat(lat2))) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}


// helper function to calculate time
function timeCalculator(distance, speed) {
    return (distance / speed) * 60;
}

// helper function to get city name based on latitude and longitude
function getCityName(lat, long) {
    const lat1 = parseFloat(lat);
    const lon1 = parseFloat(long);

    const cityDesc = cityData.find(
        (city) => parseFloat(city.latitude) == lat1 && parseFloat(city.longitude) == lon1
    );
    const cityName = cityDesc?.name;

    if (!cityName) {
        return { status: false };
    }
    return {
        status: true,
        city: cityName
    }
}

module.exports = { distanceCalculator, timeCalculator, getCityName };