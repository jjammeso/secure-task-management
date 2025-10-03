'use client';

import { apiClient } from "@/lib/apiClient";
import { LoginDto, User } from "@libs/data/src";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginDto) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = (user !== null && user !== undefined);

    useEffect(()=>{
        const initAuth = async() =>[
            const token = localStorage.getItem('auth_token');
            if(token){

            }
        ]
    },)

}