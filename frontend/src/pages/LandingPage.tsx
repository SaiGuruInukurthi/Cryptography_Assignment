import React from 'react';
import { useNavigate } from 'react-router-dom';

const ALGORITHMS = [
  {
    name: 'Playfair Cipher',
    tag: 'playfair',
    desc: 'A digraph substitution cipher using a 5\u00D75 key matrix to encrypt pairs of letters.',
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="40" height="40" rx="4" />
        <line x1="4" y1="12" x2="44" y2="12" />
        <line x1="4" y1="20" x2="44" y2="20" />
        <line x1="4" y1="28" x2="44" y2="28" />
        <line x1="4" y1="36" x2="44" y2="36" />
        <line x1="12" y1="4" x2="12" y2="44" />
        <line x1="20" y1="4" x2="20" y2="44" />
        <line x1="28" y1="4" x2="28" y2="44" />
        <line x1="36" y1="4" x2="36" y2="44" />
      </svg>
    ),
  },
  {
    name: 'Two-Columnar',
    tag: 'two_columnar',
    desc: 'A double-pass columnar transposition cipher that rearranges plaintext by column order.',
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="6" y="4" width="12" height="40" rx="3" />
        <rect x="30" y="4" width="12" height="40" rx="3" />
        <path d="M18 16 l12 0" strokeDasharray="3 2" />
        <path d="M18 24 l12 0" strokeDasharray="3 2" />
        <path d="M18 32 l12 0" strokeDasharray="3 2" />
      </svg>
    ),
  },
  {
    name: 'SHA-512',
    tag: 'sha512',
    desc: 'A cryptographic hash function producing a fixed 512-bit digest. One-way, no decryption.',
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="24" cy="24" r="18" />
        <path d="M24 6 v36" />
        <path d="M6 24 h36" />
        <path d="M11 11 l26 26" opacity="0.4" />
        <path d="M37 11 l-26 26" opacity="0.4" />
      </svg>
    ),
  },
];

const TEAMMATES = [
  { name: 'Inukurthi Sri Venkata Sai Guru', roll: '2023003611' },
  { name: 'B Vishwajanani', roll: '2023001493' },
  { name: 'K Akhila Varma', roll: '2023003717' },
  { name: 'Varsha Sathya Narayana', roll: '202001431' },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* ── Hero ───────────────────────────────── */}
      <section className="landing-hero">
        <div className="hero-badge">internship case study · sem 6</div>
        <h1 className="hero-title">
          <span className="hero-prompt">{'>'}</span> crypto_terminal{' '}
          <span className="cursor-blink">_</span>
        </h1>
        <p className="hero-tagline">
          Encrypt. Decrypt. Hash.
          <br />
          <span className="hero-tagline-dim">
            Internship case study for practical secure-systems learning.
          </span>
        </p>
        <button
          className="hero-cta"
          onClick={() => navigate('/terminal')}
        >
          {'>'} Launch Terminal
        </button>
        <a className="scroll-hint" href="#algorithms">
          scroll down for more details
        </a>
      </section>

      {/* ── Algorithms ─────────────────────────── */}
      <section className="landing-section" id="algorithms">
        <h2 className="section-heading">
          <span className="section-prompt">#</span> Algorithms
        </h2>
        <div className="algo-cards">
          {ALGORITHMS.map((algo) => (
            <div key={algo.tag} className="algo-card">
              <div className="algo-icon">{algo.icon}</div>
              <h3 className="algo-name">{algo.name}</h3>
              <p className="algo-desc">{algo.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ──────────────────────────────── */}
      <section className="landing-section" id="about">
        <h2 className="section-heading">
          <span className="section-prompt">#</span> About
        </h2>
        <div className="about-grid">
          {TEAMMATES.map((member) => (
            <div className="about-card" key={member.roll}>
              <div className="about-line">
                <span className="about-key">name</span>
                <span className="about-sep">:</span>
                <span className="about-val">{member.name}</span>
              </div>
              <div className="about-line">
                <span className="about-key">roll</span>
                <span className="about-sep">:</span>
                <span className="about-val">{member.roll}</span>
              </div>
              <div className="about-line">
                <span className="about-key">course</span>
                <span className="about-sep">:</span>
                <span className="about-val">Internship course</span>
              </div>
              <div className="about-line">
                <span className="about-key">semester</span>
                <span className="about-sep">:</span>
                <span className="about-val">6</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="app-footer">
        <span className="dim">
          Built as an internship case study on February 2026
        </span>
      </footer>
    </div>
  );
};

export default LandingPage;
