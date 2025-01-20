// const cron = require('node-cron');
// const { convertAndSaveImage } = require('../services/imageServices');
// const db = require("../models/index.js");

// cron.schedule('*/2 * * * *', async () => {
//     console.log('Cron job started: Processing both Base64 and URL images');
//     try {
//         // Fetch items with Base64 or URL in the Image field
//         const items = await db.item.findAll({
//           where: {
//             Image: {
//                    [db.Sequelize.Op.or]: [
//                        { [db.Sequelize.Op.like]: 'data:image/%' }, // Base64 images
//                        { [db.Sequelize.Op.like]: 'http%' }         // URL images
//                    ],
//             },
//           }
//         });

//         for (const item of items) {
//           try {
//             const fileName = await convertAndSaveImage(item.Image);
//             await db.item.update({ Image: fileName }, { where: { ItemID: item.ItemID } });
//             console.log(`Processed ItemID ${item.ItemID}: ${fileName}`);
//           } catch (error) {
//             console.error(`Error processing ItemID ${item.ItemID}:`, error.message);
//             console.error(`Base64/String/URL: ${item.Image}`);
//           }
//         }
//     } catch (error) {
//         console.error('Cron job error:', error.message);
//     }
// });





// const cron = require('node-cron');
// const { convertAndSaveImage } = require('../services/imageServices');
// const db = require("../models/index.js");

// cron.schedule('*/2 * * * *', async () => {
//     console.log('Cron job started: Processing Base64, URL, and JSON images');
//     try {
//         // Fetch items with Base64, URL, or JSON metadata in the Image field
//         const items = await db.item.findAll({
//           where: {
//             Image: {
//                    [db.Sequelize.Op.or]: [
//                        { [db.Sequelize.Op.like]: 'data:image/%' }, // Base64 images
//                        { [db.Sequelize.Op.like]: 'http%' },         // URL images
//                        { [db.Sequelize.Op.like]: '{%' }             // JSON metadata images
//                    ],
//             },
//           }
//         });

//         for (const item of items) {
//           try {
//             const fileName = await convertAndSaveImage(item.Image);
//             await db.item.update({ Image: fileName }, { where: { ItemID: item.ItemID } });
//             console.log(`Processed ItemID ${item.ItemID}: ${fileName}`);
//           } catch (error) {
//             console.error(`Error processing ItemID ${item.ItemID}:`, error.message);
//             console.error(`Base64/String/URL/JSON: ${item.Image}`);
//           }
//         }
//     } catch (error) {
//         console.error('Cron job error:', error.message);
//     }
// });





// const cron = require('node-cron');
// const { convertAndSaveImage } = require('../services/imageServices');
// const db = require("../models/index.js");

// cron.schedule('*/2 * * * *', async () => {
//     console.log('Cron job started: Processing Base64, URL, and JSON images');
//     try {
//         // Fetch items with Base64, URL, or JSON metadata in the Image field
//         const items = await db.item.findAll({
//           where: {
//             Image: {
//                    [db.Sequelize.Op.or]: [
//                        { [db.Sequelize.Op.like]: 'data:image/%' }, // Base64 images
//                        { [db.Sequelize.Op.like]: 'http%' },         // URL images
//                        { [db.Sequelize.Op.like]: '{%' }             // JSON metadata images
//                    ],
//             },
//           }
//         });

//         for (const item of items) {
//           try {
//             // Convert the image and get the new filename (saved image path)
//             const fileName = await convertAndSaveImage(item.Image);

//             // Update the database with the new image file path
//             await db.item.update({ Image: fileName }, { where: { ItemID: item.ItemID } });

//             console.log(`Processed ItemID ${item.ItemID}: ${fileName}`);
//           } catch (error) {
//             console.error(`Error processing ItemID ${item.ItemID}:`, error.message);
//             console.error(`Base64/String/URL/JSON: ${item.Image}`);
//           }
//         }
//     } catch (error) {
//         console.error('Cron job error:', error.message);
//     }
// });



const cron = require('node-cron');
const { convertAndSaveImage } = require('../services/imageServices');
const db = require("../models/index.js");
const path = require('path');

cron.schedule('*/2 * * * *', async () => {
    console.log('Cron job started: Processing Base64, URL, JSON images, and file paths');
    try {
        const items = await db.item.findAll({
          where: {
            Image: {
                   [db.Sequelize.Op.or]: [
                       { [db.Sequelize.Op.like]: 'data:image/%' }, // Base64 images
                       { [db.Sequelize.Op.like]: 'http%' },         // URL images
                       { [db.Sequelize.Op.like]: '{%' },             // JSON metadata images
                       { [db.Sequelize.Op.like]: '%/%' }             // File path images
                   ],
            },
          }
        });

        for (const item of items) {
            try {
              const fullFilePath = await convertAndSaveImage(item.Image);
  
              const fileName = path.basename(fullFilePath, path.extname(fullFilePath)).match(/^image-\d+/)[0];
  
              await db.item.update({ Image: fileName }, { where: { ItemID: item.ItemID } });
  
              console.log(`Processed ItemID ${item.ItemID}: ${fileName}`);
            } catch (error) {
              console.error(`Error processing ItemID ${item.ItemID}:`, error.message);
              console.error(`Base64/String/URL/JSON: ${item.Image}`);
            }
          }
    } catch (error) {
        console.error('Cron job error:', error.message);
    }
});
