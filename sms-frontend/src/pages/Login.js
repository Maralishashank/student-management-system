import { useState, useRef } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/sms.css";

// ─── All helpers defined OUTSIDE Login() ────────────────────────────────────
// Defining sub-components inside the parent function causes React to treat them
// as new types on every render (keystroke → state update → re-render → new ref
// → React unmounts old input, mounts fresh one → focus lost). Outside = stable
// reference across renders = no remount = typing works normally.

const UserIcon = () => (
  <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeBtn = ({ show, toggle }) => (
  <button
    type="button"
    onMouseDown={e => e.preventDefault()}
    onClick={toggle}
    style={{ border: "none", background: "none", cursor: "pointer", padding: 0, color: "#94a3b8", display: "flex", alignItems: "center" }}
  >
    {show
      ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
      : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    }
  </button>
);

const InputRow = ({ icon, type, placeholder, value, onChange, onKeyDown, rightSlot, inputRef }) => {
  const localRef = useRef(null);
  const ref = inputRef || localRef;
  return (
    <div
      onClick={() => ref.current?.focus()}
      style={{ display: "flex", alignItems: "center", gap: 10, background: "white", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "11px 14px", transition: "border-color .18s", cursor: "text" }}
    >
      {icon}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#1e293b", background: "transparent", fontFamily: "inherit", cursor: "text" }}
      />
      {rightSlot}
    </div>
  );
};

const ErrorBox = ({ msg }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 12px" }}>
    <svg width="14" height="14" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    <span style={{ fontSize: 13, color: "#dc2626", fontWeight: 500 }}>{msg}</span>
  </div>
);

// ─── Demo credential card ────────────────────────────────────────────────────
// Shows test credentials so anyone evaluating the app knows how to log in.
// The default admin account is auto-seeded by DataSeeder.java on first startup.
// A sample student account is created whenever the admin adds a student.
// Remove or hide this card before deploying to a real production environment.

const DemoCard = ({ role, username, password, color, bg, icon, note }) => (
  <div style={{ flex: 1, background: bg, border: `1px solid ${color}30`, borderRadius: 10, padding: "12px 14px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
      <div style={{ width: 22, height: 22, borderRadius: 6, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{icon}</div>
      <span style={{ fontSize: 12, fontWeight: 800, color, letterSpacing: ".2px" }}>{role}</span>
    </div>
    <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.9 }}>
      <div><span style={{ color: "#94a3b8", fontWeight: 600 }}>User </span><code style={{ background: "white", padding: "1px 6px", borderRadius: 4, fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{username}</code></div>
      <div><span style={{ color: "#94a3b8", fontWeight: 600 }}>Pass </span><code style={{ background: "white", padding: "1px 6px", borderRadius: 4, fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{password}</code></div>
      {note && <div style={{ marginTop: 4, fontSize: 11, color: "#94a3b8" }}>{note}</div>}
    </div>
  </div>
);

// ─── Main component ──────────────────────────────────────────────────────────

function Login() {
  const navigate   = useNavigate();
  const passRef    = useRef(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) return setError("Please enter both username and password.");
    setLoading(true); setError("");
    try {
      const res   = await API.post("/auth/login", { username, password });
      const token = typeof res.data === "string" ? res.data : null;
      if (!token) throw new Error("No token");
      const decoded = jwtDecode(token);
      localStorage.setItem("token", token);
      if (decoded.firstLogin === true) { navigate("/change-password"); return; }
      navigate(decoded.role === "ADMIN" ? "/admin" : "/student");
    } catch {
      setError("Invalid username or password. Please try again.");
    }
    setLoading(false);
  };

  const onUsernameKey = e => { if (e.key === "Enter") passRef.current?.focus(); };
  const onPasswordKey = e => { if (e.key === "Enter") handleLogin(); };

  const features = [
    { icon: "🎓", title: "Student Tracking",  desc: "Manage records, departments and profiles" },
    { icon: "📊", title: "Marks & Grades",    desc: "Scores with automatic grade calculation" },
    { icon: "✅", title: "Attendance",         desc: "Daily tracking with real-time reports" },
    { icon: "📢", title: "Announcements",      desc: "Keep students informed instantly" },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes float  { 0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .sms-login-btn:hover:not(:disabled){ background:#3730a3!important;box-shadow:0 8px 20px rgba(79,70,229,.4)!important;transform:translateY(-1px); }
        .sms-login-btn:active:not(:disabled){ transform:translateY(0); }
        .sms-feature:hover { background:rgba(255,255,255,.12)!important; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter',-apple-system,sans-serif" }}>

        {/* ── Left branding panel ── */}
        <div style={{ flex: 1, background: "linear-gradient(145deg,#1e1b4b 0%,#312e81 50%,#1e40af 100%)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 56px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(99,102,241,.15)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(6,182,212,.12)", pointerEvents: "none" }} />

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 52, animation: "fadeUp .6s ease both" }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#6366f1,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: "white", boxShadow: "0 8px 24px rgba(99,102,241,.4)", animation: "float 4s ease-in-out infinite" }}>S</div>
            <div>
              <div style={{ color: "white", fontWeight: 800, fontSize: 20, letterSpacing: "-.3px" }}>SMS Portal</div>
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
              <div key={i} className="sms-feature" style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", transition: "background .2s" }}>
                <div style={{ fontSize: 20, width: 36, height: 36, background: "rgba(255,255,255,.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{f.icon}</div>
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

        {/* ── Right form panel ── */}
        <div style={{ width: 480, background: "#f8fafc", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 52px", overflowY: "auto", animation: "fadeUp .5s .15s ease both", opacity: 0, animationFillMode: "forwards" }}>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#ede9fe", borderRadius: 20, padding: "4px 12px", marginBottom: 16 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4f46e5" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#4338ca", letterSpacing: ".3px" }}>SECURE LOGIN</span>
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: "#1e293b", letterSpacing: "-.5px", marginBottom: 6, lineHeight: 1.2 }}>Welcome back</h2>
            <p style={{ color: "#64748b", fontSize: 14 }}>Sign in to your account to continue.</p>
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".4px" }}>Username</label>
              <InputRow
                icon={<UserIcon />}
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={setUsername}
                onKeyDown={onUsernameKey}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".4px" }}>Password</label>
              <InputRow
                icon={<LockIcon />}
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={setPassword}
                onKeyDown={onPasswordKey}
                inputRef={passRef}
                rightSlot={<EyeBtn show={showPass} toggle={() => setShowPass(v => !v)} />}
              />
            </div>

            {error && <ErrorBox msg={error} />}

            <button
              type="button"
              className="sms-login-btn"
              onClick={handleLogin}
              disabled={loading}
              style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "#4f46e5", color: "white", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? .7 : 1, transition: "all .18s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", boxShadow: "0 4px 14px rgba(79,70,229,.3)" }}
            >
              {loading
                ? <><svg style={{ animation: "spin .7s linear infinite" }} width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Signing in...</>
                : <>Sign In <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
              }
            </button>
          </div>

          {/* ── Demo Credentials ── */}
          {/* Shows test credentials so anyone evaluating the app can log in immediately.
              The admin account is auto-seeded by DataSeeder.java on first startup.
              Remove this section before deploying to a real school or production system. */}
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
              <div style={{ width: 20, height: 20, borderRadius: 5, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>🧪</div>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#92400e", textTransform: "uppercase", letterSpacing: ".4px" }}>Demo Credentials</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <DemoCard
                role="Admin"
                username="admin"
                password="admin123"
                color="#4f46e5"
                bg="#f5f3ff"
                icon="🔑"
              />
              <DemoCard
                role="Student"
                username="student email"
                password="student123"
                color="#0891b2"
                bg="#f0f9ff"
                icon="🎓"
                note="Add a student first to get their email"
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Login;