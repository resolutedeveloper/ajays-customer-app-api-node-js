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
    let cityName = null;
    for (const city of cityData) {
        const distance = vincenty(lat1, lon1, parseFloat(city.latitude), parseFloat(city.longitude)); // Change between heversine and vincenty to measure accuracy
        if (distance <= 30) {
            cityName = city.name;
        }
    }
    // return 'City not found within the threshold.';

    if (!cityName) {
        return { status: false };
    }
    return {
        status: true,
        city: cityName
    }
}

// haversine formula to calculate distance between two points
function haversine(lat1, lon1, lat2, lon2) {
    const toRad = angle => (angle * Math.PI) / 180;

    const R = 6371; // Radius of Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// Vincenty formula to calculate distance between two points
function vincenty(lat1, lon1, lat2, lon2) {
    const a = 6378137.0; // Semi-major axis of the Earth in meters
    const f = 1 / 298.257223563; // Flattening of the Earth
    const b = (1 - f) * a; // Semi-minor axis

    const U1 = Math.atan((1 - f) * Math.tan(lat1 * (Math.PI / 180)));
    const U2 = Math.atan((1 - f) * Math.tan(lat2 * (Math.PI / 180)));
    const L = (lon2 - lon1) * (Math.PI / 180);
    let lambda = L;

    let sinU1 = Math.sin(U1);
    let cosU1 = Math.cos(U1);
    let sinU2 = Math.sin(U2);
    let cosU2 = Math.cos(U2);

    let sinLambda, cosLambda, sinSigma, cosSigma, sigma, sinAlpha, cosSqAlpha, cos2SigmaM;
    let lambdaP, iterLimit = 100;

    do {
        sinLambda = Math.sin(lambda);
        cosLambda = Math.cos(lambda);
        sinSigma = Math.sqrt((cosU2 * sinLambda) ** 2 + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) ** 2);
        cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
        sigma = Math.atan2(sinSigma, cosSigma);
        sinAlpha = (cosU1 * cosU2 * sinLambda) / sinSigma;
        cosSqAlpha = 1 - sinAlpha ** 2;
        cos2SigmaM = cosSigma - (2 * sinU1 * sinU2) / cosSqAlpha;
        const C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
        lambdaP = lambda;
        lambda = L + (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM ** 2)));
    } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);

    if (iterLimit === 0) {
        return NaN; // Formula failed to converge
    }

    const uSq = (cosSqAlpha * (a ** 2 - b ** 2)) / (b ** 2);
    const A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    const deltaSigma = B * sinSigma * (cos2SigmaM + (B / 4) * (cosSigma * (-1 + 2 * cos2SigmaM ** 2) - (B / 6) * cos2SigmaM * (-3 + 4 * sinSigma ** 2) * (-3 + 4 * cos2SigmaM ** 2)));

    const distance = b * A * (sigma - deltaSigma); // Distance in meters
    return distance / 1000; // Convert to kilometers
}

module.exports = { distanceCalculator, timeCalculator, getCityName };