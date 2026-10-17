import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { authService } from "../services/authService";
import { saveSession } from "../services/session";

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await authService.login({ email, password });

            saveSession(response);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ?? "Unable to log in. Please try again."
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
                <h1>Welcome back</h1>
                <p>Log in to manage your tasks.</p>

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
                    required
                    autoComplete="current-password"
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>


                <p>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </form>
        </main>
    );
}