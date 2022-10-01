/* eslint-disable require-jsdoc */
import { Sender } from "..";
import { Wallet } from "..";

import config from "./test_config";

async function test() {
    // initialize wallet
    const wallet = new Wallet(
        config.SERVER_ENDPOINT,
        config.COSIGN_WALLET,
        config.COSIGN_WALLET
    );

    wallet.init();

    const tx = new Sender(wallet, 0.8); // tx sender
    const receiver = "d3s3ijoe1c3w"; // if you want to donate :)

    const action_1 = {
        account: "eosio.token",
        name: "transfer",
        authorization: [
            {
                actor: wallet.coSignAddress,
                permission: "active",
            },
            {
                actor: wallet.executorAddress,
                permission: "active",
            },
        ],
        data: {
            from: wallet.executorAddress,
            to: receiver,
            quantity: "1.00000000 WAX",
            memo: ``,
        },
    };

    const action_2 = {
        account: "eosio.token",
        name: "transfer",
        authorization: [
            {
                actor: wallet.coSignAddress,
                permission: "active",
            },
            {
                actor: wallet.executorAddress,
                permission: "active",
            },
        ],
        data: {
            from: wallet.executorAddress,
            to: receiver,
            quantity: "1.00000000 WAX",
            memo: ``,
        },
    };

    const [res, err] = await tx.sendTx(
        [action_1, action_2],
        { blocksBehind: 3, expireSeconds: 60 },
        true
    );

    console.log(res);
    if (err) console.log(err);
}

test();
