# Contributing

## Running the suite

```bash
docker compose up -d
npm ci
npx cypress run
```

## How a test is written here

1. Wait for the thing the test needs. There is no `cy.wait(2000)` in this
   repository and there should not be one.
2. Check what the customer would land on, not only what the markup says. A link
   with an href passes every assertion about the element and can still be a 404.
3. Compare money and other numbers as numbers. A column sorted as text puts
   $100.00 above $9.99 and every string assertion still passes.
4. A rule this build breaks is skipped with `it.skip` and carries the defect id,
   with a second test beside it pinning the present behaviour so a fix shows up
   as a failure.
5. Write down the reason in the file when a test looks odd. Two of the tests here
   avoid Enter and avoid a synthetic hover for reasons that are not obvious.

## Formatting

```bash
npm run format
```

Formatting is checked in continuous integration.

## Reporting a defect

Add it to `docs/defect-reports.md` in the shape used by the entries there.
