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

### Why Shunting-Yard instead of `eval()`?

`eval()` and `Function()` are security vulnerabilities — they execute arbitrary JavaScript. The [Shunting-Yard Algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm) (Dijkstra, 1961) converts infix notation to Reverse Polish Notation (RPN) in O(n), correctly handling operator precedence (PEMDAS) and parentheses without touching the runtime. The evaluator then walks the RPN stack with simple arithmetic — zero attack surface.

### Why the microservice-style service split?

`basicMathService` and `advMathService` are domain-isolated modules. The orchestrator (`calculatorService`) depends on abstractions, not implementations. This makes each arithmetic domain independently testable, replaceable (e.g. swap `advMathService` for a GPU-backed service), and auditable.

### Frontend Component Hierarchy

```
App
└── Calculator (organism)
    ├── Display (molecule)
    │   ├── DisplayLine (atom)
    │   └── Spinner (atom)
    └── ButtonGrid (molecule)
        └── CalcButton[] (atom)
```

Hooks are decoupled from UI: `useCalculate` owns all state and async logic; `useKeyboard` owns the global keyboard listener. The double-fire prevention (`skipNextEnterRef`) ensures clicking `=` with a mouse and then pressing Enter doesn't double-submit.

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
│       ├── atoms/         CalcButton  DisplayLine  Spinner
│       ├── molecules/     Display  ButtonGrid
│       ├── organisms/     Calculator
│       ├── hooks/         useCalculate  useKeyboard
│       └── utils/         api  buttonLayout  formatEquation
├── Dockerfile
└── README.md
```
