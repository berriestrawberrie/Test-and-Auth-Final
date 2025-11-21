import { create } from "zustand";
import type { UserInterface } from "../interfaces/userInterfaces";

interface UserStore {
  user: UserInterface | null;
  setUser: (
    user:
      | UserInterface
      | null
      | ((prev: UserInterface | null) => UserInterface | null)
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
