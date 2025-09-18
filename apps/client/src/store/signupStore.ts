import { create } from 'zustand'

interface SignupFormState {
  email: string
  password: string
  username: string
  setField: (field: 'email' | 'password' | 'username', value: string) => void
  clearForm: () => void
}

export const useSignupFormStore = create<SignupFormState>((set) => ({
  email: '',
  password: '',
  username: '',
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  clearForm: () => set({ email: '', password: '', username: '' }),
}))
