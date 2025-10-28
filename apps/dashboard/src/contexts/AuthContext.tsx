'use client';

import { apiClient } from "@/lib/apiClient";
import { AuthResponse, LoginDto, JwtPayload, UserWithOrganization } from "@myorg/data";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
    user: UserWithOrganization | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginDto) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserWithOrganization | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user;

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    await refreshUser();
                } catch (error) {
                    console.error('Failed to refresh user:', error);
                    logout();
                }
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

            const tokenObject = jwtDecode(response.token) as JwtPayload;
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

    const refreshUser = async (): Promise<void> => {
        try {
            const userData = await apiClient.get<UserWithOrganization>('/auth/me');
            console.log('here is userData', userData);
            setUser(userData);
            console.log('user in refresh', user);
        } catch (error) {
            throw error;
        }
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
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}