# UI edge case tests

[![tests](https://github.com/gamzesimit/ui-edge-case-tests/actions/workflows/tests.yml/badge.svg)](https://github.com/gamzesimit/ui-edge-case-tests/actions/workflows/tests.yml)

A Cypress suite over the browser behaviour that breaks automated tests: content
that arrives late, alerts, frames, new windows, file upload and download, tables
that claim to sort, and images that look present and are not.

Two defects reported: a misspelled confirmation message and two images on a page
that do not resolve.

Reports: [docs/defect-reports.md](docs/defect-reports.md)

## Running it

```bash
docker compose up -d    # the application on http://localhost:7080
npm ci
npx cypress run
```

Interactively:

```bash
npx cypress open
```

## What is covered

| File | Area |
|---|---|
| `01-authentication.cy.js` | Valid sign in, wrong password, unknown user, sign out then back button, basic authentication |
| `02-data-tables.cy.js` | Alphabetical sorting, amount column sorted by value rather than as text, two decimal places on every amount, two tables holding the same rows |
| `03-waiting.cy.js` | Elements hidden until loading finishes, elements that do not exist yet, controls that appear and disappear, a field enabled after a request, a slow page |
| `04-inputs-and-dialogs.cy.js` | Number field boundaries, checkboxes, dropdown, alert, confirm dismissed, prompt, frames, a new window |
| `05-broken-things.cy.js` | Images that actually load, status codes, redirects, a download with content, a file upload |

Twenty nine tests. Two are skipped and carry the defect id they belong to, each
with a second test beside it that pins the present behaviour, so a fix turns into
a failing test rather than passing unnoticed.

## Why an amount column has its own test

A column of money sorted as text puts $100.00 above $9.99. Nothing breaks, no
error is raised, and the person reading the first row acts on the wrong number.
That is the class of fault this suite is built to catch, and it is why the table
check compares numbers rather than strings.

## No fixed pauses

There is no `cy.wait(2000)` anywhere in this suite. Every wait is on the thing
the test needs: an element becoming visible, a control disappearing, a field
becoming enabled. Fixed pauses are the usual reason a suite is slow in the
morning and red in the afternoon.

## Structure

```
cypress/e2e/         specs grouped by area
cypress/support/     custom commands and the one deliberate error allowance
docs/                defect reports
```
