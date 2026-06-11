// =============================================================
// AIDEOM-VN · Shared sidebar + navigation
// =============================================================

const EXERCISES = [
  { id: 1,  title: 'Cobb-Douglas mở rộng',       section: 'A', cap: 'Cấp độ cơ bản' },
  { id: 2,  title: 'LP phân bổ ngân sách',        section: 'A', cap: 'Cấp độ cơ bản' },
  { id: 3,  title: 'LP priority 10 ngành',        section: 'A', cap: 'Cấp độ cơ bản' },
  { id: 4,  title: 'LP ngành-vùng 6×4',           section: 'B', cap: 'Cấp độ trung bình' },
  { id: 5,  title: 'MIP chọn 15 dự án',           section: 'B', cap: 'Cấp độ trung bình' },
  { id: 6,  title: 'TOPSIS 6 vùng',               section: 'B', cap: 'Cấp độ trung bình' },
  { id: 7,  title: 'NSGA-II Pareto',              section: 'B', cap: 'Cấp độ trung bình' },
  { id: 8,  title: 'Dynamic Programming',         section: 'B', cap: 'Cấp độ trung bình' },
  { id: 9,  title: 'AI Labor Impact',             section: 'C', cap: 'Cấp độ khó' },
  { id: 10, title: 'Stochastic 2-stage',          section: 'C', cap: 'Cấp độ khó' },
  { id: 11, title: 'Q-learning RL',               section: 'C', cap: 'Cấp độ khó' },
  { id: 12, title: 'AIDEOM Integration',          section: 'D', cap: 'Integration' },
];

// ----- Build sidebar -----
(function buildSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  const current = parseInt(sidebar.dataset.current || 0);

  const sections = {};
  EXERCISES.forEach(e => {
    if (!sections[e.section]) sections[e.section] = { name: e.cap, items: [] };
    sections[e.section].items.push(e);
  });

  let html = '<div class="logo">🚀 AIDEOM-VN</div>';
  html += `<a href="index.html" class="nav-link${current === 0 ? ' active' : ''}" style="margin-bottom:8px">🏠 Trang chủ</a>`;

  Object.keys(sections).forEach(s => {
    html += `<div class="nav-section">Phần ${s} · ${sections[s].name}</div>`;
    sections[s].items.forEach(e => {
      const id = String(e.id).padStart(2, '0');
      const active = e.id === current ? ' active' : '';
      html += `<a href="bai${id}.html" class="nav-link${active}">Bài ${e.id}. ${e.title}</a>`;
    });
  });

  sidebar.innerHTML = html;
})();

// ----- Build exercise nav (prev / next) -----
(function buildExerciseNav() {
  const nav = document.getElementById('exercise-nav');
  if (!nav) return;
  const current = parseInt(nav.dataset.current || 0);
  const prev = current > 1 ? current - 1 : null;
  const next = current < 12 ? current + 1 : null;

  let html = '';
  if (prev) {
    const pid = String(prev).padStart(2, '0');
    html += `<a href="bai${pid}.html">← Bài ${prev}</a>`;
  } else {
    html += `<a href="index.html">← Trang chủ</a>`;
  }
  if (next) {
    const nid = String(next).padStart(2, '0');
    html += `<a href="bai${nid}.html">Bài ${next} →</a>`;
  } else {
    html += `<a href="index.html">Trang chủ →</a>`;
  }
  nav.innerHTML = html;
})();
