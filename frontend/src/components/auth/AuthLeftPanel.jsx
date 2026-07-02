import React from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * AuthLeftPanel – shared decorative left column used in Login/Register/ForgotPassword pages.
 */
export default function AuthLeftPanel({ badge, title, highlight, desc, features, cards }) {
  return (
    <div className="cu-left-panel">
      <div className="cu-left-inner">
        <div className="cu-brand-logo">
          <div className="cu-brand-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M4 20L10 14L14 18L20 10L24 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="14" cy="14" r="12" stroke="white" strokeWidth="2" opacity="0.3"/>
            </svg>
          </div>
          <span className="cu-brand-name">Yobid</span>
        </div>

        <div className="cu-hero">
          <div className="cu-hero-badge">{badge}</div>
          <h1 className="cu-hero-title">
            {title}
            {highlight && <span className="cu-hero-highlight"> {highlight}</span>}
          </h1>
          <p className="cu-hero-desc">{desc}</p>
          {features && (
            <div className="cu-feature-list">
              {features.map((f, i) => (
                <div className="cu-feature-item" key={i}>
                  <CheckCircle2 size={16} className="cu-check-icon" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {cards && (
          <div className="cu-mockup-cards">
            {cards.map((card, i) => (
              <div className={`cu-mock-card cu-mock-card--${i === 0 ? 'top' : 'mid'}`} key={i}>
                <div className="cu-mock-avatar" style={{ background: card.avatarBg }}>{card.avatarLetter}</div>
                <div className="cu-mock-info">
                  <div className="cu-mock-title">{card.title}</div>
                  <div className="cu-mock-sub">{card.sub}</div>
                </div>
                <div className={`cu-mock-badge cu-mock-badge--${card.badgeType}`}>{card.badge}</div>
              </div>
            ))}
          </div>
        )}

        <div className="cu-left-footer">© 2026 Yobid. All rights reserved.</div>
      </div>
    </div>
  );
}
