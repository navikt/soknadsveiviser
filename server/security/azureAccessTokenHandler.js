const fetch = require("node-fetch");
const qs = require("qs");
const { getConfig } = require("../utils/getSecrets");
const { toJsonOrThrowError } = require("../utils/errorHandling");

const { skjemabyggingProxyClientId, clientId, clientSecret, azureOpenidTokenEndpoint } = getConfig();

const postData = {
  grant_type: "client_credentials",
  scope: `openid api://${skjemabyggingProxyClientId}/.default`,
  client_id: clientId,
  client_secret: clientSecret,
  client_auth_method: "client_secret_basic",
};

const azureAccessTokenHandler = (req, res, next) => {
  const body = qs.stringify(postData);
  fetch(azureOpenidTokenEndpoint, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "POST",
    body: body,
  })
    .then(toJsonOrThrowError("Feil ved autentisering"))
    .then(({ access_token }) => {
      req.getAzureAccessToken = () => access_token;
      next();
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = azureAccessTokenHandler;
