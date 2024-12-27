module.exports =(sequelize, DataTypes)=>{
    const itemAllocationModel = sequelize.define("ItemAllocation", {
        ID: { // Renamed to 'id' and set as primary key
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        LocationID: {
            type: DataTypes.INTEGER,
        },
        CategoryID: {
            type: DataTypes.INTEGER,
        },
        ItemID: {
            type: DataTypes.INTEGER,
        },
    }, {
        timestamps: false}
    );

    return itemAllocationModel;
}