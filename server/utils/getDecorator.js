require("dotenv").config();
const jsdom = require("jsdom");
const request = require("request-promise");
const NodeCache = require("node-cache");
const fs = require("file-system");
const logger = require("./logger");
const { JSDOM } = jsdom;

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60;

// Refresh cache every hour
const cache = new NodeCache({
    stdTTL: SECONDS_PER_HOUR,
    checkperiod: SECONDS_PER_MINUTE
});


let getUrl = () => `${fs.readFileSync(
            "/var/run/secrets/nais.io/vault/appres.cms.url",
            "utf8"
        )}/common-html/v4/navno?header-withmenu=true&styles=true&scripts=true&footer-withmenu=true&skiplinks=true&megamenu-resources=true`;

if (process.env.NODE_ENV === 'development') {
  getUrl = () => process.env.DECORATOR_URL || 'https://www.nav.no/dekoratoren/?header-withmenu=true&styles=true&scripts=true&footer-withmenu=true&skiplinks=true&megamenu-resources=true'
}


const getDecorator = () =>
    new Promise((resolve, reject) => {
        const decorator = cache.get("dekorator");
        if (decorator) {
            resolve(decorator);
        } else {
            request(getUrl(), (error, response, body) => {
                if (!error && response.statusCode >= 200 && response.statusCode < 400) {
                    const { document } = new JSDOM(body).window;
                    const prop = "innerHTML";
                    const data = {
                        NAV_SCRIPTS: document.getElementById("scripts")[prop],
                        NAV_STYLES: document.getElementById("styles")[prop],
                        NAV_HEADING: document.getElementById("header-withmenu")[prop],
                        NAV_FOOTER: document.getElementById("footer-withmenu")[prop]
                    };
                    cache.set("dekorator", data);
                    logger.info(`Creating cache for decorator`);
                    resolve(data);
                } else {
                    reject(logger.error(`${error.message} ${getUrl()}`));
                }
            });
        }
    });

module.exports = getDecorator;
