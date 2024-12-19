module.exports = (sequelize, DataTypes) => {
    const categoryAllocationModel = sequelize.define("CategoryAllocation",{
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        LocationID:{
            type: DataTypes.INTEGER,
        },
        CategoryID:{
            type: DataTypes.INTEGER,
        }
    },{timestamps: false}
);
   return categoryAllocationModel;
}