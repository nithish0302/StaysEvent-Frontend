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
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      set({ user, isLoggedIn: true });
    }
  },
}));

export default useAuthStore;
