import React, { useState } from 'react';
import ControlPanel from './components/ControlPanel';
import TerminalOutput from './components/TerminalOutput';
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

  return (
    <div className="app">
      <header className="app-header">
        <h1>{'>'} crypto_terminal <span className="cursor-blink">_</span></h1>
        <p className="subtitle">playfair · two columnar · sha256</p>
      </header>

      <main className="app-main">
        <ControlPanel onSubmit={handleSubmit} loading={loading} />
        <TerminalOutput history={history} />
      </main>

      <footer className="app-footer">
        <span className="dim">cryptography assignment mvp • 2026</span>
      </footer>
    </div>
  );
};

export default App;
