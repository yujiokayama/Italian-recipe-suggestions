import { create } from 'zustand'
import { User } from '@/types'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<boolean>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user })
  },

  setLoading: (isLoading) => {
    set({ isLoading })
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      // TODO: Implement Supabase login
      console.log('Login attempt:', { email, password })
      // Temporary mock implementation
      const mockUser: User = {
        id: '1',
        email,
        name: 'Test User',
        cooking_level: 'beginner',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      set({ user: mockUser, isAuthenticated: true, isLoading: false })
      return true
    } catch (error) {
      console.error('Login error:', error)
      set({ isLoading: false })
      return false
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      // TODO: Implement Supabase logout
      set({ user: null, isAuthenticated: false, isLoading: false })
    } catch (error) {
      console.error('Logout error:', error)
      set({ isLoading: false })
    }
  },

  register: async (email: string, password: string, name?: string) => {
    set({ isLoading: true })
    try {
      // TODO: Implement Supabase registration
      console.log('Register attempt:', { email, password, name })
      // Temporary mock implementation
      const mockUser: User = {
        id: '1',
        email,
        name: name || 'New User',
        cooking_level: 'beginner',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      set({ user: mockUser, isAuthenticated: true, isLoading: false })
      return true
    } catch (error) {
      console.error('Register error:', error)
      set({ isLoading: false })
      return false
    }
  },
}))