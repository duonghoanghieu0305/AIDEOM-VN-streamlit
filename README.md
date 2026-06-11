# 🚀 AIDEOM-VN

**AI Decision Optimization Model for Vietnam** — 12 bài đề tài cuối kỳ môn *Các Mô hình Ra Quyết định*, ngành Kinh tế Việt Nam.

## 📋 Tổng quan

12 bài tập từ cơ bản đến nâng cao, tích hợp 7 phương pháp tối ưu hóa:

| Phần | Bài | Tên | Phương pháp |
|------|-----|-----|-------------|
| A | 1 | Cobb-Douglas mở rộng | numpy + sklearn |
| A | 2 | LP phân bổ ngân sách | scipy.linprog |
| A | 3 | LP priority 10 ngành | scipy + AHP |
| B | 4 | LP ngành-vùng 6×4 | scipy 2D |
| B | 5 | MIP chọn 15 dự án | PuLP |
| B | 6 | TOPSIS 6 vùng | numpy (custom) |
| B | 7 | NSGA-II Pareto | pymoo |
| B | 8 | Dynamic Programming | scipy DP |
| C | 9 | AI Labor Impact | CVXPY |
| C | 10 | Stochastic 2-stage | Pyomo |
| C | 11 | Q-learning RL | gymnasium |
| D | 12 | AIDEOM Integration | All 6 modules |

## ✨ Tính năng

- **Modern dark dashboard** — Cyan-Purple-Pink gradient + glassmorphism
- **12 interactive playgrounds** — Mỗi bài có sliders điều chỉnh tham số real-time
- **60+ Chart.js charts** — Line, bar, radar, scatter, heatmap
- **3D Pareto frontier** — Plotly.js interactive (bài 7)
- **MathJax LaTeX** — Toàn bộ công thức render đẹp
- **AI Chatbot Gemini Flash** — Trợ lý AI miễn phí trả lời câu hỏi
- **Tooltips + Citations** — Học thuật chuẩn

## 🛠 Cách chạy local

### Cách 1: Mở trực tiếp HTML

```bash
# Mở index.html bằng trình duyệt
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

### Cách 2: Streamlit (khuyến nghị)

```bash
pip install streamlit
streamlit run streamlit_app.py
```

Truy cập http://localhost:8501

### Cách 3: Python HTTP server

```bash
python -m http.server 8000
```

Truy cập http://localhost:8000

## ☁️ Deploy lên Streamlit Cloud (free)

### Bước 1: Push lên GitHub

```bash
git init
git add .
git commit -m "Initial: AIDEOM-VN 12 bài"
git branch -M main
git remote add origin https://github.com/<your_username>/aideom-vn.git
git push -u origin main
```

### Bước 2: Connect Streamlit Cloud

1. Truy cập https://share.streamlit.io
2. Sign in bằng GitHub
3. Click **New app**
4. Chọn:
   - Repository: `<your_username>/aideom-vn`
   - Branch: `main`
   - Main file path: `streamlit_app.py`
5. Click **Deploy**

Streamlit Cloud sẽ tự build (~2 phút). URL public sẽ dạng:
`https://<your-app-name>.streamlit.app`

### Bước 3: Chia sẻ link

Sao chép URL và chia sẻ. App chạy **24/7 miễn phí** trong giới hạn free tier:
- 1 GB RAM
- Bandwidth không giới hạn
- App sleep sau 7 ngày không dùng (wake up trong 30s)

## 🤖 Cấu hình AI Chatbot

Chatbot dùng **Google Gemini Flash API** (miễn phí 15 req/phút, 1500 req/ngày).

### Lấy API key:

1. Truy cập https://aistudio.google.com/apikey
2. Click **Create API key**
3. Copy key (dạng `AIzaSy...`)

### Cấu hình trong app:

1. Click icon 💬 góc dưới bên phải
2. Click ⚙ Settings
3. Paste API key vào ô
4. Click **Lưu**

Key được lưu trong `localStorage` của trình duyệt, KHÔNG gửi lên server bất kỳ.

## 📂 Cấu trúc files

```
aideom-vn/
├── index.html              # Trang chủ
├── bai01.html ~ bai12.html # 12 bài tập
├── styles.css              # Theme dark mode
├── data.js                 # Dữ liệu chung (macro/sectors/regions)
├── shared.js               # Sidebar + navigation
├── chatbot.js              # AI Chatbot Gemini
├── streamlit_app.py        # Wrapper cho Streamlit Cloud
├── requirements.txt        # Python deps
└── README.md               # Tài liệu này
```

## 🎓 Phương pháp toán học

- **Cobb-Douglas mở rộng**: `Y = A·K^α·L^β·(AI)^γ`
- **Linear Programming**: scipy.linprog (simplex)
- **MIP**: PuLP + branch-and-bound + brute force
- **TOPSIS**: Vector normalization + Euclidean distance
- **NSGA-II**: Non-dominated sorting + crowding distance
- **Dynamic Programming**: Bellman backward induction
- **CVXPY**: Convex optimization (√x diminishing returns)
- **Stochastic 2-stage**: Pyomo SAA + Robust minimax regret
- **Q-learning**: ε-greedy + TD update

## 📚 Tài liệu tham khảo

- QĐ 127/QĐ-TTg (2021): Chiến lược quốc gia về AI 2021-2030
- McKinsey (2023): The state of AI in 2023
- World Bank (2024): Vietnam 2045 report
- Sutton & Barto (2018): Reinforcement Learning
- Birge & Louveaux (2011): Stochastic Programming
- Boyd & Vandenberghe (2004): Convex Optimization

## 📄 License

MIT License - Tự do sử dụng cho mục đích học tập, nghiên cứu, phi thương mại.

---

**Made for** Quân Phan Mạnh · *Đề tài cuối kỳ Các mô hình ra quyết định 2026*
