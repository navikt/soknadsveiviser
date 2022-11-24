const fetch = require("node-fetch");
const correlator = require("express-correlation-id");
const {toJsonOrThrowError} = require("../utils/errorHandling");
const {getConfig} = require("../utils/config");
const logger = require("../utils/logger");
const { ArrayCache } = require("../utils/cache");
const {
  skjemabyggingProxyUrl,
} = getConfig();

const ONE_HOUR_IN_MS = 3600000;

class Norg2Service {

  cache = new ArrayCache("Norg2", ONE_HOUR_IN_MS);

  async getEnheter(accessToken) {
    if (!this.cache.isValid()) {
      logger.info("Fetching data from Norg2...");
      const enhetsliste = await fetch(`${skjemabyggingProxyUrl}/norg2/api/v1/enhet/kontaktinformasjon/organisering/AKTIV`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "x-correlation-id": correlator.getId(),
        },
      }).then(toJsonOrThrowError("Feil ved henting av enheter", true));
      this.cache.put(enhetsliste);
    }
    return Promise.resolve(this.cache.get());
  }

}

const service = new Norg2Service();

module.exports = service;