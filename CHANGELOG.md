<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## August 2026

- **Production configuration:** Finalized the full JSON configuration file needed for deployment.
- **Cleanup:** Applied small follow-up cleanup and configuration corrections after the July runtime-configuration rollout.


## July 2026

- **Build pipeline:** Introduced a dedicated application build process and build-specific TypeScript configuration.
- **Runtime configuration:** Added hierarchical JSON runtime configuration and expanded production configuration values.
- **Docker deployment:** Updated Dockerfile behavior, documented runtime config usage, refined image bases, and improved container startup assumptions.
- **CI/CD:** Added CI-specific configuration, fixed CI for the new configuration system, updated Docker image tag formatting, and added a `latest` image tag.
- **OpenAPI distribution:** Built OpenAPI output during pre-commit and bundled `openapi.json` with the application.
- **CORS defaults:** Enabled default CORS behavior while preserving configuration support.
- **CSRF hardening:** Switched CSRF checks toward origin validation.
- **Production operations:** Added database connectivity checks, structured JSON production logging, result-set typing, user/chapter typing, and login fixes.


## June 2026

- **Paradigm security:** Added paradigm HTML sanitization and fixed associated security and audit concerns.
- **OpenAPI security:** Corrected OpenAPI security documentation and improved related API definitions.
- **Error handling:** Added forbidden-response handling and corrected circuit-ID behavior.
- **Paradigm endpoints:** Updated and expanded paradigm retrieval behavior.
- **Judge publication:** Added support for publishing judges and improved result-facing judge data.
- **Sorting:** Improved ordering behavior, including prioritizing national tournament results.


## May 2026

- **Student search:** Added student search, unlinked-student search, improved mapping, tests, REST routes, and OpenAPI schemas.
- **Judge workflows:** Added unlinked-judge search, judge search and claim endpoints, student/judge claims, judge history, review cutoffs, and richer judge-record responses.
- **Results support:** Added result endpoint validation, results frontend routes, judge publication, and publication filtering for rounds with schematics.
- **OpenAPI hardening:** Typed the OpenAPI specification, fixed category mapping, added schemas, and improved generated docs and tests.
- **Certification APIs:** Added certification quiz endpoints, controllers, repositories, routes, schemas, tests, and generated OpenAPI output.
- **Pagination:** Added limit-and-offset support for search and certification workflows.
- **Data consistency:** Updated person-name defaults, student mapping, category mappings, circuit responses, and tournament output behavior.


## April 2026

- **TypeScript support:** Added TypeScript support, converted high-traffic middleware, introduced model updates, and added CI lint/type-check jobs.
- **Inbox APIs:** Added inbox endpoints, unread-count endpoints, dedicated inbox-message schemas, and test coverage.
- **Model modernization:** Updated models for new primary keys, foreign keys, messages interfaces, tiebreak types, and result-set support.
- **CORS configuration:** Added a `CORS_ORIGINS` configuration option.
- **Coverage improvements:** Expanded tests for users, sessions, ads, circuits, paradigms, and model generation.
- **Active content filtering:** Added filtering to hide in-progress endpoints.
- **Database operations:** Added database-update documentation and additional generated-model support.


## March 2026

- **Request validation:** Added reusable request-validation middleware, Zod-backed login validation, validation tests, and more schema-compliant API responses.
- **Security and proxy support:** Made rate-limit proxy settings environment-aware, updated authentication validation, and strengthened bearer/session actor handling.
- **Circuit and results APIs:** Added active-circuit, circuit-detail, circuit-page, ads, entry, tournament, and results-related endpoints.
- **Inbox foundation:** Added message repository operations, inbox tests, unread-count support, and user-message handling.
- **Results features:** Added entry-win and results-set functionality to support tournament-result displays.
- **Documentation:** Added project, testing, authentication, Zod, dependency, and configuration documentation.
- **Test infrastructure:** Improved test database generation, SQL fixtures, authentication tests, validation tests, and controller/repository coverage.
- **CI cleanup:** Removed Slack notifications and unnecessary publish-workflow pull-request triggers.
- **Logging:** Added logging improvements and Loki-related support.


## February 2026

- **User registration:** Added user registration, email/password validation, improved login validation, and better authentication error handling.
- **Bearer authentication:** Added bearer-token authentication and support for header-based authentication.
- **RBAC:** Refactored authorization middleware, implemented role-based access control, added hierarchical and parent-action permissions, and removed blanket circuit-admin access.
- **Tournament APIs:** Added tournament CRUD endpoints plus endpoints for categories, timeslots, sections, sites, rooms, circuits, and public tournament data.
- **Paradigm APIs:** Added and expanded paradigm endpoints, including pagination, record/certification data, login requirements, and timestamp fixes.
- **Database schema:** Updated model relations, foreign keys, event/category mappings, session identifiers, and generated model behavior.
- **OpenAPI generation:** Moved OpenAPI definitions into routers and generated documentation at build time.
- **Platform hardening:** Fixed CSP, CSRF middleware paths, Express 5 compatibility, dependency issues, and Vitest configuration.
- **Scaling:** Refined autoscaling behavior and related deployment configuration.


## January 2026

- **Route migration:** Migrated legacy routes into standardized REST, admin, external, tab, and pages route structures.
- **API documentation:** Switched API documentation organization to Scalar, improved OpenAPI generation, and added support for multiple controller documentation paths.
- **Sessions and CSRF:** Added login/logout endpoints, CSRF protection, and improved session and authentication handling.
- **Tournament resources:** Added APIs for schools, sites, rooms, categories, and related backup utilities.
- **Testing expansion:** Added extensive tests for files, scores, ballots, rate limiting, repositories, routes, and backup-related functions.
- **Schema consistency:** Standardized timestamp handling and introduced shared query-builder patterns.


## December 2025

- **Generated data models:** Generated database models from the production schema, introduced automated model wiring, and moved database logic into a dedicated data layer.
- **Repository layer:** Consolidated common database code into base repository patterns and improved test setup.
- **Authentication refactor:** Split authentication from authorization, standardized person context, added middleware mocks, and improved authorization error responses.
- **Access control:** Added site-admin authorization checks and moved chapter-specific keys behind authenticated paths.
- **Error responses:** Introduced centralized problem helpers, including consistent not-found and unexpected-error responses with request URLs.
- **OpenAPI:** Added default OpenAPI documentation and expanded schemas for ads and problem responses.
- **Quality gates:** Added linting, starter CI workflows, cached Node setup, automated test execution, and broader authentication tests.
- **Deployment:** Reduced the production container image size and prevented action logs from being written to protected locations.
- **Schema integration:** Merged the schematics backend into the main backend and added Sequelize auto-generation support.


## November 2025

- **Docker readiness:** Updated Docker configuration and package compatibility for deployment.
- **Field reports:** Added field-report work and a schedule-related stub.
- **Documentation:** Expanded the README and development documentation.
- **Schema/backend merging:** Continued merging and stabilizing the schematics backend and related database work.
- **Timeslot recovery:** Reverted and corrected problematic timeslot changes.


## October 2025

- **Paradigm analysis:** Began work on a paradigm-analysis feature, including statistics, error handling, concurrency improvements, and rate-limit adjustments.
- **Tournament invitations:** Refined the tournament invitation API.
- **Operational tuning:** Continued limiter and package upgrades.


## September 2025

- **Invitations and access:** Expanded invite, chapter-access, dashboard, and public API capabilities.
- **Public tournament data:** Added public tournament schematics APIs and began results-set functionality.
- **Autoscaling:** Refined autoscaler behavior with narrower time windows.
- **Tab administration:** Added work to parse tab-admin data and support visible published rounds.
- **User presence:** Added user-presence functionality.
- **Messaging:** Improved blast-message behavior and append workflows.


## August 2025

- **Server configuration:** Moved machine-monitoring definitions into configuration, removed hard-coded database server references, renamed server-count settings to server-target settings, and updated server behavior.
- **Rate limiting:** Fixed and tuned the application limiter.
- **Online students:** Added handling for an online-student bonus.

