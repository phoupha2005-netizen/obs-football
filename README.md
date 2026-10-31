# Football Substitution Studio – OBS Browser Dock

A professional football broadcast control application and Lower Third designer engineered specifically for **OBS Studio** via **Custom Browser Docks** and **Browser Sources**, with direct deployment support for **Vercel**.

---

## 🌟 Key Features

1. **Substitution Manager**
   - Team squad picker, player OUT & IN numbers, names, photos, substitution minute, additional time, and substitution type (Tactical, Injury, Double, Emergency).
   - Real-time **SHOW ON OBS** and **HIDE ON OBS** triggers.
   - Queue management with re-ordering and history log.
   - Auto-hide timer (configurable 5s, 8s, 10s, or manual).

2. **Advanced Lower Third Designer (3-Panel Editor)**
   - **Left**: Layers Panel (Background panel, team name, player OUT, player IN, jersey numbers, minute badge, club crest logo, custom sponsor text).
   - **Center**: Design Canvas supporting **1920×1080** and **1280×720** resolutions with interactive drag & repositioning.
   - **Right**: Properties Panel (Typography, colors, gradients, borders, shadows, glows, opacities, and animated entrance effects like Slide Left, Slide Up, Scale Pop, and Modern Split Wipe).
   - Pre-built broadcast presets: *Premier League*, *UEFA Champions League*, *World Tournament Gold*.
   - Save, load, export, and import custom templates via JSON.

3. **Dynamic TAG Mapping Engine**
   - Built-in broadcast TAGs: `<TeamA>`, `<TeamB>`, `<score_team_a>`, `<score_team_b>`, `<score2_team_a>`, `<score2_team_b>`, `<time_counter>`, `<PlayerOut>`, `<PlayerIn>`, `<NumberOut>`, `<NumberIn>`, `<Minute>`, `<TeamLogo>`, `<label1>`–`<label5>`, `<LabelAll>`.
   - Supports `<escape>...</escape>` tag syntax.
   - Multi-source binding: maps a single TAG to multiple OBS text sources simultaneously with strict type safety.

4. **OBS WebSocket v5 & Local OBS Bridge**
   - Direct connection to OBS WebSocket v5 (`ws://127.0.0.1:4455`).
   - Secure Firebase Relay Bridge (`obs-bridge.js` & `run-bridge-windows.bat`) for cloud/Vercel deployments to bypass browser mixed-content restrictions without exposing your OBS password.
   - Strict safety check: updates Text sources only—never corrupts image or media sources.

5. **OBS Custom Browser Dock Mode (`/dock`)**
   - High-density, touch-and-mouse-friendly interface designed specifically for OBS Studio custom docks.
   - Dedicated endpoints:
     - `/dock` (Master dock)
     - `/dock/substitution` (Quick substitution triggers)
     - `/dock/match` (Stopwatch timer and halves)
     - `/dock/scoreboard` (Score updater)
     - `/dock/sources` (OBS scene items toggle)

6. **OBS Browser Source Overlay (`/overlay`)**
   - Transparent 1920×1080 graphic overlay.
   - Add as an OBS Browser Source; automatically animates lower thirds in and out when ON AIR is triggered.

7. **Multi-Language Support**
   - English (EN)
   - Thai (ภาษาไทย - TH)
   - Lao (ພາສາລາວ - LA)

8. **Firebase Authentication & Firestore**
   - Persistent cloud storage for teams, players, matches, substitutions, templates, and pairing relays.

---

## 🚀 Quick Start Guide

### 1. Local Development
```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎬 OBS Studio Setup

### Adding the Custom Browser Dock:
1. In **OBS Studio**, open the top menu: **Docks > Custom Browser Docks...**
2. In **Dock Name**, enter: `Football Studio`
3. In **URL**, paste your deployed URL or local URL:
   - `https://your-domain.vercel.app/dock` (or `http://localhost:3000/dock`)
4. Click **Apply**.
5. Dock the new window into your OBS Studio workspace (e.g. next to the Audio Mixer or Scenes panel).

### Adding the Lower Third Graphic Overlay:
1. In your OBS Scene, click **+ (Add Source) > Browser**.
2. Name it: `Football Substitution Lower Third`.
3. In **URL**, paste:
   - `https://your-domain.vercel.app/overlay`
4. Set **Width**: `1920` and **Height**: `1080`.
5. Check: **"Shutdown source when not visible"** and **"Refresh browser when scene becomes active"**.
6. Click **OK**.

---

## 🌉 Running the Local OBS Bridge (For Vercel Deployments)

When your studio is hosted on HTTPS (like Vercel), modern browsers prevent direct connections to `ws://localhost:4455`. The **Local OBS Bridge** solves this securely.

1. In OBS Studio: **Tools > WebSocket Server Settings**:
   - Check **Enable WebSocket Server** (Port: `4455`).
2. In the Football Studio web dashboard, navigate to **Local OBS Bridge**.
3. Note your 6-digit **Studio Pairing Code**.
4. Run on your streaming PC:
   ```bash
   node obs-bridge.js --code=YOUR_PAIRING_CODE
   ```
   Or double-click the included `run-bridge-windows.bat`.

---

## ☁️ Deploying to Vercel

1. Push your repository to GitHub.
2. In **Vercel**, click **Import Project**.
3. Framework Preset: **Vite**.
4. The included `vercel.json` ensures direct route access (`/dock`, `/overlay`, etc.) works without 404 errors.
5. Deploy!
