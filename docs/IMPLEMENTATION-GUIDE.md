# Betty UI Tests — Implementation Guide (for Juniors)

This guide explains **how this project is built**, **why we chose this shape**, and **how to add or debug a test** without guessing.

---

## 1. What are we testing?

We run **automated UI smoke tests** against the live Betty site: [https://betty.com](https://betty.com).

| Term | Meaning here |
|------|----------------|
| **Smoke suite** | A small set of critical checks (home, login gate, register gate, games, responsible gaming) |
| **Guest session** | User is **not** logged in (fresh browser context each test) |
| **Chrome only** | We run Desktop Chromium — not Firefox/Safari — for speed and stability |

Human-readable cases live in `docs/TEST-CASES.md`. Every automated test title starts with the same id (e.g. `TC-AUTH-001: …`) so manual and automation stay aligned.

**We do not automate on production:** real login with valid credentials, full registration, payments, or real gameplay.

---

## 2. How to run the suite

```bash
cd Betty-UI-Tests
npm ci                          # first time / after pull
npx playwright install chromium # first time only
npm test                        # all 7 Chrome tests
npm run test:headed             # watch the browser
npm run test:ui                 # Playwright’s interactive UI
npm run report                  # open last HTML report
```

Stability check used before trusting the suite: run `npm test` **three times**. All should pass.

---

## 3. Project map

```
Betty-UI-Tests/
├── playwright.config.ts      # baseURL, Chrome project, timeouts, CI retries
├── package.json              # npm scripts
├── pages/                    # Page Object Model (how to talk to the UI)
│   ├── BasePage.ts           # shared goto + SPA wait + common header/footer
│   ├── HomePage.ts
│   ├── LoginModal.ts
│   ├── RegisterPage.ts
│   └── ContentPages.ts       # games, content, guest /account
├── tests/                    # specs (what to assert)
│   ├── home.spec.ts          # TC-HOME-001
│   ├── login.spec.ts         # TC-AUTH-001…003
│   ├── register.spec.ts      # TC-REG-001
│   └── navigation.spec.ts    # TC-GAMES-001, TC-RG-001
├── .github/workflows/        # CI: install Chromium + run tests
└── docs/
    ├── TEST-CASES.md         # cases + traceability
    └── IMPLEMENTATION-GUIDE.md  # this file
```

---

## 4. Core ideas (learn these first)

### 4.1 Test vs Page Object

| Layer | Job | Example |
|-------|-----|---------|
| **Test** (`tests/*.spec.ts`) | Business intent + assertions | “Login modal shows required-field error” |
| **Page Object** (`pages/*.ts`) | Selectors and UI actions | `openLogin()`, `submitEmpty()` |

**Why:** If Betty renames a button’s `data-testid`, you fix **one** page object, not every test.

### 4.2 Example flow (TC-AUTH-001)

```text
test
  → new HomePage(page)
  → home.open()                 // goto / + wait for SPA
  → home.openLogin()            // click Log In → LoginModal
  → login.submitEmpty()
  → login.expectRequiredFieldError()
```

### 4.3 Selectors we prefer

Betty is a **React Native Web** SPA. Generated CSS class names change often.

| Prefer | Avoid |
|--------|--------|
| `page.getByTestId('button-login')` | Long CSS like `.css-g5y9jx …` |
| `getByRole('button', { name: 'Log In' })` | Fragile XPaths |
| Scoped locators when ids repeat | Assuming one match when sticky + landing share a test id |

**Duplicate test ids:** the Claim Bonus button can appear in both a sticky banner and the landing promo. We scope to `landing-promo-container` so Playwright’s strict mode does not fail.

### 4.4 Waiting for the SPA

Never rely on fixed `sleep`s. `BasePage.goto()`:

1. Navigates with `waitUntil: 'domcontentloaded'`
2. Hides `#spinner` if present
3. Waits until a known landmark is visible (login button, landing page, footer, auth modal, register step, …)

### 4.5 Assertions auto-wait

```ts
await expect(locator).toBeVisible();
await expect(page).toHaveURL(/\/register/);
```

Playwright retries until the expect timeout (10s in config). Prefer that over `waitForTimeout`.

---

## 5. What each file covers today

| Spec | TC IDs | Intent |
|------|--------|--------|
| `home.spec.ts` | TC-HOME-001 | Home loads: title + primary CTAs + carousel + footer |
| `login.spec.ts` | TC-AUTH-001 | Login modal + empty submit validation |
| | TC-AUTH-002 | Join Betty → `/register` |
| | TC-AUTH-003 | Guest `/account` shows login modal |
| `register.spec.ts` | TC-REG-001 | Register email step + empty email validation |
| `navigation.spec.ts` | TC-GAMES-001 | Games lobby categories |
| | TC-RG-001 | Responsible gaming: 18+ + Kahnawake |

Manual-only staging cases (login happy path, full registration) are documented in `TEST-CASES.md` as `TC-AUTH-M01` / `TC-REG-M01`.

---

## 6. Config that matters

In `playwright.config.ts`:

- **`baseURL: 'https://betty.com'`** — tests use paths like `'/'` or `'/games'`
- **One project: Chromium** — Desktop Chrome device profile
- **`timeout: 60_000`** per test; **`expect.timeout: 10_000`**
- **CI:** retries = 2, workers = 1; screenshots on failure; trace on first retry

CI workflow (`.github/workflows/playwright.yml`) installs **Chromium only** (`npx playwright install --with-deps chromium`) then runs `npx playwright test`.

---

## 7. How to add a new test (checklist)

1. Add a **TC-…** entry to `docs/TEST-CASES.md` (steps + expected).
2. Reuse a page object or add a small method in `pages/`.
3. Add `test('TC-…: short name', async ({ page }) => { … })` in the right spec file.
4. Run: `npx playwright test tests/yourfile.spec.ts`
5. If it fails: `npm run report` → open screenshot / error context.
6. Re-run the full suite a couple of times if the failure looks timing-related (flaky).

---

## 8. Conventions

- One clear behaviour per `test(…)`.
- Put the **TC id in the title** for traceability.
- No secrets or real credentials in the repo.
- Do not hammer production with login/registration loops.
- Prefer `data-testid` from the app.

---

## 9. Mental model

```
docs/TEST-CASES.md  ── same TC ids ──►  tests/*.spec.ts
                                              │
                                              ▼
                                         pages/*.ts
                                              │
                                              ▼
                                    Playwright (Chromium)
                                              │
                                              ▼
                                         betty.com
```

When something fails, ask in order:

1. **Product change?** (copy/URL/`data-testid` changed)
2. **Bad wait?** (SPA not ready — use page helpers)
3. **Strict mode / duplicate locator?** (scope the locator)
4. **Environment?** (site down, geo block, network)

---

## 10. Stability note (this suite)

The compact Chrome suite (7 tests) was verified with **3 consecutive green runs** before documenting this guide. Prefer keeping the suite small and critical over growing coverage on production without staging.
