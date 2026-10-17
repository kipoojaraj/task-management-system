import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { taskService } from "../services/taskService";
import type { DashboardSummary } from "../services/taskService";
import { clearSession, getSavedUser } from "../services/session";
import type { User } from "../types";

function formatName(name?: string) {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function DashboardPage() {
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(getSavedUser());
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadSummary = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const currentUser = await authService.me();
            setUser(currentUser);

            const data = await taskService.getDashboardSummary();
            setSummary(data);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                clearSession();
                navigate("/login", { replace: true });
                return;
            }

            setError("Unable to load dashboard summary.");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        void loadSummary();
    }, [loadSummary]);

    async function handleLogout() {
        await authService.logout();
        clearSession();
        navigate("/login", { replace: true });
    }

    return (
        <main className="dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>Task Management</h1>
                    {user && (
                        <div className="user-profile-badge">
                            <span className="user-avatar">
                                {formatName(user.name).charAt(0)}
                            </span>
                            <div className="user-info-text">
                                <span className="user-logged-label">Logged in as:</span>
                                <div className="user-name-line">
                                    <strong className="user-prominent-name">
                                        {formatName(user.name)}
                                    </strong>
                                    <span
                                        className={`creator-tag ${
                                            user.role === "admin" ? "tag-admin" : "tag-user"
                                        }`}
                                    >
                                        {user.role === "admin" ? "Admin" : "User"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="header-actions">
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </button>
                    <button
                        type="button"
                        className="secondary"
                        onClick={() => navigate("/tasks")}
                    >
                        Tasks
                    </button>
                    <button
                        type="button"
                        className="secondary"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            <section className="dashboard-panel">
                <div className="section-heading">
                    <div>
                        <h2>
                            {user?.role === "admin"
                                ? "Admin Dashboard"
                                : "My Dashboard"}
                        </h2>
                        <p>Summary of your tasks and performance.</p>
                    </div>

                    <button onClick={() => navigate("/tasks")}>
                        {user?.role === "admin" ? "Manage All Tasks →" : "View My Tasks →"}
                    </button>
                </div>

                {error && <p className="error-message" role="alert">{error}</p>}

                {loading ? (
                    <p role="status">Loading dashboard summary...</p>
                ) : summary ? (
                    <>
                        <div className="summary-grid">
                            <div className="summary-card card-total">
                                <div className="summary-card-header">
                                    <span className="summary-card-title">
                                        Total Tasks Created
                                    </span>
                                    <span className="summary-card-icon">📋</span>
                                </div>
                                <span className="summary-card-value">
                                    {summary.total}
                                </span>
                            </div>

                            <div className="summary-card card-pending">
                                <div className="summary-card-header">
                                    <span className="summary-card-title">
                                        Pending Tasks
                                    </span>
                                    <span className="summary-card-icon">⏳</span>
                                </div>
                                <span className="summary-card-value">
                                    {summary.pending}
                                </span>
                            </div>

                            <div className="summary-card card-in_progress">
                                <div className="summary-card-header">
                                    <span className="summary-card-title">
                                        In Progress Tasks
                                    </span>
                                    <span className="summary-card-icon">🚀</span>
                                </div>
                                <span className="summary-card-value">
                                    {summary.in_progress}
                                </span>
                            </div>

                            <div className="summary-card card-completed">
                                <div className="summary-card-header">
                                    <span className="summary-card-title">
                                        Completed Tasks
                                    </span>
                                    <span className="summary-card-icon">✅</span>
                                </div>
                                <span className="summary-card-value">
                                    {summary.completed}
                                </span>
                            </div>

                            {user?.role === "admin" && summary.total_users !== undefined && (
                                <div className="summary-card card-users">
                                    <div className="summary-card-header">
                                        <span className="summary-card-title">
                                            Total Users
                                        </span>
                                        <span className="summary-card-icon">👥</span>
                                    </div>
                                    <span className="summary-card-value">
                                        {summary.total_users}
                                    </span>
                                </div>
                            )}
                        </div>

                        {user?.role === "admin" && summary.users_summary && (
                            <div className="user-summary-card">
                                <div className="section-heading">
                                    <div>
                                        <h3>Every User Task Summary</h3>
                                        <p>Detailed task breakdown for each user.</p>
                                    </div>
                                </div>

                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Role</th>
                                                <th>Total Tasks</th>
                                                <th>Pending</th>
                                                <th>In Progress</th>
                                                <th>Completed</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {summary.users_summary.map((u) => (
                                                <tr key={u.id}>
                                                    <td>
                                                        <div>
                                                            <strong className="creator-name">
                                                                {u.name}
                                                            </strong>
                                                            <div className="creator-email">
                                                                {u.email}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`creator-tag ${
                                                                u.role === "admin"
                                                                    ? "tag-admin"
                                                                    : "tag-user"
                                                            }`}
                                                        >
                                                            {u.role === "admin" ? "Admin" : "User"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <strong>{u.total_tasks}</strong>
                                                    </td>
                                                    <td>
                                                        <span className="status status-pending">
                                                            {u.pending_tasks}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="status status-in_progress">
                                                            {u.in_progress_tasks}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="status status-completed">
                                                            {u.completed_tasks}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {summary.users_summary.length === 0 && (
                                                <tr>
                                                    <td colSpan={6}>No users found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                ) : null}
            </section>
        </main>
    );
}