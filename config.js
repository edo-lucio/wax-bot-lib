const dotenv = require("dotenv");
dotenv.config();

const config = {
    SERVER_ENDPOINT: "https://wax.eos.barcelona",
    WALLET: process.env.ADDRESS,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
};

module.exports = { config };
