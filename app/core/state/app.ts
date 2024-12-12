import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { User, UserLogin } from "../types";
import { APIUtils } from "../utils/api";
import toast from "react-hot-toast";

interface AppState {
  user: User | null;
  sessionCode: string | null;
  login: (login: UserLogin) => Promise<boolean>;
  validateSession: (email: string, sessionCode: string) => Promise<boolean>;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        sessionCode: null,
        login: async (login) => {
          return new Promise((res) => {
            APIUtils.Login(login).then((data) => {
              if (!data || data.error || !data.data) {
                toast.error(data.error);
                res(false);
              }

              set({ sessionCode: data.data.session, user: data.data.user });
              toast.success("Success");
              res(true);
            });
          });
        },
        validateSession: async (email, sessionCode) => {
          return new Promise((res) => {
            APIUtils.ValidateSession({ fromUser: email, sessionCode }).then((data) => {
              if (!data || data.error) {
                toast.error(data.error);
                set({ sessionCode: null, user: null });
                res(false);
              }

              res(true);
            });
          });
        },
      }),
      { name: "HARMONY_APP_STATE" }
    )
  )
);
