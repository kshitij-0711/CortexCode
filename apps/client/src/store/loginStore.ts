import { create } from 'zustand'

interface LoginFormState {
  email: string
  password: string
  setField: (field: 'email' | 'password', value: string) => void
  clearForm: () => void
}

export const useLoginFormStore = create<LoginFormState>((set) => ({
  email: '',
  password: '',
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  clearForm: () => set({ email: '', password: ''}),
}))
