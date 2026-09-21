# TODO-233: Add `GET /api/todos/stats`

**Type:** Feature
**Area:** Backend
**Priority:** Low

Small and self-contained, a good candidate for a remote or cloud session that runs
on its own and comes back with a pull request.

## Story

The ops lead wants a single number for the morning stand-up. Add an endpoint that
returns how many todos are open, done and in total.

## Acceptance criteria

- **AC-1** `GET /api/todos/stats` returns `200` with a JSON body
  `{ "open": 3, "done": 1, "total": 4 }`.
- **AC-2** The counts are computed from the repository at request time, not cached.
- **AC-3** The route must not clash with `GET /api/todos/{id}`: `stats` is not an id.
- **AC-4** Tests: a service test for the counting and a controller test for the
  route and body shape. `./mvnw test` count goes up accordingly and `npm test` stays
  at its baseline.

Fences:

- No frontend changes.
- No new dependencies.

## Definition of done

- Run `./mvnw test` and `npm test` and report both counts.
- Open a pull request titled `TODO-233: add /api/todos/stats` with the counts in
  the description.
