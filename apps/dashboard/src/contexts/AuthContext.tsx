'use client';

import { apiClient } from "@/lib/apiClient";
import { AuthResponse, LoginDto, Role, User } from "@libs/data/src";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginDto) => Promise<void>;
    logout: () => void;
}

interface MyJwtPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  organizationId: string;
  createdAt: Date; 
  updatedAt: Date; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = (user !== null && user !== undefined);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (token !== null) {
                let tokenObject = jwtDecode(token) as MyJwtPayload | null;
                if (tokenObject)
                    setUser({
                        id: tokenObject.id,
                        email: tokenObject.email,
                        firstName: tokenObject.firstName,
                        lastName: tokenObject.lastName,
                        role: tokenObject.role,
                        organizationId: tokenObject.organizationId,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (credential: LoginDto): Promise<void> => {
        try {
            setIsLoading(true);

            const response = await apiClient.post<AuthResponse>('/auth/login', credential);

            apiClient.setToken(response.token);
            setUser(response.user);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    const logout = async (): Promise<void> => {
        localStorage.removeItem('auth_token');
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AutthProvider');
    }
    return context;
}