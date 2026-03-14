import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../constants/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserData {
    name: string;
    surname: string;
    email: string;
    nativeLanguage: string;
}

interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    register: (email: string, pass: string, name: string, surname: string, nativeLanguage: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            async (u) => {
                setUser(u);
                if (u) {
                    const userDoc = await getDoc(doc(db, 'users', u.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data() as UserData);
                    }
                } else {
                    setUserData(null);
                }
                setLoading(false);
            },
            (error) => {
                console.error("Firebase Auth Error:", error);
                setLoading(false);
            }
        );
        return unsubscribe;
    }, []);

    const login = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
    };

    const register = async (email: string, pass: string, name: string, surname: string, nativeLanguage: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(userCredential.user, {
            displayName: `${name} ${surname}`,
        });
        
        const newUser: UserData = {
            name,
            surname,
            email,
            nativeLanguage,
        };
        
        await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
        setUserData(newUser);
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, userData, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
