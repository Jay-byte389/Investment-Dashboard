'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/hooks/redux';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
