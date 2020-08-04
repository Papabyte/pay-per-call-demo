# Pay-per-call demo

This demo shows how easily payment through <sub>O</sub>byte payment channels can be implemented on an existing API.
It relies on this  

## Server

The server expects to receive a POST request including a payment package, if the payment corresponds to the price set for a request then it sends the next sport fixtures happening within 2 days. If payment doesn't match, it refunds the payment by sending a payment package for the same amount.
We run an instance at [ppc.papabyte.com](ppc.papabyte.com), so you don't have to run it by yourself for a trial.


## Client

Require nodejs version 8 or higher.

### Installation

`git clone https://github.com/byteball/pay-per-call-demo.git`
`npm run install`

### Usage

Run the client
`node client`

Since it is based on an [headless <sub>O</sub>byte node](https://github.com/byteball/headless-obyte), it will produce a similar output.
Enter a device name and a passphrase (both optional), then note the `single address` of your client.

Your client has to be funded with some testnet bytes, download the [testnet wallet](https://obyte.org/testnet.html) and get testnet bytes from the faucet chat bot. Then send them to your client's address, after some minutes for confirmation, your client will be ready to request the paid API.

Make a request to the API
`node client --request`

Make a request to the API with a payment amount different than default
`node client --request --price 70000`

Close the channel
`node client --close`




