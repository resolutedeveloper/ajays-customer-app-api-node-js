module.exports =(sequelize, DataTypes)=>{
    const itemAllocationModel = sequelize.define("ItemAllocation", {
        id: { // Renamed to 'id' and set as primary key
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        LocationId: {
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