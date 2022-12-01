const visibleEnhetstyper = [
  "ALS",
  "ARK",
  "FPY",
  "FYLKE",
  "HMS",
  "INTRO",
  "KLAGE",
  "KO",
  "KONTROLL",
  "LOKAL",
  "OKONOMI",
  "TILTAK",
  "YTA",
  "OPPFUTLAND",
];

const isValidEnhetObject = object => {
  return object.enhet && object.enhet.enhetNr !== "0000" && visibleEnhetstyper.includes(object.enhet.type);
}

const filterEnheter = (enheter, typer) => {
  return typer && typer.length > 0 ? enheter.filter(enhet => typer.includes(enhet.type)) : enheter;
}

const toSoknadsveiviserFormat = enhetObject => {
  const {enhet, kontaktinformasjon} = enhetObject;
  let adressefelter = {};
  if (kontaktinformasjon) {
    const {postadresse} = kontaktinformasjon;
    if (postadresse) {
      const {type, postnummer, poststed, postboksnummer, postboksanlegg, gatenavn, husnummer, husbokstav} = postadresse;

      if (type === "stedsadresse") {
        adressefelter = {
          postnummer,
          poststed,
          postboks: null,
          postGatenavn: gatenavn,
          postHusnummer: husnummer,
          postHusbokstav: husbokstav,
        };
      } else if (type === "postboksadresse") {
        adressefelter = {
          postnummer,
          poststed,
          postboks: postboksanlegg ? `${postboksnummer} ${postboksanlegg}` : postboksnummer,
          postGatenavn: null,
          postHusnummer: null,
          postHusbokstav: null,
        }
      }
    }
  }

  return {
    enhetsnummer: enhet.enhetNr,
    enhetsnavn: enhet.navn,
    type: enhet.type,
    ...adressefelter,
  };
}

const util = {
  isValidEnhetObject,
  filterEnheter,
  toSoknadsveiviserFormat,
}

module.exports = util;