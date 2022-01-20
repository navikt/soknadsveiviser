function getSecrets() {

  const enheterRSURL = "";
  const enheterRSApiKey = "";
  const sanityDataset = process.env.SANITY_DATASET;
  const securityTokenServiceTokenUrl = "";
  const securityTokenServiceTokenApiKey = "";
  const soknadsveiviserUser = "";
  const soknadsveiviserPass = "";
  const foerstesidegeneratorServiceUrl = "";
  const foerstesidegeneratorServiceApiKey = "";
  const soknadsveiviserproxyUrl = process.env.SOKNADSVEIVISERPROXY_URL

  return [
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
  ];
}

function getMockSecrets() {
  return ["", "", "", "", "", "", "", "", "", "http://localhost:8081/soknadsveiviserproxy"];
}

module.exports = { getSecrets, getMockSecrets };
