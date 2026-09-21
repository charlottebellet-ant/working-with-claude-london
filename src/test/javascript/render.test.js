const { loadApp } = require('./setup/loadApp');

const SEED = [
  { id: 1, title: 'Order grinder burrs', done: false, priority: 'HIGH', createdAt: '2026-09-01T09:00:00Z' },
  { id: 2, title: 'Draft price list', done: true, priority: 'MEDIUM', createdAt: '2026-09-01T09:05:00Z' },
  { id: 3, title: 'Book the van MOT', done: false, priority: 'LOW', createdAt: '2026-09-01T09:10:00Z' }
];

describe('rendering', () => {
  test('shows the app title in the header', async () => {
    const { document } = await loadApp([]);
    expect(document.getElementById('app-title').textContent).toBe('Marlowe & Finch Tasks');
  });

  test('renders one list item per todo from the API', async () => {
    const { document } = await loadApp(SEED);
    expect(document.querySelectorAll('#todo-list .todo-item')).toHaveLength(3);
  });

  test('renders titles in order', async () => {
    const { document } = await loadApp(SEED);
    const titles = Array.from(document.querySelectorAll('.todo-title')).map((el) => el.textContent);
    expect(titles).toEqual(['Order grinder burrs', 'Draft price list', 'Book the van MOT']);
  });

  test('marks done todos with the done class and a checked checkbox', async () => {
    const { document } = await loadApp(SEED);
    const item = document.querySelector('[data-id="2"]');
    expect(item.classList.contains('done')).toBe(true);
    expect(item.querySelector('.toggle').checked).toBe(true);
    expect(document.querySelector('[data-id="1"]').classList.contains('done')).toBe(false);
  });

  test('shows the priority badge with the priority as a class', async () => {
    const { document } = await loadApp(SEED);
    const badge = document.querySelector('[data-id="1"] .priority');
    expect(badge.textContent).toBe('HIGH');
    expect(badge.classList.contains('HIGH')).toBe(true);
  });

  test('shows the remaining count of open items', async () => {
    const { document } = await loadApp(SEED);
    expect(document.getElementById('remaining-count').textContent).toBe('2 items left');
  });

  test('shows an empty state when there are no todos', async () => {
    const { document } = await loadApp([]);
    expect(document.querySelector('#todo-list .empty').textContent).toBe('Nothing to do. Add a task above.');
    expect(document.getElementById('remaining-count').textContent).toBe('0 items left');
  });
});
