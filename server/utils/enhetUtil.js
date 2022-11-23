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

const filterEnheter = (enhetObjects, typer) => {
  return enhetObjects
    .filter(object => object.enhet && object.enhet.enhetNr !== "0000" && visibleEnhetstyper.includes(object.enhet.type))
    .filter(object => !typer || typer.length === 0 || typer.includes(object.enhet.type));
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
  filterEnheter,
  toSoknadsveiviserFormat,
}

module.exports = util;