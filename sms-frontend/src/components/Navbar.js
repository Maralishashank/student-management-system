import { jwtDecode } from "jwt-decode";
import "../styles/sms.css";

function Navbar() {
  let role = "";
  let username = "";
  try {
    const t = localStorage.getItem("token");
    if (t) { const d = jwtDecode(t); role = d.role; username = d.sub; }
  } catch {}

  return (
    <nav className="sms-navbar">
      <div className="sms-navbar-logo">
        <div className="sms-navbar-logo-icon">S</div>
        <span>SMS Portal</span>
      </div>
      <div className="sms-navbar-right">
        {username && (
          <>
            <span style={{ background: role === "ADMIN" ? "#ede9fe" : "#cffafe", color: role === "ADMIN" ? "#4338ca" : "#164e63", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
              {role}
            </span>
            <span style={{ fontWeight: 600, color: "#334155" }}>{username}</span>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;