import React, { useState } from 'react';
import { Monitor, Smartphone, MousePointerClick, Hand } from 'lucide-react';
import MockUI from './MockUI';
import useMediaQuery from '../hooks/useMediaQuery';

/* Browser + phone device frames wrapping a live MockUI.
   Hovering a feature card highlights the matching zone (and vice-versa),
   with a caption panel explaining what each function does. */
export default function DeviceShowcase({ showcase }) {
  const isCompact = useMediaQuery('(max-width: 720px)');
  // `null` means "follow the screen": a desktop dashboard squeezed into 360px is
  // unreadable, so phones land on the mobile design and stay in step through a
  // rotate — until the visitor picks a side, which then wins.
  const [chosen, setChosen] = useState(null);
  const device = chosen ?? (isCompact ? 'mobile' : 'web');
  const [active, setActive] = useState(null);
  const accent = showcase.accent || '#00ff88';
  const cfg = showcase[device] || showcase.web;
  const features = showcase.features || [];
  const activeFeature = features.find((f) => f.zone === active);

  const pick = (d) => { setChosen(d); setActive(null); };

  return (
    <div className="showcase">
      <div className="showcase-toolbar">
        <div className="seg">
          <button className={`seg-btn ${device === 'web' ? 'is-on' : ''}`} onClick={() => pick('web')}>
            <Monitor size={15} /> Web
          </button>
          <button className={`seg-btn ${device === 'mobile' ? 'is-on' : ''}`} onClick={() => pick('mobile')}>
            <Smartphone size={15} /> Mobile
          </button>
        </div>
        <span className="showcase-hint">
          {isCompact
            ? <><Hand size={13} /> Chạm vào chức năng bên dưới để xem mô tả</>
            : <><MousePointerClick size={13} /> Di chuột vào chức năng để xem mô tả</>}
        </span>
      </div>

      {showcase.deviceNote && (
        <div className="showcase-devnote" style={{ borderColor: `${accent}44` }}>
          {device === 'web'
            ? <><Monitor size={15} style={{ color: accent }} /> <b>Bản Web —</b> {showcase.deviceNote.web}</>
            : <><Smartphone size={15} style={{ color: accent }} /> <b>Bản Mobile —</b> {showcase.deviceNote.mobile}</>}
        </div>
      )}

      <div className={`showcase-stage device-${device}`} style={{ '--accent': accent }}>
        {device === 'web' ? (
          /* On a phone the desktop layout keeps its real proportions and the
             frame scrolls sideways — squashing it to 360px made every label
             illegible and broke the grid it is meant to demonstrate. */
          <div className="browser-scroll">
            <div className="browser-frame">
              <div className="browser-bar">
                <span className="browser-dots"><i /><i /><i /></span>
                <span className="browser-url">{showcase.web?.kind === 'landing' ? 'https://' : 'app.mtt.internal/'}{showcase.label?.split('· ')[1]?.toLowerCase().replace(/\s/g, '') || 'dashboard'}</span>
              </div>
              <div className="browser-viewport">
                <MockUI kind={cfg.kind} variant="web" accent={accent} active={active} onZone={setActive} brand={showcase.landing?.brand} />
              </div>
            </div>
          </div>
        ) : (
          <div className="phone-frame">
            <span className="phone-notch" />
            <div className="phone-viewport">
              <MockUI kind={cfg.kind} variant="mobile" accent={accent} active={active} onZone={setActive} brand={showcase.landing?.brand} />
            </div>
          </div>
        )}

        {/* Floating caption for the currently focused feature */}
        <div className={`showcase-caption ${activeFeature ? 'is-visible' : ''}`} style={{ borderColor: accent }}>
          {activeFeature && (
            <>
              <span className="showcase-caption-ic" style={{ color: accent }}><activeFeature.icon size={16} /></span>
              <div>
                <strong>{activeFeature.title}</strong>
                <p>{activeFeature.desc}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Feature list — hover to spotlight the matching zone */}
      <div className="showcase-features">
        {features.map((f) => (
          <button
            key={f.zone}
            className={`feature-chip ${active === f.zone ? 'is-on' : ''}`}
            style={active === f.zone ? { borderColor: accent, color: accent } : {}}
            onMouseEnter={isCompact ? undefined : () => setActive(f.zone)}
            onMouseLeave={isCompact ? undefined : () => setActive(null)}
            onFocus={isCompact ? undefined : () => setActive(f.zone)}
            onBlur={isCompact ? undefined : () => setActive(null)}
            onClick={isCompact ? () => setActive((cur) => (cur === f.zone ? null : f.zone)) : undefined}
            aria-pressed={isCompact ? active === f.zone : undefined}
          >
            <span className="feature-chip-ic" style={{ color: accent }}><f.icon size={16} /></span>
            <span className="feature-chip-body">
              <strong>{f.title}</strong>
              <span>{f.desc}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
