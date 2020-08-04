exports.bServeAsHub = false;
exports.bLight = true;
exports.bSingleAddress = true;

exports.hub = process.env.testnet ? 'obyte.org/bb-test' : 'obyte.org/bb';

exports.defaultTimeoutInSeconds = 1000; // default timeout for channel creation

exports.vendorUrl = process.env.local_server ? 'http://localhost:5200' : 'http://ppc.papabyte.com';
exports.vendorAddress = "G6J737PFGXI22ZEVS2SZKJCUWAWY2CNC";
exports.requestPrice = 50000; // in bytes
exports.depositAmount = 50000*10; // enough to pay for 10 requests
exports.refillThreshold = 50000*2; // make a new deposit when credit below 2 requests
exports.fileForDataReceived = './data.json';