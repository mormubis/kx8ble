/** Application screen identifiers */
type Screen = 'home' | 'setup' | 'players' | 'round' | 'standings';

/** Tournament type selection */
type TournamentType =
  | 'individual-swiss'
  | 'individual-rr'
  | 'team-swiss'
  | 'team-rr';

/** FIDE title abbreviations */
type Title = '' | 'GM' | 'IM' | 'FM' | 'WGM' | 'WIM' | 'WFM' | 'CM' | 'WCM';

/** Time control category */
type TimeControlType = 'standard' | 'rapid' | 'blitz';

/** Pairing system identifier */
type PairingSystemId =
  | 'dutch'
  | 'dubov'
  | 'burstein'
  | 'lim'
  | 'double-swiss'
  | 'swiss-team';

export type { PairingSystemId, Screen, TimeControlType, Title, TournamentType };
