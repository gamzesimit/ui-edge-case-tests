# Defect reports

Application under test: The Internet, a page set published for practising
browser automation, run locally from `gprestes/the-internet`.
Tested September 2026 in Chrome through Cypress.

The pages carry faults on purpose. Reporting them is the exercise: a suite that
reports green against a page with two broken images is not a suite.

---

## UI-001 — The alert confirmation is misspelled

**Severity:** Low
**Page:** `/javascript_alerts`
**Status:** Reproducible on every attempt

**Steps**

1. Open the JavaScript alerts page.
2. Press "Click for JS Alert" and accept the dialog.

**Result**
The page prints "You successfuly clicked an alert", with one letter l in
successfully.

**Expected**
"You successfully clicked an alert".

**Impact**
Low on its own. It is reported because a spelling fault in a confirmation
message is the kind of thing that survives to production for years, and because
an automated check written against the correct spelling would fail here, which
is exactly what happened when this suite was written.

**Covered by** `cypress/e2e/04-inputs-and-dialogs.cy.js`. The strict check is
skipped and carries this defect id; alongside it a second test pins the present
wording so a fix shows up.

---

## UI-002 — Two of three images on the page do not resolve

**Severity:** Medium
**Page:** `/broken_images`
**Status:** Reproducible on every attempt

**Steps**

1. Open the broken images page.
2. Request the source of each image.

**Result**
`asdf.jpg` and `hjkl.jpg` do not resolve. The third image resolves. The browser
renders a placeholder, so a test that only checks the image element exists, or
that the page contains three images, reports green.

**Expected**
Every image source answers 200.

**Impact**
On a storefront this is a product with no picture, which is a direct loss of a
sale. The reason it is worth a report is the shape of the fault: the page looks
almost right, and the usual assertion does not see it.

**Covered by** `cypress/e2e/05-broken-things.cy.js`. The strict check is skipped
and carries this defect id; a second test counts the broken images and pins the
number at two.

---

## Rules that hold

- Sign in accepts a valid user, refuses a wrong password and an unknown user,
  and names which field was wrong in each case.
- Signing out makes the secure page unreachable by pressing back.
- The page behind basic authentication answers 401 without credentials and 200
  with them.
- The last name column sorts alphabetically, and the amount column sorts by
  value rather than as text, which is the fault this check exists to catch.
- Every amount in the table is written with two decimal places.
- The second table holds the same rows as the first.
- Content that arrives late is waited for correctly, with no fixed pause
  anywhere in the suite.
- Alerts, confirms and prompts are handled, and dismissing a confirm is recorded
  as a dismissal.
- A file uploads and the page names it back; a download returns content rather
  than an empty response.
- Status code links return the codes they promise, and a redirect ends where it
  promises.
