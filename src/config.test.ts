import {decoratorContextFromCookie} from "./config";

describe('missing decorator cookies', () => {
  it('resolves to privat person norsk if the cookie is empty', () => {
    const result = decoratorContextFromCookie('');
    expect(result.context).toEqual('PRIVATPERSON');
    expect(result.nav_no_url).toEqual('https://nav.no/no/person');
  });
});

describe('decorator-context', () => {
  it('resolves to privat person when decorator-context === "PRIVATPERSON"', () => {
    const cookie = 'kpi=0; _gid=GA1.2.550779374.1589791679; utvalg=0;' +
      ' decorator-context=PRIVATPERSON; psCurrentState=Ready'
    const result = decoratorContextFromCookie(cookie);
    expect(result.context).toEqual('PRIVATPERSON');
    expect(result.nav_no_url).toEqual('https://nav.no/no/person');
  });
  it('resolves to arbeidsgiver when decorator-context === "ARBEIDSGIVER"', () => {
    const cookie = 'kpi=0; _gid=GA1.2.550779374.1589791679; utvalg=0;' +
      ' decorator-context=ARBEIDSGIVER; psCurrentState=Ready'
    const result = decoratorContextFromCookie(cookie);
    expect(result.context).toEqual('ARBEIDSGIVER');
    expect(result.nav_no_url).toEqual('https://nav.no/no/bedrift');
  });

  it('resolves to samarbeidspartner when decorator-context === "SAMARBEIDSPARTNER"', () => {
    const cookie = 'kpi=0; _gid=GA1.2.550779374.1589791679; utvalg=0;' +
      ' decorator-context=SAMARBEIDSPARTNER; psCurrentState=Ready'
    const result = decoratorContextFromCookie(cookie);
    expect(result.context).toEqual('SAMARBEIDSPARTNER');
    expect(result.nav_no_url).toEqual('https://www.nav.no/no/samarbeidspartner');
  });
});

describe('decorator-language', () => {
  it('there is no page for SAMARBEIDSPARTNER in english, so set context to PRIVATPERSON', () => {
    const cookie = 'kpi=0; decorator-language=ENGELSK; _gid=GA1.2.550779374.1589791679; utvalg=0;' +
      ' decorator-context=SAMARBEIDSPARTNER; psCurrentState=Ready'
    const result = decoratorContextFromCookie(cookie);
    expect(result.context).toEqual('PRIVATPERSON');
    expect(result.nav_no_url).toEqual('https://www.nav.no/en/home');
  });

  it('works as expected when decorator-language is norsk', () => {
    const cookie = 'kpi=0; decorator-language=NORSK; _gid=GA1.2.550779374.1589791679; utvalg=0;' +
      ' decorator-context=SAMARBEIDSPARTNER; psCurrentState=Ready'
    const result = decoratorContextFromCookie(cookie);
    expect(result.context).toEqual('SAMARBEIDSPARTNER');
    expect(result.nav_no_url).toEqual('https://www.nav.no/no/samarbeidspartner');
  });
})