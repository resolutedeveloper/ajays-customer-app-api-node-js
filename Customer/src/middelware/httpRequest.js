require('dotenv').config();

// Changed authorization method from headers to query

async function httpRequest(req, res, next) {
    try {
        const httpSecret = process.env.HTTP_REQUEST_SECRET_KEY;
        const { httpToken } = req.query;

        if (!httpToken || httpSecret !== httpToken) {
            return res.status(400).json({
                message: "THIS IS A PROTECTED ROUTE!",
                errorCause: "Either http secret was not passed or http did not matched."
            })
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "BYPASS ERROR - HTTP REQUEST"
        })
    }
}

module.exports = httpRequest;