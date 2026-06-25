# Role & Goal

You are an expert full-stack engineer. Build a production-grade, highly testable full-stack calculator application using a monorepo structure. The app must process multi-operand mathematical equations using an API Gateway/Orchestrator microservice pattern.

# Repository Structure

Create a monorepo structured exactly as follows:

- `/backend` - Node.js + Express + TypeScript
- `/frontend` - React + TypeScript + Vite + Tailwind CSS
- `/Dockerfile` - A multi-stage production Dockerfile in the root

# Technical Requirements

## 1. Backend Orchestrator & Math Engine

- Expose a single REST endpoint: `POST /api/v1/calculate` which accepts a JSON payload: `{ "equation": "string" }`.

- **CRITICAL SECURITY:** Do NOT use `eval()`, `Function()`, or any third-party string evaluation libraries to process the equation.
- Implement a custom **Tokenizer** and use the **Shunting-Yard Algorithm** to parse the equation string into Reverse Polish Notation (RPN) before evaluation. This must respect operator precedence (PEMDAS) and parentheses.
- **Microservice Separation:** Keep business logic strictly decoupled. The parsing engine must orchestrate and delegate individual math operations to isolated domain service modules:
  - `basicMathService`: Handles `+`, `-`, `*`, `/`.
  - `advMathService`: Handles advanced logic (`pow`, `sqrt`, `percentage`).
- **Edge Cases & Validation:** Validate that the input is a valid mathematical string. Handle division by zero, float precision anomalies, and unparseable equations gracefully by returning a `422 Unprocessable Entity` status code with a descriptive JSON error payload.
- Use pino or any other logger library for basic logging

## 2. Frontend UX & Accessibility

- Build a clean, responsive layout using Tailwind CSS with mobile support.
- Show a dual-line display: one for the live entered string/equation, and another for the loading state, errors, or final computed result.
- **Hybrid Input System:**
  - Provide a visual grid of interactive calculator buttons.
  - Implement full physical keyboard support via global listeners. Ensure keys like numbers, standard operators, `Enter` (for calculating), `Backspace` (for deletion), and `Escape` (for clear) are fully mapped.
  - Avoid browser "double execution" focus traps by ensuring that hitting 'Enter' after clicking an on-screen button does not re-fire that clicked button.
  - Prevent default browser behaviors (e.g., opening search bars on `/` or navigating backward on `Backspace`).
- Follow the atom, molecule, and organism structure for creating reusable components
- Use fetch while performing HTTP requests and follow the react-query pattern for creating reusable hooks that call the backend
- Keep utility functions in a different folder

## 3. DevOps & Containerization

- Write a root multi-stage `Dockerfile`:
  - **Stage 1 (Frontend Builder):** Build the static production assets for the React application.
  - **Stage 2 (Backend Builder):** Compile TypeScript to JavaScript for the Express API.
  - **Stage 3 (Runner):** Create a lightweight Alpine image. Copy the backend production code and place the built frontend assets inside the backend's static public folder.

- Ensure the Express backend uses `express.static` to serve the React assets so that the entire full-stack application runs out of a single container on a single port (e.g., 5000) without cross-origin resource sharing (CORS) friction.

## 4. Testing & Documentation

- Write comprehensive unit tests for the core calculation utilities and the Shunting-Yard parser using Vitest or Jest. Ensure edge cases (like division by zero or nested parentheses) are heavily covered.

- Write basic unit tests for the utility functions and components
- Provide a clear `README.md` file explaining the architecture choice, how to build/run the application via Docker, and your design rationale regarding the microservice orchestration pattern.

# Execution Instructions

Proceed step-by-step:

1. Initialize the monorepo directory structure, `package.json` configurations, and TypeScript configs.
2. Build the backend parsing utility and core services first, accompanied by unit tests.
3. Build the frontend UI layout, state machine hook, and keyboard mapping.
4. Hook up the API integration.
5. Create the unified multi-stage Dockerfile.

Verify compilation and ensure code hygiene remains exemplary at every stage.
