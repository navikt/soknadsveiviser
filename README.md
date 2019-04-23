# Søknadsveiviser

Her bor koden som viser søknadsdialogene på nav.no (når dette bytter ut ENONIC-systemet), koden for admin-siden til søknader finner du på [/navikt/soknadsveiviseradmin](https://github.com/navikt/soknadsveiviseradmin)

### Installasjon

Prosjektet krever NPM, last ned prosjektet, CD inn i korrekt mappe, installer NPM-pakkene og start NPM.

Last ned prosjekt

```
git clone https://github.com/navikt/soknadsveiviser.git
```

Installer NPM pakker

```
cd soknadsveiviser/app
npm install
```

kjør prosjektet

```
npm start
```

### Logging

Vi bruker fo-frontendlogger for logging. For oppslag i kibana:

```
application:frontendlogger AND x_appname:soknadsveiviser
```

### Tekst

Ledetekster endres i src/sprak/tekster.jts på både norsk og engelsk.

#### Forfattere

Dette prosjektet ble lagd som ett prosjekt gitt sommerstudenter fra BEKK.
