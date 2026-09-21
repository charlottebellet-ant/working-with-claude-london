const { loadApp, requireApp } = require('./setup/loadApp');

const SEED = [
  { id: 1, title: 'Open A', done: false, priority: 'LOW', createdAt: '2026-09-01T09:00:00Z' },
  { id: 2, title: 'Done B', done: true, priority: 'LOW', createdAt: '2026-09-01T09:05:00Z' },
  { id: 3, title: 'Open C', done: false, priority: 'LOW', createdAt: '2026-09-01T09:10:00Z' },
  { id: 4, title: 'Done D', done: true, priority: 'LOW', createdAt: '2026-09-01T09:15:00Z' }
];

function visibleTitles(document) {
  return Array.from(document.querySelectorAll('.todo-title')).map((el) => el.textContent);
}

describe('filtering', () => {
  test('All is active by default and shows everything', async () => {
    const { document } = await loadApp(SEED);
    expect(document.getElementById('filter-all').classList.contains('active')).toBe(true);
    expect(visibleTitles(document)).toHaveLength(4);
  });

  test('clicking Open shows only open todos', async () => {
    const { document } = await loadApp(SEED);
    document.getElementById('filter-open').click();
    expect(visibleTitles(document)).toEqual(['Open A', 'Open C']);
  });

  test('clicking Done shows only done todos', async () => {
    const { document } = await loadApp(SEED);
    document.getElementById('filter-done').click();
    expect(visibleTitles(document)).toEqual(['Done B', 'Done D']);
  });

  test('clicking All again restores the full list', async () => {
    const { document } = await loadApp(SEED);
    document.getElementById('filter-done').click();
    document.getElementById('filter-all').click();
    expect(visibleTitles(document)).toHaveLength(4);
  });

  test('the active class moves to the clicked filter button', async () => {
    const { document } = await loadApp(SEED);
    document.getElementById('filter-open').click();
    expect(document.getElementById('filter-open').classList.contains('active')).toBe(true);
    expect(document.getElementById('filter-all').classList.contains('active')).toBe(false);
    expect(document.getElementById('filter-done').classList.contains('active')).toBe(false);
  });

  test('the remaining count ignores the filter', async () => {
    const { document } = await loadApp(SEED);
    document.getElementById('filter-done').click();
    expect(document.getElementById('remaining-count').textContent).toBe('2 items left');
  });

  test('applyFilter is a pure helper', () => {
    const { applyFilter } = requireApp();
    expect(applyFilter(SEED, 'all')).toHaveLength(4);
    expect(applyFilter(SEED, 'open').map((t) => t.id)).toEqual([1, 3]);
    expect(applyFilter(SEED, 'done').map((t) => t.id)).toEqual([2, 4]);
  });
});
