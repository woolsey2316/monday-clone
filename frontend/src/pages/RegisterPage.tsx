import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(username, email, password);
      navigate("/");
    } catch {
      setError("Could not register. Try a different username.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-[var(--bg)] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-lg border border-[var(--border)] bg-white p-8 shadow-sm"
      >
        <div>
          <h1 className="text-2xl font-semibold text-[var(--sidebar)]">monday clone</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Create your account</p>
        </div>
        {error && (
          <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <label className="block text-sm">
          <span className="mb-1 block text-[var(--muted)]">Username</span>
          <input
            className="w-full rounded border border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--accent)]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-[var(--muted)]">Email</span>
          <input
            type="email"
            className="w-full rounded border border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--accent)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-[var(--muted)]">Password</span>
          <input
            type="password"
            className="w-full rounded border border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--accent)]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-[var(--accent)] px-4 py-2 font-medium text-white hover:bg-[#0060b9] disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
        <p className="text-center text-sm text-[var(--muted)]">
          Already have an account?{" "}
          <Link className="text-[var(--accent)] hover:underline" to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
