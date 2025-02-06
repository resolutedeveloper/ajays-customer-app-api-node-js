const { db } = require('../models');
const { distanceCalculator, timeCalculator } = require("../utils/distanceCalculator");

async function getCityOutletsById(req, res) {
    try {
        const { cityId, latitude, longitude } = req.query;
        if (!cityId || !latitude || !longitude) {
            return res.status(404).json({
                message: "Invalid arguments"
            })
        }

        const cityForOutlet = await db.location.findAll({
            where: { CityId: cityId },
            include: [
                { model: db.LocationCompanyMapping, attributes: ['CompanyID'], }
            ],
            raw: true,
            nest: false
        });

        if (cityForOutlet && cityForOutlet.length == 0) {
            return res.status(200).json({
                message: 'fetched success',
                locations: cityForOutlet
            });
        }

        const dataWithDistance = cityForOutlet.map((locationDb) => {
            const dist = distanceCalculator(latitude, longitude, locationDb.Latitude ? locationDb.Latitude : 0, locationDb.Longitude ? locationDb.Longitude : 0);
            const t = timeCalculator(dist, 40); // 40 km / hrs

            locationDb.Distance = `${dist} km`;
            locationDb.Duration = `${t} minutes`;
            return locationDb;
        })
        return res.status(200).json({
            message: 'fetched success',
            locations: dataWithDistance
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Sorry! There was an server-side error',
            error: error
        });
    }
}

module.exports = { getCityOutletsById };