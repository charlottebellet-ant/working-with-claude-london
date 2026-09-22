const { loadApp, requireApp } = require('./setup/loadApp');

describe('theme toggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('renders in the header and defaults to dark on a first visit', async () => {
    const { document } = await loadApp();
    const toggle = document.getElementById('theme-toggle');
    expect(toggle).not.toBeNull();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  test('the button label names the theme a click will switch to', async () => {
    const { document } = await loadApp();
    const toggle = document.getElementById('theme-toggle');
    expect(toggle.textContent).toMatch(/light/i);
    expect(toggle.getAttribute('aria-label')).toMatch(/light/i);

    toggle.click();

    expect(toggle.textContent).toMatch(/dark/i);
    expect(toggle.getAttribute('aria-label')).toMatch(/dark/i);
  });

  test('clicking flips data-theme on <html>', async () => {
    const { document } = await loadApp();
    const toggle = document.getElementById('theme-toggle');

    toggle.click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    toggle.click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  test('persists the chosen theme to localStorage on click', async () => {
    const { document } = await loadApp();
    document.getElementById('theme-toggle').click();

    expect(window.localStorage.getItem('ops-dashboard-theme')).toBe('light');
  });

  test('restores a previously stored theme on the next load', async () => {
    window.localStorage.setItem('ops-dashboard-theme', 'light');

    const { document } = await loadApp();

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.getElementById('theme-toggle').textContent).toMatch(/dark/i);
  });

  test('an invalid stored value falls back to the default rather than breaking', async () => {
    window.localStorage.setItem('ops-dashboard-theme', 'not-a-theme');

    const { document } = await loadApp();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});

describe('theme helpers (pure)', () => {
  test('resolveInitialTheme prefers a valid stored value over the default', () => {
    const { resolveInitialTheme } = requireApp();
    expect(resolveInitialTheme('light')).toBe('light');
    expect(resolveInitialTheme('dark')).toBe('dark');
  });

  test('resolveInitialTheme falls back to dark for missing or invalid values', () => {
    const { resolveInitialTheme } = requireApp();
    expect(resolveInitialTheme(null)).toBe('dark');
    expect(resolveInitialTheme('nonsense')).toBe('dark');
  });

  test('oppositeTheme flips light and dark', () => {
    const { oppositeTheme } = requireApp();
    expect(oppositeTheme('light')).toBe('dark');
    expect(oppositeTheme('dark')).toBe('light');
  });

  test('themeToggleContent advertises the target theme, not the current one', () => {
    const { themeToggleContent } = requireApp();
    expect(themeToggleContent('dark').label).toMatch(/light/i);
    expect(themeToggleContent('light').label).toMatch(/dark/i);
  });
});
