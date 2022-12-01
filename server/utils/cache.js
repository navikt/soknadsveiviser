const logger = require("./logger");

class ArrayCache {
  name = undefined;
  data = undefined;
  timestamp = undefined;
  ttlMs = undefined;

  constructor(name, ttlMs) {
    this.name = name;
    this.ttlMs = ttlMs;
  }

  put(data) {
    this.data = data;
    this.timestamp = new Date();
    logger.info(`Cache updated: ${this.name}`, this.getMeta());
  }

  get() {
    logger.debug(`Returning data from cache: ${this.name}`, this.getMeta());
    return this.data;
  }

  isValid() {
    let valid = this.data && !this.isExpired();
    if (!valid) {
      logger.info(`Cache is invalid: ${this.name}`, this.getMeta());
    }
    return valid;
  }

  isExpired() {
    const { timestamp } = this;
    const now = new Date();
    return !timestamp || (now - timestamp) > this.ttlMs;
  }

  getMeta() {
    const { data, timestamp, name, ttlMs } = this;
    return {
      dataLength: data ? data.length : "<undefined>",
      timestamp: timestamp ? timestamp.toISOString() : "<undefined>",
      name,
      ttlMs,
      ageMs: new Date() - timestamp,
    }
  }

}

const cache = {
  ArrayCache,
}

module.exports = cache;
