# Søknadsveiviser
[![CircleCI](https://circleci.com/gh/navikt/soknadsveiviser.svg?style=svg)](https://circleci.com/gh/navikt/soknadsveiviser)
Dette er en Create React App med TypeScript, som fungerer som en veiviser inn til de forskjellige søknadene på nav.no

Appen kjører på NAIS i en dockercontainer.

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

Vi har et pipelinebygg på [Jenkins](https://ci.adeo.no/job/informasjon_og_veiledning/job/soknadsveiviser/) 
som må trigges manuelt for deploy til dev (q0) og produksjon.

Applikasjonen ligger i q0 namespace i dev-sbs og default namespace prod-sbs.

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
