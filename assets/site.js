(function () {
  const root = document.documentElement;

  const getPreferred = () =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';

  const apply = (mode) => {
    root.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
    syncLabels(mode);
  };

  const syncLabels = (mode) => {
    const labels = document.querySelectorAll('[data-theme-label]');
    labels.forEach((el) => (el.textContent = mode));

    const btns = document.querySelectorAll('[data-theme-toggle]');
    btns.forEach((b) => b.setAttribute('aria-label', `Přepnout motiv (aktuálně: ${mode})`));
  };

  const init = () => {
    const saved = localStorage.getItem('theme') || 'auto';
    if (saved === 'auto') {
      root.setAttribute('data-theme', getPreferred());
      syncLabels('auto');
    } else {
      root.setAttribute('data-theme', saved);
      syncLabels(saved);
    }

    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cur = localStorage.getItem('theme') || 'auto';
        const next = cur === 'auto' ? 'dark' : cur === 'dark' ? 'light' : 'auto';

        if (next === 'auto') {
          localStorage.setItem('theme', 'auto');
          root.setAttribute('data-theme', getPreferred());
          syncLabels('auto');
        } else {
          apply(next);
        }
      });
    });

    // OS theme change → jen když je mode auto
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
        const cur = localStorage.getItem('theme') || 'auto';
        if (cur === 'auto') root.setAttribute('data-theme', getPreferred());
      });
    }

    // Year helper
    document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
