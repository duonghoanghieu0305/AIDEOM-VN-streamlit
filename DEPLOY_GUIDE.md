# 🚀 Hướng dẫn Deploy AIDEOM-VN

3 cách triển khai từ đơn giản đến chuyên nghiệp.

---

## ⚡ Cách 1: GitHub Pages (đơn giản nhất, public ngay)

GitHub Pages serve trang HTML tĩnh trực tiếp từ repo. Không cần Python/Streamlit.

### Bước 1: Tạo GitHub repo

1. Truy cập https://github.com/new
2. Đặt tên repo (vd. `aideom-vn`)
3. Chọn **Public**
4. Click **Create repository**

### Bước 2: Upload files

**Cách A: Qua web UI (dễ nhất)**

1. Click **uploading an existing file**
2. Kéo TẤT CẢ files (trừ `streamlit_app.py`, `requirements.txt`, `.streamlit/`) vào browser
3. Click **Commit changes**

**Cách B: Qua git command line**

```bash
cd path/to/aideom-vn
git init
git add .
git commit -m "Initial commit: AIDEOM-VN 12 bài"
git branch -M main
git remote add origin https://github.com/<your_username>/aideom-vn.git
git push -u origin main
```

### Bước 3: Bật GitHub Pages

1. Vào repo → **Settings** → **Pages** (sidebar trái)
2. Source: **Deploy from a branch**
3. Branch: `main`, folder: `/ (root)`
4. Click **Save**

Chờ 1-2 phút. URL public sẽ là:
**`https://<your_username>.github.io/aideom-vn/`**

### Ưu nhược điểm
- ✓ Hoàn toàn miễn phí, không giới hạn bandwidth
- ✓ HTTPS tự động
- ✓ Custom domain hỗ trợ
- ✗ Không chạy được Python (chỉ tĩnh HTML/CSS/JS)
- ✗ Không có Streamlit sidebar

---

## ☁️ Cách 2: Streamlit Cloud (khuyến nghị)

Có sidebar đẹp + Python backend nếu cần.

### Bước 1: Push lên GitHub (như Cách 1)

Đảm bảo có đầy đủ:
- `streamlit_app.py`
- `requirements.txt`
- `.streamlit/config.toml`
- Tất cả file HTML/CSS/JS

### Bước 2: Connect Streamlit Cloud

1. Truy cập https://share.streamlit.io
2. Click **Sign in with GitHub**, cấp quyền truy cập repo
3. Click **New app**
4. Form điền:
   - **Repository**: `<your_username>/aideom-vn`
   - **Branch**: `main`
   - **Main file path**: `streamlit_app.py`
   - **App URL**: tùy chọn tên (vd. `aideom-vn`)
5. Click **Deploy**

Build mất 2-3 phút. URL public:
**`https://aideom-vn.streamlit.app`** (hoặc tên bạn chọn)

### Cấu hình thêm (optional)

**Custom subdomain**: vào app settings, đổi URL.

**Secrets**: nếu cần lưu API keys server-side, vào **App settings → Secrets** paste:
```toml
GEMINI_API_KEY = "AIzaSy..."
```

### Ưu nhược điểm
- ✓ Free 1GB RAM, không giới hạn bandwidth
- ✓ Auto deploy khi push GitHub
- ✓ Logs, metrics, custom domain
- ✓ Có sidebar Streamlit + Python backend
- ✗ App sleep sau 7 ngày không truy cập (wake up 30s)
- ✗ Phải có account GitHub

---

## 🌐 Cách 3: Vercel / Netlify (chuyên nghiệp)

Nhanh nhất, CDN global, custom domain dễ.

### Vercel

1. Push lên GitHub
2. Truy cập https://vercel.com → Sign up bằng GitHub
3. Click **Add New Project** → chọn repo
4. **Framework Preset**: chọn **Other** (vì là static HTML)
5. **Build Command**: để trống
6. **Output Directory**: `.` (root)
7. Click **Deploy**

URL: `https://aideom-vn.vercel.app`

### Netlify

1. Push lên GitHub
2. Truy cập https://app.netlify.com → Sign up
3. **Add new site → Import existing project**
4. Connect GitHub → chọn repo
5. **Build command**: để trống
6. **Publish directory**: `.`
7. Click **Deploy site**

URL: `https://aideom-vn.netlify.app`

---

## 🤖 Setup AI Chatbot Gemini

App có chatbot floating widget góc dưới bên phải. Để dùng:

### Bước 1: Lấy API key (miễn phí)

1. Truy cập https://aistudio.google.com/apikey
2. Đăng nhập bằng Google account
3. Click **Create API key** → chọn project (hoặc tạo mới)
4. Copy key (dạng `AIzaSyA...`)

### Bước 2: Cấu hình trong web

1. Mở app → click 💬 góc dưới phải
2. Lần đầu sẽ hiện form **🔑 Cài đặt Gemini API**
3. Paste key vào ô → click **Lưu**
4. Key được lưu trong `localStorage` (chỉ trên máy bạn)

### Free tier:
- **15 requests/phút**
- **1500 requests/ngày**
- Đủ cho cá nhân + chia sẻ demo

### Nếu muốn share key cho mọi người
Không khuyến nghị (sẽ hết quota nhanh). Có 2 cách:

**A. Mỗi user tự nhập key của họ** (mặc định, an toàn nhất)

**B. Server-side proxy** (nâng cao):
- Tạo Cloudflare Worker / Vercel Edge Function
- Lưu key trong env vars
- Sửa `chatbot.js` để gọi proxy URL thay vì Gemini trực tiếp

---

## 🛠 Troubleshooting

### Streamlit: "ModuleNotFoundError"
- Kiểm tra `requirements.txt` có `streamlit>=1.30.0`
- Force redeploy: Streamlit Cloud → app → ⋮ → **Reboot app**

### GitHub Pages: trang trắng
- Đảm bảo `index.html` ở root (không trong subfolder)
- Settings → Pages → check folder = `/ (root)`
- Chờ 5-10 phút sau push (CDN cache)

### Chatbot không phản hồi
- Mở DevTools (F12) → Console xem lỗi
- Check API key đúng format `AIzaSy...`
- Có thể đã hết quota free tier → đợi 1 phút

### Charts không render
- Cần internet (CDN Chart.js)
- Check Console F12 xem có lỗi CSP không

---

## 📊 So sánh 3 cách

| Tiêu chí          | GitHub Pages | Streamlit Cloud | Vercel/Netlify |
|-------------------|--------------|------------------|----------------|
| Setup time        | 5 phút       | 10 phút          | 5 phút         |
| Cost              | Free ∞       | Free 1GB RAM     | Free 100GB BW  |
| Custom domain     | ✓            | ✓                | ✓              |
| Python backend    | ✗            | ✓                | Edge functions |
| Auto sleep        | Never        | After 7 days     | Never          |
| Sidebar UI        | ✗            | ✓ (Streamlit)    | ✗              |
| CDN global        | ✓            | Single region    | ✓              |
| **Khuyến nghị**   | Demo nhanh   | **Toàn diện**    | Production     |

---

## 🎯 Khuyến nghị cuối cùng

**Cho đề tài cuối kỳ (giáo viên xem)**:
→ **Streamlit Cloud** — có sidebar đẹp + URL `*.streamlit.app` chuyên nghiệp.

**Cho portfolio (CV / LinkedIn)**:
→ **Vercel** — URL ngắn, load nhanh.

**Cho thử nhanh / không cần tài khoản**:
→ **GitHub Pages** — chỉ cần GitHub account.

Bạn có thể deploy **CẢ 3** cùng lúc (mỗi cách 1 URL khác nhau).
