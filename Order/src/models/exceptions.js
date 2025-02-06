module.exports = (sequelize, DataTypes) => {
  const exceptionModel = sequelize.define("exceptionModel", {
    exceptionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    routeName: {
      type: DataTypes.STRING(300),
    },
    routeMethod: {
      type: DataTypes.STRING,
    },
    statusCode: {
      type: DataTypes.INTEGER,
    },
    errorMessage: {
      type: DataTypes.TEXT("long"),
    },
    reqParams: {
      type: DataTypes.JSON,
    },
    reqQuery: {
      type: DataTypes.JSON,
    },
    reqBody: {
      type: DataTypes.JSON,
    },
    userToken: {
      type: DataTypes.TEXT("long"),
    },
    createdOn: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: false,
  });

  return exceptionModel;
};
