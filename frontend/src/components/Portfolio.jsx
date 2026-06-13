import React, { useState, useMemo } from 'react';
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
  Compass
} from 'lucide-react';

// Custom brand icon — Lucide removed brand glyphs after v0.400+
const Facebook = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function Portfolio({ profile, projects, onAdminClick }) {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

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
      {/* Ambient aurora blobs */}
      <div className="aurora aurora-1" aria-hidden="true" />
      <div className="aurora aurora-2" aria-hidden="true" />

      {/* HEADER NAVBAR */}
      <header className="navbar glass-card">
        <div className="logo">
          <span className="logo-mark">{initials}</span>
          <span>{profile.name?.split(' ').pop()}</span>
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

      {/* HERO SECTION */}
      <section id="about" className="container hero">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="status-dot" /> Sẵn sàng cộng tác · {profile.location || 'Hà Nội'}
          </div>

          <h1 className="glow-text hero-title">{profile.name}</h1>
          <h2 className="glow-text-purple hero-subtitle">{profile.title}</h2>

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

        {/* Profile quick-card — fills horizontal space, removes the empty gap */}
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
              <span className="hero-stat-num">{projects.length}</span>
              <span className="hero-stat-label">Dự án sản phẩm</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">{skillGroups.length}</span>
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

      {/* SKILLS SECTION */}
      <section id="skills" className="container section">
        <div className="section-head">
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
        <div className="section-head">
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

      {/* PROJECTS SHOWCASE */}
      <section id="projects" className="container section">
        <div className="section-head">
          <span className="eyebrow">Sản phẩm</span>
          <h2 className="glow-text">Các Dự Án Đã Triển Khai</h2>
          <p>Hệ thống sản phẩm từ nghiên cứu, thiết kế UX/UI cho đến lập trình hoàn thiện và tích hợp AI.</p>
        </div>

        <div className="grid-2">
          {projects.map((project) => {
            const isHighlighted = hoveredSkill ? project.tech.includes(hoveredSkill) : false;
            const dimmed = hoveredSkill !== null && !isHighlighted;
            const hasLinks = project.links && Object.values(project.links).some(Boolean);

            return (
              <div
                key={project.id}
                className={`glass-card project-card ${isHighlighted ? 'is-highlighted' : ''} ${dimmed ? 'is-dimmed' : ''}`}
              >
                <div className="spotlight" />

                <div>
                  <div className="project-head">
                    <h3>{project.title}</h3>
                    <div className="badge purple project-role">{project.role}</div>
                  </div>
                  <p className="project-subtitle">{project.subtitle}</p>
                  {project.period && <p className="project-period">{project.period}</p>}
                </div>

                {/* Performance metrics */}
                {project.metrics && Object.keys(project.metrics).length > 0 && (
                  <div className="metrics-grid">
                    {project.metrics.efficiency && <Metric icon={<TrendingUp size={16} />} color="var(--primary-color)" text={project.metrics.efficiency} />}
                    {project.metrics.loadTime && <Metric icon={<Clock size={16} />} color="var(--cyan-accent)" text={project.metrics.loadTime} />}
                    {project.metrics.roi && <Metric icon={<Zap size={16} />} color="var(--secondary-color)" text={project.metrics.roi} />}
                    {project.metrics.leads && <Metric icon={<TrendingUp size={16} />} color="var(--primary-color)" text={project.metrics.leads} />}
                    {project.metrics.response && <Metric icon={<Clock size={16} />} color="var(--cyan-accent)" text={project.metrics.response} />}
                    {project.metrics.conversion && <Metric icon={<Zap size={16} />} color="var(--secondary-color)" text={project.metrics.conversion} />}
                    {project.metrics.handoff && <Metric icon={<TrendingUp size={16} />} color="var(--primary-color)" text={project.metrics.handoff} />}
                    {project.metrics.consistency && <Metric icon={<CheckCircle2 size={16} />} color="var(--cyan-accent)" text={project.metrics.consistency} />}
                    {project.metrics.adoption && <Metric icon={<Zap size={16} />} color="var(--secondary-color)" text={project.metrics.adoption} />}
                  </div>
                )}

                {/* Details */}
                <div className="project-details">
                  {project.details.map((detail, idx) => (
                    <div key={idx} className="detail-row">
                      <CheckCircle2 size={16} className="detail-icon" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Tech tags */}
                <div className="tech-row">
                  {project.tech.map((t) => (
                    <span key={t} className={`badge ${hoveredSkill === t ? 'primary' : ''}`} style={{ fontSize: '0.78rem', padding: '4px 10px' }}>{t}</span>
                  ))}
                </div>

                {/* Action links (only when present) */}
                {hasLinks && (
                  <div className="project-links">
                    {project.links.live && (
                      <a href={project.links.live} target="_blank" rel="noreferrer" className="btn-neon btn-sm">Live Demo <ExternalLink size={14} /></a>
                    )}
                    {project.links.github && (
                      <a href={project.links.github} target="_blank" rel="noreferrer" className="btn-secondary btn-sm">GitHub <ExternalLink size={14} /></a>
                    )}
                    {project.links.figma && (
                      <a href={project.links.figma} target="_blank" rel="noreferrer" className="btn-secondary btn-sm">Figma <ExternalLink size={14} /></a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="container section">
        <div className="section-head">
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
