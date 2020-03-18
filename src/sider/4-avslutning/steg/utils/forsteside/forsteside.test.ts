import {hentForsteside} from "./forsteside";
import {HttpException} from "../../../../../utils/HttpException";

const exampleParams = {
  globalLocale: "",
  personalia: {
    fodselsnummer: {
      fodselsnummer: '', valgtEnhet: {
        enhetsnummer: '',
        enhetsnavn: '',
        type: '',
        postnummer: '',
        poststed: ''
      }
    },
    bedrift: {valgtEnhet: {}, flerePersonerEllerTiltaksbedrift: "tiltaksbedrift"}
  },
  relevanteVedlegg: [],
  valgtLocale: "nb-NO",
  klageSoknadsobjekt: undefined,
  valgtSoknadsobjekt: {
    navn: 'Fisle Narrepanne',
    hovedskjema: {skjemanummer: 'flesk', navn: {'nb-NO': 'flesk flesk'}},
    tema: {temakode: 'flesk', navn: 'flesk'}
  },
  ettersendelse: null,
  skalKlage: false,
  typeKlage: null,
  skalAnke: false
};

function createFetchResponse(param: { status: number, json: object }) {
  return {
    body: null,
    bodyUsed: false,
    redirected: false,
    url: "",
    statusText: 'Internal server error',
    json: () => Promise.resolve(param.json),
    status: param.status,
    ok: param.status < 399
  }
}

describe('hentForsteside', () => {
  let fetchMock: jest.SpyInstance;
  beforeEach(() => {
    window.frontendlogger = {event: jest.fn(), error: jest.fn()};
    // this will happen when the underlying server fails and the 500 response is intercepted by BIG-IP
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
      const response500 = createFetchResponse({status: 500});
      fetchMock.mockImplementation(() => Promise.resolve(response500));
      const promise = hentForsteside(exampleParams);
      const httpException = new HttpException(response500);
      await expect(promise).rejects.toEqual(httpException);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(window.frontendlogger.error).toHaveBeenCalledWith('Feil ved henting av data: /soknader/api/forsteside - 500 Internal server error');
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
