const logger = require('../utils/logger');
// const db = require("../models/index.js");
// const moment = require('moment-timezone');
// const LoginToken = "AjaysToken";
// const CryptoJS = require('crypto-js');
// const secretKey = process.env.CRYPTOJSKEY;
// const jwt = require("jsonwebtoken");
const axios = require('axios');

// const ItemDetail = async (req, res) => {
//     try {
//         const { ItemID } = req.params;
//         const url = process.env.CATALOG_LOCAL_URL;
//         const token = process.env.HTTP_REQUEST_SECRET_KEY;
//         //const respVideoCount = await axios.get(`${url}/courseVideoNumbers?courseId=${CourseId}`, {
//         const respVideoCount = await axios.get(`${url}/httpResponse/item-detail/${ItemID}`, {
//             headers: { "Authorization": "Bearer " + token }
//         });
//         if(respVideoCount.data){
//             return res.send(respVideoCount.data);
//             // return res.status(200).json({
//             //     // message: 'product details found successfully',
//             //     // data: respVideoCount.data=
//             // });
//         }else{
//             return res.status(400).send({
//                 ErrorCode: "VALIDATION", 
//                 ErrorMessage: 'Product details not found' 
//             });
//         }

        

//     } catch (err) {
//         logger.error(`Product not found: ${err.message}`);  // Log errors
//         res.status(500).send({ success: false, message: 'Product not found' });
//     }
// };

const LocationDetails = async (req, res) => {
    try {

        const { LocationID } = req.params;
        const url = process.env.CATALOG_LOCAL_URL;
        const token = process.env.HTTP_REQUEST_SECRET_KEY;
        const { latitude,longitude } = req.query;

        //const respVideoCount = await axios.get(`${url}/courseVideoNumbers?courseId=${CourseId}`, {
        const respVideoCount = await axios.get(`${url}/httpResponse/location-detail/${LocationID}?latitude=${latitude}&longitude=${longitude}`, {
            headers: { "Authorization": "Bearer " + token }
        });
        if(respVideoCount.data){
            return res.send(respVideoCount.data);
            // return res.status(200).json({
            //     // message: 'product details found successfully',
            //     // data: respVideoCount.data=
            // });
        }else{
            return res.status(400).send({
                ErrorCode: "VALIDATION", 
                ErrorMessage: 'Product details not found' 
            });
        }

        

    } catch (err) {
        logger.error(`Product not found: ${err.message}`);  // Log errors
        res.status(500).send({ success: false, message: 'Product not found' });
    }
};


// const Storecitieslist = async (req, res) => {
//     try {
//         const { LocationID } = req.params;
//         const url = process.env.CATALOG_LOCAL_URL;
//         const token = process.env.HTTP_REQUEST_SECRET_KEY;
//         //const respVideoCount = await axios.get(`${url}/courseVideoNumbers?courseId=${CourseId}`, {
//         const respVideoCount = await axios.get(`${url}/httpResponse/city-stores`, {
//             headers: { "Authorization": "Bearer " + token }
//         });
//         if(respVideoCount.data){
//             return res.send(respVideoCount.data);
//             // return res.status(200).json({
//             //     // message: 'product details found successfully',
//             //     // data: respVideoCount.data=
//             // });
//         }else{
//             return res.status(400).send({
//                 ErrorCode: "VALIDATION", 
//                 ErrorMessage: 'Product details not found' 
//             });
//         }

        

//     } catch (err) {
//         logger.error(`Product not found: ${err.message}`);  // Log errors
//         res.status(500).send({ success: false, message: 'Product not found' });
//     }
// };


const LatLongBaseLocation = async (req, res) => {
    try {
        const { latitude,longitude } = req.query;
        const url = process.env.CATALOG_LOCAL_URL;
        const token = process.env.HTTP_REQUEST_SECRET_KEY;
        //const respVideoCount = await axios.get(`${url}/courseVideoNumbers?courseId=${CourseId}`, {
        const respVideoCount = await axios.get(`${url}/httpResponse/latlonglocation?latitude=${latitude}&longitude=${longitude}`, {
            headers: { "Authorization": "Bearer " + token }
        });
        if(respVideoCount.data){
            return res.send(respVideoCount.data);
        }else{
            return res.status(400).send({
                ErrorCode: "VALIDATION", 
                ErrorMessage: 'LatLong wise details not found' 
            });
        }
    } catch (err) {
        logger.error(`Product not found: ${err.message}`);  // Log errors
        res.status(500).send({ success: false, message: 'Product not found' });
    }
};


const LatLongBaseLocationCatitem = async (req, res) => {
    try {
        const { latitude,longitude } = req.query;
        const url = process.env.CATALOG_LOCAL_URL;
        const token = process.env.HTTP_REQUEST_SECRET_KEY;
        //const respVideoCount = await axios.get(`${url}/courseVideoNumbers?courseId=${CourseId}`, {
        const respVideoCount = await axios.get(`${url}/httpResponse/latlonglocationItem?latitude=${latitude}&longitude=${longitude}`, {
            headers: { "Authorization": "Bearer " + token }
        });
        if(respVideoCount.data){
            return res.send(respVideoCount.data);
        }else{
            return res.status(400).send({
                ErrorCode: "VALIDATION", 
                ErrorMessage: 'LatLong wise details not found' 
            });
        }
    } catch (err) {
        logger.error(`Product not found: ${err.message}`);  // Log errors
        res.status(500).send({ success: false, message: 'Product not found' });
    }
};


module.exports = { LocationDetails, LatLongBaseLocation, LatLongBaseLocationCatitem};
