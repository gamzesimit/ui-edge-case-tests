/**
 * Waiting is where flaky suites are born. Nothing here uses a fixed pause;
 * every wait is on the thing the test actually needs.
 */
describe('Content that arrives late', () => {
  it('waits for an element that is hidden until loading finishes', () => {
    cy.visit('/dynamic_loading/1');
    cy.get('#start button').click();
    cy.get('#finish', { timeout: 15000 }).should('be.visible').and('contain.text', 'Hello World!');
  });

  it('waits for an element that does not exist until loading finishes', () => {
    cy.visit('/dynamic_loading/2');
    cy.get('#start button').click();
    cy.get('#finish', { timeout: 15000 }).should('exist').and('contain.text', 'Hello World!');
  });

  it('handles controls that appear and disappear', () => {
    cy.visit('/dynamic_controls');
    cy.get('#checkbox').should('exist');
    cy.get('#checkbox-example button').click();
    cy.get('#checkbox', { timeout: 15000 }).should('not.exist');
    cy.get('#message').should('contain.text', "It's gone!");
  });

  it('enables a field only after the request finishes', () => {
    cy.visit('/dynamic_controls');
    cy.get('#input-example input').should('be.disabled');
    cy.get('#input-example button').click();
    cy.get('#input-example input', { timeout: 15000 }).should('be.enabled').type('now editable');
    cy.get('#input-example input').should('have.value', 'now editable');
  });

  it('reports a slow page without a fixed pause', () => {
    const started = Date.now();
    cy.visit('/slow', { timeout: 30000 });
    cy.get('body')
      .should('be.visible')
      .then(() => {
        cy.log(`the slow page answered in ${Date.now() - started} ms`);
      });
  });
});
