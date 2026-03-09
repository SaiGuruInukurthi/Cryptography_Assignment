import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PixelSnow from './components/PixelSnow';
import LandingPage from './pages/LandingPage';
import TerminalPage from './pages/TerminalPage';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
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

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/terminal" element={<TerminalPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
