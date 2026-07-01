import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ExternalLink,
  TrendingUp,
  Clock,
  Zap,
  Lock,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Sparkles,
  Briefcase,
  GraduationCap,
  Users,
  Heart,
  Compass,
  ArrowRight,
  Monitor,
  Smartphone,
  MousePointerClick,
  LayoutDashboard,
  Rocket,
  ChevronDown
} from 'lucide-react';
import MockUI from './MockUI';
import { getShowcase } from '../data/showcases';
import useReveal from '../hooks/useReveal';

// Custom brand icon — Lucide removed brand glyphs after v0.400+
const Facebook = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

// Module-scoped so it survives in-app navigation (back from a project) but
// resets on a full page reload (F5) — the intro only reappears when refreshed.
let introSeen = false;

/* Full-screen intro gate: avatar + greeting shown on entry. Scroll / click /
   arrow key slides it up to reveal the page; it won't return until an F5. */
function IntroSplash({ profile, initials, onEnter }) {
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);
  const enter = useRef(() => {});
  enter.current = () => {
    if (done.current) return;
    done.current = true;
    setLeaving(true);
    window.setTimeout(() => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.scrollTo(0, 0);
      onEnter();
      // Absorb any trackpad momentum so the page settles at the very top.
      let f = 0;
      const pin = () => { window.scrollTo(0, 0); if (f++ < 12) requestAnimationFrame(pin); };
      requestAnimationFrame(pin);
    }, 720);
  };

  useEffect(() => {
    const html = document.documentElement;
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    // Lock BOTH html and body — the window scroller is usually the document
    // element, so locking body alone lets the page scroll behind the gate.
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    const go = () => enter.current();
    const onWheel = (e) => { e.preventDefault(); if (e.deltaY > 4) go(); };
    const onTouch = (e) => { e.preventDefault(); go(); };
    const onKey = (e) => { if (['ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) go(); };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchmove', onTouch, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('keydown', onKey);
      html.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className={`intro-splash ${leaving ? 'is-leaving' : ''}`} onClick={() => enter.current()} role="button" tabIndex={0} aria-label="Vào trang">
      <div className="intro-splash-bg" aria-hidden="true"><span className="aurora aurora-1" /><span className="aurora aurora-2" /></div>
      <div className="intro-splash-inner">
        <div className="intro-avatar-wrap">
          <span className="intro-avatar-ring" aria-hidden="true" />
          <div className={`intro-avatar ${profile.avatar ? 'has-image' : ''}`}>
            {profile.avatar ? <img src={profile.avatar} alt={profile.name} /> : initials}
          </div>
          <span className="intro-wave" aria-hidden="true">👋</span>
        </div>
        <div className="hero-eyebrow intro-hello"><span className="status-dot" /> Xin chào, rất vui được gặp bạn!</div>
        <h1 className="glow-text hero-title intro-name">Mình là {profile.name}</h1>
        <p className="intro-splash-tag">Cùng khám phá đôi lời giới thiệu &amp; các dự án của mình nhé.</p>
      </div>
      <button className="intro-scroll" onClick={(e) => { e.stopPropagation(); enter.current(); }} aria-label="Cuộn xuống để vào">
        <span>Cuộn xuống để vào</span>
        <ChevronDown size={22} />
      </button>
    </div>
  );
}

export default function Portfolio({ profile, projects, onAdminClick, onOpenProject }) {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [entered, setEntered] = useState(introSeen);
  const enterSite = () => { introSeen = true; setEntered(true); };

  // Premium motion: reveal-on-scroll across all sections.
  useReveal([projects.length]);

  // Tech ticker content — de-duped tools from CV skills + project stacks.
  const techTicker = useMemo(() => {
    const set = new Set();
    (profile.skillGroups || []).forEach((g) => (g.items || []).forEach((s) => set.add(s)));
    projects.forEach((p) => (p.tech || []).forEach((t) => set.add(t)));
    return Array.from(set);
  }, [profile.skillGroups, projects]);

  // Monogram initials from the profile name (last two words → e.g. "Tùng Lâm" → "TL")
  const initials = useMemo(() => {
    const parts = (profile.name || '').trim().split(/\s+/).filter(Boolean);
    return parts.slice(-2).map((w) => w[0]).join('').toUpperCase() || '✦';
  }, [profile.name]);

  // Skill groups come from the CV; fall back to tech compiled from projects.
  const skillGroups = useMemo(() => {
    if (Array.isArray(profile.skillGroups) && profile.skillGroups.length > 0) {
      return profile.skillGroups;
    }
    const set = new Set();
    projects.forEach((p) => Array.isArray(p.tech) && p.tech.forEach((t) => set.add(t)));
    return [{ label: 'Công nghệ & Công cụ', items: Array.from(set) }];
  }, [profile.skillGroups, projects]);

  const handleFormChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setContactForm({ name: '', email: '', message: '' });
      }, 5000);
    }
  };

  return (
    <div className="portfolio-root" style={{ position: 'relative', zIndex: 10 }}>
      {!entered && <IntroSplash profile={profile} initials={initials} onEnter={enterSite} />}
      <ScrollProgress />
      {/* Ambient aurora blobs */}
      <div className="aurora aurora-1" aria-hidden="true" />
      <div className="aurora aurora-2" aria-hidden="true" />

      {/* HEADER NAVBAR */}
      <header className="navbar glass-card">
        <div className="logo">
          <img src="/logo.png" alt="Logo" style={{ width: '34px', height: '34px', objectFit: 'cover', borderRadius: '50%', filter: 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.45))' }} />
          <span>Tùng Lâm Nguyễn</span>
        </div>
        <nav className="nav-links">
          <a href="#about" className="nav-link">Giới thiệu</a>
          <a href="#skills" className="nav-link">Kỹ năng</a>
          <a href="#journey" className="nav-link">Hành trình</a>
          <a href="#projects" className="nav-link">Dự án</a>
          <a href="#contact" className="nav-link">Liên hệ</a>
          <button onClick={onAdminClick} className="btn-secondary btn-sm">
            <Lock size={14} />
            <span>Console</span>
          </button>
        </nav>
      </header>

      {/* ABOUT — original two-column hero (job title removed) */}
      <section id="about" className="container hero">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="status-dot" /> Sẵn sàng cộng tác · {profile.location || 'Hà Nội'}
          </div>

          <h1 className="glow-text hero-title">{profile.name}</h1>

          <p className="hero-bio">{profile.bio}</p>

          <div className="hero-cta">
            <a href="#projects" className="btn-neon">Xem các dự án <Sparkles size={16} /></a>
            <a href="#contact" className="btn-secondary">Liên hệ với mình</a>
          </div>

          <div className="social-row">
            {profile.facebook && (
              <a href={profile.facebook} target="_blank" rel="noreferrer" className="social-icon" title="Facebook"><Facebook size={20} /></a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="social-icon" title="Email"><Mail size={20} /></a>
            )}
            {profile.behance && (
              <a href={profile.behance} target="_blank" rel="noreferrer" className="social-icon" title="Behance / Portfolio"><Compass size={20} /></a>
            )}
          </div>
        </div>

        {/* Profile quick-card */}
        <aside className="hero-card glass-card">
          <div className="avatar-wrap">
            <div className="avatar-glow" />
            <div
              onDoubleClick={onAdminClick}
              title="Nháy đúp để mở Admin Console bí mật"
              className={`avatar-container ${profile.avatar ? 'has-image' : ''}`}
            >
              {profile.avatar
                ? <img src={profile.avatar} alt={profile.name} />
                : initials}
            </div>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num"><CountUp value={projects.length} suffix="+" /></span>
              <span className="hero-stat-label">Dự án sản phẩm</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num"><CountUp value={skillGroups.length} /></span>
              <span className="hero-stat-label">Nhóm kỹ năng</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">AI</span>
              <span className="hero-stat-label">Design-first</span>
            </div>
          </div>

          <ul className="hero-card-facts">
            {profile.company && (
              <li><Briefcase size={15} /> <span>{profile.company}</span></li>
            )}
            {profile.location && (
              <li><MapPin size={15} /> <span>{profile.location}</span></li>
            )}
            {profile.education?.school && (
              <li>
                <GraduationCap size={15} />
                <span>{profile.education.major} · {profile.education.school}{profile.education.gpa ? ` (GPA ${profile.education.gpa})` : ''}</span>
              </li>
            )}
          </ul>
        </aside>
      </section>

      {/* TECH MARQUEE — infinite ticker of tools & stacks */}
      {techTicker.length > 0 && (
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...techTicker, ...techTicker].map((t, i) => (
              <span key={i} className="marquee-item"><span className="marquee-dot" />{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* SKILLS SECTION */}
      <section id="skills" className="container section">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Năng lực</span>
          <h2 className="glow-text">Kỹ năng Chuyên môn</h2>
          <p>Bộ kỹ năng được tổ chức theo nhóm như một Design System. Di chuột qua một chip để làm nổi bật các dự án có sử dụng kỹ năng đó.</p>
        </div>

        <div className="skill-grid">
          {skillGroups.map((group) => (
            <div key={group.label} className="glass-card skill-card">
              <h3 className="skill-card-title">{group.label}</h3>
              <div className="skill-chips">
                {group.items.map((skill) => (
                  <button
                    key={skill}
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    className={`badge skill-chip ${hoveredSkill === skill ? 'is-active' : ''}`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* JOURNEY: EXPERIENCE / ACTIVITIES / EDUCATION */}
      <section id="journey" className="container section">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Hành trình</span>
          <h2 className="glow-text-purple">Kinh nghiệm &amp; Học vấn</h2>
          <p>Quá trình làm sản phẩm thực tế — từ thiết kế hệ thống, ứng dụng AI đến chuẩn hoá quy trình Design–FE.</p>
        </div>

        <div className="journey-grid">
          <div className="journey-main">
            {(profile.experience || []).map((exp, i) => (
              <article key={i} className="glass-card timeline-item">
                <div className="timeline-icon"><Briefcase size={18} /></div>
                <div className="timeline-head">
                  <h3>{exp.role}</h3>
                  <span className="badge purple">{exp.period}</span>
                </div>
                <p className="timeline-org">{exp.company}</p>
                <ul className="timeline-points">
                  {(exp.points || []).map((pt, j) => (
                    <li key={j}><CheckCircle2 size={15} /> <span>{pt}</span></li>
                  ))}
                </ul>
              </article>
            ))}

            {(profile.activities || []).map((act, i) => (
              <article key={i} className="glass-card timeline-item">
                <div className="timeline-icon"><Users size={18} /></div>
                <div className="timeline-head">
                  <h3>{act.role}</h3>
                  <span className="badge purple">{act.period}</span>
                </div>
                <p className="timeline-org">{act.org}</p>
                <ul className="timeline-points">
                  {(act.points || []).map((pt, j) => (
                    <li key={j}><CheckCircle2 size={15} /> <span>{pt}</span></li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <aside className="journey-side">
            {profile.education && (
              <div className="glass-card edu-card">
                <div className="timeline-icon"><GraduationCap size={18} /></div>
                <h3>{profile.education.major}</h3>
                <p className="timeline-org">{profile.education.school}</p>
                <div className="edu-meta">
                  <span className="badge">{profile.education.period}</span>
                  {profile.education.gpa && <span className="badge primary">GPA {profile.education.gpa}</span>}
                </div>
              </div>
            )}

            {Array.isArray(profile.interests) && profile.interests.length > 0 && (
              <div className="glass-card edu-card">
                <div className="timeline-icon"><Heart size={18} /></div>
                <h3>Sở thích</h3>
                <div className="skill-chips">
                  {profile.interests.map((it) => (
                    <span key={it} className="badge">{it}</span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* EVENTS SECTION */}
      {Array.isArray(profile.events) && profile.events.length > 0 && (
        <section id="events" className="container section">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Dấu ấn</span>
            <h2 className="glow-text">Sự kiện &amp; Hoạt động Nổi bật</h2>
            <p>Các chương trình tiêu biểu đã trực tiếp tổ chức, điều phối hoặc cố vấn chuyên môn.</p>
          </div>
          <div className="grid-3 event-grid" style={{ gap: '20px' }}>
            {profile.events.map((evt, i) => {
              let badgeColor = 'rgba(0, 255, 136, 0.1)';
              let badgeText = 'var(--primary-color)';
              let iconColor = 'var(--primary-color)';
              
              if (evt.type.includes('cố vấn')) {
                badgeColor = 'rgba(139, 92, 246, 0.15)';
                badgeText = 'var(--secondary-color)';
                iconColor = 'var(--secondary-color)';
              } else if (evt.type.includes('Nội bộ')) {
                badgeColor = 'rgba(0, 240, 255, 0.15)';
                badgeText = 'var(--cyan-accent)';
                iconColor = 'var(--cyan-accent)';
              }
              
              return (
                <div 
                  key={i} 
                  className="glass-card event-card" 
                  data-reveal 
                  style={{ 
                    transitionDelay: `${(i % 3) * 100}ms`,
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '140px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span 
                        className="badge" 
                        style={{ 
                          backgroundColor: badgeColor, 
                          color: badgeText,
                          borderColor: 'transparent',
                          fontSize: '0.75rem',
                          padding: '4px 10px'
                        }}
                      >
                        {evt.type}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.4 }}>{evt.name}</h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: iconColor, marginRight: '8px' }} />
                    FPTU AI Club
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* PROJECTS SHOWCASE */}
      {(() => {
        const enriched = projects.map((p) => ({ project: p, showcase: getShowcase(p.id) }));
        const systems = enriched.filter((e) => !e.showcase || e.showcase.type === 'system');
        const landings = enriched.filter((e) => e.showcase && e.showcase.type === 'landing');

        return (
          <>
            <section id="projects" className="container section">
              <div className="section-head" data-reveal>
                <span className="eyebrow">Dự án nổi bật · Hệ thống nội bộ</span>
                <h2 className="glow-text">Sản phẩm &amp; Hệ thống đã triển khai</h2>
                <p>Các hệ thống thực tế: CRM, ERP nội bộ SPACE và Dashboard giám sát GA4. Mỗi dự án đều có bản Web &amp; Mobile — di chuột vào từng chức năng để xem mô tả trực tiếp trên demo.</p>
              </div>

              <div className="project-rows">
                {systems.map(({ project, showcase }, i) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    showcase={showcase}
                    hoveredSkill={hoveredSkill}
                    onOpen={onOpenProject}
                    index={i}
                    layout="row"
                    reverse={i % 2 === 1}
                  />
                ))}
              </div>
            </section>

            {landings.length > 0 && (
              <section id="landings" className="container section">
                <div className="section-head" data-reveal>
                  <span className="eyebrow">Landing Pages · Hiệu ứng cao cấp</span>
                  <h2 className="glow-text-purple">Bộ sưu tập Landing Page</h2>
                  <p>Bấm vào một landing để mở trang đầy đủ với hiệu ứng cuộn, parallax và bản Web/Mobile tương tác.</p>
                </div>

                <div className="grid-3 project-gallery">
                  {landings.map(({ project, showcase }, i) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      showcase={showcase}
                      hoveredSkill={hoveredSkill}
                      onOpen={onOpenProject}
                      index={i}
                      layout="tile"
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        );
      })()}

      {/* CONTACT */}
      <section id="contact" className="container section">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Liên hệ</span>
          <h2 className="glow-text">Kết Nối Với Mình</h2>
          <p>Bạn có ý tưởng sản phẩm hoặc cần một người thiết kế tỉ mỉ, hiểu cả quy trình dev? Nhắn cho mình nhé!</p>
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div className="glass-card contact-info">
            <h3>Thông tin liên hệ</h3>
            <ContactLine icon={<Mail size={20} />} tone="var(--primary-color)" toneBg="rgba(0,255,136,0.1)" label="Email" value={profile.email} href={profile.email ? `mailto:${profile.email}` : null} />
            {profile.phone && (
              <ContactLine icon={<Phone size={20} />} tone="var(--cyan-accent)" toneBg="rgba(0,240,255,0.1)" label="Điện thoại" value={profile.phone} href={`tel:${profile.phone.replace(/\s/g, '')}`} />
            )}
            {profile.facebook && (
              <ContactLine icon={<Facebook size={20} />} tone="var(--secondary-color)" toneBg="rgba(139,92,246,0.1)" label="Facebook" value="facebook.com/viva.tunglamng" href={profile.facebook} />
            )}
            {profile.location && (
              <ContactLine icon={<MapPin size={20} />} tone="var(--text-sub)" toneBg="rgba(255,255,255,0.05)" label="Khu vực" value={profile.location} />
            )}
          </div>

          <div className="glass-card">
            {formSubmitted ? (
              <div className="form-success">
                <div className="form-success-icon"><CheckCircle2 size={32} /></div>
                <h3>Gửi tin nhắn thành công!</h3>
                <p>Cảm ơn bạn đã liên hệ. Mình sẽ phản hồi lại sớm nhất có thể.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="contact-form">
                <div>
                  <label htmlFor="name">Họ và tên</label>
                  <input id="name" name="name" type="text" required value={contactForm.name} onChange={handleFormChange} className="glass-input" placeholder="Nguyễn Văn A" />
                </div>
                <div>
                  <label htmlFor="email">Địa chỉ Email</label>
                  <input id="email" name="email" type="email" required value={contactForm.email} onChange={handleFormChange} className="glass-input" placeholder="email@example.com" />
                </div>
                <div>
                  <label htmlFor="message">Nội dung lời nhắn</label>
                  <textarea id="message" name="message" rows="4" required value={contactForm.message} onChange={handleFormChange} className="glass-input" placeholder="Mình muốn trao đổi với bạn về..." />
                </div>
                <button type="submit" className="btn-neon" style={{ justifyContent: 'center', width: '100%', marginTop: '4px' }}>
                  Gửi lời nhắn <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} {profile.name}. Thiết kế bằng đam mê & code thủ công.
          <span onClick={onAdminClick} className="secret-dot" title="Console bí mật" />
        </p>
      </footer>
    </div>
  );
}

/* ---- Rich, interactive project card with web+mobile preview ---- */

function ProjectCard({ project, showcase, hoveredSkill, onOpen, index = 0, layout = 'tile', reverse = false }) {
  const [active, setActive] = useState(null);
  const previewRef = useRef(null);

  // Subtle 3D tilt on the device preview (transform-only → no layout shift).
  const handleTilt = (e) => {
    const el = previewRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-py * 5).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(px * 7).toFixed(2)}deg`);
  };
  const resetTilt = () => {
    const el = previewRef.current;
    if (el) { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); }
  };
  const isHighlighted = hoveredSkill ? (project.tech || []).includes(hoveredSkill) : false;
  const dimmed = hoveredSkill !== null && !isHighlighted;
  const accent = showcase?.accent || '#00ff88';
  const isLanding = showcase?.type === 'landing';
  const features = showcase?.features || [];
  const activeFeature = features.find((f) => f.zone === active);
  const metrics = project.metrics ? Object.values(project.metrics).filter(Boolean) : [];

  // No showcase (e.g. a project added later via Admin) → simple fallback card.
  if (!showcase) {
    return (
      <div className={`glass-card project-card ${isHighlighted ? 'is-highlighted' : ''} ${dimmed ? 'is-dimmed' : ''}`}>
        <div className="spotlight" />
        <div className="project-head"><h3>{project.title}</h3><div className="badge purple project-role">{project.role}</div></div>
        <p className="project-subtitle">{project.subtitle}</p>
        <div className="project-details">
          {(project.details || []).map((d, i) => (
            <div key={i} className="detail-row"><CheckCircle2 size={16} className="detail-icon" /><span>{d}</span></div>
          ))}
        </div>
        <div className="tech-row">{(project.tech || []).map((t) => <span key={t} className="badge" style={{ fontSize: '0.78rem', padding: '4px 10px' }}>{t}</span>)}</div>
      </div>
    );
  }

  const preview = (
    <div className="pc-preview" ref={previewRef} onClick={() => onOpen?.(project)} onMouseMove={handleTilt} onMouseLeave={resetTilt}>
      <div className="pc-browser">
        <div className="pc-browser-bar"><span className="pc-dots"><i /><i /><i /></span></div>
        <div className="pc-viewport">
          <div className="pc-scaler">
            <MockUI kind={showcase.web.kind} variant="web" accent={accent} active={active} onZone={setActive} theme={showcase.theme} brand={showcase.landing?.brand} />
          </div>
        </div>
      </div>
      <div className="pc-phone" aria-hidden="true">
        <div className="pc-phone-inner">
          <div className="pc-phone-scaler"><MockUI kind={showcase.mobile.kind} variant="mobile" accent={accent} theme={showcase.theme} brand={showcase.landing?.brand} /></div>
        </div>
      </div>
      <span className="pc-type" style={{ borderColor: accent, color: accent }}>
        {isLanding ? <Rocket size={12} /> : <LayoutDashboard size={12} />} {showcase.label}
      </span>
      <span className="pc-devices"><Monitor size={13} /><Smartphone size={13} /></span>
      <span className="pc-open" style={{ background: accent }}>{isLanding ? 'Mở Landing' : 'Mở Demo'} <ArrowRight size={13} /></span>
    </div>
  );

  const featureBlock = features.length > 0 ? (
    <>
      <div className="pc-features">
        {features.map((f) => (
          <button
            key={f.zone}
            className={`pc-feat ${active === f.zone ? 'is-on' : ''}`}
            style={active === f.zone ? { borderColor: accent, color: accent } : {}}
            onMouseEnter={() => setActive(f.zone)}
            onMouseLeave={() => setActive(null)}
            onClick={(e) => { e.stopPropagation(); onOpen?.(project); }}
          >
            <f.icon size={13} /> {f.title}
          </button>
        ))}
      </div>
      <div className={`pc-caption ${activeFeature ? 'is-visible' : ''}`}>
        {activeFeature ? <span><MousePointerClick size={12} style={{ color: accent }} /> {activeFeature.desc}</span>
          : <span className="pc-caption-idle">Di chuột vào một chức năng để xem nó dùng để làm gì →</span>}
      </div>
    </>
  ) : (
    <div className="pc-caption is-visible"><span><Sparkles size={12} style={{ color: accent }} /> {showcase.tagline}</span></div>
  );

  const techRow = (
    <div className="tech-row">
      {(project.tech || []).map((t) => (
        <span key={t} className={`badge ${hoveredSkill === t ? 'primary' : ''}`} style={{ fontSize: '0.76rem', padding: '4px 10px' }}>{t}</span>
      ))}
    </div>
  );

  const cta = (
    <button className="btn-neon pc-cta" style={{ borderColor: accent, color: accent }} onClick={() => onOpen?.(project)}>
      {isLanding ? 'Xem Landing Page' : 'Xem demo chi tiết'} <ArrowRight size={16} />
    </button>
  );

  /* Horizontal "case study" card — used for internal systems */
  if (layout === 'row') {
    return (
      <article
        className={`glass-card project-card--row ${reverse ? 'is-reverse' : ''} ${isHighlighted ? 'is-highlighted' : ''} ${dimmed ? 'is-dimmed' : ''}`}
        style={{ '--accent': accent, transitionDelay: `${index * 120}ms` }}
        data-reveal
      >
        <div className="pcrow-media">{preview}</div>
        <div className="pcrow-body">
          <span className="pcrow-eyebrow" style={{ color: accent }}><LayoutDashboard size={13} /> {showcase.label}</span>
          <h3 className="pcrow-title">{project.title}</h3>
          <p className="pcrow-sub">{project.subtitle}</p>
          {metrics.length > 0 && (
            <div className="pcrow-metrics">
              {metrics.map((m, i) => <span key={i} className="pcrow-metric" style={{ borderColor: `${accent}55` }}><span style={{ color: accent }}>●</span> {m}</span>)}
            </div>
          )}
          {featureBlock}
          {techRow}
          <div className="pcrow-actions">{cta}<span className="pcrow-period">{project.period}</span></div>
        </div>
      </article>
    );
  }

  /* Compact gallery tile — used for landing pages */
  return (
    <div
      className={`glass-card project-card project-card--rich project-card--tile ${isHighlighted ? 'is-highlighted' : ''} ${dimmed ? 'is-dimmed' : ''}`}
      style={{ '--accent': accent, transitionDelay: `${index * 80}ms` }}
      data-reveal
    >
      {preview}
      <div className="project-head"><h3>{project.title}</h3>{project.period && <span className="badge project-role">{project.period}</span>}</div>
      <p className="project-subtitle">{project.subtitle}</p>
      {featureBlock}
      {techRow}
      {cta}
    </div>
  );
}

/* ---- Premium motion helpers ---- */

function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  return <div className="scroll-progress" aria-hidden="true"><span style={{ width: `${p}%` }} /></div>;
}

function CountUp({ value, suffix = '', duration = 1400 }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(value); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !done.current) {
          done.current = true;
          const start = performance.now();
          const tick = (t) => {
            const k = Math.min(1, (t - start) / duration);
            setN(Math.round(value * (1 - Math.pow(1 - k, 3))));
            if (k < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);
  return <span ref={ref}>{n}{suffix}</span>;
}

/* ---- Small presentational helpers ---- */

function Metric({ icon, color, text }) {
  return (
    <div className="metric">
      <span style={{ color }}>{icon}</span>
      <span className="metric-text">{text}</span>
    </div>
  );
}

function ContactLine({ icon, tone, toneBg, label, value, href }) {
  const body = (
    <>
      <div className="contact-icon" style={{ background: toneBg, color: tone }}>{icon}</div>
      <div>
        <p className="contact-label">{label}</p>
        <p className="contact-value">{value}</p>
      </div>
    </>
  );
  return href ? (
    <a className="contact-line contact-link" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{body}</a>
  ) : (
    <div className="contact-line">{body}</div>
  );
}
