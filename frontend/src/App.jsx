import React, { useState, useEffect } from 'react';
import BackgroundEffect from './components/BackgroundEffect';
import Portfolio from './components/Portfolio';
import Login from './components/Login';
import Admin from './components/Admin';
import ProjectDetail from './components/ProjectDetail';
import LandingPage from './components/LandingPage';
import { getShowcase } from './data/showcases';
import { api } from './api';

// Default static fallback data — mirrors server/db.json (Nguyễn Tùng Lâm's real CV)
const fallbackData = {
  profile: {
    name: "Nguyễn Tùng Lâm",
    title: "UI/UX Designer · hướng tới Product Designer",
    bio: "Mình là người thích biến những bài toán phức tạp thành trải nghiệm số gọn gàng, dễ dùng và có gu thẩm mỹ. Mình lấy người dùng làm trung tâm, tư duy theo hệ thống và tận dụng AI để đưa ý tưởng thành sản phẩm thật. Rất vui được gặp bạn ở đây — cùng dạo qua hành trình và các dự án của mình nhé!",
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
      { label: "Vận hành & Quản lý Dự án", items: ["Tổ chức Sự kiện", "Quản trị rủi ro", "Điều phối nhóm", "Phân bổ nguồn lực"] },
      { label: "Phân tích dữ liệu", items: ["GA4", "GTM", "BigQuery", "Heatmap"] },
      { label: "Kỹ năng mềm / Quy trình (Linh hoạt từ 5 năm làm sự kiện)", items: ["Giải quyết vấn đề", "Nghiên cứu người dùng", "Thích ứng nhanh", "Giao tiếp liên ban ngành", "Làm việc nhóm"] }
    ],
    events: [
      { name: "Vị tết 2021", type: "Ban tổ chức" },
      { name: "International Day 2021", type: "Ban tổ chức" },
      { name: "Retro Night 3, 4, 5", type: "Nội bộ - sinh nhật CLB" },
      { name: "AI FAIR", type: "Nội bộ - Tết" },
      { name: "POPAWA", type: "Nội bộ - teambuilding" },
      { name: "Wave FaIter", type: "Nội bộ - vai trò cố vấn" },
      { name: "FRUITY K-NIGHT", type: "Nội bộ - vai trò cố vấn" },
      { name: "và các sự kiện nội bộ khác nữa", type: "Khác" }
    ],
    interests: ["Đi du lịch", "Nghiên cứu & tìm hiểu những điều mới"]
  },
  projects: [
    {
      id: "project-1",
      title: "MTT Monitor — GA4 & Ads Tracking Dashboard",
      subtitle: "Hệ thống giám sát dữ liệu real-time (GA4 · Facebook Ads · Google Ads)",
      role: "End-to-End Product Designer / Solo Developer",
      period: "07/2025 - Hiện tại",
      tech: ["GA4", "BigQuery", "Google Gemini", "Facebook Ads API", "Google Ads API", "Node.js", "Express", "SQLite", "Vite", "Nginx + PM2"],
      metrics: {
        efficiency: "3-in-1 GA4 + FB + Google Ads",
        loadTime: "Realtime qua BigQuery",
        roi: "AI Gemini tự phân tích"
      },
      details: [
        "Bảng điều khiển hợp nhất: gộp dữ liệu GA4 (qua BigQuery), Facebook Ads và Google/YouTube Ads về một giao diện Glassmorphism.",
        "AI Insight: tích hợp Google Gemini tự động đọc biểu đồ và viết nhận định hiệu quả cho từng landing (Sự kiện, Phụ nữ, Minh Trí Thành).",
        "RBAC động: quản trị tài khoản, vai trò và endpoint; phân quyền nhận báo cáo email theo từng site.",
        "Tự động hoá: Cronjob gửi báo cáo định kỳ 10h sáng và cảnh báo khẩn khi chi phí Ads / click bất thường."
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
    },
    {
      id: "landing-academy",
      title: "MTT Academy — Landing tuyển sinh khoá học",
      subtitle: "Landing page chuyển đổi cao cho khoá Product Designer",
      role: "UI/UX Designer & Developer",
      period: "2026",
      tech: ["Figma", "React", "GSAP", "Responsive", "A/B Test", "SEO"],
      metrics: { efficiency: "+40% Đăng ký", loadTime: "-1.1s LCP", roi: "9,8% Conversion" },
      details: [
        "Thiết kế & dựng landing tuyển sinh với hero động, lộ trình học và social proof.",
        "Tối ưu chuyển đổi: CTA rõ ràng, form học thử, bảng giá ưu đãi khan hiếm.",
        "Hiệu ứng cuộn, parallax và bản mobile tối ưu tốc độ tải."
      ],
      links: { live: "", github: "", figma: "" }
    },
    {
      id: "landing-event",
      title: "TechSummit 2026 — Landing sự kiện",
      subtitle: "Landing bán vé sự kiện công nghệ với lịch trình & countdown",
      role: "UI/UX Designer & Developer",
      period: "2026",
      tech: ["Figma", "React", "Framer Motion", "Responsive", "Ticket Flow"],
      metrics: { efficiency: "2.000+ vé bán", loadTime: "Countdown realtime", roi: "+60% Early Bird" },
      details: [
        "Landing sự kiện với hero countdown, danh sách diễn giả và lịch trình theo giờ.",
        "Luồng đăng ký/mua vé Early Bird tối ưu chuyển đổi.",
        "Hiệu ứng chuyển cảnh mượt, bản mobile giữ nguyên trải nghiệm."
      ],
      links: { live: "", github: "", figma: "" }
    },
    {
      id: "landing-saas",
      title: "FlowSpace — Landing sản phẩm SaaS",
      subtitle: "Landing giới thiệu SaaS quản lý công việc nhóm",
      role: "UI/UX Designer & Developer",
      period: "2026",
      tech: ["Figma", "React", "Space Grotesk", "Pricing", "Onboarding"],
      metrics: { efficiency: "3x Năng suất", loadTime: "99.9% Uptime", roi: "12k+ đội nhóm" },
      details: [
        "Landing sản phẩm với các khối tính năng, tích hợp và bảng giá freemium.",
        "Nhấn mạnh tự động hoá AI và onboarding chỉ trong 1 phút.",
        "Thiết kế hiện đại, hiệu ứng nổi khối sản phẩm và bản mobile gọn gàng."
      ],
      links: { live: "", github: "", figma: "" }
    },
    {
      id: "landing-fnb",
      title: "Mộc — Landing Nhà hàng Việt",
      subtitle: "Landing F&B: thực đơn, không gian & đặt bàn",
      role: "UI/UX Designer & Developer",
      period: "2026",
      tech: ["Figma", "React", "Playfair Display", "Đặt bàn Online", "Responsive", "SEO Local"],
      metrics: { efficiency: "+35% Đặt bàn", loadTime: "Menu động", roi: "4.9★ Google" },
      details: [
        "Landing nhà hàng tông kem ấm, chữ serif sang trọng, hero giới thiệu không gian.",
        "Thực đơn đặc trưng dạng menu leader-dots với giá & nhãn món.",
        "Khối đặt bàn kèm giờ mở cửa, địa chỉ và bản mobile tối ưu."
      ],
      links: { live: "", github: "", figma: "" }
    },
    {
      id: "landing-shop",
      title: "LUXE — Landing Thời trang / TMĐT",
      subtitle: "Landing bộ sưu tập thời trang, lookbook & giỏ hàng",
      role: "UI/UX Designer & Developer",
      period: "2026",
      tech: ["Figma", "React", "Space Grotesk", "Product Grid", "Cart", "A/B Test"],
      metrics: { efficiency: "+28% Add-to-cart", loadTime: "Freeship 0đ", roi: "4.8★" },
      details: [
        "Landing editorial trắng–đen hiện đại, hero chữ lớn dẫn dắt bộ sưu tập.",
        "Lưới sản phẩm với giá, nhãn Sale/New và banner flash sale.",
        "Các cam kết mua sắm (freeship, đổi trả) và bản mobile 2 cột."
      ],
      links: { live: "", github: "", figma: "" }
    },
    {
      id: "landing-spa",
      title: "Lụa Spa — Landing Spa & Làm đẹp",
      subtitle: "Landing spa: dịch vụ, liệu trình & đặt lịch",
      role: "UI/UX Designer & Developer",
      period: "2026",
      tech: ["Figma", "React", "Cormorant", "Booking", "Responsive"],
      metrics: { efficiency: "+42% Đặt lịch", loadTime: "Liệu trình rõ", roi: "4.9★" },
      details: [
        "Landing spa tông pastel mềm mại, chữ serif thanh lịch, cảm giác an yên.",
        "Danh sách dịch vụ kèm thời lượng & giá, gói liệu trình nổi bật.",
        "Khối đặt lịch hẹn và bản mobile giữ trọn trải nghiệm."
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
  const [activeProject, setActiveProject] = useState(null); // opened project (detail/landing)

  // Read data from settings on mount or refresh
  const loadPortfolioData = async () => {
    try {
      const res = await fetch(api('/api/settings'));
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
    } else {
      // Deep-link to a project/landing via ?p=<id> (shareable URL)
      const pid = new URLSearchParams(window.location.search).get('p');
      if (pid && getShowcase(pid)) {
        const proj = fallbackData.projects.find((p) => p.id === pid);
        if (proj) { setActiveProject(proj); setView('project'); }
      }
    }

    // Handle back/forward buttons
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p === '/portal-admin') {
        const isTokenValid = token && expiresAt > Date.now();
        setView(isTokenValid ? 'admin' : 'login');
        return;
      }
      const pid = new URLSearchParams(window.location.search).get('p');
      if (pid && getShowcase(pid)) {
        const proj = fallbackData.projects.find((x) => x.id === pid);
        if (proj) { setActiveProject(proj); setView('project'); return; }
      }
      setActiveProject(null);
      setView('portfolio');
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

  const openProject = (project) => {
    if (!getShowcase(project.id)) return; // only projects with a showcase are openable
    setActiveProject(project);
    setView('project');
    window.scrollTo(0, 0);
    window.history.pushState({}, '', `?p=${project.id}`);
  };

  const closeProject = () => {
    setActiveProject(null);
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
          onOpenProject={openProject}
        />
      )}

      {view === 'project' && activeProject && (() => {
        const showcase = getShowcase(activeProject.id);
        if (!showcase) { closeProject(); return null; }
        return showcase.type === 'landing'
          ? <LandingPage project={activeProject} showcase={showcase} onBack={closeProject} />
          : <ProjectDetail project={activeProject} showcase={showcase} onBack={closeProject} />;
      })()}

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
