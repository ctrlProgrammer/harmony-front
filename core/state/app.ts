import { create } from "zustand";
import { devtools, persist, StateStorage, createJSONStorage } from "zustand/middleware";
import { City, MapMarker, MapRegion, Prescription, PrescriptionManagement, RegionData, User, UserLogin } from "../types";
import { APIUtils } from "../utils/api";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { get, set, del } from "idb-keyval"; // can use anything: IndexedDB, Ionic Storage, etc.

import PossiblePrompts from "../data/posible_prompts.json";

// Custom storage object
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

interface AppState {
  user: User | null;
  sessionCode: string | null;
  loadedData: boolean;
  generatedPrescriptions: Prescription[];
  exectionPrescriptions: PrescriptionManagement[];
  sellers: { [city: string]: MapMarker[] } | null;
  regions: { [city: string]: MapRegion[] } | null;
  login: (login: UserLogin) => Promise<boolean>;
  validateSession: (email: string, sessionCode: string) => Promise<boolean>;
  preloadSession: () => void;
  generatePrescription: (city: City) => void;
  rejectPrescription: (uuid: string) => void;
  acceptPrescription: (uuid: string) => void;
  getSellers: () => void;
  getRegions: () => void;
  configPrescription: (uuid: string, data: PrescriptionManagement) => void;
  deletePrescription: (uuid: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      sessionCode: null,
      loadedData: false,
      generatedPrescriptions: [],
      exectionPrescriptions: [],
      sellers: null,
      regions: null,
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
          set({
            generatedPrescriptions: prescriptions,
            exectionPrescriptions: [
              ...get().exectionPrescriptions,
              {
                prescription: prescriptions[searchedPrescription].text,
                uuid: prescriptions[searchedPrescription].uuid,
                city: prescriptions[searchedPrescription].city,
                endsDate: 0,
                startDate: Date.now(),
                executedOutcome: 0,
                owner: "UNASIGNED",
                impactStatus: 0,
                deploymentRate: 0,
              } as PrescriptionManagement,
            ],
          });
        }
      },
      configPrescription: (uuid: string, data: PrescriptionManagement) => {
        const prescriptions = [...get().exectionPrescriptions];
        const searchedPrescription = prescriptions.findIndex((pres) => pres.uuid === uuid);

        if (searchedPrescription != -1) {
          prescriptions[searchedPrescription] = data;
          set({ exectionPrescriptions: prescriptions });
        }
      },
      deletePrescription: (uuid: string) => {
        const prescriptions = [...get().exectionPrescriptions];
        const searchedPrescription = prescriptions.findIndex((pres) => pres.uuid === uuid);

        if (searchedPrescription != -1) {
          prescriptions.splice(searchedPrescription, 1);
          set({ exectionPrescriptions: prescriptions });
        }
      },
      getSellers: () => {
        if (get().sellers != null) return;
        APIUtils.GetSellers().then((data) => {
          if (!data || data.error || !data.data) {
            toast.error(data.error);
            return;
          }

          if (data.data && Array.isArray(data.data)) {
            const sellers: any = {};

            for (let i = 0; i < data.data.length; i++) {
              const city = (data.data[i].city as string)
                .toLocaleUpperCase()
                .replaceAll(" ", "_")
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, "");

              if (!Object.keys(sellers).includes(city)) {
                sellers[city] = [];
              }

              sellers[city].push(data.data[i]);
            }

            set({ sellers });
          }
        });
      },
      getRegions: () => {
        if (get().regions != null) return;

        APIUtils.GetRegions().then((data) => {
          if (!data || data.error || !data.data) {
            toast.error(data.error);
            return;
          }

          if (data.data && Array.isArray(data.data)) {
            const regions: any = {};

            for (let i = 0; i < data.data.length; i++) {
              if (!Object.keys(regions).includes(data.data[i].city)) {
                regions[data.data[i].city] = [];
              }

              regions[data.data[i].city].push(data.data[i]);
            }

            set({ regions });
          }
        });
      },
    }),
    {
      name: "HARMONY_APP_STATE",
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) console.log("an error happened during hydration", error);
          else if (state) state?.preloadSession();
        };
      },
    }
  )
);
