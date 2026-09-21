const { loadApp } = require('./setup/loadApp');

const SEED = [
  { id: 1, title: 'Open task', done: false, priority: 'MEDIUM', createdAt: '2026-09-01T09:00:00Z' },
  { id: 2, title: 'Done task', done: true, priority: 'MEDIUM', createdAt: '2026-09-01T09:05:00Z' }
];

describe('toggling and deleting', () => {
  test('clicking the checkbox POSTs to /toggle', async () => {
    const { document, api } = await loadApp(SEED);
    document.querySelector('[data-id="1"] .toggle').dispatchEvent(new Event('change'));
    await new Promise(process.nextTick);
    expect(api.calls.some((c) => c.method === 'POST' && c.url === '/api/todos/1/toggle')).toBe(true);
  });

  test('toggling an open todo marks it done in the list', async () => {
    const { document, app } = await loadApp(SEED);
    await app.toggle(1);
    expect(document.querySelector('[data-id="1"]').classList.contains('done')).toBe(true);
    expect(document.querySelector('[data-id="1"] .toggle').checked).toBe(true);
  });

  test('toggling a done todo reopens it', async () => {
    const { document, app } = await loadApp(SEED);
    await app.toggle(2);
    expect(document.querySelector('[data-id="2"]').classList.contains('done')).toBe(false);
  });

  test('toggling updates the remaining count', async () => {
    const { document, app } = await loadApp(SEED);
    expect(document.getElementById('remaining-count').textContent).toBe('1 item left');
    await app.toggle(1);
    expect(document.getElementById('remaining-count').textContent).toBe('0 items left');
  });

  test('clicking Delete sends DELETE and removes the item', async () => {
    const { document, api } = await loadApp(SEED);
    document.querySelector('[data-id="1"] .delete-button').click();
    await new Promise(process.nextTick);
    expect(api.calls.some((c) => c.method === 'DELETE' && c.url === '/api/todos/1')).toBe(true);
    expect(document.querySelector('[data-id="1"]')).toBeNull();
    expect(document.querySelectorAll('.todo-item')).toHaveLength(1);
  });

  test('deleting the last todo shows the empty state', async () => {
    const { document, app } = await loadApp([SEED[0]]);
    await app.remove(1);
    expect(document.querySelector('#todo-list .empty')).not.toBeNull();
  });
});
