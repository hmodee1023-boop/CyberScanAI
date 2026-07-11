const tls = require("tls");
const { URL } = require("url");

async function scanSSL(target) {

    return new Promise((resolve) => {

        try {

            if (
                !target.startsWith("http://") &&
                !target.startsWith("https://")
            ) {
                target = "https://" + target;
            }

            const hostname = new URL(target).hostname;

            const socket = tls.connect({
                host: hostname,
                port: 443,
                servername: hostname,
                rejectUnauthorized: false,
                timeout: 10000
            });

            socket.on("secureConnect", () => {

                try {

                    const cert = socket.getPeerCertificate(true);

                    if (!cert || Object.keys(cert).length === 0) {

                        socket.end();

                        return resolve({

                            success: false,
                            ssl: false,
                            message: "No certificate found"

                        });

                    }

                    const validFrom = cert.valid_from || "";
                    const validTo = cert.valid_to || "";

                    const startDate = validFrom ? new Date(validFrom) : null;
                    const endDate = validTo ? new Date(validTo) : null;
                    const now = new Date();

                    let daysLeft = null;

                    if (endDate) {

                        daysLeft = Math.ceil(
                            (endDate - now) / (1000 * 60 * 60 * 24)
                        );

                    }

                    resolve({

                        success: true,

                        ssl: true,

                        hostname,

                        subject:
                            cert.subject?.CN ||
                            hostname,

                        issuer:
                            cert.issuer?.O ||
                            cert.issuer?.CN ||
                            "Unknown",

                        serialNumber:
                            cert.serialNumber || "Unknown",

                        fingerprint:
                            cert.fingerprint256 ||
                            cert.fingerprint ||
                            "Unknown",

                        validFrom,

                        validTo,

                        daysLeft,

                        expired:
                            daysLeft !== null
                                ? daysLeft < 0
                                : false

                    });

                } finally {

                    socket.end();

                }

            });

            socket.on("timeout", () => {

                socket.destroy();

                resolve({

                    success: false,

                    ssl: false,

                    message: "Connection timeout"

                });

            });

            socket.on("error", (err) => {

                resolve({

                    success: false,

                    ssl: false,

                    message: err.message

                });

            });

        } catch (err) {

            resolve({

                success: false,

                ssl: false,

                message: err.message

            });

        }

    });

}

module.exports = scanSSL;