module.exports = (sequelize, DataTypes) => {
    const VersionUpdateTime = sequelize.define('version_update_time', {
        CustomerVersionManagementID: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        CustomerID: {
            type: DataTypes.UUID,
            allowNull: false
        },
        OldAppVersion: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        NewAppVersion: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        VersionUpdateTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, { timestamps: false })
    return VersionUpdateTime
}