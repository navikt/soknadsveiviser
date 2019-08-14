require("dotenv").config();

const express = require("express");
const path = require("path");
const request = require("request-promise");
const mustacheExpress = require("mustache-express");
const getDecorator = require("./dekorator");
const { getSecrets, getMockSecrets } = require("./getSecrets");

const server = express();

server.set("views", `${__dirname}/../build`);
server.set("view engine", "mustache");
server.engine("html", mustacheExpress());

// parse application/json
server.use(express.json());

server.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});

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

const renderApp = decoratorFragments =>
  new Promise((resolve, reject) =>
    server.render("index.html", decoratorFragments, (err, html) => {
      if (err) reject(err);
      resolve(html);
    })
  );

const startServer = html => {
  server.use(
    "/soknader/static/js",
    express.static(path.resolve(`${__dirname}/..`, "build/static/js"))
  );

  server.use(
    "/soknader/static/media",
    express.static(path.resolve(`${__dirname}/..`, "build/static/media"))
  );

  server.use(
    "/soknader/index.css",
    express.static(path.resolve(`${__dirname}/..`, "build/index.css"))
  );

  server.use(
    "/soknader/manifest.json",
    express.static(path.resolve(`${__dirname}/..`, "build/manifest.json"))
  );

  server.use(
    "/soknader/favicon.ico",
    express.static(path.resolve(`${__dirname}/..`, "build/favicon.ico"))
  );

  server.get("/soknader/api/enheter", (req, res) => {
    req.headers["x-nav-apiKey"] = enheterRSApiKey;
    req.pipe(request(enheterRSURL)).pipe(res);
  });

  server.get("/soknader/internal/isAlive|isReady", (req, res) =>
    res.sendStatus(200)
  );

  server.get("/soknader/config", (req, res) =>
    res.send({
      proxyUrl: soknadsveiviserproxyUrl,
      tjenesteUrl: tjenesterUrl,
      sanityDataset: sanityDataset
    })
  );

  server.post("/soknader/api/forsteside", (req, res) => {
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
            "x-nav-apiKey": foerstesidegeneratorServiceApiKey
          }
        },
        (error, result, body) => {
          if (error) next(error);
          res.send(body);
        }
      )
    );
  });

  server.use("/soknader", (req, res) => {
    res.send(html);
  });

  const port = process.env.PORT || 8080;
  server.listen(port, () => console.log(`App listening on port: ${port}`)); // eslint-disable-line
};

const logError = (errorMessage, details) => console.log(errorMessage, details); // eslint-disable-line

getDecorator()
  .then(renderApp, error => logError("Failed to get decorator", error))
  .then(startServer, error => logError("Failed to render app", error));

process.on("SIGTERM", () =>
  setTimeout(() => console.log("Har sovet i 30 sekunder"), 30000)
);
