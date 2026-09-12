import {
  collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../lib/firebase';

const MESSAGES_COL = 'assistantMessages';

/**
 * Lắng nghe tin nhắn chat của trợ lý AI realtime.
 */
export function subscribeMessages(uid, onData) {
  if (!db || !uid) return () => {};
  try {
    const colRef = collection(db, 'users', uid, MESSAGES_COL);
    const q = query(colRef, orderBy('createdAt', 'asc'), limit(200));
    return onSnapshot(
      q,
      (snap) => {
        const msgs = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.() || new Date(),
        }));
        onData(msgs);
      },
      (err) => console.warn('[assistant] subscribeMessages error:', err)
    );
  } catch (err) {
    console.warn('[assistant] subscribeMessages fail:', err);
    return () => {};
  }
}

/**
 * Lưu tin nhắn người dùng hoặc trợ lý vào Firestore.
 */
export async function saveMessage(uid, { role, text, action = null }) {
  if (!db || !uid) return null;
  const colRef = collection(db, 'users', uid, MESSAGES_COL);
  return addDoc(colRef, {
    role,
    text: text || '',
    action: action || null,
    createdAt: serverTimestamp(),
  });
}

const GEMINI_TOOLS = [
  {
    functionDeclarations: [
      {
        name: 'create_event',
        description: 'Tạo một sự kiện hoặc lịch hẹn mới trong lịch cá nhân',
        parameters: {
          type: 'OBJECT',
          properties: {
            title: { type: 'STRING', description: 'Tiêu đề cuộc hẹn / sự kiện' },
            start: { type: 'STRING', description: 'Thời gian bắt đầu (ISO 8601 hoặc YYYY-MM-DDTHH:mm)' },
            end: { type: 'STRING', description: 'Thời gian kết thúc' },
            location: { type: 'STRING', description: 'Địa điểm' },
            notes: { type: 'STRING', description: 'Ghi chú' },
          },
          required: ['title', 'start'],
        },
      },
      {
        name: 'create_task',
        description: 'Tạo một công việc mới cần làm',
        parameters: {
          type: 'OBJECT',
          properties: {
            title: { type: 'STRING', description: 'Nội dung công việc' },
            due: { type: 'STRING', description: 'Hạn hoàn thành (YYYY-MM-DD)' },
            priority: { type: 'STRING', enum: ['low', 'normal', 'high'] },
          },
          required: ['title'],
        },
      },
      {
        name: 'create_note',
        description: 'Tạo một ghi chú mới',
        parameters: {
          type: 'OBJECT',
          properties: {
            title: { type: 'STRING', description: 'Tiêu đề ghi chú' },
            body: { type: 'STRING', description: 'Nội dung chi tiết' },
            tags: { type: 'ARRAY', items: { type: 'STRING' } },
          },
          required: ['title', 'body'],
        },
      },
      {
        name: 'create_transaction',
        description: 'Ghi nhận một khoản thu hoặc chi tiêu tài chính mới',
        parameters: {
          type: 'OBJECT',
          properties: {
            type: { type: 'STRING', enum: ['income', 'expense'] },
            amount: { type: 'NUMBER', description: 'Số tiền VND' },
            category: { type: 'STRING', description: 'Danh mục' },
            date: { type: 'STRING', description: 'Ngày giao dịch' },
            note: { type: 'STRING', description: 'Ghi chú' },
          },
          required: ['type', 'amount', 'category'],
        },
      },
      {
        name: 'toggle_habit',
        description: 'Điểm danh hoặc đánh dấu hoàn thành thói quen hôm nay',
        parameters: {
          type: 'OBJECT',
          properties: {
            habitId: { type: 'STRING', description: 'ID thói quen' },
            title: { type: 'STRING', description: 'Tên thói quen' },
          },
          required: ['title'],
        },
      },
      {
        name: 'draft_lead_reply',
        description: 'Soạn thảo email trả lời khách hàng gửi liên hệ',
        parameters: {
          type: 'OBJECT',
          properties: {
            leadId: { type: 'STRING' },
            leadName: { type: 'STRING' },
            email: { type: 'STRING' },
            replyText: { type: 'STRING' },
          },
          required: ['replyText'],
        },
      },
    ],
  },
];

async function callDirectGemini({ message, history = [], context = {} }) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Chưa thiết lập Gemini API Key trên client hoặc server.');
  }

  const systemInstruction = `Bạn là Trợ lý AI cá nhân thông minh trong ứng dụng "Tùng Lâm Workspace".
Nhiệm vụ:
1. Hỗ trợ tra cứu thông tin, lịch trình, công việc, thói quen, tài chính, liên hệ từ website.
2. Tóm tắt ngày làm việc, gợi ý việc ưu tiên, nhắc nhở việc sắp/quá hạn.
3. Khi người dùng muốn tạo lịch, thêm việc, ghi chú, ghi thu chi, điểm danh thói quen, soạn email trả lời khách, hãy gọi function/tool tương ứng.
4. Trả lời ngắn gọn, thân thiện, tự nhiên, bằng tiếng Việt.

Ngữ cảnh hiện tại:
- Thời gian: ${context.currentTime || new Date().toISOString()}
- Tóm tắt: ${context.todaySummary || 'Không có'}
- Lịch (${context.todayEventsCount || 0}): ${JSON.stringify(context.todayEvents || [])}
- Việc quá hạn (${context.overdueTasksCount || 0}): ${JSON.stringify(context.overdueTasks || [])}
- Việc sắp tới: ${JSON.stringify(context.pendingTasks || [])}
- Thói quen: ${JSON.stringify(context.todayHabits || [])}
- Thu chi: Thu ${context.monthIncome || 0}đ, Chi ${context.monthExpense || 0}đ`;

  const contents = [];
  (Array.isArray(history) ? history.slice(-15) : []).forEach((item) => {
    const role = item.role === 'assistant' || item.role === 'model' ? 'model' : 'user';
    if (item.text && item.text.trim()) {
      contents.push({ role, parts: [{ text: item.text.trim() }] });
    }
  });
  contents.push({ role: 'user', parts: [{ text: message }] });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents,
      tools: GEMINI_TOOLS,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.warn('[Gemini direct error response]:', errText);
    throw new Error(`Lỗi gọi Gemini API (${response.status})`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const parts = candidate?.content?.parts || [];

  let replyText = '';
  let action = null;

  for (const part of parts) {
    if (part.text) {
      replyText += part.text;
    }
    if (part.functionCall) {
      action = {
        name: part.functionCall.name,
        input: part.functionCall.args || {},
      };
    }
  }

  if (!replyText && action) {
    const actionLabels = {
      create_event: `Tôi đã chuẩn bị tạo sự kiện "${action.input.title || ''}".`,
      create_task: `Tôi đã chuẩn bị thêm việc "${action.input.title || ''}".`,
      create_note: `Tôi đã tạo ghi chú "${action.input.title || ''}".`,
      create_transaction: `Tôi đã ghi nhận khoản ${action.input.category || ''} (${action.input.amount || 0}đ).`,
      toggle_habit: `Tôi đã đánh dấu thói quen "${action.input.title || ''}".`,
      draft_lead_reply: `Tôi đã soạn thư gửi cho ${action.input.leadName || 'khách hàng'}.`,
    };
    replyText = actionLabels[action.name] || 'Đã chuẩn bị thực hiện yêu cầu.';
  }

  return {
    reply: replyText || 'Đã xử lý yêu cầu của bạn.',
    action,
  };
}

/**
 * Gửi yêu cầu tới Cloud Function assistantChat hoặc direct fallback.
 */
export async function askAssistant({ message, history = [], context = {} }) {
  // 1. Thử gọi Cloud Function
  if (functions) {
    try {
      const chatFn = httpsCallable(functions, 'assistantChat');
      const result = await chatFn({ message, history, context });
      if (result?.data) {
        return result.data;
      }
    } catch (cfErr) {
      console.warn('[assistant] Cloud Function call error, falling back to direct Gemini API:', cfErr?.message);
    }
  }

  // 2. Fallback sang direct Gemini API qua HTTPS
  return callDirectGemini({ message, history, context });
}
