const FileUploadController = require('../controllers/FileUploadController');
const router = require("express").Router();
router.post('/FileUpload', FileUploadController.FileUpload);
module.exports = router;