const fetch = require("node-fetch");
const correlator = require("express-correlation-id");
const {toJsonOrThrowError} = require("../utils/errorHandling");
const {getConfig} = require("../utils/config");
const logger = require("../utils/logger");
const { ArrayCache } = require("../utils/cache");
const { isValidEnhetObject, toSoknadsveiviserFormat, filterEnheter } = require("../utils/enhetUtil");
const { norg2Url } = getConfig();

const ONE_HOUR_IN_MS = 3600000;

class Norg2Service {

  cache = new ArrayCache("Norg2", ONE_HOUR_IN_MS);

  async getEnheter(typer) {
    if (!this.cache.isValid()) {
      logger.info("Fetching data from Norg2...");
      const enhetObjects = await fetch(`${norg2Url}/norg2/api/v1/enhet/kontaktinformasjon/organisering/AKTIV`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-correlation-id": correlator.getId(),
          consumerId: correlator.getId(),
        },
      }).then(toJsonOrThrowError("Feil ved henting av enheter", true));
      this.cache.put(enhetObjects.filter(isValidEnhetObject).map(toSoknadsveiviserFormat));
    }
    return Promise.resolve(filterEnheter(this.cache.get(), typer));
  }

}

const service = new Norg2Service();

module.exports = service;