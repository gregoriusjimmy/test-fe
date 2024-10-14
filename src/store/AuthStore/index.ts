import { create } from "zustand";

import { getCookies } from "helpers/cookies";

import { ECOOKIES_KEY } from "constants/index";

export const DUMMY_USER: any = {
  id: "",
  email: "",
  country: "",
  address: "",
  phone: "",
  fullName: "",
  preferredName: "",
  birthdate: "",
  cognitoId: "",
  imageProfile: "",
  imagePhoto: "",
  imageDriverLicense: "",
  imagePhotoBack: "",
  imageDriverLicenseBack: "",
  jobOfferId: "",
  languages: "",
  timeZone: "",
  temperature: "",
  timeFormat: 0,
  uniqueUserId: "",
  created: "",
  updated: "",
  active: false,
  imageUrlProfile: "",
  imageUrlPhoto: "",
  imageUrlDriverLicense: "",
  imageUrlPhotoBack: "",
  imageUrlDriverLicenseBack: "",
};

type TAuthStore = {
  isLogin: boolean;
  loading: boolean;
  user: any;
  getUserData: () => void;
};

const useAuthStore = create<TAuthStore>((set) => ({
  isLogin: true,
  loading: false,
  user: DUMMY_USER,
  getUserData: async () => {
    const token = getCookies(ECOOKIES_KEY.AUTH);
    if (!token) {
      set({ isLogin: false, user: DUMMY_USER });
      return;
    }
    set({ loading: true });
    // try {
    //   const response = await getUser();
    //   const userData = response.data;
    //   set({ user: userData, isLogin: userData.active });
    //   setCookies(ECOOKIES_KEY.EMAIL, userData.email);
    // } catch (error) {
    //   set({ user: DUMMY_USER, isLogin: false });
    //   clearCookies();
    // } finally {
    //   set({ loading: false });
    // }
  },
}));

export default useAuthStore;
