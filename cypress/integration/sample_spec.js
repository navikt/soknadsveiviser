describe('My First Test', function() {
  it('Visits the Kitchen Sink', function() {
    cy.visit('https://nav.no/soknader/nb/person');
    cy.contains('Arbeidsavklaringspenger');
  })
})