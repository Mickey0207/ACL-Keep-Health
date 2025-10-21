import { create } from 'zustand';

export type Site = {
  id: string;
  name: string;
  address?: string;
};

export type Season = 'Q1' | 'Q2' | 'Q3' | 'Q4';

type State = {
  sites: Site[];
  addSite: (site: Site) => void;
  removeSite: (id: string) => void;
  maintenance: MaintenanceItem[];
  addMaintenance: (item: MaintenanceItem) => void;
  removeMaintenance: (id: string) => void;
};

export type MaintenanceItem = {
  id: string;
  siteId: string;
  year: number;
  season: Season;
  title: string;
  description?: string;
  photoUris?: string[]; // local URIs for now
};

export const useAppStore = create<State>((set) => ({
  sites: [],
  addSite: (site) => set((s) => ({ sites: [...s.sites, site] })),
  removeSite: (id) => set((s) => ({ sites: s.sites.filter((x) => x.id !== id) })),
  maintenance: [],
  addMaintenance: (item) => set((s) => ({ maintenance: [item, ...s.maintenance] })),
  removeMaintenance: (id) => set((s) => ({ maintenance: s.maintenance.filter((x) => x.id !== id) })),
}));
