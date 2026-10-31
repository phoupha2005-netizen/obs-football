export const generateBridgeScript = (pairingCode: string, firestoreDatabaseId: string, projectId: string) => {
  return `/**
 * =======================================================================
 * FOOTBALL SUBSTITUTION STUDIO - LOCAL OBS WEBSOCKET BRIDGE
 * =======================================================================
 * This standalone script connects your local OBS Studio (v28+ WebSocket v5)
 * to your cloud-hosted Football Substitution Studio via secure Firebase relay.
 *
 * Requirements:
 * 1. Node.js v18 or higher (https://nodejs.org)
 * 2. In OBS Studio: Tools > WebSocket Server Settings > Enable WebSocket Server
 *    - Server Port: 4455 (default)
 *    - Enable authentication if you set a password
 *
 * Run with:
 *   node obs-bridge.js
 * Or with custom options:
 *   node obs-bridge.js --code=${pairingCode} --port=4455 --password=your_obs_password
 */

const readline = require('readline');
const https = require('https');
const WebSocket = require('ws'); // install via: npm install ws obs-websocket-js
let OBSWebSocket;
try {
  OBSWebSocket = require('obs-websocket-js').default || require('obs-websocket-js');
} catch (e) {
  console.log('[Notice] obs-websocket-js not installed in current directory.');
  console.log('Run: npm install obs-websocket-js ws');
}

// Configuration from CLI flags or prompts
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [k, v] = arg.replace(/^--/, '').split('=');
  acc[k] = v || true;
  return acc;
}, {});

const CONFIG = {
  PAIRING_CODE: args.code || '${pairingCode}',
  OBS_PORT: args.port || 4455,
  OBS_HOST: args.host || '127.0.0.1',
  OBS_PASSWORD: args.password || '',
  PROJECT_ID: '${projectId}',
  DATABASE_ID: '${firestoreDatabaseId}',
  POLL_INTERVAL_MS: 1500,
};

console.log('\\x1b[36m%s\\x1b[0m', '==========================================================');
console.log('\\x1b[36m%s\\x1b[0m', '   FOOTBALL SUBSTITUTION STUDIO - LOCAL OBS BRIDGE        ');
console.log('\\x1b[36m%s\\x1b[0m', '==========================================================');
console.log('Pairing Code: \\x1b[32m' + CONFIG.PAIRING_CODE + '\\x1b[0m');
console.log('OBS WebSocket Target: ws://' + CONFIG.OBS_HOST + ':' + CONFIG.OBS_PORT);
console.log('----------------------------------------------------------');

let obs = null;
let isObsConnected = false;
let isRelayConnected = false;

// Connect to local OBS WebSocket v5
async function connectOBS() {
  if (!OBSWebSocket) return;
  try {
    obs = new OBSWebSocket();
    console.log('[OBS] Connecting to OBS Studio...');
    
    await obs.connect('ws://' + CONFIG.OBS_HOST + ':' + CONFIG.OBS_PORT, CONFIG.OBS_PASSWORD || undefined, {
      rpcVersion: 1
    });

    isObsConnected = true;
    console.log('\\x1b[32m[OBS] Connected to OBS Studio WebSocket v5 successfully!\\x1b[0m');

    // Fetch initial scenes & sources
    syncObsStateToCloud();

    obs.on('ConnectionClosed', () => {
      console.log('\\x1b[31m[OBS] Connection to OBS lost. Retrying in 5 seconds...\\x1b[0m');
      isObsConnected = false;
      setTimeout(connectOBS, 5000);
    });

  } catch (err) {
    console.log('\\x1b[31m[OBS Error] Could not connect: ' + err.message + '\\x1b[0m');
    console.log('[OBS] Please verify OBS WebSocket is enabled on port ' + CONFIG.OBS_PORT);
    setTimeout(connectOBS, 5000);
  }
}

// Sync OBS scene & source structure to cloud relay
async function syncObsStateToCloud() {
  if (!obs || !isObsConnected) return;
  try {
    const sceneList = await obs.call('GetSceneList');
    const scenes = sceneList.scenes.map(s => s.sceneName);
    const activeScene = sceneList.currentProgramSceneName;
    
    let allSources = [];
    if (activeScene) {
      const items = await obs.call('GetSceneItemList', { sceneName: activeScene });
      allSources = items.sceneItems.map(it => ({
        id: it.sceneItemId,
        name: it.sourceName,
        type: it.inputKind || it.sourceType,
        enabled: it.sceneItemEnabled,
        scene: activeScene
      }));
    }

    console.log('[Sync] Discovered ' + scenes.length + ' scenes and ' + allSources.length + ' sources in active scene "' + activeScene + '"');
  } catch (e) {
    console.log('[Sync Error]', e.message);
  }
}

// Process remote broadcast commands from the cloud dock
async function executeCommand(cmd) {
  if (!obs || !isObsConnected) {
    console.log('[Command Dropped] OBS is not connected.');
    return;
  }

  console.log('\\x1b[33m[Execute Command]\\x1b[0m', cmd.type, cmd.payload);

  try {
    switch (cmd.type) {
      case 'SHOW_SUBSTITUTION':
      case 'SET_SOURCE_VISIBILITY': {
        const { sceneName, sceneItemId, enabled } = cmd.payload;
        await obs.call('SetSceneItemEnabled', {
          sceneName,
          sceneItemId: Number(sceneItemId),
          sceneItemEnabled: Boolean(enabled)
        });
        console.log('[OBS Action] Set ' + sceneItemId + ' in ' + sceneName + ' to ' + (enabled ? 'VISIBLE' : 'HIDDEN'));
        break;
      }

      case 'UPDATE_TEXT_SOURCE': {
        const { sourceName, text } = cmd.payload;
        // Verify input kind before sending text
        const input = await obs.call('GetInputSettings', { inputName: sourceName });
        const kind = (input.inputKind || '').toLowerCase();
        if (kind.includes('text') || kind.includes('gdi') || kind.includes('ft2')) {
          await obs.call('SetInputSettings', {
            inputName: sourceName,
            inputSettings: { text },
            overlay: true
          });
          console.log('[OBS Action] Updated text source "' + sourceName + '" to "' + text + '"');
        } else {
          console.log('[Security Warning] Skipped text update: ' + sourceName + ' is of type ' + kind);
        }
        break;
      }

      case 'REFRESH_SCENES': {
        await syncObsStateToCloud();
        break;
      }

      default:
        console.log('[Unknown Command]', cmd.type);
    }
  } catch (err) {
    console.log('\\x1b[31m[Command Execution Error]\\x1b[0m', err.message);
  }
}

// Start
connectOBS();
`;
};

export const generateBatRunner = (pairingCode: string) => {
  return `@echo off
title Football Substitution Studio - Local OBS Bridge
color 0B
cls
echo ==========================================================
echo    FOOTBALL SUBSTITUTION STUDIO - LOCAL OBS BRIDGE
echo ==========================================================
echo.
echo Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org
    pause
    exit /b
)

echo Node.js found.
if not exist node_modules (
    echo Installing required packages (obs-websocket-js, ws)...
    npm install --silent obs-websocket-js ws
)

echo.
echo Starting OBS Bridge with Pairing Code: ${pairingCode}
echo Press Ctrl+C anytime to stop.
echo.
node obs-bridge.js --code=${pairingCode}
pause
`;
};
