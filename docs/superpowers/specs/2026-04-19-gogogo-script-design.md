# gogogo.sh Design

## Summary

Add a project-local `gogogo.sh` command suite for the current `new-api` repository. The script set should preserve the old AiLinkDog-style entry flow with a main menu, a shared library, and numbered sub-scripts, but all commands must reflect the actual structure and available tooling in this repository.

The first version is a developer-oriented operations wrapper. It should provide a consistent way to start local development, build, test, lint, run Docker startup, and clean safe generated artifacts without inventing repository behavior that does not already exist.

## Goals

- Provide a single entry point at the repository root.
- Keep the old split-script mental model: `gogogo.sh`, `gogogo.lib.sh`, and numbered command scripts.
- Make `./gogogo.sh` and `./gogogo.sh 1` default to local development.
- Use `tmux` as a hard requirement for the local development command.
- Support both numeric and named command aliases.
- Only wrap commands that are supported or clearly justified by the current repository.

## Non-Goals

- Do not recreate old project-specific automation such as commit generation or deployment-to-server flows.
- Do not introduce destructive cleanup of runtime data, database files, or user configuration.
- Do not add a large shell framework or external script dependency.
- Do not require changes to the Go or frontend application code.

## File Layout

The new script suite will live in the repository root:

- `gogogo.sh`: main entry point, menu, argument parsing, numeric and alias dispatch.
- `gogogo.lib.sh`: shared helpers for output, environment checks, project-root validation, timing, and command discovery.
- `gogogo.1.sh`: local development startup.
- `gogogo.2.sh`: build workflow.
- `gogogo.3.sh`: test workflow.
- `gogogo.4.sh`: lint workflow.
- `gogogo.5.sh`: Docker startup workflow.
- `gogogo.6.sh`: safe cleanup workflow.

## Command Design

### `1` / `dev`

Purpose: start backend and frontend development environments together.

Behavior:

- Require `tmux`.
- Require `go` and `bun`.
- Validate that `main.go` and `web/` exist from the repository root.
- Use a fixed session name such as `new-api-dev`.
- If the session already exists, attach to it instead of creating a duplicate.
- If the session does not exist, create it and split panes into backend and frontend commands.

Commands:

- Backend pane: `go run main.go`
- Frontend pane: `cd web && bun install && bun run dev`

Rationale:

- This matches the user's preferred workflow: one command, terminal split, both services visible.
- `tmux` is a hard dependency by explicit user preference, so there is no fallback path.

### `2` / `build`

Purpose: verify the project can build using the current repo toolchain.

Behavior:

- Require `go` and `bun`.
- Run frontend dependency install and production build.
- Run backend compile validation.

Commands:

- `cd web && bun install && bun run build`
- `go build ./...`

Rationale:

- The repository already uses Bun for the frontend.
- `go build ./...` is safer than inventing a release packaging step.

### `3` / `test`

Purpose: run test commands that are actually present.

Behavior:

- Require `go`.
- Run backend tests.
- Detect that the frontend currently has no `test` script and report that it is skipped.

Commands:

- `go test ./...`

Rationale:

- The current `web/package.json` has no test script, so the script should be honest and explicit instead of guessing.

### `4` / `lint`

Purpose: run existing code-quality checks.

Behavior:

- Require `bun`.
- Run frontend formatting check and ESLint.
- Print a clear message that backend lint is not wired into the repository-level script yet.

Commands:

- `cd web && bun install && bun run lint`
- `cd web && bun run eslint`

Rationale:

- These commands exist today and are low risk to wrap.
- The repository does not expose a standard Go lint command in current root tooling.

### `5` / `docker`

Purpose: start the local Docker stack from the root directory.

Behavior:

- Require Docker.
- Prefer `docker compose` if available.
- Fall back to `docker-compose` if that is the installed CLI.
- Run the compose stack in detached mode.

Commands:

- `docker compose up -d` or `docker-compose up -d`

Rationale:

- This keeps compatibility with both common Docker CLI variants.

### `6` / `clean`

Purpose: remove safe generated artifacts only.

Behavior:

- Remove frontend build output such as `web/dist` if present.
- Optionally remove common transient files created by the script suite itself in the future.
- Do not remove databases, uploaded files, runtime data folders, `.env`, or other user-owned state.

Rationale:

- Cleanup should be conservative by default.

## Main Entry Flow

`gogogo.sh` will:

- Resolve its own directory and load `gogogo.lib.sh`.
- Validate it is being run from the expected repository root.
- Print a compact title and menu.
- Accept either a numeric option or a named alias.
- Default to `1` after a timeout when run interactively with no argument.
- Dispatch by sourcing the selected numbered sub-script.
- Show elapsed time after successful completion unless explicitly suppressed by a sub-script.

Supported aliases:

- `dev` => `1`
- `build` => `2`
- `test` => `3`
- `lint` => `4`
- `docker` => `5`
- `clean` => `6`
- `exit` => `0`

## Shared Library Responsibilities

`gogogo.lib.sh` will contain small, focused helpers:

- Color and status output helpers.
- `check_project_root` to confirm the expected root markers exist.
- `require_command` to fail fast when dependencies are missing.
- `detect_compose_command` to select `docker compose` or `docker-compose`.
- `show_elapsed_time`.
- Optional alias-normalization helper to keep `gogogo.sh` small.

The library should stay lightweight and avoid hiding the command logic behind too many abstractions.

## Error Handling

- Missing dependency errors must say exactly which command is required.
- Wrong-directory errors must explain that `main.go` and `web/` are expected at the repository root.
- Invalid option errors must list available script choices.
- Development startup must refuse to continue without `tmux`.
- Cleanup must no-op safely when the target path does not exist.

## Testing And Verification

Implementation verification should include:

- `bash -n` over all new shell files.
- Manual checks for argument parsing and menu dispatch.
- Manual checks for `build`, `test`, and `lint` commands.
- A limited check for `dev` that verifies tmux session creation logic without requiring a long interactive run in the implementation summary.

## Scope Boundary

This design is intentionally limited to root-level developer workflow scripts. It does not change application behavior, deployment architecture, or repository branding. It adds a practical command surface that matches the user's preferred local workflow while staying aligned with the current `new-api` repository structure.
