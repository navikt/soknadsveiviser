# Søknadsveiviser
[![CircleCI](https://circleci.com/gh/navikt/soknadsveiviser.svg?style=svg)](https://circleci.com/gh/navikt/soknadsveiviser)
Dette er en Create React App med TypeScript, som fungerer som en veiviser inn til de forskjellige søknadene på nav.no

Appen kjører på NAIS (kubernetes).

# Komme i gang

Installer NPM pakker

```
cd app
npm install
```

Kjør prosjektet

```
npm start
```

### Bygging og deploy

Soknadsveiviser har et pipelinebygg på [CircleCI](https://circleci.com/gh/navikt/soknadsveiviser)

Ved merge til master kjører bygget på CircleCI automatisk, 
som laster opp et image til dockerhub og deployer til preprod. Videre må man manuelt godkjenne at den skal dytte videre til produksjon.

### Nais-cluster
Applikasjonen ligger i default namespace i dev-sbs.

### Logging

Vi bruker fo-frontendlogger for logging. For oppslag i kibana:

```
application:frontendlogger AND x_appname:soknadsveiviser
```

### Tekst

Ledetekster endres i src/sprak/tekster.jts på både norsk og engelsk.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes mot https://github.com/orgs/navikt/teams/team-personbruker

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-personbruker.
