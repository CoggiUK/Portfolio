import React, { useState, useMemo, useRef, useEffect } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
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
  Award,
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
  ChevronDown,
  Code,
  Palette,
  Store,
  Milestone,
  Mouse,
  Menu,
  X
} from 'lucide-react';
import MockUI from './MockUI';
import { getShowcase } from '../data/showcases';
import useReveal from '../hooks/useReveal';
import useMediaQuery from '../hooks/useMediaQuery';

// Custom brand icon — Lucide removed brand glyphs after v0.400+
const Facebook = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const MountainIcon = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
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
      <div className="intro-splash-bg" aria-hidden="true">
        <span className="aurora aurora-1" />
        <span className="aurora aurora-2" />
        <div className="tech-bg-grid" />
        <div className="flying-planes-container">
          <div className="flying-plane plane-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </div>
          <div className="flying-plane plane-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </div>
          <span className="tech-float float-1">&lt;/&gt;</span>
          <span className="tech-float float-2">&#123; &#125;</span>
          <span className="tech-float float-3">[]</span>
          <span className="tech-float float-4">div</span>
          <span className="tech-float float-5">const</span>
        </div>
      </div>
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
        <Mouse size={18} style={{ marginRight: '6px', opacity: 0.85 }} />
        <span>Cuộn xuống để vào</span>
        <ChevronDown size={22} />
      </button>
    </div>
  );
}

/* Colour cycle for the climb: the summit always reads emerald, the rest
   alternate violet / cyan so adjacent stages stay visually distinct. */
const climbTone = (i, last) =>
  i === last
    ? { line: 'var(--primary-color)', glow: 'rgba(0, 255, 136, .40)' }
    : i % 2 === 0
      ? { line: 'var(--secondary-color)', glow: 'rgba(139, 92, 246, .40)' }
      : { line: 'var(--cyan-accent)', glow: 'rgba(0, 240, 255, .40)' };

/* Card body shared by both timeline layouts. */
function ClimbCardBody({ step }) {
  return (
    <>
      <div className="climb-tags">
        <span className="climb-camp">{step.camp}</span>
        <span className="climb-alt">ALT {step.altitude}</span>
      </div>
      <h3 className="climb-title">{step.title}</h3>
      <span className="climb-year">{step.year}</span>
      <p className="climb-desc">{step.desc}</p>
    </>
  );
}

/* Desktop: a winding bezier "road" with stages alternating above and below.
   Horizontally scrollable — the curve needs real width to read as a climb. */
function ClimbTimelineWinding({ steps }) {
  const total = steps.length;
  const STEP = 300;      // horizontal distance between stages
  const LEAD = 150;      // lead-in so the first card is never clipped at x=0
  const MID = 250;       // vertical centre of the curve
  const AMP = 80;        // how far the curve swings above/below centre
  const width = LEAD * 2 + (total - 1) * STEP;
  const height = 500;

  const nodeX = (i) => LEAD + i * STEP;
  const nodeY = (i) => MID + (i % 2 === 0 ? AMP : -AMP);

  let path = `M ${nodeX(0)} ${nodeY(0)}`;
  for (let i = 1; i < total; i++) {
    path += ` C ${nodeX(i - 1) + STEP / 2} ${nodeY(i - 1)}, ${nodeX(i) - STEP / 2} ${nodeY(i)}, ${nodeX(i)} ${nodeY(i)}`;
  }

  return (
    <div className="climb-scroll-outer" data-reveal>
      <div className="climb-scroll-inner" style={{ width: `${width}px`, height: `${height}px` }}>
        <svg className="climb-svg" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
          <defs>
            <linearGradient id="climb-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--primary-color)" />
              <stop offset="50%" stopColor="var(--secondary-color)" />
              <stop offset="100%" stopColor="var(--cyan-accent)" />
            </linearGradient>
          </defs>
          <path className="climb-path-glow" d={path} />
          <path className="climb-path" d={path} />
          {steps.map((_, i) => (
            <line
              key={i}
              className="climb-connector"
              x1={nodeX(i)} y1={nodeY(i)}
              x2={nodeX(i)} y2={i % 2 === 0 ? MID - 15 : MID + 15}
              stroke={climbTone(i, total - 1).line}
            />
          ))}
        </svg>

        {steps.map((step, i) => {
          const tone = climbTone(i, total - 1);
          const below = i % 2 === 0; // node sits below centre → card goes above
          return (
            <React.Fragment key={i}>
              <span
                className="climb-node"
                style={{ left: `${nodeX(i)}px`, top: `${nodeY(i)}px`, color: tone.line, borderColor: tone.line, boxShadow: `0 0 14px ${tone.glow}` }}
              >
                {getClimbIcon(step.icon)}
              </span>
              <article
                className="glass-card climb-card-horizontal"
                style={{ left: `${nodeX(i)}px`, top: below ? '30px' : `${MID + 30}px`, '--tone': tone.line }}
              >
                <ClimbCardBody step={step} />
              </article>
            </React.Fragment>
          );
        })}
      </div>
      <p className="climb-swipe-hint" aria-hidden="true">Cuộn ngang để đi hết hành trình →</p>
    </div>
  );
}

/* Mobile / tablet: a single vertical rail. Every stage keeps the same left
   edge, so nothing needs horizontal scrolling or off-screen positioning. */
function ClimbTimelineVertical({ steps }) {
  const total = steps.length;
  return (
    <ol className="climb-vertical">
      {steps.map((step, i) => {
        const tone = climbTone(i, total - 1);
        return (
          <li className="climb-v-item" key={i} data-reveal style={{ transitionDelay: `${Math.min(i, 5) * 60}ms` }}>
            <span
              className="climb-node climb-node--v"
              style={{ color: tone.line, borderColor: tone.line, boxShadow: `0 0 14px ${tone.glow}` }}
            >
              {getClimbIcon(step.icon)}
            </span>
            <article className="glass-card climb-card-v" style={{ '--tone': tone.line }}>
              <ClimbCardBody step={step} />
            </article>
          </li>
        );
      })}
    </ol>
  );
}

const getClimbIcon = (iconName) => {
  switch (iconName) {
    case 'GraduationCap': return <GraduationCap size={16} />;
    case 'Code': return <Code size={16} />;
    case 'Store': return <Store size={16} />;
    case 'Palette': return <Palette size={16} />;
    case 'Sparkles': return <Sparkles size={16} />;
    case 'Milestone': return <Milestone size={16} />;
    case 'Rocket': return <Rocket size={16} />;
    default: return <Award size={16} />;
  }
};

function MouseGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const onMouseMove = (e) => {
      requestAnimationFrame(() => {
        glow.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`;
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div 
      ref={glowRef}
      className="mouse-glow-bg"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 255, 136, 0.25) 0%, rgba(0, 255, 136, 0.06) 25%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 9999, // Render on top of background but below text/cursor overlay
        transform: 'translate(-999px, -999px)',
        willChange: 'transform',
        filter: 'blur(30px)',
        mixBlendMode: 'screen',
        opacity: 0.85
      }}
      aria-hidden="true"
    />
  );
}

const NAV_ITEMS = [
  { href: '#about', label: 'Giới thiệu' },
  { href: '#climb', label: 'Leo núi' },
  { href: '#skills', label: 'Kỹ năng' },
  { href: '#projects', label: 'Dự án' },
  { href: '#journey', label: 'Hành trình' },
  { href: '#events', label: 'Dấu ấn' },
  { href: '#contact', label: 'Liên hệ' },
];

export default function Portfolio({ profile, projects, onAdminClick, onOpenProject }) {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSending, setFormSending] = useState(false);
  const [formError, setFormError] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [entered, setEntered] = useState(introSeen);
  const [menuOpen, setMenuOpen] = useState(false);
  const enterSite = () => { introSeen = true; setEntered(true); };

  // Below this width the winding climb curve and the inline nav both stop
  // working, so each swaps to a layout built for a narrow, touch-first screen.
  const isCompact = useMediaQuery('(max-width: 900px)');

  // Derived, not synced: growing back to the desktop nav closes the drawer
  // without a state-sync effect that could leave a stale scroll lock behind.
  const drawerOpen = menuOpen && isCompact;

  // Escape closes it; the page behind stays put while it is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [drawerOpen]);

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
    if (formError) setFormError('');
  };

  // Lưu thẳng vào Firestore `leads`. Cloud Function `onLeadCreated` sẽ đẩy
  // push notification về app mobile ngay khi document được tạo.
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, message } = contactForm;
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setFormSending(true);
    setFormError('');
    try {
      await addDoc(collection(db, 'leads'), {
        name: name.trim().slice(0, 120),
        email: email.trim().slice(0, 160),
        phone: phone.trim().slice(0, 40),
        message: message.trim().slice(0, 4000),
        source: 'Website portfolio',
        page: window.location.pathname.slice(0, 300),
        userAgent: navigator.userAgent.slice(0, 300),
        status: 'new',
        read: false,
        createdAt: serverTimestamp(),
      });
      setFormSubmitted(true);
      setContactForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setFormSubmitted(false), 8000);
    } catch (err) {
      console.error('Gửi liên hệ thất bại', err);
      setFormError('Không gửi được lời nhắn. Bạn thử lại, hoặc email trực tiếp giúp mình nhé.');
    } finally {
      setFormSending(false);
    }
  };

  // Hero building blocks — shared by the desktop two-column layout and the
  // stacked mobile layout, so the two never drift out of sync.
  const heroAvatar = (
    <div className="avatar-wrap">
      <div className="avatar-glow" />
      <div
        onDoubleClick={onAdminClick}
        title="Nháy đúp để mở Admin Console bí mật"
        className={`avatar-container ${profile.avatar ? 'has-image' : ''}`}
      >
        {profile.avatar ? <img src={profile.avatar} alt={profile.name} /> : initials}
      </div>
    </div>
  );

  const heroEyebrow = (
    <div className="hero-eyebrow">
      <span className="status-dot" /> Sẵn sàng cộng tác · {profile.location || 'Hà Nội'}
    </div>
  );

  const heroStats = (
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
  );

  const heroFacts = (
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
          <span>{profile.education.major} · {profile.education.school}</span>
        </li>
      )}
    </ul>
  );

  const heroCta = (
    <div className="hero-cta">
      <a href="#projects" className="btn-neon">Xem các dự án <Sparkles size={16} /></a>
      <a href="#contact" className="btn-secondary">Liên hệ với mình</a>
    </div>
  );

  const heroSocial = (
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
  );

  return (
    <div className="portfolio-root" style={{ position: 'relative', zIndex: 10 }}>
      <MouseGlow />
      {!entered && <IntroSplash profile={profile} initials={initials} onEnter={enterSite} />}
      <ScrollProgress />
      {/* Ambient aurora blobs */}
      <div className="aurora aurora-1" aria-hidden="true" />
      <div className="aurora aurora-2" aria-hidden="true" />

      {/* Tech background elements & Flying Airplanes */}
      <div className="tech-bg-grid" aria-hidden="true" />
      <div className="flying-planes-container" aria-hidden="true">
        <div className="flying-plane plane-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </div>
        <div className="flying-plane plane-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </div>
        <span className="tech-float float-1">&lt;/&gt;</span>
        <span className="tech-float float-2">&#123; &#125;</span>
        <span className="tech-float float-3">[]</span>
        <span className="tech-float float-4">div</span>
        <span className="tech-float float-5">const</span>
      </div>

      {/* HEADER NAVBAR */}
      <header className="navbar glass-card">
        <div className="logo">
          <img src="/logo.png" alt="Logo" style={{ width: '34px', height: '34px', objectFit: 'cover', borderRadius: '50%', filter: 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.45))' }} />
          <span>Tùng Lâm Nguyễn</span>
        </div>
        <nav className="nav-links">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">{item.label}</a>
          ))}
          <button onClick={onAdminClick} className="btn-secondary btn-sm nav-console">
            <Lock size={14} />
            <span>Console</span>
          </button>
          <button
            className="nav-burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={drawerOpen}
            aria-controls="mobile-menu"
            aria-label={drawerOpen ? 'Đóng menu' : 'Mở menu'}
          >
            {drawerOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* MOBILE DRAWER — the same links, reachable on a phone */}
      <div
        className={`nav-scrim ${drawerOpen ? 'is-open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <nav id="mobile-menu" className={`mobile-menu ${drawerOpen ? 'is-open' : ''}`} aria-hidden={!drawerOpen}>
        <ul>
          {NAV_ITEMS.map((item, i) => (
            <li key={item.href} style={{ transitionDelay: drawerOpen ? `${60 + i * 35}ms` : '0ms' }}>
              <a href={item.href} onClick={() => setMenuOpen(false)}>
                <span>{item.label}</span>
                <ArrowRight size={16} />
              </a>
            </li>
          ))}
        </ul>
        <button
          className="btn-secondary mobile-menu-console"
          onClick={() => { setMenuOpen(false); onAdminClick(); }}
        >
          <Lock size={15} /> <span>Admin Console</span>
        </button>
      </nav>

      {/* ABOUT — desktop: two columns · mobile: a single, stacked column ordered
          avatar → name → bio → profile card → CTA (see the isCompact branch) */}
      <section id="about" className={`container hero ${isCompact ? 'is-compact' : ''}`}>
        {isCompact ? (
          <div className="hero-compact">
            <div className="hero-c-item">{heroAvatar}</div>
            <div className="hero-c-item">{heroEyebrow}</div>
            <h1 className="glow-text hero-title hero-c-item">{profile.name}</h1>
            <p className="hero-bio hero-c-item">{profile.bio}</p>
            <aside className="hero-card glass-card hero-card--compact hero-c-item">
              {heroStats}
              {heroFacts}
            </aside>
            <div className="hero-c-item">{heroCta}</div>
            <div className="hero-c-item">{heroSocial}</div>
          </div>
        ) : (
          <>
            <div className="hero-left">
              {heroEyebrow}
              <h1 className="glow-text hero-title">{profile.name}</h1>
              <p className="hero-bio">{profile.bio}</p>
              {heroCta}
              {heroSocial}
            </div>

            {/* Profile quick-card */}
            <aside className="hero-card glass-card">
              {heroAvatar}
              {heroStats}
              {heroFacts}
            </aside>
          </>
        )}
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

      {/* CLIMBING JOURNEY SECTION */}
      {Array.isArray(profile.climbingSteps) && profile.climbingSteps.length > 0 && (
        <section id="climb" className="container section">
          <div className="section-head" data-reveal>
            <span className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <MountainIcon size={14} /> Chinh phục
            </span>
            <h2 className="glow-text">Hành trình Leo núi Cuộc đời</h2>
            <p>Từng chặng đường, từng độ cao — nơi mình học, làm và lớn lên.</p>
          </div>

          {isCompact
            ? <ClimbTimelineVertical steps={profile.climbingSteps} />
            : <ClimbTimelineWinding steps={profile.climbingSteps} />}
        </section>
      )}

      {/* SKILLS SECTION */}
      <section id="skills" className="container section">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Năng lực</span>
          <h2 className="glow-text">Kỹ năng Chuyên môn</h2>
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

      {/* PROJECTS SHOWCASE */}
      {(() => {
        const enriched = projects.map((p) => ({ project: p, showcase: getShowcase(p.id) }));
        const systems = enriched.filter((e) => !e.showcase || e.showcase.type === 'system');
        const landings = enriched.filter((e) => e.showcase && e.showcase.type === 'landing');

        return (
          <>
            <section id="projects" className="container section">
              <div className="section-head" data-reveal>
                <span className="eyebrow">Dự án nổi bật</span>
                <h2 className="glow-text">Sản phẩm &amp; Hệ thống đã triển khai</h2>
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
                    isCompact={isCompact}
                  />
                ))}
              </div>
            </section>

            {landings.length > 0 && (
              <section id="landings" className="container section">
                <div className="section-head" data-reveal>
                  <span className="eyebrow">Landing Pages</span>
                  <h2 className="glow-text-purple">Bộ sưu tập Landing Page</h2>
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
                      isCompact={isCompact}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        );
      })()}

      {/* JOURNEY: EXPERIENCE / ACTIVITIES / EDUCATION */}
      <section id="journey" className="container section">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Hành trình</span>
          <h2 className="glow-text-purple">Kinh nghiệm &amp; Học vấn</h2>
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
          </div>
          <div className="event-grid">
            {profile.events.map((evt, i) => {
              // Colour-code by involvement so the three kinds read apart at a glance.
              const tone = evt.type.includes('cố vấn') ? 'purple'
                : evt.type.includes('Nội bộ') ? 'cyan'
                  : 'green';
              return (
                <article
                  key={i}
                  className={`glass-card event-card event-card--${tone}`}
                  data-reveal
                  style={{ transitionDelay: `${(i % 3) * 90}ms` }}
                >
                  <span className="event-type">{evt.type}</span>
                  <h3 className="event-name">{evt.name}</h3>
                  <span className="event-org"><i aria-hidden="true" />{evt.org || 'FPTU AI Club'}</span>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="container section">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Liên hệ</span>
          <h2 className="glow-text">Kết Nối Với Mình</h2>
          <p>Bạn có ý tưởng sản phẩm hoặc cần một người thiết kế tỉ mỉ, hiểu cả quy trình dev? Nhắn cho mình nhé!</p>
        </div>

        <div className="grid-2" style={{ alignItems: 'stretch' }}>
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
                <p>Cảm ơn bạn đã liên hệ. Tin nhắn đã tới thẳng điện thoại của mình — mình sẽ phản hồi sớm nhất có thể.</p>
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
                  <label htmlFor="phone">Số điện thoại <span className="label-optional">(không bắt buộc)</span></label>
                  <input id="phone" name="phone" type="tel" value={contactForm.phone} onChange={handleFormChange} className="glass-input" placeholder="09xx xxx xxx" />
                </div>
                <div>
                  <label htmlFor="message">Nội dung lời nhắn</label>
                  <textarea id="message" name="message" rows="4" required value={contactForm.message} onChange={handleFormChange} className="glass-input" placeholder="Mình muốn trao đổi với bạn về..." />
                </div>
                {formError && <p className="form-error" role="alert">{formError}</p>}
                <button type="submit" className="btn-neon" disabled={formSending} style={{ justifyContent: 'center', width: '100%', marginTop: '4px' }}>
                  {formSending ? 'Đang gửi…' : <>Gửi lời nhắn <Send size={16} /></>}
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

function ProjectCard({ project, showcase, hoveredSkill, onOpen, index = 0, layout = 'tile', reverse = false, isCompact = false }) {
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

  /* A desktop dashboard scaled to fit a 350px card renders its labels at ~6px —
     unreadable. On compact screens we show the design that actually belongs to
     that screen: the mobile mock, at full size, in a phone frame. */
  const preview = isCompact ? (
    <div className="pc-preview pc-preview--compact" onClick={() => onOpen?.(project)}>
      <div className="pc-phone-solo">
        <span className="pc-phone-solo-notch" aria-hidden="true" />
        <div className="pc-phone-solo-vp">
          <MockUI kind={showcase.mobile.kind} variant="mobile" accent={accent} theme={showcase.theme} brand={showcase.landing?.brand} />
        </div>
      </div>
      <span className="pc-type" style={{ borderColor: accent, color: accent }}>
        {isLanding ? <Rocket size={12} /> : <LayoutDashboard size={12} />} {showcase.label}
      </span>
      <span className="pc-devices"><Monitor size={13} /><Smartphone size={13} /></span>
    </div>
  ) : (
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

  /* Hover can't be expressed on a touch screen, so on compact viewports the
     same chips become tap-to-reveal (and the hint copy says so). */
  const featureBlock = features.length > 0 ? (
    <>
      <div className="pc-features">
        {features.map((f) => (
          <button
            key={f.zone}
            className={`pc-feat ${active === f.zone ? 'is-on' : ''}`}
            style={active === f.zone ? { borderColor: accent, color: accent } : {}}
            onMouseEnter={isCompact ? undefined : () => setActive(f.zone)}
            onMouseLeave={isCompact ? undefined : () => setActive(null)}
            onClick={(e) => {
              e.stopPropagation();
              if (isCompact) setActive((cur) => (cur === f.zone ? null : f.zone));
              else onOpen?.(project);
            }}
            aria-pressed={isCompact ? active === f.zone : undefined}
          >
            <f.icon size={13} /> {f.title}
          </button>
        ))}
      </div>
      <div className={`pc-caption ${activeFeature ? 'is-visible' : ''}`}>
        {activeFeature ? <span><MousePointerClick size={12} style={{ color: accent }} /> {activeFeature.desc}</span>
          : <span className="pc-caption-idle">
              {isCompact ? 'Chạm vào một chức năng để xem nó dùng để làm gì →' : 'Di chuột vào một chức năng để xem nó dùng để làm gì →'}
            </span>}
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
