import { RpcWrapper } from "..";
import { JsonRpc } from "eosjs";

import fetch from "node-fetch";

import config from "./test_config";

async function main() {
    const rpc = new JsonRpc(config.SERVER_ENDPOINT, { fetch });
    const rpcWrapper = new RpcWrapper(rpc);

    const data = await rpcWrapper.fetchTable({
        code: "swap.box",
        scope: "swap.box",
        table: "pairs",
    });

    console.log(data);
}

main();
