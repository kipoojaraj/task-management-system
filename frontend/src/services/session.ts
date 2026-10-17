import type { AuthResponse, User } from "../types";

const USER_KEY = "task_user";

export function saveSession(response: AuthResponse): void {
    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
}

export function getSavedUser(): User | null {
    const value = localStorage.getItem(USER_KEY);

    if (!value) {
        return null;
    }

    try {
        return JSON.parse(value) as User;
    } catch {
        localStorage.removeItem(USER_KEY);
        return null;
    }
}

export function clearSession(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem(USER_KEY);
}