const morganMiddleware = require("morgan");
const ecsMorganFormat = require("@elastic/ecs-morgan-format");
const logger = require("./logger");

const middleware = morganMiddleware(
  (token, req, res) => ecsMorganFormat({ apmIntegration: false })(token, req, res),
  {
    skip: (req, res) => res.statusCode < 400,
    stream: {
      write: (msg) => {
        try {
          const msgJson = JSON.parse(msg);
          const httpStatus = msgJson.http.response.status_code;
          if (httpStatus < 500) {
            logger.info(msgJson);
          } else {
            logger.error(msgJson);
          }
        } catch (_) {
          logger.info(msg);
        }
      }
    }
  }
);

module.exports = middleware;
