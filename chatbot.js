// =============================================================
// AIDEOM-VN AI CHATBOT — Gemini 2.0 Flash (Ultimate Edition)
// =============================================================
// Tính năng: Auto-Rotate API Keys, Context-Aware, MathJax, Memory
// Fix: Xử lý mượt mà lỗi Rate Limit (Quá 15 câu/phút)
// =============================================================

function initAideomChatbot() {
  'use strict';
  
  if (document.getElementById('aideom-chatbot-fab')) return;

  const currentPageTitle = document.title || "AIDEOM-VN Dashboard";
  const titleLower = currentPageTitle.toLowerCase();

  const SYSTEM_PROMPT = `Bạn là Trợ giảng / Giáo sư AI tối cao cho môn học "Các mô hình ra quyết định phát triển kinh tế Việt Nam trong kỉ nguyên AI" (Hệ thống AIDEOM-VN).
Triết lý sư phạm: "Học bằng làm". Sinh viên phải biết diễn giải kết quả trong bối cảnh thể chế Việt Nam (NQ 57-NQ/TW, QĐ 749, QĐ 127, QĐ 411, COP26).

Bạn nắm rõ toàn bộ cấu trúc 12 bài tập gồm 4 cấp độ:
1. DỄ: Bài 1 (Cobb-Douglas), Bài 2 (LP 4 hạng mục), Bài 3 (LP Priority 10 ngành).
2. TRUNG BÌNH: Bài 4 (LP 6x4 công bằng vùng miền), Bài 5 (MIP 15 dự án), Bài 6 (TOPSIS 6 vùng).
3. KHÁ KHÓ: Bài 7 (NSGA-II 4 mục tiêu), Bài 8 (Dynamic Programming Bellman), Bài 9 (Mô phỏng lao động, CVXPY).
4. KHÓ: Bài 10 (Stochastic 2-stage, EVPI, VSS), Bài 11 (Q-learning, MDP), Bài 12 (Master Dashboard).

NGUYÊN TẮC TRẢ LỜI:
1. NHẬN THỨC NGỮ CẢNH: Sinh viên đang xem trang "${currentPageTitle}". Xoáy sâu vào các khái niệm của bài đó.
2. TOÁN HỌC: Công thức BẮT BUỘC bọc trong thẻ LaTeX ($x_i$ cho inline, $$x$$ cho block). 
3. PHÂN TÍCH VĨ MÔ: Luôn liên hệ toán học với thực tiễn Việt Nam. 
4. TRÌNH BÀY: Dùng **in đậm** từ khóa. Súc tích, giọng điệu học thuật.`;

  const STYLES = `
    #aideom-chatbot-fab { position: fixed; bottom: 24px; right: 24px; width: 60px; height: 60px; border-radius: 50%; background: #0f172a; color: white; font-size: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.4); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 2147483647; border: 2px solid #ffffff; padding: 0; outline: none; }
    #aideom-chatbot-fab:hover { transform: translateY(-4px) scale(1.05); box-shadow: 0 8px 30px rgba(15, 23, 42, 0.5); }
    #aideom-chatbot-fab.open { background: #334155; transform: rotate(90deg); }
    #aideom-chatbot-panel { position: fixed; bottom: 100px; right: 24px; width: 400px; max-width: calc(100vw - 48px); height: 600px; max-height: calc(100vh - 140px); background: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px; box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15); display: none; flex-direction: column; z-index: 2147483646; font-family: 'Inter', -apple-system, sans-serif; overflow: hidden; }
    #aideom-chatbot-panel.open { display: flex; animation: slideUp 0.3s ease-out; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .acb-header { padding: 16px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 12px; }
    .acb-header .acb-avatar { width: 40px; height: 40px; border-radius: 10px; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; }
    .acb-header .acb-info { flex: 1; }
    .acb-header .acb-name { font-size: 15px; font-weight: 800; color: #0f172a; margin: 0; }
    .acb-header .acb-status { font-size: 11px; color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 6px; margin-top: 2px; }
    .acb-header .acb-status::before { content: ''; width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px rgba(16, 185, 129, 0.6); }
    .acb-header .acb-settings { background: transparent; border: 1px solid #cbd5e1; color: #475569; cursor: pointer; padding: 6px 10px; border-radius: 6px; font-size: 14px; transition: all 0.2s; }
    .acb-header .acb-settings:hover { background: #e2e8f0; color: #0f172a; }
    .acb-messages { flex: 1; overflow-y: auto; padding: 20px 16px; display: flex; flex-direction: column; gap: 16px; background: #ffffff; }
    .acb-messages::-webkit-scrollbar { width: 6px; }
    .acb-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
    .acb-msg { padding: 12px 16px; border-radius: 12px; font-size: 13.5px; line-height: 1.6; max-width: 88%; word-wrap: break-word; animation: acb-fadein 0.3s ease-out; white-space: pre-wrap; }
    .acb-msg strong { font-weight: 800; color: inherit; }
    .acb-msg pre { background: #f1f5f9; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; overflow-x: auto; margin: 8px 0; }
    .acb-msg code { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; }
    @keyframes acb-fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .acb-msg.user { background: #0f172a; color: #ffffff; align-self: flex-end; border-bottom-right-radius: 4px; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.15); }
    .acb-msg.bot { background: #f8fafc; color: #334155; align-self: flex-start; border-bottom-left-radius: 4px; border: 1px solid #e2e8f0; }
    .acb-msg.system { background: #fffbeb; color: #b45309; align-self: center; border: 1px solid #fde68a; font-size: 12px; text-align: center; font-weight: 600; white-space: normal; padding: 8px 12px; border-radius: 8px; }
    .acb-msg.error { background: #fef2f2; color: #ef4444; align-self: center; border: 1px solid #fecaca; font-size: 12px; font-weight: 600; white-space: normal; padding: 8px 12px; border-radius: 8px; }
    .acb-typing { align-self: flex-start; background: #f8fafc; padding: 12px 18px; border-radius: 12px; display: none; border: 1px solid #e2e8f0; border-bottom-left-radius: 4px; }
    .acb-typing.show { display: inline-block; }
    .acb-typing span { width: 6px; height: 6px; border-radius: 50%; background: #64748b; display: inline-block; margin: 0 2px; animation: acb-bounce 1.2s infinite; }
    .acb-typing span:nth-child(2) { animation-delay: 0.2s; }
    .acb-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes acb-bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-4px); opacity: 1; } }
    .acb-suggestions { padding: 0 16px 12px; display: flex; flex-wrap: wrap; gap: 8px; background: #ffffff; }
    .acb-suggestions .acb-sug { background: #ffffff; border: 1px solid #cbd5e1; color: #475569; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
    .acb-suggestions .acb-sug:hover { background: #f1f5f9; color: #0f172a; border-color: #94a3b8; transform: translateY(-1px); }
    .acb-input-area { padding: 16px; border-top: 1px solid #e2e8f0; display: flex; gap: 10px; background: #f8fafc; }
    .acb-input-area input { flex: 1; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px 14px; color: #0f172a; font-size: 14px; font-family: inherit; font-weight: 500; outline: none; transition: all 0.2s; box-shadow: inset 0 1px 2px rgba(0,0,0,0.02); margin:0; }
    .acb-input-area input:focus { border-color: #0f172a; box-shadow: 0 0 0 2px rgba(15,23,42,0.1); }
    .acb-input-area input::placeholder { color: #94a3b8; font-weight: 400; }
    .acb-input-area button { background: #0f172a; color: white; border: none; cursor: pointer; padding: 0 20px; border-radius: 8px; font-size: 14px; font-weight: 700; transition: all 0.2s; box-shadow: 0 2px 4px rgba(15,23,42,0.1); margin:0; }
    .acb-input-area button:hover { background: #334155; transform: translateY(-1px); box-shadow: 0 4px 8px rgba(15,23,42,0.2); }
    .acb-input-area button:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .acb-config { position: absolute; inset: 0; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); padding: 30px 24px; display: none; flex-direction: column; gap: 16px; z-index: 10; }
    .acb-config.show { display: flex; }
    .acb-config h3 { color: #0f172a; font-size: 20px; font-weight: 900; margin: 0 0 4px; }
    .acb-config p { color: #475569; font-size: 13px; line-height: 1.6; margin: 0; font-weight: 500;}
    .acb-config a { color: #0f172a; font-weight: 800; text-decoration: underline; }
    .acb-config textarea { background: #ffffff; border: 2px solid #cbd5e1; border-radius: 8px; padding: 12px 14px; color: #0f172a; font-size: 13px; font-family: monospace; outline: none; resize: vertical; min-height: 80px; }
    .acb-config textarea:focus { border-color: #0f172a; }
    .acb-config .acb-btn-row { display: flex; gap: 10px; margin-top: 10px; }
    .acb-config .acb-btn-row button { flex: 1; padding: 12px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s; }
    .acb-config .acb-btn-save { background: #0f172a; color: white; box-shadow: 0 4px 12px rgba(15,23,42,0.15); }
    .acb-config .acb-btn-save:hover { background: #334155; }
    .acb-config .acb-btn-cancel { background: #e2e8f0; color: #475569; }
    .acb-config .acb-btn-cancel:hover { background: #cbd5e1; color: #0f172a;}
    .acb-config .acb-btn-clear { background: #fef2f2; color: #ef4444; border: 1px solid #fecaca; margin-top: 12px; padding: 12px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s;}
    .acb-config .acb-btn-clear:hover { background: #fecaca; color: #b91c1c; }
  `;
  const styleEl = document.createElement('style'); styleEl.textContent = STYLES; document.head.appendChild(styleEl);

  const fab = document.createElement('button'); fab.id = 'aideom-chatbot-fab'; fab.innerHTML = '✨'; fab.title = 'AIDEOM-VN AI Expert'; document.body.appendChild(fab);

  let dynamicSuggestions = `
    <button class="acb-sug" data-q="Hệ thống 12 bài tập AIDEOM-VN được chia thành 4 cấp độ nào?">Cấu trúc 4 cấp độ đồ án?</button>
    <button class="acb-sug" data-q="Tiêu chí chấm điểm (Rubric) của môn học này bao gồm những phần nào?">Tiêu chí chấm điểm (Rubric)</button>
  `;
  if (titleLower.includes('bài 1') || titleLower.includes('cobb')) dynamicSuggestions += `<button class="acb-sug" data-q="Theo đề bài, các biến $D_t$, $AI_t$, $H_t$ trong phương trình Cobb-Douglas đại diện cho điều gì?">Các biến trong Cobb-Douglas</button>`;
  else if (titleLower.includes('bài 2') || titleLower.includes('bài 3')) dynamicSuggestions += `<button class="acb-sug" data-q="Theo đề bài, shadow price của ràng buộc ngân sách có ý nghĩa gì trong thực tiễn?">Ý nghĩa Shadow Price</button>`;
  else if (titleLower.includes('bài 4')) dynamicSuggestions += `<button class="acb-sug" data-q="Tại sao ràng buộc công bằng vùng miền (C5) lại quan trọng theo Nghị quyết 13-NQ/TW?">Ý nghĩa công bằng vùng miền</button>`;
  else if (titleLower.includes('bài 5')) dynamicSuggestions += `<button class="acb-sug" data-q="Trong MIP chọn dự án, hiệu ứng cộng hưởng giữa AI (P8) và Bán dẫn (P13) được mô hình hóa thế nào?">Hiệu ứng cộng hưởng AI & Bán dẫn</button>`;
  else if (titleLower.includes('bài 6') || titleLower.includes('topsis')) dynamicSuggestions += `<button class="acb-sug" data-q="So sánh sự khác biệt khi dùng trọng số Entropy khách quan và AHP chuyên gia trong đánh giá vùng.">Entropy vs AHP (Bài 6)</button>`;
  else if (titleLower.includes('bài 7') || titleLower.includes('nsga')) dynamicSuggestions += `<button class="acb-sug" data-q="Tại sao NSGA-II không trả về 1 nghiệm duy nhất mà trả về tập Pareto? Điều này có thay thế quyết định chính trị không?">Vai trò của NSGA-II</button>`;
  else if (titleLower.includes('bài 8') || titleLower.includes('dynamic')) dynamicSuggestions += `<button class="acb-sug" data-q="Mô hình Dynamic Programming trong bài 8 đề xuất chiến lược Front-loaded hay Back-loaded? Giải thích lý do.">Front-loaded vs Back-loaded</button>`;
  else if (titleLower.includes('bài 9') || titleLower.includes('labor')) dynamicSuggestions += `<button class="acb-sug" data-q="Theo bài 9, ngành Nông nghiệp có nên đầu tư trực tiếp vào AI không khi nguy cơ mất việc lớn?">Chiến lược cho Nông nghiệp</button>`;
  else if (titleLower.includes('bài 10') || titleLower.includes('stochastic')) dynamicSuggestions += `<button class="acb-sug" data-q="Chỉ số EVPI và VSS trong bài 10 mang ý nghĩa gì đối với tư duy hoạch định chính sách dưới bất định?">Ý nghĩa EVPI & VSS</button>`;
  else if (titleLower.includes('bài 11') || titleLower.includes('q-learning')) dynamicSuggestions += `<button class="acb-sug" data-q="So sánh tính chất của Q-learning (Off-policy) và SARSA (On-policy) trong bài 11.">Q-learning vs SARSA</button>`;
  else if (titleLower.includes('bài 12') || titleLower.includes('dashboard')) dynamicSuggestions += `<button class="acb-sug" data-q="Liệt kê 6 module chức năng (M1 đến M6) trong hệ thống AIDEOM-VN tổng hợp.">Cấu trúc 6 Module (Bài 12)</button>`;

  const panel = document.createElement('div');
  panel.id = 'aideom-chatbot-panel';
  panel.innerHTML = `
    <div class="acb-header">
      <div class="acb-avatar">AI</div>
      <div class="acb-info">
        <div class="acb-name">Giáo sư AIDEOM-VN</div>
        <div class="acb-status">Online · Gemini 2.0 Flash</div>
      </div>
      <button class="acb-settings" title="Cài đặt hệ thống">⚙ Cấu hình</button>
    </div>
    <div class="acb-messages" id="acb-messages"></div>
    <div class="acb-suggestions">${dynamicSuggestions}</div>
    <div class="acb-input-area">
      <input type="text" id="acb-input" placeholder="Hỏi giáo sư điều gì đó..." autocomplete="off">
      <button id="acb-send">Gửi</button>
    </div>
    <div class="acb-config" id="acb-config">
      <h3>🔑 Quản lý API Key (Chống hết lượt)</h3>
      <p>Bạn có thể nhập <strong>nhiều API Key</strong> cách nhau bằng dấu phẩy (,). Hệ thống sẽ tự động xoay vòng sang Key tiếp theo nếu Key đang dùng bị Google báo hết lượt sử dụng.</p>
      <textarea id="acb-apikey" placeholder="Ví dụ: \nAIzaSy...key1,\nAIzaSy...key2"></textarea>
      <div class="acb-btn-row">
        <button class="acb-btn-cancel" id="acb-cfg-cancel">Đóng</button>
        <button class="acb-btn-save" id="acb-cfg-save">Lưu & Kích hoạt</button>
      </div>
      <button class="acb-btn-clear" id="acb-cfg-clear">🗑 Xóa toàn bộ Lịch sử Trò chuyện</button>
    </div>
  `;
  document.body.appendChild(panel);

  const messages = document.getElementById('acb-messages');
  const input = document.getElementById('acb-input');
  const sendBtn = document.getElementById('acb-send');
  const config = document.getElementById('acb-config');
  const apikeyInput = document.getElementById('acb-apikey');
  
  let chatHistory = [];
  try { chatHistory = JSON.parse(sessionStorage.getItem('acb_history')) || []; } catch(e){}
  
  let currentKeyIndex = 0; 
  let windowTempKeys = [];
  const STORAGE_KEY = 'aideom_gemini_apikey_array';

  function getApiKeys() { 
      try { const keysStr = localStorage.getItem(STORAGE_KEY) || ''; return keysStr.split(',').map(k => k.trim()).filter(k => k.length > 10); } 
      catch(e) { return windowTempKeys; }
  }
  function setApiKeys(kStr) { 
      try { localStorage.setItem(STORAGE_KEY, kStr); } 
      catch(e) { windowTempKeys = kStr.split(',').map(k => k.trim()).filter(k => k.length > 10); }
  }
  function saveHistory() { 
      try { sessionStorage.setItem('acb_history', JSON.stringify(chatHistory)); } catch(e){} 
  }

  function formatMarkdown(text) {
    let html = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    return html;
  }
  function renderMath(element) { try { if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise([element]).catch(e => console.log(e)); } catch(e){} }

  function addMsg(type, text, saveToHistory = true) {
    const div = document.createElement('div'); div.className = `acb-msg ${type}`;
    if (type === 'bot') { div.innerHTML = formatMarkdown(text); renderMath(div); } 
    else { div.textContent = text; }
    messages.appendChild(div); messages.scrollTop = messages.scrollHeight;
    
    if (saveToHistory && (type === 'user' || type === 'bot')) {
        chatHistory.push({ role: type === 'user' ? 'user' : 'model', parts: [{ text: text }] });
        saveHistory();
    }
    return div;
  }

  if (chatHistory.length === 0) {
    addMsg('bot', `Chào bạn! Tôi là Giáo sư AI của hệ thống. Tôi nhận thấy bạn đang xem **${currentPageTitle}**.\n\nTrong bài tập này, chúng ta không chỉ giải bài toán tối ưu mà còn phải phân tích kết quả dựa trên các chiến lược quốc gia. Bạn cần tôi hỗ trợ phần nào?`, false);
  } else {
    chatHistory.forEach(h => {
        const div = document.createElement('div'); div.className = `acb-msg ${h.role === 'user' ? 'user' : 'bot'}`;
        if (h.role === 'user') div.textContent = h.parts[0].text; else div.innerHTML = formatMarkdown(h.parts[0].text);
        messages.appendChild(div);
    });
    messages.scrollTop = messages.scrollHeight;
    setTimeout(() => { try { if (window.MathJax && window.MathJax.typesetPromise) window.MathJax.typesetPromise([messages]); } catch(e){} }, 300);
  }

  fab.addEventListener('click', () => {
    panel.classList.toggle('open'); fab.classList.toggle('open');
    if (panel.classList.contains('open') && getApiKeys().length === 0) {
        config.classList.add('show');
        try { apikeyInput.value = localStorage.getItem(STORAGE_KEY) || ''; } catch(e) { apikeyInput.value = windowTempKeys.join(', '); }
    }
    else if (panel.classList.contains('open')) input.focus();
  });

  panel.querySelector('.acb-settings').addEventListener('click', () => { 
      config.classList.add('show'); 
      try { apikeyInput.value = localStorage.getItem(STORAGE_KEY) || ''; } catch(e) { apikeyInput.value = windowTempKeys.join(', '); }
  });
  document.getElementById('acb-cfg-cancel').addEventListener('click', () => config.classList.remove('show'));
  document.getElementById('acb-cfg-save').addEventListener('click', () => {
    const kStr = apikeyInput.value.trim();
    if (!kStr) { alert('Vui lòng nhập ít nhất 1 API key.'); return; }
    setApiKeys(kStr); currentKeyIndex = 0; config.classList.remove('show');
    addMsg('system', `✓ Đã lưu ${getApiKeys().length} API Key. Hệ thống tự động xoay vòng nếu có Key bị giới hạn.`, false);
  });
  
  document.getElementById('acb-cfg-clear').addEventListener('click', () => {
    try { sessionStorage.removeItem('acb_history'); } catch(e){}
    chatHistory = []; messages.innerHTML = ''; 
    addMsg('bot', `Lịch sử liên trang đã được xóa sạch. Tôi đã sẵn sàng phân tích **${currentPageTitle}** cùng bạn!`, false);
    config.classList.remove('show');
  });

  function showTyping() {
    const div = document.createElement('div'); div.className = 'acb-typing show'; div.id = 'acb-typing';
    div.innerHTML = '<span></span><span></span><span></span>'; messages.appendChild(div); messages.scrollTop = messages.scrollHeight;
  }
  function hideTyping() { const el = document.getElementById('acb-typing'); if (el) el.remove(); }

  // THUẬT TOÁN TỰ ĐỘNG BẮT LỖI RATE LIMIT & QUOTA
  async function sendRequestWithRetry(keys, attemptCount = 0) {
    if (attemptCount >= keys.length) {
        hideTyping();
        addMsg('error', '❌ TẤT CẢ API Key của bạn đều đã hết lượt sử dụng trong ngày (Limit: 0). Vui lòng tạo API Key từ một tài khoản Gmail mới tinh và dán vào phần Cấu hình để tiếp tục.', false);
        chatHistory.pop(); saveHistory(); sendBtn.disabled = false; input.focus(); return;
    }

    const currentKey = keys[currentKeyIndex];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${currentKey}`;
    const body = {
        contents: chatHistory.slice(-20), 
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: { temperature: 0.3, maxOutputTokens: 1024, topK: 40 } 
    };

    try {
        const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const data = await resp.json();

        if (data.error) {
            let errorMsg = data.error.message || '';
            
            // Xử lý lỗi Rate limit (nhắn quá 15 câu/phút)
            if (errorMsg.toLowerCase().includes('retry in')) {
                const match = errorMsg.match(/retry in ([\d\.]+)s/i);
                const waitTime = match ? Math.ceil(parseFloat(match[1])) : 60;
                
                if (keys.length > 1) {
                    currentKeyIndex = (currentKeyIndex + 1) % keys.length; 
                    addMsg('system', `⚠ API Key thứ ${attemptCount + 1} đang bị giới hạn tốc độ. Đổi sang Key tiếp theo...`, false);
                    return await sendRequestWithRetry(keys, attemptCount + 1); 
                } else {
                    hideTyping();
                    addMsg('error', `⏳ Bạn đang chat quá nhanh (Vượt 15 câu/phút của bản Free). Vui lòng chờ ${waitTime} giây rồi thử lại. Hoặc thêm nhiều Key vào Cấu hình để hệ thống tự xoay vòng!`, false);
                    chatHistory.pop(); saveHistory(); sendBtn.disabled = false; input.focus();
                    return;
                }
            } 
            // Xử lý lỗi Quota/Limit: 0 (Hết lượt/Bị khóa)
            else if (errorMsg.toLowerCase().includes('limit: 0') || errorMsg.toLowerCase().includes('quota') || errorMsg.toLowerCase().includes('exceeded')) {
                if (keys.length > 1) {
                    currentKeyIndex = (currentKeyIndex + 1) % keys.length; 
                    addMsg('system', `⚠ API Key thứ ${attemptCount + 1} đã hết lượt (Limit: 0). Đổi sang Key mới...`, false);
                    return await sendRequestWithRetry(keys, attemptCount + 1); 
                } else {
                    hideTyping();
                    addMsg('error', `❌ API Key của bạn đã bị Google báo hết lượt miễn phí (Quota Exceeded). Vui lòng tạo API Key từ một tài khoản Gmail khác và dán vào Cấu hình.`, false);
                    chatHistory.pop(); saveHistory(); sendBtn.disabled = false; input.focus();
                    return;
                }
            }
            // Các lỗi khác
            else {
                hideTyping(); addMsg('error', '❌ Lỗi API: ' + errorMsg, false);
                chatHistory.pop(); saveHistory(); sendBtn.disabled = false; input.focus();
            }
        } else {
            hideTyping();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '(Phản hồi trống)';
            addMsg('bot', reply, true);
            sendBtn.disabled = false; input.focus();
        }
    } catch (e) {
        hideTyping(); addMsg('error', '❌ Lỗi kết nối mạng, vui lòng kiểm tra Wifi.', false);
        chatHistory.pop(); saveHistory(); sendBtn.disabled = false; input.focus();
    }
  }

  async function send() {
    const text = input.value.trim();
    if (!text) return;
    const keys = getApiKeys();
    if (keys.length === 0) { config.classList.add('show'); return; }

    addMsg('user', text, true);
    input.value = ''; sendBtn.disabled = true;
    showTyping();

    await sendRequestWithRetry(keys, 0);
  }

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });

  panel.querySelectorAll('.acb-sug').forEach(btn => {
    btn.addEventListener('click', () => { input.value = btn.dataset.q; send(); });
  });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAideomChatbot);
} else {
    initAideomChatbot();
}
})();
