import { useEffect } from "react";
import type { Task, User } from "../types";

interface TaskViewModalProps {
    task: Task;
    user: User;
    onClose: () => void;
    onEdit?: (task: Task) => void;
}

const statusLabels: Record<string, string> = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
};

export default function TaskViewModal({
    task,
    user,
    onClose,
    onEdit,
}: TaskViewModalProps) {
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal-card"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="view-modal-title"
            >
                <div className="modal-header">
                    <h2 id="view-modal-title">Task Details</h2>
                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="modal-body view-details">
                    <div className="detail-group">
                        <span className="detail-label">Title</span>
                        <p className="detail-value detail-title">{task.title}</p>
                    </div>

                    <div className="detail-group">
                        <span className="detail-label">Description</span>
                        <p className="detail-value detail-description">
                            {task.description ? task.description : "—"}
                        </p>
                    </div>

                    <div className="detail-row">
                        <div className="detail-group">
                            <span className="detail-label">Status</span>
                            <div>
                                <span className={`status status-${task.status}`}>
                                    {statusLabels[task.status] || task.status}
                                </span>
                            </div>
                        </div>

                        {user.role === "admin" && task.user && (
                            <div className="detail-group">
                                <span className="detail-label">Created By</span>
                                <div className="creator-info">
                                    <span className="creator-name">{task.user.name}</span>
                                    {task.user.email && (
                                        <span className="creator-email">({task.user.email})</span>
                                    )}
                                    <span
                                        className={`creator-tag ${
                                            task.user.role === "admin" || task.user.id === user.id
                                                ? "tag-admin"
                                                : "tag-user"
                                        }`}
                                    >
                                        {task.user.id === user.id
                                            ? "Admin (You)"
                                            : task.user.role === "admin"
                                            ? "Admin"
                                            : "User"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="detail-row">
                        <div className="detail-group">
                            <span className="detail-label">Created Date & Time</span>
                            <span className="detail-value">
                                {new Date(task.created_at).toLocaleString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>

                        <div className="detail-group">
                            <span className="detail-label">Last Updated</span>
                            <span className="detail-value">
                                {new Date(task.updated_at).toLocaleString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onEdit(task);
                            }}
                        >
                            Edit Task
                        </button>
                    )}
                    <button type="button" className="secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
