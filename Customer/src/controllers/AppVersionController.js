const db = require('../models/index');
const appversioncheck = async (req, res) => {
    try {
        const latestVersion = await db.VersionManagement.findOne({
            // attributes: ['VersionID'],
            order: [['LaunchTime', 'DESC']],
        });

        if (!latestVersion) {
            return res.status(404).send({ "Message": "No version information found." });
        }

        //return res.json(latestVersion.VersionID)
        if (req.body.Version !== latestVersion.VersionID) {
            const versionExists = await db.VersionManagement.count({
                where: { VersionID: req.body.Version },
            });

            if (versionExists === 1) {
                const currentVersionID = await db.VersionManagement.findOne({
                    attributes: ['VersionManagementID'],
                    where: { VersionID: req.body.Version },
                });
                //const latestVersionID = latestVersion.VersionID;

                // return res.json({
                //     VersionManagementID: latestVersion.VersionID,
                //     VersionID: currentVersionID.VersionManagementID,
                // });
                const versionSupportCount = await db.VersionManagementSupport.count({
                    where: {
                        VersionManagementID: latestVersion.VersionID,
                        VersionID: currentVersionID.VersionManagementID,
                    },
                });
                
                if (versionSupportCount === 0) {
                    return res.status(200).send({
                        "Update": "Yes",
                        "Status": 1,
                        "Message": latestVersion,
                    });
                } else {
                    if (latestVersion.VersionID === req.body.Version) {
                        return res.status(200).send({
                            "Update": "No",
                            "Status": 0,
                            "Message": latestVersion,
                        });
                    } else {
                        return res.status(200).send({
                            "Update": "Yes-No",
                            "Status": 2,
                            "Message": latestVersion,
                        });
                    }
                }
            } else {
                return res.status(200).send({
                    "Update": "Yes",
                    "Status": 1,
                    "Message": latestVersion,
                });
            }
        } else {
            return res.status(400).send({ "ErrorCode": "NOLOGIN", "ErrorMessage": "Not Login" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ "Message": error.message });
    }
};


const version_maintanance = async (req, res) => {
    try {
        //const Data = await db.DealerMaintanance.findAll({ where: {  } });
       //const Data = await db.Maintanance.findAll({ where: { DealerMaintanace:1 } });
       const { Op } = require('sequelize');
       const moment = require('moment');
       const currentDateTime = moment().utc().format('YYYY-MM-DDTHH:mm:ss');
       const Data = await db.Maintanance.findOne({
       where: {
           CustomerMaintanace: true,MaintanaceStatus: true,
           MaintanaceStartDate: {
               [Op.lte]: currentDateTime,
           },
           MaintanaceEndDate: {
               [Op.gte]: currentDateTime,
           },
           IsDeleted: false
       },
       attributes: ['MaintanaceID','MaintanaceStartDate','MaintanaceEndDate','MaintanaceStatus','Title','Description','CustomerMaintanace']});
       
       if (!Data) {
            mysql.query('SELECT VersionID FROM version_managments ORDER BY LaunchTime DESC LIMIT 1',(err_Current_V_Managemet,Current_V_Managemet)=>{
                if (err_Current_V_Managemet) {
                    res.status(500);                    
                    res.send({"Message": err_Current_V_Managemet});            
                }else{
                    if(req.body.Version != Current_V_Managemet[0].NewAppVersion){
                        mysql.query('SELECT VersionManagmentID FROM version_managments ORDER BY LaunchTime DESC LIMIT 1',(err_Current_V_MID1,Current_V_MID1)=>{
                            if (err_Current_V_MID1) {
                                res.status(500);                    
                                res.send({"Message": err_Current_V_MID1});            
                            }else{
                                mysql.query('SELECT COUNT(*) as VersionManagmentcountv FROM version_managments WHERE VersionID = "'+req.body.Version+'"',(err_VersionManagmentcount,VersionManagmentcount)=>{
                                    if(VersionManagmentcount[0].VersionManagmentcountv == 1){
                                        if (err_VersionManagmentcount) {
                                            res.status(500);                    
                                            res.send({"Message": err_VersionManagmentcount});            
                                        }else{
                                            mysql.query('SELECT VersionManagmentID FROM version_managments WHERE VersionID = "'+req.body.Version+'"',(err_Current_V_MID2,Current_V_MID2)=>{
                                                if (err_Current_V_MID2) {
                                                    res.status(500);                    
                                                    res.send({"Message": err_Current_V_MID2});            
                                                }else{
                                                    mysql.query('SELECT COUNT(*) AS VMSupport FROM version_managment_supports WHERE VersionManagmentID = "'+Current_V_MID1[0].VersionManagmentID+'" AND VersionID = "'+Current_V_MID2[0].VersionManagmentID+'"',(err_Version_managment_support,Version_managment_support)=>{
                                                        if (err_Version_managment_support) {
                                                            res.status(500);                    
                                                            res.send({"Message": err_Version_managment_support});            
                                                        }else{
                                                            if(Version_managment_support[0].VMSupport == 0){
                                                                mysql.query('SELECT * FROM version_managments ORDER BY LaunchTime DESC LIMIT 1',(err_VersionManagment,VersionManagment)=>{
                                                                    if (err_VersionManagment) {
                                                                        res.status(500);                    
                                                                        res.send({"Message": err_VersionManagment});            
                                                                    }else{
                                                                        res.status(200);
                                                                        res.send({"Update":"Yes","Status":1,"Message": VersionManagment});
                                                                    }
                                                                });
                                                            }else{
                                                                mysql.query('SELECT * FROM version_managments ORDER BY LaunchTime DESC LIMIT 1',(err_VersionManagment,VersionManagment)=>{
                                                                    if (err_VersionManagment) {
                                                                        res.status(500);                    
                                                                        res.send({"Message": err_VersionManagment});            
                                                                    }else{
                                                                        if(VersionManagment[0].VersionID == req.body.Version){
                                                                            res.status(200);
                                                                            res.send({"Update":"No","Status":0,"Message": VersionManagment});
                                                                        }else{
                                                                            res.status(200);
                                                                            res.send({"Update":"Yes-No","Status":2,"Message": VersionManagment});
                                                                        }
                                                                        
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }else{
                                        mysql.query('SELECT * FROM version_managments ORDER BY LaunchTime DESC LIMIT 1',(err_VersionManagment,VersionManagment)=>{
                                            if (err_VersionManagment) {
                                                res.status(500);                    
                                                res.send({"Message": err_VersionManagment});            
                                            }else{
                                                res.status(200);
                                                res.send({"Update":"Yes","Status":1,"Message": VersionManagment});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }else{
                        res.status(400);
                        res.send({"ErrorCode":"NOLOGIN", "ErrorMessage":"Not Login"});
                    }
                }
            });
       }else{
           return res.status(400).send({message: 'Maintanance Status',Data: Data})
       }

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            Error: error.message,
        })
    }
}

const version_maintanance_operator = async (req, res) => {
    try {
        //const Data = await db.DealerMaintanance.findAll({ where: {  } });
       //const Data = await db.Maintanance.findAll({ where: { DealerMaintanace:1 } });
       const { Op } = require('sequelize');
       const moment = require('moment');
       const currentDateTime = moment().utc().format('YYYY-MM-DDTHH:mm:ss');
       const Data = await db.Maintanance.findOne({
       where: {
           OperatorMaintanace: true,MaintanaceStatus: true,
           MaintanaceStartDate: {
               [Op.lte]: currentDateTime,
           },
           MaintanaceEndDate: {
               [Op.gte]: currentDateTime,
           },
           IsDeleted: false
       },
       attributes: ['MaintanaceID','MaintanaceStartDate','MaintanaceEndDate','MaintanaceStatus','Title','Description','OperatorMaintanace']});
       
       if (!Data) {
            mysql.query('SELECT VersionID FROM 	version_managments_operator ORDER BY LaunchTime DESC LIMIT 1',(err_Current_V_Managemet,Current_V_Managemet)=>{
                if (err_Current_V_Managemet) {
                    res.status(500);                    
                    res.send({"Message": err_Current_V_Managemet});            
                }else{
                    if(req.body.Version != Current_V_Managemet[0].NewAppVersion){
                        mysql.query('SELECT VersionManagmentID FROM 	version_managments_operator ORDER BY LaunchTime DESC LIMIT 1',(err_Current_V_MID1,Current_V_MID1)=>{
                            if (err_Current_V_MID1) {
                                res.status(500);                    
                                res.send({"Message": err_Current_V_MID1});            
                            }else{
                                mysql.query('SELECT COUNT(*) as VersionManagmentcountv FROM 	version_managments_operator WHERE VersionID = "'+req.body.Version+'"',(err_VersionManagmentcount,VersionManagmentcount)=>{
                                    if(VersionManagmentcount[0].VersionManagmentcountv == 1){
                                        if (err_VersionManagmentcount) {
                                            res.status(500);                    
                                            res.send({"Message": err_VersionManagmentcount});            
                                        }else{
                                            mysql.query('SELECT VersionManagmentID FROM 	version_managments_operator WHERE VersionID = "'+req.body.Version+'"',(err_Current_V_MID2,Current_V_MID2)=>{
                                                if (err_Current_V_MID2) {
                                                    res.status(500);                    
                                                    res.send({"Message": err_Current_V_MID2});            
                                                }else{
                                                    mysql.query('SELECT COUNT(*) AS VMSupport FROM 	version_managment_supports_operator WHERE VersionManagmentID = "'+Current_V_MID1[0].VersionManagmentID+'" AND VersionID = "'+Current_V_MID2[0].VersionManagmentID+'"',(err_Version_managment_support,Version_managment_support)=>{
                                                        if (err_Version_managment_support) {
                                                            res.status(500);                    
                                                            res.send({"Message": err_Version_managment_support});            
                                                        }else{
                                                            if(Version_managment_support[0].VMSupport == 0){
                                                                mysql.query('SELECT * FROM 	version_managments_operator ORDER BY LaunchTime DESC LIMIT 1',(err_VersionManagment,VersionManagment)=>{
                                                                    if (err_VersionManagment) {
                                                                        res.status(500);                    
                                                                        res.send({"Message": err_VersionManagment});            
                                                                    }else{
                                                                        res.status(200);
                                                                        res.send({"Update":"Yes","Status":1,"Message": VersionManagment});
                                                                    }
                                                                });
                                                            }else{
                                                                mysql.query('SELECT * FROM 	version_managments_operator ORDER BY LaunchTime DESC LIMIT 1',(err_VersionManagment,VersionManagment)=>{
                                                                    if (err_VersionManagment) {
                                                                        res.status(500);                    
                                                                        res.send({"Message": err_VersionManagment});            
                                                                    }else{
                                                                        if(VersionManagment[0].VersionID == req.body.Version){
                                                                            res.status(200);
                                                                            res.send({"Update":"No","Status":0,"Message": VersionManagment});
                                                                        }else{
                                                                            res.status(200);
                                                                            res.send({"Update":"Yes-No","Status":2,"Message": VersionManagment});
                                                                        }
                                                                        
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }else{
                                        mysql.query('SELECT * FROM 	version_managments_operator ORDER BY LaunchTime DESC LIMIT 1',(err_VersionManagment,VersionManagment)=>{
                                            if (err_VersionManagment) {
                                                res.status(500);                    
                                                res.send({"Message": err_VersionManagment});            
                                            }else{
                                                res.status(200);
                                                res.send({"Update":"Yes","Status":1,"Message": VersionManagment});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }else{
                        res.status(400);
                        res.send({"ErrorCode":"NOLOGIN", "ErrorMessage":"Not Login"});
                    }
                }
            });
       }else{
           return res.status(400).send({message: 'Maintanance Status',Data: Data})
       }

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            Error: error.message,
        })
    }
}


module.exports = ({ appversioncheck, version_maintanance, version_maintanance_operator})