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
            type:DataTypes.TEXT,
            allowNull: false
        },
        OTP:{
            type: DataTypes.INTEGER,
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
    return emailVerificationOTPModel;
}