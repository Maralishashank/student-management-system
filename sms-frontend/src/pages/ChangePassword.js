import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function ChangePassword() {

  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("student123");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    setError("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check token exists — Login.js stored the first-login JWT before navigating here
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Session expired. Please log in again.");
      navigate("/");
      return;
    }

    setLoading(true);

    try {
      // FIX: The token stored by Login.js on first-login is a real JWT (just short-lived,
      // 15 minutes). The api.js interceptor attaches it automatically as the Authorization
      // header, so this call is properly authenticated.
      // The backend's /auth/change-password reads the username from the token,
      // verifies the old password, sets the new one, and clears firstLogin=false.
      await API.post("/auth/change-password", {
        oldPassword,
        newPassword
      });

      // Clear the first-login token — the student must log in fresh with their new password
      localStorage.removeItem("token");

      alert("Password changed successfully! Please log in with your new password.");
      navigate("/");

    } catch (err) {
      // err.response.data.error will contain the actual message from GlobalExceptionHandler
      // e.g. "Old password incorrect"
      const msg = err.response?.data?.error || "Failed to change password. Please try again.";
      setError(msg);
    }

    setLoading(false);
  };

  return (
    <div style={{
      height: "100vh", display: "flex", justifyContent: "center", alignItems: "center",
      background: "linear-gradient(270deg, #667eea, #764ba2, #6b73ff)",
      backgroundSize: "400% 400%", animation: "gradientMove 10s ease infinite"
    }}>

      <div style={{
        width: "380px", padding: "35px", borderRadius: "20px",
        backdropFilter: "blur(15px)", background: "rgba(255,255,255,0.15)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)", color: "white"
      }}>

        <h3 style={{ textAlign: "center", marginBottom: "8px" }}>Set New Password</h3>
        <p style={{ textAlign: "center", fontSize: "14px", marginBottom: "24px", opacity: 0.85 }}>
          This is your first login. Please set a new password to continue.
        </p>

        <div style={inputWrapper}>
          <input
            type="password" placeholder="Current password (student123)"
            value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={inputWrapper}>
          <input
            type="password" placeholder="New password (min 6 characters)"
            value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={inputWrapper}>
          <input
            type="password" placeholder="Confirm new password"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        {error && (
          <p style={{ color: "#ffcccc", fontSize: "13px", marginBottom: "10px" }}>{error}</p>
        )}

        <button
          onClick={handleSubmit} disabled={loading}
          style={{
            width: "100%", padding: "12px", borderRadius: "10px",
            border: "none", background: "#ffffff", color: "#333",
            fontWeight: "600", cursor: "pointer", marginTop: "8px"
          }}
        >
          {loading ? "Saving..." : "Set Password & Continue"}
        </button>

      </div>

      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

const inputWrapper = {
  display: "flex", alignItems: "center", background: "#fff",
  borderRadius: "12px", padding: "12px", marginBottom: "15px"
};

const inputStyle = {
  flex: 1, border: "none", outline: "none",
  fontSize: "14px", marginLeft: "8px", background: "transparent", color: "#333"
};

export default ChangePassword;