/**
 * A table of money is the place a sorting fault costs the most, because a
 * column sorted as text puts $100.00 before $9.99 and nobody reads past the
 * first row.
 */
describe('Sortable data tables', () => {
  const DUE_COLUMN = 3;
  const LAST_NAME_COLUMN = 0;

  beforeEach(() => cy.visit('/tables'));

  it('sorts the last name column alphabetically', () => {
    cy.get('#table1 thead th').eq(LAST_NAME_COLUMN).click();
    cy.get('#table1')
      .columnValues(LAST_NAME_COLUMN)
      .then((values) => {
        expect(values).to.deep.equal([...values].sort((a, b) => a.localeCompare(b)));
      });
  });

  it('sorts the amount column by value, not as text', () => {
    cy.get('#table1 thead th').eq(DUE_COLUMN).click();
    cy.get('#table1')
      .columnValues(DUE_COLUMN)
      .then((values) => {
        const amounts = values.map((v) => Number(v.replace(/[^0-9.-]/g, '')));
        expect(amounts, `column read as ${values.join(', ')}`).to.deep.equal(
          [...amounts].sort((a, b) => a - b),
        );
      });
  });

  it('every amount is written with two decimal places', () => {
    cy.get('#table1')
      .columnValues(DUE_COLUMN)
      .then((values) => {
        values.forEach((value) => {
          expect(value, 'a money cell must carry cents').to.match(/^\$\d+\.\d{2}$/);
        });
      });
  });

  it('the second table holds the same rows as the first', () => {
    cy.get('#table1')
      .columnValues(LAST_NAME_COLUMN)
      .then((first) => {
        cy.get('#table2')
          .find('tbody tr')
          .then(($rows) => {
            const second = Cypress._.map($rows, (row) =>
              row.cells[LAST_NAME_COLUMN].innerText.trim(),
            );
            expect(second.sort()).to.deep.equal([...first].sort());
          });
      });
  });
});
