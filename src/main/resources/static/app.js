/*
 * Marlowe & Finch task tracker, frontend.
 *
 * Plain JavaScript, no framework. The page talks to the Spring Boot API at /api/todos.
 * Everything is wrapped in initApp(document, fetchImpl) so the same code runs in the
 * browser and inside Jest with jsdom (see src/test/javascript/setup/loadApp.js).
 */
(function (root) {
  'use strict';

  var API_URL = '/api/todos';

  // ---------- API client ----------

  function createApi(fetchImpl) {
    function request(url, options) {
      return fetchImpl(url, options).then(function (response) {
        if (!response.ok) {
          throw new Error('Request failed: ' + response.status + ' ' + url);
        }
        if (response.status === 204) {
          return null;
        }
        return response.json();
      });
    }

    return {
      list: function () {
        return request(API_URL);
      },
      create: function (title, priority) {
        return request(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: title, priority: priority })
        });
      },
      toggle: function (id) {
        return request(API_URL + '/' + id + '/toggle', { method: 'POST' });
      },
      remove: function (id) {
        return request(API_URL + '/' + id, { method: 'DELETE' });
      }
    };
  }

  // ---------- Pure helpers ----------

  function applyFilter(todos, filter) {
    if (filter === 'open') {
      return todos.filter(function (t) { return !t.done; });
    }
    if (filter === 'done') {
      return todos.filter(function (t) { return t.done; });
    }
    return todos;
  }

  function remainingLabel(todos) {
    var open = todos.filter(function (t) { return !t.done; }).length;
    return open + (open === 1 ? ' item left' : ' items left');
  }

  // ---------- App ----------

  function initApp(doc, fetchImpl) {
    var api = createApi(fetchImpl);
    var state = { todos: [], filter: 'all' };

    var form = doc.getElementById('todo-form');
    var input = doc.getElementById('todo-input');
    var prioritySelect = doc.getElementById('todo-priority');
    var list = doc.getElementById('todo-list');
    var remaining = doc.getElementById('remaining-count');
    var clearDone = doc.getElementById('clear-done');
    var filterButtons = {
      all: doc.getElementById('filter-all'),
      open: doc.getElementById('filter-open'),
      done: doc.getElementById('filter-done')
    };

    function render() {
      var visible = applyFilter(state.todos, state.filter);
      list.innerHTML = '';

      if (visible.length === 0) {
        var empty = doc.createElement('li');
        empty.className = 'empty';
        empty.textContent = state.todos.length === 0 ? 'Nothing to do. Add a task above.' : 'Nothing here.';
        list.appendChild(empty);
      }

      visible.forEach(function (todo) {
        var item = doc.createElement('li');
        item.className = 'todo-item' + (todo.done ? ' done' : '');
        item.dataset.id = String(todo.id);

        var checkbox = doc.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'toggle';
        checkbox.checked = todo.done;
        checkbox.setAttribute('aria-label', 'Mark "' + todo.title + '" as ' + (todo.done ? 'open' : 'done'));
        checkbox.addEventListener('change', function () { toggle(todo.id); });

        var title = doc.createElement('span');
        title.className = 'todo-title';
        title.textContent = todo.title;

        var priority = doc.createElement('span');
        priority.className = 'priority ' + todo.priority;
        priority.textContent = todo.priority;

        var del = doc.createElement('button');
        del.type = 'button';
        del.className = 'delete-button';
        del.textContent = 'Delete';
        del.setAttribute('aria-label', 'Delete "' + todo.title + '"');
        del.addEventListener('click', function () { remove(todo.id); });

        item.appendChild(checkbox);
        item.appendChild(title);
        item.appendChild(priority);
        item.appendChild(del);
        list.appendChild(item);
      });

      remaining.textContent = remainingLabel(state.todos);

      Object.keys(filterButtons).forEach(function (key) {
        filterButtons[key].classList.toggle('active', key === state.filter);
      });
    }

    function load() {
      return api.list().then(function (todos) {
        state.todos = todos;
        render();
      });
    }

    function add(title, priority) {
      var trimmed = (title || '').trim();
      if (!trimmed) {
        return Promise.resolve();
      }
      return api.create(trimmed, priority).then(function (created) {
        state.todos.push(created);
        render();
      });
    }

    function toggle(id) {
      return api.toggle(id).then(function (updated) {
        state.todos = state.todos.map(function (t) { return t.id === updated.id ? updated : t; });
        render();
      });
    }

    function remove(id) {
      return api.remove(id).then(function () {
        state.todos = state.todos.filter(function (t) { return t.id !== id; });
        render();
      });
    }

    function setFilter(filter) {
      state.filter = filter;
      render();
    }

    function clearCompleted() {
      var doneIds = state.todos.filter(function (t) { return t.done; }).map(function (t) { return t.id; });
      return Promise.all(doneIds.map(function (id) { return api.remove(id); })).then(function () {
        state.todos = state.todos.filter(function (t) { return !t.done; });
        render();
      });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var title = input.value;
      var priority = prioritySelect.value;
      input.value = '';
      add(title, priority);
    });

    Object.keys(filterButtons).forEach(function (key) {
      filterButtons[key].addEventListener('click', function () { setFilter(key); });
    });

    clearDone.addEventListener('click', function () { clearCompleted(); });

    var ready = load();

    return {
      ready: ready,
      getState: function () { return state; },
      add: add,
      toggle: toggle,
      remove: remove,
      setFilter: setFilter,
      clearCompleted: clearCompleted,
      reload: load,
      render: render
    };
  }

  // ---------- Wiring ----------

  var exported = {
    initApp: initApp,
    createApi: createApi,
    applyFilter: applyFilter,
    remainingLabel: remainingLabel,
    API_URL: API_URL
  };

  if (typeof module !== 'undefined' && module.exports) {
    // Jest / Node
    module.exports = exported;
  } else if (root.document) {
    // Browser: start once the DOM is ready
    var start = function () { root.todoApp = initApp(root.document, root.fetch.bind(root)); };
    if (root.document.readyState === 'loading') {
      root.document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  }
})(typeof window !== 'undefined' ? window : this);
