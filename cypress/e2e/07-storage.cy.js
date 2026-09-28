/**
 * What a page keeps between visits, and what it throws away. A basket that
 * survives a reload is a feature; a session that survives a sign out is a fault.
 */
describe('What the page remembers', () => {
  it('a value written to local storage survives a reload', () => {
    cy.visit('/');
    cy.window().then((win) => win.localStorage.setItem('qa-check', 'kept'));
    cy.reload();
    cy.window().its('localStorage.qa-check').should('eq', 'kept');
  });

  it('a value in session storage is gone once storage is cleared', () => {
    cy.visit('/');
    cy.window().then((win) => win.sessionStorage.setItem('qa-check', 'temporary'));
    cy.window().its('sessionStorage.qa-check').should('eq', 'temporary');
    cy.clearAllSessionStorage();
    cy.window().its('sessionStorage.qa-check').should('be.undefined');
  });

  it('a page behind basic authentication does not leak its content to an unauthenticated caller', () => {
    cy.request({ url: '/basic_auth', failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body, 'the body must not carry the protected text').to.not.include(
        'Congratulations',
      );
    });
  });

  it('a redirect chain ends on a page that answers 200', () => {
    cy.request({ url: '/redirector', followRedirect: true }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.redirects ?? []).to.have.length.of.at.most(3);
    });
  });
});
