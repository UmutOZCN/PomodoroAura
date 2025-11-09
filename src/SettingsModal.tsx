import React, { useState } from 'react';
import { X, Sun, Moon, Laptop, Bell, BellOff } from 'lucide-react';
import type { Settings, Theme } from './types'; 
import './SettingsModal.css';

type Props = {
  currentSettings: Settings; 
  onSave: (newSettings: Settings) => void; 
  onClose: () => void; 
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  notificationPermission: string;
  onNotificationRequest: () => void;
};

export const SettingsModal: React.FC<Props> = ({ 
  currentSettings, onSave, onClose,
  currentTheme, onThemeChange,
  notificationPermission, onNotificationRequest
}) => {
  
  const [formState, setFormState] = useState(currentSettings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, valueAsNumber } = e.target;
    const newValue = valueAsNumber || 0;
    setFormState({ ...formState, [name]: newValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    onSave(formState); 
    onClose(); 
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <header className="modal-header">
          <h2>Settings</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close settings">
            <X size={24} />
          </button>
        </header>

        <form className="settings-form" onSubmit={handleSubmit}>
          
          <fieldset className="form-group theme-selector">
            <legend>Theme</legend>
            <div className="radio-group">
              <label>
                <input type="radio" name="theme" value="light" checked={currentTheme === 'light'} onChange={() => onThemeChange('light')} />
                <Sun size={18} /> Light
              </label>
              <label>
                <input type="radio" name="theme" value="dark" checked={currentTheme === 'dark'} onChange={() => onThemeChange('dark')} />
                <Moon size={18} /> Dark
              </label>
              <label>
                <input type="radio" name="theme" value="system" checked={currentTheme === 'system'} onChange={() => onThemeChange('system')} />
                <Laptop size={18} /> System
              </label>
            </div>
          </fieldset>
          
          <fieldset className="form-group">
            <legend>Timers (Minutes)</legend>
            <label htmlFor="work">Focus</label>
            <input id="work" name="work" type="number" min="1" value={formState.work / 60} onChange={(e) => setFormState({ ...formState, work: (e.target.valueAsNumber || 1) * 60 })} />
            <label htmlFor="shortBreak">Short Break</label>
            <input id="shortBreak" name="shortBreak" type="number" min="1" value={formState.shortBreak / 60} onChange={(e) => setFormState({ ...formState, shortBreak: (e.target.valueAsNumber || 1) * 60 })} />
            <label htmlFor="longBreak">Long Break</label>
            <input id="longBreak" name="longBreak" type="number" min="1" value={formState.longBreak / 60} onChange={(e) => setFormState({ ...formState, longBreak: (e.target.valueAsNumber || 1) * 60 })} />
          </fieldset>
          
          <fieldset className="form-group">
            <legend>Cycle</legend>
            <label htmlFor="longBreakInterval">Long Break Interval</label>
            <input id="longBreakInterval" name="longBreakInterval" type="number" min="1" max="12" value={formState.longBreakInterval} onChange={handleChange} />
          </fieldset>

          <fieldset className="form-group notification-settings">
            <legend>Notifications</legend>
            <button 
              type="button"
              className="preset-button"
              onClick={onNotificationRequest}
              disabled={notificationPermission === 'granted' || notificationPermission === 'denied'}
            >
              {notificationPermission === 'granted' 
                ? <><Bell size={18} /> Notifications Granted</>
                : notificationPermission === 'denied'
                ? <><BellOff size={18} /> Notifications Blocked</>
                : <><Bell size={18} /> Request Desktop Notifications</>
              }
            </button>
            {(notificationPermission === 'denied') && (
              <p className="note">Notifications are blocked by your browser. You must change this in site settings.</p>
            )}
          </fieldset>

          <button type="submit" className="primary-button save-button">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};