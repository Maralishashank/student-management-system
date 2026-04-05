// Marks.js - Admin page
import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/sms.css";

function Marks() {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [loading, setLoading] = useState(true);

  const loadMarks    = () => API.get("/marks").then(r => setMarks(r.data)).catch(console.log);
  const loadStudents = () => API.get("/students").then(r => setStudents(r.data.content ?? [])).catch(console.log);

  useEffect(() => { Promise.all([loadMarks(), loadStudents()]).finally(() => setLoading(false)); }, []);

  const onStudentChange = async (e) => {
    const id = e.target.value;
    setStudentId(id); setSubject(""); setSubjects([]);
    const s = students.find(s => s.id === Number(id));
    if (s) {
      try { const r = await API.get(`/subjects/department/${s.department}`); setSubjects(r.data); }
      catch {}
    }
  };

  const add = async () => {
    if (!studentId || !subject || !score || !maxScore) return alert("Fill in all fields.");
    try {
      await API.post("/marks", { studentId: Number(studentId), subject, score: Number(score), maxScore: Number(maxScore) });
      setStudentId(""); setSubject(""); setScore(""); setMaxScore(""); setSubjects([]);
      loadMarks();
      alert("Marks added successfully!");
    } catch (e) { alert(e.response?.data?.error || "Error adding marks"); }
  };

  const pct = (m) => m.maxScore > 0 ? Math.round((m.score / m.maxScore) * 100) : 0;
  const gradeLetter = (p) => p >= 90 ? "A+" : p >= 80 ? "A" : p >= 70 ? "B" : p >= 60 ? "C" : "D";
  const gradeCls    = (p) => p >= 70 ? "grade-a" : p >= 60 ? "grade-b" : p >= 50 ? "grade-c" : "grade-d";

  return (
    <div className="sms-layout">
      <Sidebar />
      <div className="sms-main">
        <Navbar />
        <div className="sms-content">
          <div className="sms-page-header">
            <div className="sms-page-title">Marks Management</div>
            <div className="sms-page-sub">Record and view student subject scores</div>
          </div>

          <div className="sms-card" style={{ marginBottom: 20 }}>
            <div className="sms-card-header"><span className="sms-card-title">➕ Add Marks</span></div>
            <div className="sms-card-body">
              <div className="sms-form-row">
                <div className="sms-form-group">
                  <label className="sms-label">Student</label>
                  <select className="sms-select" value={studentId} onChange={onStudentChange}>
                    <option value="">Select student</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.department})</option>)}
                  </select>
                </div>
                <div className="sms-form-group">
                  <label className="sms-label">Subject</label>
                  <select className="sms-select" value={subject} onChange={e => setSubject(e.target.value)} disabled={!subjects.length}>
                    <option value="">{studentId ? "Select subject" : "Select student first"}</option>
                    {subjects.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="sms-form-group" style={{ maxWidth: 110 }}>
                  <label className="sms-label">Score</label>
                  <input className="sms-input" type="number" min="0" placeholder="0" value={score} onChange={e => setScore(e.target.value)} />
                </div>
                <div className="sms-form-group" style={{ maxWidth: 110 }}>
                  <label className="sms-label">Max Score</label>
                  <input className="sms-input" type="number" min="1" placeholder="100" value={maxScore} onChange={e => setMaxScore(e.target.value)} />
                </div>
                <div style={{ alignSelf: "flex-end" }}>
                  <button className="sms-btn sms-btn-primary" onClick={add}>Add Marks</button>
                </div>
              </div>
            </div>
          </div>

          <div className="sms-card">
            <div className="sms-card-header"><span className="sms-card-title">📋 All Marks</span></div>
            <div className="sms-table-wrap">
              {loading ? <div className="sms-spinner" />
                : marks.length === 0
                ? <div className="sms-empty"><div className="sms-empty-icon">🎯</div><div className="sms-empty-text">No marks recorded yet</div></div>
                : (
                  <table className="sms-table">
                    <thead><tr><th>Student ID</th><th>Subject</th><th>Score</th><th>Percentage</th><th>Grade</th></tr></thead>
                    <tbody>
                      {marks.map((m, i) => {
                        const p = pct(m);
                        return (
                          <tr key={i}>
                            <td style={{ fontWeight: 600, color: "#64748b" }}>#{m.studentId}</td>
                            <td style={{ fontWeight: 600 }}>{m.subject}</td>
                            <td>{m.score} / {m.maxScore}</td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div className="sms-progress" style={{ width: 80 }}>
                                  <div className={`sms-progress-bar ${p >= 75 ? "green" : p >= 50 ? "amber" : "red"}`} style={{ width: `${p}%` }} />
                                </div>
                                <span style={{ fontSize: 12, fontWeight: 700 }}>{p}%</span>
                              </div>
                            </td>
                            <td><div className={`sms-grade ${gradeCls(p)}`}>{gradeLetter(p)}</div></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Marks;