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

# ==============================================================================
# BỘ LỌC GIAO DIỆN STREAMLIT - "NUKE ALL BLUE" (Loại bỏ 100% màu xanh, ép font đậm)
# ==============================================================================
st.markdown(
    """
    <style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    .block-container {padding: 0!important; max-width: 100%!important;}
    
    /* 1. Nền Sidebar và Font hệ thống chuẩn */
    section[data-testid='stSidebar'] {
        background-color: #f8fafc !important;
        border-right: 1px solid #e2e8f0 !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    }
    
    /* 2. Tiêu đề Logo sắc nét (Màu đen tuyền) */
    section[data-testid='stSidebar'] h1, 
    section[data-testid='stSidebar'] h2, 
    section[data-testid='stSidebar'] h3 {
        color: #0f172a !important;
        font-weight: 900 !important;
    }
    section[data-testid='stSidebar'] caption,
    section[data-testid='stSidebar'] .stCaption {
        color: #475569 !important;
        font-weight: 600 !important;
    }
    
    /* 3. Dòng chữ Danh mục (Xám khói) */
    section[data-testid='stSidebar'] [data-testid="stWidgetLabel"] p {
        color: #64748b !important;
        font-weight: 700 !important;
        font-size: 12px !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        margin-bottom: 16px !important;
    }
    
    /* 4. Khối Thẻ Bài Tập - Xóa màu xanh, tăng độ dày nét chữ */
    section[data-testid='stSidebar'] .stRadio div[role="radiogroup"] label {
        background-color: #ffffff !important;
        border: 1px solid #e2e8f0 !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
        padding: 12px 14px !important;
        border-radius: 8px !important;
        margin-bottom: 8px !important;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    
    /* 🔥 ÉP BUỘC MÀU XÁM CHÌ CỰC ĐẬM (#334155) CHO TẤT CẢ CHỮ CƠ BẢN */
    section[data-testid='stSidebar'] .stRadio div[role="radiogroup"] label p,
    section[data-testid='stSidebar'] .stRadio div[role="radiogroup"] label span,
    section[data-testid='stSidebar'] .stRadio div[role="radiogroup"] label div {
        color: #334155 !important;
        font-weight: 600 !important; /* Font chữ dày, mạnh mẽ */
        font-size: 14px !important;
    }
    
    /* 5. Hiệu ứng Hover - Đổi viền sang xám khói, nhấc thẻ lên */
    section[data-testid='stSidebar'] .stRadio div[role="radiogroup"] label:hover {
        border-color: #94a3b8 !important;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06) !important;
        transform: translateY(-2px);
        background-color: #f8fafc !important;
    }
    section[data-testid='stSidebar'] .stRadio div[role="radiogroup"] label:hover p,
    section[data-testid='stSidebar'] .stRadio div[role="radiogroup"] label:hover span {
        color: #0f172a !important; /* Đen tuyền hoàng gia */
    }
    
    /* 6. 🔥 TRẠNG THÁI ĐANG CHỌN (ACTIVE) - ĐEN TUYỀN, KHÔNG XANH DƯƠNG */
    section[data-testid='stSidebar'] .stRadio div[role="radiogroup"] [data-checked="true"] {
        border-color: #0f172a !important; 
        background-color: #f1f5f9 !important; 
        box-shadow: 0 2px 4px rgba(15, 23, 42, 0.05) !important;
    }
    
    /* Quét sạch mọi thẻ chữ bên trong Active, ép thành đen 100% và cực đậm */
    section[data-testid='stSidebar'] .stRadio div[role="radiogroup"] [data-checked="true"] p,
    section[data-testid='stSidebar'] .stRadio div[role="radiogroup"] [data-checked="true"] span,
    section[data-testid='stSidebar'] .stRadio div[role="radiogroup"] [data-checked="true"] div {
        color: #000000 !important; /* Đen nguyên chất */
        font-weight: 800 !important; /* Nét Extra-bold dứt khoát */
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# Kích hoạt cổng nhúng Sandbox Iframe vận hành đồ án
components.html(html_content, height=2400, scrolling=True)
