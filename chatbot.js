// =============================================================
// AIDEOM-VN AI CHATBOT — Gemini Flash (free tier)
// =============================================================
// Floating widget xuất hiện trên mọi trang.
// User config Gemini API key 1 lần (lưu localStorage).
// Trả lời câu hỏi về 12 bài của AIDEOM-VN.
// =============================================================

(function() {
  'use strict';

  // ----- SYSTEM PROMPT -----
  const SYSTEM_PROMPT = `Bạn là trợ lý AI của AIDEOM-VN (AI Decision Optimization Model for Vietnam) —
một bộ đề tài cuối kì môn "Các mô hình ra quyết định" cho ngành kinh tế Việt Nam.

Bộ đề gồm 12 bài:
- Bài 1: Cobb-Douglas mở rộng (kinh tế vĩ mô với AI)
- Bài 2: LP phân bổ ngân sách
- Bài 3: LP priority 10 ngành
- Bài 4: LP ngành-vùng (6×4 matrix)
- Bài 5: MIP chọn 15 dự án AI
- Bài 6: TOPSIS xếp hạng 6 vùng
- Bài 7: NSGA-II multi-objective optimization
- Bài 8: Dynamic Programming lộ trình đầu tư
- Bài 9: AI Labor Impact + reskilling
- Bài 10: Stochastic 2-stage + Robust
- Bài 11: Q-learning Reinforcement Learning
- Bài 12: Integration AIDEOM-VN (tích hợp 6 module)

Trả lời ngắn gọn (3-6 câu), bằng tiếng Việt, giọng học thuật thân thiện.
Khi user hỏi về 1 bài cụ thể, trả lời chính xác nội dung bài đó.
Nếu không biết, nói rõ "tôi không chắc, bạn có thể xem trực tiếp trang bài Xn".`;

  // ----- STYLES -----
  const STYLES = `
    #aideom-chatbot-fab {
      position: fixed; bottom: 24px; right: 24px;
      width: 60px; height: 60px; border-radius: 50%;
      background: linear-gradient(135deg, #a855f7, #ec4899);
      color: white; font-size: 28px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; box-shadow: 0 8px 30px rgba(168, 85, 247, 0.5);
      transition: all 0.3s; z-index: 9999;
      border: none;
    }
    #aideom-chatbot-fab:hover {
      transform: scale(1.1); box-shadow: 0 12px 40px rgba(168, 85, 247, 0.7);
    }
    #aideom-chatbot-fab.open { background: #ef4444; }

    #aideom-chatbot-panel {
      position: fixed; bottom: 100px; right: 24px;
      width: 380px; max-width: calc(100vw - 48px);
      height: 540px; max-height: calc(100vh - 140px);
      background: rgba(15, 23, 42, 0.98);
      border: 1px solid #a855f7;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      display: none; flex-direction: column;
      z-index: 9998;
      font-family: 'Inter', -apple-system, sans-serif;
      backdrop-filter: blur(20px);
    }
    #aideom-chatbot-panel.open { display: flex; }

    .acb-header {
      padding: 14px 16px;
      background: linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.1));
      border-bottom: 1px solid rgba(168, 85, 247, 0.3);
      border-radius: 16px 16px 0 0;
      display: flex; align-items: center; gap: 10px;
    }
    .acb-header .acb-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, #06b6d4, #a855f7);
      display: flex; align-items: center; justify-content: center;
      font-size: 18px;
    }
    .acb-header .acb-info {
      flex: 1;
    }
    .acb-header .acb-name {
      font-size: 14px; font-weight: 700; color: #f8fafc;
    }
    .acb-header .acb-status {
      font-size: 11px; color: #10b981;
      display: flex; align-items: center; gap: 5px;
    }
    .acb-header .acb-status::before {
      content: ''; width: 7px; height: 7px;
      background: #10b981; border-radius: 50%;
      animation: acb-pulse 2s infinite;
    }
    @keyframes acb-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; }}
    .acb-header .acb-settings {
      background: rgba(255,255,255,0.1); border: none;
      color: #94a3b8; cursor: pointer; padding: 6px;
      border-radius: 6px; font-size: 14px;
    }
    .acb-header .acb-settings:hover { background: rgba(255,255,255,0.2); color: white; }

    .acb-messages {
      flex: 1; overflow-y: auto; padding: 14px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .acb-messages::-webkit-scrollbar { width: 5px; }
    .acb-messages::-webkit-scrollbar-thumb {
      background: rgba(168, 85, 247, 0.4); border-radius: 3px;
    }

    .acb-msg {
      padding: 10px 14px; border-radius: 12px;
      font-size: 13px; line-height: 1.55;
      max-width: 88%; word-wrap: break-word;
      animation: acb-fadein 0.3s ease-out;
    }
    @keyframes acb-fadein {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .acb-msg.user {
      background: linear-gradient(135deg, #a855f7, #ec4899);
      color: white; align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .acb-msg.bot {
      background: rgba(30, 41, 59, 0.8);
      color: #e2e8f0; align-self: flex-start;
      border-bottom-left-radius: 4px;
      border: 1px solid rgba(168, 85, 247, 0.2);
    }
    .acb-msg.system {
      background: rgba(234, 179, 8, 0.1);
      color: #eab308; align-self: center;
      border: 1px solid rgba(234, 179, 8, 0.3);
      font-size: 12px; text-align: center;
    }
    .acb-msg.error {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444; align-self: center;
      border: 1px solid rgba(239, 68, 68, 0.3);
      font-size: 12px;
    }

    .acb-typing {
      align-self: flex-start;
      background: rgba(30, 41, 59, 0.8);
      padding: 12px 18px; border-radius: 12px;
      display: none;
      border: 1px solid rgba(168, 85, 247, 0.2);
    }
    .acb-typing.show { display: inline-block; }
    .acb-typing span {
      width: 7px; height: 7px; border-radius: 50%;
      background: #a855f7; display: inline-block;
      margin: 0 2px; animation: acb-bounce 1.2s infinite;
    }
    .acb-typing span:nth-child(2) { animation-delay: 0.2s; }
    .acb-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes acb-bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30% { transform: translateY(-6px); opacity: 1; }
    }

    .acb-suggestions {
      padding: 0 14px 8px;
      display: flex; flex-wrap: wrap; gap: 6px;
    }
    .acb-suggestions .acb-sug {
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.3);
      color: #06b6d4;
      padding: 5px 11px; border-radius: 14px;
      font-size: 11px; cursor: pointer;
      transition: all 0.2s;
    }
    .acb-suggestions .acb-sug:hover {
      background: rgba(6, 182, 212, 0.25);
      transform: translateY(-1px);
    }

    .acb-input-area {
      padding: 12px 14px;
      border-top: 1px solid rgba(168, 85, 247, 0.2);
      display: flex; gap: 8px;
    }
    .acb-input-area input {
      flex: 1; background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(168, 85, 247, 0.3);
      border-radius: 10px; padding: 10px 14px;
      color: #e2e8f0; font-size: 13px;
      font-family: inherit;
      outline: none; transition: all 0.2s;
    }
    .acb-input-area input:focus {
      border-color: #a855f7;
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
    }
    .acb-input-area button {
      background: linear-gradient(135deg, #a855f7, #ec4899);
      color: white; border: none; cursor: pointer;
      padding: 10px 16px; border-radius: 10px;
      font-size: 14px; font-weight: 700;
      transition: transform 0.2s;
    }
    .acb-input-area button:hover { transform: scale(1.05); }
    .acb-input-area button:disabled { opacity: 0.5; cursor: not-allowed; }

    .acb-config {
      position: absolute; inset: 0;
      background: rgba(15, 23, 42, 0.98);
      border-radius: 16px;
      padding: 24px; display: none;
      flex-direction: column; gap: 14px;
      z-index: 10;
    }
    .acb-config.show { display: flex; }
    .acb-config h3 { color: #f8fafc; font-size: 18px; margin: 0 0 8px; }
    .acb-config p { color: #94a3b8; font-size: 12px; line-height: 1.6; margin: 0; }
    .acb-config a { color: #06b6d4; text-decoration: none; }
    .acb-config a:hover { text-decoration: underline; }
    .acb-config input {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(168, 85, 247, 0.3);
      border-radius: 8px; padding: 10px 14px;
      color: #e2e8f0; font-size: 13px;
      font-family: inherit; outline: none;
    }
    .acb-config input:focus {
      border-color: #a855f7;
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
    }
    .acb-config .acb-btn-row { display: flex; gap: 8px; margin-top: 8px; }
    .acb-config .acb-btn-row button {
      flex: 1; padding: 10px; border-radius: 8px;
      font-size: 13px; font-weight: 700; cursor: pointer;
      border: none; transition: transform 0.2s;
    }
    .acb-config .acb-btn-save {
      background: linear-gradient(135deg, #a855f7, #ec4899); color: white;
    }
    .acb-config .acb-btn-cancel {
      background: rgba(148, 163, 184, 0.2); color: #94a3b8;
    }
  `;

  // ----- INSERT STYLES -----
  const styleEl = document.createElement('style');
  styleEl.textContent = STYLES;
  document.head.appendChild(styleEl);

  // ----- HTML -----
  const fab = document.createElement('button');
  fab.id = 'aideom-chatbot-fab';
  fab.innerHTML = '💬';
  fab.title = 'Hỏi AI về AIDEOM-VN';
  document.body.appendChild(fab);

  const panel = document.createElement('div');
  panel.id = 'aideom-chatbot-panel';
  panel.innerHTML = `
    <div class="acb-header">
      <div class="acb-avatar">🤖</div>
      <div class="acb-info">
        <div class="acb-name">AIDEOM AI Assistant</div>
        <div class="acb-status">Online · Gemini Flash</div>
      </div>
      <button class="acb-settings" title="Cài đặt">⚙</button>
    </div>

    <div class="acb-messages" id="acb-messages">
      <div class="acb-msg bot">
        Xin chào! Tôi là trợ lý AI của AIDEOM-VN.
        Hỏi tôi bất cứ điều gì về 12 bài đề tài cuối kỳ — từ Cobb-Douglas, LP, TOPSIS đến Q-learning.
      </div>
    </div>

    <div class="acb-suggestions">
      <button class="acb-sug" data-q="Bài 1 nói về cái gì?">Bài 1 là gì?</button>
      <button class="acb-sug" data-q="So sánh LP và MIP">LP vs MIP?</button>
      <button class="acb-sug" data-q="EVPI là gì?">EVPI là gì?</button>
      <button class="acb-sug" data-q="Tại sao dùng NSGA-II thay vì Weighted Sum?">NSGA-II tốt hơn?</button>
    </div>

    <div class="acb-input-area">
      <input type="text" id="acb-input" placeholder="Hỏi điều gì đó..." maxlength="500">
      <button id="acb-send">Gửi</button>
    </div>

    <div class="acb-config" id="acb-config">
      <h3>🔑 Cài đặt Gemini API</h3>
      <p>Để dùng chatbot, bạn cần API key MIỄN PHÍ từ Google AI Studio:</p>
      <p style="color:#06b6d4">1. Truy cập <a href="https://aistudio.google.com/apikey" target="_blank">aistudio.google.com/apikey</a><br>
      2. Click "Create API key"<br>
      3. Copy key và paste vào ô bên dưới</p>
      <input type="password" id="acb-apikey" placeholder="AIzaSy..." autocomplete="off">
      <div class="acb-btn-row">
        <button class="acb-btn-cancel" id="acb-cfg-cancel">Hủy</button>
        <button class="acb-btn-save" id="acb-cfg-save">Lưu</button>
      </div>
      <p style="font-size:11px;color:#64748b;margin-top:8px">
        🔒 Key được lưu trong localStorage trên trình duyệt của bạn, KHÔNG gửi đi đâu khác.
        Free tier: 15 requests/phút · 1500 requests/ngày.
      </p>
    </div>
  `;
  document.body.appendChild(panel);

  // ----- STATE -----
  const messages = document.getElementById('acb-messages');
  const input = document.getElementById('acb-input');
  const sendBtn = document.getElementById('acb-send');
  const config = document.getElementById('acb-config');
  const apikeyInput = document.getElementById('acb-apikey');
  let history = [];

  const STORAGE_KEY = 'aideom_gemini_apikey';
  function getApiKey() { return localStorage.getItem(STORAGE_KEY) || ''; }
  function setApiKey(k) { localStorage.setItem(STORAGE_KEY, k); }

  // ----- TOGGLE -----
  fab.addEventListener('click', () => {
    panel.classList.toggle('open');
    fab.classList.toggle('open');
    fab.innerHTML = fab.classList.contains('open') ? '✕' : '💬';
    if (panel.classList.contains('open') && !getApiKey()) {
      config.classList.add('show');
    }
  });

  // ----- CONFIG -----
  panel.querySelector('.acb-settings').addEventListener('click', () => {
    config.classList.add('show');
    apikeyInput.value = getApiKey();
  });
  document.getElementById('acb-cfg-cancel').addEventListener('click', () => {
    config.classList.remove('show');
  });
  document.getElementById('acb-cfg-save').addEventListener('click', () => {
    const k = apikeyInput.value.trim();
    if (!k) { alert('Vui lòng nhập API key'); return; }
    setApiKey(k);
    config.classList.remove('show');
    addMsg('system', '✓ Đã lưu API key. Sẵn sàng chat!');
  });

  // ----- SEND -----
  function addMsg(type, text) {
    const div = document.createElement('div');
    div.className = `acb-msg ${type}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'acb-typing show';
    div.id = 'acb-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
  function hideTyping() {
    const el = document.getElementById('acb-typing');
    if (el) el.remove();
  }

  async function send() {
    const text = input.value.trim();
    if (!text) return;
    const apiKey = getApiKey();
    if (!apiKey) {
      config.classList.add('show');
      return;
    }

    addMsg('user', text);
    input.value = '';
    sendBtn.disabled = true;
    showTyping();

    history.push({ role: 'user', parts: [{ text }] });

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const body = {
        contents: history.slice(-10),  // Keep last 10 exchanges
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: { temperature: 0.7, maxOutputTokens: 400 }
      };

      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await resp.json();

      hideTyping();

      if (data.error) {
        addMsg('error', '❌ Lỗi: ' + (data.error.message || 'Không rõ'));
        history.pop();
      } else {
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '(không có phản hồi)';
        addMsg('bot', reply);
        history.push({ role: 'model', parts: [{ text: reply }] });
      }
    } catch (e) {
      hideTyping();
      addMsg('error', '❌ Không kết nối được tới Gemini: ' + e.message);
      history.pop();
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') send();
  });

  // ----- SUGGESTIONS -----
  panel.querySelectorAll('.acb-sug').forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.dataset.q;
      send();
    });
  });

})();
