/** Sign in through the form authentication page. */
Cypress.Commands.add('signIn', (username, password) => {
  cy.visit('/login');
  cy.get('#username').clear().type(username);
  cy.get('#password').clear().type(password, { log: false });
  cy.get('button[type="submit"]').click();
});

/** Read a column of a table as text, trimmed. */
Cypress.Commands.add('columnValues', { prevSubject: 'element' }, (table, columnIndex) => {
  return cy
    .wrap(table)
    .find('tbody tr')
    .then(($rows) => Cypress._.map($rows, (row) => row.cells[columnIndex].innerText.trim()));
});

/** Turn a money string such as "$50.00" into a number. */
Cypress.Commands.add('toAmount', (text) => Number(String(text).replace(/[^0-9.-]/g, '')));
