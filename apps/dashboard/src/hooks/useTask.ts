import { apiClient } from "@/lib/apiClient";
import { CreateTaskDto, Task, TaskQueryParams, UpdateTaskDto } from "@myorg/data";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


interface TasksResponse {
   tasks:any[];
   total: number;
   page: number;
   limit: number;
}

export const useTask = () => {
    const queryClient = useQueryClient();

    const useTasks = (params?: TaskQueryParams) => {
        return useQuery({
            queryKey: ['tasks', params],
            queryFn: () => apiClient.get<TasksResponse>('/tasks', { params }),
            staleTime: 30000,
        });
    };

    const useTaskById = (id: string) => {
        return useQuery({
            queryKey: ['task', id],
            queryFn: () => apiClient.get<Task>(`/tasks/${id}`),
            enabled: !!id,
        });
    };

    const createTask = useMutation({
        mutationFn: (taskData: CreateTaskDto) => apiClient.post<Task>('/tasks', taskData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks']});
        }
    })

    const updateTask = useMutation({
        mutationFn: ({id, data}: {id:string; data:UpdateTaskDto}) => apiClient.put<Task>(`/tasks/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tasks']});
            queryClient.invalidateQueries({queryKey:['task']});
        }
    })

    const deleteTask = useMutation({
        mutationFn: (id:string) => apiClient.delete((`tasks/${id}`)),
        onSuccess: () =>{
            queryClient.invalidateQueries({queryKey: [`tasks`]});
        }
    })

    return {
        useTasks,
        useTaskById,
        createTask,
        updateTask,
        deleteTask
    }
}