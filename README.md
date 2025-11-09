# PomodoroAura
> Focus, with breathing space.

![PomodoroAura Screenshot](https://i.imgur.com/example.png)
*(Remember to replace this with a real screenshot URL from your live app. You can upload one to [imgur.com](https://imgur.com/).)*

---

## 🚀 Live Application

This application is fully deployed and available for you to use right now.

**Visit the live site:**
### [https://pomodoro-aura.vercel.app](https://pomodoro-aura.vercel.app)
*(Replace this with your actual Vercel link)*

---

## ✨ About The Project

**PomodoroAura** is a minimalist Pomodoro® timer web application designed with a calm, non-distracting, and aesthetic interface. Built on the philosophy of "spa-like productivity," it helps users effectively manage their work and break periods without disrupting their flow.

The application is a robust Single Page Application (SPA) built with React, Vite, and TypeScript. It intelligently persists the complete user experience—including all custom settings, theme preferences, and even the timer's current state—in the browser's `localStorage`.

---

## 📋 Features

* **Full Pomodoro Cycle:** Configurable durations for Focus, Short Break, and Long Break.
* **Persistent State:** The timer remembers its state (remaining seconds, current mode, active status) even after the browser is refreshed or closed.
* **"Spa-like" UI:** A minimal, low-contrast, and soft color palette with gentle micro-animations.
* **Advanced Theme Support:** A one-click toggle between **Light**, **Dark**, and **System** (auto-detect) themes, with all preferences saved.
* **Animated Progress Ring:** A circular SVG ring that visually depletes as time passes.
* **Non-Interruptive Modals:** Both the **Settings** and **Statistics** panels open as modals, allowing the timer to continue running in the background without being reset.
* **Audio & Desktop Notifications:** A soft chime and a desktop notification (if permission is granted) signal the end of each session.
* **Fully Responsive Design:** A flawless experience on all devices, from large desktops down to 360px mobile screens.
* **Persistent Statistics:** Tracks and saves completed focus sessions and total focus time, broken down by "Today" and "Total."
* **Quick-Set Presets:** One-click presets for common timings (e.g., 25/5, 50/10).

---

## 🛠️ Tech Stack

* **Framework:** React 18
* **Build Tool:** Vite
* **Language:** TypeScript
* **State Management:** React Hooks (`useState`, `useEffect`, `useRef`)
* **Persistence:** A custom `useLocalStorage` hook to save and retrieve state.
* **Styling:** Modern CSS (CSS Variables, Grid, Flexbox, Media Queries)
* **Icons:** Lucide React

---

## 🏛️ Key Architecture Decisions

* **Modal-Based UI:** Instead of using a router (`react-router-dom`), the application uses a modal-based architecture. This was a key decision to **prevent the timer from resetting** when the user opens the Settings or Statistics panels, ensuring an uninterrupted flow.
* **Custom `useLocalStorage` Hook:** All persistent state (user settings, theme, timer status) is managed by a single, reusable custom hook (`useLocalStorage.ts`). This hook automatically serializes state to `localStorage` on change and deserializes it on load.
* **Real-Time Accuracy:** The timer logic relies on "epoch math" (comparing `Date.now()` timestamps) rather than `setInterval` ticks alone. This ensures the timer remains perfectly accurate even if the browser tab is backgrounded or throttled.

---

## 🔑 License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).
