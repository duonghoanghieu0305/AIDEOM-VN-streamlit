"""
AIDEOM-VN Streamlit Wrapper.
Serves 12 HTML pages with sidebar navigation.
Hides duplicate HTML sidebar (Streamlit sidebar is used instead).
"""
import streamlit as st
from pathlib import Path
import streamlit.components.v1 as components

st.set_page_config(
    page_title="AIDEOM-VN",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded",
)

ROOT = Path(__file__).parent

EXERCISES = [
    {"id": 0,  "title": "🏠 Trang chủ",                  "file": "index.html",  "section": "Trang chủ"},
    {"id": 1,  "title": "Bài 1 · Cobb-Douglas mở rộng",  "file": "bai01.html",  "section": "A · Cơ bản"},
    {"id": 2,  "title": "Bài 2 · LP phân bổ ngân sách",  "file": "bai02.html",  "section": "A · Cơ bản"},
    {"id": 3,  "title": "Bài 3 · LP priority 10 ngành",  "file": "bai03.html",  "section": "A · Cơ bản"},
    {"id": 4,  "title": "Bài 4 · LP ngành-vùng 6×4",     "file": "bai04.html",  "section": "B · Trung bình"},
    {"id": 5,  "title": "Bài 5 · MIP chọn 15 dự án",     "file": "bai05.html",  "section": "B · Trung bình"},
    {"id": 6,  "title": "Bài 6 · TOPSIS 6 vùng",         "file": "bai06.html",  "section": "B · Trung bình"},
    {"id": 7,  "title": "Bài 7 · NSGA-II Pareto",        "file": "bai07.html",  "section": "B · Trung bình"},
    {"id": 8,  "title": "Bài 8 · Dynamic Programming",   "file": "bai08.html",  "section": "B · Trung bình"},
    {"id": 9,  "title": "Bài 9 · AI Labor Impact",       "file": "bai09.html",  "section": "C · Khó"},
    {"id": 10, "title": "Bài 10 · Stochastic 2-stage",   "file": "bai10.html",  "section": "C · Khó"},
    {"id": 11, "title": "Bài 11 · Q-learning RL",        "file": "bai11.html",  "section": "C · Khó"},
    {"id": 12, "title": "Bài 12 · AIDEOM Integration",   "file": "bai12.html",  "section": "D · Integration"},
]

st.sidebar.markdown(
    "<div style='background:linear-gradient(135deg,#06b6d4,#a855f7,#ec4899);"
    "-webkit-background-clip:text;-webkit-text-fill-color:transparent;"
    "font-size:24px;font-weight:900;margin-bottom:8px'>🚀 AIDEOM-VN</div>"
    "<div style='color:#94a3b8;font-size:11px;margin-bottom:18px;line-height:1.5'>"
    "AI Decision Optimization Model for Vietnam<br>12 bài đề tài cuối kỳ</div>",
    unsafe_allow_html=True,
)

sections = {}
for ex in EXERCISES:
    sections.setdefault(ex["section"], []).append(ex)

selected_id = st.session_state.get("selected_id", 0)

for sec_name, items in sections.items():
    if sec_name != "Trang chủ":
        st.sidebar.markdown(
            "<div style='color:#64748b;font-size:10px;text-transform:uppercase;"
            "letter-spacing:1.5px;margin:14px 0 4px;padding:0 8px'>" + sec_name + "</div>",
            unsafe_allow_html=True,
        )
    for ex in items:
        if st.sidebar.button(ex["title"], key="nav_" + str(ex["id"]), use_container_width=True):
            st.session_state.selected_id = ex["id"]
            selected_id = ex["id"]
            st.rerun()

selected = next((e for e in EXERCISES if e["id"] == selected_id), EXERCISES[0])
html_file = ROOT / selected["file"]

if not html_file.exists():
    st.error("Không tìm thấy file: " + selected["file"])
    st.stop()

html_content = html_file.read_text(encoding="utf-8")


def inline_assets(html):
    """Inline local CSS/JS files. Escape </script> in JS to prevent premature closing."""
    assets = [
        ("styles.css",          '<link rel="stylesheet" href="styles.css">',     "style"),
        ("chart-animations.js", '<script src="chart-animations.js"></script>',   "script"),
        ("data.js",             '<script src="data.js"></script>',               "script"),
        ("shared.js",           '<script src="shared.js"></script>',             "script"),
        ("chatbot.js",          '<script src="chatbot.js"></script>',            "script"),
    ]
    for filename, tag, wrap in assets:
        f = ROOT / filename
        if not f.exists():
            continue
        text = f.read_text(encoding="utf-8")
        if wrap == "script":
            text = text.replace("</script>", "<\\/script>")
        repl = "<" + wrap + ">\n" + text + "\n</" + wrap + ">"
        html = html.replace(tag, repl)
    return html


html_content = inline_assets(html_content)

# Inject CSS to hide HTML sidebar (Streamlit provides its own sidebar)
# Also expand main content to full width since no HTML sidebar
HIDE_HTML_SIDEBAR = (
    "<style>"
    ".sidebar{display:none!important;}"
    ".layout{grid-template-columns:1fr!important;}"
    ".main{padding:24px 32px 80px!important;max-width:100%!important;}"
    "body{background:transparent!important;}"
    "</style>"
)

# Inject right after <head> tag opening
html_content = html_content.replace("</head>", HIDE_HTML_SIDEBAR + "</head>")

st.markdown(
    "<style>#MainMenu{visibility:hidden;}footer{visibility:hidden;}"
    ".block-container{padding:0!important;max-width:100%!important;}"
    "section[data-testid='stSidebar'] button{"
    "background:rgba(15,23,42,0.4)!important;color:#e2e8f0!important;"
    "border:1px solid rgba(168,85,247,0.2)!important;"
    "font-size:13px!important;text-align:left!important;"
    "padding:8px 12px!important;margin-bottom:2px!important;}"
    "section[data-testid='stSidebar'] button:hover{"
    "background:rgba(168,85,247,0.15)!important;border-color:#a855f7!important;}"
    "</style>",
    unsafe_allow_html=True,
)

components.html(html_content, height=2400, scrolling=True)
