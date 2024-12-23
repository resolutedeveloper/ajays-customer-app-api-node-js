module.exports = (sequelize ,DataTypes) =>{
    const emailVerificationOTPModel = sequelize.define("emailVerificationOTP" ,{
        EmailVerificationOTPID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, 
            primaryKey: true
        },
        CustomerID:{
            type: DataTypes.UUID,
            allowNull: false
        },
        EmailID:{
            type:DataTypes.INTEGER(6),
            allowNull: false
        },
        OTP:{
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        IsStatus:{
            type: DataTypes.DATE,
            allowNull:false
        },
        CreatedOn:{
            type:DataTypes.DATE,
            allowNull:false
        },
        UsedOn:{
            type:DataTypes.DATE,
            allowNull:false
        },
        ExpiredOn:{
            type:DataTypes.DATE,
            allowNull:false
        },
    },{
        timestamps:false,
    });
    return emailVerificationOTPModel;
}