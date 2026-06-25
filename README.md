# Sezzle Calculator

A production-grade full-stack calculator built as a monorepo with an API Gateway / Orchestrator microservice pattern.

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Single Container                   │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │           Express Backend (port 3000)        │    │
│  │                                             │    │
│  │  POST /api/v1/calculate                     │    │
│  │         │                                   │    │
│  │         ▼                                   │    │
│  │  ┌─────────────────┐                        │    │
│  │  │ calculatorService│  ◄── Orchestrator      │    │
│  │  └────────┬────────┘                        │    │
│  │           │                                 │    │
│  │     ┌─────┴──────┐                          │    │
│  │     ▼            ▼                          │    │
│  │  tokenizer   shuntingYard (→ RPN)            │    │
│  │     └─────┬──────┘                          │    │
│  │           ▼                                 │    │
│  │       evaluator                             │    │
│  │      /        \                             │    │
│  │ basicMath   advMath                         │    │
│  │  Service    Service                         │    │
│  │                                             │    │
│  │  express.static → React SPA assets          │    │
│  └─────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

---

## Design Decisions & Assumptions

### Parsing & Security

| Decision                                                            | Rationale                                                                                                                                                     |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No `eval()`, `Function()`, or third-party expression evaluators** | String evaluation would execute arbitrary code. A custom parser eliminates injection risk entirely.                                                           |
| **Allowlist regex before tokenization**                             | `calculatorService` rejects equations containing characters outside `[0-9+\-*/^().,% a-z]` before any parsing begins, providing a fast first line of defense. |

### Microservice Orchestration (Logical, Not Physical)

The "microservice" split is **architectural, not infrastructural** — all services run in-process within a single Node.js process. This was a deliberate choice:

- **`calculatorService`** acts as the orchestrator: it validates input, coordinates the parse pipeline, and maps domain errors to HTTP responses. It never performs arithmetic directly.
- **`basicMathService`** owns `+`, `-`, `*`, `/` and throws a typed `DivisionByZeroError` on `/ 0`.
- **`advMathService`** owns `pow`, `sqrt`, and `%`.

This separation makes each domain independently testable and swappable (e.g. replacing `advMathService` with a WASM or remote implementation) without touching the parser or route layer. For a calculator of this scope, separate deployable services would add network latency and operational overhead with no proportional benefit.

### API & Error Handling

| Decision                                             | Detail                                                                                                                                                                                       |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Single endpoint: `POST /api/v1/calculate`**        | All calculation flows through one gateway endpoint, keeping the API surface minimal.                                                                                                         |
| **`422 Unprocessable Entity` for all client errors** | Empty input, invalid characters, parse failures, division by zero, and non-finite results all return `422` with `{ error, detail }`. This distinguishes "bad input/math" from server faults. |
| **`500`-class errors are unexpected only**           | Unhandled exceptions inside the orchestrator are logged via pino and returned as `{ error: "Internal error" }`.                                                                              |

### Frontend

| Decision                                             | Rationale                                                                                                                                                                                                                                         |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Atomic Design (atoms → molecules → organisms)**    | Keeps UI primitives reusable and testable in isolation. Display lines, buttons, and spinners are atoms; Display and ButtonGrid compose them; Calculator is the top-level organism.                                                                |
| **Custom hook over TanStack Query**                  | `useCalculate` follows the react-query _pattern_ (dedicated async hook, loading/error/success states, decoupled from JSX) without adding a query-cache dependency. A calculator submits ephemeral, non-idempotent requests with no cache benefit. |
| **Global `keydown` listener (not per-button focus)** | Ensures full keyboard support regardless of which element is focused. `preventDefault` is applied to `/`, `Backspace`, and `Enter` to stop browser navigation shortcuts.                                                                          |

### DevOps & Runtime

| Assumption                              | Detail                                                                                                                                                                                                                 |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Single container on port 3000**       | The multi-stage Dockerfile builds frontend assets and backend JS separately, then copies static files into `dist/public`. Express serves the SPA and API from one port — no CORS configuration required in production. |
| **npm workspaces monorepo**             | Root `package.json` orchestrates `backend` and `frontend` workspaces. Shared tooling scripts (`dev:backend`, `test`, etc.) live at the root.                                                                           |
| **Node.js 20 Alpine**                   | Used in all Docker stages for a small image footprint and LTS stability.                                                                                                                                               |
| **Dev: Vite on `:5173` with API proxy** | Hot module replacement during frontend development; production uses the unified container.                                                                                                                             |

### Testing

| Scope                           | Tooling                  | Focus                                                                                                            |
| ------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Backend parser & math engine    | Jest                     | Tokenizer edge cases, Shunting-Yard precedence/parentheses, division by zero, nested expressions, float rounding |
| Frontend utilities & components | Vitest + Testing Library | `formatEquation`, button layout, display rendering, hook state transitions                                       |

---

## Running with Docker

### Build

```bash
docker build -t sezzle-calculator .
```

### Run

```bash
docker run -p 3000:3000 sezzle-calculator
```

Open [http://localhost:3000](http://localhost:3000) — the Express server serves both the API and the React SPA from a single port with no CORS configuration needed.

---

## Local Development

### Prerequisites

- Node.js 20+

### Install all workspaces

```bash
npm install
```

### Backend dev server

```bash
npm run dev:backend
# API available at http://localhost:3000
```

### Frontend dev server (with HMR + proxy to backend)

```bash
npm run dev:frontend
# UI available at http://localhost:5173
```

---

## Running Tests

```bash
# All tests
npm test

# Backend only (Jest + coverage)
npm run test:backend

# Frontend only (Vitest + coverage)
npm run test:frontend
```

---

## API Reference

### `POST /api/v1/calculate`

**Request**

```json
{ "equation": "sqrt(9) + pow(2, 8) * 50%" }
```

**Success `200`**

```json
{ "result": 131, "equation": "sqrt(9) + pow(2, 8) * 50%" }
```

**Error `422`**

```json
{ "error": "Division by zero", "detail": "Division by zero is undefined" }
```

Supported operators: `+  -  *  /  ^`  
Supported functions: `sqrt(x)  pow(base, exp)  x%`  
Parentheses and nested expressions are fully supported.

---

## Project Structure

```
sezzle/
├── backend/
│   ├── src/
│   │   ├── middleware/    validateRequest.ts
│   │   ├── routes/        calculate.ts
│   │   ├── services/      basicMathService.ts  advMathService.ts  calculatorService.ts
│   │   ├── types/         index.ts
│   │   └── utils/         tokenizer.ts  shuntingYard.ts  evaluator.ts  logger.ts
│   └── tests/unit/
├── frontend/
│   └── src/
|       ├── components
│       |   ├── atoms/         CalcButton  DisplayLine  Spinner
│       |   ├── molecules/     Display  ButtonGrid
│       |   ├── organisms/     Calculator
│       ├── hooks/         useCalculate  useKeyboard
│       └── utils/         api  buttonLayout  formatEquation
├── Dockerfile
└── README.md
```
