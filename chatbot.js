// =============================================================
// AIDEOM-VN AI CHATBOT — Gemini 2.0 Flash (Ultimate Edition)
// =============================================================
// Tính năng: Auto-Rotate API Keys (Chống hết Quota), Context-Aware, 
// MathJax Rendering, Cross-Page Memory (Trí nhớ liên trang).
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
1. DỄ: Bài 1 (Cobb-Douglas mở rộng), Bài 2 (LP phân bổ 4 hạng mục), Bài 3 (LP Priority 10 ngành).
2. TRUNG BÌNH: Bài 4 (LP Không gian 6x4, ràng buộc công bằng), Bài 5 (MIP chọn 15 dự án), Bài 6 (TOPSIS 6 vùng, Entropy khách quan).
3. KHÁ KHÓ: Bài 7 (NSGA-II 4 mục tiêu: GDP, Gini, CO2, Rủi ro an ninh mạng), Bài 8 (Dynamic Programming 2026-2035, Bellman), Bài 9 (Mô phỏng lao động, Convex Opt CVXPY).
4. KHÓ: Bài 10 (Stochastic 2-stage, SAA, EVPI, VSS, Robust Minimax Regret), Bài 11 (Q-learning, SARSA, MDP), Bài 12 (Đồ án tích hợp 6 Module, Master Dashboard).

Tiêu chí chấm điểm (Rubric): Toán học (20%), Lập trình Python (20%), Dữ liệu thực (15%), Phân tích chính sách (20%), Trực quan hóa (15%), Báo cáo và thuyết trình (10%).

NGUYÊN TẮC TRẢ LỜI TỐI THƯỢNG:
1. NHẬN THỨC NGỮ CẢNH: Sinh viên đang xem trang "${currentPageTitle}". Hãy xoáy sâu vào các khái niệm của bài đó.
2. TOÁN HỌC & LẬP TRÌNH CHUẨN MỰC: Khi nhắc đến biến số, công thức, mô hình, BẮT BUỘC bọc trong thẻ LaTeX ($x_i$ cho inline, $$x$$ cho block). 
3. PHÂN TÍCH VĨ MÔ: Luôn liên hệ toán học với thực tiễn Việt Nam. 
4. CÁCH TRÌNH BÀY: Dùng **in đậm** từ khóa cốt lõi. Súc tích (3-7 câu), giọng điệu học thuật, khắt khe nhưng tận tình chỉ dẫn. Khuyến khích tư duy phản biện.`;

  // ----- 3. STYLES (MONOCHROME / CHARCOAL THEME) -----
  const STYLES = `
    #aideom-chatbot-fab {
      position: fixed; bottom: 24px; right: 24px;
      width: 60px; height: 60px; border-radius: 50%;
      background: #0f172a; color: white; font-size: 24px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.4);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 9999;
      border: 2px solid #ffffff;
    }
    #aideom-chatbot-fab:hover { transform: translateY(-4px) scale(1.05); box-shadow: 0 8px 30px rgba(15, 23, 42, 0.5); }
    #aideom-chatbot-fab.open { background: #334155; transform: rotate(90deg); }

    #aideom-chatbot-panel {
      position: fixed; bottom: 100px; right: 24px;
      width: 400px; max-width: calc(100vw - 48px);
      height: 600px; max-height: calc(100vh - 140px);
      background: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px;
      box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
      display: none; flex-direction: column; z-index: 9998;
      font-family: 'Inter', -apple-system, sans-serif; overflow: hidden;
    }
    #aideom-chatbot-panel.open { display: flex; animation: slideUp 0.3s ease-out; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .acb-header { padding: 16px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 12px; }
    .acb-header .acb-avatar { width: 40px; height: 40px; border-radius: 10px; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; }
    .acb-header .acb-info { flex: 1; }
    .acb-header .acb-name { font-size: 15px; font-weight: 800; color: #0f172a; }
    .acb-header .acb-status { font-size: 11px; color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 6px; margin-top: 2px; }
    .acb-header .acb-status::before { content: ''; width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px rgba(16, 185, 129, 0.6); }
    .acb-header .acb-settings { background: transparent; border: 1px solid #cbd5e1; color: #475569; cursor: pointer; padding: 6px 10px; border-radius: 6px; font-size: 14px; transition: all 0.2s; }
    .acb-header .acb-settings:hover { background: #e2e8f0; color: #0f172a; }

    .acb-messages { flex: 1; overflow-y: auto; padding: 20px 16px; display: flex; flex-direction: column; gap: 16px; background: #ffffff; }
    .acb-messages::-webkit-scrollbar { width: 6px; }
    .acb-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

    .acb-msg { padding: 12px 16px; border-radius: 12px; font-size: 13.5px; line-height: 1.6; max-width: 88%; word-wrap: break-word; animation: acb-fadein 0.3s ease-out; white-space: pre-wrap; }
    .acb
