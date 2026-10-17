import api from "./api";
import type {
    PaginatedResponse,
    Task,
    TaskPayload,
    TaskStatus,
} from "../types";

export interface TaskFilters {
    page?: number;
    per_page?: number;
    search?: string;
    status?: TaskStatus | "";
    user_id?: number | string;
    filter?: "admin" | "users" | "";
}

export interface UserTaskSummary {
    id: number;
    name: string;
    email: string;
    role: string;
    total_tasks: number;
    pending_tasks: number;
    in_progress_tasks: number;
    completed_tasks: number;
}

export interface DashboardSummary {
    role: "admin" | "user";
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    total_users?: number;
    users_summary?: UserTaskSummary[];
}

export const taskService = {
    async getTasks(filters: TaskFilters = {}) {
        const response = await api.get<PaginatedResponse<Task>>("/tasks", {
            params: filters,
        });

        return response.data;
    },

    async getDashboardSummary(): Promise<DashboardSummary> {
        const response = await api.get<DashboardSummary>("/dashboard/summary");

        return response.data;
    },

    async getUsers() {
        const response = await api.get<{ id: number; name: string; email: string; role: string }[]>("/users");

        return response.data;
    },

    async createTask(payload: TaskPayload) {
        const response = await api.post<Task>("/tasks", payload);

        return response.data;
    },

    async updateTask(id: number, payload: TaskPayload) {
        const response = await api.put<Task>(`/tasks/${id}`, payload);

        return response.data;
    },

    async deleteTask(id: number) {
        await api.delete(`/tasks/${id}`);
    },
};