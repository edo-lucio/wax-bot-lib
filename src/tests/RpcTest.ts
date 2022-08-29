import { Wallet } from "..";
import config from "./test_config";

async function main() {
    const wallet = new Wallet(config.SERVER_ENDPOINT, config.WALLET);

    wallet.init();

    const data = await wallet.rpcWrap.fetchContractTable({
        code: "swap.box",
        scope: "swap.box",
        table: "pairs",
    });

    console.log(data);
}

main();
