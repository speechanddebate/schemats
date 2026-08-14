## Debate Tournaments API

## Feature list

1. 🌐 **Tournament Discovery** - Browse tournaments from the homepage and open public tournament pages quickly.
2. 🧾 **Invite Pages** - View tournament invite information, public details, and navigation into each tournament section.
3. 🗂️ **Events & Registration** - Browse events/divisions and related registration-oriented pages for competitors and coaches.
4. 🏁 **Rounds & Pairings** - Check round postings, room assignments, judges, and matchup information.
5. 🏆 **Results & Records** - Browse tournament results, standings, and entry performance records.
6. 🧑‍⚖️ **Judge Paradigms** - View and manage judge paradigm pages and judging preference information.
7. 👤 **User Area** - Access user-specific pages such as account-related views and inbox-style sections.
8. 📬 **Inbox Integration** - Supports frontend surfaces for user inbox/unread messaging tied to the backend API.

## What it does 🔔

- Manages tournament data like rounds, pairings, results, judges, entries, and accounts.
- Exposes a REST API for public access, tournament admin, user profile tools, and external integrations.
- Sends automated notifications through email, web push, and inbox-style messaging.
- Supports background jobs for pairing blasts, result publishing, and cleanup tasks.

## Main infra 🧩

🔌 **Typed API Client** - Uses an OpenAPI-based generated client to keep frontend requests and types aligned with the backend schema.\
⚡ **Fast Data Fetching** - Uses TanStack Query for caching, persistence, and smoother server-state handling.\
🧩 **Reusable UI System** - Built from shared components, including the SVGrid data table for listings and result-heavy screens.\
🧪 **Testing Stack** - Includes Vitest for unit tests, Storybook for component isolation, and MSW and Faker for local API mocking.\
🎨 **Modern Frontend Stack** - Built with Svelte 5, SvelteKit, TypeScript, Tailwind CSS v4, and Flowbite Svelte.

- 🏆 **Tournament management:** Create, retrieve, update, and manage tournament data, categories, schools, events, sites, rooms, sections, timeslots, circuits, and related administrative resources.
- 📊 **Results APIs:** Power tournament-result workflows through results sets, entry wins, published rounds, ballots, categories, and frontend-oriented results routes.
- 👩‍⚖️ **Judge workflows:** Search judges, find unlinked judges, claim judge and student records, expose judge history, publish judges, and return richer judge-record data.
- 🎓 **Student search:** Search students, identify unlinked students, and support corrected student mapping and user-name defaults.
- 🧠 **Paradigm services:** Search, retrieve, paginate, sanitize, and enrich judge paradigms with related records and certification information.
- ✅ **Certification quizzes:** Provide REST APIs, schemas, documentation, and tests for certification quiz functionality.
- 📬 **Inbox messaging:** Expose inbox and unread-count endpoints backed by dedicated message repository operations and schemas.
- 🔐 **Authentication:** Support registration, login, logout, bearer tokens, header authentication, session handling, and external authentication flows.
- 🛡️ **Authorization:** Enforce role-based access control, hierarchical permissions, parent-child actions, site-admin checks, and protected tab routes.
- 🧱 **Request validation:** Validate API inputs through middleware and schema-backed endpoint validation to produce predictable client errors.
- 🧯 **API security:** Apply CSRF protections, origin validation, configurable CORS, OpenAPI security definitions, paradigm HTML sanitization, and dependency-audit fixes.
- 🚦 **Rate limiting:** Use configurable and proxy-aware rate limiting to protect API routes and deployment environments.
- 📚 **OpenAPI documentation:** Generate, type-check, maintain, and bundle OpenAPI documentation for API consumers and developer tooling.
- 🧪 **Automated testing:** Expand repository, controller, authentication, session, model, validation, and endpoint coverage with test fixtures and isolated test database support.
- 🟦 **TypeScript migration:** Introduce TypeScript support, typed configuration, typed API models, dedicated build settings, and type-checking in CI.
- 🗃️ **Data-layer modernization:** Use generated database models, shared repository abstractions, updated relationships, and improved mappings for a more maintainable persistence layer.
- 🐳 **Container deployment:** Build smaller and more explicit Docker images with production-ready runtime configuration and documentation.
- ⚙️ **Runtime configuration:** Load hierarchical JSON configuration for local, CI, and production environments while keeping configuration consumers consistent across the app.
- 🚀 **CI/CD publishing:** Run linting, tests, type checks, documentation generation, Docker image publishing, and standardized image tagging through GitHub Actions.
- 📈 **Observability:** Improve structured production logging, request-path logging, error reporting, status handling, and earlier Loki-compatible logging support.
- 🖥️ **Autoscaling operations:** Manage server polling, status, health checks, monitoring settings, and configurable autoscaling behavior for deployed infrastructure.
- 🔎 **Pagination support:** Add limit-and-offset pagination for search, certificates, active circuits, and other high-volume API workflows.
- 📢 **Public tournament data:** Expose public APIs for tournament schematics, published rounds, field reports, invites, ads, and circuit-facing data.
- 🧩 **Route standardization:** Consolidate legacy endpoints into clearer REST, admin, external, tab, and pages route namespaces.


## Setup 🚀

- Install dependencies with `npm install`.
- Copy `config/config.sample.js` to `config/config.js`.
- Load the test MariaDB schema from `tests/test.sql`.
- Run the dev server with `npm run dev`.

## Scripts ▶️

- `npm run dev` — start local development.
- `npm run test` — run tests.
- `npm run lint` — check code quality.
- `npm run build-openapi` — regenerate API docs.- Load the test MariaDB schema from `tests/test.sql`.
- Run the dev server with `npm run dev`.

## Scripts ▶️

- `npm run dev` — start local development.
- `npm run test` — run tests.
- `npm run lint` — check code quality.
- `npm run build-openapi` — regenerate API docs.