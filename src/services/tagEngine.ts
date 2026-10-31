import { Match, Substitution, TagDefinition } from '../types';

export const DEFAULT_TAGS: TagDefinition[] = [
  { tag: '<TeamA>', label: 'Team A Name', description: 'Name of Home team', category: 'team', exampleValue: 'Arsenal' },
  { tag: '<TeamB>', label: 'Team B Name', description: 'Name of Away team', category: 'team', exampleValue: 'Man City' },
  { tag: '<TeamLogo>', label: 'Team Logo URL', description: 'Active substituting team crest image', category: 'team', exampleValue: 'https://...' },
  { tag: '<score_team_a>', label: 'Score Team A', description: 'Current goals scored by Team A', category: 'score', exampleValue: '2' },
  { tag: '<score_team_b>', label: 'Score Team B', description: 'Current goals scored by Team B', category: 'score', exampleValue: '1' },
  { tag: '<score2_team_a>', label: 'Score 2 Team A', description: 'Aggregate or penalty score for Team A', category: 'score', exampleValue: '4' },
  { tag: '<score2_team_b>', label: 'Score 2 Team B', description: 'Aggregate or penalty score for Team B', category: 'score', exampleValue: '3' },
  { tag: '<time_counter>', label: 'Match Clock', description: 'Current formatted match time (MM:SS)', category: 'time', exampleValue: '68:45' },
  { tag: '<PlayerOut>', label: 'Player OUT Name', description: 'Substituted off player name', category: 'player', exampleValue: 'Bukayo Saka' },
  { tag: '<PlayerIn>', label: 'Player IN Name', description: 'Substituted on player name', category: 'player', exampleValue: 'Gabriel Martinelli' },
  { tag: '<NumberOut>', label: 'Number OUT', description: 'Substituted off jersey number', category: 'player', exampleValue: '7' },
  { tag: '<NumberIn>', label: 'Number IN', description: 'Substituted on jersey number', category: 'player', exampleValue: '11' },
  { tag: '<Minute>', label: 'Sub Minute', description: 'Minute of the substitution event', category: 'time', exampleValue: "68'" },
  { tag: '<label1>', label: 'Custom Label 1', description: 'User defined broadcast line 1', category: 'custom', exampleValue: 'PREMIER LEAGUE' },
  { tag: '<label2>', label: 'Custom Label 2', description: 'User defined broadcast line 2', category: 'custom', exampleValue: 'MATCHDAY 24' },
  { tag: '<label3>', label: 'Custom Label 3', description: 'User defined broadcast line 3', category: 'custom', exampleValue: 'EMIRATES STADIUM' },
  { tag: '<label4>', label: 'Custom Label 4', description: 'User defined broadcast line 4', category: 'custom', exampleValue: 'ATTENDANCE: 60,250' },
  { tag: '<label5>', label: 'Custom Label 5', description: 'User defined broadcast line 5', category: 'custom', exampleValue: 'LIVE BROADCAST' },
  { tag: '<LabelAll>', label: 'All Labels Combined', description: 'Concatenated labels 1-5', category: 'custom', exampleValue: 'PREMIER LEAGUE | MATCHDAY 24' },
];

export function resolveTags(
  templateString: string,
  match: Match | null,
  sub: Substitution | null,
  customLabels: Record<string, string> = {}
): string {
  if (!templateString) return '';

  let result = templateString;

  // Minutes formatting
  const formattedMinutes = sub 
    ? `${sub.minute}'${sub.additionalTime ? ` (+${sub.additionalTime})` : ''}` 
    : (match ? `${match.matchMinutes}'` : "00'");

  // Clock formatting
  const clockString = match
    ? `${String(match.matchMinutes).padStart(2, '0')}:${String(match.matchSeconds).padStart(2, '0')}`
    : '00:00';

  const replacements: Record<string, string> = {
    '<TeamA>': match?.teamAName || 'Team A',
    '<TeamB>': match?.teamBName || 'Team B',
    '<score_team_a>': String(match?.scoreA ?? 0),
    '<score_team_b>': String(match?.scoreB ?? 0),
    '<score2_team_a>': String(match?.score2A ?? 0),
    '<score2_team_b>': String(match?.score2B ?? 0),
    '<time_counter>': clockString,
    '<PlayerOut>': sub?.playerOutName || 'Player Out',
    '<PlayerIn>': sub?.playerInName || 'Player In',
    '<NumberOut>': String(sub?.playerOutNumber ?? ''),
    '<NumberIn>': String(sub?.playerInNumber ?? ''),
    '<Minute>': formattedMinutes,
    '<TeamLogo>': (sub ? (sub.teamName === match?.teamBName ? match?.teamBLogo : match?.teamALogo) : match?.teamALogo) || '',
    '<label1>': customLabels['label1'] || 'PREMIER LEAGUE',
    '<label2>': customLabels['label2'] || 'LIVE MATCH',
    '<label3>': customLabels['label3'] || 'SUBSTITUTION',
    '<label4>': customLabels['label4'] || '',
    '<label5>': customLabels['label5'] || '',
  };

  replacements['<LabelAll>'] = [
    replacements['<label1>'],
    replacements['<label2>'],
    replacements['<label3>']
  ].filter(Boolean).join(' • ');

  // Support <escape>...</escape> block
  result = result.replace(/<escape>([\s\S]*?)<\/escape>/gi, '$1');

  // Replace each tag
  for (const [tag, value] of Object.entries(replacements)) {
    result = result.split(tag).join(value);
  }

  return result;
}
