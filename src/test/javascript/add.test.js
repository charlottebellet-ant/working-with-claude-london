const { loadApp } = require('./setup/loadApp');

function submitForm(document, title, priority) {
  document.getElementById('todo-input').value = title;
  if (priority) {
    document.getElementById('todo-priority').value = priority;
  }
  document.getElementById('todo-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

async function flush() {
  // Let the fake fetch promise chain settle.
  for (let i = 0; i < 5; i++) {
    await Promise.resolve();
  }
}

describe('adding a todo', () => {
  test('submitting the form POSTs the title and priority', async () => {
    const { document, api } = await loadApp([]);
    submitForm(document, 'Descale the demo machine', 'HIGH');
    await flush();
    const post = api.calls.find((c) => c.method === 'POST');
    expect(post).toBeDefined();
    expect(post.body).toEqual({ title: 'Descale the demo machine', priority: 'HIGH' });
  });

  test('the new todo appears in the list', async () => {
    const { document } = await loadApp([]);
    submitForm(document, 'Descale the demo machine', 'MEDIUM');
    await flush();
    const titles = Array.from(document.querySelectorAll('.todo-title')).map((el) => el.textContent);
    expect(titles).toEqual(['Descale the demo machine']);
  });

  test('the input is cleared after submit', async () => {
    const { document } = await loadApp([]);
    submitForm(document, 'Something', 'LOW');
    await flush();
    expect(document.getElementById('todo-input').value).toBe('');
  });

  test('the remaining count goes up', async () => {
    const { document } = await loadApp([]);
    submitForm(document, 'One', 'LOW');
    await flush();
    expect(document.getElementById('remaining-count').textContent).toBe('1 item left');
    submitForm(document, 'Two', 'LOW');
    await flush();
    expect(document.getElementById('remaining-count').textContent).toBe('2 items left');
  });

  test('a blank title is not sent to the API', async () => {
    const { document, api } = await loadApp([]);
    submitForm(document, '   ', 'MEDIUM');
    await flush();
    expect(api.calls.filter((c) => c.method === 'POST')).toHaveLength(0);
    expect(document.querySelector('#todo-list .empty')).not.toBeNull();
  });

  test('the title is trimmed before sending', async () => {
    const { document, api } = await loadApp([]);
    submitForm(document, '  Clean the group heads  ', 'MEDIUM');
    await flush();
    const post = api.calls.find((c) => c.method === 'POST');
    expect(post.body.title).toBe('Clean the group heads');
  });

  test('the default priority in the select is MEDIUM', async () => {
    const { document } = await loadApp([]);
    expect(document.getElementById('todo-priority').value).toBe('MEDIUM');
  });
});
