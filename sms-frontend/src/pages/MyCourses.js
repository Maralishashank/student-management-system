import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";
import "../styles/sms.css";

const DEPT_COLORS = { CSE: { bg: "#ede9fe", color: "#4338ca" }, IT: { bg: "#cffafe", color: "#164e63" }, ECE: { bg: "#fef3c7", color: "#92400e" } };

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([API.get("/enroll/my"), API.get("/courses")])
      .then(([e, c]) => {
        const map = {};
        c.data.forEach(x => { map[x.id] = x; });
        setCourses(e.data.map(en => ({ enrollmentId: en.id, ...map[en.courseId] })).filter(x => x.id));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="sms-layout">
      <StudentSidebar />
      <div className="sms-main">
        <Navbar />
        <div className="sms-content">
          <div className="sms-page-header">
            <div className="sms-page-title">My Courses</div>
            <div className="sms-page-sub">{courses.length} course(s) enrolled</div>
          </div>

          {loading ? <div className="sms-spinner" />
            : courses.length === 0
            ? (
              <div className="sms-card">
                <div className="sms-empty" style={{ padding: 60 }}>
                  <div className="sms-empty-icon">🎓</div>
                  <div className="sms-empty-text">You haven't enrolled in any courses yet.</div>
                  <div style={{ marginTop: 12 }}>
                    <a href="/student/courses" className="sms-btn sms-btn-primary" style={{ textDecoration: "none" }}>Browse Courses</a>
                  </div>
                </div>
              </div>
            )
            : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {courses.map(c => {
                  const dc = DEPT_COLORS[c.department] || { bg: "#f1f5f9", color: "#334155" };
                  return (
                    <div key={c.enrollmentId} className="sms-card" style={{ padding: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: dc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📘</div>
                        <span className="sms-badge" style={{ background: dc.bg, color: dc.color }}>{c.department}</span>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4, color: "#1e293b" }}>{c.name}</div>
                      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>👨‍🏫 {c.instructor}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span className="sms-badge sms-badge-indigo">🎓 {c.credits} Credits</span>
                        <span className="sms-badge sms-badge-success">✅ Enrolled</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default MyCourses;