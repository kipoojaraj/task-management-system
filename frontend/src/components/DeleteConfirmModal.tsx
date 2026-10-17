import { useEffect } from "react";
import type { Task } from "../types";

interface DeleteConfirmModalProps {
    task: Task;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteConfirmModal({
    task,
    loading = false,
    onConfirm,
    onCancel,
}: DeleteConfirmModalProps) {
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && !loading) {
                onCancel();
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onCancel, loading]);

    return (
        <div className="modal-backdrop" onClick={loading ? undefined : onCancel}>
            <div
                className="modal-card delete-modal-card"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-modal-title"
            >
                <div className="modal-header">
                    <h2 id="delete-modal-title">Delete Task</h2>
                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onCancel}
                        disabled={loading}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="modal-body delete-modal-body">
                    <div className="delete-warning-icon">⚠️</div>
                    <p>
                        Are you sure you want to delete{" "}
                        <strong className="delete-task-title">"{task.title}"</strong>?
                    </p>
                    <p className="delete-warning-sub">
                        This action cannot be undone.
                    </p>
                </div>

                <div className="modal-footer">
                    <button
                        type="button"
                        className="danger"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                    <button
                        type="button"
                        className="secondary"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
