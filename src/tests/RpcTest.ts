import { Wallet } from "..";
import config from "./test_config";

async function main() {
    const wallet = new Wallet(config.SERVER_ENDPOINT, config.WALLET);

    wallet.init();

    const data = await wallet.rpcWrap.fetchTable(
        "swap.box",
        "swap.box",
        "pairs"
    ); // example

    console.log(data);
}

main();
