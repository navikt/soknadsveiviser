require("dotenv").config();

const express = require("express");
const path = require("path");
const request = require("request-promise");
const fetch = require("node-fetch");
const mustacheExpress = require("mustache-express");
const { createProxyMiddleware } = require('http-proxy-middleware');
const correlator = require("express-correlation-id");
const getDecorator = require("./utils/getDecorator");
const { getConfig } = require("./utils/config");
const basePath = require("./utils/basePath");
const logger = require("./utils/logger");
const httpLoggingMiddleware = require("./utils/httpLoggingMiddleware");
const azureAccessTokenHandler = require("./security/azureAccessTokenHandler");
const { toJsonOrThrowError } = require("./utils/errorHandling");
const norg2Service = require("./services/Norg2Service");
require("./utils/errorToJson.js");

const buildPath = path.join(__dirname, "../build");

const server = express();

server.engine("html", mustacheExpress());
server.set("view engine", "mustache");
server.set("views", `${__dirname}/../build`);

// parse application/json
server.use(express.json());
server.use(correlator());
server.disable("X-Powered-By");

server.use(httpLoggingMiddleware);

const {
  skjemabyggingProxyUrl,
  soknadsveiviserproxyHost,
  sanityDataset,
} = getConfig();

server.use(basePath("/"), express.static(buildPath, {index: false}));

server.get(basePath("/api/enheter"), (req, res, next) => {
  const { enhetstyper } = req.query;
  const typer = enhetstyper ? enhetstyper.split(",") : undefined;
  norg2Service
    .getEnheter(typer)
    .then(enheter => {
      res.contentType("application/json");
      res.send(enheter);
    })
    .catch((error) => {
      next(error);
    });
});

const SOKNADSVEIVISERPROXY_PATH = basePath("/api/sanity");
server.use(SOKNADSVEIVISERPROXY_PATH, createProxyMiddleware({
  target: soknadsveiviserproxyHost,
  changeOrigin: true,
  logLevel: 'warn',
  pathRewrite: {
    [`^${SOKNADSVEIVISERPROXY_PATH}`]: '/soknadsveiviserproxy',
  }
}));

server.get(basePath("/config"), (req, res) =>
  res.send({
    proxyUrl: SOKNADSVEIVISERPROXY_PATH,
    sanityDataset: sanityDataset
  })
);

server.get(/\/\bsoknader\b\/\w+\/\bnedlasting\b\//, (req, res) => {
    const path = req.url.split("/");

    const skjemanummer = path[4];
    const locale = path[2];
    request(
      {
        uri: `${soknadsveiviserproxyHost}/soknadsveiviserproxy/skjemafil?skjemanummer=${skjemanummer}&locale=${locale}`,
        method: "GET",
      },
      (error, result, body) => {
        if (error) logger.error(error);
        try {
          const json = JSON.parse(body);
          if (json.url) {
            res.redirect(JSON.parse(body).url)
          }
        } catch {
          res.sendStatus(404);
        }
      }
    )
  }
);

server.post(basePath("/api/forsteside"), azureAccessTokenHandler, (req, res, next) => {
  const foerstesideData = JSON.stringify(req.body);
  fetch(`${skjemabyggingProxyUrl}/foersteside`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.getAzureAccessToken()}`,
      "x-correlation-id": correlator.getId(),
    },
    body: foerstesideData,
  })
    .then(toJsonOrThrowError("Feil ved generering av førsteside", true))
    .then(foersteside => {
      res.contentType("application/json");
      res.send(foersteside);
    })
    .catch((error) => {
      next(error);
    });
});

server.post(basePath("/api/logger/:level"), (req, res) => {
  const eventData = req.body || {};
  const { level } = req.params || "";
  const { message } = eventData;
  switch (level) {
    case "info":
      logger.info({source: "frontend", message, eventData});
      break;
    case "error":
      logger.info({source: "frontend", message, hiddenLevel: "Error", eventData});
      break;
    default:
      res.status(400);
      res.send(`Unknown log level: '${level}'`);
      return;
  }
  res.sendStatus(201);
});

server.use(/\/(soknader)\/*(?:(?!static|internal).)*$/, async (req, res) => {
  try {
    const fragments = await getDecorator();
    res.render("index.html", fragments);
  } catch (e) {
    const error = `Failed to get decorator: ${e}`;
    logger.error(error);
    res.status(500).send(error);
  }
});

// Nais functions
server.get(basePath("/internal/isAlive|isReady"), (req, res) =>
  res.sendStatus(200)
);

server.get(basePath("/internal/health/status"), (req, res) => {
  const response = { status: "OK", description: "OK" };
  res.status(200).json(response);
});


// error handlers
function logErrors (err, req, res, next) {
  logger.error({message: err.message, error: err.toJSON(), correlation_id: correlator.getId()});
  next(err);
}

function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
    return;
  }
  next(err);
}

function errorHandler (err, req, res, next) {
  res.status(500);
  res.send({ error: err.functional ? err.message : "something failed" });
}

server.use(logErrors);
server.use(clientErrorHandler);
server.use(errorHandler);


const port = process.env.PORT || 8080;
server.listen(port, () => logger.info(`App listening on port: ${port}`)); // eslint-disable-line

process.on("SIGTERM", () =>
  setTimeout(() => logger.info("Har sovet i 30 sekunder"), 30000)
);
