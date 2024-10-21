require("dotenv").config();
const { fetchDecoratorHtml } = require("@navikt/nav-dekoratoren-moduler/ssr");
const NodeCache = require("node-cache");
const logger = require("./logger");

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60;

// Refresh cache every hour
const cache = new NodeCache({
    stdTTL: SECONDS_PER_HOUR,
    checkperiod: SECONDS_PER_MINUTE
});

const naisClusterName = process.env.NAIS_CLUSTER_NAME;

const getDecorator = () => {
  const decoratorFragments = cache.get("dekorator");
  if (decoratorFragments) {
    logger.info("Returning decorator from cache")
    return Promise.resolve(decoratorFragments)
  }
  logger.info("Fetching decorator...")
  return fetchDecoratorHtml({
    env: naisClusterName === "prod-gcp" ? "prod" : "dev",
    params: {
      level: 'Level4',
      logoutWarning: true,
    }
  })
    .then(fragments => {
      const data = {
        NAV_SCRIPTS: fragments.DECORATOR_SCRIPTS,
        NAV_STYLES: fragments.DECORATOR_HEAD_ASSETS,
        NAV_HEADING: fragments.DECORATOR_HEADER,
        NAV_FOOTER: fragments.DECORATOR_FOOTER,
      }
      cache.set("dekorator", data);
      logger.info("Decorator fetched and cached")
      return data;
    })
}

module.exports = getDecorator;
