/* eslint-disable require-jsdoc */
const axios = require("axios");
const { Utils } = require("../utils/utils");

class WaxBotHelpers {
    static async fetchAsset(assetCollection, assetSchema) {
        const URL = `https://wax.api.atomicassets.io/atomicassets/v1/assets?collection_name=${assetCollection}&schema_name=${assetSchema}&page=`;
        let planets = [];
        let lb;
        const finish = false;

        while (!finish) {
            try {
                const data = await axios.get(URL, {
                    params: {
                        lower_bound: lb,
                        limit: 1000,
                        order: "asc",
                    },
                });

                if (data.data.data.length == 1) {
                    break;
                }

                const limit = data.data.data.length - 1; // get the last asset index
                lb = data.data.data[limit].asset_id; // use the last asset id as lower bound
                planets = planets.concat(data.data.data); // add assets
            } catch (err) {
                console.log(err);
                await Utils.sleep(2000);
                return this.fetchAsset(assetCollection, assetSchema);
            }
        }
        return planets;
    }
}

module.exports = { WaxBotHelpers };

// async function test() {
//     const data = await WaxBotHelpers.fetchAsset("darkgalaxies", "dark.planets");
//     console.log(data);
// }

// test();
