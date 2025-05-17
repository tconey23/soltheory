import { create } from 'zustand'
import useBreakpoints from './useBreakpoints'


const useGlobalStore = create((set) => ({
  user: null,
  session: null,
  userMeta: null,
  toggleMenu: false,
  screen: '',
  height: '',
  font: '/fonts/Fredoka/Fredoka-VariableFont_wdth,wght.ttf',
  degrees: (deg) => deg * (Math.PI / 180),
  gameIndex: 0,
  currentStage: null,
  animate: true,
  alertContent: {text: '', type: ''},


  // ✅ Actions
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setUserMeta: (meta) => set({ userMeta: meta }),
  setToggleMenu: (val) => set({ toggleMenu: val }),
  setGameIndex: (val) => set({gameIndex: val}),
  setCurrentStage: (val) => set({currentStage: val}),
  setAnimate: (val) => set({animate: val}),
  setScreen: (val) => set({screen: val}),
  setHeight: (val) => set({height: val}),
  setAlertContent: (val) => set({alertContent: val})
}))
export default useGlobalStore