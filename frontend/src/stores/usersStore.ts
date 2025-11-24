import { create } from "zustand";
import type { LoggedInUserInterface } from "../interfaces/userInterfaces";

interface UserStore {
  user: LoggedInUserInterface | null;
  setUser: (
    user: LoggedInUserInterface | null | ((prev: LoggedInUserInterface | null) => LoggedInUserInterface | null)
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
