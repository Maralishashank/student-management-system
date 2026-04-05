import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";
import "../styles/sms.css";

const grade = (pct) => {
  if (pct >= 90) return { letter: "A+", cls: "grade-a" };
  if (pct >= 80) return { letter: "A",  cls: "grade-a" };
  if (pct >= 70) return { letter: "B",  cls: "grade-b" };
  if (pct >= 60) return { letter: "C",  cls: "grade-c" };
  return              { letter: "D",  cls: "grade-d" };
};

function MyMarks() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/marks/my")
      .then(r => setData(r.data))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const avg = data.length === 0 ? null
    : Math.round(data.reduce((s, m) => s + (m.score / m.maxScore) * 100, 0) / data.length);

  return (
    <div className="sms-layout">
      <StudentSidebar />
      <div className="sms-main">
        <Navbar />
        <div className="sms-content">

          <div className="sms-page-header">
            <div className="sms-page-title">My Marks</div>
            <div className="sms-page-sub">Subject-wise performance breakdown</div>
          </div>

          {avg !== null && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 24 }}>
              <div className="sms-stat-card">
                <div className="sms-stat-icon indigo">🎯</div>
                <div><div className="sms-stat-value">{avg}%</div><div className="sms-stat-label">Overall Avg</div></div>
              </div>
              <div className="sms-stat-card">
                <div className="sms-stat-icon green">📚</div>
                <div><div className="sms-stat-value">{data.length}</div><div className="sms-stat-label">Subjects</div></div>
              </div>
              <div className="sms-stat-card">
                <div className="sms-stat-icon amber">⭐</div>
                <div>
                  <div className="sms-stat-value">{grade(avg).letter}</div>
                  <div className="sms-stat-label">Overall Grade</div>
                </div>
              </div>
            </div>
          )}

          <div className="sms-card">
            <div className="sms-card-header"><span className="sms-card-title">📋 Subject Scores</span></div>
            {loading
              ? <div className="sms-spinner" />
              : data.length === 0
              ? <div className="sms-empty"><div className="sms-empty-icon">🎯</div><div className="sms-empty-text">No marks recorded yet</div></div>
              : (
                <div style={{ padding: "8px 20px 16px" }}>
                  {data.map((m, i) => {
                    const pct = Math.round((m.score / m.maxScore) * 100);
                    const g = grade(pct);
                    const barColor = pct >= 75 ? "green" : pct >= 50 ? "amber" : "red";
                    return (
                      <div key={i} style={{ padding: "14px 0", borderBottom: i < data.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontWeight: 700, fontSize: 14 }}>{m.subject}</span>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <span style={{ fontSize: 13, color: "#64748b" }}>{m.score} / {m.maxScore}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>{pct}%</span>
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
              )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default MyMarks;