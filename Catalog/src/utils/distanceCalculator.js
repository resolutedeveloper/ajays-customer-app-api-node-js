const axios = require("axios");

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


// helper function to get city name
async function getCityName(lat, long) {
    try {
        const lat1 = parseFloat(lat);
        const lon1 = parseFloat(long);
        const cityDesc = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat1}&lon=${lon1}&format=json`);
        const cityName = cityDesc?.address?.city ? cityDesc?.address?.city : cityDesc?.address?.town ? cityDesc?.address?.town : cityDesc?.address?.village ? cityDesc?.address?.village : null;
        if (!cityName) {
            return { status: false };
        }
        return {
            status: true,
            city: cityName
        }
    } catch (error) {
        console.log(error);
        return { status: false };
    }
}

module.exports = { distanceCalculator, timeCalculator, getCityName };