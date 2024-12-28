module.exports = (sequelize, DataTypes) => {
    const VersionManagementSupport = sequelize.define('version_management_support', {
        VersionManagementSupportID: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        VersionManagementID: {
            type: DataTypes.UUID,
            allowNull: false
        },
        VersionID: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, { timestamps: false })
    return VersionManagementSupport
}