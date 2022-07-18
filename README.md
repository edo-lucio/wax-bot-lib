# Wax bot library
This is a ibrary for making bots on Wax blockchain.

# Motivation
Why making a library when you already have support with eos api ?
Well, making several bots on WAX is indeed repetitive, so i decided to cluster some of the repetitive stuff into a small library to help me with the workflow.


# Installation

```
npm install -latest wax-bot-lib

```

# Usage
You can instantiate a wallet session
```
const wallet = new Wallet(
    "https://wax.eosphere.io/v2", // api endpoint to use
    {
        address: "yourAnchorAddress", // your wallet's address
        private_key: "yourAnchorPvt", // wallet's private key
    },
    {   address: "yourCosignAddress", // optional: you can add a cosigner to pay transaction's cpu for you main wallet
        private_key: "yourCosignAddress" 
    } 
);

wallet.init(); // initialize the wallet
```

To send a transaction you can import 

```
const { sendTx } = require("wax-bot-lib")
const txData = {
    name: "bcbrawlers", // example
    action: "brawl", // example
    params: { owner: wallet.executorAddress, slot_id: 14 },
};

const [res, err] = await sendTx(wallet, txData)
```
And then handling the dapp's thrown errors like this 

```
if (err.includes("already brawled 16 times")) {
    await sleep(3600000)
}
```












