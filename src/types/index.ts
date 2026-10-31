export type Language = 'en' | 'th' | 'la';

export type UserRole = 'admin' | 'operator';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface Player {
  id: string;
  teamId: string;
  name: string;
  number: number;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  photoUrl?: string;
  isStarting: boolean;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  coach: string;
  createdBy?: string;
}

export type MatchHalf = '1H' | 'HT' | '2H' | 'FT' | 'ET1' | 'ET2' | 'PEN';
export type MatchStatus = 'upcoming' | 'live' | 'finished';

export interface Match {
  id: string;
  teamAId: string;
  teamBId: string;
  teamAName: string;
  teamBName: string;
  teamALogo: string;
  teamBLogo: string;
  scoreA: number;
  scoreB: number;
  score2A?: number; // e.g. aggregate or penalty
  score2B?: number;
  currentHalf: MatchHalf;
  matchMinutes: number;
  matchSeconds: number;
  isTimerRunning: boolean;
  additionalMinutes: number;
  status: MatchStatus;
  updatedAt?: string;
}

export type SubstitutionType = 'tactical' | 'injury' | 'double' | 'emergency';
export type SubstitutionStatus = 'queued' | 'on_air' | 'completed' | 'cancelled';
export type OBSAirStatus = 'hidden' | 'visible' | 'updating';

export interface Substitution {
  id: string;
  matchId: string;
  teamId: string;
  teamName: string;
  playerOutId?: string;
  playerOutName: string;
  playerOutNumber: number;
  playerOutPhoto?: string;
  playerInId?: string;
  playerInName: string;
  playerInNumber: number;
  playerInPhoto?: string;
  minute: number;
  additionalTime?: string;
  subType: SubstitutionType;
  status: SubstitutionStatus;
  obsStatus: OBSAirStatus;
  order: number;
  timestamp?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type LayerType = 
  | 'background' 
  | 'teamName' 
  | 'playerOut' 
  | 'playerIn' 
  | 'playerNumber' 
  | 'minute' 
  | 'logo' 
  | 'customText'
  | 'banner';

export interface LayerStyle {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  backgroundColor: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  textAlign: 'left' | 'center' | 'right';
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  boxShadow: string;
  opacity: number;
  zIndex: number;
  animation: 'slide-left' | 'slide-up' | 'fade' | 'zoom' | 'split-modern';
  animationDuration: number; // in seconds
  visible: boolean;
  locked?: boolean;
}

export interface LayerElement {
  id: string;
  name: string;
  type: LayerType;
  content?: string; // May contain tags like <PlayerOut>
  style: LayerStyle;
}

export interface LowerThirdTemplate {
  id: string;
  name: string;
  resolution: '1920x1080' | '1280x720';
  elements: LayerElement[];
  backgroundColor: string;
  previewUrl?: string;
  isDefault?: boolean;
  updatedAt?: string;
}

export interface TagDefinition {
  tag: string;
  label: string;
  description: string;
  category: 'team' | 'score' | 'player' | 'time' | 'custom';
  exampleValue: string;
}

export interface TagMapping {
  id: string;
  tag: string;
  obsSourceNames: string[]; // Can bind to multiple OBS sources
  transformRule?: string; // e.g. uppercase, prefix, suffix
  targetProperty?: 'text' | 'visibility' | 'image';
  enabled: boolean;
}

export interface OBSSource {
  sceneItemId: number;
  sourceName: string;
  sourceType: string;
  sceneItemEnabled: boolean;
  sceneName: string;
  inputKind?: string;
  isTextSource?: boolean;
}

export interface OBSScene {
  sceneName: string;
  sceneIndex: number;
}

export interface OBSConnectionConfig {
  address: string; // e.g. "ws://127.0.0.1:4455"
  password?: string;
  autoReconnect: boolean;
  connectionType: 'direct' | 'relay';
  pairingCode: string;
}

export interface BroadcastLog {
  id: string;
  timestamp: string;
  type: 'info' | 'obs' | 'sub' | 'match' | 'error';
  message: string;
}
