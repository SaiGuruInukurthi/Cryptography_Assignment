import React from 'react';
import { ProcessResponse } from '../types';

interface Props {
  history: ProcessResponse[];
  onClear: () => void;
}

const TerminalOutput: React.FC<Props> = ({ history, onClear }) => {
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
