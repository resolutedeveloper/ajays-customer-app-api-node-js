var express = require('express');
const router = express.Router();
var multer  =   require('multer');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//1 order Add
const FileUpload = async(req,res)=>{
    //console.log("data is requested");
    
    var storage =   multer.diskStorage({    
        destination: function (req, file, callback) {
            callback(null, process.env.UPLOADPATH+'ProfileImage');
        },
        filename: function (req, file, callback) {
            let fine_name = Date.now()+'_'+file.originalname;
            callback(null, fine_name);
        }
    });
    var upload = multer({ storage : storage}).any('FileName');
    
    //router.post('/upload', (req, res) => {
        upload(req,res,function(err) {
            if(err) {
                return res.json([[{ "SUCCESS": 0}],[{ "Message": err}]]);
            }
            //res.json([[{ "SUCCESS": 1}],req.files]);
            res.json({"profile":req.files});
        });
    //});
    router.get('/upload', (req, res) => {
        res.status(200);  
    });
    
}

const ExcelFileUpload = async(req,res)=>{
    //console.log("data is requested");
    
    var storage =   multer.diskStorage({    
        destination: function (req, file, callback) {
            callback(null, process.env.UPLOADPATH+'ImportExcel');
        },
        filename: function (req, file, callback) {
            let fine_name = Date.now()+'_'+file.originalname;
            callback(null, fine_name);
        }
    });
    var upload = multer({ storage : storage}).any('FileName');
    
    //router.post('/upload', (req, res) => {
        upload(req,res,function(err) {
            if(err) {
                return res.json([[{ "SUCCESS": 0}],[{ "Message": err}]]);
            }
            //res.json([[{ "SUCCESS": 1}],req.files]);
            res.json({"ExcelFileUpload":req.files});
        });
    //});
    router.get('/upload/ImportExcel', (req, res) => {
        res.status(200);  
    });
    
}

module.exports = {FileUpload, ExcelFileUpload};