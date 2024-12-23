module.exports = (sequelize, DataTypes) => {
const categoryModel = sequelize.define("Category",{
    CategoryID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    CategoryName:{
        type: DataTypes.STRING(200),
    },
    CategorySName:{
        type: DataTypes.STRING(500),
    },
    ParentCategoryID:{
        type: DataTypes.INTEGER,
    },
    IsVisible:{
        type: DataTypes.BOOLEAN,
    },
    Remarks:{
        type: DataTypes.STRING(500),
    },
    Priority:{
        type: DataTypes.INTEGER,
    },
    CategoryImage:{
        type: DataTypes.STRING(300),
    },
    IsSpecial:{
        type: DataTypes.BOOLEAN,
    },
},{timestamps: false}
);
  return categoryModel;
};