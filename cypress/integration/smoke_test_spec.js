describe('Smoke Test', function() {
  it('verifies content from sanity is present', function() {
    cy.visit('https://www.nav.no/soknader/nb/person');
    cy.contains('Du finner søknadsskjemaer, ettersendelse og klageskjemaer når du velger emne nedenfor.');
  });
});