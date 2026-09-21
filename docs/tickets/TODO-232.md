# TODO-232: Server-side validation for todos

**Type:** Hardening
**Area:** Backend
**Priority:** High

## Story

The API currently stores whatever it is given. A blank title, a title of ten
thousand characters, or a request without a title all come back as `201 Created`.
The frontend already prevents empty titles, so this is defence in depth: anything
that talks to `/api/todos` directly (scripts, the mobile prototype, curl) should get
a clear error rather than corrupt data.

There is a test in `TodoControllerTest` (`createWithBlankTitleIsCurrentlyAccepted`)
and one in `TodoServiceTest` (`createAcceptsBlankTitle`) that document the current
behaviour. They will need to change.

## Acceptance criteria

- **AC-1** `title` is required on create. It is trimmed, and after trimming it must
  be between 1 and 200 characters.
- **AC-2** On update, if `title` is present it is subject to the same rule. A
  missing `title` on update keeps the existing one.
- **AC-3** `priority`, when present, must be one of `LOW`, `MEDIUM`, `HIGH`. An
  unknown value is rejected (today it fails with a generic 400 from the JSON parser;
  the response must follow AC-4).
- **AC-4** Invalid input returns `400 Bad Request` with a JSON body of the form
  `{ "errors": ["title must be between 1 and 200 characters"] }`. Several problems
  in one request produce several entries.
- **AC-5** Existing tests are updated, new tests are added, both suites are green.

Fences:

- `pom.xml` is frozen (see the comment at the top). Do not add
  `spring-boot-starter-validation` or any other dependency; write the checks by hand.
- No frontend changes are needed.

## Suggested split for three subagents

- **auditor** (read-only): find every entry point that writes a todo (controller
  methods, service methods, seed data) and list, per entry point, which fields are
  unchecked and what happens today with bad input. Output: a short table.
- **fixer**: implement the validation in the service layer and the 400 response
  shape in a controller advice, following the auditor's table. No test changes.
- **verifier**: update the two "currently accepted" tests, add tests for each AC
  (blank, too long, exactly 200, unknown priority, several errors at once), and run
  `./mvnw test` and `npm test`. Report both counts.

## Definition of done

- Run `./mvnw test` and `npm test` and report both counts.
- The two tests that documented the old behaviour have been rewritten, not deleted.
- Restart the app and show one `curl` with a blank title returning 400.
