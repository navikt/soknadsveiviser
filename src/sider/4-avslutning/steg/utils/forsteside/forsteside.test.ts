import {hentForsteside, Params} from "./forsteside";
import {HttpException} from "../../../../../utils/HttpException";
import {PersonaliaState} from "../../../../../states/providers/Personalia";
import {Soknadsobjekt} from "../../../../../typer/soknad";
import nock from "nock";

const dummyEnhet = {
  enhetsnummer: '',
  enhetsnavn: '',
  type: '',
  postnummer: '',
  poststed: ''
};

const dummySoknad: Soknadsobjekt = {
  _id: '',
  gosysid: 1,
  brukertyper: [],
  vedleggtilsoknad: [],
  innsendingsmate: {},
  urlparam: '',
  klageAnke: {
    kanKlage: false
  },
  navn: {'nb-NO': 'Fisle Narrepanne'},
  hovedskjema: {
    skjemanummer: 'flesk', navn: {'nb-NO': 'flesk flesk'},
    emneord: [{emneord: 'flesk'}],
    gyldigfra: {'nb-NO': 'flesk'},
    gyldigtil: {'nb-NO': 'flesk'},
    pdf: {},
    valgtSprak: 'flesk'
  },
  tema: {temakode: 'flesk', navn: 'flesk'}
};

const dummyPersonalia: PersonaliaState = {
  adresse: {navn: '', adresse: '', sted: ''},
  touched: {
    navn: false,
    kontaktetEnhet: false,
    valgtEnhet: false,
    fodselsnummer: false,
    adresse: false,
    sted: false,
    land: false,
  },
  fodselsnummer: {
    fodselsnummer: '',
    valgtEnhet: dummyEnhet
  },
  bedrift: {valgtEnhet: dummyEnhet, flerePersonerEllerTiltaksbedrift: "tiltaksbedrift"}
};
const exampleParams: Params = {
  globalLocale: "",
  personalia: dummyPersonalia,
  relevanteVedlegg: [],
  valgtLocale: "nb-NO",
  klageSoknadsobjekt: dummySoknad,
  valgtSoknadsobjekt: dummySoknad,
  ettersendelse: false,
  skalKlage: false,
  skalAnke: false,
};

describe('hentForsteside', () => {

  describe('fetch failures', () => {
    let errorScope: any;
    let infoScope: any;

    beforeEach(() => {
      errorScope = nock("http://localhost")
        .post("/soknader/api/logger/error")
        .reply(201);
      infoScope = nock("http://localhost")
        .post("/soknader/api/logger/info")
        .reply(201);
    });

    afterEach(() => {
      expect(errorScope.isDone()).toBe(true);
      expect(infoScope.isDone()).toBe(true);
    });

    it('should only log once on 500 internal server error', async () => {
      // this will happen when the underlying server fails and the 500 response is intercepted by BIG-IP
      const forstesideScope = nock("http://localhost")
        .post("/soknader/api/forsteside")
        .reply(500);
      try {
        await hentForsteside(exampleParams);
        fail("hentForsteside should fail");
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
      }
      expect(forstesideScope.isDone()).toBe(true);
    });

    it('should only log once on 400 Bad Request', async () => {
      const forstesideScope = nock("http://localhost")
        .post("/soknader/api/forsteside")
        .reply(400, {
          "timestamp": "2020-03-18T20:18:14.182+0000",
          "status": 400,
          "error": "Bad Request",
          "message": "Hvis Adresse oppgis, må Adresselinje1, Postnummer og Poststed være satt.",
          "path": "/api/foerstesidegenerator/v1/foersteside/"
        });

      try {
        await hentForsteside(exampleParams);
        fail("hentForsteside should fail");
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
      }
      expect(forstesideScope.isDone()).toBe(true);
    });
  });

  describe('fetch successes', () => {
    it('should resolve when http is ok', async () => {
      const forstesideScope = nock("http://localhost")
        .post("/soknader/api/forsteside")
        .reply(200, {foersteside: 'flesk flesk'});
      const forsteside = await hentForsteside(exampleParams);
      expect(forsteside).toEqual('flesk flesk');
      expect(forstesideScope.isDone()).toBe(true);
    });
  });
});
