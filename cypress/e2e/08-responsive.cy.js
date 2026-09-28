/**
 * The same page at three widths. A control that moves off screen on a phone is
 * gone for a third of the customers, and nothing in a desktop run says so.
 */
const WIDTHS = [
  { name: 'phone', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

describe('The same page at three widths', () => {
  WIDTHS.forEach(({ name, width, height }) => {
    it(`the sign in form is usable on ${name}`, () => {
      cy.viewport(width, height);
      cy.visit('/login');
      cy.get('#username').should('be.visible');
      cy.get('#password').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it(`the page does not scroll sideways on ${name}`, () => {
      cy.viewport(width, height);
      cy.visit('/login');
      cy.document().then((doc) => {
        const overflow = doc.documentElement.scrollWidth - doc.documentElement.clientWidth;
        expect(overflow, `${overflow}px of sideways scroll at ${width}px`).to.be.at.most(1);
      });
    });
  });

  it('a table stays readable on a phone', () => {
    cy.viewport(375, 812);
    cy.visit('/tables');
    cy.get('#table1').should('be.visible');
    cy.get('#table1 tbody tr').should('have.length.greaterThan', 0);
  });
});
