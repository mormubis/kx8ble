import { useContext } from 'react';

import { NavigationContext } from '@/context/navigation-context.js';
import type { NavigationContextValue } from '@/context/navigation-context.js';

function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }

  return context;
}

export { useNavigation };
