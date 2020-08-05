
const payPerCall = require("pay-per-call-API");
const express = require('express')
const app = express()
const request = require('request');

const PORT = 5200
const REQUEST_PRICE = 50000; // in bytes


const payPerCallServer = new payPerCall.Server(60*60*24*7);


app.use(require('body-parser').json());


app.post('/', async function(request, response){
	if (typeof request != 'object' || typeof request.body != 'object')
		return response.send({ error: "bad request" });

	const objPaymentPackageFromClient = request.body.payment_package;
	const requestFromClient = request.body.request;

	if (typeof objPaymentPackageFromClient != 'object')
		return response.send({ error: "bad payment package" });

	const objPaymentFromClient = await payPerCallServer.verifyPaymentPackage(objPaymentPackageFromClient);
	if (objPaymentFromClient.error)
		return response.send({ error: objPaymentFromClient.error});

	if (objPaymentFromClient.asset != 'base')
		return refund(objPaymentFromClient.amount, 'only bytes are accepted');

	if (requestFromClient !== 'get_upcoming_fixtures')
		return refund(objPaymentFromClient.amount, 'unknown request');

	if (objPaymentFromClient.amount > REQUEST_PRICE || objPaymentFromClient.amount < REQUEST_PRICE)
		return refund(objPaymentFromClient.amount, 'Received ' + objPaymentFromClient.amount + ' but the price is ' + REQUEST_PRICE);

	getDataFromSourceApi().then((data)=>{
		response.send(data);
	}).catch(()=>{
		return refund(objPaymentFromClient.amount, 'technical error');
	})
	

	function refund(amount, error){
		payPerCallServer.createPaymentPackage(amount, objPaymentFromClient.aa_address).then((objPaymentPackageForRefund)=>{
			return response.send({ error, payment_package: objPaymentPackageForRefund});

		}).catch((error)=>{
			return response.send({ error: error + ", payment couldn't be refunded"});
		});
	}
});


app.get('/', function(request, response){
	getDataFromSourceApi().then(()=>{
		response.status(500).send("This API is accessible only upon payment through Obyte payment channels. See https://github.com/Papabyte/pay-per-call-demo")
	})
});


app.listen(PORT);
console.log("http receiver enabled on port " + PORT);


function getDataFromSourceApi(){
	return new Promise((resolve, reject)=>{
		const today = (new Date());
		const tomorrow = new Date(today.getTime() + 24 * 3600 * 1000)
		request({
			url: 'https://api.thescore.com/multisport/events?leagues=nfl,nba,mlb,nhl,epl&game_date.in='+today.toISOString()
			+ ',' + tomorrow.toISOString() +'&limit=4&rpp=4'
		}, function(error, response) {
			if (error || response.statusCode !== 200)
				reject(error);
			else resolve(JSON.parse(response.body));
		})
	})
}
