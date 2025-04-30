const { encrypt, decrypt } = require("../helpers/ccavutil");

async function startPayment(req, res) {
    try {
        const { amount, orderId } = req.body;
        if (!amount || !orderId) {
            return res.status(400).json({
                message: "Amount/OrderId not present."
            })
        }

        let merchantId = process.env.MERCHANT_ID;
        let accessCode = process.env.ACCESS_CODE;
        let workingKey = process.env.WORKING_KEY.trim();
        let redirectUrl = process.env.REDIRECT_URL;
        let cancelUrl = process.env.CANCEL_URL;

        // let orderId = `ORDER_${Date.now()}`;
        // let amount = req.body.amount || "1.00";

        let postData = `merchant_id=${merchantId}&order_id=${orderId}&amount=${amount}&currency=INR&redirect_url=${redirectUrl}&cancel_url=${cancelUrl}`;

        // const newTester = `merchant_id=${merchantId}&order_id=${orderId}&currency=INR&amount=${amount}&redirect_url=${redirectUrl}&cancel_url=${cancelUrl}`;

        let encRequest = encrypt(postData, workingKey);

        //     let toSend = `
        //     <form method="post" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction">
        //         <input type="hidden" name="encRequest" value="${encRequest}">
        //         <input type="hidden" name="access_code" value="${accessCode}">
        //         <button type="submit">Pay Now</button>
        //     </form>
        // `;

        let toSend = `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encRequest}&access_code=${accessCode}`

        return res.send(toSend);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Sorry! There was an server-side error',
            error: error
        });
    }
}

async function startPaymentPosMachine(req, res) {
    try {

        let merchantId = process.env.MERCHANT_ID_POS;
        let accessCode = process.env.ACCESS_CODE_POS;
        let workingKey = process.env.WORKING_KEY_POS.trim();
        let redirectUrl = process.env.REDIRECT_URL_POS;
        // let redirectUrl = "";
        let cancelUrl = process.env.CANCEL_URL_POS;
        // let cancelUrl = "";

        let postData = `merchant_id=${merchantId}&order_id=${req.body.orderId}&amount=${req.body.amount}&currency=INR&redirect_url=${redirectUrl}&cancel_url=${cancelUrl}&billing_name=${req.body.billing_name}&billing_address=${req.body.billing_address}&billing_city=${req.body.billing_city}&billing_state=${req.body.billing_state}&billing_zip=${req.body.billing_zipcode}&billing_tel=${req.body.billing_mobile}&billing_email=${req.body.billing_email}&billing_country=${req.body.billing_country}&payment_option=${req.body.payment_option}`;

        let encRequest = encrypt(postData, workingKey);

        let toSend = `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&encRequest=${encRequest}&access_code=${accessCode}`

        return res.send(toSend);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Sorry! There was an server-side error',
            error: error
        });
    }
}

async function paymentResponseHandler(req, res) {
    try {
        let workingKey = process.env.WORKING_KEY;
        let encResponse = req.body.encResp;

        let decryptedResponse = decrypt(encResponse, workingKey);

        return res.send(`<pre>${decryptedResponse}</pre>`);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Sorry! There was an server-side error'
        });
    }
}

module.exports = { startPayment, paymentResponseHandler, startPaymentPosMachine };
