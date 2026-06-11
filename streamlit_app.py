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

# Danh mục cấu trúc pipeline 12 bài tập đồng bộ hệ thống
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
    {"id": 10, "title": "Bài 10 · Stochastic 2-stage",    "file": "bai10.html",  "section": "C · Khó"},
    {"id": 11, "title": "Bài 11 · Q-learning RL",        "file": "bai11.html",  "section": "C · Khó"},
    {"id": 12, "title": "Bài 12 · AIDEOM Integration",   "file": "bai12.html",  "section": "D · Tổng kết"},
]

# Khởi tạo thanh điều hướng Sidebar của riêng ứng dụng Streamlit công nghệ số
st.sidebar.title("🚀 AIDEOM-VN")
st.sidebar.caption("Mô hình Ra Quyết Định Kinh Tế")

selected_title = st.sidebar.radio(
    "Danh mục bài tập hoạch định:",
    options=[ex["title"] for ex in EXERCISES],
    index=0
)

# Trích xuất file dữ liệu tương ứng với lựa chọn điều hướng
current_ex = next(ex for ex in EXERCISES if ex["title"] == selected_title)

html_path = ROOT / current_ex["file"]
if html_path.exists():
    html_content = html_path.read_text(encoding="utf-8")
else:
    html_content = f"<h1>Lỗi hệ thống: Không tìm thấy tệp {current_ex['file']}</h1>"

def inline_assets(html):
    # Cơ chế nhúng tài nguyên liên kết động styles.css
    css_path = ROOT / "styles.css"
    if css_path.exists():
        css_text = css_path.read_text(encoding="utf-8")
        html = html.replace('<link rel="stylesheet" href="styles.css">', f"<style>\n{css_text}\n</style>")
    
    # Cơ chế nhúng đồng bộ các tệp logic kịch bản mở rộng
    scripts = ["data.js", "shared.js", "chart-animations.js", "chatbot.js"]
    for script in scripts:
        script_path = ROOT / script
        if script_path.exists():
            script_text = script_path.read_text(encoding="utf-8")
            script_text = script_text.replace("</script>", "<\\/script>")
            html = html.replace(f'<script src="{script}"></script>', f"<script>\n{script_text}\n</script>")
    return html

html_content = inline_assets(html_content)

# Bổ sung mã đè điều hướng xử lý ẩn Sidebar HTML và ép hệ màu sáng Alabaster
HIDE_HTML_SIDEBAR = (
    "<style>"
    ".sidebar{display:none!important;}"
    ".layout{grid-template-columns:1fr!important;}"
    ".main{padding:24px 32px 80px!important;max-width:100%!important;}"
    "body{background:#faf8f5!important;}"
    "</style>"
)
html_content = html_content.replace("</head>", HIDE_HTML_SIDEBAR + "</head>")

# Làm sạch và định dạng lại giao diện hiển thị lớp vỏ bọc Streamlit
st.markdown(
    """
    <style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    .block-container {padding: 0!important; max-width: 100%!important;}
    
    /* 1. Hạ nền Sidebar xuống màu xám kem nhạt để khử hoàn toàn độ chói lóa */
    section[data-testid='stSidebar'] {
        background-color: #f8fafc !important;
        border-right: 1px solid rgba(15, 23, 42, 0.08) !important;
    }
    
    /* Đồng bộ màu chữ cho tiêu đề ứng dụng và caption phụ trong Sidebar */
    section[data-testid='stSidebar'] h1, 
    section[data-testid='stSidebar'] h2, 
    section[data-testid='stSidebar'] h3,
    section[data-testid='stSidebar'] [data-testid="stMarkdownContainer"] p {
        color: #0f172a !important;
    }
    section[data-testid='stSidebar'] caption,
    section[data-testid='stSidebar'] .stCaption {
        color: #64748b !important;
    }
    
    /* Ép màu cho phần text tiêu đề nhỏ của widget Radio Button */
    section[data-testid='stSidebar'] [data-testid="stWidgetLabel"] p {
        color: #475569 !important;
        font-weight: 600 !important;
        margin-bottom: 8px !important;
    }
    
    /* 2. Tạo lập các khối "Thẻ nổi" (Cards) màu trắng sang trọng cho danh sách bài */
    section[data-testid='stSidebar'] .stRadio div[role="radiogroup"] label {
        background-color: #ffffff !important;
        border: 1px solid rgba(15, 23, 42, 0.06) !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
        padding: 10px 12px !important;
        border-radius: 8px !important;
        margin-bottom: 6px !important;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    # ❌ FIX TRIỆT ĐỂ LỖI CHỮ TRẮNG: Ép toàn bộ các phần tử chữ con bên trong thẻ luôn có màu sẫm sắc nét
    section[data-testid='stSidebar'] .stRadio div[role="radiogroup"] label *,
    section[data-testid='stSidebar'] .stRadio div[role="radiogroup"] label p {
        color: #334155 !important;
        font-weight: 500 !important;
    }
    
    /* 3. Hiệu ứng Hover chuột: Sáng viền xanh Corporate Sapphire và nhấc nhẹ thẻ */
    section[data-testid='stSidebar'] .stRadio div[role="radiogroup"] label:hover {
        border-color: #1e40af !important;
        box-shadow: 0 4px 12px rgba(30, 64, 175, 0.08) !important;
        transform: translateY(-1px);
    }
    section[data-testid='stSidebar'] .stRadio div[role="radiogroup"] label:hover * {
        color: #1e40af !important;
    }
    
    /* 4. Định dạng trạng thái Đang được chọn (Active Option) - Đổ nền xanh nhạt, font chữ đậm */
    section[data-testid='stSidebar'] .stRadio div[role="radiogroup"] [data-checked="true"] {
        border-color: #1e40af !important;
        background-color: rgba(30, 64, 175, 0.05) !important;
        box-shadow: 0 2px 8px rgba(30, 64, 175, 0.04) !important;
    }
    section[data-testid='stSidebar'] .stRadio div[role="radiogroup"] [data-checked="true"] * {
        color: #1e40af !important;
        font-weight: 700 !important;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# Kích hoạt cổng nhúng Sandbox Iframe vận hành đồ án
components.html(html_content, height=2400, scrolling=True)
