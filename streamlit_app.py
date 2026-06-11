/* =============================================================
   AIDEOM-VN · EXECUTIVE CLEAN SLATE MASTER THEME
   ============================================================= */
* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  /* Backgrounds */
  --bg-body: #f8fafc;
  --bg-card: #ffffff;
  --bg-surface: #f1f5f9;
  --bg-hover: #e2e8f0;

  /* Typography */
  --text-main: #0f172a;
  --text-body: #334155;
  --text-muted: #64748b;

  /* Accents */
  --color-primary: #1e40af;
  --color-secondary: #6b21a8;
  --color-tertiary: #9f1239;
  --color-success: #047857;
  --color-warning: #b45309;

  --border-color: #e2e8f0;
}

body {
  font-family: 'Inter', -apple-system, sans-serif;
  background: var(--bg-body);
  color: var(--text-body);
  line-height: 1.6;
}

/* LAYOUT & CARDS */
.layout { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
.sidebar { background: var(--bg-card); border-right: 1px solid var(--border-color); padding: 24px 14px; position: sticky; top: 0; height: 100vh; }
.main { padding: 32px 40px 80px; max-width: 1200px; }

.page-header {
  background: var(--bg-card); border: 1px solid var(--border-color);
  border-radius: 12px; padding: 24px; margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.page-header h1 { color: var(--text-main); font-size: 26px; font-weight: 800; margin-bottom: 8px; }

.card {
  background: var(--bg-card); border: 1px solid var(--border-color);
  border-radius: 12px; padding: 24px; margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

/* TYPOGRAPHY */
h2 { color: var(--text-main); font-size: 20px; font-weight: 700; margin: 32px 0 16px; border-bottom: 2px solid var(--bg-hover); padding-bottom: 8px; }
h4 { color: var(--text-main); font-size: 15px; font-weight: 700; margin: 16px 0 8px; }

/* FIX DARK PATCHES: MATH, INSIGHTS, PRE */
.math {
  background: var(--bg-surface) !important;
  border-left: 4px solid var(--color-secondary) !important;
  color: var(--text-main) !important;
  padding: 16px; border-radius: 0 8px 8px 0; margin: 12px 0; overflow-x: auto;
}

.insight {
  background: var(--bg-surface) !important;
  border: 1px solid var(--border-color) !important;
  border-left: 4px solid var(--color-primary) !important;
  border-radius: 8px; padding: 16px; margin: 16px 0;
  color: var(--text-body) !important;
}
.insight .insight-title { color: var(--color-primary); font-weight: 700; margin-bottom: 8px; }

pre {
  background: var(--text-main) !important; /* Code blocks stay dark for syntax contrast */
  color: #f8fafc !important;
  padding: 16px; border-radius: 8px; margin: 12px 0; font-family: monospace;
}

/* TABLES */
.table-wrap { overflow-x: auto; border-radius: 8px; border: 1px solid var(--border-color); margin: 12px 0; }
table { width: 100%; border-collapse: collapse; background: var(--bg-card); font-size: 13px; }
thead tr { background: var(--bg-surface); }
th { padding: 12px; text-align: left; font-weight: 700; color: var(--text-main); border-bottom: 2px solid var(--border-color); }
td { padding: 12px; border-bottom: 1px solid var(--border-color); color: var(--text-body); }

/* Q&A COLLAPSIBLE */
details.qa { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 12px; }
details.qa summary { padding: 14px 16px; font-weight: 600; color: var(--text-main); cursor: pointer; border-bottom: 1px solid transparent; }
details.qa[open] summary { border-bottom-color: var(--border-color); color: var(--color-primary); background: var(--bg-surface); }
details.qa .qa-a { padding: 14px 16px; color: var(--text-body); }

/* BUTTONS & TAGS */
.tag { font-size: 11px; padding: 4px 10px; border-radius: 4px; font-weight: 600; background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-body); margin-right: 6px; }
