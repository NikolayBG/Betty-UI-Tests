# Betty.com — QA Analysis

**Application:** https://betty.com/  
**Type:** Online casino SPA (React Native Web), Canada-focused  
**Regulator callouts:** Kahnawake Gaming Commission, 18+  

## 1. Product map (what we can test)

| Area | Entry points | Notes |
|------|----------------|-------|
| Home / landing | `/` | Hero, CTAs (Log In, Join Betty, Claim Bonus), games carousel, promos, comparison, FAQ, footer |
| Auth (guest) | Log In button → `modal-Auth` | Modal overlay; URL stays `/` |
| Forgot password | From login modal | Inline reset UI (“Reset your Betty password?”) |
| Registration | `/register` via Join Betty or Sign Up | Multi-step; first step = email + marketing + age/T&Cs |
| Account (guest) | `/account` | Forces login modal when not authenticated |
| Games | `/games`, `/all` | Lobby categories vs full catalogue |
| Promos | `/promos` | Special offers listing |
| Content / compliance | `/about`, `/contact`, `/level-up`, `/status`, `/privacy`, `/terms`, `/responsible-gaming` | Mostly static + support CTAs |
| Live chat | Contact / footer CTAs | Third-party widget; fragile for automation |

## 2. Critical user journeys

1. **Guest discovers Betty** → home loads, marketing claims visible, games/promos teaser present.  
2. **Guest logs in** → open modal → validate / submit credentials → authenticated lobby (needs test account).  
3. **Guest registers** → Join / Sign Up → email step validation → continue KYC/password steps (needs controlled env).  
4. **Guest recovers password** → Forgot Password → email reset.  
5. **Guest browses games/promos** without login.  
6. **Compliance** → responsible gaming, terms, privacy reachable from footer.

## 3. Risk hotspots (senior QA view)

| Risk | Why it matters | Test approach |
|------|----------------|---------------|
| Auth modal regressions | Blocks all returning players | UI + validation automation |
| Registration gate (18+ / T&Cs) | Legal / licensing | Assert copy + blocked Next without email |
| Protected routes (`/account`) | Session gating | Guest must see login, not empty account |
| Footer / deep links | SEO + support + compliance | Smoke navigation |
| SPA load / spinner | Blank page looks “down” | Wait for `#spinner` hidden + landmarks |
| Geo / bot / CORS on APIs | Login/promos APIs may fail in some environments | Separate API/env checks; UI still asserts client validation |
| Real-money flows | Deposit, withdraw, play | **Manual / staging only** — out of unattended prod automation |
| Accessibility of RNW controls | Inputs often lack `<label for>` | Prefer `data-testid` |

## 4. In-scope vs out-of-scope for this suite

**In scope (manual + automated against production UI):**  
Guest home, login modal open/close/validation, forgot-password UI, join/register entry, guest `/account`, promos/games smoke, footer content/compliance pages.

**Out of scope (need staging credentials or are unsafe on prod):**  
Successful login with real users, full registration completion, deposits/withdrawals, game launch/wagers, live chat end-to-end, geo-block matrices, payment providers.

## 5. Testability notes

Stable selectors found on the site:

- `button-login`, `button-join`, `modal-Auth`
- `input-container-email`, `input-container-password`
- `registration-step-email`, `button-nextButton`
- `landing-page`, `promos-section`, `footer`, `nav-bar`

Login is a **modal**, not `/login`. Registration is a **dedicated route** `/register`.
