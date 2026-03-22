import { useContext } from 'react';

import { TournamentContext } from '@/context/tournament-context.js';
import type { TournamentContextValue } from '@/context/tournament-context.js';

function useTournament(): TournamentContextValue {
  const context = useContext(TournamentContext);

  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }

  return context;
}

export { useTournament };
