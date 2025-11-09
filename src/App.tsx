import { useState, useEffect, useRef } from 'react';
import { BarChart3, Volume2, VolumeX, Settings as SettingsIcon, Play, Pause } from 'lucide-react';
import './App.css'; 
import { CircularProgress } from './CircularProgress'; 
import { useLocalStorage } from './useLocalStorage';
import type { TimerMode, Settings, Theme, SessionLogEntry } from './types'; 
import { SettingsModal } from './SettingsModal';
import './SettingsModal.css'; 
import { StatsModal } from './StatsModal';
import './StatsModal.css';

const DEFAULT_SETTINGS: Settings = {
  work: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60, longBreakInterval: 4,
};

const isSameDay = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

function App() {
  const [theme, setTheme] = useLocalStorage<Theme>('promo-aura-theme', 'system');
  const [settings, setSettings] = useLocalStorage<Settings>('promo-aura-settings', DEFAULT_SETTINGS);
  const [sessionHistory, setSessionHistory] = useLocalStorage<SessionLogEntry[]>('promo-aura-session-history', []);
  const [isMuted, setIsMuted] = useState(false);
  const [isActive, setIsActive] = useLocalStorage('promo-aura-isActive', false); 
  const [mode, setMode] = useLocalStorage<TimerMode>('promo-aura-mode', 'work');
  const [remainingSeconds, setRemainingSeconds] = useLocalStorage('promo-aura-remaining', settings.work);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false); 
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const intervalRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0); 
  const audioRef = useRef<HTMLAudioElement>(null);
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSecs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  const resetTimer = (newMode: TimerMode) => {
    setIsActive(false); 
    setMode(newMode);
    if (newMode === 'work') setRemainingSeconds(settings.work);
    else if (newMode === 'shortBreak') setRemainingSeconds(settings.shortBreak);
    else if (newMode === 'longBreak') setRemainingSeconds(settings.longBreak);
  };
  
  const applyPreset = (workMins: number, shortMins: number) => {
    setIsActive(false); 
    const newSettings = {...settings, work: workMins * 60, shortBreak: shortMins * 60,};
    setSettings(newSettings);
    setMode('work'); 
    setRemainingSeconds(newSettings.work);
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) { 
      alert("This browser does not support desktop notifications."); 
      return; 
    }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission); 
  };

  const playSound = () => {
    if (!isMuted && audioRef.current) {
      audioRef.current.currentTime = 0; 
      audioRef.current.play().catch(err => console.warn("Audio playback failed.", err));
    }
  };

  const sendNotification = (body: string) => {
    if (notificationPermission !== 'granted') return;
    new Notification("PomodoroAura", { body: body, icon: '/logo.svg', silent: true });
  };
  
  const handleStartPause = () => {
    if (audioRef.current && !isActive) { audioRef.current.load(); }
    setIsActive(!isActive);
  };

  const handleSaveSettings = (newSettings: Settings) => {
    setSettings(newSettings); 
    if (!isActive) {
      if (mode === 'work') setRemainingSeconds(newSettings.work);
      if (mode === 'shortBreak') setRemainingSeconds(newSettings.shortBreak);
      if (mode === 'longBreak') setRemainingSeconds(newSettings.longBreak);
    }
  };

  useEffect(() => { 
    if (isActive) {
      targetTimeRef.current = Date.now() + remainingSeconds * 1000;
      intervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const newRemaining = Math.max(0, Math.round((targetTimeRef.current - now) / 1000));
        setRemainingSeconds(newRemaining);
        document.title = `${formatTime(newRemaining)} - ${modeLabel}`; 
        
        if (newRemaining <= 0) {
          setIsActive(false); 
          document.title = "PomodoroAura: Done!";
          playSound(); 
          if (mode === 'work') {
            const newLogEntry: SessionLogEntry = { timestamp: Date.now(), duration: settings.work };
            setSessionHistory(prevHistory => [...prevHistory, newLogEntry]);
            sendNotification("Focus session complete! Time for a short break."); 
            const newSessionCount = sessionHistory.length + 1; 
            if (newSessionCount % settings.longBreakInterval === 0) resetTimer('longBreak');
            else resetTimer('shortBreak');
          } else {
            sendNotification("Break's over! Time to focus again."); 
            resetTimer('work');
          }
        }
      }, 250); 
    } else {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      if (remainingSeconds > 0) { 
        document.title = "PomodoroAura: Paused"; 
      }
    }
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); } };
  }, [isActive, remainingSeconds, mode, sessionHistory, settings, isMuted, notificationPermission]); 
  
  useEffect(() => { 
    const body = document.body;
    if (theme === 'system') {
      const matcher = window.matchMedia('(prefers-color-scheme: dark)');
      const updateSystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
        body.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };
      updateSystemTheme(matcher);
      matcher.addEventListener('change', updateSystemTheme);
      return () => matcher.removeEventListener('change', updateSystemTheme);
    } else {
      body.setAttribute('data-theme', theme);
    }
  }, [theme]);
  
  const toggleSound = () => setIsMuted(!isMuted);
  const totalDuration = mode === 'work' ? settings.work : mode === 'shortBreak' ? settings.shortBreak : settings.longBreak;
  const percentRemaining = (remainingSeconds / totalDuration) * 100;
  
  const today = new Date();
  const todaySessions = sessionHistory.filter(entry => isSameDay(new Date(entry.timestamp), today));
  const todayCompletedCount = todaySessions.length;
  const todayTotalMinutes = Math.round(todaySessions.reduce((sum, entry) => sum + entry.duration, 0) / 60);


  let motivationalLine = "This is your only task right now.";
  let modeLabel = "Focus";
  if (mode === 'shortBreak') { 
    motivationalLine = "Great work. Take a breath."; 
    modeLabel = "Short Break"; 
  }
  else if (mode === 'longBreak') { 
    motivationalLine = "Look into the distance. Hydrate."; 
    modeLabel = "Long Break"; 
  }
  
  // --- JSX ---
  return (
    <>
      <div className="sr-only" aria-live="polite" id="aria-live-announcer">
        {isActive ? `${modeLabel} started` : `${modeLabel} paused`}
      </div>

      <div id="app-wrapper">
        <header className="app-header">
          <a href="/" className="logo-container" aria-label="PomodoroAura Home">
            <img src="/logo.svg" alt="PomodoroAura Logo" className="logo" />
            <h1>PomodoroAura</h1>
          </a>
          <nav className="controls">
            <button className="icon-button" aria-label="Show Statistics" onClick={() => setIsStatsOpen(true)}>
              <BarChart3 size={20} />
            </button>
            <button className="icon-button" onClick={toggleSound} aria-label={isMuted ? "Unmute" : "Mute"}>
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button className="icon-button" id="open-settings" aria-label="Open Settings" onClick={() => setIsSettingsOpen(true)}>
              <SettingsIcon size={20} /> 
            </button>
          </nav>
        </header>

        <main className="timer-section">
          <div className="mode-label">{modeLabel}</div>
          <div className="timer-ring"><CircularProgress percent={percentRemaining} /><div className="timer-display" id="timer-display">{formatTime(remainingSeconds)}</div></div>
          <button className="primary-button" id="start-pause-button" onClick={handleStartPause}>
            {isActive ? <><Pause size={20} /> <span>Pause</span></> : <><Play size={20} /> <span>Start</span></>}
          </button>
          <p className="motivational-line">{motivationalLine}</p>
        </main>

        <aside className="quick-panel">
          <div className="presets">
            <h3>Presets</h3>
            <button className="preset-button" onClick={() => applyPreset(25, 5)}>25 / 5</button>
            <button className="preset-button" onClick={() => applyPreset(50, 10)}>50 / 10</button>
            <button className="preset-button" onClick={() => applyPreset(90, 15)}>90 / 15</button>
          </div>
          <div className="session-stats">
            <h3>Today's Sessions</h3>
            <p>Completed: <span id="completed-count">{todayCompletedCount}</span></p>
            <p>Total Time: <span id="total-time">{todayTotalMinutes} min</span></p> 
          </div>
        </aside>
      </div>

      <audio ref={audioRef} src="/sounds/chime.mp3" preload="auto" />
      
      {isSettingsOpen && (
        <SettingsModal 
          currentSettings={settings} 
          onSave={handleSaveSettings}
          onClose={() => setIsSettingsOpen(false)}
          currentTheme={theme} 
          onThemeChange={setTheme}
          notificationPermission={notificationPermission}
          onNotificationRequest={requestNotificationPermission}
        />
      )}
      
      {isStatsOpen && (
        <StatsModal onClose={() => setIsStatsOpen(false)} />
      )}
    </>
  );
}

export default App;