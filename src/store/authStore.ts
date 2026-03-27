import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthUser, LoginInput, RegisterInput } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (input: LoginInput) => Promise<boolean>;
  register: (input: RegisterInput) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const SEED_USERS: AuthUser[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@ministore.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'John Customer',
    email: 'customer@ministore.com',
    password: 'customer123',
    role: 'customer',
    createdAt: new Date().toISOString(),
  },
];

const USERS_KEY = 'mini-store-users';

function getStoredUsers(): AuthUser[] {
  if (typeof window === 'undefined') return SEED_USERS;
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) {
      localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    return JSON.parse(stored);
  } catch {
    localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
    return SEED_USERS;
  }
}

function saveUsers(users: AuthUser[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async ({ email, password }: LoginInput) => {
        set({ isLoading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 400));

        const normalizedEmail = email.trim().toLowerCase();
        const users = getStoredUsers();
        const match = users.find((u) => u.email === normalizedEmail && u.password === password);

        if (!match) {
          set({ isLoading: false, error: 'Invalid email or password' });
          return false;
        }

        const { password: _pwd, ...user } = match;
        set({ user, isAuthenticated: true, isLoading: false });
        return true;
      },

      register: async ({ name, email, password, confirmPassword }: RegisterInput) => {
        set({ isLoading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 400));

        if (password !== confirmPassword) {
          set({ isLoading: false, error: 'Passwords do not match' });
          return false;
        }

        const normalizedEmail = email.trim().toLowerCase();
        const users = getStoredUsers();

        if (users.find((u) => u.email === normalizedEmail)) {
          set({ isLoading: false, error: 'Email already in use' });
          return false;
        }

        const newUser: AuthUser = {
          id: Date.now().toString(),
          name,
          email: normalizedEmail,
          password,
          role: 'customer',
          createdAt: new Date().toISOString(),
        };

        saveUsers([...users, newUser]);

        const { password: _pwd, ...user } = newUser;
        set({ user, isAuthenticated: true, isLoading: false });
        return true;
      },

      logout: () => set({ user: null, isAuthenticated: false, error: null, isLoading: false }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'mini-store-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
