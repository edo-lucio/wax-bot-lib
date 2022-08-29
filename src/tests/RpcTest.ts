import { RpcWrapper } from "..";
import config from "./test_config";

async function main() {
    const rpcWrapper = new RpcWrapper(config.SERVER_ENDPOINT);

    const data = await rpcWrapper.fetchTable({
        code: "swap.box",
        scope: "swap.box",
        table: "pairs",
    });

    console.log(data);
}

main();
