module.exports = (sequelize, DataTypes)=>{
    const companyModel = sequelize.define("Companies",{
        CompanyID:{
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        CompanyName:{
            type: DataTypes.STRING(300),
        },
    CompanySName:{
        type: DataTypes.STRING(500),
    },
    CompanyLogo:{
        type: DataTypes.STRING(10000),
    },
    ContactNo1:{
        type: DataTypes.STRING(300),
    },
    ContactNo2:{
        type: DataTypes.STRING(300),
    },
    Address:{
        type: DataTypes.STRING(500),
    },
    AddressLine2:{
        type: DataTypes.STRING(500),
    },
    AddressLine3:{
        type: DataTypes.STRING(500),
    },
    GSTNo:{
        type: DataTypes.STRING(500),
    },
    GSTWEF:{
        type: DataTypes.DATE,
    },
    IsVisible:{
        type: DataTypes.BOOLEAN,
    },
    Remarks:{
        type: DataTypes.STRING(500),
    },
    MarchantID:{
        type: DataTypes.STRING(500),
    },
    },{timestamps: false});

    return companyModel;
}