const morgan = require("morgan");
const ecsFormat = require('@elastic/ecs-morgan-format')
const correlator = require("express-correlation-id");

const httpLoggingMiddleware = morgan((token, req, res) => {
  const logEntry = JSON.parse(ecsFormat({ apmIntegration: false })(token, req, res));
  logEntry.correlation_id = correlator.getId();
  return JSON.stringify(logEntry);
}, {
  skip: function (req, res) { return res.statusCode < 400 }
});

module.exports = httpLoggingMiddleware;
