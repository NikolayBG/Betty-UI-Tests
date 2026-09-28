# Betty.com — Critical Test Cases

Compact smoke suite for **desktop Chrome** against https://betty.com/.  
Each automated case maps 1:1 via the `TC-…` id in Playwright titles.

**Preconditions (all):** fresh guest session (not logged in).  
**Scope:** critical guest paths only — home, auth entry, register gate, games, compliance.  
**Not automated on prod:** real login / full registration (staging only).

---

## Home

### TC-HOME-001 — Home loads with primary CTAs
| | |
|--|--|
| **Priority** | P0 |
| **Steps** | Open `/`. |
| **Expected** | Title contains “Betty”. Visible: Log In, Join Betty, Claim your Bonus, games carousel, footer. |
| **Automated** | `tests/home.spec.ts` |

---

## Auth

### TC-AUTH-001 — Login modal + empty validation
| | |
|--|--|
| **Priority** | P0 |
| **Steps** | Open `/` → **Log In** → submit with empty fields. |
| **Expected** | Auth modal shows Email, Password, Log In, Forgot Password?. Message: **Email and password are required**. |
| **Automated** | `tests/login.spec.ts` |

### TC-AUTH-002 — Join Betty → Register
| | |
|--|--|
| **Priority** | P0 |
| **Steps** | Open `/` → **Join Betty**. |
| **Expected** | URL `/register`; “Register to Betty Casino” visible. |
| **Automated** | `tests/login.spec.ts` |

### TC-AUTH-003 — Guest `/account` requires login
| | |
|--|--|
| **Priority** | P0 |
| **Steps** | Open `/account` while logged out. |
| **Expected** | Login modal shown. |
| **Automated** | `tests/login.spec.ts` |

### TC-AUTH-M01 — Invalid / valid login (manual, staging)
| | |
|--|--|
| **Priority** | P0 |
| **Automated** | No — needs staging credentials; do not hammer prod |
| **Steps** | Invalid email/password → clear error, stay logged out. Valid staging user → authenticated shell. |

---

## Registration

### TC-REG-001 — Register email step + empty validation
| | |
|--|--|
| **Priority** | P0 |
| **Steps** | Open `/register` → **Next** with empty email. |
| **Expected** | Email field, Next, 18+/T&Cs copy. Message: **Please enter a valid email address.** |
| **Automated** | `tests/register.spec.ts` |

### TC-REG-M01 — Full registration (manual, staging)
| | |
|--|--|
| **Priority** | P0 |
| **Automated** | No — creates accounts; staging only |
| **Steps** | Complete registration with a unique staging email. |
| **Expected** | Account created / verification flow as designed. |

---

## Games & compliance

### TC-GAMES-001 — Games lobby
| | |
|--|--|
| **Priority** | P0 |
| **Steps** | Open `/games`. |
| **Expected** | “Most Popular” and “See All Games” (or equivalent) visible. |
| **Automated** | `tests/navigation.spec.ts` |

### TC-RG-001 — Responsible gaming markers
| | |
|--|--|
| **Priority** | P0 |
| **Steps** | Open `/responsible-gaming`. |
| **Expected** | Responsible Gaming content; 18+ and Kahnawake Gaming Commission mentioned. |
| **Automated** | `tests/navigation.spec.ts` |

---

## Traceability

| TC ID | Automated |
|-------|-----------|
| TC-HOME-001 | `home.spec.ts` |
| TC-AUTH-001..003 | `login.spec.ts` |
| TC-AUTH-M01 | — (staging) |
| TC-REG-001 | `register.spec.ts` |
| TC-REG-M01 | — (staging) |
| TC-GAMES-001, TC-RG-001 | `navigation.spec.ts` |

**Run:** `npx playwright test` (Chrome only).
