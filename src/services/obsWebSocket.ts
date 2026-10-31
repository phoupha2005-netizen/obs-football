import OBSWebSocket from 'obs-websocket-js';
import { OBSSource, OBSScene, BroadcastLog } from '../types';

export class OBSManagerService {
  private obs: OBSWebSocket | null = null;
  private isConnected: boolean = false;
  private currentAddress: string = 'ws://127.0.0.1:4455';
  private logCallbacks: ((log: BroadcastLog) => void)[] = [];
  private statusCallbacks: ((connected: boolean) => void)[] = [];

  constructor() {
    this.obs = new OBSWebSocket();
    this.setupListeners();
  }

  private setupListeners() {
    if (!this.obs) return;

    this.obs.on('ConnectionClosed', (error) => {
      this.isConnected = false;
      this.notifyStatus(false);
      this.addLog('obs', `OBS connection closed: ${error ? error.message : 'Clean close'}`);
    });

    this.obs.on('ConnectionError', (err) => {
      this.isConnected = false;
      this.notifyStatus(false);
      this.addLog('error', `OBS connection error: ${err.message}`);
    });

    this.obs.on('CurrentProgramSceneChanged', (data) => {
      this.addLog('obs', `Active Program Scene changed to: ${data.sceneName}`);
    });

    this.obs.on('SceneItemEnableStateChanged', (data) => {
      this.addLog('obs', `Source ID ${data.sceneItemId} visibility changed to ${data.sceneItemEnabled ? 'VISIBLE' : 'HIDDEN'}`);
    });
  }

  public onLog(cb: (log: BroadcastLog) => void) {
    this.logCallbacks.push(cb);
  }

  public onStatusChange(cb: (connected: boolean) => void) {
    this.statusCallbacks.push(cb);
  }

  private notifyStatus(connected: boolean) {
    this.statusCallbacks.forEach(cb => cb(connected));
  }

  private addLog(type: BroadcastLog['type'], message: string) {
    const logItem: BroadcastLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    };
    this.logCallbacks.forEach(cb => cb(logItem));
  }

  public async connect(address = 'ws://127.0.0.1:4455', password = ''): Promise<{ success: boolean; error?: string }> {
    try {
      this.currentAddress = address;
      this.addLog('info', `Connecting to OBS WebSocket v5 at ${address}...`);
      
      if (!this.obs) {
        this.obs = new OBSWebSocket();
        this.setupListeners();
      }

      await this.obs.connect(address, password || undefined, {
        rpcVersion: 1
      });

      this.isConnected = true;
      this.notifyStatus(true);
      this.addLog('obs', `Successfully connected to OBS WebSocket v5 (${address})`);
      return { success: true };
    } catch (err: unknown) {
      this.isConnected = false;
      this.notifyStatus(false);
      const msg = err instanceof Error ? err.message : String(err);
      this.addLog('error', `Failed to connect to OBS: ${msg}`);
      return { success: false, error: msg };
    }
  }

  public async disconnect() {
    if (this.obs && this.isConnected) {
      try {
        await this.obs.disconnect();
      } catch (err) {
        console.error('Error during disconnect:', err);
      }
    }
    this.isConnected = false;
    this.notifyStatus(false);
    this.addLog('info', 'Disconnected from OBS.');
  }

  public getConnected(): boolean {
    return this.isConnected;
  }

  public async getScenes(): Promise<{ currentProgramSceneName: string; scenes: OBSScene[] }> {
    if (!this.obs || !this.isConnected) {
      return { currentProgramSceneName: '', scenes: [] };
    }
    try {
      const res = await this.obs.call('GetSceneList');
      const scenes: OBSScene[] = (res.scenes as Array<{ sceneName: string; sceneIndex: number }>).map(s => ({
        sceneName: s.sceneName,
        sceneIndex: s.sceneIndex
      }));
      return {
        currentProgramSceneName: res.currentProgramSceneName,
        scenes
      };
    } catch (err) {
      this.addLog('error', `Failed to fetch scenes: ${err instanceof Error ? err.message : String(err)}`);
      return { currentProgramSceneName: '', scenes: [] };
    }
  }

  public async getSourcesForScene(sceneName: string): Promise<OBSSource[]> {
    if (!this.obs || !this.isConnected || !sceneName) {
      return [];
    }
    try {
      const res = await this.obs.call('GetSceneItemList', { sceneName });
      const items: OBSSource[] = [];

      for (const item of res.sceneItems as Array<any>) {
        const sourceType = item.inputKind || item.sourceType || 'unknown';
        const isText = (
          sourceType.toLowerCase().includes('text') ||
          sourceType.includes('text_ft2_source') ||
          sourceType.includes('text_gdiplus')
        );

        items.push({
          sceneItemId: item.sceneItemId,
          sourceName: item.sourceName,
          sourceType,
          inputKind: item.inputKind,
          sceneItemEnabled: item.sceneItemEnabled,
          sceneName,
          isTextSource: isText,
        });
      }
      return items;
    } catch (err) {
      this.addLog('error', `Failed to fetch sources for scene ${sceneName}: ${err instanceof Error ? err.message : String(err)}`);
      return [];
    }
  }

  public async setSourceVisibility(sceneName: string, sceneItemId: number, enabled: boolean): Promise<boolean> {
    if (!this.obs || !this.isConnected) {
      this.addLog('info', `[Relay/Mock Mode] Source ${sceneItemId} in ${sceneName} toggled to ${enabled ? 'VISIBLE' : 'HIDDEN'}`);
      return true;
    }
    try {
      await this.obs.call('SetSceneItemEnabled', {
        sceneName,
        sceneItemId,
        sceneItemEnabled: enabled
      });
      this.addLog('obs', `Source ID ${sceneItemId} in ${sceneName} set to ${enabled ? 'VISIBLE' : 'HIDDEN'}`);
      return true;
    } catch (err) {
      this.addLog('error', `Failed to set source visibility: ${err instanceof Error ? err.message : String(err)}`);
      return false;
    }
  }

  public async updateTextSource(sourceName: string, newText: string): Promise<boolean> {
    if (!this.obs || !this.isConnected) {
      this.addLog('info', `[Relay/Mock Mode] Text Source "${sourceName}" updated to: "${newText}"`);
      return true;
    }
    try {
      // First, get the input settings to confirm it's actually an input that accepts text
      const input = await this.obs.call('GetInputSettings', { inputName: sourceName });
      const kind = (input.inputKind || '').toLowerCase();
      
      // Safety check: ONLY update text if source kind indicates text
      const isText = kind.includes('text') || kind.includes('gdiplus') || kind.includes('ft2');
      if (!isText && kind !== '') {
        this.addLog('error', `Safety check: Source "${sourceName}" is of type "${kind}" (not a Text source). Skipped text update.`);
        return false;
      }

      await this.obs.call('SetInputSettings', {
        inputName: sourceName,
        inputSettings: {
          text: newText
        },
        overlay: true
      });
      this.addLog('obs', `Text Source "${sourceName}" updated to: "${newText}"`);
      return true;
    } catch (err) {
      this.addLog('error', `Failed to update text for "${sourceName}": ${err instanceof Error ? err.message : String(err)}`);
      return false;
    }
  }

  public async showSubstitutionInOBS(
    subItemSourceName: string, 
    sceneName?: string, 
    sceneItemId?: number
  ): Promise<boolean> {
    if (sceneName && sceneItemId !== undefined) {
      return await this.setSourceVisibility(sceneName, sceneItemId, true);
    }
    this.addLog('sub', `Broadcasted SHOW command for Substitution Source "${subItemSourceName}"`);
    return true;
  }

  public async hideSubstitutionInOBS(
    subItemSourceName: string, 
    sceneName?: string, 
    sceneItemId?: number
  ): Promise<boolean> {
    if (sceneName && sceneItemId !== undefined) {
      return await this.setSourceVisibility(sceneName, sceneItemId, false);
    }
    this.addLog('sub', `Broadcasted HIDE command for Substitution Source "${subItemSourceName}"`);
    return true;
  }
}

export const obsManager = new OBSManagerService();
