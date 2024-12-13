import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { City, Prescription, User, UserLogin } from "../types";
import { APIUtils } from "../utils/api";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

import PossiblePrompts from "../data/posible_prompts.json";

interface AppState {
  user: User | null;
  sessionCode: string | null;
  loadedData: boolean;
  generatedPrescriptions: Prescription[];
  login: (login: UserLogin) => Promise<boolean>;
  validateSession: (email: string, sessionCode: string) => Promise<boolean>;
  preloadSession: () => void;
  generatePrescription: (city: City) => void;
  rejectPrescription: (uuid: string) => void;
  acceptPrescription: (uuid: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      sessionCode: null,
      loadedData: false,
      generatedPrescriptions: [],
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
      preloadSession: () => {
        set({ loadedData: true });
      },
      generatePrescription: (city: City) => {
        const totalPromts = PossiblePrompts.BY_CITIES.filter((promt) => promt.city === city);
        const randomPromt = Math.floor(Math.random() * totalPromts.length);
        const pre = { uuid: uuidv4(), city: city.toString(), text: totalPromts[randomPromt].prescription, actionable: false, rejected: false } as Prescription;
        set({ generatedPrescriptions: [...get().generatedPrescriptions, pre] });
      },
      rejectPrescription: (uuid: string) => {
        const prescriptions = [...get().generatedPrescriptions];
        const searchedPrescription = prescriptions.findIndex((pres) => pres.uuid === uuid);

        if (searchedPrescription != -1) {
          prescriptions[searchedPrescription].rejected = true;
          set({ generatedPrescriptions: prescriptions });
        }
      },
      acceptPrescription: (uuid: string) => {
        const prescriptions = [...get().generatedPrescriptions];
        const searchedPrescription = prescriptions.findIndex((pres) => pres.uuid === uuid);

        if (searchedPrescription != -1) {
          prescriptions[searchedPrescription].actionable = true;
          set({ generatedPrescriptions: prescriptions });
        }
      },
    }),
    {
      name: "HARMONY_APP_STATE",
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) console.log("an error happened during hydration", error);
          else if (state) state?.preloadSession();
        };
      },
    }
  )
);
