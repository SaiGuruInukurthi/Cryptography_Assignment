import React, { useState } from 'react';
import { Mode, Algorithm } from '../types';

interface Props {
  onSubmit: (mode: Mode, algorithm: Algorithm, text: string, key: string) => void;
  loading: boolean;
}

const ALPHA_RE = /^[a-z]*$/;

const ControlPanel: React.FC<Props> = ({ onSubmit, loading }) => {
  const [mode, setMode] = useState<Mode>('encrypt');
  const [algorithm, setAlgorithm] = useState<Algorithm>('playfair');
  const [text, setText] = useState('');
  const [key, setKey] = useState('');

  const needsKey = algorithm !== 'sha256';

  const handleAlphaChange = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value.toLowerCase();
    if (ALPHA_RE.test(val)) {
      setter(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    if (needsKey && !key) return;
    onSubmit(mode, algorithm, text, key);
  };

  return (
    <form className="control-panel" onSubmit={handleSubmit}>
      <div className="field">
        <label>&gt; mode</label>
        <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
          <option value="encrypt">encrypt</option>
          <option value="decrypt">decrypt</option>
        </select>
      </div>

      <div className="field">
        <label>&gt; algorithm</label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
        >
          <option value="playfair">playfair</option>
          <option value="two_columnar">two columnar</option>
          <option value="sha256">sha256</option>
        </select>
      </div>

      {needsKey && (
        <div className="field">
          <label>&gt; key</label>
          <input
            type="text"
            placeholder="lowercase key..."
            value={key}
            onChange={handleAlphaChange(setKey)}
          />
          <span className="hint">a-z only</span>
        </div>
      )}

      <div className="field">
        <label>&gt; {mode === 'encrypt' ? 'plaintext' : 'ciphertext'}</label>
        <textarea
          rows={3}
          placeholder="lowercase input..."
          value={text}
          onChange={handleAlphaChange(setText)}
        />
        <span className="hint">a-z only</span>
      </div>

      <button type="submit" disabled={loading || !text || (needsKey && !key)}>
        {loading ? 'processing...' : '[ run ]'}
      </button>

      <div className="student-meta-row">
        <div className="student-details">
          <p className="student-line">Name: I. Sai Guru</p>
          <p className="student-line">Roll.no: 2023003611</p>
          <p className="student-line">E-mail: sinukurt@gitam.in</p>
        </div>

        <div className="input-actions">
          <a
            className="github-link-btn"
            href="https://github.com/SaiGuruInukurthi/Cryptography_Assignment"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Repo
          </a>
        </div>
      </div>
    </form>
  );
};

export default ControlPanel;
