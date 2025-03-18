module.exports = (sequelize, DataTypes) => {
    const orderModel = sequelize.define("Order", {
        OrderID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        CompanyID: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        CustomerID: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        LocationID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        OrderMode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        TotalTax: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        Total: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        OrderStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Pending',
        },
        NoOfItem: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        PaymentInfo: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        DeviceModel: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        OSVersion: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        DeviceID: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        IPAddress: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        AppVersion: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        Remark: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        OTP: {
            type: DataTypes.STRING(4), // Stores a 4-digit OTP
            allowNull: false,
        },
        CreatedOn: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        UpdatedOn: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, { timestamps: false });

    return orderModel;
}