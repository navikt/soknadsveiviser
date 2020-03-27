describe('My First Test', function() {
  it('Visits the Kitchen Sink', function() {
    cy.visit('https://www.nav.no/soknader/nb/person');
    cy.contains('Du finner søknadsskjemaer, ettersendelse og klageskjemaer når du velger emne nedenfor.');
  });
});