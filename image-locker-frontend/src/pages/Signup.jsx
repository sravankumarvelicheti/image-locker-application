import { useState } from "react";
import { signup } from "../api/auth";
import { saveToken } from "../utils/token";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const data = await signup(email, password);
      saveToken(data.token);
      navigate("/");
    } catch (e) {
      setErr(e?.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brand}>
          <div style={styles.badge}>🔐</div>
          <div>
            <div style={styles.appName}>Image Locker</div>
            <div style={styles.tagline}>Hide ur secrets here</div>
          </div>
        </div>

        <h2 style={styles.title}>Create account</h2>
        <p style={styles.subTitle}>Sign up to store and manage your images securely.</p>

        {err && <div style={styles.error}>{err}</div>}

        <form onSubmit={onSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            autoComplete="new-password"
          />

          <button style={styles.primaryBtn} type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    background:
      "radial-gradient(1200px 600px at 20% 20%, rgba(255,255,255,0.15), transparent 60%), linear-gradient(135deg, #4f46e5, #a855f7)",
  },
  card: {
    width: "100%",
    maxWidth: 460,
    padding: 24,
    borderRadius: 16,
    background: "rgba(255,255,255,0.14)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.22)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
    color: "#fff",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.20)",
    border: "1px solid rgba(255,255,255,0.25)",
  },
  appName: { fontWeight: 800, fontSize: 18, letterSpacing: 0.2 },
  tagline: { fontSize: 13, opacity: 0.85, marginTop: 2 },

  title: { margin: "6px 0 6px", fontSize: 22 },
  subTitle: { margin: "0 0 16px", opacity: 0.85, fontSize: 13 },

  error: {
    background: "rgba(255, 0, 60, 0.16)",
    border: "1px solid rgba(255, 0, 60, 0.35)",
    padding: "10px 12px",
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 13,
  },

  form: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 13, opacity: 0.9, marginTop: 8 },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(0,0,0,0.15)",
    color: "#fff",
    outline: "none",
  },
  primaryBtn: {
    marginTop: 12,
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "none",
    background: "#22c55e",
    color: "#0b1220",
    fontWeight: 800,
    cursor: "pointer",
  },
  footer: { marginTop: 14, fontSize: 13, opacity: 0.9 },
  link: { color: "#fff", fontWeight: 700, textDecoration: "underline" },
};
