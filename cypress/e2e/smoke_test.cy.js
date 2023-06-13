describe("Smoke Test", function () {
  it("verifies content from sanity is present", function () {
    cy.visit("https://www.nav.no/soknader/en/person");
    cy.contains("Applications and Forms");
  });

  it("verifies css is not-empty", function () {
    cy.request("https://www.nav.no/soknader/static/index.css").then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body).to.not.be.empty;
      expect(res.body).to.include("display");
    });
  });
});
