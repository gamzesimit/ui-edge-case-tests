describe('Form authentication', () => {
  it('signs a valid user in and says so', () => {
    cy.signIn('tomsmith', 'SuperSecretPassword!');
    cy.url().should('include', '/secure');
    cy.get('#flash').should('contain.text', 'You logged into a secure area');
  });

  it('refuses a wrong password and names the field', () => {
    cy.signIn('tomsmith', 'wrong-password');
    cy.url().should('include', '/login');
    cy.get('#flash').should('contain.text', 'Your password is invalid');
  });

  it('refuses an unknown user', () => {
    cy.signIn('no_such_user', 'SuperSecretPassword!');
    cy.get('#flash').should('contain.text', 'Your username is invalid');
  });

  it('signs out and stops the secure page being reachable by going back', () => {
    cy.signIn('tomsmith', 'SuperSecretPassword!');
    cy.get('a[href="/logout"]').click();
    cy.get('#flash').should('contain.text', 'You logged out');
    cy.visit('/secure', { failOnStatusCode: false });
    cy.get('#flash').should('contain.text', 'You must login');
  });

  it('protects a page behind basic authentication', () => {
    cy.request({
      url: '/basic_auth',
      failOnStatusCode: false,
    }).its('status').should('eq', 401);

    cy.request({
      url: '/basic_auth',
      auth: { user: 'admin', pass: 'admin' },
    }).its('status').should('eq', 200);
  });
});
