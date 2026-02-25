import React, { useMemo, useState } from 'react';
import { ProcessResponse } from '../types';

interface Props {
  history: ProcessResponse[];
  onClear: () => void;
}

const TerminalOutput: React.FC<Props> = ({ history, onClear }) => {
  const [copied, setCopied] = useState(false);

  const latestCopyText = useMemo(() => {
    if (history.length === 0) {
      return '';
    }
    const latest = history[history.length - 1];
    return latest.output || latest.error || '';
  }, [history]);

  const handleCopyOutput = async () => {
    if (!latestCopyText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(latestCopyText);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = latestCopyText;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="terminal-output">
      <div className="terminal-header">// output</div>
      <div className="terminal-body">
        {history.length === 0 && (
          <p className="dim">waiting for input...<span className="cursor">█</span></p>
        )}
        {history.map((entry, idx) => (
          <div key={idx} className="entry">
            {entry.success ? (
              <>
                <p className="line">
                  <span className="prompt">&gt;</span> mode: {entry.mode}
                </p>
                <p className="line">
                  <span className="prompt">&gt;</span> algorithm: {entry.algorithm}
                </p>
                <p className="line">
                  <span className="prompt">&gt;</span> input: {entry.input}
                </p>
                <p className="line success">
                  <span className="prompt">&gt;</span> output: {entry.output}
                </p>
                <p className="line dim">
                  [{entry.message}]
                </p>
              </>
            ) : (
              <p className="line error">
                <span className="prompt">&gt;</span> error: {entry.error}
              </p>
            )}
            <hr className="separator" />
          </div>
        ))}
        {history.length > 0 && (
          <p className="dim"><span className="cursor">█</span></p>
        )}
      </div>
      <div className="terminal-actions">
        <button
          type="button"
          className="copy-output-btn"
          onClick={handleCopyOutput}
          disabled={!latestCopyText}
        >
          {copied ? 'copied' : 'copy output'}
        </button>
        <button
          type="button"
          className="clear-output-btn"
          onClick={onClear}
          disabled={history.length === 0}
        >
          clear outputs
        </button>
      </div>
    </div>
  );
};

export default TerminalOutput;
