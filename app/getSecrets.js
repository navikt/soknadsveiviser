function getSecrets() {
  const fs = require("file-system");
  const secretsFilePath = "/var/run/secrets/nais.io/vault";

  const soknadsveiviserproxyUrlPath =
    secretsFilePath + "/soknadsveiviserproxy.url";
  const tjenesterUrlPath = secretsFilePath + "/tjenester.url";

  const apiKey = fs.readFileSync(secretsFilePath + "/apiKey.user", "utf8");
  const enheterRSURL = fs.readFileSync(
    secretsFilePath + "/enheterRS.url",
    "utf8"
  );
  const enheterRSApiKey = fs.readFileSync(
    secretsFilePath + "/enheterRS.apiKey",
    "utf8"
  );
  const sanityDataset = fs.readFileSync(
    secretsFilePath + "/sanity.dataset",
    "utf8"
  );
  const securityTokenServiceTokenUrl = fs.readFileSync(
    secretsFilePath + "/security.token.service.token.url",
    "utf8"
  );
  const securityTokenServiceTokenApiKey = fs.readFileSync(
    secretsFilePath + "/security.token.service.token.apiKey",
    "utf8"
  );
  const soknadsveiviserUser = fs.readFileSync(
    secretsFilePath + "/soknadsveiviser.user",
    "utf8"
  );
  const soknadsveiviserPass = fs.readFileSync(
    secretsFilePath + "/soknadsveiviser.pass",
    "utf8"
  );
  const foerstesidegeneratorServiceUrl = fs.readFileSync(
    secretsFilePath + "/foerstesidegenerator.service.url",
    "utf8"
  );
  const foerstesidegeneratorServiceApiKey = fs.readFileSync(
    secretsFilePath + "/foerstesidegenerator.service.apiKey",
    "utf8"
  );

  const soknadsveiviserproxyUrl = fs.readFileSync(
    soknadsveiviserproxyUrlPath,
    "utf8"
  );
  const tjenesterUrl = fs.readFileSync(tjenesterUrlPath, "utf8");

  return [
    apiKey,
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
  ];
}

function getMockSecrets() {
  return ["", "", "", "", "", "", "", "", "", "", "", ""];
}

module.exports = { getSecrets, getMockSecrets };
