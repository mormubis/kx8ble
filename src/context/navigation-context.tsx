import { createContext, useCallback, useMemo, useState } from 'react';

import type { Screen } from '@/types/index.js';

import type { JSX, ReactNode } from 'react';

interface NavigationContextValue {
  canGoBack: boolean;
  goBack: () => void;
  navigate: (screen: Screen) => void;
  screen: Screen;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(
  undefined,
);

interface NavigationProviderProperties {
  children: ReactNode;
}

function NavigationProvider({
  children,
}: NavigationProviderProperties): JSX.Element {
  const [history, setHistory] = useState<Screen[]>(['home']);

  const screen = history.at(-1) ?? 'home';

  const navigate = useCallback((next: Screen) => {
    setHistory((previous) => [...previous, next]);
  }, []);

  const goBack = useCallback(() => {
    setHistory((previous) =>
      previous.length > 1 ? previous.slice(0, -1) : previous,
    );
  }, []);

  const canGoBack = history.length > 1;

  const value = useMemo(
    () => ({ canGoBack, goBack, navigate, screen }),
    [canGoBack, goBack, navigate, screen],
  );

  return <NavigationContext value={value}>{children}</NavigationContext>;
}

export { NavigationContext, NavigationProvider };
export type { NavigationContextValue };
