import { create } from "zustand";
const useBearStore = create((set) => ({
  isUserValid: false,
  user_id: null,
  user_name: null,
  group_id: null,
  main_company_id: null,
  userInfo: [],
  phone: null,
  setIsUserValid: (arg) => set({ isUserValid: arg }),
  setUserId: (id) => set({ user_id: id }), // Ensure this function is defined
  setUserName: (name) => set({ user_name: name }), // Ensure this function is defined
  setGroupId: (group) => set({ group_id: group }), // Ensure this function is defined
  setUserInfo: (info) => set({ userInfo: info }),
  setMainCompanyID: (company) => set({ main_company_id: company }), // Ensure this function is defined
}));
export default useBearStore;
