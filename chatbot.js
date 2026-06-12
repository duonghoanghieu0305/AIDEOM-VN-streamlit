// =============================================================
// AIDEOM-VN AI CHATBOT — Gemini 2.0 Flash (God-Tier Edition)
// =============================================================
// Nâng cấp: Context-Aware, MathJax Rendering, Cross-Page Memory
// =============================================================

(function() {
  'use strict';

  // ----- 1. NHẬN THỨC NGỮ CẢNH TRANG HIỆN TẠI -----
  const currentPageTitle = document.title || "AIDEOM-VN Dashboard";
  const titleLower = currentPageTitle.toLowerCase();

  // ----- 2. SYSTEM PROMPT (PERSONA GIÁO SƯ AI) -----
  const SYSTEM_PROMPT = `Bạn là Giáo sư AI của hệ thống AIDEOM-VN (AI Decision Optimization Model for Vietnam).
Bạn là một chuyên gia xuất sắc về Kinh tế lượng, Tối ưu hóa Toán học (Operations Research), Học máy và Chính sách Vĩ mô.

Hệ thống gồm 12 bài (Từ Cobb-Douglas, LP, MIP, TOPSIS, NSGA-II, DP, Stochastic đến Q-Learning).

NGUYÊN TẮC TRẢ LỜI TỐI THƯỢNG:
1. NHẬN THỨC NGỮ CẢNH: Sinh viên đang xem trang "${currentPageTitle}". Hãy liên kết câu trả lời với bối cảnh của bài học này nếu có thể.
2. TOÁN HỌC CHUẨN MỰC: Khi nhắc đến biến số, công thức, mô hình, BẮT BUỘC bọc trong thẻ LaTeX. Dùng dấu $ cho công thức nội dòng (ví dụ: $x_i$) và $$ cho khối công thức độc lập. 
3. TRÌNH BÀY HIỆN ĐẠI: Dùng **in đậm** cho từ khóa trọng tâm.
4. TÍNH THỰC TẾ: Nhắc đến các chính sách VN (QĐ 127, NQ 57, COP26) khi phân tích rủi ro/lợi ích.
5. SÚC TÍCH: Giải thích cặn kẽ nhưng không viết quá dài lan man. Nhắm thẳng vào bản chất Toán học và Kinh tế.`;

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
      white-space: pre-wrap; /* Kích hoạt định dạng xuống dòng chuẩn */
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

  // Gợi ý thông minh theo trang
  let dynamicSuggestions = `
    <button class="acb-sug" data-q="AIDEOM-VN là hệ thống gì?">AIDEOM-VN là gì?</button>
    <button class="acb-sug" data-q="Hãy tóm tắt phương pháp toán học được dùng ở bài này.">Tóm tắt thuật toán bài này</button>
  `;
  if (titleLower.includes('bài 1') || titleLower.includes('cobb')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="Hệ số TFP đóng vai trò gì trong mô hình Cobb-Douglas mở rộng?">Ý nghĩa TFP?</button>`;
  } else if (titleLower.includes('bài 2') || titleLower.includes('bài 3') || titleLower.includes('bài 4')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="Shadow Price (Giá bóng) trong quy hoạch tuyến tính mang ý nghĩa kinh tế gì?">Phân tích Giá bóng</button>`;
  } else if (titleLower.includes('bài 5')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="Sự khác biệt giữa MIP (Quy hoạch nguyên hỗn hợp) và LP thông thường là gì?">MIP vs LP?</button>`;
  } else if (titleLower.includes('bài 6') || titleLower.includes('topsis')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="So sánh sự khác biệt khi dùng trọng số Entropy khách quan và AHP chuyên gia trong TOPSIS.">Entropy vs AHP?</button>`;
  } else if (titleLower.includes('bài 7') || titleLower.includes('nsga')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="Tại sao lại dùng NSGA-II để tìm tập Pareto thay vì cộng gộp các mục tiêu (Weighted Sum)?">Lợi ích của NSGA-II?</button>`;
  } else if (titleLower.includes('bài 8') || titleLower.includes('dynamic')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="Giải thích phương trình tối ưu Bellman và ứng dụng Backward Induction trong lộ trình đầu tư.">Phương trình Bellman?</button>`;
  } else if (titleLower.includes('bài 10') || titleLower.includes('stochastic')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="EVPI (Giá trị thông tin hoàn hảo) và VSS (Giá trị giải pháp ngẫu nhiên) mang ý nghĩa gì?">Phân tích EVPI & VSS</button>`;
  } else if (titleLower.includes('bài 11') || titleLower.includes('q-learning')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="Tại sao Q-learning có thể hội tụ và tìm được chính sách tối ưu mà không cần biết Model (Model-free)?">Q-learning Model-free?</button>`;
  }

  const panel = document.createElement('div');
  panel.id = 'aideom-chatbot-panel';
  panel.innerHTML = `
    <div class="acb-header">
      <div class="acb-avatar">AI</div>
      <div class="acb-info">
        <div class="acb-name">Giáo sư AIDEOM-VN</div>
        <div class="acb-status">Online · Gemini 2.0 Flash Enhanced</div>
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
    const welcome = `Chào bạn! Tôi là Giáo sư AI của hệ thống. Tôi nhận thấy bạn đang xem **${currentPageTitle}**.\n\nBạn cần tôi phân tích công thức, giải thích code hay thảo luận về chính sách vĩ mô của phần này?`;
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
    addMsg('system', '✓ Đã kích hoạt hệ thống AI thành công.', false);
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
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const body = {
        contents: chatHistory.slice(-20), // Trí nhớ lên tới 20 lượt hội thoại gần nhất
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: { temperature: 0.3, maxOutputTokens: 1024, topK: 40 } // IQ cao, không bịa đặt, suy luận logic toán học tốt
      };

      const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await resp.json();

      hideTyping();
      if (data.error) {
        addMsg('error', '❌ Lỗi hệ thống: ' + (data.error.message || 'Không rõ nguyên nhân'), false);
        chatHistory.pop(); saveHistory();
      } else {
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '(Phản hồi trống)';
        addMsg('bot', reply, true);
      }
    } catch (e) {
      hideTyping();
      addMsg('error', '❌ Mất kết nối API: ' + e.message, false);
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
