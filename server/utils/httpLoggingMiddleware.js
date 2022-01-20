const morgan = require("morgan");
const ecsFormat = require('@elastic/ecs-morgan-format')

const httpLoggingMiddleware = morgan((token, req, res) => {
  return ecsFormat({ apmIntegration: false })(token, req, res);
}, {
  skip: function (req, res) { return res.statusCode < 400 }
});

module.exports = httpLoggingMiddleware;
