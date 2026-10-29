import { AuthUser, UserRole } from '../types';

const SESSION_KEY = 'sumedha_auth_session_v1';
const USERS_KEY = 'sumedha_auth_users_v1';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  passwordHash: string; // SHA-256 hash
  avatarUrl?: string;
  active: boolean;
}

// Simple SHA-256 hashing using Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '_sumedha_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback hash
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `h_${Math.abs(hash)}`;
}

// Pre-configured staff accounts
export const DEFAULT_USERS: StoredUser[] = [
  {
    id: 'user-admin-1',
    name: 'Hardik Patel',
    email: 'admin@sumedhatechinfra.com',
    role: 'admin',
    phone: '+91 93273 22327',
    passwordHash: 'admin123', // will be verified with both plain and hash for convenience
    avatarUrl: '/src/assets/images/avatar_admin_hardik_1793089093191.jpg',
    active: true,
  },
  {
    id: 'user-admin-2',
    name: 'Hardik Rangani',
    email: 'hardikrangani43@gmail.com',
    role: 'admin',
    phone: '+91 93273 22327',
    passwordHash: 'admin123',
    avatarUrl: '/src/assets/images/avatar_admin_hardik_1793089093191.jpg',
    active: true,
  },
  {
    id: 'user-tech-1',
    name: 'Aravind Sharma',
    email: 'tech@sumedhatechinfra.com',
    role: 'technician',
    phone: '+91 98250 44120',
    passwordHash: 'tech123',
    avatarUrl: '/src/assets/images/avatar_tech_aravind_1793089124186.jpg',
    active: true,
  },
  {
    id: 'user-tech-2',
    name: 'Rohan Kulkarni',
    email: 'rohan@sumedhatechinfra.com',
    role: 'technician',
    phone: '+91 97123 90812',
    passwordHash: 'tech123',
    avatarUrl: '/src/assets/images/avatar_tech_rohit_1793089124757.jpg',
    active: true,
  },
];

export const AuthService = {
  getStoredUsers(): StoredUser[] {
    try {
      const data = localStorage.getItem(USERS_KEY);
      if (!data) {
        localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
        return DEFAULT_USERS;
      }
      return JSON.parse(data) as StoredUser[];
    } catch {
      return DEFAULT_USERS;
    }
  },

  saveStoredUsers(users: StoredUser[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getCurrentSession(): AuthUser | null {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (!session) return null;
      return JSON.parse(session) as AuthUser;
    } catch {
      return null;
    }
  },

  async login(email: string, password: string):Promise<AuthUser> {
    const users = this.getStoredUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      throw new Error('No account found with this email address. Please check your credentials.');
    }

    if (!user.active) {
      throw new Error('This account has been deactivated. Please contact the Operations Administrator.');
    }

    const hashedInput = await hashPassword(password);
    const isDirectMatch = user.passwordHash === password;
    const isHashMatch = user.passwordHash === hashedInput;

    if (!isDirectMatch && !isHashMatch) {
      throw new Error('Incorrect password. Please verify and try again.');
    }

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      token: `sti_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    return authUser;
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  async resetPassword(email: string, newPassword: string): Promise<boolean> {
    const users = this.getStoredUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const index = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);

    if (index === -1) {
      throw new Error('No registered account found with this email.');
    }

    const newHash = await hashPassword(newPassword);
    users[index].passwordHash = newHash;
    this.saveStoredUsers(users);
    return true;
  },

  // Role permissions helpers
  canManageBilling(user: AuthUser | null): boolean {
    if (!user) return false;
    return user.role === 'admin';
  },

  canEditSettings(user: AuthUser | null): boolean {
    if (!user) return false;
    return user.role === 'admin';
  },

  canManageStaff(user: AuthUser | null): boolean {
    if (!user) return false;
    return user.role === 'admin';
  },

  canManageCompanies(user: AuthUser | null): boolean {
    if (!user) return false;
    return user.role === 'admin';
  },
};
