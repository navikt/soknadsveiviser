require("dotenv").config();

const express = require("express");
const path = require("path");
const request = require("request-promise");
const mustacheExpress = require("mustache-express");
const getDecorator = require("./dekorator");
const server = express();

server.set("views", `${__dirname}/build`);
server.set("view engine", "mustache");
server.engine("html", mustacheExpress());

// parse application/json
server.use(express.json());

server.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});

const renderApp = decoratorFragments =>
  new Promise((resolve, reject) =>
    server.render("index.html", decoratorFragments, (err, html) => {
      if (err) reject(err);
      resolve(html);
    })
  );

const startServer = html => {
  server.use(express.static("build"));

  server.use(
    "/soknadsveiviser/static/js",
    express.static(path.resolve(__dirname, "build/static/js"))
  );

  server.use(
    "/soknadsveiviser/static/media",
    express.static(path.resolve(__dirname, "build/static/media"))
  );

  server.use(
    "/soknadsveiviser/index.css",
    express.static(path.resolve(__dirname, "build/index.css"))
  );

  server.get("/soknadsveiviser/api/enheter", (req, res) => {
    req.headers["x-nav-apiKey"] =
      process.env.SOKNADSVEIVISER_ENHETERRS_APIKEY_PASSWORD;
    req.pipe(request(process.env.ENHETERRS_URL)).pipe(res);
  });

  server.get("/soknadsveiviser/internal/alive|ready", (req, res) =>
    res.sendStatus(200)
  );

  server.get("/soknadsveiviser/config", (req, res) =>
    res.send({
      proxyUrl: process.env.SOKNADSVEIVISERPROXY_URL,
      tjenesteUrl: process.env.TJENESTER_URL,
      sanityDataset: process.env.SANITY_DATASET
    })
  );

  server.post("/soknadsveiviser/api/forsteside", (req, res) => {
    request(
      process.env.SECURITY_TOKEN_SERVICE_TOKEN_URL +
        "?grant_type=client_credentials&scope=openid",
      {
        auth: {
          user: process.env.SRVSOKNADSVEIVISER_USERNAME,
          pass: process.env.SRVSOKNADSVEIVISER_PASSWORD
        },
        method: "GET",
        json: true,
        headers: {
          "x-nav-apiKey":
            process.env
              .SOKNADSVEIVISER_SECURITY_TOKEN_SERVICE_TOKEN_APIKEY_PASSWORD
        }
      },
      (error) => {
        if (error) next(error);
      }
    ).then(result => request(
      process.env.FOERSTESIDEGENERATOR_SERVICE_URL,
      {
        method: "POST",
        json: true,
        body: req.body,
        auth: {
          bearer: result.access_token
        },
        headers: {
          "x-nav-apiKey":
          process.env
            .SOKNADSVEIVISER_FOERSTESIDEGENERATOR_SERVICE_APIKEY_PASSWORD
        }
      },
      (error, result, body) => {
        if (error) next(error);
        res.send(body);
      }
    ));
  });

  server.get(/^\/(?!.*static).*$/, (req, res) => {
    res.send(html);
  });

  const port = process.env.PORT || 8080;
  server.listen(port, () => console.log(`App listening on port: ${port}`)); // eslint-disable-line
};

const logError = (errorMessage, details) => console.log(errorMessage, details); // eslint-disable-line

if (process.env.NODE_ENV === "production") {
  getDecorator()
    .then(renderApp, error => logError("Failed to get decorator", error))
    .then(startServer, error => logError("Failed to render app", error));
}

process.on("SIGTERM", () =>
  setTimeout(() => console.log("Har sovet i 30 sekunder"), 30000)
);
