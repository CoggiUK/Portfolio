import React, { useState, useEffect } from 'react';
import BackgroundEffect from './components/BackgroundEffect';
import Portfolio from './components/Portfolio';
import Login from './components/Login';
import Admin from './components/Admin';

// Default static fallback data — mirrors server/db.json (Nguyễn Tùng Lâm's real CV)
const fallbackData = {
  profile: {
    name: "Nguyễn Tùng Lâm",
    title: "UI/UX Designer · hướng tới Product Designer",
    bio: "Mình áp dụng tư duy thiết kế lấy người dùng làm trung tâm cùng kỹ năng triển khai UI chi tiết (Interactive Components, cấu trúc Layout) để kiến tạo những sản phẩm số dễ dùng và thẩm mỹ. Trọng tâm của mình là không ngừng trau dồi quy trình làm sản phẩm thực tế và hướng tới vị trí Product Designer trong 3 năm tới.",
    email: "ntlam2211@gmail.com",
    phone: "0974 149 916",
    location: "Bồ Đề, Hà Nội",
    company: "Học viện Minh Trí Thành",
    facebook: "https://www.facebook.com/viva.tunglamng",
    github: "",
    linkedin: "",
    behance: "",
    education: {
      school: "Đại học FPT",
      major: "Kỹ thuật phần mềm",
      period: "2021 - 2024",
      gpa: "2.75"
    },
    experience: [
      {
        role: "UI/UX Designer",
        company: "Công ty Cổ phần Học viện Minh Trí Thành",
        period: "07/2025 - Hiện tại",
        points: [
          "Nghiên cứu và phát triển các chức năng hệ thống, phân tích hành vi người dùng trên Landing Page để đưa ra phương án tối ưu.",
          "Thiết kế & xây dựng hệ thống phân tích dữ liệu từ Landing kết hợp AI để đánh giá độ hiệu quả.",
          "Thiết kế giao diện CRM nội bộ và thiết lập bộ quy chuẩn design thống nhất giữa Design và Front-end.",
          "Chuyển đổi, tích hợp AI vào thiết kế hệ thống nhằm tự động hoá công việc và nâng cao trải nghiệm người dùng."
        ]
      }
    ],
    activities: [
      {
        role: "Ban Văn Hoá",
        org: "FPTU AI Club - Artificial Intelligence Researchers",
        period: "2021 - Hiện tại",
        points: [
          "Xây dựng và tổ chức các sự kiện cho câu lạc bộ.",
          "Lên ý tưởng trang trí và thiết kế sân khấu."
        ]
      }
    ],
    skillGroups: [
      { label: "UI/UX Design", items: ["Figma", "Auto Layout", "Component Sets", "Prototyping"] },
      { label: "Ứng dụng AI", items: ["Gemini", "Claude", "Stitch", "Antigravity"] },
      { label: "Lập trình & Kỹ thuật", items: ["Node.js", ".NET", "Git", "HTML/CSS", "Tư duy hệ thống & Hand-off"] },
      { label: "Phân tích dữ liệu", items: ["GA4", "GTM", "BigQuery", "Heatmap"] },
      { label: "Kỹ năng mềm / Quy trình", items: ["Problem Solving", "User Research"] }
    ],
    interests: ["Đi du lịch", "Nghiên cứu & tìm hiểu những điều mới"]
  },
  projects: [
    {
      id: "project-1",
      title: "AI-driven Analytics & Campaign Optimization Dashboard",
      subtitle: "Hệ thống Phân tích Dữ liệu & Tối ưu Chiến dịch Quảng cáo",
      role: "End-to-End Product Designer / Solo Developer",
      period: "07/2025 - Hiện tại",
      tech: ["Figma", "GTM", "GA4", "BigQuery", "Meta Ads API", "YouTube Ads API", "Gemini", "Claude"],
      metrics: {
        efficiency: "+40% Conversion Rate",
        loadTime: "-1.2s Page Load",
        roi: "+25% Marketing ROI"
      },
      details: [
        "UI/UX & Development: Thiết kế luồng trải nghiệm, giao diện trực quan và lập trình toàn trình (end-to-end) cho hệ thống Dashboard.",
        "Data Pipeline: Cấu hình tracking hành vi người dùng trên Landing Page qua GTM/GA4 và tự động hóa luồng lưu trữ dữ liệu trên BigQuery.",
        "API Integration: Tích hợp API trích xuất số liệu thực tế từ các chiến dịch Meta Ads và YouTube Ads.",
        "AI Optimization: Ứng dụng AI phân tích phễu chuyển đổi, đánh giá hiệu quả quảng cáo và tự động đề xuất chiến lược tối ưu (UI/UX, nội dung, target)."
      ],
      links: { live: "", github: "", figma: "" }
    },
    {
      id: "project-2",
      title: "Social Lead Automation & AI CRM Dashboard",
      subtitle: "Hệ thống Tự động hóa Lead & Quản trị Khách hàng",
      role: "End-to-End Product Designer / Solo Developer",
      period: "01/2026 - 03/2026",
      tech: ["Figma", "Meta Graph API", "CRM API", "Node.js", "Gemini", "Claude"],
      metrics: {
        leads: "+350% Leads Collected",
        response: "<5s Auto-Response",
        conversion: "+18% Lead Conversion"
      },
      details: [
        "UI/UX & System Build: Thiết kế trải nghiệm cho hệ thống quản trị nội bộ và trực tiếp lập trình, kết nối với Fanpage.",
        "Lead Data Pipeline: Xây dựng luồng tự động trích xuất khách hàng tiềm năng (leads) từ chiến dịch quảng cáo và đồng bộ real-time vào CRM.",
        "AI Auto-Responder: Tích hợp AI để phân tích ngữ cảnh tin nhắn và cá nhân hóa kịch bản phản hồi tức thì, tối ưu nguồn lực vận hành và tăng tỷ lệ chuyển đổi."
      ],
      links: { live: "", github: "", figma: "" }
    },
    {
      id: "project-3",
      title: "SPACE - Internal CRM & Quản trị Vận hành",
      subtitle: "Hệ thống Quản trị Nội bộ cốt lõi",
      role: "UI/UX Designer & Business Analyst",
      period: "03/2026 - Hiện tại",
      tech: ["Figma", "Stitch", "Claude", "Gemini", "Design System", "SRS"],
      metrics: {
        handoff: "2x Faster Handoff",
        consistency: "100% UI Consistency",
        adoption: "94% Internal Adoption"
      },
      details: [
        "Phân tích & Thiết kế (BA & UI/UX): Phân tích luồng nghiệp vụ nội bộ để thiết kế mới các tính năng và revamp toàn bộ giao diện cũ, nâng cao trải nghiệm cho nhân viên.",
        "Xây dựng Design System: Quy chuẩn hóa toàn bộ thành phần thiết kế sang hệ thống Component/Variant trên Figma để tối ưu khả năng tái sử dụng và đảm bảo tính nhất quán.",
        "Tối ưu Quy trình (Design-FE Handoff): Xây dựng bộ UI Guidelines thống nhất giữa Design và Front-end, giúp chuyển giao mượt mà, chính xác và tiết kiệm thời gian.",
        "AI Design Automation: Xây dựng bộ Design Rules / Prompt Guidelines chuyên biệt để ứng dụng AI tạo ra bản thiết kế chuẩn xác, bám sát nghiêm ngặt tài liệu đặc tả yêu cầu phần mềm (SRS)."
      ],
      links: { live: "", github: "", figma: "" }
    }
  ]
};

export default function App() {
  const [view, setView] = useState('portfolio'); // portfolio, login, admin
  const [token, setToken] = useState(localStorage.getItem('jwt_token') || '');
  const [expiresAt, setExpiresAt] = useState(parseInt(localStorage.getItem('jwt_expires') || '0'));
  
  const [profile, setProfile] = useState(fallbackData.profile);
  const [projects, setProjects] = useState(fallbackData.projects);

  // Read data from settings on mount or refresh
  const loadPortfolioData = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.profile) setProfile(data.profile);
        if (data.projects) setProjects(data.projects);
      }
    } catch (err) {
      console.warn('API Server is offline. Falling back to default static local data.', err);
    }
  };

  useEffect(() => {
    loadPortfolioData();

    // Routing path detection for secret setting page `/portal-admin`
    const path = window.location.pathname;
    if (path === '/portal-admin') {
      const isTokenValid = token && expiresAt > Date.now();
      if (isTokenValid) {
        setView('admin');
      } else {
        setView('login');
      }
    }

    // Handle back/forward buttons
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p === '/portal-admin') {
        const isTokenValid = token && expiresAt > Date.now();
        setView(isTokenValid ? 'admin' : 'login');
      } else {
        setView('portfolio');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [token, expiresAt]);

  const handleLoginSuccess = (jwtToken, expiry) => {
    setToken(jwtToken);
    setExpiresAt(expiry);
    localStorage.setItem('jwt_token', jwtToken);
    localStorage.setItem('jwt_expires', expiry.toString());
    setView('admin');
    window.history.pushState({}, '', '/portal-admin');
  };

  const handleLogout = () => {
    setToken('');
    setExpiresAt(0);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('jwt_expires');
    setView('portfolio');
    window.history.pushState({}, '', '/');
  };

  const navigateToAdminConsole = () => {
    const isTokenValid = token && expiresAt > Date.now();
    setView(isTokenValid ? 'admin' : 'login');
    window.history.pushState({}, '', '/portal-admin');
  };

  const navigateToPortfolio = () => {
    setView('portfolio');
    window.history.pushState({}, '', '/');
  };

  return (
    <>
      <BackgroundEffect />
      
      {view === 'portfolio' && (
        <Portfolio 
          profile={profile} 
          projects={projects} 
          onAdminClick={navigateToAdminConsole} 
        />
      )}

      {view === 'login' && (
        <Login 
          onLoginSuccess={handleLoginSuccess} 
          onBackToPortfolio={navigateToPortfolio} 
        />
      )}

      {view === 'admin' && (
        <Admin 
          token={token} 
          expiresAt={expiresAt} 
          onLogout={handleLogout}
          onUpdateData={loadPortfolioData}
        />
      )}
    </>
  );
}
