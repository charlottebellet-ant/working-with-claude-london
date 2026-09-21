# todo-app

The internal task tracker at Marlowe & Finch, a coffee-equipment company. A small
Spring Boot REST API with an in-memory store, plus a plain-JavaScript single-page
frontend served from the same process.

Two sentences to explain it: the Java side exposes `/api/todos` (list, get, create,
update, delete, toggle) backed by a `ConcurrentHashMap`; the frontend in
`src/main/resources/static/` calls that API with `fetch` and re-renders the list.

## Run it

```bash
./mvnw spring-boot:run      # then open http://localhost:8080
```

The store is in memory, so restarting the app resets it to the seed data.

## Test it

```bash
./mvnw test                 # Java: 25 tests (JUnit 5, MockMvc)
npm install                 # once
npm test                    # Frontend: 45 tests (Jest + jsdom)
```

## Stack

- Java 17, Spring Boot 3.2, Maven (wrapper included, no local Maven needed)
- Vanilla JavaScript, HTML and CSS; no build step, no framework
- Jest with jsdom for the frontend tests; the harness lives in `src/test/javascript/setup/loadApp.js`

## Tree

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

## API

| Method | Path                     | Notes                              |
|--------|--------------------------|------------------------------------|
| GET    | /api/health              | `{"status":"UP"}`                  |
| GET    | /api/todos               | optional `?done=true` or `false`   |
| GET    | /api/todos/{id}          | 404 if missing                     |
| POST   | /api/todos               | `{"title":"...","priority":"HIGH"}`|
| PUT    | /api/todos/{id}          | any subset of title, done, priority|
| POST   | /api/todos/{id}/toggle   | flips `done`                       |
| DELETE | /api/todos/{id}          | 204                                |

Workshop material is in docs/.
