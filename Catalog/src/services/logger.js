const { dbLog } = require("../models/index");

async function logger(req, res, next) {
    try {
        const originalJson = res.json;
        const originalSend = res.send;

        res.json = function (body) {
            res.locals.responseBody = body;
            return originalJson.call(this, body);
        };

        res.send = function (body) {
            res.locals.responseBody = body;
            return originalSend.call(this, body);
        };
        res.on('finish', async () => {
            console.log(
                `\x1b[32m${req.method}\x1b[0m request received on \x1b[36m${req.path}\x1b[0m and ended with Status code -> \x1b[33m${res.statusCode}\x1b[0m`
            );
            if (res.statusCode && res.statusCode >= 400 && res.statusCode <= 600) {
                await dbLog.exceptions.create({
                    routeName: req?.path,
                    routeMethod: req?.method,
                    statusCode: res?.statusCode,
                    reqParams: req?.params,
                    reqQuery: req?.query,
                    reqBody: req?.body,
                    errorMessage: res?.ErrorMessage?.stack || JSON.stringify(res.locals.responseBody)
                });
            } else {
                await dbLog.exceptions.create({
                    routeName: req?.path,
                    routeMethod: req?.method,
                    statusCode: res?.statusCode,
                    reqParams: req?.params,
                    reqQuery: req?.query,
                    reqBody: req?.body
                });
            }
        })
        next();
    } catch (error) {
        console.log(error);
    }
}

module.exports = { logger };