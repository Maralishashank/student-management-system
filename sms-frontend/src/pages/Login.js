import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/sms.css";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", { username, password });
      const token = typeof res.data === "string" ? res.data : null;
      if (!token) throw new Error("No token received");

      const decoded = jwtDecode(token);
      localStorage.setItem("token", token);

      if (decoded.firstLogin === true) {
        navigate("/change-password");
        return;
      }
      navigate(decoded.role === "ADMIN" ? "/admin" : "/student");
    } catch (err) {
      setError("Invalid username or password. Please try again.");
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };

  const features = [
    { icon: "🎓", title: "Student Tracking", desc: "Manage student records, departments and profiles" },
    { icon: "📊", title: "Marks & Grades",  desc: "Record scores with automatic grade calculation" },
    { icon: "✅", title: "Attendance",       desc: "Daily attendance with real-time reports" },
    { icon: "📢", title: "Announcements",   desc: "Keep students informed with instant notices" },
  ];

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-field:focus-within {
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 3px rgba(79,70,229,.12) !important;
        }
        .login-submit:hover:not(:disabled) {
          background: #3730a3 !important;
          box-shadow: 0 8px 20px rgba(79,70,229,.4) !important;
          transform: translateY(-1px);
        }
        .login-submit:active:not(:disabled) { transform: translateY(0); }
        .feature-item:hover { background: rgba(255,255,255,.12) !important; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', -apple-system, sans-serif" }}>

        {/* ── Left panel — branding ── */}
        <div style={{
          flex: 1, background: "linear-gradient(145deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "60px 56px", position: "relative", overflow: "hidden",
        }}>
          {/* Decorative blobs */}
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(99,102,241,.15)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(6,182,212,.12)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "40%", right: "10%", width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,.04)", pointerEvents: "none" }} />

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 52, animation: "fadeUp .6s ease both" }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: "linear-gradient(135deg, #6366f1, #06b6d4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, fontWeight: 900, color: "white",
              boxShadow: "0 8px 24px rgba(99,102,241,.4)",
              animation: "float 4s ease-in-out infinite",
            }}>S</div>
            <div>
              <div style={{ color: "white", fontWeight: 800, fontSize: 20, letterSpacing: "-.3px", lineHeight: 1 }}>SMS Portal</div>
              <div style={{ color: "rgba(255,255,255,.5)", fontSize: 12, marginTop: 3 }}>Student Management System</div>
            </div>
          </div>

          {/* Headline */}
          <div style={{ animation: "fadeUp .6s .1s ease both", opacity: 0, animationFillMode: "forwards" }}>
            <h1 style={{ color: "white", fontSize: 36, fontWeight: 900, lineHeight: 1.15, letterSpacing: "-.5px", marginBottom: 16 }}>
              Manage your<br />
              <span style={{ background: "linear-gradient(90deg, #818cf8, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                institution smarter.
              </span>
            </h1>
            <p style={{ color: "rgba(255,255,255,.6)", fontSize: 15, lineHeight: 1.7, maxWidth: 360 }}>
              A unified platform for students, attendance, marks, and announcements — all in one place.
            </p>
          </div>

          {/* Feature list */}
          <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 10, animation: "fadeUp .6s .2s ease both", opacity: 0, animationFillMode: "forwards" }}>
            {features.map((f, i) => (
              <div key={i} className="feature-item" style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "12px 16px", borderRadius: 12,
                background: "rgba(255,255,255,.06)",
                border: "1px solid rgba(255,255,255,.08)",
                transition: "background .2s",
                cursor: "default",
              }}>
                <div style={{ fontSize: 22, width: 36, height: 36, background: "rgba(255,255,255,.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: 13 }}>{f.title}</div>
                  <div style={{ color: "rgba(255,255,255,.45)", fontSize: 12, marginTop: 1 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ marginTop: "auto", paddingTop: 40, color: "rgba(255,255,255,.25)", fontSize: 12, animation: "fadeUp .6s .3s ease both", opacity: 0, animationFillMode: "forwards" }}>
            © {new Date().getFullYear()} SMS Portal · All rights reserved
          </div>
        </div>

        {/* ── Right panel — login form ── */}
        <div style={{
          width: 480, background: "#f8fafc",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "60px 52px",
          animation: "fadeUp .5s .15s ease both", opacity: 0, animationFillMode: "forwards",
        }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#ede9fe", borderRadius: 20, padding: "4px 12px", marginBottom: 20 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4f46e5" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#4338ca", letterSpacing: ".3px" }}>SECURE LOGIN</span>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#1e293b", letterSpacing: "-.5px", marginBottom: 8, lineHeight: 1.2 }}>
              Welcome back
            </h2>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
              Sign in to your account to continue to the portal.
            </p>
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".4px" }}>Username</label>
              <div className="login-field" style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "white", border: "1.5px solid #e2e8f0",
                borderRadius: 10, padding: "11px 14px",
                transition: "all .18s ease",
              }}>
                <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#1e293b", background: "transparent", fontFamily: "inherit" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".4px" }}>Password</label>
              <div className="login-field" style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "white", border: "1.5px solid #e2e8f0",
                borderRadius: 10, padding: "11px 14px",
                transition: "all .18s ease",
              }}>
                <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#1e293b", background: "transparent", fontFamily: "inherit" }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ border: "none", background: "none", cursor: "pointer", padding: 0, color: "#94a3b8", display: "flex", alignItems: "center" }}
                >
                  {showPassword
                    ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 12px" }}>
                <svg width="14" height="14" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{ fontSize: 13, color: "#dc2626", fontWeight: 500 }}>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              className="login-submit"
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: "100%", padding: "13px", borderRadius: 10, border: "none",
                background: "#4f46e5", color: "white",
                fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? .7 : 1,
                transition: "all .18s ease",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontFamily: "inherit", marginTop: 4,
                boxShadow: "0 4px 14px rgba(79,70,229,.3)",
              }}
            >
              {loading
                ? <><svg style={{ animation: "spin .7s linear infinite" }} width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Signing in...</>
                : <> Sign In <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
              }
            </button>
          </div>

          {/* Role hint */}
          <div style={{ marginTop: 36, padding: "16px 18px", background: "white", border: "1px solid #e2e8f0", borderRadius: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>Login credentials</div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>🔑</div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#4338ca" }}>Admin</span>
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>Your registered username &amp; password</div>
              </div>
              <div style={{ width: 1, background: "#e2e8f0" }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: "#cffafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>🎓</div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0891b2" }}>Student</span>
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>Email as username, default: <code style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>student123</code></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

export default Login;