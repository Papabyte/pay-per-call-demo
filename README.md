# Pay-per-call-API demo

This demo shows how easily payment through O<sub>byte</sub> payment channels can be implemented on an existing API.
It relies on [pay-per-call-API](https://github.com/byteball/pay-per-call-API) library.

## Server

The server expects to receive a POST request including a payment package, if the payment corresponds to the price set for a request then it sends the next sport fixtures happening within 2 days encoded in JSON formats. If payment doesn't match, it refunds the payment by sending a payment package for the same amount.
We run an instance at [ppc.papabyte.com](http://ppc.papabyte.com), so you don't have to run it by yourself.


## Client

Require nodejs version 8 or higher.

### Installation

`git clone https://github.com/byteball/pay-per-call-demo.git`

`npm install`

### Usage

Run the client

`node client`

Since it is based on an [headless O<sub>byte</sub> node](https://github.com/byteball/headless-obyte), it will produce a similar output.
Enter a device name and a passphrase (both optional), then note the `single address` of your client.

Your client has to be funded with some testnet bytes, download the [testnet wallet](https://obyte.org/testnet.html) and get testnet bytes from the faucet chat bot. Then send them to your client's address, your client is now ready to request the paid API.

Make a request to the API (the first request may take a few seconds)

`node client --request`


Make a request to the API with a payment amount different than default

`node client --request --price 70000`


Close the channel

`node client --close`




