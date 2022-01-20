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
  const soknadsveiviserproxyHost = process.env.SOKNADSVEIVISERPROXY_HOST;

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
    soknadsveiviserproxyHost,
  ];
}

function getMockSecrets() {
  return ["", "", "", "", "", "", "", "", "", "http://localhost:8081"];
}

module.exports = { getSecrets, getMockSecrets };
