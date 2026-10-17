import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { authService } from "../services/authService";
import { saveSession } from "../services/session";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmation) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await authService.register({
                name,
                email,
                password,
                password_confirmation: confirmation,
            });

            saveSession(response);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errors = err.response?.data?.errors;
                const firstError = errors
                    ? Object.values(errors).flat()[0]
                    : undefined;

                setError(
                    (firstError as string | undefined) ??
                    err.response?.data?.message ??
                    "Unable to register. Please try again."
                );
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1>Create an account</h1>

                {localStorage.getItem("access_token") && (
                    <button
                        type="button"
                        className="secondary"
                        style={{ width: "100%", marginBottom: "16px" }}
                        onClick={() => navigate("/dashboard")}
                    >
                        Go to Dashboard →
                    </button>
                )}

                {error && <div className="error-message" role="alert">{error}</div>}

                <label htmlFor="name">Full name</label>
                <input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    maxLength={100}
                    autoComplete="name"
                />

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="email"
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={8}
                    required
                    autoComplete="new-password"
                />

                <label htmlFor="confirmation">Confirm password</label>
                <input
                    id="confirmation"
                    type="password"
                    value={confirmation}
                    onChange={(event) => setConfirmation(event.target.value)}
                    minLength={8}
                    required
                    autoComplete="new-password"
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Register"}
                </button>

                <p>
                    Already registered? <Link to="/login">Login</Link>
                </p>
            </form>
        </main>
    );
}