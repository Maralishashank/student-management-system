// MyAttendance.js
import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";
import "../styles/sms.css";

function AttendanceRing({ pct }) {
  const r = 52, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 75 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="sms-ring-wrap">
      <svg className="sms-ring-svg" width="120" height="120" viewBox="0 0 120 120">
        <circle className="sms-ring-bg" cx="60" cy="60" r={r} />
        <circle className="sms-ring-val" cx="60" cy="60" r={r} stroke={color}
          strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="sms-ring-label">{pct.toFixed(1)}<div className="sms-ring-sub">%</div></div>
    </div>
  );
}

export function MyAttendance() {
  const [att, setAtt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/attendance/my")
      .then(r => setAtt(r.data))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const statusColor = att ? (att.percentage >= 75 ? "#10b981" : att.percentage >= 50 ? "#f59e0b" : "#ef4444") : "#64748b";
  const statusText  = att ? (att.percentage >= 75 ? "Good Standing" : att.percentage >= 50 ? "Needs Improvement" : "Low Attendance") : "";

  return (
    <div className="sms-layout">
      <StudentSidebar />
      <div className="sms-main">
        <Navbar />
        <div className="sms-content">
          <div className="sms-page-header">
            <div className="sms-page-title">My Attendance</div>
            <div className="sms-page-sub">Track your presence and absence records</div>
          </div>
          {loading ? <div className="sms-spinner" />
            : !att ? <div className="sms-empty"><div className="sms-empty-icon">📋</div><div className="sms-empty-text">No attendance records found</div></div>
            : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div className="sms-card">
                  <div className="sms-card-header"><span className="sms-card-title">📊 Attendance Rate</span></div>
                  <div className="sms-card-body" style={{ textAlign: "center", padding: "28px 20px" }}>
                    <AttendanceRing pct={att.percentage} />
                    <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 20, padding: "4px 14px" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: statusColor }}>{statusText}</span>
                    </div>
                  </div>
                </div>
                <div className="sms-card">
                  <div className="sms-card-header"><span className="sms-card-title">📋 Breakdown</span></div>
                  <div className="sms-card-body">
                    {[
                      { label: "Days Present", value: att.present, color: "#10b981", bg: "#d1fae5", icon: "✅" },
                      { label: "Days Absent",  value: att.absent,  color: "#ef4444", bg: "#fee2e2", icon: "❌" },
                      { label: "Total Days",   value: att.present + att.absent, color: "#4f46e5", bg: "#ede9fe", icon: "📅" },
                    ].map(r => (
                      <div key={r.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f1f5f9" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{r.icon}</div>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{r.label}</span>
                        </div>
                        <span style={{ fontSize: 24, fontWeight: 800, color: r.color }}>{r.value}</span>
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

export default MyAttendance;