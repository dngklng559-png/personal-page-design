export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
}

export interface NavItem {
  label: string;
  id: string;
}