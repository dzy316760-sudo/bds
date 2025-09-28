import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { firebaseAuth, firebaseApp } from '../lib/firebase';
import type { UserRole } from '../types/auth';

interface ProfileData {
  uid: string;
  email?: string | null;
  role?: UserRole;
  phone?: string;
  avatarUrl?: string;
  displayName?: string | null;
}

interface AuthContextValue {
  user: User | null;
  profile: ProfileData | null;
  loading: boolean;
  signup: (params: { email: string; password: string; phone: string; role: UserRole }) => Promise<void>;
  login: (params: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (payload: Partial<ProfileData>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const authInstance = firebaseAuth;
  const configurationError =
    'Firebase chưa được cấu hình. Vui lòng cập nhật các khóa môi trường Firebase trước khi sử dụng tính năng xác thực.';

  const db = useMemo(() => (firebaseApp ? getFirestore(firebaseApp) : null), [firebaseApp]);
  const storage = useMemo(() => (firebaseApp ? getStorage(firebaseApp) : null), [firebaseApp]);

  const syncCookies = useCallback((nextProfile: ProfileData | null) => {
    if (typeof window === 'undefined') return;

    if (nextProfile) {
      document.cookie = `tnvn_auth=1; path=/;`;
      if (nextProfile.role) {
        document.cookie = `tnvn_role=${nextProfile.role}; path=/;`;
      }
    } else {
      document.cookie = 'tnvn_auth=; Max-Age=0; path=/;';
      document.cookie = 'tnvn_role=; Max-Age=0; path=/;';
    }
  }, []);

  const fetchProfile = useCallback(
    async (uid: string, fallbackEmail?: string | null) => {
      if (!db) {
        const defaultRole: UserRole = 'Landlord';
        const nextProfile: ProfileData = {
          uid,
          email: fallbackEmail,
          role: defaultRole,
        };
        setProfile(nextProfile);
        syncCookies(nextProfile);
        return;
      }

      const profileRef = doc(db, 'profiles', uid);
      const snapshot = await getDoc(profileRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as Partial<ProfileData>;
        const nextProfile: ProfileData = {
          uid,
          email: data.email ?? fallbackEmail,
          role: data.role,
          phone: data.phone,
          avatarUrl: data.avatarUrl,
          displayName: data.displayName ?? fallbackEmail,
        };
        setProfile(nextProfile);
        syncCookies(nextProfile);
      } else {
        const defaultRole: UserRole = 'Landlord';
        const nextProfile: ProfileData = {
          uid,
          email: fallbackEmail,
          role: defaultRole,
        };
        await setDoc(profileRef, nextProfile, { merge: true });
        setProfile(nextProfile);
        syncCookies(nextProfile);
      }
    },
    [db, syncCookies]
  );

  useEffect(() => {
    if (!authInstance) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid, currentUser.email);
      } else {
        setProfile(null);
        syncCookies(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authInstance, fetchProfile, syncCookies]);

  const signup = useCallback(
    async ({ email, password, phone, role }: { email: string; password: string; phone: string; role: UserRole }) => {
      if (!authInstance || !db) {
        throw new Error(configurationError);
      }

      const credentials = await createUserWithEmailAndPassword(authInstance, email, password);
      const { user: createdUser } = credentials;

      if (!createdUser) return;

      setUser(createdUser);
      const profileRef = doc(db, 'profiles', createdUser.uid);
      const payload: ProfileData = {
        uid: createdUser.uid,
        email,
        phone,
        role,
        displayName: createdUser.displayName,
      };

      await setDoc(profileRef, payload, { merge: true });
      setProfile(payload);
      syncCookies(payload);
    },
    [authInstance, configurationError, db, syncCookies]
  );

  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      if (!authInstance) {
        throw new Error(configurationError);
      }

      const credentials = await signInWithEmailAndPassword(authInstance, email, password);
      const currentUser = credentials.user;
      setUser(currentUser);
      await fetchProfile(currentUser.uid, currentUser.email);
    },
    [authInstance, configurationError, fetchProfile]
  );

  const logout = useCallback(async () => {
    if (authInstance) {
      await signOut(authInstance);
    }
    setUser(null);
    setProfile(null);
    syncCookies(null);
  }, [authInstance, syncCookies]);

  const updateProfile = useCallback(
    async (payload: Partial<ProfileData>) => {
      if (!user) return;
      if (!db) {
        throw new Error(configurationError);
      }
      const profileRef = doc(db, 'profiles', user.uid);
      const baseProfile = profile ?? { uid: user.uid, email: user.email };
      await setDoc(profileRef, { ...baseProfile, ...payload }, { merge: true });
      setProfile((prev) => (prev ? { ...prev, ...payload } : { ...baseProfile, ...payload }));
      if (payload.displayName) {
        await firebaseUpdateProfile(user, { displayName: payload.displayName });
      }
      if (payload.role) {
        syncCookies({ ...(profile ?? { uid: user.uid, email: user.email }), ...payload });
      }
    },
    [configurationError, db, profile, syncCookies, user]
  );

  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!user) return;
      if (!storage) {
        throw new Error(configurationError);
      }
      const avatarRef = ref(storage, `avatars/${user.uid}/${file.name}`);
      await uploadBytes(avatarRef, file);
      const url = await getDownloadURL(avatarRef);
      await updateProfile({ avatarUrl: url });
    },
    [configurationError, storage, updateProfile, user]
  );

  const value = useMemo(
    () => ({ user, profile, loading, signup, login, logout, updateProfile, uploadAvatar }),
    [user, profile, loading, signup, login, logout, updateProfile, uploadAvatar]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };

