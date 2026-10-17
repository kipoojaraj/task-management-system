import api from "./api";
import type { AuthResponse, User } from "../types";

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

export const authService = {
    async register(payload: RegisterPayload): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("/register", payload);

        return response.data;
    },

    async login(payload: LoginPayload): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("/login", payload);

        return response.data;
    },

    async me(): Promise<User> {
        const response = await api.get<{ user: User }>("/me");

        return response.data.user;
    },

    async logout(): Promise<void> {
        try {
            await api.post("/logout");
        } finally {
            localStorage.removeItem("access_token");
        }
    },
};