module.exports = (sequelize, DataTypes) => {
    const VersionManagement = sequelize.define('version_management', {
        VersionManagementID : {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        VersionID: {
            type: DataTypes.UUID,
            allowNull: false
        },
        DownloadLink: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        LaunchTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, { timestamps: false })
    return VersionManagement
}