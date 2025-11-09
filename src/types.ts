
export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface Settings {
    work: number;
    shortBreak: number;
    longBreak: number;
    longBreakInterval: number;
}

export type Theme = 'light' | 'dark' | 'system';

export interface SessionLogEntry {
  timestamp: number; 
  duration: number;  
}