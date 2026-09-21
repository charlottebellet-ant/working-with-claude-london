# Set-up: get green before Part 3, including on a laptop where you cannot install anything

Working with Claude, London. Afternoon session: Claude Code, zero to expert.

Read this before Part 3. Every hands-on lab this afternoon runs in the same small codebase, `todo-app` (a Spring Boot REST API with a vanilla JavaScript frontend, 25 Java tests and 45 Jest tests). You need it open in a Claude Code session before Part 3 starts.

## Which path are you on?

| You have | Use | Labs work? |
|---|---|---|
| A laptop where you can install software and run a terminal | **Path A, local** | All three, fully |
| Only a browser, and a GitHub account (or you can create one) | **Path B, GitHub Codespaces** | All three, fully. The terminal is in the browser |
| Only a browser, and Claude Code on the web is enabled for your organisation | **Path C, Claude Code on the web** | Labs 3 and 4 fully; Lab 5 step 3 is already true (you are remote) |
| None of the above today | **Path D, pair up** | You drive, your neighbour types. Same badges |

## Path A: local install

1. Prerequisites: git, Node 18 or later, Java 17 or later. Check with `git --version`, `node --version`, `java -version`.
2. Install Claude Code: `npm install -g @anthropic-ai/claude-code`, then run `claude` once and sign in with your work account.
3. Get the code:
   ```
   git clone https://github.com/charlottebellet-ant/working-with-claude-london.git todo-app
   ```
   No git on the laptop? Download the zip from the green **Code** button on GitHub, unzip it, and run `git init && git add -A && git commit -m "Initial import"` inside the folder so you have a repository to work in.
4. Inside the folder: `npm install`, then `npm test` (expect 45 passed) and `./mvnw test` (expect 25 tests, 0 failures; the first run downloads Maven).
5. Optional but used in Lab 4: start `claude`, type `/mcp`, and connect Google Workspace when it asks. If that is not available for you, Lab 4 has a no-MCP fallback.

## Path B: GitHub Codespaces (browser only, closest to the local experience)

The repository contains a dev container with Java, Node and Claude Code pre-installed. Codespaces gives you VS Code and a terminal in a browser tab.

1. Open the workshop repository on GitHub: https://github.com/charlottebellet-ant/working-with-claude-london.
2. Press **Use this template → Create a new repository** into your own GitHub account (or **Fork**). Name it `todo-app`.
3. On your copy, press **Code → Codespaces → Create codespace on main**. Wait two or three minutes for the container to build.
4. In the terminal at the bottom of the window: `npm test` (45 passed) and `./mvnw test` (25 tests).
5. Type `claude`. It prints a sign-in URL: open it in a new tab, sign in with your work Claude account, paste the code back. You are in.
6. The app runs on port 8080. When Claude Code restarts it, Codespaces shows a **Open in browser** toast for the forwarded port.

Everything in the labs is identical from here. `/mcp` works the same way.

## Path C: Claude Code on the web

Claude Code on the web runs sessions in a cloud sandbox against a GitHub repository, and you type in a browser tab at claude.ai. Your organisation needs it enabled and the GitHub app connected.

1. As in Path B, create your own copy of the workshop repository on GitHub.
2. Open claude.ai, then **Code**, and start a session on your `todo-app` repository.
3. Lab 3 and Lab 4 prompts work unchanged; tests run inside the session and Claude reports the counts. You cannot click the running app, so skip "restart the app so I can click it" in the definition of done and ask for a screenshot description instead.
4. Lab 5 step 3 (a remote session) is what you are already doing. Show the mentor your session on the phone app instead.
5. Connectors (Lab 4, `/mcp`) come from your claude.ai connectors rather than a local config.

## Path D: pair up

Sit with someone on Path A or B. You read the ticket, write the brief, decide what to push back on, and review the diff. They type. Tell the mentor you are a pair; both of you can earn the badges.

## Are you green? (three checks, everyone)

1. `claude --version` prints a version.
2. `claude`, then `/mcp` shows Google Workspace connected (optional; Lab 4 has a fallback).
3. `git pull` (or nothing, if you unzipped) and `npm test` prints `45 passed, 45 total`.

Not green? Hand up. Mentors are walking the room. All three green: leave the session open.

## The badge game

| Lab | Badge | What to show a mentor |
|---|---|---|
| 3 | Shipper | A PR for TODO-231: the plan you pushed back on once, and both suites green |
| 4 | Toolmaker | Your `/release-check` skill running by name and holding the baseline |
| 5 | Orchestrator | Three subagents on TODO-232, and only their summaries coming back |

## Before the day (mentors)

- The repository participants copy from: done, https://github.com/charlottebellet-ant/working-with-claude-london is public and marked as a template.
- Copy `docs/data/todo-access-log.csv` into a Google Drive folder the participants' Google Workspace connector can see, or tell them to copy it into their own Drive (the lab says how).
- Enable Codespaces for the organisation if participants will use Path B, and check the Claude Code on the web toggle for Path C.
- Do Lab 3 once yourself in a fresh Codespace, so you know how long the container build takes on the venue Wi-Fi.
