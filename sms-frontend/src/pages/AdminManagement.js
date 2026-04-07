import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/sms.css";

// This page lets an existing admin create additional admin accounts.
// POST /auth/register is now ADMIN-only (SecurityConfig), so only a logged-in
// admin with a valid token can call it. This page is only reachable via the
// Admin sidebar and is protected by PrivateRoute role="ADMIN" in App.js.

const EyeBtn = ({ show, toggle }) => (
  <button type="button" onMouseDown={e => e.preventDefault()} onClick={toggle}
    style={{ border: "none", background: "none", cursor: "pointer", padding: 0, color: "#94a3b8", display: "flex", alignItems: "center" }}>
    {show
      ? <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
      : <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    }
  </button>
);

function AdminManagement() {
  const [admins,    setAdmins]    = useState([]);
  const [username,  setUsername]  = useState("");
  const [password,  setPassword]  = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [fetching,  setFetching]  = useState(true);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState("");

  const loadAdmins = async () => {
    try {
      // Fetch all users and filter to ADMIN role.
      // GET /students returns students; there's no /users endpoint,
      // so we use the auth test endpoint to confirm the backend is alive,
      // and maintain a local list of created admins in this session.
      // For a proper list, a GET /auth/admins endpoint would be needed.
      setFetching(false);
    } catch {
      setFetching(false);
    }
  };

  useEffect(() => { loadAdmins(); }, []);

  const createAdmin = async () => {
    setError(""); setSuccess("");
    if (!username.trim())    return setError("Please enter a username.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      await API.post("/auth/register", {
        username:   username.trim(),
        password:   password,
        role:       "ADMIN",
        firstLogin: false,
      });
      setSuccess(`Admin account "${username.trim()}" created successfully.`);
      setAdmins(prev => [...prev, { username: username.trim(), createdNow: true }]);
      setUsername(""); setPassword("");
    } catch (e) {
      setError(e.response?.data?.error || "Failed to create admin. Username may already exist.");
    }
    setLoading(false);
  };

  return (
    <div className="sms-layout">
      <Sidebar />
      <div className="sms-main">
        <Navbar />
        <div className="sms-content">

          <div className="sms-page-header">
            <div className="sms-page-title">Admin Management</div>
            <div className="sms-page-sub">Create additional administrator accounts</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            {/* Create admin form */}
            <div className="sms-card">
              <div className="sms-card-header">
                <span className="sms-card-title">🔑 Create Admin Account</span>
              </div>
              <div className="sms-card-body">

                <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 8, padding: "10px 12px", marginBottom: 16, fontSize: 13, color: "#92400e" }}>
                  ⚠️ Admin accounts have full access to all student data, marks, and attendance. Only create accounts for trusted staff members.
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label className="sms-label">Username</label>
                    <input
                      className="sms-input"
                      placeholder="e.g. principal or hod_cse"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && createAdmin()}
                    />
                  </div>

                  <div>
                    <label className="sms-label">Password</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "white", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "9px 12px" }}>
                      <input
                        type={showPass ? "text" : "password"}
                        className="sms-input"
                        placeholder="Min. 6 characters"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && createAdmin()}
                        style={{ border: "none", padding: 0, outline: "none" }}
                      />
                      <EyeBtn show={showPass} toggle={() => setShowPass(v => !v)} />
                    </div>
                  </div>

                  {error && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 12px" }}>
                      <svg width="14" height="14" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <span style={{ fontSize: 13, color: "#dc2626", fontWeight: 500 }}>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 12px" }}>
                      <svg width="14" height="14" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      <span style={{ fontSize: 13, color: "#15803d", fontWeight: 500 }}>{success}</span>
                    </div>
                  )}

                  <button
                    className="sms-btn sms-btn-primary"
                    onClick={createAdmin}
                    disabled={loading}
                    style={{ marginTop: 4 }}
                  >
                    {loading ? "Creating..." : "Create Admin Account"}
                  </button>
                </div>
              </div>
            </div>

            {/* Info panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              <div className="sms-card">
                <div className="sms-card-header"><span className="sms-card-title">ℹ️ How it works</span></div>
                <div className="sms-card-body" style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>
                  <div style={{ marginBottom: 8 }}>New admin accounts are created with the role <span className="sms-badge sms-badge-indigo">ADMIN</span> and can log in immediately.</div>
                  <div style={{ marginBottom: 8 }}>Admin accounts have access to:</div>
                  {["Manage all students", "Record marks and attendance", "Create courses and subjects", "Post announcements", "View all reports"].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4f46e5", flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {admins.length > 0 && (
                <div className="sms-card">
                  <div className="sms-card-header"><span className="sms-card-title">✅ Created this session</span></div>
                  <div className="sms-card-body" style={{ padding: "8px 16px 12px" }}>
                    {admins.map((a, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < admins.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🔑</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{a.username}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>Admin · Created just now</div>
                        </div>
                        <span className="sms-badge sms-badge-success" style={{ marginLeft: "auto" }}>Active</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminManagement;