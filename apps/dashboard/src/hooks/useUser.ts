import { apiClient } from "@/lib/apiClient";
import { UserWithOrganization } from "@myorg/data";
import { useQuery } from "@tanstack/react-query";


interface UsersResponse{
    users: UserWithOrganization[];
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