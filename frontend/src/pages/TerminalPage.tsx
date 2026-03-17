import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ControlPanel from '../components/ControlPanel';
import TerminalOutput from '../components/TerminalOutput';
import { processRequest } from '../api';
import { Mode, Algorithm, ProcessResponse } from '../types';

const EASTER_EGG_VIDEO_ID = 'hf1DkBQRQj4';
const IDLE_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes
const RETURN_TIMEOUT_MS = 37 * 1000; // 37 sec
const MESSAGE_DISPLAY_MS = 10 * 1000;

const TerminalPage: React.FC = () => {
  const [history, setHistory] = useState<ProcessResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [easterEggStage, setEasterEggStage] = useState<
    'video' | 'message' | null
  >(null);
  const easterEggIframeRef = useRef<HTMLIFrameElement | null>(null);
  const easterEggOverlayRef = useRef<HTMLDivElement | null>(null);

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
    setTimeout(() => {
      sendPlayerCommand('unMute');
      sendPlayerCommand('setVolume', [100]);
    }, 2000);
  };

  useEffect(() => {
    let showMessageTimer: ReturnType<typeof setTimeout> | undefined;
    let hideOverlayTimer: ReturnType<typeof setTimeout> | undefined;

    const timer = setTimeout(() => {
      setEasterEggStage('video');
      showMessageTimer = setTimeout(() => {
        setEasterEggStage('message');
      }, RETURN_TIMEOUT_MS);
      hideOverlayTimer = setTimeout(() => {
        setEasterEggStage(null);
      }, RETURN_TIMEOUT_MS + MESSAGE_DISPLAY_MS);
    }, IDLE_TIMEOUT_MS);

    return () => {
      clearTimeout(timer);
      if (showMessageTimer) {
        clearTimeout(showMessageTimer);
      }
      if (hideOverlayTimer) {
        clearTimeout(hideOverlayTimer);
      }
    };
  }, []);

  useEffect(() => {
    if (!easterEggStage) {
      if (document.fullscreenElement) {
        void document.exitFullscreen();
      }
      return;
    }

    const overlay = easterEggOverlayRef.current;
    if (overlay && !document.fullscreenElement) {
      void overlay.requestFullscreen().catch(() => {});
    }
  }, [easterEggStage]);

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
    <>
      {easterEggStage && (
        <div
          ref={easterEggOverlayRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            background:
              easterEggStage === 'video' ? '#000' : 'rgba(0, 0, 0, 0.82)',
          }}
        >
          {easterEggStage === 'video' ? (
            <>
              <iframe
                ref={easterEggIframeRef}
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${EASTER_EGG_VIDEO_ID}?autoplay=1&mute=1&playsinline=1&controls=0&modestbranding=1&rel=0&enablejsapi=1`}
                title="Easter Egg"
                frameBorder="0"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                style={{ border: 'none', pointerEvents: 'none' }}
                onLoad={handleEasterEggLoad}
              />
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'transparent',
                  zIndex: 100000,
                }}
              />
            </>
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '24px',
                gap: '16px',
              }}
            >
              <h2
                style={{
                  color: '#ff3a3a',
                  fontSize: 'clamp(1.3rem, 3vw, 2.4rem)',
                  margin: 0,
                  maxWidth: '900px',
                  lineHeight: 1.25,
                }}
              >
                Thank you for your patience and spending time on this
                internship case study project
              </h2>
              <p
                style={{
                  color: '#36ff61',
                  fontSize: 'clamp(0.85rem, 1.8vw, 1.2rem)',
                  margin: 0,
                  maxWidth: '900px',
                  lineHeight: 1.35,
                }}
              >
                {'{'}This is an easter egg, <strong>congrats</strong> for
                discovering it{'}'}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="app">
        <header className="app-header">
          <Link to="/" className="back-link">
            {'<'} back
          </Link>
        </header>

        <main className="app-main">
          <ControlPanel onSubmit={handleSubmit} loading={loading} />
          <div className="output-wrapper">
            <TerminalOutput history={history} onClear={handleClearOutputs} />
          </div>
        </main>

        <footer className="app-footer">
          <span className="dim">
            Built as an internship case study on February 2026
          </span>
        </footer>
      </div>
    </>
  );
};

export default TerminalPage;
