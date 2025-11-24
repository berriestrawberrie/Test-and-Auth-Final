import { create } from "zustand";
import type { loggedInUserInterface } from "../interfaces/userInterfaces";

interface UserStore {
  user: loggedInUserInterface | null;
  setUser: (
    user: loggedInUserInterface | null | ((prev: loggedInUserInterface | null) => loggedInUserInterface | null)
  ) => void;
}
const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (value) =>
    set((state) => ({
      user: typeof value === "function" ? value(state.user) : value,
    })),
}));

export default useUserStore;
