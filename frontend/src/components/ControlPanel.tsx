import React, { useState } from 'react';
import { Mode, Algorithm } from '../types';

interface Props {
  onSubmit: (mode: Mode, algorithm: Algorithm, text: string, key: string) => void;
  loading: boolean;
}

const ALPHA_RE = /^[a-z]*$/;

const buildKeyMatrix = (key: string): string[][] => {
  const normalized = key.toLowerCase().replace(/[^a-z]/g, '').replace(/j/g, 'i');
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const ch of normalized) {
    if (!seen.has(ch)) {
      seen.add(ch);
      ordered.push(ch);
    }
  }
  const alphabet = 'abcdefghiklmnopqrstuvwxyz'; // no j
  for (const ch of alphabet) {
    if (!seen.has(ch)) {
      seen.add(ch);
      ordered.push(ch);
    }
  }
  const matrix: string[][] = [];
  for (let i = 0; i < 5; i++) {
    matrix.push(ordered.slice(i * 5, i * 5 + 5));
  }
  return matrix;
};

const buildPlayfairPreview = (value: string): string => {
  const normalized = value.toLowerCase().replace(/[^a-z]/g, '').replace(/j/g, 'i');
  const pairs: string[] = [];
  let index = 0;

  while (index < normalized.length) {
    const first = normalized[index];

    if (index + 1 < normalized.length) {
      const second = normalized[index + 1];
      if (first === second) {
        pairs.push(`${first}x`);
        index += 1;
      } else {
        pairs.push(`${first}${second}`);
        index += 2;
      }
    } else {
      pairs.push(`${first}x`);
      index += 1;
    }
  }

  return pairs.join(' ');
};

interface ColumnarVisual {
  keyChars: string[];
  columnOrder: number[];
  rankByCol: number[];
  grid1: string[][];
  pass1Output: string;
  grid2: string[][];
  pass2Output: string;
}

const singleColumnarEncrypt = (
  text: string,
  ncols: number,
  columnOrder: number[]
): { grid: string[][]; output: string } => {
  const nrows = Math.ceil(text.length / ncols);
  const padded = text.padEnd(nrows * ncols, 'x');
  const grid = Array.from({ length: nrows }, (_, r) =>
    padded.slice(r * ncols, r * ncols + ncols).split('')
  );
  const out: string[] = [];
  for (const col of columnOrder) {
    for (let r = 0; r < nrows; r++) out.push(grid[r][col]);
  }
  return { grid, output: out.join('') };
};

const singleColumnarDecrypt = (
  text: string,
  ncols: number,
  columnOrder: number[]
): { grid: string[][]; output: string } => {
  const nrows = Math.ceil(text.length / ncols);
  const padded = text.padEnd(nrows * ncols, 'x');
  const grid: string[][] = Array.from({ length: nrows }, () =>
    Array.from({ length: ncols }, () => '')
  );
  let idx = 0;
  for (const col of columnOrder) {
    for (let r = 0; r < nrows; r++) {
      grid[r][col] = padded[idx] || 'x';
      idx++;
    }
  }
  return { grid, output: grid.flat().join('') };
};

const buildColumnarVisual = (
  text: string,
  key: string,
  mode: string
): ColumnarVisual | null => {
  const k = key.toLowerCase().replace(/[^a-z]/g, '');
  if (!k) return null;

  const keyChars = k.split('');
  const ncols = keyChars.length;

  const columnOrder = keyChars
    .map((ch, i) => ({ ch, i }))
    .sort((a, b) => a.ch.localeCompare(b.ch))
    .map((e) => e.i);

  const rankByCol = new Array<number>(ncols);
  columnOrder.forEach((col, rank) => {
    rankByCol[col] = rank + 1;
  });

  if (!text) {
    return { keyChars, columnOrder, rankByCol, grid1: [], pass1Output: '', grid2: [], pass2Output: '' };
  }

  if (mode === 'encrypt') {
    const p1 = singleColumnarEncrypt(text, ncols, columnOrder);
    const p2 = singleColumnarEncrypt(p1.output, ncols, columnOrder);
    return { keyChars, columnOrder, rankByCol, grid1: p1.grid, pass1Output: p1.output, grid2: p2.grid, pass2Output: p2.output };
  } else {
    const p1 = singleColumnarDecrypt(text, ncols, columnOrder);
    const p2 = singleColumnarDecrypt(p1.output, ncols, columnOrder);
    return { keyChars, columnOrder, rankByCol, grid1: p1.grid, pass1Output: p1.output, grid2: p2.grid, pass2Output: p2.output };
  }
};

const ControlPanel: React.FC<Props> = ({ onSubmit, loading }) => {
  const [mode, setMode] = useState<Mode>('encrypt');
  const [algorithm, setAlgorithm] = useState<Algorithm>('playfair');
  const [text, setText] = useState('');
  const [key, setKey] = useState('');

  const needsKey = algorithm !== 'sha512';
  const playfairPreview =
    algorithm === 'playfair' && mode === 'encrypt' && text
      ? buildPlayfairPreview(text)
      : '';
  const columnarVisual =
    algorithm === 'two_columnar' ? buildColumnarVisual(text, key, mode) : null;

  const handleAlphaChange = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value.toLowerCase().replace(/\s+/g, '');
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

  const handleClear = () => {
    setMode('encrypt');
    setAlgorithm('playfair');
    setText('');
    setKey('');
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
          <option value="sha512">sha512</option>
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
        {playfairPreview && (
          <span className="hint preprocess-hint">digraphs: {playfairPreview}</span>
        )}
      </div>

      {algorithm === 'playfair' && (
        <div className="key-matrix-container">
          <label className="key-matrix-label">&gt; key matrix</label>
          <table className="key-matrix">
            <tbody>
              {buildKeyMatrix(key).map((row, r) => (
                <tr key={r}>
                  {row.map((ch, c) => (
                    <td key={c} className="key-matrix-cell">
                      {ch === 'i' ? 'i/j' : ch}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {algorithm === 'two_columnar' && (
        <div className="columnar-visual-container">
          <label className="key-matrix-label">&gt; transposition grids</label>
          {columnarVisual ? (
            <>
              <div className="columnar-meta">
                <span className="hint preprocess-hint">
                  key: {columnarVisual.keyChars.join(' ')}
                </span>
                <span className="hint preprocess-hint">
                  read order: {columnarVisual.columnOrder.map((c) => c + 1).join(' → ')}
                </span>
              </div>

              {columnarVisual.grid1.length > 0 && (
                <>
                  <span className="hint preprocess-hint columnar-pass-label">
                    {mode === 'encrypt' ? '─ pass 1 (input → grid)' : '─ pass 1 (ciphertext → grid)'}
                  </span>
                  <table className="key-matrix columnar-grid">
                    <thead>
                      <tr>
                        {columnarVisual.keyChars.map((ch, i) => (
                          <th key={'k1' + i} className="key-matrix-cell columnar-hdr">{ch}</th>
                        ))}
                      </tr>
                      <tr>
                        {columnarVisual.rankByCol.map((rank, i) => (
                          <th key={'r1' + i} className="key-matrix-cell columnar-rank">{rank}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {columnarVisual.grid1.map((row, r) => (
                        <tr key={r}>
                          {row.map((ch, c) => (
                            <td key={c} className="key-matrix-cell">{ch}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <span className="hint preprocess-hint columnar-output">
                    {mode === 'encrypt' ? 'pass-1 output' : 'pass-1 recovery'}: {columnarVisual.pass1Output}
                  </span>

                  <span className="hint preprocess-hint columnar-pass-label">
                    {mode === 'encrypt' ? '─ pass 2 (pass-1 output → grid)' : '─ pass 2 (pass-1 recovery → grid)'}
                  </span>
                  <table className="key-matrix columnar-grid">
                    <thead>
                      <tr>
                        {columnarVisual.keyChars.map((ch, i) => (
                          <th key={'k2' + i} className="key-matrix-cell columnar-hdr">{ch}</th>
                        ))}
                      </tr>
                      <tr>
                        {columnarVisual.rankByCol.map((rank, i) => (
                          <th key={'r2' + i} className="key-matrix-cell columnar-rank">{rank}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {columnarVisual.grid2.map((row, r) => (
                        <tr key={'p2r' + r}>
                          {row.map((ch, c) => (
                            <td key={c} className="key-matrix-cell">{ch}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <span className="hint preprocess-hint columnar-output">
                    {mode === 'encrypt' ? 'final ciphertext' : 'recovered plaintext'}: {columnarVisual.pass2Output}
                  </span>
                </>
              )}
            </>
          ) : (
            <span className="hint preprocess-hint">enter a key to see the transposition grids</span>
          )}
        </div>
      )}

      <div className="form-actions">
        <button type="submit" disabled={loading || !text || (needsKey && !key)}>
          {loading ? 'processing...' : '[ run ]'}
        </button>
        <button type="button" className="clear-input-btn" onClick={handleClear}>
          [ clear ]
        </button>
      </div>

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
