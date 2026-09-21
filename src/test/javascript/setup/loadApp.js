/*
 * Test harness for the frontend.
 *
 * loadApp() puts index.html into the jsdom document, replaces fetch with a small
 * in-memory fake of the /api/todos endpoints, requires app.js and starts it.
 *
 * REGISTERED_IDS lists every element id the harness knows about. harness.test.js
 * checks that index.html contains no id outside this list, so that anyone adding a
 * new interactive element also updates the harness (and, ideally, the tests).
 */
const fs = require('fs');
const path = require('path');

const STATIC_DIR = path.resolve(__dirname, '../../../main/resources/static');
const APP_PATH = path.join(STATIC_DIR, 'app.js');
const HTML_PATH = path.join(STATIC_DIR, 'index.html');

const REGISTERED_IDS = [
  'app-header',
  'app-title',
  'app-subtitle',
  'todo-form',
  'todo-input',
  'todo-priority',
  'add-button',
  'filters',
  'filter-all',
  'filter-open',
  'filter-done',
  'todo-list',
  'list-footer',
  'remaining-count',
  'clear-done'
];

function readIndexHtml() {
  return fs.readFileSync(HTML_PATH, 'utf8');
}

function extractIds(html) {
  const ids = [];
  const re = /\sid="([^"]+)"/g;
  let match;
  while ((match = re.exec(html)) !== null) {
    ids.push(match[1]);
  }
  return ids;
}

/**
 * A tiny fake of the backend. Keeps todos in memory and records every call.
 */
function createFakeApi(initialTodos) {
  const todos = (initialTodos || []).map((t) => Object.assign({}, t));
  let nextId = todos.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  const calls = [];

  function json(status, body) {
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(body)
    });
  }

  function fetchImpl(url, options) {
    const method = ((options && options.method) || 'GET').toUpperCase();
    calls.push({ url, method, body: options && options.body ? JSON.parse(options.body) : undefined });

    if (url === '/api/todos' && method === 'GET') {
      return json(200, todos.map((t) => Object.assign({}, t)));
    }
    if (url === '/api/todos' && method === 'POST') {
      const body = JSON.parse(options.body);
      const created = {
        id: nextId++,
        title: body.title,
        done: false,
        priority: body.priority || 'MEDIUM',
        createdAt: new Date().toISOString()
      };
      todos.push(created);
      return json(201, Object.assign({}, created));
    }
    const toggleMatch = url.match(/^\/api\/todos\/(\d+)\/toggle$/);
    if (toggleMatch && method === 'POST') {
      const todo = todos.find((t) => t.id === Number(toggleMatch[1]));
      if (!todo) return json(404, { error: 'not found' });
      todo.done = !todo.done;
      return json(200, Object.assign({}, todo));
    }
    const idMatch = url.match(/^\/api\/todos\/(\d+)$/);
    if (idMatch && method === 'DELETE') {
      const index = todos.findIndex((t) => t.id === Number(idMatch[1]));
      if (index === -1) return json(404, { error: 'not found' });
      todos.splice(index, 1);
      return json(204, null);
    }
    return json(404, { error: 'no route for ' + method + ' ' + url });
  }

  return { fetchImpl, todos, calls };
}

/**
 * Load the page and start the app against a fake API seeded with initialTodos.
 * Returns { app, api, document } once the initial list has been fetched.
 */
async function loadApp(initialTodos) {
  const html = readIndexHtml();
  const bodyMatch = html.match(/<body>([\s\S]*)<\/body>/);
  document.body.innerHTML = bodyMatch[1].replace(/<script[^>]*><\/script>/g, '');

  const api = createFakeApi(initialTodos);
  global.fetch = api.fetchImpl;

  jest.resetModules();
  const mod = require(APP_PATH);
  const app = mod.initApp(document, api.fetchImpl);
  await app.ready;
  return { app, api, document, module: mod };
}

function requireApp() {
  jest.resetModules();
  return require(APP_PATH);
}

module.exports = {
  REGISTERED_IDS,
  loadApp,
  requireApp,
  createFakeApi,
  readIndexHtml,
  extractIds,
  APP_PATH,
  HTML_PATH
};
