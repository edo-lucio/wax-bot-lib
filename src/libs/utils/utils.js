/* eslint-disable require-jsdoc */
const crypto = require("crypto");

class Utils {
    static async sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    static generateId(...data) {
        let id = String(Math.floor(+new Date() / 1000));

        for (let i = 0; i < data.length; i++) {
            id += String(data[i]);
        }

        return crypto
            .createHash("sha1")
            .update(JSON.stringify(id))
            .digest("hex");
    }
}

module.exports = { Utils };
