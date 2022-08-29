var dotenv = require("dotenv");
dotenv.config();
var config = {
    SERVER_ENDPOINT: "https://wax.eos.barcelona",
    WALLET: {
        address: process.env.EXECUTOR_WALLET || "default",
        private_key: process.env.EXECUTOR_PRIVATE_KEY || "default",
    },
    COSIGN_WALLET: {
        address: process.env.PAYER_WALLET || "default",
        private_key: process.env.PAYER_PRIVATE_KEY || "default",
    },
};
export {};
