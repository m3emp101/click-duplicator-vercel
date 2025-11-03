## Click Duplicator

Full-stack MERN application for configuring event-driven marketing campaigns with squeeze, delay, and exit popups.

### Prerequisites
- Node.js 18+
- npm
- MongoDB instance (local or cloud)

### Backend (`server`)
1. Copy `.env.example` to `.env` and update values:
   - `MONGO_URI` ? Mongo connection string
   - `JWT_SECRET` ? random secret
   - `CLIENT_URL` ? frontend origin (defaults to `http://localhost:5173`)
2. Install dependencies and start the API:
   ```bash
   cd server
   npm install
   npm run dev
   ```
   The API runs on `http://localhost:5000` by default.

### Frontend (`client`)
1. Copy `.env.example` to `.env` if you need to change the API URL.
2. Install dependencies and start the Vite dev server:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   The SPA runs on `http://localhost:5173`.

### Features
- Registration, login, logout (JWT + HTTP-only cookies)
- Account dashboard with plan management (Free, Standard, Pro, Unlimited)
- Campaign CRUD with cloning and live preview URLs (`/api/c/:slug`)
- Delay and exit popup orchestration rendered by the backend
- Plan limits enforced server-side and surfaced in the UI with upgrade links

### Testing the flow
1. Register a new account from the frontend.
2. Visit the `Campaigns` page to create a campaign within your plan limit.
3. Use the preview link to open the runtime page and observe delay/exit popups.
4. Upgrade the plan from the `Account` page to unlock higher campaign quotas.
