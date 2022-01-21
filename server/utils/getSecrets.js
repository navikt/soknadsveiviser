function getSecrets() {

  const enheterRSURL = "";
  const enheterRSApiKey = "";

  return [
    enheterRSURL,
    enheterRSApiKey,
  ];
}

function getConfig() {
  return {
    skjemabyggingProxyClientId: process.env.SKJEMABYGGING_PROXY_CLIENT_ID,
    skjemabyggingProxyUrl: process.env.SKJEMABYGGING_PROXY_URL,
    clientId: process.env.AZURE_APP_CLIENT_ID,
    clientSecret: process.env.AZURE_APP_CLIENT_SECRET,
    azureOpenidTokenEndpoint: process.env.AZURE_OPENID_CONFIG_TOKEN_ENDPOINT,
    soknadsveiviserproxyHost: process.env.SOKNADSVEIVISERPROXY_HOST || "http://localhost:8081",
    sanityDataset: process.env.SANITY_DATASET,
  };
}

function getMockSecrets() {
  return ["", "", "", "", "", "", "", "", "", "http://localhost:8081"];
}

module.exports = { getSecrets, getMockSecrets, getConfig };
