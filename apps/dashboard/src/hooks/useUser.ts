import { apiClient } from "@/lib/apiClient";
import { User } from "@myorg/data";
import { useQuery } from "@tanstack/react-query";


interface UsersResponse{
    users: User[];
    total:number;
}

export const useUser = () =>{
    const useUsers = () =>{
        return useQuery({
            queryKey: ['users'],
            queryFn: () => apiClient.get<UsersResponse>('/users'),
            staleTime:60000,
        });
    }

    return {
        useUsers
    };
};