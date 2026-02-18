import { useState } from "react";
import { login } from "../api/auth";
import { saveToken } from "../utils/token";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const data = await login(email, password);
      saveToken(data.token);
      navigate("/");
    } catch {
      setErr("Invalid email or password");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <div
        style={{
          width: 380,
          padding: 40,
          borderRadius: 16,
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          color: "white",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: 8 }}>🔐 Hide Your Secrets Here</h1>
        <p style={{ marginBottom: 25, fontSize: 14, opacity: 0.9 }}>
          Secure your images safely
        </p>

        {err && (
          <div style={{ color: "#ffb3b3", marginBottom: 15 }}>{err}</div>
        )}

        <form
          onSubmit={onSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 15 }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: 10,
              borderRadius: 8,
              border: "none",
              outline: "none",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: 10,
              borderRadius: 8,
              border: "none",
              outline: "none",
            }}
          />

          <button
            type="submit"
            style={{
              padding: 10,
              borderRadius: 8,
              border: "none",
              backgroundColor: "#00c6ff",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 14 }}>
          New user?{" "}
          <Link to="/signup" style={{ color: "#ffd700" }}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
