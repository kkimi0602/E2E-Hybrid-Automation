# Prompt / Implementation Log

## Approach

- Hybrid approach used: Copilot-assisted architecture and refactoring, manual verification of selectors and flow behavior on the target site.
- Reason: AI was faster for scaffolding DRY/SOLID layers and fixture design, while manual checks were needed for dynamic UI specifics.

## MCP / Locator Generation Evidence

- POM locators were reviewed against AutomationExercise UI semantics (role-based and data-qa first, then resilient CSS fallbacks where needed).
- Main optimized locator choices:
  - Auth: `input[data-qa="login-email"]`, `button[data-qa="login-button"]`, `a:has-text("Logged in as")`
  - Cart: `tr[id^="product-"]`, `a:has-text("Proceed To Checkout")`
  - Checkout: `h2[data-qa="order-placed"]`, `button[data-qa="pay-button"]`

## Healing / Broken Selector Fix Example

- Initial cart selectors were generic (`.cart-item`, `.cart-total`) and were not stable on AutomationExercise.
- Healing strategy:
  1.  Reproduce failing assertion with UI test.
  2.  Inspect rendered DOM structure for cart rows.
  3.  Replace with stable prefix locator `tr[id^="product-"]` and product-name scoped filtering.
  4.  Re-run tests to verify fix.

## Architectural Notes

- Implemented strict layering with custom fixtures:
  - Specs call service/page/api abstractions only.
  - Service layer coordinates multi-step business flows.
  - Data factories/builders generate runtime data and reduce hardcoded test data.
- Patterns used:
  - POM: `pages/*`
  - Factory/Builder: `utils/factories/*`, `utils/testData.ts`
  - Dependency inversion via fixture-provided dependencies in `tests/fixtures/test-fixtures.ts`.

## Known Environment Constraint

- AutomationExercise public API does not expose cart mutation endpoints compatible with the user story `API add-to-cart -> UI verification`.
- Tests for this part are implemented as conditional and skipped when endpoint support is unavailable.
