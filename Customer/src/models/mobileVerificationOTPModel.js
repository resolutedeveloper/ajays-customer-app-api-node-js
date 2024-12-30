module.exports = (sequelize ,DataTypes) =>{
    const mobileVerificationOTPModel = sequelize.define("mobileVerificationOTP" ,{
        MobileVerificationOTPID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true
        },
        CustomerID:{
            type: DataTypes.UUID,
            allowNull: true
        },
        PhoneNumber:{
            type: DataTypes.TEXT,
            allowNull:false
        },
        OTP:{
            type: DataTypes.INTEGER(6),
            allowNull: false
        },
        IsStatus:{
            type: DataTypes.BOOLEAN,
            allowNull:false
        },
        CreatedOn:{
            type:DataTypes.DATE,
            allowNull:true
        },
        UsedOn:{
            type:DataTypes.DATE,
            allowNull:true
        },
        ExpiredOn:{
            type:DataTypes.DATE,
            allowNull:true
        },
    },{
        timestamps:false,
    });
    return mobileVerificationOTPModel;
}