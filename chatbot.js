// =============================================================
// AIDEOM-VN AI CHATBOT — Gemini Flash (Enhanced Intelligence)
// =============================================================
// Floating widget xuất hiện trên mọi trang.
// User config Gemini API key 1 lần (lưu localStorage).
// Trí thông minh được nâng cấp tối đa với Prompt chuyên sâu
// =============================================================

(function() {
  'use strict';

  // ----- SYSTEM PROMPT (UPGRADED INTELLIGENCE) -----
  const SYSTEM_PROMPT = `Bạn là AIDEOM-VN Assistant, một chuyên gia AI cấp cao về Kinh tế lượng, Tối ưu hóa (Operations Research) và Trí tuệ nhân tạo ứng dụng.
Nhiệm vụ của bạn là hỗ trợ sinh viên và các nhà hoạch định chính sách hiểu rõ hệ thống 12 bài toán của đồ án:
- Bài 1: Cobb-Douglas mở rộng, Solow Growth Accounting (Hạch toán tăng trưởng GDP với AI).
- Bài 2 & 3: Quy hoạch tuyến tính (Linear Programming) phân bổ ngân sách, Phân tích giá bóng (Shadow price), Bài toán đối ngẫu, Trọng số ưu tiên tích hợp.
- Bài 4: LP phân bổ Không gian Ngành-Vùng (6x4), Ràng buộc công bằng vùng miền (Fairness constraint) để tránh khoảng cách số.
- Bài 5: Quy hoạch nguyên hỗn hợp nhị phân (Binary MIP) chọn danh mục 15 dự án, ràng buộc tiên quyết/loại trừ/bắt buộc.
- Bài 6: TOPSIS đa tiêu chí 6 vùng, so sánh trọng số Entropy khách quan vs AHP chuyên gia.
- Bài 7: NSGA-II Tối ưu đa mục tiêu (GDP, Gini, CO2, Rủi ro an ninh), đường biên Pareto.
- Bài 8: Quy hoạch động (Dynamic Programming), Phương trình Bellman, Backward Induction, lộ trình đầu tư AI.
- Bài 9: Tối ưu lồi (Convex Optimization) với CVXPY, phân bổ ngân sách Reskilling cho lao động theo độ tuổi.
- Bài 10: Quy hoạch ngẫu nhiên 2 giai đoạn (Stochastic 2-stage), EVPI, VSS, Robust Minimax Regret ứng phó bất định.
- Bài 11: Học tăng cường (Q-learning), chính sách epsilon-greedy, so sánh SARSA.
- Bài 12: Master Dashboard tích hợp toàn bộ 6 Module.

NGUYÊN TẮC TRẢ LỜI (BẮT BUỘC):
1. Cực kỳ am hiểu toán học, giải thích logic nguyên nhân - kết quả rõ ràng, chuyên sâu nhưng mạch lạc.
2. Dựa trên dữ liệu và bối cảnh Việt Nam (ví dụ: QĐ 127/QĐ-TTg, NQ 57-NQ/TW, mục tiêu NetZero, kinh tế số).
3. Sử dụng định dạng Markdown: Dùng dấu **in đậm** cho các từ khóa cốt lõi, gạch đầu dòng để liệt kê.
4. Trả lời súc tích (3-7 câu) và đi thẳng vào vấn đề trừ khi được yêu cầu phân tích sâu.
5. Nếu được hỏi về công thức toán, hãy giải thích rõ ý nghĩa kinh tế của các biến số.`;

  // ----- STYLES (UPGRADED TO CHARCOAL / MONOCHROME THEME) -----
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
      width: 380px; max-width: calc(100vw - 48px);
      height: 560px; max-height: calc(100vh - 140px);
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
      padding: 16px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
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
    .acb-header .acb-status::before {
      content: ''; width: 8px; height: 8px;
      background: #10b981; border-radius: 50%;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
    }
    .acb-header .acb-settings {
      background: transparent; border: 1px solid #cbd5e1;
      color: #475569; cursor: pointer; padding: 6px 10px;
      border-radius: 6px; font-size: 14px; transition: all 0.2s;
    }
    .acb-header .acb-settings:hover { background: #e2e8f0; color: #0f172a; }

    .acb-messages {
      flex: 1; overflow-y: auto; padding: 20px 16px;
      display: flex; flex-direction: column; gap: 16px;
      background: #ffffff;
    }
    .acb-messages::-webkit-scrollbar { width: 6px; }
    .acb-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

    .acb-msg {
      padding: 12px 16px; border-radius: 12px;
      font-size: 13.5px; line-height: 1.6;
      max-width: 88%; word-wrap: break-word;
      animation: acb-fadein 0.3s ease-out;
    }
    .acb-msg strong { font-weight: 800; }
    .acb-msg code { background: rgba(0,0,0,0.06); padding: 2px 4px; border-radius: 4px; font-family: monospace; font-size: 12px; }
    
    @keyframes acb-fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    
    .acb-msg.user {
      background: #0f172a; color: #ffffff; 
      align-self: flex-end; border-bottom-right-radius: 4px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.15);
    }
    .acb-msg.bot {
      background: #f1f5f9; color: #334155; 
      align-self: flex-start; border-bottom-left-radius: 4px;
      border: 1px solid #e2e8f0;
    }
    .acb-msg.system {
      background: #fffbeb; color: #b45309; align-self: center;
      border: 1px solid #fde68a; font-size: 12px; text-align: center; font-weight: 600;
    }
    .acb-msg.error {
      background: #fef2f2; color: #ef4444; align-self: center;
      border: 1px solid #fecaca; font-size: 12px; font-weight: 600;
    }

    .acb-typing {
      align-self: flex-start; background: #f8fafc;
      padding: 12px 18px; border-radius: 12px; display: none;
      border: 1px solid #e2e8f0; border-bottom-left-radius: 4px;
    }
    .acb-typing.show { display: inline-block; }
    .acb-typing span {
      width: 6px; height: 6px; border-radius: 50%;
      background: #64748b; display: inline-block;
      margin: 0 2px; animation: acb-bounce 1.2s infinite;
    }
    .acb-typing span:nth-child(2) { animation-delay: 0.2s; }
    .acb-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes acb-bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-4px); opacity: 1; } }

    .acb-suggestions { padding: 0 16px 12px; display: flex; flex-wrap: wrap; gap: 8px; background: #ffffff; }
    .acb-suggestions .acb-sug {
      background: #ffffff; border: 1px solid #cbd5e1; color: #475569;
      padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;
      cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    }
    .acb-suggestions .acb-sug:hover { background: #f1f5f9; color: #0f172a; border-color: #94a3b8; transform: translateY(-1px); }

    .acb-input-area {
      padding: 16px; border-top: 1px solid #e2e8f0;
      display: flex; gap: 10px; background: #f8fafc;
    }
    .acb-input-area input {
      flex: 1; background: #ffffff; border: 1px solid #cbd5e1;
      border-radius: 8px; padding: 12px 14px;
      color: #0f172a; font-size: 14px; font-family: inherit; font-weight: 500;
      outline: none; transition: all 0.2s; box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
    }
    .acb-input-area input:focus { border-color: #0f172a; box-shadow: 0 0 0 2px rgba(15,23,42,0.1); }
    .acb-input-area input::placeholder { color: #94a3b8; font-weight: 400; }
    
    .acb-input-area button {
      background: #0f172a; color: white; border: none; cursor: pointer;
      padding: 0 20px; border-radius: 8px; font-size: 14px; font-weight: 700;
      transition: all 0.2s; box-shadow: 0 2px 4px rgba(15,23,42,0.1);
    }
    .acb-input-area button:hover { background: #334155; transform: translateY(-1px); box-shadow: 0 4px 8px rgba(15,23,42,0.2); }
    .acb-input-area button:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .acb-config {
      position: absolute; inset: 0; background: rgba(255,255,255,0.95);
      backdrop-filter: blur(8px); padding: 30px 24px; display: none;
      flex-direction: column; gap: 16px; z-index: 10;
    }
    .acb-config.show { display: flex; }
    .acb-config h3 { color: #0f172a; font-size: 20px; font-weight: 900; margin: 0 0 4px; }
    .acb-config p { color: #475569; font-size: 13px; line-height: 1.6; margin: 0; font-weight: 500;}
    .acb-config a { color: #0f172a; font-weight: 800; text-decoration: underline; }
    .acb-config input {
      background: #ffffff; border: 2px solid #cbd5e1; border-radius: 8px;
      padding: 12px 14px; color: #0f172a; font-size: 14px; font-family: monospace; outline: none;
    }
    .acb-config input:focus { border-color: #0f172a; }
    .acb-config .acb-btn-row { display: flex; gap: 10px; margin-top: 10px; }
    .acb-config .acb-btn-row button {
      flex: 1; padding: 12px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s;
    }
    .acb-config .acb-btn-save { background: #0f172a; color: white; box-shadow: 0 4px 12px rgba(15,23,42,0.15); }
    .acb-config .acb-btn-save:hover { background: #334155; }
    .acb-config .acb-btn-cancel { background: #e2e8f0; color: #475569; }
    .acb-config .acb-btn-cancel:hover { background: #cbd5e1; color: #0f172a;}
  `;

  // ----- INSERT STYLES -----
  const styleEl = document.createElement('style');
  styleEl.textContent = STYLES;
  document.head.appendChild(styleEl);

  // ----- HTML BỘ KHUNG -----
  const fab = document.createElement('button');
  fab.id = 'aideom-chatbot-fab';
  fab.innerHTML = '✨'; // Đổi icon sang tia sáng AI quyền lực
  fab.title = 'AIDEOM-VN AI Expert';
  document.body.appendChild(fab);

  const panel = document.createElement('div');
  panel.id = 'aideom-chatbot-panel';
  panel.innerHTML = `
    <div class="acb-header">
      <div class="acb-avatar">AI</div>
      <div class="acb-info">
        <div class="acb-name">Giáo sư AIDEOM-VN</div>
        <div class="acb-status">Online · Gemini 2.0 Flash Enhanced</div>
      </div>
      <button class="acb-settings" title="Cài đặt API Key">⚙ Cấu hình</button>
    </div>

    <div class="acb-messages" id="acb-messages">
      <div class="acb-msg bot">
        Chào bạn! Tôi là chuyên gia phân tích của AIDEOM-VN.<br><br>Hãy hỏi tôi bất cứ câu hỏi học thuật, giải thích công thức Toán học, mã nguồn thuật toán hay chính sách vĩ mô nào nằm trong 12 bài tập của đồ án nhé!
      </div>
    </div>

    <div class="acb-suggestions">
      <button class="acb-sug" data-q="Phân tích ưu điểm của NSGA-II so với Weighted Sum ở Bài 7?">NSGA-II vs Weighted Sum?</button>
      <button class="acb-sug" data-q="EVPI và VSS ở bài 10 có ý nghĩa chính sách gì?">Ý nghĩa EVPI, VSS?</button>
      <button class="acb-sug" data-q="Tại sao Q-learning lại có thể hội tụ mà không cần biết Model?">Q-learning Model-free?</button>
    </div>

    <div class="acb-input-area">
      <input type="text" id="acb-input" placeholder="Hỏi giáo sư điều gì đó..." maxlength="800">
      <button id="acb-send">Gửi</button>
    </div>

    <div class="acb-config" id="acb-config">
      <h3>🔑 Quản lý Khóa API</h3>
      <p>Để đánh thức trí tuệ của AI, hãy cung cấp mã API Key miễn phí từ Google Studio:</p>
      <p>1. Truy cập <a href="https://aistudio.google.com/apikey" target="_blank">aistudio.google.com</a><br>
      2. Tạo Key mới và dán vào ô bên dưới.</p>
      <input type="password" id="acb-apikey" placeholder="AIzaSy..." autocomplete="off">
      <div class="acb-btn-row">
        <button class="acb-btn-cancel" id="acb-cfg-cancel">Đóng</button>
        <button class="acb-btn-save" id="acb-cfg-save">Kích hoạt AI</button>
      </div>
      <p style="font-size:11px;color:#94a3b8;margin-top:auto;text-align:center">
        *Mã khóa chỉ lưu trên trình duyệt của bạn (Local Storage), tuyệt đối bảo mật.
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

  // ----- TEXT FORMATTER (MARKDOWN PARSER) -----
  function formatMarkdown(text) {
    let html = text.replace(/</g, '&lt;').replace(/>/g, '&gt;'); // Escape HTML tags
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic
    html = html.replace(/`(.*?)`/g, '<code>$1</code>'); // Code
    html = html.replace(/\n/g, '<br>'); // New lines
    // Xử lý list gạch đầu dòng cơ bản
    html = html.replace(/(?:^|<br>)- (.*?)(?=<br>|$)/g, '<br>• $1');
    return html;
  }

  // ----- TOGGLE -----
  fab.addEventListener('click', () => {
    panel.classList.toggle('open');
    fab.classList.toggle('open');
    fab.innerHTML = fab.classList.contains('open') ? '✕' : '✨';
    if (panel.classList.contains('open') && !getApiKey()) {
      config.classList.add('show');
    } else if (panel.classList.contains('open')) {
      input.focus();
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
    if (!k) { alert('Vui lòng nhập API key hợp lệ.'); return; }
    setApiKey(k);
    config.classList.remove('show');
    addMsg('system', '✓ Đã kích hoạt hệ thống AI thành công. Sẵn sàng nhận câu hỏi!');
  });

  // ----- SEND -----
  function addMsg(type, text) {
    const div = document.createElement('div');
    div.className = `acb-msg ${type}`;
    if (type === 'bot') {
        div.innerHTML = formatMarkdown(text);
    } else {
        div.textContent = text;
    }
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
      
      // Cấu hình AI thông minh hơn: temp thấp cho logic toán học, max token cao, history dài
      const body = {
        contents: history.slice(-20),  
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: { 
            temperature: 0.3, 
            maxOutputTokens: 1024,
            topK: 40
        }
      };

      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await resp.json();

      hideTyping();

      if (data.error) {
        addMsg('error', '❌ Lỗi hệ thống: ' + (data.error.message || 'Không rõ nguyên nhân'));
        history.pop(); // Remove failed user msg from history
      } else {
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '(Phản hồi trống từ AI)';
        addMsg('bot', reply);
        history.push({ role: 'model', parts: [{ text: reply }] });
      }
    } catch (e) {
      hideTyping();
      addMsg('error', '❌ Mất kết nối tới máy chủ Gemini: ' + e.message);
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
