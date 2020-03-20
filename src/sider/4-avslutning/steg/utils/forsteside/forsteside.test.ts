import {hentForsteside, Params} from "./forsteside";
import {HttpException} from "../../../../../utils/HttpException";
import {PersonaliaState} from "../../../../../states/providers/Personalia";
import {Soknadsobjekt} from "../../../../../typer/soknad";

interface MyWindow extends Window {
  frontendlogger: any;
}

declare var window: MyWindow;

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
  kanKlage: false,
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

const statusCodeToText: {[index: number]:string} = {
  200: 'Ok',
  400: 'Bad Request',
  500: 'Internal server error'
};

function createFetchResponse(param: { status: number, json?: object }): Response {
  const body = param.json ? new Blob([JSON.stringify(param.json)], {type: 'application/json'}) : null;
  const init = {
    statusText: statusCodeToText[param.status],
    status: param.status,
  };
  return new Response(body, init);
}

describe('hentForsteside', () => {
  let fetchMock: jest.SpyInstance;
  beforeEach(() => {
    window.frontendlogger = {event: jest.fn(), error: jest.fn()};
    // @ts-ignore insanity with string argument not being allowed, error in jest type defs???
    fetchMock = jest.spyOn(global, "fetch");
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  describe('fetch failures', () => {
    afterEach(() => {
      expect(window.frontendlogger.error).toHaveBeenCalledTimes(1);
      expect(window.frontendlogger.event).toHaveBeenCalledTimes(1);
    });

    it('shouldnt crash when fetch rejects', async () => {
      const exception = new TypeError('fetch failure');
      fetchMock.mockImplementation(() => Promise.reject(exception));
      const promise = hentForsteside(exampleParams);
      await expect(promise).rejects.toEqual(exception);
      expect(fetchMock).toHaveBeenCalledWith('/soknader/api/forsteside', {
        body: expect.anything(),
        method: 'POST',
        headers: {"Content-Type": 'application/json'}
      });
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should only log once on 500 internal server error', async () => {
      // this will happen when the underlying server fails and the 500 response is intercepted by BIG-IP
      const response500 = createFetchResponse({status: 500});
      fetchMock.mockImplementation(() => Promise.resolve(response500));
      const promise = hentForsteside(exampleParams);
      const httpException = new HttpException(response500);
      await expect(promise).rejects.toEqual(httpException);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(window.frontendlogger.error).toHaveBeenCalledWith('Feil ved henting av data: /soknader/api/forsteside - 500 Internal server error');
    });

    it('should only log once on 400 Bad Request', async () => {
      const response400 = createFetchResponse({
        status: 400, json: {
          "timestamp": "2020-03-18T20:18:14.182+0000",
          "status": 400,
          "error": "Bad Request",
          "message": "Hvis Adresse oppgis, må Adresselinje1, Postnummer og Poststed være satt.",
          "path": "/api/foerstesidegenerator/v1/foersteside/"
        }
      });
      fetchMock.mockImplementation(() => Promise.resolve(response400));
      const promise = hentForsteside(exampleParams);
      const httpException = new HttpException(response400);
      await expect(promise).rejects.toEqual(httpException);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(window.frontendlogger.error).toHaveBeenCalledWith(
        'Feil ved henting av data: /soknader/api/forsteside - 400 Bad Request');
    });
  });

  describe('fetch successes', () => {
    afterEach(() => {
      expect(window.frontendlogger.error).not.toHaveBeenCalled();
      expect(window.frontendlogger.event).not.toHaveBeenCalled();
    });

    it('should resolve when http is ok', async () => {
      const responseOk = createFetchResponse({status: 200, json: {foersteside: 'flesk flesk'}});
      fetchMock.mockImplementation(() => Promise.resolve(responseOk));
      const promise = hentForsteside(exampleParams);
      await expect(promise).resolves.toEqual('flesk flesk');
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });
});
