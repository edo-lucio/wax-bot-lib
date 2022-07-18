/* eslint-disable require-jsdoc */
const { Wallet } = require("./src/index");
const { config } = require("./config");
const { Get } = require("./src/index");

async function test() {
    const wallet = new Wallet(
        config.SERVER_ENDPOINT,
        {
            address: config.WALLET,
            private_key: config.PRIVATE_KEY,
        },
        {}
    );
    wallet.init();

    const get = new Get(wallet);

    const accountInfo = await get.getAccount("rosamaria444");
    console.log(accountInfo);
}

test();
