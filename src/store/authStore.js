import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  login: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, token, isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem("user");
    set({ user: null, token: null, isLoggedIn: false });
  },

  setUser: (updateUser) => {
    localStorage.setItem("user", JSON.stringify(updateUser));
    set({ user: updateUser });
  },

  initialize: () => {
    try {
      const raw = localStorage.getItem("user");
      const user = raw ? JSON.parse(raw) : null;
      if (user) {
        set({ user, isLoggedIn: true });
      }
    } catch {
      // Corrupted value in localStorage — clear it and start fresh
      localStorage.removeItem("user");
    }
  },
}));

export default useAuthStore;
