import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  Language, 
  UserRole, 
  UserProfile, 
  Team, 
  Player, 
  Match, 
  Substitution, 
  LowerThirdTemplate, 
  TagMapping, 
  OBSScene, 
  OBSSource, 
  BroadcastLog 
} from '../types';
import { translations } from '../i18n/translations';
import { INITIAL_TEAMS, INITIAL_PLAYERS, INITIAL_MATCH, INITIAL_TAG_MAPPINGS } from '../services/defaultData';
import { PRESET_TEMPLATES } from '../services/defaultTemplates';
import { obsManager } from '../services/obsWebSocket';
import { resolveTags } from '../services/tagEngine';
import { auth, loginWithGoogle, logoutUser, testConnection, db } from '../services/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export const getPublicOBSUrl = (path: string = '/overlay') => {
  let origin = window.location.origin;
  // If running in development preview, replace private dev proxy with shared public URL
  if (origin.includes('ais-dev-')) {
    origin = origin.replace('ais-dev-', 'ais-pre-');
  }
  return `${origin}${path}`;
};

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  
  // Auth
  user: FirebaseUser | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;

  // Match
  match: Match;
  setMatch: React.Dispatch<React.SetStateAction<Match>>;
  updateScore: (team: 'A' | 'B', delta: number) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  setMatchTime: (minutes: number, seconds?: number) => void;
  setMatchHalf: (half: Match['currentHalf']) => void;

  // Teams & Players
  teams: Team[];
  players: Player[];
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  addPlayer: (player: Omit<Player, 'id'>) => void;
  updatePlayer: (id: string, player: Partial<Player>) => void;
  deletePlayer: (id: string) => void;

  // Substitutions
  substitutions: Substitution[];
  activeSub: Substitution | null;
  onAir: boolean;
  addSubstitution: (subData: Partial<Substitution>) => void;
  updateSubstitution: (id: string, subData: Partial<Substitution>) => void;
  deleteSubstitution: (id: string) => void;
  clearSubstitutions: () => void;
  showOnAir: (subId?: string) => Promise<void>;
  hideFromAir: () => Promise<void>;
  nextSub: () => Promise<void>;
  prevSub: () => Promise<void>;

  // Designer & Templates
  templates: LowerThirdTemplate[];
  activeTemplate: LowerThirdTemplate;
  setActiveTemplate: (tpl: LowerThirdTemplate) => void;
  saveTemplate: (tpl: LowerThirdTemplate) => void;
  deleteTemplate: (id: string) => void;

  // OBS
  obsConnected: boolean;
  obsConnecting: boolean;
  obsAddress: string;
  setObsAddress: (addr: string) => void;
  obsPassword: string;
  setObsPassword: (pwd: string) => void;
  scenes: OBSScene[];
  sources: OBSSource[];
  activeScene: string;
  setActiveScene: (scene: string) => void;
  connectOBS: (addr?: string, pwd?: string) => Promise<{ success: boolean; error?: string }>;
  disconnectOBS: () => Promise<void>;
  refreshOBSSources: () => Promise<void>;
  toggleSourceVisibility: (sceneName: string, sceneItemId: number, enabled: boolean) => Promise<void>;
  updateOBSTextSource: (sourceName: string, text: string) => Promise<void>;
  pairingCode: string;

  // Tags & Mapping
  tagMappings: TagMapping[];
  addTagMapping: (mapping: Omit<TagMapping, 'id'>) => void;
  updateTagMapping: (id: string, mapping: Partial<TagMapping>) => void;
  deleteTagMapping: (id: string) => void;
  syncTagsToOBS: (overrideSub?: Substitution | null) => Promise<void>;

  // Settings & Logs
  logs: BroadcastLog[];
  clearLogs: () => void;
  autoHideSeconds: number;
  setAutoHideSeconds: (sec: number) => void;
  audioTallyEnabled: boolean;
  setAudioTallyEnabled: (val: boolean) => void;
  customLabels: Record<string, string>;
  setCustomLabels: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('fss_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('fss_lang', lang);
  };

  const t = useCallback((key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  }, [language]);

  // Auth State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<UserRole>('operator');

  useEffect(() => {
    testConnection().catch(console.warn);
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      setUser(currUser);
      if (currUser) {
        if (currUser.email === 'phoupha2005@gmail.com') {
          setRole('admin');
        } else {
          try {
            const userSnap = await getDoc(doc(db, 'users', currUser.uid));
            if (userSnap.exists()) {
              setRole(userSnap.data().role || 'operator');
            } else {
              setRole('operator');
            }
          } catch {
            setRole('operator');
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    await loginWithGoogle();
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  // Match State
  const [match, setMatch] = useState<Match>(() => {
    const saved = localStorage.getItem('fss_match');
    return saved ? JSON.parse(saved) : INITIAL_MATCH;
  });

  useEffect(() => {
    localStorage.setItem('fss_match', JSON.stringify(match));
  }, [match]);

  // Teams & Players
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('fss_teams');
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('fss_players');
    return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
  });

  useEffect(() => {
    localStorage.setItem('fss_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('fss_players', JSON.stringify(players));
  }, [players]);

  // Substitutions
  const [substitutions, setSubstitutions] = useState<Substitution[]>(() => {
    const saved = localStorage.getItem('fss_subs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'sub-init-1',
        matchId: 'match-demo-1',
        teamId: 'team-arsenal',
        teamName: 'Arsenal FC',
        playerOutId: 'p-ars-6',
        playerOutName: 'Bukayo Saka',
        playerOutNumber: 7,
        playerInId: 'p-ars-8',
        playerInName: 'Gabriel Martinelli',
        playerInNumber: 11,
        minute: 68,
        additionalTime: '',
        subType: 'tactical',
        status: 'queued',
        obsStatus: 'hidden',
        order: 1,
        createdAt: new Date().toISOString()
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('fss_subs', JSON.stringify(substitutions));
  }, [substitutions]);

  const [activeSub, setActiveSub] = useState<Substitution | null>(null);
  const [onAir, setOnAir] = useState<boolean>(false);

  // Templates
  const [templates, setTemplates] = useState<LowerThirdTemplate[]>(() => {
    const saved = localStorage.getItem('fss_templates');
    return saved ? JSON.parse(saved) : PRESET_TEMPLATES;
  });

  const [activeTemplate, setActiveTemplate] = useState<LowerThirdTemplate>(PRESET_TEMPLATES[0]);

  // OBS State
  const [obsConnected, setObsConnected] = useState<boolean>(false);
  const [obsConnecting, setObsConnecting] = useState<boolean>(false);
  const [obsAddress, setObsAddress] = useState<string>('ws://127.0.0.1:4455');
  const [obsPassword, setObsPassword] = useState<string>('');
  const [scenes, setScenes] = useState<OBSScene[]>([]);
  const [sources, setSources] = useState<OBSSource[]>([]);
  const [activeScene, setActiveScene] = useState<string>('');
  
  // Studio Pairing Code (Persistent)
  const [pairingCode] = useState<string>(() => {
    const saved = localStorage.getItem('fss_pairing_code');
    if (saved) return saved;
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('fss_pairing_code', generated);
    return generated;
  });

  // Tag Mappings
  const [tagMappings, setTagMappings] = useState<TagMapping[]>(() => {
    const saved = localStorage.getItem('fss_mappings');
    return saved ? JSON.parse(saved) : INITIAL_TAG_MAPPINGS;
  });

  useEffect(() => {
    localStorage.setItem('fss_mappings', JSON.stringify(tagMappings));
  }, [tagMappings]);

  // Custom Labels
  const [customLabels, setCustomLabels] = useState<Record<string, string>>({
    label1: 'PREMIER LEAGUE 2026/27',
    label2: 'EMIRATES STADIUM, LONDON',
    label3: 'MATCHDAY 24',
    label4: 'OFFICIAL BROADCAST',
    label5: 'SUBSTITUTION NOTICE'
  });

  // Settings & Broadcast Logs
  const [logs, setLogs] = useState<BroadcastLog[]>([]);
  const [autoHideSeconds, setAutoHideSeconds] = useState<number>(8);
  const [audioTallyEnabled, setAudioTallyEnabled] = useState<boolean>(true);

  const autoHideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = useCallback((type: BroadcastLog['type'], message: string) => {
    setLogs(prev => [
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        type,
        message
      },
      ...prev.slice(0, 99)
    ]);
  }, []);

  const clearLogs = () => setLogs([]);

  // Setup OBS WebSocket listener
  useEffect(() => {
    obsManager.onLog((log) => {
      setLogs(prev => [log, ...prev.slice(0, 99)]);
    });

    obsManager.onStatusChange((connected) => {
      setObsConnected(connected);
      if (connected) {
        refreshOBSSources();
      }
    });
  }, []);

  // Match Clock Interval (Running timer ticks every second)
  useEffect(() => {
    if (!match.isTimerRunning) return;

    const interval = setInterval(() => {
      setMatch(prev => {
        let newSec = prev.matchSeconds + 1;
        let newMin = prev.matchMinutes;
        if (newSec >= 60) {
          newSec = 0;
          newMin += 1;
        }
        return {
          ...prev,
          matchMinutes: newMin,
          matchSeconds: newSec
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [match.isTimerRunning]);

  // Audio Tally sound effect
  const playTallyBeep = useCallback((on: boolean) => {
    if (!audioTallyEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = on ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(on ? 880 : 440, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch {
      // AudioContext may be blocked before interaction
    }
  }, [audioTallyEnabled]);

  // Broadcast synchronizer between OBS Dock, Browser Sources, and Cloud
  const broadcastAirState = useCallback((air: boolean, currentSub: Substitution | null, currentMatch: Match) => {
    // 1. BroadcastChannel (Instant same-browser inter-tab/inter-dock relay)
    try {
      const channel = new BroadcastChannel('football_studio_broadcast');
      channel.postMessage({
        type: 'SYNC_AIR_STATE',
        onAir: air,
        activeSub: currentSub,
        match: currentMatch
      });
      channel.close();
    } catch {}

    // 2. LocalStorage StorageEvent
    try {
      localStorage.setItem('fss_live_air_sync', JSON.stringify({
        onAir: air,
        activeSub: currentSub,
        match: currentMatch,
        timestamp: Date.now()
      }));
    } catch {}

    // 3. Firestore Relay (For remote controllers / multi-device)
    try {
      setDoc(doc(db, 'obsConnections', 'broadcastState'), {
        onAir: air,
        activeSub: currentSub,
        match: currentMatch,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(() => {});
    } catch {}
  }, []);

  // Listen for broadcast sync across windows / OBS Browser Source
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('football_studio_broadcast');
      channel.onmessage = (event) => {
        const data = event.data;
        if (data && data.type === 'SYNC_AIR_STATE') {
          setOnAir(Boolean(data.onAir));
          if (data.activeSub !== undefined) setActiveSub(data.activeSub);
          if (data.match) setMatch(data.match);
        }
      };
    } catch (err) {
      console.warn('BroadcastChannel not supported', err);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'fss_live_air_sync' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setOnAir(Boolean(parsed.onAir));
          if (parsed.activeSub !== undefined) setActiveSub(parsed.activeSub);
          if (parsed.match) setMatch(parsed.match);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // Initial read from local storage if available
    try {
      const savedAir = localStorage.getItem('fss_live_air_sync');
      if (savedAir) {
        const parsed = JSON.parse(savedAir);
        if (parsed.activeSub) setActiveSub(parsed.activeSub);
      }
    } catch {}

    // Listen on Firestore
    const unsub = onSnapshot(doc(db, 'obsConnections', 'broadcastState'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.onAir !== undefined) setOnAir(Boolean(data.onAir));
        if (data.activeSub) setActiveSub(data.activeSub);
        if (data.match) setMatch(data.match);
      }
    }, () => {});

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
      unsub();
    };
  }, []);

  // Push Tag values to OBS
  const syncTagsToOBS = useCallback(async (overrideSub: Substitution | null = null) => {
    const currentSub = overrideSub !== undefined ? overrideSub : activeSub;
    addLog('info', 'Synchronizing dynamic TAGs to OBS Sources...');

    for (const mapping of tagMappings) {
      if (!mapping.enabled || mapping.obsSourceNames.length === 0) continue;

      const resolvedText = resolveTags(mapping.tag, match, currentSub, customLabels);
      for (const sourceName of mapping.obsSourceNames) {
        await obsManager.updateTextSource(sourceName, resolvedText);
      }
    }
  }, [tagMappings, match, activeSub, customLabels, addLog]);

  // OBS Connect
  const connectOBS = async (addr = obsAddress, pwd = obsPassword) => {
    setObsConnecting(true);
    const res = await obsManager.connect(addr, pwd);
    setObsConnecting(false);
    if (res.success) {
      setObsConnected(true);
      await refreshOBSSources();
    }
    return res;
  };

  const disconnectOBS = async () => {
    await obsManager.disconnect();
    setObsConnected(false);
  };

  const refreshOBSSources = async () => {
    const { currentProgramSceneName, scenes: fetchedScenes } = await obsManager.getScenes();
    setScenes(fetchedScenes);
    const sceneToUse = currentProgramSceneName || fetchedScenes[0]?.sceneName || '';
    setActiveScene(sceneToUse);
    if (sceneToUse) {
      const srcList = await obsManager.getSourcesForScene(sceneToUse);
      setSources(srcList);
    }
  };

  const toggleSourceVisibility = async (sceneName: string, sceneItemId: number, enabled: boolean) => {
    await obsManager.setSourceVisibility(sceneName, sceneItemId, enabled);
    setSources(prev => prev.map(s => 
      s.sceneItemId === sceneItemId ? { ...s, sceneItemEnabled: enabled } : s
    ));
  };

  const updateOBSTextSource = async (sourceName: string, text: string) => {
    await obsManager.updateTextSource(sourceName, text);
  };

  // Match actions
  const updateScore = (team: 'A' | 'B', delta: number) => {
    setMatch(prev => {
      const field = team === 'A' ? 'scoreA' : 'scoreB';
      const newVal = Math.max(0, prev[field] + delta);
      addLog('match', `Score updated: ${prev.teamAName} ${team === 'A' ? newVal : prev.scoreA} - ${team === 'B' ? newVal : prev.scoreB} ${prev.teamBName}`);
      return { ...prev, [field]: newVal };
    });
  };

  const toggleTimer = () => {
    setMatch(prev => {
      const nextRunning = !prev.isTimerRunning;
      addLog('match', `Match clock ${nextRunning ? 'STARTED' : 'PAUSED'} at ${prev.matchMinutes}:${prev.matchSeconds}`);
      return { ...prev, isTimerRunning: nextRunning };
    });
  };

  const resetTimer = () => {
    setMatch(prev => ({
      ...prev,
      matchMinutes: 0,
      matchSeconds: 0,
      isTimerRunning: false
    }));
    addLog('match', 'Match clock reset to 00:00');
  };

  const setMatchTime = (minutes: number, seconds = 0) => {
    setMatch(prev => ({ ...prev, matchMinutes: minutes, matchSeconds: seconds }));
  };

  const setMatchHalf = (half: Match['currentHalf']) => {
    setMatch(prev => {
      addLog('match', `Match period set to: ${half}`);
      return { ...prev, currentHalf: half };
    });
  };

  // Teams & Players CRUD
  const addTeam = (teamData: Omit<Team, 'id'>) => {
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}`
    };
    setTeams(prev => [...prev, newTeam]);
    addLog('info', `Added new team: ${newTeam.name}`);
  };

  const updateTeam = (id: string, partial: Partial<Team>) => {
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...partial } : t));
    addLog('info', `Updated team ${id}`);
  };

  const deleteTeam = (id: string) => {
    setTeams(prev => prev.filter(t => t.id !== id));
    addLog('info', `Deleted team ${id}`);
  };

  const addPlayer = (playerData: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...playerData,
      id: `p-${Date.now()}`
    };
    setPlayers(prev => [...prev, newPlayer]);
    addLog('info', `Added player #${newPlayer.number} ${newPlayer.name}`);
  };

  const updatePlayer = (id: string, partial: Partial<Player>) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, ...partial } : p));
  };

  const deletePlayer = (id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  // Substitutions
  const addSubstitution = (subData: Partial<Substitution>) => {
    const newSub: Substitution = {
      id: `sub-${Date.now()}`,
      matchId: match.id,
      teamId: subData.teamId || match.teamAId,
      teamName: subData.teamName || match.teamAName,
      playerOutId: subData.playerOutId,
      playerOutName: subData.playerOutName || '',
      playerOutNumber: Number(subData.playerOutNumber) || 0,
      playerOutPhoto: subData.playerOutPhoto,
      playerInId: subData.playerInId,
      playerInName: subData.playerInName || '',
      playerInNumber: Number(subData.playerInNumber) || 0,
      playerInPhoto: subData.playerInPhoto,
      minute: subData.minute ?? match.matchMinutes,
      additionalTime: subData.additionalTime || '',
      subType: subData.subType || 'tactical',
      status: 'queued',
      obsStatus: 'hidden',
      order: substitutions.length + 1,
      createdAt: new Date().toISOString()
    };
    setSubstitutions(prev => [newSub, ...prev]);
    addLog('sub', `Queued substitution: #${newSub.playerOutNumber} ${newSub.playerOutName} ➜ #${newSub.playerInNumber} ${newSub.playerInName} (${newSub.teamName})`);
  };

  const updateSubstitution = (id: string, partial: Partial<Substitution>) => {
    setSubstitutions(prev => prev.map(s => s.id === id ? { ...s, ...partial } : s));
    if (activeSub?.id === id) {
      setActiveSub(prev => prev ? { ...prev, ...partial } : null);
    }
  };

  const deleteSubstitution = (id: string) => {
    setSubstitutions(prev => prev.filter(s => s.id !== id));
    if (activeSub?.id === id) {
      setActiveSub(null);
      setOnAir(false);
    }
    addLog('sub', `Deleted substitution ${id}`);
  };

  const clearSubstitutions = () => {
    setSubstitutions([]);
    setActiveSub(null);
    setOnAir(false);
    addLog('sub', 'Cleared all substitutions queue.');
  };

  // SHOW ON AIR
  const showOnAir = async (subId?: string) => {
    let target = subId ? substitutions.find(s => s.id === subId) : null;
    if (!target) {
      // Pick first queued
      target = substitutions.find(s => s.status === 'queued') || substitutions[0];
    }
    if (!target) {
      // If queue is empty, auto generate a sample substitution so the broadcast never fails
      target = {
        id: `sub-${Date.now()}`,
        matchId: match.id,
        teamId: match.teamAId,
        teamName: match.teamAName,
        playerOutName: 'Bukayo Saka',
        playerOutNumber: 7,
        playerInName: 'Gabriel Martinelli',
        playerInNumber: 11,
        minute: match.matchMinutes || 68,
        additionalTime: '',
        subType: 'tactical',
        status: 'on_air',
        obsStatus: 'visible',
        order: 1,
        createdAt: new Date().toISOString()
      };
      setSubstitutions(prev => [target!, ...prev]);
    }

    setActiveSub(target);
    setOnAir(true);
    playTallyBeep(true);
    broadcastAirState(true, target, match);

    // Update sub status
    setSubstitutions(prev => prev.map(s => 
      s.id === target!.id 
        ? { ...s, status: 'on_air', obsStatus: 'visible' } 
        : (s.status === 'on_air' ? { ...s, status: 'completed', obsStatus: 'hidden' } : s)
    ));

    // Update tags to OBS
    await syncTagsToOBS(target);

    // Toggle OBS Lower Third source visibility
    const lowerThirdSource = sources.find(s => 
      s.sourceName.toLowerCase().includes('sub') || 
      s.sourceName.toLowerCase().includes('lower') ||
      s.sourceName.toLowerCase().includes('overlay')
    );
    if (lowerThirdSource && activeScene) {
      await obsManager.setSourceVisibility(activeScene, lowerThirdSource.sceneItemId, true);
    }

    addLog('sub', `🚨 ON AIR: #${target.playerOutNumber} ${target.playerOutName} ➜ #${target.playerInNumber} ${target.playerInName}`);

    // Auto-hide handling
    if (autoHideTimerRef.current) clearTimeout(autoHideTimerRef.current);
    if (autoHideSeconds > 0) {
      autoHideTimerRef.current = setTimeout(() => {
        hideFromAir();
      }, autoHideSeconds * 1000);
    }
  };

  // HIDE FROM AIR
  const hideFromAir = async () => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
    setOnAir(false);
    playTallyBeep(false);
    broadcastAirState(false, activeSub, match);

    if (activeSub) {
      setSubstitutions(prev => prev.map(s => 
        s.id === activeSub.id ? { ...s, status: 'completed', obsStatus: 'hidden' } : s
      ));
    }

    // Toggle OBS lower third source off
    const lowerThirdSource = sources.find(s => 
      s.sourceName.toLowerCase().includes('sub') || 
      s.sourceName.toLowerCase().includes('lower') ||
      s.sourceName.toLowerCase().includes('overlay')
    );
    if (lowerThirdSource && activeScene) {
      await obsManager.setSourceVisibility(activeScene, lowerThirdSource.sceneItemId, false);
    }

    addLog('sub', '⏹ OFF AIR: Lower Third hidden.');
  };

  const nextSub = async () => {
    const queued = substitutions.filter(s => s.status === 'queued');
    if (queued.length > 0) {
      await showOnAir(queued[0].id);
    } else {
      addLog('info', 'No more queued substitutions.');
    }
  };

  const prevSub = async () => {
    const completed = substitutions.filter(s => s.status === 'completed');
    if (completed.length > 0) {
      await showOnAir(completed[0].id);
    }
  };

  // Templates
  const saveTemplate = (tpl: LowerThirdTemplate) => {
    setTemplates(prev => {
      const exists = prev.some(t => t.id === tpl.id);
      const updated = exists ? prev.map(t => t.id === tpl.id ? tpl : t) : [...prev, tpl];
      localStorage.setItem('fss_templates', JSON.stringify(updated));
      return updated;
    });
    setActiveTemplate(tpl);
    addLog('info', `Saved template "${tpl.name}"`);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => {
      const filtered = prev.filter(t => t.id !== id);
      localStorage.setItem('fss_templates', JSON.stringify(filtered));
      return filtered;
    });
  };

  // Tag mappings
  const addTagMapping = (mappingData: Omit<TagMapping, 'id'>) => {
    const newMapping: TagMapping = {
      ...mappingData,
      id: `map-${Date.now()}`
    };
    setTagMappings(prev => [...prev, newMapping]);
  };

  const updateTagMapping = (id: string, partial: Partial<TagMapping>) => {
    setTagMappings(prev => prev.map(m => m.id === id ? { ...m, ...partial } : m));
  };

  const deleteTagMapping = (id: string) => {
    setTagMappings(prev => prev.filter(m => m.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        user,
        role,
        setRole,
        handleLogin,
        handleLogout,
        match,
        setMatch,
        updateScore,
        toggleTimer,
        resetTimer,
        setMatchTime,
        setMatchHalf,
        teams,
        players,
        addTeam,
        updateTeam,
        deleteTeam,
        addPlayer,
        updatePlayer,
        deletePlayer,
        substitutions,
        activeSub,
        onAir,
        addSubstitution,
        updateSubstitution,
        deleteSubstitution,
        clearSubstitutions,
        showOnAir,
        hideFromAir,
        nextSub,
        prevSub,
        templates,
        activeTemplate,
        setActiveTemplate,
        saveTemplate,
        deleteTemplate,
        obsConnected,
        obsConnecting,
        obsAddress,
        setObsAddress,
        obsPassword,
        setObsPassword,
        scenes,
        sources,
        activeScene,
        setActiveScene,
        connectOBS,
        disconnectOBS,
        refreshOBSSources,
        toggleSourceVisibility,
        updateOBSTextSource,
        pairingCode,
        tagMappings,
        addTagMapping,
        updateTagMapping,
        deleteTagMapping,
        syncTagsToOBS,
        logs,
        clearLogs,
        autoHideSeconds,
        setAutoHideSeconds,
        audioTallyEnabled,
        setAudioTallyEnabled,
        customLabels,
        setCustomLabels
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
