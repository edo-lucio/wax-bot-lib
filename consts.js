module.exports = Object.freeze({
    TAPOS_FIELD: {
        blocksBehind: 3,
        expireSeconds: 30,
    },

    RESOURCE_PROVIDER_ENDPOINT:
        "https://wax.greymass.com/v1/resource_provider/request_transaction",

    CHAIN_ID:
        "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",

    ALCOR_CONTRACT: "alcordexmain",

    ATOMIC_ASSETS_BASE: `https://wax.api.atomicassets.io/atomicassets/v1/assets?collection_name=${}&schema_name=dark.planets&page=`,

    MARKETS_TABLE: "markets",
});
