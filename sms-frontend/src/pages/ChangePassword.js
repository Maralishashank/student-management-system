import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/sms.css";

// IMPORTANT: EyeIcon and Field are defined OUTSIDE ChangePassword.
// If defined inside, React creates a new component type on every render
// (every keystroke → state update → re-render → new Field type → React
// unmounts old input, mounts fresh one → focus lost after each character).
// Outside = same type across renders = no remount = focus stays.

const EyeIcon = ({ show, toggle }) => (
  <button type="button" onClick={toggle}
    style={{ border: "none", background: "none", cursor: "pointer", padding: 0, color: "#94a3b8", display: "flex", alignItems: "center" }}>
    {show
      ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
      : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    }
  </button>
);

const Field = ({ label, value, onChange, show, onToggle, placeholder, onKeyDown }) => (
  <div>
    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".4px" }}>
      {label}
    </label>
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "white", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "11px 14px", transition: "border-color .18s" }}>
      <svg width="15" height="15" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#1e293b", background: "transparent", fontFamily: "inherit" }}
      />
      <EyeIcon show={show} toggle={onToggle} />
    </div>
  </div>
);

function ChangePassword() {
  const navigate = useNavigate();
  const [oldPassword,     setOldPassword]     = useState("student123");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld,     setShowOld]     = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const strength = (pwd) => {
    if (!pwd) return { level: 0, label: "", color: "" };
    let s = 0;
    if (pwd.length >= 8)          s++;
    if (/[A-Z]/.test(pwd))        s++;
    if (/[0-9]/.test(pwd))        s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return [
      { level: 0, label: "",       color: "" },
      { level: 1, label: "Weak",   color: "#ef4444" },
      { level: 2, label: "Fair",   color: "#f59e0b" },
      { level: 3, label: "Good",   color: "#3b82f6" },
      { level: 4, label: "Strong", color: "#10b981" },
    ][s];
  };

  const pwdStrength = strength(newPassword);

  const handleSubmit = async () => {
    setError("");
    if (newPassword.length < 6)         return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");
    if (!localStorage.getItem("token")) { setError("Session expired. Please log in again."); navigate("/"); return; }
    setLoading(true);
    try {
      await API.post("/auth/change-password", { oldPassword, newPassword });
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to change password. Please try again.");
    }
    setLoading(false);
  };

  const onKey = e => { if (e.key === "Enter") handleSubmit(); };

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes float  { 0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
      `}</style>

      <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter',-apple-system,sans-serif" }}>

        {/* Left panel */}
        <div style={{ flex: 1, background: "linear-gradient(145deg,#1e1b4b 0%,#312e81 50%,#1e40af 100%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px 48px", position: "relative", overflow: "hidden", textAlign: "center" }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(99,102,241,.15)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(6,182,212,.12)", pointerEvents: "none" }} />

          <div style={{ animation: "float 4s ease-in-out infinite", marginBottom: 32 }}>
            <div style={{ width: 88, height: 88, borderRadius: 24, background: "linear-gradient(135deg,#6366f1,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, boxShadow: "0 16px 40px rgba(99,102,241,.5)", margin: "0 auto" }}>🔐</div>
          </div>

          <div style={{ animation: "fadeUp .6s .1s ease both", opacity: 0, animationFillMode: "forwards" }}>
            <h2 style={{ color: "white", fontSize: 28, fontWeight: 900, letterSpacing: "-.5px", marginBottom: 12, lineHeight: 1.2 }}>Set your password</h2>
            <p style={{ color: "rgba(255,255,255,.6)", fontSize: 14, lineHeight: 1.8, maxWidth: 300, margin: "0 auto" }}>
              This is your first login. Choose a strong password to secure your account.
            </p>
          </div>

          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 320, animation: "fadeUp .6s .2s ease both", opacity: 0, animationFillMode: "forwards" }}>
            {[
              { icon: "✅", text: "At least 6 characters long" },
              { icon: "🔤", text: "Mix uppercase and lowercase" },
              { icon: "🔢", text: "Include numbers for extra security" },
              { icon: "✨", text: "Add symbols like @, #, ! for strength" },
            ].map((tip, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "10px 14px" }}>
                <span style={{ fontSize: 16 }}>{tip.icon}</span>
                <span style={{ color: "rgba(255,255,255,.7)", fontSize: 13 }}>{tip.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ width: 480, background: "#f8fafc", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 52px", animation: "fadeUp .5s .15s ease both", opacity: 0, animationFillMode: "forwards" }}>

          <button type="button" onClick={() => { localStorage.removeItem("token"); navigate("/"); }}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "none", background: "none", color: "#64748b", fontSize: 13, cursor: "pointer", marginBottom: 32, padding: 0, fontFamily: "inherit" }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to login
          </button>

          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fef3c7", borderRadius: 20, padding: "4px 12px", marginBottom: 18 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#d97706" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#92400e", letterSpacing: ".3px" }}>FIRST LOGIN</span>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#1e293b", letterSpacing: "-.5px", marginBottom: 8, lineHeight: 1.2 }}>Create your password</h2>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
              Default password is{" "}
              <code style={{ background: "#f1f5f9", padding: "2px 7px", borderRadius: 5, fontWeight: 700, color: "#334155" }}>student123</code>.
              {" "}Set a new one to continue.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <Field label="Current Password" value={oldPassword} onChange={setOldPassword}
              show={showOld} onToggle={() => setShowOld(v => !v)}
              placeholder="Your current password" onKeyDown={onKey} />

            <Field label="New Password" value={newPassword} onChange={setNewPassword}
              show={showNew} onToggle={() => setShowNew(v => !v)}
              placeholder="Choose a strong password" onKeyDown={onKey} />

            {newPassword && (
              <div style={{ marginTop: -8 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= pwdStrength.level ? pwdStrength.color : "#e2e8f0", transition: "background .3s" }} />
                  ))}
                </div>
                {pwdStrength.label && <span style={{ fontSize: 11, fontWeight: 700, color: pwdStrength.color }}>{pwdStrength.label} password</span>}
              </div>
            )}

            <Field label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword}
              show={showConfirm} onToggle={() => setShowConfirm(v => !v)}
              placeholder="Re-enter your new password" onKeyDown={onKey} />

            {confirmPassword && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: -8, fontSize: 12, fontWeight: 600 }}>
                {newPassword === confirmPassword
                  ? <><span style={{ color: "#10b981" }}>✓</span><span style={{ color: "#10b981" }}>Passwords match</span></>
                  : <><span style={{ color: "#ef4444" }}>✗</span><span style={{ color: "#ef4444" }}>Passwords don't match</span></>
                }
              </div>
            )}

            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 12px" }}>
                <svg width="14" height="14" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{ fontSize: 13, color: "#dc2626", fontWeight: 500 }}>{error}</span>
              </div>
            )}

            <button type="button" onClick={handleSubmit} disabled={loading}
              style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: "#4f46e5", color: "white", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? .7 : 1, transition: "all .18s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", marginTop: 4, boxShadow: "0 4px 14px rgba(79,70,229,.3)" }}>
              {loading
                ? <><svg style={{ animation: "spin .7s linear infinite" }} width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Saving...</>
                : <>Set Password &amp; Continue <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
              }
            </button>

          </div>
        </div>
      </div>
    </>
  );
}

export default ChangePassword;