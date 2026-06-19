# Votely

Votely is a multi-election voting platform built on the MERN stack (MongoDB, Express, React, Node.js). It's designed to let an organization run several elections at once — each with its own candidates — and let voters browse elections, cast votes, and view results.

> **Status:** Early development. The frontend scaffold (routing, layout, navbar, theming) is in place. The backend (Express API, MongoDB models, auth) has not been built yet.

## Tech Stack

**Frontend**
- React 19
- React Router 7
- Vite 8
- react-icons
- Plain CSS with custom properties (no UI framework)

**Backend** *(planned)*
- Node.js / Express
- MongoDB with Mongoose
- JWT-based authentication

## Project Structure

```
mern-voting-app/
└── frontend/
    ├── src/
    │   ├── components/   # Shared UI (Navbar, etc.)
    │   ├── pages/        # Route-level views
    │   ├── styles/       # Per-component CSS
    │   └── assets/       # Images, icons, logo
    ├── public/
    └── vite.config.js
```

A `backend/` directory with the Express API and MongoDB models will be added as the project progresses.

## Features

### Implemented
- Responsive layout with a fixed navbar and mobile hamburger menu
- Light/dark theme toggle (UI only — persistence not yet wired up)
- Client-side routing for the core app flow:
  - `/` — Login
  - `/register` — Register
  - `/elections` — Browse elections
  - `/elections/:id` — Election details
  - `/elections/:id/candidates` — Candidates for an election
  - `/results` — Voting results
  - `/congrats` — Post-vote confirmation
  - `/logout` — Logout
  - 404 page with auto-redirect

### Planned
- Express API with MongoDB-backed models for Users, Elections, Candidates, and Votes
- JWT authentication with voter/admin roles
- Election creation and management (admin)
- Casting and recording votes, with safeguards against duplicate voting
- Live/aggregated results per election

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at the local URL Vite prints (typically `http://localhost:5173`).

Other scripts:

```bash
npm run build     # Production build
npm run preview   # Preview the production build locally
npm run lint       # Run ESLint
```

### Backend

Not yet implemented. Once added, it will live in a `backend/` directory with its own setup instructions (MongoDB connection string, JWT secret, etc.) here.

## Roadmap

- [ ] Scaffold Express server and connect to MongoDB
- [ ] Define Mongoose models: User, Election, Candidate, Vote
- [ ] Implement auth (register/login, JWT, protected routes)
- [ ] Wire up election + candidate CRUD
- [ ] Implement voting flow with duplicate-vote prevention
- [ ] Implement results aggregation and display
- [ ] Persist theme preference
- [ ] Add tests and CI

## License

Not yet specified.
