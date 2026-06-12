// =============================================================
// AIDEOM-VN AI CHATBOT — Gemini 1.5 Flash Latest (God-Tier Edition)
// =============================================================
// Nâng cấp: Tự động bắt lỗi Quota (Hết lượt), Context-Aware, 
// MathJax Rendering, Cross-Page Memory.
// Sửa lỗi: Cập nhật endpoint API chuẩn xác gemini-1.5-flash-latest
// =============================================================

(function() {
  'use strict';

  // ----- 1. NHẬN THỨC NGỮ CẢNH TRANG HIỆN TẠI -----
  const currentPageTitle = document.title || "AIDEOM-VN Dashboard";
  const titleLower = currentPageTitle.toLowerCase();

  // ----- 2. SYSTEM PROMPT (PERSONA GIÁO SƯ AI - TÍCH HỢP ĐỀ CƯƠNG) -----
  const SYSTEM_PROMPT = `Bạn là Trợ giảng / Giáo sư AI tối cao cho môn học "Các mô hình ra quyết định phát triển kinh tế Việt Nam trong kỉ nguyên AI" (Hệ thống AIDEOM-VN).
Triết lý sư phạm của môn học: "Học bằng làm" (learning by doing). Sinh viên không chỉ giải toán hình thức mà phải biết diễn giải kết quả trong bối cảnh thể chế Việt Nam (NQ 57-NQ/TW, QĐ 749, QĐ 127, QĐ 411, COP26).

Bạn nắm rõ toàn bộ cấu trúc 12 bài tập gồm 4 cấp độ:
1. Cấp độ DỄ: Bài 1 (Cobb-Douglas mở rộng, Solow), Bài 2 (LP phân bổ 4 hạng mục), Bài 3 (LP Priority 10 ngành, chuẩn hóa Min-Max).
2. Cấp độ TRUNG BÌNH: Bài 4 (LP Không gian 6 vùng x 4 hạng mục, ràng buộc công bằng vùng miền), Bài 5 (MIP chọn 15 dự án, tiên quyết/loại trừ/bắt buộc), Bài 6 (TOPSIS 6 vùng, Entropy khách quan vs AHP chuyên gia).
3. Cấp độ KHÁ KHÓ: Bài 7 (NSGA-II 4 mục tiêu: GDP, Gini, CO2, Rủi ro an ninh mạng), Bài 8 (Dynamic Programming lộ trình 2026-2035, Bellman, Backward Induction), Bài 9 (Mô phỏng lao động, Convex Opt CVXPY tối ưu ngân sách Reskilling).
4. Cấp độ KHÓ: Bài 10 (Stochastic 2-stage, SAA, EVPI, VSS, Robust Minimax Regret), Bài 11 (Q-learning, SARSA, MDP 3 trạng thái điều tiết AI), Bài 12 (Đồ án tích hợp 6 Module, Master Dashboard Streamlit).

Bộ Dữ liệu bắt buộc sử dụng: vietnam_macro_2020_2025.csv, vietnam_sectors_2024.csv, vietnam_regions_2024.csv.
Tiêu chí chấm điểm (Rubric Phụ lục F2): Toán học (20%), Lập trình Python (20%), Dữ liệu thực (15%), Phân tích chính sách (20%), Trực quan hóa (15%), Báo cáo và thuyết trình (10%).

NGUYÊN TẮC TRẢ LỜI TỐI THƯỢNG:
1. NHẬN THỨC NGỮ CẢNH: Sinh viên đang xem trang "${currentPageTitle}". Hãy xoáy sâu vào các khái niệm của bài đó.
2. TOÁN HỌC & LẬP TRÌNH CHUẨN MỰC: Khi nhắc đến biến số, công thức, mô hình, BẮT BUỘC bọc trong thẻ LaTeX ($x_i$ cho inline, $$x$$ cho block). Hỗ trợ sinh viên debug code Python (numpy, scipy, pulp, cvxpy, pymoo, pyomo, gymnasium).
3. PHÂN TÍCH VĨ MÔ: Luôn liên hệ toán học với thực tiễn. Nhắc nhở sinh viên rằng tối ưu kinh tế không nhất thiết là tối ưu xã hội (vd: Shadow price có ý nghĩa gì? Tại sao cần giới hạn trần/sàn ngân sách?).
4. CÁCH TRÌNH BÀY: Dùng **in đậm** từ khóa cốt lõi. Súc tích (3-7 câu), giọng điệu học thuật, khắt khe nhưng tận tình chỉ dẫn. Khuyến khích tư duy phản biện.`;

  // ----- 3. STYLES (MONOCHROME / CHARCOAL THEME) -----
  const STYLES = `
    #aideom-chatbot-fab {
      position: fixed; bottom: 24px; right: 24px;
      width: 60px; height: 60px; border-radius: 50%;
      background: #0f172a;
      color: white; font-size: 24px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.4);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 9999;
      border: 2px solid #ffffff;
    }
    #aideom-chatbot-fab:hover {
      transform: translateY(-4px) scale(1.05); box-shadow: 0 8px 30px rgba(15, 23, 42, 0.5);
    }
    #aideom-chatbot-fab.open { background: #334155; transform: rotate(90deg); }

    #aideom-chatbot-panel {
      position: fixed; bottom: 100px; right: 24px;
      width: 400px; max-width: calc(100vw - 48px);
      height: 600px; max-height: calc(100vh - 140px);
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
      display: none; flex-direction: column;
      z-index: 9998;
      font-family: 'Inter', -apple-system, sans-serif;
      overflow: hidden;
    }
    #aideom-chatbot-panel.open { display: flex; animation: slideUp 0.3s ease-out; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .acb-header {
      padding: 16px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;
      display: flex; align-items: center; gap: 12px;
    }
    .acb-header .acb-avatar {
      width: 40px; height: 40px; border-radius: 10px;
      background: #0f172a; color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; font-weight: 800;
    }
    .acb-header .acb-info { flex: 1; }
    .acb-header .acb-name { font-size: 15px; font-weight: 800; color: #0f172a; }
    .acb-header .acb-status { font-size: 11px; color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 6px; margin-top: 2px; }
    .acb-header .acb-status::before { content: ''; width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px rgba(16, 185, 129, 0.6); }
    .acb-header .acb-settings {
      background: transparent; border: 1px solid #cbd5e1; color: #475569;
      cursor: pointer; padding: 6px 10px; border-radius: 6px; font-size: 14px; transition: all 0.2s;
    }
    .acb-header .acb-settings:hover { background: #e2e8f0; color: #0f172a; }

    .acb-messages {
      flex: 1; overflow-y: auto; padding: 20px 16px;
      display: flex; flex-direction: column; gap: 16px; background: #ffffff;
    }
    .acb-messages::-webkit-scrollbar { width: 6px; }
    .acb-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

    .acb-msg {
      padding: 12px 16px; border-radius: 12px; font-size: 13.5px; line-height: 1.6;
      max-width: 88%; word-wrap: break-word; animation: acb-fadein 0.3s ease-out;
      white-space: pre-wrap; 
    }
    .acb-msg strong { font-weight: 800; color: inherit; }
    .acb-msg pre { background: #f1f5f9; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; overflow-x: auto; margin: 8px 0; }
    .acb-msg code { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; }
    
    @keyframes acb-fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    
    .acb-msg.user { background: #0f172a; color: #ffffff; align-self: flex-end; border-bottom-right-radius: 4px; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.15); }
    .acb-msg.bot { background: #f8fafc; color: #334155; align-self: flex-start; border-bottom-left-radius: 4px; border: 1px solid #e2e8f0; }
    .acb-msg.system { background: #fffbeb; color: #b45309; align-self: center; border: 1px solid #fde68a; font-size: 12px; text-align: center; font-weight: 600; white-space: normal; }
    .acb-msg.error { background: #fef2f2; color: #ef4444; align-self: center; border: 1px solid #fecaca; font-size: 12px; font-weight: 600; white-space: normal; }

    .acb-typing {
      align-self: flex-start; background: #f8fafc; padding: 12px 18px; border-radius: 12px;
      display: none; border: 1px solid #e2e8f0; border-bottom-left-radius: 4px;
    }
    .acb-typing.show { display: inline-block; }
    .acb-typing span { width: 6px; height: 6px; border-radius: 50%; background: #64748b; display: inline-block; margin: 0 2px; animation: acb-bounce 1.2s infinite; }
    .acb-typing span:nth-child(2) { animation-delay: 0.2s; }
    .acb-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes acb-bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-4px); opacity: 1; } }

    .acb-suggestions { padding: 0 16px 12px; display: flex; flex-wrap: wrap; gap: 8px; background: #ffffff; }
    .acb-suggestions .acb-sug {
      background: #ffffff; border: 1px solid #cbd5e1; color: #475569; padding: 6px 12px;
      border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    }
    .acb-suggestions .acb-sug:hover { background: #f1f5f9; color: #0f172a; border-color: #94a3b8; transform: translateY(-1px); }

    .acb-input-area { padding: 16px; border-top: 1px solid #e2e8f0; display: flex; gap: 10px; background: #f8fafc; }
    .acb-input-area input {
      flex: 1; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px 14px;
      color: #0f172a; font-size: 14px; font-family: inherit; font-weight: 500; outline: none; transition: all 0.2s; box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
    }
    .acb-input-area input:focus { border-color: #0f172a; box-shadow: 0 0 0 2px rgba(15,23,42,0.1); }
    .acb-input-area input::placeholder { color: #94a3b8; font-weight: 400; }
    .acb-input-area button {
      background: #0f172a; color: white; border: none; cursor: pointer; padding: 0 20px; border-radius: 8px;
      font-size: 14px; font-weight: 700; transition: all 0.2s; box-shadow: 0 2px 4px rgba(15,23,42,0.1);
    }
    .acb-input-area button:hover { background: #334155; transform: translateY(-1px); box-shadow: 0 4px 8px rgba(15,23,42,0.2); }
    .acb-input-area button:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .acb-config {
      position: absolute; inset: 0; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px);
      padding: 30px 24px; display: none; flex-direction: column; gap: 16px; z-index: 10;
    }
    .acb-config.show { display: flex; }
    .acb-config h3 { color: #0f172a; font-size: 20px; font-weight: 900; margin: 0 0 4px; }
    .acb-config p { color: #475569; font-size: 13px; line-height: 1.6; margin: 0; font-weight: 500;}
    .acb-config a { color: #0f172a; font-weight: 800; text-decoration: underline; }
    .acb-config input { background: #ffffff; border: 2px solid #cbd5e1; border-radius: 8px; padding: 12px 14px; color: #0f172a; font-size: 14px; font-family: monospace; outline: none; }
    .acb-config input:focus { border-color: #0f172a; }
    .acb-config .acb-btn-row { display: flex; gap: 10px; margin-top: 10px; }
    .acb-config .acb-btn-row button { flex: 1; padding: 12px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s; }
    .acb-config .acb-btn-save { background: #0f172a; color: white; box-shadow: 0 4px 12px rgba(15,23,42,0.15); }
    .acb-config .acb-btn-save:hover { background: #334155; }
    .acb-config .acb-btn-cancel { background: #e2e8f0; color: #475569; }
    .acb-config .acb-btn-cancel:hover { background: #cbd5e1; color: #0f172a;}
    .acb-config .acb-btn-clear { background: #fef2f2; color: #ef4444; border: 1px solid #fecaca; margin-top: 12px;}
    .acb-config .acb-btn-clear:hover { background: #fecaca; color: #b91c1c; }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = STYLES;
  document.head.appendChild(styleEl);

  // ----- 4. TẠO HTML BỘ KHUNG -----
  const fab = document.createElement('button');
  fab.id = 'aideom-chatbot-fab';
  fab.innerHTML = '✨'; 
  fab.title = 'AIDEOM-VN AI Expert';
  document.body.appendChild(fab);

  // Gợi ý thông minh dựa trên Đề Cương F2/F3
  let dynamicSuggestions = `
    <button class="acb-sug" data-q="Hệ thống 12 bài tập AIDEOM-VN được chia thành 4 cấp độ nào?">Cấu trúc 4 cấp độ đồ án?</button>
    <button class="acb-sug" data-q="Tiêu chí chấm điểm (Rubric) của môn học này bao gồm những phần nào?">Tiêu chí chấm điểm (Rubric)</button>
  `;
  if (titleLower.includes('bài 1') || titleLower.includes('cobb')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="Theo đề bài, các biến $D_t$, $AI_t$, $H_t$ trong phương trình Cobb-Douglas đại diện cho điều gì?">Các biến trong Cobb-Douglas</button>`;
  } else if (titleLower.includes('bài 2') || titleLower.includes('bài 3')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="Theo đề bài, shadow price của ràng buộc ngân sách có ý nghĩa gì trong thực tiễn?">Ý nghĩa Shadow Price</button>`;
  } else if (titleLower.includes('bài 4')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="Tại sao ràng buộc công bằng vùng miền (C5) lại quan trọng theo Nghị quyết 13-NQ/TW?">Ý nghĩa công bằng vùng miền</button>`;
  } else if (titleLower.includes('bài 5')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="Trong MIP chọn dự án, hiệu ứng cộng hưởng giữa AI (P8) và Bán dẫn (P13) được mô hình hóa thế nào?">Hiệu ứng cộng hưởng AI & Bán dẫn</button>`;
  } else if (titleLower.includes('bài 6') || titleLower.includes('topsis')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="So sánh sự khác biệt khi dùng trọng số Entropy khách quan và AHP chuyên gia trong đánh giá vùng.">Entropy vs AHP (Bài 6)</button>`;
  } else if (titleLower.includes('bài 7') || titleLower.includes('nsga')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="Tại sao NSGA-II không trả về 1 nghiệm duy nhất mà trả về tập Pareto? Điều này có thay thế quyết định chính trị không?">Vai trò của NSGA-II</button>`;
  } else if (titleLower.includes('bài 8') || titleLower.includes('dynamic')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="Mô hình Dynamic Programming trong bài 8 đề xuất chiến lược Front-loaded hay Back-loaded? Giải thích lý do.">Front-loaded vs Back-loaded (Bài 8)</button>`;
  } else if (titleLower.includes('bài 9') || titleLower.includes('labor')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="Theo bài 9, ngành Nông nghiệp có nên đầu tư trực tiếp vào AI không khi nguy cơ mất việc lớn?">Chiến lược cho Nông nghiệp (Bài 9)</button>`;
  } else if (titleLower.includes('bài 10') || titleLower.includes('stochastic')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="Chỉ số EVPI và VSS trong bài 10 mang ý nghĩa gì đối với tư duy hoạch định chính sách dưới bất định?">Ý nghĩa EVPI & VSS (Bài 10)</button>`;
  } else if (titleLower.includes('bài 11') || titleLower.includes('q-learning')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="So sánh tính chất của Q-learning (Off-policy) và SARSA (On-policy) trong bài 11.">Q-learning vs SARSA (Bài 11)</button>`;
  } else if (titleLower.includes('bài 12') || titleLower.includes('dashboard')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="Liệt kê 6 module chức năng (M1 đến M6) trong hệ thống AIDEOM-VN tổng hợp.">Cấu trúc 6 Module (Bài 12)</button>`;
  }

  const panel = document.createElement('div');
  panel.id = 'aideom-chatbot-panel';
  panel.innerHTML = `
    <div class="acb-header">
      <div class="acb-avatar">AI</div>
      <div class="acb-info">
        <div class="acb-name">Giáo sư AIDEOM-VN</div>
        <div class="acb-status">Online · Gemini 1.5 Flash Enhanced</div>
      </div>
      <button class="acb-settings" title="Cài đặt hệ thống">⚙ Cấu hình</button>
    </div>

    <div class="acb-messages" id="acb-messages"></div>

    <div class="acb-suggestions">${dynamicSuggestions}</div>

    <div class="acb-input-area">
      <input type="text" id="acb-input" placeholder="Hỏi giáo sư điều gì đó về bài này..." autocomplete="off">
      <button id="acb-send">Gửi</button>
    </div>

    <div class="acb-config" id="acb-config">
      <h3>🔑 Quản lý Hệ thống AI</h3>
      <p>Để đánh thức trí tuệ của AI, hãy cung cấp mã API Key miễn phí từ Google Studio:</p>
      <p>1. Truy cập <a href="https://aistudio.google.com/apikey" target="_blank">aistudio.google.com</a><br>
      2. Tạo Key mới và dán vào ô bên dưới.</p>
      <input type="password" id="acb-apikey" placeholder="AIzaSy..." autocomplete="off">
      <div class="acb-btn-row">
        <button class="acb-btn-cancel" id="acb-cfg-cancel">Đóng</button>
        <button class="acb-btn-save" id="acb-cfg-save">Kích hoạt AI</button>
      </div>
      <button class="acb-btn-clear" id="acb-cfg-clear">🗑 Xóa toàn bộ Lịch sử Trò chuyện</button>
      <p style="font-size:11px;color:#94a3b8;margin-top:auto;text-align:center">
        *Mã khóa & lịch sử chỉ lưu trên trình duyệt của bạn (Session Storage).
      </p>
    </div>
  `;
  document.body.appendChild(panel);

  // ----- STATE & MEMORY (SESSION STORAGE) -----
  const messages = document.getElementById('acb-messages');
  const input = document.getElementById('acb-input');
  const sendBtn = document.getElementById('acb-send');
  const config = document.getElementById('acb-config');
  const apikeyInput = document.getElementById('acb-apikey');
  
  let chatHistory = JSON.parse(sessionStorage.getItem('acb_history')) || [];

  const STORAGE_KEY = 'aideom_gemini_apikey';
  function getApiKey() { return localStorage.getItem(STORAGE_KEY) || ''; }
  function setApiKey(k) { localStorage.setItem(STORAGE_KEY, k); }
  function saveHistory() { sessionStorage.setItem('acb_history', JSON.stringify(chatHistory)); }

  // Cấu trúc lại markdown nhẹ nhàng để MathJax hoạt động
  function formatMarkdown(text) {
    let html = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    return html;
  }

  function renderMath(element) {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([element]).catch(err => console.log('MathJax error', err));
    }
  }

  function addMsg(type, text, saveToHistory = true) {
    const div = document.createElement('div');
    div.className = `acb-msg ${type}`;
    if (type === 'bot') {
        div.innerHTML = formatMarkdown(text);
        renderMath(div);
    } else {
        div.textContent = text;
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    
    if (saveToHistory && (type === 'user' || type === 'bot')) {
        chatHistory.push({
            role: type === 'user' ? 'user' : 'model',
            parts: [{ text: text }]
        });
        saveHistory();
    }
    return div;
  }

  // Khôi phục UI Chat
  if (chatHistory.length === 0) {
    const welcome = `Chào bạn! Tôi là Giáo sư AI của hệ thống. Tôi nhận thấy bạn đang xem **${currentPageTitle}**.\n\nTrong bài tập này, chúng ta không chỉ giải bài toán tối ưu mà còn phải phân tích kết quả dựa trên các chiến lược quốc gia (như QĐ 127/QĐ-TTg, NQ 57-NQ/TW). Bạn cần tôi hỗ trợ phần nào?`;
    addMsg('bot', welcome, false);
  } else {
    chatHistory.forEach(h => {
        const div = document.createElement('div');
        div.className = `acb-msg ${h.role === 'user' ? 'user' : 'bot'}`;
        if (h.role === 'user') {
            div.textContent = h.parts[0].text;
        } else {
            div.innerHTML = formatMarkdown(h.parts[0].text);
        }
        messages.appendChild(div);
    });
    messages.scrollTop = messages.scrollHeight;
    setTimeout(() => { if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise([messages]); }, 300);
  }

  // ----- EVENT LISTENERS -----
  fab.addEventListener('click', () => {
    panel.classList.toggle('open');
    fab.classList.toggle('open');
    if (panel.classList.contains('open') && !getApiKey()) config.classList.add('show');
    else if (panel.classList.contains('open')) input.focus();
  });

  panel.querySelector('.acb-settings').addEventListener('click', () => {
    config.classList.add('show');
    apikeyInput.value = getApiKey();
  });
  document.getElementById('acb-cfg-cancel').addEventListener('click', () => config.classList.remove('show'));
  document.getElementById('acb-cfg-save').addEventListener('click', () => {
    const k = apikeyInput.value.trim();
    if (!k) { alert('Vui lòng nhập API key hợp lệ.'); return; }
    setApiKey(k); config.classList.remove('show');
    addMsg('system', '✓ Đã kích hoạt hệ thống AI thành công. Sẵn sàng nhận câu hỏi!', false);
  });
  
  // Xóa bộ nhớ
  document.getElementById('acb-cfg-clear').addEventListener('click', () => {
    sessionStorage.removeItem('acb_history');
    chatHistory = [];
    messages.innerHTML = ''; 
    addMsg('bot', `Lịch sử liên trang đã được xóa sạch. Tôi đã sẵn sàng phân tích **${currentPageTitle}** cùng bạn!`, false);
    config.classList.remove('show');
  });

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'acb-typing show'; div.id = 'acb-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(div); messages.scrollTop = messages.scrollHeight;
  }
  function hideTyping() { const el = document.getElementById('acb-typing'); if (el) el.remove(); }

  async function send() {
    const text = input.value.trim();
    if (!text) return;
    const apiKey = getApiKey();
    if (!apiKey) { config.classList.add('show'); return; }

    addMsg('user', text, true);
    input.value = ''; sendBtn.disabled = true;
    showTyping();

    try {
      // SỬ DỤNG GEMINI 1.5 FLASH LATEST VÀ ENDPOINT CHUẨN
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
      
      const body = {
        contents: chatHistory.slice(-20), // Trí nhớ lên tới 20 lượt hội thoại gần nhất
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: { temperature: 0.3, maxOutputTokens: 1024, topK: 40 } 
      };

      const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await resp.json();

      hideTyping();
      
      // BỘ LỌC LỖI THÔNG MINH
      if (data.error) {
        let errorMsg = data.error.message || 'Không rõ nguyên nhân';
        
        // Bắt lỗi Hết Quota (429 Too Many Requests hoặc Quota Exceeded)
        if (errorMsg.toLowerCase().includes('quota') || errorMsg.toLowerCase().includes('exceeded') || errorMsg.toLowerCase().includes('429')) {
            errorMsg = 'API Key của bạn đã đạt giới hạn sử dụng miễn phí (Hết Quota) hoặc hệ thống đang xử lý quá nhiều yêu cầu. Vui lòng đợi một vài phút rồi thử lại, hoặc kiểm tra lại gói cước tại Google AI Studio nhé!';
        } else if (errorMsg.toLowerCase().includes('not found')) {
            errorMsg = 'Phiên bản AI này hiện không khả dụng trong vùng hoặc dự án API Key của bạn. Vui lòng kiểm tra lại Google AI Studio.';
        }
        
        addMsg('error', '❌ Lỗi: ' + errorMsg, false);
        chatHistory.pop(); saveHistory(); 
      } else {
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '(Phản hồi trống)';
        addMsg('bot', reply, true);
      }
    } catch (e) {
      hideTyping();
      addMsg('error', '❌ Lỗi kết nối mạng: Không thể kết nối tới máy chủ Google Gemini. Vui lòng kiểm tra lại kết nối.', false);
      chatHistory.pop(); saveHistory();
    } finally {
      sendBtn.disabled = false; input.focus();
    }
  }

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });

  panel.querySelectorAll('.acb-sug').forEach(btn => {
    btn.addEventListener('click', () => { input.value = btn.dataset.q; send(); });
  });

})();
