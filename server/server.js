require("dotenv").config();

const express = require("express");
const path = require("path");
const request = require("request-promise");
const mustacheExpress = require("mustache-express");
const getDecorator = require("./utils/getDecorator");
const {getSecrets, getMockSecrets} = require("./utils/getSecrets");
const basePath = require("./utils/basePath");
const logger = require("./utils/logger");
const morganMiddleware = require("./utils/morganMiddleware");

const buildPath = path.join(__dirname, "../build");

const server = express();

server.engine("html", mustacheExpress());
server.set("view engine", "mustache");
server.set("views", `${__dirname}/../build`);

// parse application/json
server.use(express.json());
server.use(morganMiddleware);
server.disable("X-Powered-By");

const [
  enheterRSURL,
  enheterRSApiKey,
  sanityDataset,
  securityTokenServiceTokenUrl,
  securityTokenServiceTokenApiKey,
  soknadsveiviserUser,
  soknadsveiviserPass,
  foerstesidegeneratorServiceUrl,
  foerstesidegeneratorServiceApiKey,
  soknadsveiviserproxyUrl,
] = process.env.NODE_ENV === "production" ? getSecrets() : getMockSecrets();

server.use(basePath("/"), express.static(buildPath, {index: false}));

server.get(basePath("/api/enheter"), (req, res) => {
  const queryParams = req.query.enhetstyper ? `?enhetstyper=${req.query.enhetstyper}` : "";
  req.headers["x-nav-apiKey"] = enheterRSApiKey;
  req.pipe(request(`${enheterRSURL}${queryParams}`)).pipe(res);
});

server.get(basePath("/config"), (req, res) =>
  res.send({
    proxyUrl: soknadsveiviserproxyUrl,
    sanityDataset: sanityDataset
  })
);

server.get(/\/\bsoknader\b\/\w+\/\bnedlasting\b\//, (req, res) => {
    const path = req.url.split("/");

    const skjemanummer = path[4];
    const locale = path[2];
    request(
      {
        uri: `${soknadsveiviserproxyUrl}/skjemafil?skjemanummer=${skjemanummer}&locale=${locale}`,
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

server.post(basePath("/api/forsteside"), (req, res, next) => {
  const requestUrl = securityTokenServiceTokenUrl +
    "?grant_type=client_credentials&scope=openid";
  request(
    requestUrl,
    {
      auth: {
        user: soknadsveiviserUser,
        pass: soknadsveiviserPass
      },
      method: "GET",
      json: true,
      headers: {
        "x-nav-apiKey": securityTokenServiceTokenApiKey
      }
    }
  ).then(result =>
    request(
      foerstesidegeneratorServiceUrl,
      {
        method: "POST",
        json: true,
        body: req.body,
        auth: {
          bearer: result.access_token
        },
        headers: {
          "x-nav-apiKey": foerstesidegeneratorServiceApiKey,
          "Nav-Consumer-Id": soknadsveiviserUser
        }
      },
    )
      .then((parsedBody) => res.send(parsedBody))
  )
    .catch(error => {
      next(error);
    });
});

server.use(/\/(soknader)\/*(?:(?!static|internal).)*$/, (req, res) => {
  getDecorator()
    .then(fragments => {
      res.render("index.html", fragments);
    })
    .catch(e => {
      const error = `Failed to get decorator: ${e}`;
      logger.error(error);
      res.status(500).send(error);
    });
});

// Nais functions
server.get(basePath("/internal/isAlive|isReady"), (req, res) =>
  res.sendStatus(200)
);


// error handlers
function logErrors (err, req, res, next) {
  logger.error({message: err.message, stack: err.stack});
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
  res.send({ error: "something failed" });
}

server.use(logErrors);
server.use(clientErrorHandler);
server.use(errorHandler);


const port = process.env.PORT || 8080;
server.listen(port, () => logger.info(`App listening on port: ${port}`)); // eslint-disable-line

process.on("SIGTERM", () =>
  setTimeout(() => logger.info("Har sovet i 30 sekunder"), 30000)
);
