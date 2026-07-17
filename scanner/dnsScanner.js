const dns = require("dns").promises;
const { URL } = require("url");

async function scanDNS(target) {

    try {

        let url = target;

        if (
            !url.startsWith("http://") &&
            !url.startsWith("https://")
        ) {
            url = "https://" + url;
        }

        const hostname = new URL(url).hostname;

        const result = await dns.lookup(hostname);

        return {

            hostname: hostname,

            ip: result.address,

            family: result.family,

            success: true

        };

    } catch (error) {

        return {

            hostname: null,

            ip: "Unknown",

            family: null,

            success: false,

            error: error.message

        };

    }

}

module.exports = scanDNS;