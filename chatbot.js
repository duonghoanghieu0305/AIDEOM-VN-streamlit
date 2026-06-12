// =============================================================
// AIDEOM-VN AI CHATBOT — Gemini 2.0 Flash (God-Tier Edition)
// =============================================================
// Nâng cấp: Tự động bắt lỗi Quota, Context-Aware, MathJax
// Đã cấu hình chuẩn xác endpoint gemini-2.0-flash cho thị trường VN
// =============================================================

(function() {
  'use strict';

  // ----- 1. NHẬN THỨC NGỮ CẢNH TRANG HIỆN TẠI -----
  const currentPageTitle = document.title || "AIDEOM-VN Dashboard";
  const titleLower = currentPageTitle.toLowerCase();

  // ----- 2. SYSTEM PROMPT (PERSONA GIÁO SƯ AI) -----
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
2. TOÁN HỌC & LẬP TRÌNH CHUẨN MỰC: Khi nhắc đến biến số, công thức, mô hình, BẮT BUỘC bọc trong thẻ LaTeX ($x_i$ cho inline, $$x$$ cho block). Hỗ trợ sinh viên debug code Python.
3. PHÂN TÍCH VĨ MÔ: Luôn liên hệ toán học với thực tiễn. Nhắc nhở sinh viên rằng tối ưu kinh tế không nhất thiết là tối ưu xã hội.
4. CÁCH TRÌNH BÀY: Dùng **in đậm** từ khóa cốt lõi. Súc tích (3-7 câu), giọng điệu học thuật, khắt khe nhưng tận tình chỉ dẫn.`;

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

  let dynamicSuggestions = `
    <button class="acb-sug" data-q="Hệ thống 12 bài tập AIDEOM-VN được chia thành 4 cấp độ nào?">Cấu trúc 4 cấp độ đồ án?</button>
    <button class="acb-sug" data-q="Tiêu chí chấm điểm (Rubric) của môn học này bao gồm những phần nào?">Tiêu chí chấm điểm (Rubric)</button>
  `;
  if (titleLower.includes('bài 1') || titleLower.includes('cobb')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="Theo đề bài, các biến $D_t$, $AI_t$, $H_t$ trong phương trình Cobb-Douglas đại diện cho điều gì?">Các biến trong Cobb-Douglas</button>`;
  } else if (titleLower.includes('bài 2') || titleLower.includes('bài 3')) {
    dynamicSuggestions += `<button class="acb-sug" data-q="Theo đề bài
