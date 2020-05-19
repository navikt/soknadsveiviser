import {decoratorContextFromCookie, cookieStringToDictionary} from "./config";

describe('cookie parsing', () => {
  it('constructs a key value dictionary from the cookie string', () => {
    const cookie = 'kpi=0; decorator-language=ENGELSK; _gid=GA1.2.550779374.1589791679; utvalg=0;' +
      ' decorator-context=SAMARBEIDSPARTNER; psCurrentState=Ready'
    const cookieDict = cookieStringToDictionary(cookie);
    expect(cookieDict).toMatchObject(
      {
        'decorator-language': 'ENGELSK',
        'decorator-context': 'SAMARBEIDSPARTNER'
      }
    );
    expect(Object.keys(cookieDict)).toEqual([
      'kpi',
      'decorator-language',
      '_gid',
      'utvalg',
      'decorator-context',
      'psCurrentState']);
  });
});

describe('missing decorator cookies', () => {
  it('resolves to privat person norsk if the cookie is empty', () => {
    const result = decoratorContextFromCookie('');
    expect(result.context).toEqual('PRIVATPERSON');
    expect(result.nav_no_url).toEqual('https://nav.no/no/person');
  });
});

describe('decorator-context', () => {
  it('resolves to privat person when decorator-context === "PRIVATPERSON"', () => {
    const cookie = 'decorator-context=PRIVATPERSON'
    const result = decoratorContextFromCookie(cookie);
    expect(result.context).toEqual('PRIVATPERSON');
    expect(result.nav_no_url).toEqual('https://nav.no/no/person');
  });
  it('resolves to arbeidsgiver when decorator-context === "ARBEIDSGIVER"', () => {
    const cookie = 'decorator-context=ARBEIDSGIVER';
    const result = decoratorContextFromCookie(cookie);
    expect(result.context).toEqual('ARBEIDSGIVER');
    expect(result.nav_no_url).toEqual('https://nav.no/no/bedrift');
  });

  it('resolves to samarbeidspartner when decorator-context === "SAMARBEIDSPARTNER"', () => {
    const cookie = 'decorator-context=SAMARBEIDSPARTNER';
    const result = decoratorContextFromCookie(cookie);
    expect(result.context).toEqual('SAMARBEIDSPARTNER');
    expect(result.nav_no_url).toEqual('https://www.nav.no/no/samarbeidspartner');
  });
});

describe('decorator-language', () => {
  it('if the language is unsupported, set norwegian url and privatperson', () => {
    const cookie = 'decorator-language=SWAHILI; decorator-context=SAMARBEIDSPARTNER';
    const result = decoratorContextFromCookie(cookie);
    expect(result.context).toEqual('PRIVATPERSON');
    expect(result.nav_no_url).toEqual('https://nav.no/no/person');
  });

  it('there is no page for SAMARBEIDSPARTNER in english, so set context to PRIVATPERSON', () => {
    const cookie = 'decorator-language=ENGELSK; decorator-context=SAMARBEIDSPARTNER';
    const result = decoratorContextFromCookie(cookie);
    expect(result.context).toEqual('PRIVATPERSON');
    expect(result.nav_no_url).toEqual('https://www.nav.no/en/home');
  });

  it('works as expected when decorator-language is norsk', () => {
    const cookie = 'decorator-language=NORSK; decorator-context=SAMARBEIDSPARTNER'
    const result = decoratorContextFromCookie(cookie);
    expect(result.context).toEqual('SAMARBEIDSPARTNER');
    expect(result.nav_no_url).toEqual('https://www.nav.no/no/samarbeidspartner');
  });
});