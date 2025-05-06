import { create } from 'zustand'

const useGlobalStore = create((set) => ({
  // ✅ Global values
  user: null,
  session: null,
  userMeta: null,
  toggleMenu: false,
  screen: window.innerWidth <= 430,
  font: '/fonts/Fredoka/Fredoka-VariableFont_wdth,wght.ttf',
  degrees: (deg) => deg * (Math.PI / 180),
  gameIndex: 0,
  currentStage: null,
  animate: true,


  // ✅ Actions
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setUserMeta: (meta) => set({ userMeta: meta }),
  setToggleMenu: (val) => set({ toggleMenu: val }),
  setGameIndex: (val) => set({gameIndex: val}),
  setCurrentStage: (val) => set({currentStage: val}),
  setAnimate: (val) => set({animate: val})




  
}))
export default useGlobalStore