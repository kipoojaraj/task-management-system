import type { Task, User } from "../types";

interface TaskTableProps {
    tasks: Task[];
    user: User;
    onView: (task: Task) => void;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
}

const statusLabels: Record<string, string> = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
};

export default function TaskTable({
    tasks,
    user,
    onView,
    onEdit,
    onDelete,
}: TaskTableProps) {
    return (
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        {user.role === "admin" && <th>Created By</th>}
                        <th>Created Date & Time</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td>
                                <strong>{task.title}</strong>
                            </td>
                            <td>{task.description || "—"}</td>
                            <td>
                                <span className={`status status-${task.status}`}>
                                    {statusLabels[task.status] || task.status}
                                </span>
                            </td>

                            {user.role === "admin" && (
                                <td>
                                    <div className="creator-info">
                                        <span className="creator-name">
                                            {task.user?.name ?? "Unknown"}
                                        </span>
                                        {task.user?.email && (
                                            <span className="creator-email">
                                                ({task.user.email})
                                            </span>
                                        )}
                                        {task.user?.id === user.id ? (
                                            <span className="creator-tag tag-admin">Admin (You)</span>
                                        ) : task.user?.role === "admin" ? (
                                            <span className="creator-tag tag-admin">Admin</span>
                                        ) : (
                                            <span className="creator-tag tag-user">User</span>
                                        )}
                                    </div>
                                </td>
                            )}

                            <td>
                                <div className="datetime-cell">
                                    <span>
                                        {new Date(task.created_at).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                    <span className="time-sub">
                                        {new Date(task.created_at).toLocaleTimeString(undefined, {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            </td>

                            <td>
                                <div className="table-actions">
                                    <button
                                        type="button"
                                        className="secondary action-view"
                                        onClick={() => onView(task)}
                                    >
                                        View
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onEdit(task)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="danger"
                                        onClick={() => onDelete(task)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}

                    {tasks.length === 0 && (
                        <tr>
                            <td colSpan={user.role === "admin" ? 6 : 5}>
                                No tasks found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}