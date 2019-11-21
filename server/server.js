require("dotenv").config();

const express = require("express");
const path = require("path");
const request = require("request-promise");
const mustacheExpress = require("mustache-express");
const getDecorator = require("./utils/dekorator");
const { getSecrets, getMockSecrets } = require("./utils/getSecrets");
const basePath = require("./utils/basePath");

const buildPath = path.join(__dirname, "../build");

const server = express();

server.engine("html", mustacheExpress());
server.set("view engine", "mustache");
server.set("views", `${__dirname}/../build`);

// parse application/json
server.use(express.json());
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
  tjenesterUrl
] = process.env.NODE_ENV === "production" ? getSecrets() : getMockSecrets();

server.use(basePath("/"), express.static(buildPath, { index: false }));

server.get(basePath("/api/enheter"), (req, res) => {
  req.headers["x-nav-apiKey"] = enheterRSApiKey;
  req.pipe(request(enheterRSURL)).pipe(res);
});

server.get(basePath("/config"), (req, res) =>
  res.send({
    proxyUrl: soknadsveiviserproxyUrl,
    tjenesteUrl: tjenesterUrl,
    sanityDataset: sanityDataset
  })
);

server.post(basePath("/api/forsteside"), (req, res) => {
  request(
    securityTokenServiceTokenUrl +
      "?grant_type=client_credentials&scope=openid",
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
    },
    error => {
      if (error) next(error);
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
      (error, result, body) => {
        if (error) next(error);
        res.send(body);
      }
    )
  );
});

const renderApp = decoratorFragments =>
  new Promise((resolve, reject) =>
    server.render("index.html", decoratorFragments, (err, html) => {
      if (err) reject(err);
      resolve(html);
    })
  );

const startServer = html => {
  server.get(basePath("/internal/isAlive|isReady"), (req, res) =>
    res.sendStatus(200)
  );

  server.use(/\/(soknader)\/*(?:(?!static|internal).)*$/, (req, res) => {
    // matcher alt bortsett fra internal og static
    res.send(html);
  });
};

const logErrorAndTryAgain = (errorMessage, details) => {
    console.log(errorMessage, details);
    setTimeout(fetchDecoratorAndStartServer, 5000);
};

const fetchDecoratorAndStartServer = () => {
    getDecorator()
        .then(renderApp, error => {throw new Error("Failed to fetch decorator: " + error)})
        .then(startServer, error => {throw new Error("Failed to render app: " + error)})
        .catch(error => logErrorAndTryAgain(error));
};


fetchDecoratorAndStartServer();

const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`App listening on port: ${port}`)); // eslint-disable-line

process.on("SIGTERM", () =>
  setTimeout(() => console.log("Har sovet i 30 sekunder"), 30000)
);
