# Votely

Votely is a multi-election voting platform built on the MERN stack (MongoDB, Express, React, Node.js). It lets an organization run several elections at once — each with its own candidates — and lets voters register, log in, browse elections, cast one vote per election, and view results.

> **Status:** Deployed. Registration, login/logout (JWT in an httpOnly cookie), election + candidate CRUD with Cloudinary image uploads, and vote casting (with duplicate-vote prevention via a MongoDB transaction) are all implemented end to end. Runs in production on a Kubernetes cluster via an automated CI/CD pipeline.

## Tech Stack

**Frontend**
- React 19
- React Router 7
- Redux Toolkit + React-Redux
- Vite 8
- Axios
- react-icons
- Plain CSS with custom properties (no UI framework)

**Backend**
- Node.js / Express 5
- MongoDB with Mongoose
- JWT (jsonwebtoken) auth via httpOnly cookies + cookie-parser
- bcryptjs (password hashing)
- Cloudinary (image storage) + express-fileupload
- cors, dotenv

**Infrastructure**
- Docker (multi-stage builds; frontend served via nginx)
- Kubernetes (Deployments, Services, Ingress via Traefik, cert-manager for TLS)
- GitHub Actions CI/CD: Trivy vulnerability scan → build & push images to Docker Hub → deploy to the cluster

## Project Structure

```
mern-voting-app/
├── backend/
│   └── src/
│       ├── controllers/   # Voter, election, candidate, and vote logic
│       ├── models/        # Mongoose schemas (Voter, Election, Candidate)
│       ├── routes/        # API route definitions
│       ├── middleware/    # Auth (JWT), 404 + centralized error handler
│       ├── lib/           # MongoDB connection
│       ├── utils/         # HttpError class, JWT helper, Cloudinary config
│       └── index.js       # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/    # Shared UI (Navbar, election/candidate cards, admin modals)
│   │   ├── pages/         # Route-level views
│   │   ├── store/         # Redux slices (ui, vote)
│   │   └── assets/        # Images, icons, logo
│   ├── public/
│   └── vite.config.js
├── kubernetes/             # Deployment, Service, Ingress, and cert-manager manifests
└── .github/workflows/      # CI/CD pipeline (scan, build, push, deploy)
```

## Data Models

**Voter**
- `fullName`, `email` (unique), `password` (bcrypt-hashed)
- `votedElections` — refs to `Election`, appended as the voter casts votes
- `isAdmin` — auto-set `true` if `email` matches `ADMIN_EMAIL` at registration

**Election**
- `title`, `description`, `thumbnail` (Cloudinary URL)
- `voters` — refs to `Voter`, appended as votes are cast

**Candidate**
- `fullName`, `image` (Cloudinary URL), `motto`, `voteCount`
- `electionId` — ref to `Election`

## API Endpoints

All routes are mounted under `/api`. Protected routes require a valid `token` cookie (set on login/registration); admin-only routes additionally require `isAdmin: true` on the authenticated voter.

**Voters**
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/voters/register` | Public | Register a voter, hash password, auto-grant admin via `ADMIN_EMAIL`, set JWT cookie |
| POST | `/api/voters/login` | Public | Log in, verify password, set JWT cookie |
| POST | `/api/voters/logout` | Public | Clear the JWT cookie |
| GET | `/api/voters/:id` | Protected | Get a voter by ID (password excluded) |

**Elections**
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/elections` | Admin | Create an election with a Cloudinary thumbnail upload |
| GET | `/api/all-elections` | Protected | List all elections |
| GET | `/api/elections/:id` | Protected | Get an election by ID |
| PATCH | `/api/elections/:id` | Admin | Update an election, optionally replacing the thumbnail |
| DELETE | `/api/elections/:id` | Admin | Delete an election, its candidates, and references from voters |
| GET | `/api/elections/:id/candidates` | Protected | List candidates for an election, plus whether the current voter has voted |
| GET | `/api/elections/:id/voters` | Protected | List voters who voted in an election |

**Candidates**
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/candidates` | Admin | Add a candidate with a Cloudinary image upload |
| GET | `/api/candidates` | Admin | List all candidates |
| GET | `/api/candidates/:id` | Admin | Get a candidate by ID |
| PATCH | `/api/candidates/:id` | Admin | Update a candidate |
| DELETE | `/api/candidates/:id` | Admin | Delete a candidate |

**Votes**
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/votes` | Protected | Cast a vote for a candidate in an election (one vote per election per voter, applied atomically via a MongoDB transaction) |

**Health**
| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Liveness/readiness check used by Kubernetes probes |

Errors are returned as `{ message, stack }` via a centralized Express error middleware, using an `HttpError` class to attach HTTP status codes to thrown errors.

## Features

- Voter registration and login with bcrypt-hashed passwords and JWT auth stored in an httpOnly cookie
- Admin auto-detection on registration via `ADMIN_EMAIL`
- Election and candidate management (create/update/delete) with Cloudinary-hosted images, admin-only
- Voting flow with one-vote-per-election enforcement, applied atomically via a MongoDB transaction
- Election results view
- Responsive layout with a fixed navbar, mobile hamburger menu, and light/dark theme toggle
- Client-side routing:
  - `/` — Login
  - `/register` — Register
  - `/elections` — Browse elections (admin add/update/delete modals)
  - `/elections/:id` — Election details
  - `/elections/:id/candidates` — Candidates for an election, with vote confirmation modal
  - `/results` — Voting results
  - `/congrats` — Post-vote confirmation
  - `/logout` — Logout
  - 404 page with auto-redirect
- Dockerized frontend (nginx) and backend, deployed to Kubernetes behind a Traefik ingress with TLS via cert-manager
- CI/CD pipeline: Trivy security scan → Docker build/push → Kubernetes secret sync → rolling deploy → rollout verification

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- A MongoDB connection string
- A Cloudinary account (cloud name, API key, API secret)

### Backend

```bash
cd backend
npm install
npm run dev     # starts the server with nodemon
```

Create a `backend/.env` file with:

```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<random secret used to sign JWTs>
ADMIN_EMAIL=<email to auto-grant admin on registration>
CLOUDINARY_CLOUD_NAME=<your Cloudinary cloud name>
CLOUDINARY_API_KEY=<your Cloudinary API key>
CLOUDINARY_API_SECRET=<your Cloudinary API secret>
```

Other scripts:

```bash
npm run seed      # seed the database with sample data
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create a `frontend/.env` file with:

```
VITE_API_URL=http://localhost:5000/api
```

The app will be available at the local URL Vite prints (typically `http://localhost:5173`).

Other scripts:

```bash
npm run build     # Production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

## Deployment

The app is deployed to a Kubernetes cluster. `.github/workflows/deploy.yml` runs on every push to `main`:

1. **Trivy scan** — scans the repo for vulnerabilities, secrets, and misconfigurations (non-blocking)
2. **Build & push** — builds the backend and frontend Docker images and pushes them to Docker Hub, tagged by commit SHA and `latest`. The frontend image bakes in `VITE_API_URL` as a build argument (Vite env vars are compiled into the JS bundle at build time, not read at runtime)
3. **Deploy** — recreates the `votely-secrets` Kubernetes Secret from GitHub Actions secrets, applies the manifests in `kubernetes/`, updates the deployments to the new image tags, and waits for the rollout to complete

Required GitHub Actions repository secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `KUBE_CONFIG` (base64-encoded kubeconfig), `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `VITE_API_URL`.

Kubernetes manifests (`kubernetes/`):
- `backend-deployment.yml` / `backend-service.yml` — backend Deployment + Service, env vars sourced from the `votely-secrets` Secret
- `frontend-deployment.yml` / `frontend-service.yml` — frontend Deployment + Service
- `ingress.yml` — Traefik ingress routing the app domain to the frontend and the `api.` subdomain to the backend, with TLS
- `cluster-issuer-staging.yml` / `cluster-issuer-prod.yml` — cert-manager ClusterIssuers for Let's Encrypt

## Roadmap

- [x] Scaffold Express server and connect to MongoDB
- [x] Define Mongoose models: Voter, Election, Candidate
- [x] Voter registration with validation and password hashing
- [x] JWT auth (login, logout, protected routes)
- [x] Election + candidate CRUD with Cloudinary image uploads
- [x] Voting flow with duplicate-vote prevention
- [x] Results display
- [x] Dockerize and deploy to Kubernetes with CI/CD
- [ ] Persist theme preference
- [ ] Add automated tests

## License

Not yet specified.
