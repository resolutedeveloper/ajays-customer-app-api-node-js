module.exports = (sequelize, DataTypes) => {
    const LocationCompanyMapping = sequelize.define("LocationCompanyMapping", {
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        LocationID: {
            type: DataTypes.INTEGER,
        },
        CompanyID: {
            type: DataTypes.INTEGER,
        }

    }, { timestamps: false });


    return LocationCompanyMapping;
}