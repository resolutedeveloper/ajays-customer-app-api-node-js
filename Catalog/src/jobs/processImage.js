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

    const whereCondition = {};
    whereCondition.baseFilter = {
      [db.Sequelize.Op.or]: [
        { [db.Sequelize.Op.like]: 'data:image/%' }, // Base64 images
        { [db.Sequelize.Op.like]: 'http%' },         // URL images
        { [db.Sequelize.Op.like]: '{%' },             // JSON metadata images
        { [db.Sequelize.Op.like]: '%/%' }             // File path images
      ],
    };

    const items = await db.item.findAll({
      where: {
        Image: whereCondition.baseFilter,
      },
      limit: limit,
    });

    const categories = await db.category.findAll({
      where: {
        CategoryImage: whereCondition.baseFilter
      },
      limit: limit,
    });

    if (items && items.length > 0) {
      for (const item of items) {
        try {
          const fileName = `ITEM_${item.ItemID}.jpg`;

          const fullFilePath = await convertAndSaveImage(item.Image, fileName);

          // const fileName = path.basename(fullFilePath, path.extname(fullFilePath)).match(/^image-\d+/)[0];

          const [updatedCount] = await db.item.update({ Image: fileName }, { where: { ItemID: item.ItemID } });
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
          const fullFilePath = await convertAndSaveImage(item.CategoryImage, fileName);

          // const fileName = path.basename(fullFilePath, path.extname(fullFilePath)).match(/^image-\d+/)[0];

          const [updatedCount] = await db.item.update({ Image: fileName }, { where: { ItemID: item.ItemID } });
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
