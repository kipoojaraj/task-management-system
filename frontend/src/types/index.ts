export type Role = "admin" | "user";

export type TaskStatus =
    | "pending"
    | "in_progress"
    | "completed";

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
}

export interface Task {
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email?: string;
        role?: Role;
    };
}

export interface AuthResponse {
    message: string;
    user: User;
    access_token: string;
    token_type: "Bearer";
}

export interface PaginatedResponse<T> {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
}

export interface TaskPayload {
    title: string;
    description: string;
    status: TaskStatus;
}