import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import TaskTable from "../components/TaskTable";
import TaskViewModal from "../components/TaskViewModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { authService } from "../services/authService";
import { taskService } from "../services/taskService";
import { clearSession, getSavedUser } from "../services/session";
import type {
    PaginatedResponse,
    Task,
    TaskPayload,
    TaskStatus,
    User,
} from "../types";

function formatName(name?: string) {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function UserDashboardPage() {
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(getSavedUser());
    const [tasks, setTasks] = useState<Task[]>([]);
    const [pagination, setPagination] =
        useState<PaginatedResponse<Task>["meta"] | null>(null);

    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<TaskStatus | "">("");

    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [viewingTask, setViewingTask] = useState<Task | null>(null);
    const [deletingTask, setDeletingTask] = useState<Task | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 350);

        return () => window.clearTimeout(timer);
    }, [searchInput]);

    const loadTasks = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const currentUser = await authService.me();
            setUser(currentUser);

            const response = await taskService.getTasks({
                page,
                per_page: 10,
                search,
                status,
            });

            setTasks(response.data);
            setPagination(response.meta);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                clearSession();
                navigate("/login", { replace: true });
                return;
            }

            setError("Unable to load tasks. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [navigate, page, search, status]);

    useEffect(() => {
        void loadTasks();
    }, [loadTasks]);

    async function handleSave(payload: TaskPayload) {
        if (editingTask) {
            await taskService.updateTask(editingTask.id, payload);
            setNotice("Task updated successfully.");
        } else {
            await taskService.createTask(payload);
            setNotice("Task created successfully.");
            setPage(1);
        }

        setEditingTask(null);
        setShowForm(false);
        await loadTasks();
    }

    function handleDelete(task: Task) {
        setDeletingTask(task);
    }

    async function confirmDelete() {
        if (!deletingTask) return;
        setIsDeleting(true);

        try {
            setError("");
            await taskService.deleteTask(deletingTask.id);
            setNotice("Task deleted successfully.");
            setDeletingTask(null);

            if (tasks.length === 1 && page > 1) {
                setPage((current) => current - 1);
            } else {
                await loadTasks();
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                clearSession();
                navigate("/login", { replace: true });
                return;
            }

            setError("Unable to delete the task.");
        } finally {
            setIsDeleting(false);
        }
    }

    async function handleLogout() {
        await authService.logout();
        clearSession();
        navigate("/login", { replace: true });
    }

    function startCreate() {
        setEditingTask(null);
        setShowForm(true);
        setNotice("");
    }

    function startEdit(task: Task) {
        setEditingTask(task);
        setShowForm(true);
        setNotice("");
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
                                    <span className="creator-tag tag-user">User</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="header-actions">
                    <button
                        type="button"
                        className="secondary"
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </button>

                    <button
                        type="button"
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
                        <h2>My Tasks</h2>
                        <p>Manage and track your work.</p>
                    </div>

                    <button onClick={startCreate}>+ New Task</button>
                </div>

                {notice && <p className="success-message" role="status">{notice}</p>}
                {error && <p className="error-message" role="alert">{error}</p>}

                <div className="filters">
                    <input
                        aria-label="Search tasks by title"
                        placeholder="Search by title..."
                        value={searchInput}
                        onChange={(event) => setSearchInput(event.target.value)}
                    />

                    <select
                        aria-label="Filter by status"
                        value={status}
                        onChange={(event) => {
                            setStatus(event.target.value as TaskStatus | "");
                            setPage(1);
                        }}
                    >
                        <option value="">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                {showForm && (
                    <TaskForm
                        key={editingTask?.id ?? "new"}
                        task={editingTask}
                        onSubmit={handleSave}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingTask(null);
                        }}
                    />
                )}

                {loading ? (
                    <p role="status">Loading tasks...</p>
                ) : (
                    <>
                        <TaskTable
                            tasks={tasks}
                            user={user ?? {
                                id: 0,
                                name: "",
                                email: "",
                                role: "user",
                            }}
                            onView={(task) => setViewingTask(task)}
                            onEdit={startEdit}
                            onDelete={(task) => void handleDelete(task)}
                        />

                        {viewingTask && (
                            <TaskViewModal
                                task={viewingTask}
                                user={user ?? {
                                    id: 0,
                                    name: "",
                                    email: "",
                                    role: "user",
                                }}
                                onClose={() => setViewingTask(null)}
                                onEdit={(task) => {
                                    setViewingTask(null);
                                    startEdit(task);
                                }}
                            />
                        )}

                        {deletingTask && (
                            <DeleteConfirmModal
                                task={deletingTask}
                                loading={isDeleting}
                                onConfirm={() => void confirmDelete()}
                                onCancel={() => {
                                    if (!isDeleting) setDeletingTask(null);
                                }}
                            />
                        )}

                        {pagination && (
                            <div className="pagination">
                                <p>
                                    Showing {pagination.from ?? 0}–{pagination.to ?? 0} of{" "}
                                    {pagination.total} tasks
                                </p>

                                <div>
                                    <button
                                        className="secondary"
                                        disabled={page <= 1 || loading}
                                        onClick={() => setPage((current) => current - 1)}
                                    >
                                        Previous
                                    </button>

                                    <span>
                                        Page {pagination.current_page} of {pagination.last_page}
                                    </span>

                                    <button
                                        className="secondary"
                                        disabled={page >= pagination.last_page || loading}
                                        onClick={() => setPage((current) => current + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}
