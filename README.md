# Søknadsveiviser
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

Kjør opp server, hvis nødvendig
```
cd server
npm install
node server.js
```

### Test 
```
npm test
```

### Bygg lokalt (linter også koden)
```
npm run build
```

### Bygging og deploy
Vi bruker github actions.

### Nais-cluster
Applikasjonen ligger i default namespace i dev-sbs.

### Logging

Vi bruker fo-frontendlogger for logging. For oppslag i kibana:

```
application:frontendlogger AND x_appname:soknadsveiviser
```

### Tekst

Ledetekster endres i src/sprak/tekster/<lokale-navn>. Husk å legge til for alle lokaler, 
foreløpig en og nb.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes som issues.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-skjemadigitalisering.
