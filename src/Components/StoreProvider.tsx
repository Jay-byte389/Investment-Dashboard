'use client';

/**
 * StoreProvider.tsx
 * Wraps the app with Redux Provider and hydrates saved deals from localStorage.
 */

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { hydrateSaved } from '@/store/savedDealsSlice';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      store.dispatch(hydrateSaved());
      initialized.current = true;
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
