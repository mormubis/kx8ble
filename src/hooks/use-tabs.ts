import { useContext } from 'react';

import { TabsContext } from '@/context/tabs-context.js';
import type { TabsContextValue } from '@/context/tabs-context.js';

function useTabs(): TabsContextValue {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider');
  }

  return context;
}

export { useTabs };
