import React, { useState } from 'react';
import ControlPanel from './components/ControlPanel';
import TerminalOutput from './components/TerminalOutput';
import PixelSnow from './components/PixelSnow';
import { processRequest } from './api';
import { Mode, Algorithm, ProcessResponse } from './types';
import './App.css';

const App: React.FC = () => {
  const [history, setHistory] = useState<ProcessResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    mode: Mode,
    algorithm: Algorithm,
    text: string,
    key: string
  ) => {
    setLoading(true);
    try {
      const res = await processRequest({
        mode,
        algorithm,
        text,
        key: key || undefined,
      });
      setHistory((prev) => [...prev, res]);
    } catch (err: any) {
      setHistory((prev) => [
        ...prev,
        {
          success: false,
          error: err?.response?.data?.detail
            ? JSON.stringify(err.response.data.detail)
            : 'Network error – is the backend running?',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearOutputs = () => {
    setHistory([]);
  };

  return (
    <div className="app-shell">
      <div className="app-bg" aria-hidden="true">
        <PixelSnow
          color="#00ff41"
          flakeSize={0.01}
          minFlakeSize={1.25}
          pixelResolution={200}
          speed={1.25}
          density={0.3}
          direction={125}
          brightness={1}
          depthFade={8}
          farPlane={20}
          gamma={0.4545}
          variant="square"
        />
      </div>

      <div className="app">
        <header className="app-header">
          <h1>{'>'} crypto_terminal <span className="cursor-blink">_</span></h1>
          <p className="subtitle">playfair · two columnar · sha256</p>
        </header>

        <main className="app-main">
          <ControlPanel onSubmit={handleSubmit} loading={loading} />
          <TerminalOutput history={history} onClear={handleClearOutputs} />
        </main>

        <footer className="app-footer">
          <span className="dim">Made this for my cryptography assignment on February 2026</span>
        </footer>
      </div>
    </div>
  );
};

export default App;
