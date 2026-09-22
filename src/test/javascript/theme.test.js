const { loadApp } = require('./setup/loadApp');

describe('theme toggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  test('defaults to the dark theme when nothing is stored', async () => {
    await loadApp();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  test('restores a previously stored theme on load', async () => {
    localStorage.setItem('theme', 'light');
    await loadApp();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  test('clicking the toggle switches from dark to light and back', async () => {
    const { document } = await loadApp();
    const toggle = document.getElementById('theme-toggle');

    toggle.click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    toggle.click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  test('clicking the toggle persists the choice to localStorage', async () => {
    const { document } = await loadApp();
    document.getElementById('theme-toggle').click();
    expect(localStorage.getItem('theme')).toBe('light');
  });

  test('the toggle label names the theme a click would switch to', async () => {
    const { document } = await loadApp();
    const toggle = document.getElementById('theme-toggle');

    expect(toggle.textContent).toMatch(/light/i);
    toggle.click();
    expect(toggle.textContent).toMatch(/dark/i);
  });
});
