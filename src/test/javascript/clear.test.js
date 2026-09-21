const { loadApp } = require('./setup/loadApp');

const SEED = [
  { id: 1, title: 'Open A', done: false, priority: 'LOW', createdAt: '2026-09-01T09:00:00Z' },
  { id: 2, title: 'Done B', done: true, priority: 'LOW', createdAt: '2026-09-01T09:05:00Z' },
  { id: 3, title: 'Done C', done: true, priority: 'LOW', createdAt: '2026-09-01T09:10:00Z' }
];

describe('clear done', () => {
  test('sends one DELETE per done todo', async () => {
    const { app, api } = await loadApp(SEED);
    await app.clearCompleted();
    const deletes = api.calls.filter((c) => c.method === 'DELETE').map((c) => c.url);
    expect(deletes.sort()).toEqual(['/api/todos/2', '/api/todos/3']);
  });

  test('removes done todos from the list and keeps open ones', async () => {
    const { document, app } = await loadApp(SEED);
    await app.clearCompleted();
    const titles = Array.from(document.querySelectorAll('.todo-title')).map((el) => el.textContent);
    expect(titles).toEqual(['Open A']);
  });

  test('the fake API no longer holds the deleted todos', async () => {
    const { app, api } = await loadApp(SEED);
    await app.clearCompleted();
    expect(api.todos.map((t) => t.id)).toEqual([1]);
  });

  test('does nothing when there are no done todos', async () => {
    const { app, api } = await loadApp([SEED[0]]);
    await app.clearCompleted();
    expect(api.calls.filter((c) => c.method === 'DELETE')).toHaveLength(0);
  });

  test('clicking the button triggers the clear', async () => {
    const { document, api } = await loadApp(SEED);
    document.getElementById('clear-done').click();
    await new Promise(process.nextTick);
    expect(api.calls.filter((c) => c.method === 'DELETE')).toHaveLength(2);
  });
});
