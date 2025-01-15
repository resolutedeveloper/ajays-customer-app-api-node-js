module.exports = (sequelize, DataTypes) => {
    const itemTaxDetModel = sequelize.define("ItemTaxDet", {
        ItemID: {
            type: DataTypes.INTEGER
        },
        BatchID: {
            type: DataTypes.INTEGER,
        },
        TaxDefID: {
            type: DataTypes.INTEGER,
        },
        IsInclusive: {
            type: DataTypes.BOOLEAN,
        },
        CompanyID: {
            type: DataTypes.INTEGER,
        }

    }, { timestamps: false });


    return itemTaxDetModel;
}