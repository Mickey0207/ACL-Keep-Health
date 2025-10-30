import { create } from 'zustand';

export type Site = {
  id: string;
  name: string;
  address?: string;
  inspector?: string;
};

export type RecordItem = {
  id: string;
  siteId: string;
  floor: string;
  system: string;
  content: string;
  note?: string;
  date: string; // ISO date
  staff: string;
  photos: Array<{ id: string; name: string; file?: File; url?: string; system: string; content: string; note?: string; staff: string }>; // includes naming attrs for export
};

type State = {
  user: { id?: string; name?: string; email?: string } | null;
  sites: Site[];
  records: RecordItem[];
  setUser: (u: State['user']) => void;
  addSite: (s: Site) => void;
  updateSite: (s: Site) => void;
  removeSite: (id: string) => void;
  addRecord: (r: RecordItem) => void;
};

export const useAppStore = create<State>((set) => ({
  user: null,
  sites: [],
  records: [],
  setUser: (u) => set({ user: u }),
  addSite: (s) => set((st) => ({ sites: [...st.sites, s] })),
  updateSite: (s) => set((st) => ({ sites: st.sites.map((x) => (x.id === s.id ? s : x)) })),
  removeSite: (id) => set((st) => ({ sites: st.sites.filter((x) => x.id !== id) })),
  addRecord: (r) => set((st) => ({ records: [r, ...st.records] }))
}));
