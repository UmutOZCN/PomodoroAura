import React from 'react';
import { X } from 'lucide-react';
import type { SessionLogEntry } from './types'; 
import { useLocalStorage } from './useLocalStorage'; 
import './StatsModal.css'; 

const isSameDay = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

type Props = {
  onClose: () => void; 
};

export const StatsModal: React.FC<Props> = ({ onClose }) => {
  
  const [sessionHistory] = useLocalStorage<SessionLogEntry[]>('promo-aura-session-history', []);
  
  const totalCompletedCount = sessionHistory.length;
  const totalMinutes = Math.round(
    sessionHistory.reduce((sum, entry) => sum + entry.duration, 0) / 60
  );
  
  const today = new Date();
  const todaySessions = sessionHistory.filter(entry => 
    isSameDay(new Date(entry.timestamp), today)
  );
  const todayCompletedCount = todaySessions.length;
  const todayMinutes = Math.round(
    todaySessions.reduce((sum, entry) => sum + entry.duration, 0) / 60
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <header className="modal-header">
          <h2>Statistics</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close statistics">
            <X size={24} />
          </button>
        </header>

        <div className="stats-container">
          {totalCompletedCount === 0 ? (
            <div className="empty-state">
              <p>No focus sessions completed yet.</p>
            </div>
          ) : (
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Completed Today</h3>
                <span className="stat-value">{todayCompletedCount}</span>
                <span>sessions</span>
              </div>
              <div className="stat-card">
                <h3>Focus Today</h3>
                <span className="stat-value">{todayMinutes}</span>
                <span>minutes</span>
              </div>
              <div className="stat-card">
                <h3>Total Completed</h3>
                <span className="stat-value">{totalCompletedCount}</span>
                <span>sessions</span>
              </div>
              <div className="stat-card">
                <h3>Total Focus</h3>
                <span className="stat-value">{totalMinutes}</span>
                <span>minutes</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};