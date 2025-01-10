const db = require('../models/index');
const appversioncheck = async (req, res) => {
    try {
        const latestVersion = await db.VersionManagement.findOne({
            order: [['LaunchTime', 'DESC']],
        });

        if (!latestVersion) {
            return res.status(404).send({ "Message": "No version information found." });
        }

        const VersionExistCheck = await db.VersionManagement.count({
            where: { VersionID: req.body.Version },
        });
       
        if (VersionExistCheck > 0) {
            const versionExists = await db.VersionManagement.findOne({
                where: { VersionID: req.body.Version },
            });

            const currentVersionID = await db.VersionManagement.findOne({
                attributes: ['VersionManagementID'],
                where: { VersionID: req.body.Version },
            });
            const versionSupportCount = await db.VersionManagementSupport.count({
                where: {
                    VersionManagementID: versionExists.dataValues.VersionManagementID,
                    VersionID: latestVersion.dataValues.VersionManagementID,
                },
            });

            if (versionSupportCount == 0) {
                return res.status(200).send({
                    "Update": "Yes",
                    "Status": 1,
                    "Message": latestVersion,
                });
            } else {
                if (latestVersion.dataValues.VersionID == req.body.Version) {
                    return res.status(200).send({
                        "Update": "No",
                        "Status": 0,
                        "Message": latestVersion,
                    });
                } else {
                    return res.status(200).send({
                        "Update": "Yes-No",
                        "Status": 2,
                        "Message": latestVersion,
                    });
                }
            }
        } else {
            return res.status(400).send({ "ErrorCode": "NOLOGIN", "ErrorMessage": "Not Login" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ "Message": error.message });
    }
};
module.exports = ({ appversioncheck })