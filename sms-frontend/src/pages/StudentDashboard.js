import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        <circle className="sms-ring-val" cx="60" cy="60" r={r}
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="sms-ring-label">
        {pct.toFixed(1)}<div className="sms-ring-sub">%</div>
      </div>
    </div>
  );
}

function StudentDashboard() {
  const navigate = useNavigate();
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      API.get("/marks/my"),
      API.get("/attendance/my"),
      API.get("/announcements"),
    ]).then(([m, a, n]) => {
      if (m.status === "fulfilled") setMarks(m.value.data);
      if (a.status === "fulfilled") setAttendance(a.value.data);
      if (n.status === "fulfilled") setAnnouncements(n.value.data);
      setLoading(false);
    });
  }, []);

  const avgScore = marks.length === 0 ? null
    : Math.round(marks.reduce((s, m) => s + (m.score / m.maxScore) * 100, 0) / marks.length);

  const grade = (pct) => {
    if (pct >= 90) return { letter: "A+", cls: "grade-a" };
    if (pct >= 80) return { letter: "A",  cls: "grade-a" };
    if (pct >= 70) return { letter: "B",  cls: "grade-b" };
    if (pct >= 60) return { letter: "C",  cls: "grade-c" };
    return              { letter: "D",  cls: "grade-d" };
  };

  return (
    <div className="sms-layout">
      <StudentSidebar />
      <div className="sms-main">
        <Navbar />
        <div className="sms-content">

          <div className="sms-page-header">
            <div className="sms-page-title">My Dashboard</div>
            <div className="sms-page-sub">Your academic summary at a glance.</div>
          </div>

          {loading ? <div className="sms-spinner" /> : (
            <>
              {/* Top stat cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
                <div className="sms-stat-card" onClick={() => navigate("/my-marks")} style={{ cursor: "pointer" }}>
                  <div className="sms-stat-icon indigo">🎯</div>
                  <div>
                    <div className="sms-stat-value">{avgScore !== null ? `${avgScore}%` : "—"}</div>
                    <div className="sms-stat-label">Avg Score</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{marks.length} subject(s)</div>
                  </div>
                </div>
                <div className="sms-stat-card" onClick={() => navigate("/my-attendance")} style={{ cursor: "pointer" }}>
                  <div className="sms-stat-icon green">✅</div>
                  <div>
                    <div className="sms-stat-value">{attendance ? `${attendance.percentage.toFixed(1)}%` : "—"}</div>
                    <div className="sms-stat-label">Attendance</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                      {attendance ? `${attendance.present}P / ${attendance.absent}A` : "No records"}
                    </div>
                  </div>
                </div>
                <div className="sms-stat-card" onClick={() => navigate("/student/announcements")} style={{ cursor: "pointer" }}>
                  <div className="sms-stat-icon amber">📢</div>
                  <div>
                    <div className="sms-stat-value">{announcements.length}</div>
                    <div className="sms-stat-label">Announcements</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Click to view all</div>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                {/* Attendance ring */}
                <div className="sms-card">
                  <div className="sms-card-header"><span className="sms-card-title">✅ Attendance</span></div>
                  <div className="sms-card-body" style={{ textAlign: "center" }}>
                    {attendance ? (
                      <>
                        <AttendanceRing pct={attendance.percentage} />
                        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16 }}>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 22, fontWeight: 800, color: "#10b981" }}>{attendance.present}</div>
                            <div style={{ fontSize: 11, color: "#64748b" }}>PRESENT</div>
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 22, fontWeight: 800, color: "#ef4444" }}>{attendance.absent}</div>
                            <div style={{ fontSize: 11, color: "#64748b" }}>ABSENT</div>
                          </div>
                        </div>
                      </>
                    ) : <div className="sms-empty"><div className="sms-empty-icon">📋</div><div className="sms-empty-text">No records yet</div></div>}
                  </div>
                </div>

                {/* Marks summary */}
                <div className="sms-card">
                  <div className="sms-card-header">
                    <span className="sms-card-title">🎯 Marks Summary</span>
                    <button className="sms-btn sms-btn-primary sms-btn-sm" onClick={() => navigate("/my-marks")}>View All</button>
                  </div>
                  <div className="sms-card-body" style={{ padding: "12px 16px" }}>
                    {marks.length === 0
                      ? <div className="sms-empty"><div className="sms-empty-icon">🎯</div><div className="sms-empty-text">No marks yet</div></div>
                      : marks.slice(0, 5).map((m, i) => {
                          const pct = Math.round((m.score / m.maxScore) * 100);
                          const g = grade(pct);
                          const barColor = pct >= 75 ? "green" : pct >= 50 ? "amber" : "red";
                          return (
                            <div key={i} style={{ marginBottom: 14 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                                <span style={{ fontWeight: 600, fontSize: 13 }}>{m.subject}</span>
                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                  <span style={{ fontSize: 12, color: "#64748b" }}>{m.score}/{m.maxScore}</span>
                                  <div className={`sms-grade ${g.cls}`}>{g.letter}</div>
                                </div>
                              </div>
                              <div className="sms-progress">
                                <div className={`sms-progress-bar ${barColor}`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                  </div>
                </div>

              </div>

              {/* Recent announcements */}
              {announcements.length > 0 && (
                <div className="sms-card" style={{ marginTop: 20 }}>
                  <div className="sms-card-header">
                    <span className="sms-card-title">📢 Recent Announcements</span>
                    <button className="sms-btn sms-btn-primary sms-btn-sm" onClick={() => navigate("/student/announcements")}>View All</button>
                  </div>
                  <div className="sms-card-body">
                    {announcements.slice(0, 3).map((a, i) => (
                      <div key={i} className="sms-announce-card">
                        <div className="sms-announce-title">{a.title}</div>
                        <div className="sms-announce-msg">{a.message}</div>
                        {a.createdDate && <div className="sms-announce-date">📅 {a.createdDate}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;