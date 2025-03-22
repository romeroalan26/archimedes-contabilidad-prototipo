import { create } from "zustand";

interface AuthState {
  user: string | null;
  login: (role: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  login: (role) => set({ user: role }),
  logout: () => set({ user: null }),
}));
