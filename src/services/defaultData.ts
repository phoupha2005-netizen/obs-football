import { Team, Player, Match, TagMapping } from '../types';

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-arsenal',
    name: 'Arsenal FC',
    shortName: 'ARS',
    logoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=128&auto=format&fit=crop&q=80',
    primaryColor: '#ef0107',
    secondaryColor: '#ffffff',
    coach: 'Mikel Arteta'
  },
  {
    id: 'team-mancity',
    name: 'Manchester City',
    shortName: 'MCI',
    logoUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=128&auto=format&fit=crop&q=80',
    primaryColor: '#6cabdd',
    secondaryColor: '#1c2c5b',
    coach: 'Pep Guardiola'
  },
  {
    id: 'team-thailand',
    name: 'Thailand National Team',
    shortName: 'THA',
    logoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=128&auto=format&fit=crop&q=80',
    primaryColor: '#1d4ed8',
    secondaryColor: '#dc2626',
    coach: 'Masatada Ishii'
  },
  {
    id: 'team-laos',
    name: 'Laos National Team',
    shortName: 'LAO',
    logoUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=128&auto=format&fit=crop&q=80',
    primaryColor: '#dc2626',
    secondaryColor: '#1e3a8a',
    coach: 'Ha Hyeok-jun'
  }
];

export const INITIAL_PLAYERS: Player[] = [
  // Arsenal
  { id: 'p-ars-1', teamId: 'team-arsenal', name: 'David Raya', number: 22, position: 'GK', isStarting: true },
  { id: 'p-ars-2', teamId: 'team-arsenal', name: 'William Saliba', number: 2, position: 'DF', isStarting: true },
  { id: 'p-ars-3', teamId: 'team-arsenal', name: 'Gabriel Magalhães', number: 6, position: 'DF', isStarting: true },
  { id: 'p-ars-4', teamId: 'team-arsenal', name: 'Declan Rice', number: 41, position: 'MF', isStarting: true },
  { id: 'p-ars-5', teamId: 'team-arsenal', name: 'Martin Ødegaard', number: 8, position: 'MF', isStarting: true },
  { id: 'p-ars-6', teamId: 'team-arsenal', name: 'Bukayo Saka', number: 7, position: 'FW', isStarting: true },
  { id: 'p-ars-7', teamId: 'team-arsenal', name: 'Kai Havertz', number: 29, position: 'FW', isStarting: true },
  { id: 'p-ars-8', teamId: 'team-arsenal', name: 'Gabriel Martinelli', number: 11, position: 'FW', isStarting: false },
  { id: 'p-ars-9', teamId: 'team-arsenal', name: 'Leandro Trossard', number: 19, position: 'FW', isStarting: false },
  { id: 'p-ars-10', teamId: 'team-arsenal', name: 'Jorginho', number: 20, position: 'MF', isStarting: false },
  { id: 'p-ars-11', teamId: 'team-arsenal', name: 'Raheem Sterling', number: 30, position: 'FW', isStarting: false },

  // Man City
  { id: 'p-mci-1', teamId: 'team-mancity', name: 'Ederson', number: 31, position: 'GK', isStarting: true },
  { id: 'p-mci-2', teamId: 'team-mancity', name: 'Ruben Dias', number: 3, position: 'DF', isStarting: true },
  { id: 'p-mci-3', teamId: 'team-mancity', name: 'Josko Gvardiol', number: 24, position: 'DF', isStarting: true },
  { id: 'p-mci-4', teamId: 'team-mancity', name: 'Rodri', number: 16, position: 'MF', isStarting: true },
  { id: 'p-mci-5', teamId: 'team-mancity', name: 'Kevin De Bruyne', number: 17, position: 'MF', isStarting: true },
  { id: 'p-mci-6', teamId: 'team-mancity', name: 'Erling Haaland', number: 9, position: 'FW', isStarting: true },
  { id: 'p-mci-7', teamId: 'team-mancity', name: 'Phil Foden', number: 47, position: 'MF', isStarting: true },
  { id: 'p-mci-8', teamId: 'team-mancity', name: 'Jack Grealish', number: 10, position: 'FW', isStarting: false },
  { id: 'p-mci-9', teamId: 'team-mancity', name: 'Bernardo Silva', number: 20, position: 'MF', isStarting: false },
  { id: 'p-mci-10', teamId: 'team-mancity', name: 'Jeremy Doku', number: 11, position: 'FW', isStarting: false },

  // Thailand
  { id: 'p-tha-1', teamId: 'team-thailand', name: 'Patiwat Khammai', number: 1, position: 'GK', isStarting: true },
  { id: 'p-tha-2', teamId: 'team-thailand', name: 'Theerathon Bunmathan', number: 3, position: 'DF', isStarting: true },
  { id: 'p-tha-3', teamId: 'team-thailand', name: 'Chanathip Songkrasin', number: 18, position: 'MF', isStarting: true },
  { id: 'p-tha-4', teamId: 'team-thailand', name: 'Supachok Sarachat', number: 7, position: 'MF', isStarting: true },
  { id: 'p-tha-5', teamId: 'team-thailand', name: 'Suphanat Mueanta', number: 10, position: 'FW', isStarting: false },
  { id: 'p-tha-6', teamId: 'team-thailand', name: 'Teerasil Dangda', number: 9, position: 'FW', isStarting: false },

  // Laos
  { id: 'p-lao-1', teamId: 'team-laos', name: 'Keo-Oudone Souvannasangso', number: 12, position: 'GK', isStarting: true },
  { id: 'p-lao-2', teamId: 'team-laos', name: 'Phoutthavong Sangvilay', number: 19, position: 'DF', isStarting: true },
  { id: 'p-lao-3', teamId: 'team-laos', name: 'Chanthaviphone Phommalivong', number: 7, position: 'MF', isStarting: true },
  { id: 'p-lao-4', teamId: 'team-laos', name: 'Bounphachan Bounkong', number: 10, position: 'FW', isStarting: true },
  { id: 'p-lao-5', teamId: 'team-laos', name: 'Soukaphone Vongchiengkham', number: 11, position: 'FW', isStarting: false },
  { id: 'p-lao-6', teamId: 'team-laos', name: 'Billy Ketkeophomphone', number: 21, position: 'FW', isStarting: false },
];

export const INITIAL_MATCH: Match = {
  id: 'match-demo-1',
  teamAId: 'team-arsenal',
  teamBId: 'team-mancity',
  teamAName: 'Arsenal FC',
  teamBName: 'Manchester City',
  teamALogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=128&auto=format&fit=crop&q=80',
  teamBLogo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=128&auto=format&fit=crop&q=80',
  scoreA: 2,
  scoreB: 1,
  score2A: 0,
  score2B: 0,
  currentHalf: '2H',
  matchMinutes: 68,
  matchSeconds: 24,
  isTimerRunning: true,
  additionalMinutes: 4,
  status: 'live'
};

export const INITIAL_TAG_MAPPINGS: TagMapping[] = [
  {
    id: 'map-1',
    tag: '<PlayerOut>',
    obsSourceNames: ['Sub_Player_Out_Text', 'LowerThird_Out_Name'],
    enabled: true
  },
  {
    id: 'map-2',
    tag: '<PlayerIn>',
    obsSourceNames: ['Sub_Player_In_Text', 'LowerThird_In_Name'],
    enabled: true
  },
  {
    id: 'map-3',
    tag: '<NumberOut>',
    obsSourceNames: ['Sub_Number_Out_Text'],
    enabled: true
  },
  {
    id: 'map-4',
    tag: '<NumberIn>',
    obsSourceNames: ['Sub_Number_In_Text'],
    enabled: true
  },
  {
    id: 'map-5',
    tag: '<Minute>',
    obsSourceNames: ['Sub_Minute_Text', 'Scoreboard_Time_Text'],
    enabled: true
  },
  {
    id: 'map-6',
    tag: '<time_counter>',
    obsSourceNames: ['Scoreboard_Time_Text', 'Clock_Counter_Text'],
    enabled: true
  },
  {
    id: 'map-7',
    tag: '<score_team_a>',
    obsSourceNames: ['Score_A_Text'],
    enabled: true
  },
  {
    id: 'map-8',
    tag: '<score_team_b>',
    obsSourceNames: ['Score_B_Text'],
    enabled: true
  }
];
