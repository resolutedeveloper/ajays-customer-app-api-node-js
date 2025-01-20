const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

function cleanBase64(base64Image) {
  return base64Image.replace(/^data:image\/(jpeg|jpg|png|gif);base64,/, '').trim();
}

function isValidBase64(base64Image) {
  const base64Pattern = /^data:image\/(png|jpeg|jpg);base64,[A-Za-z0-9+/=]+$/;
  return base64Pattern.test(base64Image);
}

async function downloadImageFromUrl(url) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
    });
    return Buffer.from(response.data, 'binary');
  } catch (error) {
    throw new Error(`Failed to download image from URL: ${error.message}`);
  }
}

// Validate the JSON metadata structure
function isValidJsonMetadata(jsonString) {
  try {
    const jsonData = JSON.parse(jsonString);
    return jsonData && jsonData.image && jsonData.image.data;
  } catch (error) {
    return false;
  }
}

async function convertAndSaveImage(imageInput, width = 200, height = null, quality = 80) {
  imageInput = imageInput.trim();
  try {
    if (!imageInput) {
      throw new Error('No image input provided.');
    }

    let imageBuffer;
    const fileName = `image-${Date.now()}.jpg`;
    const outputPath = path.resolve(__dirname, '..', '..','public', 'images', fileName);


    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Check for Base64 input
    if (isValidBase64(imageInput)) {
      console.log("Processing Base64 image input");
      const base64Data = cleanBase64(imageInput);
      imageBuffer = Buffer.from(base64Data, 'base64');
    }
    else if (imageInput.startsWith('http://') || imageInput.startsWith('https://')) {
      console.log("Processing image from URL:", imageInput);
      imageBuffer = await downloadImageFromUrl(imageInput);
    }
    else if (imageInput.startsWith('{') && imageInput.endsWith('}')) {
      console.log("Processing JSON metadata input");
      try {
        const jsonData = JSON.parse(imageInput);
        if (jsonData.image && jsonData.image.data) {
          const base64Data = cleanBase64(jsonData.image.data);
          imageBuffer = Buffer.from(base64Data, 'base64');
        } else {
          throw new Error('JSON metadata is missing the image data field.');
        }
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError.message);
        throw new Error('Invalid JSON metadata format.');
      }
    } 
    else if (fs.existsSync(imageInput)) {
      console.log("Processing image from file path:", imageInput);
      imageBuffer = fs.readFileSync(imageInput); // Read the image file into a buffer
    } else {
      throw new Error('Invalid input: Only Base64 string, URL, JSON metadata, or file path is allowed.');
    }

    await sharp(imageBuffer)
      .resize(width || 200, height || null)
      .toFormat('jpeg', { quality })
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    console.error("Error in convertAndSaveImage:", error.message);
    throw new Error('Failed to convert and save image.');
  }
}

module.exports = { convertAndSaveImage };
