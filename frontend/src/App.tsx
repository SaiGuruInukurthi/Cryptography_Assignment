import React, { useState, useEffect, useRef } from 'react';
import ControlPanel from './components/ControlPanel';
import TerminalOutput from './components/TerminalOutput';
import PixelSnow from './components/PixelSnow';
import { processRequest } from './api';
import { Mode, Algorithm, ProcessResponse } from './types';
import './App.css';

const EASTER_EGG_VIDEO_ID = 'hf1DkBQRQj4';
const IDLE_TIMEOUT_MS = 10 * 1000;   // 3 minutes
const RETURN_TIMEOUT_MS = 45 * 1000;  // 1 minute

const App: React.FC = () => {
  const [history, setHistory] = useState<ProcessResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const easterEggIframeRef = useRef<HTMLIFrameElement | null>(null);

  const sendPlayerCommand = (func: string, args: unknown[] = []) => {
    const iframe = easterEggIframeRef.current;
    if (!iframe?.contentWindow) {
      return;
    }

    iframe.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func, args }),
      '*'
    );
  };

  const handleEasterEggLoad = () => {
    // Autoplay begins muted; attempt unmute two seconds later.
    setTimeout(() => {
      sendPlayerCommand('unMute');
      sendPlayerCommand('setVolume', [100]);
    }, 2000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), RETURN_TIMEOUT_MS);
    }, IDLE_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

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
      {showEasterEgg && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            background: '#000',
          }}
        >
          <iframe
            ref={easterEggIframeRef}
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${EASTER_EGG_VIDEO_ID}?autoplay=1&mute=1&playsinline=1&controls=0&modestbranding=1&rel=0&enablejsapi=1`}
            title="Easter Egg"
            frameBorder="0"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
            onLoad={handleEasterEggLoad}
          />
        </div>
      )}
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
          <p className="subtitle">playfair · two columnar · sha512</p>
        </header>

        <main className="app-main">
          <ControlPanel onSubmit={handleSubmit} loading={loading} />
          <div className="output-wrapper">
            <TerminalOutput history={history} onClear={handleClearOutputs} />
          </div>
        </main>

        <footer className="app-footer">
          <span className="dim">Made this for my cryptography assignment on February 2026</span>
        </footer>
      </div>
    </div>
  );
};

export default App;
