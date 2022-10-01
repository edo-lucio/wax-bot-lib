const dotenv = require("dotenv");
dotenv.config();

const config = {
    SERVER_ENDPOINT: "https://wax.eos.barcelona",

    WALLET: {
        address: process.env.EXECUTOR_WALLET || "default",
        private_key: process.env.EXECUTOR_PRIVATE_KEY || "default",
    },

    WALLET1: {
        address: process.env.TEST_WALLET || "default",
        private_key: process.env.TEST_WALLET_KEY || "default",
    },

    COSIGN_WALLET: {
        address: process.env.PAYER_WALLET || "default",
        private_key: process.env.PAYER_PRIVATE_KEY || "default",
    },
};

export = config;
