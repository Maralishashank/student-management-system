import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";
import "../styles/sms.css";

const initials = (n) => n ? n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?";

function Profile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/students/me")
      .then(r => setStudent(r.data))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="sms-layout">
      <StudentSidebar />
      <div className="sms-main">
        <Navbar />
        <div className="sms-content">
          <div className="sms-page-header">
            <div className="sms-page-title">My Profile</div>
            <div className="sms-page-sub">Your account information</div>
          </div>
          {loading ? <div className="sms-spinner" />
            : !student ? <div className="sms-empty"><div className="sms-empty-icon">👤</div><div className="sms-empty-text">Could not load profile</div></div>
            : (
              <div style={{ maxWidth: 480 }}>
                <div className="sms-card" style={{ overflow: "hidden" }}>
                  <div className="sms-profile-header">
                    <div className="sms-profile-avatar">{initials(student.name)}</div>
                    <div className="sms-profile-name">{student.name}</div>
                    <div className="sms-profile-dept">{student.department} Department</div>
                  </div>
                  <div className="sms-card-body">
                    {[
                      { label: "Full Name",   value: student.name,       icon: "👤", bg: "#ede9fe" },
                      { label: "Email",       value: student.email,      icon: "📧", bg: "#cffafe" },
                      { label: "Department",  value: student.department, icon: "🏛",  bg: "#fef3c7" },
                      { label: "Student ID",  value: `#${student.id}`,   icon: "🪪",  bg: "#d1fae5" },
                    ].map(r => (
                      <div key={r.label} className="sms-profile-row">
                        <div className="sms-profile-row-icon" style={{ background: r.bg }}>{r.icon}</div>
                        <div>
                          <div className="sms-profile-row-label">{r.label}</div>
                          <div className="sms-profile-row-value">{r.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Profile;