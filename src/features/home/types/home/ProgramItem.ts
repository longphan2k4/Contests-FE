import type { ReactNode } from 'react';

export interface ProgramItem {
  id: number;
  name: string;
  duration: string;
  description: string;
  icon: ReactNode;
}