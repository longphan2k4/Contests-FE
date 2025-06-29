export const getBotResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  
  if (message.includes('thời gian') || message.includes('lịch thi') || message.includes('khi nào')) {
    return `📅 **Lịch thi Olympic Tin Học 2025:**\n\n• **Vòng sơ loại:** 24/03/2025 – 30/03/2025\n• **Vòng tứ kết & bán kết:** 31/03/2025 – 13/04/2025\n• **Vòng chung kết:** 14/04/2025 – 20/04/2025\n\nVòng sơ loại thi trực tiếp tại lớp học, các vòng còn lại thi trực tiếp trên sân khấu.`;
  }
  
  if (message.includes('môn thi') || message.includes('nội dung') || message.includes('lĩnh vực')) {
    return `📚 **8 lĩnh vực kiến thức thi:**\n\n1. **Lập trình (C/C++)** - Thuật toán, cấu trúc dữ liệu, OOP\n2. **Tin tức - Công nghệ** - Thông tin công nghệ 2025\n3. **Cơ sở dữ liệu** - CSDL, mô hình quan hệ, T-SQL\n4. **Phần cứng và mạng** - Cấu tạo máy tính, mạng LAN/WAN\n5. **Ứng dụng CNTT** - MS Office 2016 (Word, Excel, PowerPoint)\n6. **Thiết kế website** - HTML, CSS, JavaScript\n7. **Công nghệ phần mềm** - Mô hình phát triển, công cụ quản lý\n8. **Anh văn chuyên ngành** - Tiếng Anh IT`;
  }
  
  if (message.includes('giải thưởng') || message.includes('phần thưởng') || message.includes('tiền thưởng')) {
    return `🏆 **Cơ cấu giải thưởng:**\n\n• **Giải Nhất:** 3.000.000 đồng + giấy khen\n• **Giải Nhì:** 2.000.000 đồng + giấy khen\n• **Giải Ba:** 1.000.000 đồng + giấy khen\n• **Giải Video ấn tượng:** 1.000.000 đồng + giấy khen\n• **Giải GOLD:** Phần quà + giấy khen\n• **Giấy chứng nhận** cho thí sinh vào được chung kết`;
  }
  
  if (message.includes('đối tượng') || message.includes('ai được thi') || message.includes('tham gia')) {
    return `👥 **Đối tượng tham gia:**\n\nTất cả các lớp thuộc khoa CNTT đều có thể tham gia cuộc thi Olympic Tin Học 2025 - Đấu Trường Số.`;
  }
  
  if (message.includes('vòng sơ loại') || message.includes('sơ loại')) {
    return `📝 **Vòng sơ loại:**\n\n• **Hình thức:** Thi trắc nghiệm trực tiếp tại lớp học\n• **Thời gian:** 24/03/2025 – 30/03/2025\n• **Nội dung:** 30 câu hỏi theo đề cương cuộc thi\n• **Kết quả:** Chọn 20 thí sinh xuất sắc nhất (15 chính thức + 5 dự bị) vào vòng tứ kết\n• **Đặc biệt:** 3 đội từ khóa 22 được đặc cách vào bán kết`;
  }
  
  if (message.includes('tứ kết') || message.includes('video')) {
    return `🎬 **Vòng tứ kết:**\n\n• **Video giới thiệu:** Mỗi đội làm video 1.5-3 phút giới thiệu đội\n• **Nội dung video:** Tên đội, slogan, thành viên, mục tiêu\n• **Thi đấu:** Hình thức "Đấu trường số" với 13 câu hỏi\n• **Kết quả:** 20 thí sinh xuất sắc nhất vào bán kết\n• **Đặc biệt:** Thí sinh nhấn nút GOLD được vòng nguyệt quế + giấy khen + phần thưởng`;
  }
  
  if (message.includes('đấu trường số') || message.includes('cách thi')) {
    return `⚔️ **Hình thức "Đấu trường số":**\n\n• **13 câu hỏi** chia 4 mức độ:\n  - **Alpha:** 4 câu (15s/câu)\n  - **Beta:** 4 câu (20s/câu) \n  - **Release Candidate:** 4 câu (30s/câu)\n  - **GOLD:** 1 câu quyết định (30s)\n\n• **Cứu trợ "hồi sinh":** Có thể cứu thí sinh bị loại\n• **"Phao cứu trợ":** Hỗ trợ đặc biệt khi chỉ còn 1 thí sinh\n• **Câu GOLD:** Giành quyền trả lời bằng cách đưa tay`;
  }
  
  if (message.includes('fanpage') || message.includes('facebook') || message.includes('theo dõi')) {
    return `📱 **Thông tin theo dõi:**\n\nFanpage chính thức: https://www.facebook.com/olympicit.caothang/\n\nHãy theo dõi fanpage để cập nhật thông tin mới nhất về cuộc thi!`;
  }
  
  if (message.includes('bán kết')) {
    return `🏟️ **Vòng bán kết:**\n\n• **Hình thức:** "Đấu trường số"\n• **Kết quả:** 20 thí sinh xuất sắc nhất vào chung kết\n• **Cấu trúc:** 3 trận đấu cho các khóa 2022, 2023, 2024\n• **Tổng cộng:** 60 thí sinh được chọn vào vòng chung kết`;
  }
  
  if (message.includes('chung kết')) {
    return `👑 **Vòng chung kết:**\n\n• **Thời gian:** 14/04/2025 – 20/04/2025\n• **Hình thức:** "Đấu trường số"\n• **Kết quả:** Chọn 3 thí sinh xuất sắc nhất\n• **Tiêu chí:** Thí sinh nhấn GOLD, thứ tự câu hỏi, số câu trả lời đúng\n• **Đặc biệt:** Thí sinh nhấn GOLD được thêm giấy khen + 1 phần thưởng chiến thắng`;
  }
  
  if (message.includes('xin chào') || message.includes('hello') || message.includes('hi')) {
    return `Xin chào! Tôi rất vui được hỗ trợ bạn về cuộc thi Olympic Tin Học 2025 - Đấu Trường Số. Bạn muốn biết thông tin gì về cuộc thi?`;
  }
  
  return `Tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi về:\n\n• Thời gian thi\n• Nội dung môn thi\n• Giải thưởng\n• Quy trình các vòng thi\n• Hình thức thi đấu\n• Đối tượng tham gia\n\nHoặc bạn có thể đặt câu hỏi cụ thể hơn!`;
};

export const formatTimestamp = (date: Date): string => {
  return date.toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};