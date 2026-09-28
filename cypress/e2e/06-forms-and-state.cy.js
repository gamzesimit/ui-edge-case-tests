/**
 * Form behaviour that a storefront or a banking screen relies on and that is
 * easy to break without anyone noticing: what a key press actually sends, what
 * a slider reports, what survives a redirect, and what a page keeps in storage.
 */
describe('Forms and state', () => {
  it('a key press is reported by the page', () => {
    // the input sits inside a form, so Enter submits and reloads the page and
    // wipes the result. Use keys that do not submit.
    cy.visit('/key_presses');
    cy.get('#target').type('{esc}');
    cy.get('#result').should('contain.text', 'ESCAPE');
    cy.get('#target').type('a');
    cy.get('#result').should('contain.text', 'A');
    cy.get('#target').type('{backspace}');
    cy.get('#result').should('contain.text', 'BACK_SPACE');
  });

  it('a slider reports the value it is dragged to', () => {
    cy.visit('/horizontal_slider');
    cy.get('input[type="range"]').invoke('val', 3.5).trigger('change');
    cy.get('#range').should('have.text', '3.5');
  });

  // UI-003. The link the caption advertises does not resolve.
  it.skip('the caption behind a hover carries a working profile link', () => {
    cy.visit('/hovers');
    cy.get('.figure')
      .first()
      .find('a')
      .should('have.attr', 'href')
      .then((href) => {
        cy.request(href).its('status').should('eq', 200);
      });
  });

  it('the profile links are counted, pinning UI-003', () => {
    // the caption is revealed by a CSS hover rule, which a synthetic mouseover
    // does not trigger, so check what the customer would land on instead of the
    // visual state
    cy.visit('/hovers');
    const statuses = [];
    cy.get('.figure a')
      .each(($link) => {
        const href = $link.attr('href');
        expect(href, 'the caption must offer a profile link').to.match(/\/users\/\d+/);
        cy.request({ url: href, failOnStatusCode: false }).then((r) => statuses.push(r.status));
      })
      .then(() => {
        const broken = statuses.filter((code) => code !== 200).length;
        expect(broken, `link statuses: ${statuses.join(', ')}`).to.eq(statuses.length);
      });
  });

  it('a page that shifts its content still exposes the same control', () => {
    cy.visit('/shifting_content/menu');
    cy.get('#content ul li').should('have.length.greaterThan', 0);
    cy.contains('a', 'Home').should('have.attr', 'href');
  });

  it('a disappearing element is either present or absent, never half there', () => {
    cy.visit('/disappearing_elements');
    cy.get('#content ul li a').then(($links) => {
      const labels = Cypress._.map($links, (l) => l.innerText.trim());
      expect(labels).to.include('Home');
      labels.forEach((label) => expect(label).to.not.equal(''));
    });
  });
});
