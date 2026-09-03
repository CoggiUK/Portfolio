import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  ArrowLeft, ExternalLink, CheckCircle2, TrendingUp, Clock, Zap,
  Sparkles, Layers, Monitor, Smartphone, Image as ImageIcon, X,
} from 'lucide-react';
import DeviceShowcase from './DeviceShowcase';
import MockUI from './MockUI';
import useReveal from '../hooks/useReveal';

/* Full detail page for an internal-system project: hero, interactive
   web+mobile device showcase, feature grid, metrics, tech, details. */
export default function ProjectDetail({ project, showcase, onBack }) {
  const accent = showcase?.accent || '#00ff88';
  const [images, setImages] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, [project.id]);

  // Ảnh demo được lưu ở document riêng nên chỉ tải khi mở trang chi tiết.
  useEffect(() => {
    let alive = true;
    setImages([]);
    getDoc(doc(db, 'settings', `media-${project.id}`))
      .then((snap) => { if (alive && snap.exists()) setImages(snap.data().images || []); })
      .catch(() => {});
    return () => { alive = false; };
  }, [project.id]);

  useReveal([project.id, images.length]);

  // Đóng lightbox bằng phím Esc.
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const metrics = project.metrics ? Object.values(project.metrics).filter(Boolean) : [];
  const metricIcons = [<TrendingUp size={18} />, <Clock size={18} />, <Zap size={18} />];

  return (
    <div className="detail-root" style={{ '--accent': accent }}>
      <div className="aurora aurora-1" aria-hidden="true" />
      <div className="aurora aurora-2" aria-hidden="true" />

      <header className="navbar glass-card detail-nav">
        <button onClick={onBack} className="btn-secondary btn-sm"><ArrowLeft size={15} /> Portfolio</button>
        <span className="detail-nav-label" style={{ color: accent }}>{showcase?.label || 'Dự án'}</span>
        <div className="detail-nav-devices"><Monitor size={15} /><Smartphone size={15} /></div>
      </header>

      <section className="container detail-hero" data-reveal>
        <span className="detail-eyebrow" style={{ borderColor: accent, color: accent }}>
          <Sparkles size={14} /> {showcase?.label || 'Dự án'}
        </span>
        <h1 className="detail-title" style={{ backgroundImage: `linear-gradient(120deg, #ffffff, ${accent})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{project.title}</h1>
        <p className="detail-sub" style={{ color: accent }}>{project.subtitle}</p>
        {showcase?.tagline && <p className="detail-tagline">{showcase.tagline}</p>}
        <div className="detail-meta">
          <span className="badge purple">{project.role}</span>
          {project.period && <span className="badge">{project.period}</span>}
          {showcase && <span className="badge primary"><Layers size={13} /> Web &amp; Mobile</span>}
        </div>
      </section>

      {showcase && (
        <section className="container detail-showcase-wrap" data-reveal>
          <DeviceShowcase showcase={showcase} />
        </section>
      )}

      {metrics.length > 0 && (
        <section className="container detail-metrics" data-reveal>
          {metrics.map((m, i) => (
            <div key={i} className="glass-card detail-metric">
              <span className="detail-metric-ic" style={{ color: accent }}>{metricIcons[i % 3]}</span>
              <span className="detail-metric-val">{m}</span>
            </div>
          ))}
        </section>
      )}

      {/* Ảnh demo thực tế tải lên từ trang quản trị */}
      {images.length > 0 && (
        <section className="container detail-screens" data-reveal>
          <div className="detail-screens-head">
            <span className="detail-eyebrow" style={{ borderColor: accent, color: accent }}>
              <ImageIcon size={14} /> Ảnh demo
            </span>
            <h2 style={{ color: accent }}>Hình ảnh thực tế của sản phẩm</h2>
            <p>Nhấn vào ảnh để xem ở kích thước lớn.</p>
          </div>
          <div className="photo-gallery">
            {images.map((img, i) => (
              <figure
                key={img.id || i}
                className="glass-card photo-card"
                data-reveal
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
                onClick={() => setLightbox(img)}
              >
                <img src={img.src} alt={img.caption || `${project.title} — ảnh ${i + 1}`} loading="lazy" />
                {img.caption && <figcaption>{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}

      {lightbox && (
        <div className="photo-lightbox" onClick={() => setLightbox(null)} role="dialog" aria-modal="true">
          <button className="photo-lightbox-close" onClick={() => setLightbox(null)} aria-label="Đóng"><X size={20} /></button>
          <img src={lightbox.src} alt={lightbox.caption || project.title} onClick={(e) => e.stopPropagation()} />
          {lightbox.caption && <p>{lightbox.caption}</p>}
        </div>
      )}

      {/* Gallery of the actual designed feature screens */}
      {Array.isArray(showcase?.screens) && showcase.screens.length > 0 && (
        <section className="container detail-screens" data-reveal>
          <div className="detail-screens-head">
            <span className="detail-eyebrow" style={{ borderColor: accent, color: accent }}>Màn hình chức năng</span>
            <h2 style={{ color: accent }}>Một số màn đã thiết kế</h2>
            <p>Các màn hình chính trong hệ thống — dựng lại từ bản thiết kế thực tế.</p>
          </div>
          <div className="screen-gallery">
            {showcase.screens.map((s, i) => (
              <figure key={s.name} className={`glass-card screen-card ${s.wide ? 'screen-card--wide' : ''}`} data-reveal style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
                <div className="screen-frame">
                  <div className="screen-bar"><span className="screen-dots"><i /><i /><i /></span><span className="screen-name">{s.name}</span></div>
                  <div className="screen-vp"><MockUI kind={s.kind} accent={accent} theme={showcase.theme} /></div>
                </div>
                <figcaption className="screen-cap"><span className="screen-idx" style={{ color: accent, borderColor: `${accent}55` }}>{String(i + 1).padStart(2, '0')}</span><div><h3>{s.name}</h3><p>{s.desc}</p></div></figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="container detail-info" data-reveal>
        <div className="glass-card detail-panel">
          <h3>Vai trò &amp; Triển khai</h3>
          <ul className="detail-points">
            {(project.details || []).map((d, i) => (
              <li key={i}><CheckCircle2 size={15} style={{ color: accent }} /> <span>{d}</span></li>
            ))}
          </ul>
        </div>
        <div className="detail-info-side">
          <div className="glass-card detail-panel">
            <h3>Công nghệ</h3>
            <div className="tech-row">{(project.tech || []).map((t) => <span key={t} className="badge">{t}</span>)}</div>
          </div>
          {project.links && Object.values(project.links).some(Boolean) && (
            <div className="glass-card detail-panel">
              <h3>Liên kết</h3>
              <div className="project-links" style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}>
                {project.links.live && <a href={project.links.live} target="_blank" rel="noreferrer" className="btn-neon btn-sm">Live <ExternalLink size={14} /></a>}
                {project.links.github && <a href={project.links.github} target="_blank" rel="noreferrer" className="btn-secondary btn-sm">GitHub <ExternalLink size={14} /></a>}
                {project.links.figma && <a href={project.links.figma} target="_blank" rel="noreferrer" className="btn-secondary btn-sm">Figma <ExternalLink size={14} /></a>}
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <button onClick={onBack} className="btn-secondary"><ArrowLeft size={15} /> Quay lại Portfolio</button>
      </footer>
    </div>
  );
}
