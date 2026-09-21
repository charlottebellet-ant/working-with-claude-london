const { requireApp, createFakeApi } = require('./setup/loadApp');

describe('API client', () => {
  let createApi;
  let remainingLabel;
  let API_URL;

  beforeEach(() => {
    ({ createApi, remainingLabel, API_URL } = requireApp());
  });

  test('API_URL points at /api/todos', () => {
    expect(API_URL).toBe('/api/todos');
  });

  test('list GETs /api/todos and returns the JSON body', async () => {
    const fake = createFakeApi([{ id: 1, title: 'x', done: false, priority: 'LOW' }]);
    const api = createApi(fake.fetchImpl);
    const todos = await api.list();
    expect(todos).toHaveLength(1);
    expect(fake.calls[0]).toMatchObject({ url: '/api/todos', method: 'GET' });
  });

  test('create POSTs JSON with the right content type', async () => {
    const seen = [];
    const fetchImpl = (url, options) => {
      seen.push({ url, options });
      return Promise.resolve({ ok: true, status: 201, json: () => Promise.resolve({ id: 9 }) });
    };
    const api = createApi(fetchImpl);
    const created = await api.create('New', 'HIGH');
    expect(created).toEqual({ id: 9 });
    expect(seen[0].options.method).toBe('POST');
    expect(seen[0].options.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(seen[0].options.body)).toEqual({ title: 'New', priority: 'HIGH' });
  });

  test('toggle POSTs to /api/todos/{id}/toggle', async () => {
    const fake = createFakeApi([{ id: 4, title: 'x', done: false, priority: 'LOW' }]);
    const api = createApi(fake.fetchImpl);
    const updated = await api.toggle(4);
    expect(updated.done).toBe(true);
    expect(fake.calls[0]).toMatchObject({ url: '/api/todos/4/toggle', method: 'POST' });
  });

  test('remove sends DELETE and resolves to null on 204', async () => {
    const fake = createFakeApi([{ id: 4, title: 'x', done: false, priority: 'LOW' }]);
    const api = createApi(fake.fetchImpl);
    await expect(api.remove(4)).resolves.toBeNull();
    expect(fake.todos).toHaveLength(0);
  });

  test('a non-2xx response rejects with the status and url', async () => {
    const fetchImpl = () => Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) });
    const api = createApi(fetchImpl);
    await expect(api.list()).rejects.toThrow('Request failed: 500 /api/todos');
  });

  test('a 404 from toggle rejects', async () => {
    const fake = createFakeApi([]);
    const api = createApi(fake.fetchImpl);
    await expect(api.toggle(42)).rejects.toThrow('404');
  });

  test('remainingLabel uses singular for one item', () => {
    expect(remainingLabel([{ done: false }])).toBe('1 item left');
  });

  test('remainingLabel counts only open items', () => {
    expect(remainingLabel([{ done: false }, { done: true }, { done: false }])).toBe('2 items left');
    expect(remainingLabel([])).toBe('0 items left');
  });
});
