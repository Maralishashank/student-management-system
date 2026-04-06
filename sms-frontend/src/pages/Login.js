import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/sms.css";

// Input fields defined OUTSIDE to prevent focus loss on keystroke
// (same issue as ChangePassword — inline component definitions cause remounts)

const LoginField = ({ icon, type, placeholder, value, onChange, onKeyDown, rightSlot }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "white", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "11px 14px", transition: "border-color .18s" }}>
    {icon}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#1e293b", background: "transparent", fontFamily: "inherit" }}
    />
    {rightSlot}
  </div>
);

function Login() {
  const navigate = useNavigate();

  // Login state
  const [username,     setUsername]     = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  // Admin register state
  const [showRegister,  setShowRegister]  = useState(false);
  const [regUsername,   setRegUsername]   = useState("");
  const [regPassword,   setRegPassword]   = useState("");
  const [regLoading,    setRegLoading]    = useState(false);
  const [regError,      setRegError]      = useState("");
  const [regSuccess,    setRegSuccess]    = useState("");

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) return setError("Please enter both username and password.");
    setLoading(true);
    setError("");
    try {
      const res   = await API.post("/auth/login", { username, password });
      const token = typeof res.data === "string" ? res.data : null;
      if (!token) throw new Error("No token received");
      const decoded = jwtDecode(token);
      localStorage.setItem("token", token);
      if (decoded.firstLogin === true) { navigate("/change-password"); return; }
      navigate(decoded.role === "ADMIN" ? "/admin" : "/student");
    } catch {
      setError("Invalid username or password. Please try again.");
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    setRegError(""); setRegSuccess("");
    if (!regUsername.trim() || !regPassword.trim()) return setRegError("Fill in both fields.");
    if (regPassword.length < 6) return setRegError("Password must be at least 6 characters.");
    setRegLoading(true);
    try {
      await API.post("/auth/register", { username: regUsername, password: regPassword, role: "ADMIN", firstLogin: false });
      setRegSuccess(`Admin account "${regUsername}" created. You can now log in.`);
      setRegUsername(""); setRegPassword("");
    } catch (e) {
      setRegError(e.response?.data?.error || "Registration failed. Username may already exist.");
    }
    setRegLoading(false);
  };

  const onKey    = e => { if (e.key === "Enter") handleLogin(); };
  const onRegKey = e => { if (e.key === "Enter") handleRegister(); };

  const EyeBtn = ({ show, toggle }) => (
    <button type="button" onClick={toggle} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, color: "#94a3b8", display: "flex", alignItems: "center" }}>
      {show
        ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      }
    </button>
  );

  const UserIcon = () => <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
  const LockIcon = () => <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;

  const features = [
    { icon: "🎓", title: "Student Tracking",  desc: "Manage records, departments and profiles" },
    { icon: "📊", title: "Marks & Grades",    desc: "Scores with automatic grade calculation" },
    { icon: "✅", title: "Attendance",         desc: "Daily tracking with real-time reports" },
    { icon: "📢", title: "Announcements",     desc: "Keep students informed instantly" },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes float  { 0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .login-submit:hover:not(:disabled){ background:#3730a3!important; box-shadow:0 8px 20px rgba(79,70,229,.4)!important; transform:translateY(-1px); }
        .login-submit:active:not(:disabled){ transform:translateY(0); }
        .register-toggle:hover { background:rgba(255,255,255,.14)!important; }
        .feature-item:hover { background:rgba(255,255,255,.12)!important; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter',-apple-system,sans-serif" }}>

        {/* ── Left panel ── */}
        <div style={{ flex: 1, background: "linear-gradient(145deg,#1e1b4b 0%,#312e81 50%,#1e40af 100%)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 56px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(99,102,241,.15)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(6,182,212,.12)", pointerEvents: "none" }} />

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 52, animation: "fadeUp .6s ease both" }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#6366f1,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: "white", boxShadow: "0 8px 24px rgba(99,102,241,.4)", animation: "float 4s ease-in-out infinite" }}>S</div>
            <div>
              <div style={{ color: "white", fontWeight: 800, fontSize: 20, letterSpacing: "-.3px", lineHeight: 1 }}>SMS Portal</div>
              <div style={{ color: "rgba(255,255,255,.5)", fontSize: 12, marginTop: 3 }}>Student Management System</div>
            </div>
          </div>

          {/* Headline */}
          <div style={{ animation: "fadeUp .6s .1s ease both", opacity: 0, animationFillMode: "forwards" }}>
            <h1 style={{ color: "white", fontSize: 36, fontWeight: 900, lineHeight: 1.15, letterSpacing: "-.5px", marginBottom: 16 }}>
              Manage your<br />
              <span style={{ background: "linear-gradient(90deg,#818cf8,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                institution smarter.
              </span>
            </h1>
            <p style={{ color: "rgba(255,255,255,.6)", fontSize: 15, lineHeight: 1.7, maxWidth: 360 }}>
              A unified platform for students, attendance, marks, and announcements.
            </p>
          </div>

          {/* Features */}
          <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 10, animation: "fadeUp .6s .2s ease both", opacity: 0, animationFillMode: "forwards" }}>
            {features.map((f, i) => (
              <div key={i} className="feature-item" style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", transition: "background .2s", cursor: "default" }}>
                <div style={{ fontSize: 22, width: 36, height: 36, background: "rgba(255,255,255,.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: 13 }}>{f.title}</div>
                  <div style={{ color: "rgba(255,255,255,.45)", fontSize: 12, marginTop: 1 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "auto", paddingTop: 40, color: "rgba(255,255,255,.25)", fontSize: 12, animation: "fadeUp .6s .3s ease both", opacity: 0, animationFillMode: "forwards" }}>
            © {new Date().getFullYear()} SMS Portal · All rights reserved
          </div>
        </div>

        {/* ── Right panel ── */}
        <div style={{ width: 480, background: "#f8fafc", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 52px", overflowY: "auto", animation: "fadeUp .5s .15s ease both", opacity: 0, animationFillMode: "forwards" }}>

          {/* ── LOGIN FORM ── */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#ede9fe", borderRadius: 20, padding: "4px 12px", marginBottom: 20 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4f46e5" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#4338ca", letterSpacing: ".3px" }}>SECURE LOGIN</span>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#1e293b", letterSpacing: "-.5px", marginBottom: 8, lineHeight: 1.2 }}>Welcome back</h2>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>Sign in to your account to continue.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".4px" }}>Username</label>
              <LoginField icon={<UserIcon />} type="text" placeholder="Enter your username" value={username} onChange={setUsername} onKeyDown={onKey} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".4px" }}>Password</label>
              <LoginField icon={<LockIcon />} type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={setPassword} onKeyDown={onKey}
                rightSlot={<EyeBtn show={showPassword} toggle={() => setShowPassword(v => !v)} />}
              />
            </div>

            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 12px" }}>
                <svg width="14" height="14" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{ fontSize: 13, color: "#dc2626", fontWeight: 500 }}>{error}</span>
              </div>
            )}

            <button type="button" className="login-submit" onClick={handleLogin} disabled={loading}
              style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: "#4f46e5", color: "white", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? .7 : 1, transition: "all .18s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", boxShadow: "0 4px 14px rgba(79,70,229,.3)" }}>
              {loading
                ? <><svg style={{ animation: "spin .7s linear infinite" }} width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Signing in...</>
                : <>Sign In <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
              }
            </button>
          </div>

          {/* Credential hint */}
          <div style={{ padding: "14px 16px", background: "white", border: "1px solid #e2e8f0", borderRadius: 12, marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>Login info</div>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>🔑</div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#4338ca" }}>Admin</span>
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>Registered username &amp; password</div>
              </div>
              <div style={{ width: 1, background: "#e2e8f0" }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: "#cffafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>🎓</div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0891b2" }}>Student</span>
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>Email as username · default: <code style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: 4 }}>student123</code></div>
              </div>
            </div>
          </div>

          {/* ── ADMIN REGISTRATION ── */}
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
            <button type="button" className="register-toggle" onClick={() => { setShowRegister(v => !v); setRegError(""); setRegSuccess(""); }}
              style={{ width: "100%", padding: "13px 16px", background: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "inherit", transition: "background .18s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🔑</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>Register Admin Account</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>Create a new administrator login</div>
                </div>
              </div>
              <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2.5" viewBox="0 0 24 24"
                style={{ transform: showRegister ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s" }}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            {showRegister && (
              <div style={{ padding: "16px", borderTop: "1px solid #f1f5f9", background: "#fafbff" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".4px" }}>Admin Username</label>
                    <LoginField icon={<UserIcon />} type="text" placeholder="Choose a username" value={regUsername} onChange={setRegUsername} onKeyDown={onRegKey} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".4px" }}>Admin Password</label>
                    <LoginField icon={<LockIcon />} type="password" placeholder="Min. 6 characters" value={regPassword} onChange={setRegPassword} onKeyDown={onRegKey} />
                  </div>

                  {regError && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "9px 12px" }}>
                      <svg width="13" height="13" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 500 }}>{regError}</span>
                    </div>
                  )}

                  {regSuccess && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "9px 12px" }}>
                      <svg width="13" height="13" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      <span style={{ fontSize: 12, color: "#15803d", fontWeight: 500 }}>{regSuccess}</span>
                    </div>
                  )}

                  <button type="button" onClick={handleRegister} disabled={regLoading}
                    style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "#4f46e5", color: "white", fontWeight: 700, fontSize: 13, cursor: regLoading ? "not-allowed" : "pointer", opacity: regLoading ? .7 : 1, transition: "all .18s", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "inherit" }}>
                    {regLoading
                      ? <><svg style={{ animation: "spin .7s linear infinite" }} width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Creating...</>
                      : "Create Admin Account"
                    }
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default Login;