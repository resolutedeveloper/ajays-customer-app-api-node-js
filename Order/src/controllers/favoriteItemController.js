const db = require("../models/index.js");

const addFavorite = async (req, res) => {
    try {
        const { itemId } = req.body;
        const customerId = req.UserDetail.CustomerID;

        if (!itemId) {
            return res.status(400).json({ message: 'ItemID is required.' });
        }

        const item = await db.order.findOne({
            where: { ItemID: itemId },
            attributes: ['ItemName'],
        });

        if (!item) {
            return res.status(404).json({ message: 'Item not found.' });
        }

        const itemName = item.ItemName;


        const existingFavorite = await db.favoriteItem.findOne({
            where: { CustomerID: customerId, ItemID: itemId },
        });

        if (existingFavorite) {
            return res.status(400).json({ message: 'Item is already in favorites.' });
        }


        const newFavorite = await db.favoriteItem.create({
            FavoriteID: db.Sequelize.UUIDV4(),
            CustomerID: customerId,
            ItemID: itemId,
            ItemName: itemName,
        });

        return res.status(200).json({
            message: 'Item added to favorites successfully.',
            favorite: newFavorite,
        });
    } catch (error) {
        console.error(" ~ Error adding favorite:", error);
        return res.status(400).json({
            message: 'Error adding favorite',
            error: error.message,
        });
    }
};


const getFavorites = async (req, res) => {
    try {
        const customerId = req.UserDetail.CustomerID;


        const favorites = await db.favoriteItem.findAll({
            where: { CustomerID: customerId },
            attributes: ['FavoriteItemID','CustomerID', 'ItemID', 'ItemName'],
        });

        if (favorites.length === 0) {
            return res.status(404).json({ message: 'No favorite items found for this customer.' });
        }

        return res.status(200).json({
            message: 'Favorites Item by Customer successfully.',
            favorites,
        });
    } catch (error) {
        console.error(" ~ Error retrieving favorites:", error);
        return res.status(400).json({
            message: 'Error retrieving favorites',
            error: error.message,
        });
    }
};

const removeFavorite = async (req, res) => {
    try {
        const { itemId } = req.body;
        const customerId = req.UserDetail.CustomerID;

        if (!itemId) {
            return res.status(400).json({ message: 'ItemID is required.' });
        }


        const favorite = await db.favoriteItem.findOne({
            where: { CustomerID: customerId, ItemID: itemId },
        });

        if (!favorite) {
            return res.status(404).json({ message: 'Item not found in favorites.' });
        }

        await favorite.destroy();

        return res.status(200).json({
            message: 'Item removed from favorites successfully.',
            itemId,
        });
    } catch (error) {
        console.error(" ~ Error removing favorite:", error);
        return res.status(400).json({
            message: 'Error removing favorite',
            error: error.message,
        });
    }
};




module.exports = { addFavorite, getFavorites,removeFavorite};
