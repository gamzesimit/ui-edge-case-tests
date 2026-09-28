import './commands';

// The application deliberately raises a script error on one page. Fail the test
// only when the error is not the one that page is known to raise, so a real
// script failure elsewhere still breaks the run.
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('This is a JavaScript error')) return false;
  return true;
});
