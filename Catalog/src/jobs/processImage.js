const cron = require('node-cron');
const { convertAndSaveImage } = require('../services/imageServices');
const db = require("../models/index.js");
const path = require('path');
const { client } = require("../cache/redis.js");

cron.schedule('*/2 * * * *', async () => {
  console.log('Cron job started: Processing Base64, URL, JSON images, and file paths');
  try {
    // const redisItem = await client.get("itemOffester");
    // const redisCat = await client.get("categoryOffset");
    // console.log(redisItem, redisCat, typeof redisItem, typeof redisCat);

    // const offsetItem = redisItem ? Number(redisItem) : 0;
    // const offsetCategory = redisCat ? Number(redisCat) : 0;
    const limit = 10;

    // const whereCondition = {};
    // whereCondition = {
    //   [db.Sequelize.Op.or]: [
    //     { Image: { [db.Sequelize.Op.like]: 'data:image/%' } }, // Base64 images
    //     { [db.Sequelize.Op.like]: 'http%' },         // URL images
    //     { [db.Sequelize.Op.like]: '{%' },             // JSON metadata images
    //     { [db.Sequelize.Op.like]: '%/%' }             // File path images
    //   ],
    // };
    function retrunWhereClause(imageCol) {
      return {
        [db.Sequelize.Op.or]: [
          { [imageCol]: { [db.Sequelize.Op.like]: 'data:image/%' } }, // Base64 images
          { [imageCol]: { [db.Sequelize.Op.like]: 'http%' } },         // URL images
          { [imageCol]: { [db.Sequelize.Op.like]: '{%' } },             // JSON metadata images
          { [imageCol]: { [db.Sequelize.Op.like]: '%/%' } }           // File path images
        ],
      };
    }
    const items = await db.item.findAll({
      where: retrunWhereClause("Image"),
      limit: limit,
    });

    const categories = await db.category.findAll({
      where: retrunWhereClause("CategoryImage"),
      limit: limit,
    });

    if (items && items.length > 0) {
      for (const item of items) {
        try {
          const fileName = `ITEM_${item.ItemID}.jpg`;

          const fullFilePath = await convertAndSaveImage(item.Image, fileName, "items");

          // const fileName = path.basename(fullFilePath, path.extname(fullFilePath)).match(/^image-\d+/)[0];

          if (fullFilePath) {
            await db.item.update({ Image: fileName }, { where: { ItemID: item.ItemID } });
          }
          // await client.set("categoryOffset", updatedCount);

          // console.log(`Processed ItemID ${item.ItemID}: ${fileName}`);
        } catch (error) {
          console.error(`Error processing ItemID ${item.ItemID}:`, error.message);
          console.error(`Base64/String/URL/JSON: ${item.Image}`);
        }
      }
    }

    if (categories && categories.length > 0) {
      for (const item of categories) {
        try {
          const fileName = `CATEGORY_${item.CategoryID}.jpg`;
          const fullFilePath = await convertAndSaveImage(item.CategoryImage, fileName, "catlog");

          // const fileName = path.basename(fullFilePath, path.extname(fullFilePath)).match(/^image-\d+/)[0];

          if (fullFilePath) {
            await db.category.update({ CategoryImage: fileName }, { where: { CategoryID: item.CategoryID } });
          }
          // await client.set("itemOffester", updatedCount);

          // console.log(`Processed ItemID ${item.ItemID}: ${fileName}`);
        } catch (error) {
          console.error(`Error processing ItemID ${item.ItemID}:`, error.message);
          console.error(`Base64/String/URL/JSON: ${item.Image}`);
        }
      }
    }
  } catch (error) {
    console.error('Cron job error:', error.message);
  }
});
