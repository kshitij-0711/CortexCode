import { create } from 'zustand'

interface User {
  id: string           
  email: string        
  username: string     
}

// Define the shape of the Zustand user store
interface UserState {
  user: User | null             // Null if not logged/signed in, User object otherwise
  setUser: (user: User) => void // Function to set the user
  clearUser: () => void         // Function to clear user
}

// Create the Zustand store
export const useUserStore = create<UserState>((set) => ({
  user: null,                            // Initial state

  // Save the user object to state
  setUser: (user) => set({ user }),

  // Clear the user from state
  clearUser: () => set({ user: null }),
}))
