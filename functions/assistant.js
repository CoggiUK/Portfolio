import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = defineSecret('GEMINI_API_KEY');

const tools = [
  {
    functionDeclarations: [
      {
        name: 'create_event',
        description: 'Tạo một sự kiện hoặc lịch hẹn mới trong lịch cá nhân',
        parameters: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Tiêu đề cuộc hẹn / sự kiện' },
            start: { type: 'string', description: 'Thời gian bắt đầu (định dạng ISO 8601 hoặc YYYY-MM-DDTHH:mm)' },
            end: { type: 'string', description: 'Thời gian kết thúc (tuỳ chọn)' },
            location: { type: 'string', description: 'Địa điểm hoặc link họp trực tuyến' },
            notes: { type: 'string', description: 'Ghi chú thêm về cuộc hẹn' },
          },
          required: ['title', 'start'],
        },
      },
      {
        name: 'create_task',
        description: 'Tạo một công việc (todo/task) mới cần làm',
        parameters: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Nội dung hoặc tên công việc' },
            due: { type: 'string', description: 'Hạn hoàn thành (YYYY-MM-DD hoặc ISO)' },
            priority: {
              type: 'string',
              enum: ['low', 'normal', 'high'],
              description: 'Mức độ ưu tiên của công việc (low, normal, high)',
            },
          },
          required: ['title'],
        },
      },
      {
        name: 'create_note',
        description: 'Tạo một ghi chú mới',
        parameters: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Tiêu đề ghi chú' },
            body: { type: 'string', description: 'Nội dung chi tiết của ghi chú' },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Danh sách thẻ / tag phân loại',
            },
          },
          required: ['title', 'body'],
        },
      },
      {
        name: 'create_transaction',
        description: 'Ghi chép một khoản thu hoặc chi tiêu tài chính mới',
        parameters: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['in', 'out'],
              description: 'Khoản thu (in) hoặc chi (out)',
            },
            amount: { type: 'number', description: 'Số tiền giao dịch (VND)' },
            category: { type: 'string', description: 'Danh mục chi tiêu (Ăn uống, Di chuyển, Lương, Mua sắm...)' },
            note: { type: 'string', description: 'Ghi chú cho khoản chi' },
          },
          required: ['type', 'amount', 'category'],
        },
      },
      {
        name: 'toggle_habit',
        description: 'Điểm danh hoặc hoàn thành một thói quen trong ngày hôm nay',
        parameters: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Tên thói quen muốn đánh dấu hoàn thành' },
          },
          required: ['title'],
        },
      },
      {
        name: 'draft_lead_reply',
        description: 'Soạn thảo email trả lời khách hàng hoặc người liên hệ từ website',
        parameters: {
          type: 'object',
          properties: {
            leadId: { type: 'string', description: 'Mã định danh liên hệ nếu có' },
            leadName: { type: 'string', description: 'Tên người liên hệ' },
            email: { type: 'string', description: 'Email của người liên hệ' },
            replyText: { type: 'string', description: 'Nội dung email nháp phản hồi chuyên nghiệp và lịch sự' },
          },
          required: ['replyText'],
        },
      },
    ],
  },
];

export const assistantChat = onCall(
  {
    secrets: [geminiApiKey],
    region: 'asia-southeast1',
    maxInstances: 5,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Bạn cần đăng nhập để sử dụng Trợ lý AI.');
    }

    const { message, history = [], context = {} } = request.data || {};
    if (!message || typeof message !== 'string') {
      throw new HttpsError('invalid-argument', 'Nội dung tin nhắn không hợp lệ.');
    }

    let apiKey = '';
    try {
      apiKey = typeof geminiApiKey?.value === 'function' ? geminiApiKey.value() : '';
    } catch {
      apiKey = '';
    }
    apiKey = apiKey || process.env.GEMINI_API_KEY || process.env.GEMINI_API_TOKEN;

    if (!apiKey) {
      throw new HttpsError('failed-precondition', 'GEMINI_API_KEY chưa được thiết lập trên server.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const systemInstruction = `Bạn là Trợ lý AI cá nhân thông minh trong ứng dụng "Tùng Lâm Workspace".
Nhiệm vụ của bạn:
1. Hỗ trợ người dùng tra cứu thông tin, lịch trình, công việc, thói quen, tài chính, và các liên hệ gửi từ website.
2. Tóm tắt ngày làm việc, gợi ý các việc cần ưu tiên, nhắc nhở các việc sắp đến hạn hoặc quá hạn.
3. Khi người dùng muốn tạo lịch, thêm việc, ghi chú, ghi thu chi, điểm danh thói quen, hoặc soạn email trả lời khách hàng, hãy gọi tool/function tương ứng thật chính xác.
4. Trả lời ngắn gọn, thân thiện, tự nhiên, chuyên nghiệp bằng tiếng Việt.

Ngữ cảnh hiện tại của người dùng:
- Thời gian hiện tại: ${context.currentTime || new Date().toISOString()}
- Hôm nay: ${context.todaySummary || 'Không có tóm tắt'}
- Lịch hôm nay (${context.todayEventsCount || 0} sự kiện): ${JSON.stringify(context.todayEvents || [])}
- Việc quá hạn (${context.overdueTasksCount || 0} việc): ${JSON.stringify(context.overdueTasks || [])}
- Việc cần làm sắp tới: ${JSON.stringify(context.pendingTasks || [])}
- Liên hệ chưa đọc (${context.unreadLeadsCount || 0} liên hệ): ${JSON.stringify(context.unreadLeads || [])}
- Thói quen hôm nay: ${JSON.stringify(context.todayHabits || [])}
- Tài chính tháng này: Thu ${context.monthIncome || 0}đ, Chi ${context.monthExpense || 0}đ`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction,
      tools,
    });

    // Định dạng lịch sử chat gần nhất (tối đa 20 tin)
    const formattedHistory = (Array.isArray(history) ? history.slice(-20) : [])
      .map((item) => {
        const role = item.role === 'assistant' || item.role === 'model' ? 'model' : 'user';
        return {
          role,
          parts: [{ text: item.text || '' }],
        };
      })
      .filter((item) => item.parts[0].text.trim().length > 0);

    try {
      const chat = model.startChat({
        history: formattedHistory,
      });

      const result = await chat.sendMessage(message);
      const response = result.response;

      let action = null;
      const functionCalls = response.functionCalls();
      if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        action = {
          name: call.name,
          input: call.args || {},
        };
      }

      let reply = '';
      try {
        reply = response.text();
      } catch {
        // Trong trường hợp model chỉ trả functionCall mà không kèm text
        if (action) {
          const actionMap = {
            create_event: `Tôi đã chuẩn bị tạo lịch hẹn "${action.input.title || ''}".`,
            create_task: `Tôi đã chuẩn bị thêm việc "${action.input.title || ''}".`,
            create_note: `Tôi đã tạo ghi chú "${action.input.title || ''}".`,
            create_transaction: `Tôi đã ghi nhận giao dịch ${action.input.category || ''} (${action.input.amount || 0}đ).`,
            toggle_habit: `Tôi đã đánh dấu thói quen "${action.input.title || ''}".`,
            draft_lead_reply: `Tôi đã soạn thư nháp gửi cho ${action.input.leadName || 'khách hàng'}.`,
          };
          reply = actionMap[action.name] || 'Đã thực hiện yêu cầu của bạn.';
        }
      }

      return {
        reply: reply || 'Đã xử lý xong.',
        action,
      };
    } catch (err) {
      console.error('[assistantChat error]', err);
      throw new HttpsError('internal', err.message || 'Lỗi khi gọi Gemini AI.');
    }
  }
);
