const payPerCall = require("pay-per-call-API");
const request = require("request");
const fs = require("fs");
const conf = require("ocore/conf.js");
const {argv} = require('yargs')

const payPerCallClient = new payPerCall.Client(conf.vendorAddress, null, conf.depositAmount, conf.refillThreshold);

start();

async function start(){
	console.error("client started");
	if (argv.close){
		await payPerCallClient.close(true);
		process.stdout.write("\nChannel closing requested");
	}

	if (argv.request){
		// we generate a payment package for an amount equal to the price of one request
		try{
			var objPaymentPackage = await payPerCallClient.createPaymentPackage(argv.price || conf.requestPrice);
		} catch (error){
			throw Error("Coudln't create payment package, reason: " + error);
		}

		// we send the payment package in a post request
		request({
			url: conf.vendorUrl,
			method: 'POST',
			json: { 
				payment_package: objPaymentPackage,
				request: 'get_upcoming_fixtures'
			}
		}, async function(error, response) {
			if (error || response.statusCode !== 200)
				process.stdout.write(JSON.stringify(error));
			else {
				if (response.body.payment_package){ // the server joined a payment package, we verify it
					const objPayment = await payPerCallClient.verifyPaymentPackage(response.body.payment_package);
					if (objPayment.error){
						process.stdout.write('\nAPI sent a refund but payment package is invalid: ' + objPayment.error);
					}
					else
						process.stdout.write("\nAPI refunded " + objPayment.amount + " in " + objPayment.asset);
				}
				if (response.body.error)
					return process.stdout.write("\nAPI responded with an error: " + response.body.error);

				fs.writeFileSync(conf.fileForDataReceived, JSON.stringify(response.body))
				process.stdout.write('==== data received and saved in ' + conf.fileForDataReceived + '\n')
			}
		})
	}
}


process.on('unhandledRejection', up => {
	throw up;
});