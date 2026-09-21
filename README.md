# Working with Claude, London: Claude Code hands-on

The afternoon session, "Claude Code, zero to expert", is three hours in six parts. Parts 3, 4 and 5 are hands on keyboard, and all three run in this repository. Everything you need is here: the set-up, the three exercises, the sample app, the tickets and the reference files.

## Start here

1. **Set-up** (before Part 3, five minutes): [`workshop/SETUP.md`](workshop/SETUP.md). Four paths: local install, GitHub Codespaces (nothing to install), Claude Code on the web, or pair up. Ends with the three "are you green" checks.
2. **Pre-work** (the night before, 15 minutes): [`docs/PRE-WORK.md`](docs/PRE-WORK.md). Install, clone, run the tests, and keep the brief and the definition of done handy.

## The exercises

| Part | Lab | Minutes | Badge | Ticket |
|---|---|---|---|---|
| 3 | [Ship TODO-231](workshop/lab-3-ship-todo-231/README.md): /init, plan and push back, build to green, /code-review, open the PR | 30 | Shipper | [`docs/tickets/TODO-231.md`](docs/tickets/TODO-231.md) |
| 4 | [Fit it to you](workshop/lab-4-fit-it-to-you/README.md): /usage, /security-review, a hook, /mcp on the access log, the release-check skill | 25 | Toolmaker | |
| 5 | [Put more agents on it](workshop/lab-5-put-more-agents-on-it/README.md): three subagents, a nightly routine, a remote session, a swap | 20 | Orchestrator | [`docs/tickets/TODO-232.md`](docs/tickets/TODO-232.md), [`TODO-233.md`](docs/tickets/TODO-233.md) |

Each lab README has the copy-ready prompts, a done-when list, what to show a mentor for the badge, and what to do if you are stuck. Stuck five minutes: hand up.

## Reference files

| Path | Used in |
|---|---|
| `docs/tickets/` | The three tickets |
| `docs/data/todo-access-log.csv` | Lab 4, the /mcp question (copy it to your Google Drive, or use it from here) |
| `docs/examples/release-check.SKILL.md` | Lab 4, the skill template |
| `docs/examples/settings.hooks.json`, `docs/examples/hooks/pom-guard.sh` | Lab 4, the pom.xml hook |
| `docs/examples/agents/` | Lab 5, the auditor, fixer and verifier subagents |
| `docs/examples/routine.md` | Lab 5, the nightly release check |
| `.devcontainer/` | Codespaces: Java 17, Node 20 and Claude Code pre-installed |
| `.github/workflows/ci.yml` | Runs both test suites on every pull request |

There is deliberately no `CLAUDE.md` and no `.claude/` folder. You create them in Lab 3.

## The badge game

One badge per lab. A badge is one thing you show a mentor on your screen; they stamp your card. Three stamps put your card in the draw at show-and-tell, and a full card across the morning and afternoon sessions gets you named at the close.

## Mentors

Participants press **Use this template** on this repository to get their own copy (needed for Codespaces and Claude Code on the web). Do Lab 3 once yourself in a fresh Codespace before the day. The answer key for the access log is in `docs/data/ANSWER-KEY.md`.

---

## The app: todo-app

The internal task tracker at Marlowe & Finch, a coffee-equipment company. A small
Spring Boot REST API with an in-memory store, plus a plain-JavaScript single-page
frontend served from the same process.

Two sentences to explain it: the Java side exposes `/api/todos` (list, get, create,
update, delete, toggle) backed by a `ConcurrentHashMap`; the frontend in
`src/main/resources/static/` calls that API with `fetch` and re-renders the list.

### Run it

```bash
./mvnw spring-boot:run      # then open http://localhost:8080
```

The store is in memory, so restarting the app resets it to the seed data.

### Test it

```bash
./mvnw test                 # Java: 25 tests (JUnit 5, MockMvc)
npm install                 # once
npm test                    # Frontend: 45 tests (Jest + jsdom)
```

### Stack

- Java 17, Spring Boot 3.2, Maven (wrapper included, no local Maven needed)
- Vanilla JavaScript, HTML and CSS; no build step, no framework
- Jest with jsdom for the frontend tests; the harness lives in `src/test/javascript/setup/loadApp.js`

### Tree

```
todo-app/
├── pom.xml                      Java build (dependencies are frozen, see comment at the top)
├── package.json                 Jest config and scripts
├── mvnw, mvnw.cmd, .mvn/        Maven wrapper
├── src/main/java/com/marlowefinch/todo/
│   ├── TodoApplication.java     Spring Boot entry point
│   ├── Todo.java, Priority.java Model
│   ├── TodoRepository.java      In-memory store
│   ├── TodoService.java         Business rules (no validation yet, see TODO-232)
│   ├── TodoController.java      /api/todos
│   ├── HealthController.java    /api/health
│   └── SeedData.java            A few todos at startup
├── src/main/resources/static/
│   ├── index.html, app.js, style.css
├── src/test/java/...            JUnit tests
├── src/test/javascript/         Jest tests and the harness
├── docs/                        Workshop material
├── .devcontainer/               GitHub Codespaces setup (no local install needed)
└── .github/workflows/ci.yml     Runs both suites on pull requests
```

### API

| Method | Path                     | Notes                              |
|--------|--------------------------|------------------------------------|
| GET    | /api/health              | `{"status":"UP"}`                  |
| GET    | /api/todos               | optional `?done=true` or `false`   |
| GET    | /api/todos/{id}          | 404 if missing                     |
| POST   | /api/todos               | `{"title":"...","priority":"HIGH"}`|
| PUT    | /api/todos/{id}          | any subset of title, done, priority|
| POST   | /api/todos/{id}/toggle   | flips `done`                       |
| DELETE | /api/todos/{id}          | 204                                |

Workshop material is in `workshop/` and `docs/`.
