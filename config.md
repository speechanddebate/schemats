# Config Migration (Simple)

## Old `config.ts` -> New `.env`

We now use environment variables from `.env` files instead of reading app config from `config.ts`.

- Before: config values were managed in code (`config.ts`).
- Now: config values are provided through environment variables (`.env`, deployment env vars, or container env vars).

## Validation + Defaults (Svelte explicit env vars)

We now validate env vars in one place using SvelteKit explicit env var definitions (`defineEnvVars`) in `src/env.ts`.

- Production-required values are explicitly declared.
- Values are validated 
- some vars have default values. These are mostly vars that aren't secret and don't change much but we still may want to change
  at runtime vs at buildtime (eg. cookie names)

Examples of defaults currently provided:

- `CLASSIC_URL` defaults to `https://tabroom.com`
- `INDEXCARDS_BASE_PATH` defaults to `/v1`
- `AUTH_COOKIE` defaults to `TabroomToken`
- `CSRF_COOKIE_NAME` defaults to `CSRF_Token`
- `CSRF_HEADER_NAME` defaults to `x-csrf-token`
- `LOG_LEVEL` defaults to `info`
- `LOGGING_FILE_MAXSIZE` defaults to `2097152`
- `LOGGING_FILE_MAXFILES` defaults to `5`

## Important: VITE vars are separate

`VITE_*` variables are frontend build/runtime variables.

They are managed outside of sveltekit as vite is not a runtime dependancy. these are only used in vite.config.ts and all have defaults
that are used for CI so that you don't need to specify a million vars. Take a look at what differs and add to your .env file.
I only have VITE_HOST and VITE_CLIENT_PORT declared for example.

## Dockerfile Changes

Docker setup has been simplified.

- Removed separate `Dockerfile.production` and `Dockerfile.staging` flows.
- Moved to a single multi-stage `Dockerfile` with stages for dev, build, and prod.

The idea is this docker build is the flow for everything. the dev target is what I was for local dev via a devcontainer and it is also what gets used to run tests during CI so you dont get works locally but not on CI errors. The prod stage builds the app and copies over ONLY the build files. This massively reduces the size of the final image (87% decrease).

If you used to only Dockerfiles just change whatever used them to build the specified target. II didn't add a 'staging' stage as
with runtime .env passing I don't see why staging couldn't/shouldn't use the prod build just with a different .env file. If
I am wrong, we can add one.

