import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import axios from "axios";
import type { Task, TaskPayload, TaskStatus } from "../types";

interface TaskFormProps {
    task?: Task | null;
    onSubmit: (payload: TaskPayload) => Promise<void>;
    onCancel: () => void;
}

export default function TaskForm({
    task,
    onSubmit,
    onCancel,
}: TaskFormProps) {
    const [title, setTitle] = useState(task?.title ?? "");
    const [description, setDescription] = useState(task?.description ?? "");
    const [status, setStatus] = useState<TaskStatus>(
        task?.status ?? "pending"
    );
    const [titleError, setTitleError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onCancel();
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onCancel]);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setGeneralError("");

        if (!title.trim()) {
            setTitleError("Task title is required.");
            return;
        }

        setLoading(true);

        try {
            await onSubmit({
                title: title.trim(),
                description: description.trim(),
                status,
            });
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.errors?.title) {
                setTitleError(err.response.data.errors.title[0]);
            } else {
                setGeneralError("Unable to save the task. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-backdrop" onClick={onCancel}>
            <div
                className="modal-card"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="modal-header">
                    <h2 id="modal-title">{task ? "Edit task" : "Create task"}</h2>
                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onCancel}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit} noValidate>
                    {generalError && (
                        <div className="error-message" role="alert">
                            {generalError}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="title">
                            Title <span className="required-star">*</span>
                        </label>
                        <input
                            id="title"
                            value={title}
                            onChange={(event) => {
                                setTitle(event.target.value);
                                if (event.target.value.trim()) {
                                    setTitleError("");
                                }
                            }}
                            className={titleError ? "input-error" : ""}
                            placeholder="Enter task title"
                            maxLength={255}
                        />
                        {titleError && (
                            <span className="field-error" role="alert">
                                {titleError}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="Enter task description (optional)"
                            maxLength={5000}
                            rows={4}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value as TaskStatus)
                            }
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" disabled={loading}>
                            {loading
                                ? "Saving..."
                                : task
                                ? "Update task"
                                : "Create task"}
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
                </form>
            </div>
        </div>
    );
}