# TODO-231: Light/dark theme toggle in the header

**Type:** Feature
**Area:** Frontend
**Priority:** Medium

## Story

As a member of the Marlowe & Finch team who keeps the task tracker open all day,
I want to switch the app between a light and a dark theme, so that it is
comfortable to read in the workshop in the morning and in the office at night.

Today the app is light only, with colours hardcoded in `style.css`.

## Acceptance criteria

- **AC-1** There is a toggle button in the header with the id `theme-toggle`.
  Clicking it switches between the light and the dark theme. The button label
  (or icon) makes it clear which theme you will get when you click.
- **AC-2** The theme is applied through a `data-theme` attribute on the `<html>`
  element (`data-theme="light"` or `data-theme="dark"`) and CSS variables. No
  colour is duplicated in JavaScript.
- **AC-3** The choice is persisted in `localStorage` and restored on load, so a
  refresh keeps the theme the user picked.

Fences:

- Both test suites stay green (`./mvnw test` and `npm test`).
- Frontend only: no Java changes.
- No new dependencies (no npm packages, no Maven dependencies).

## Open questions

- Default theme when nothing is stored: light, dark, or follow the OS setting?

## Definition of done

- Run `./mvnw test` and `npm test` and report both counts.
- New element ids are registered in `src/test/javascript/setup/loadApp.js`.
- Restart the app so the reviewer can click it.
