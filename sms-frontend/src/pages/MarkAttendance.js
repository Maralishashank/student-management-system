import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MarkAttendance() {

  const [department, setDepartment] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const loadStudents = async () => {
    if (!department) return;
    try {
      const res = await API.get(`/students/department/${department}`);
      setStudents(res.data);
      setAttendance({}); // reset selections when department changes
    } catch (err) {
      console.error("Failed to load students:", err);
      setStudents([]);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [department]);

  const toggleAttendance = (id, status) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const submitAttendance = async () => {

    const unmarked = students.filter(s => !attendance[s.id]);
    if (unmarked.length > 0) {
      alert(`Please mark attendance for all students. ${unmarked.length} student(s) not marked.`);
      return;
    }

    setSubmitting(true);
    const today = new Date().toISOString().split("T")[0];

    try {
      for (const studentId in attendance) {
        await API.post("/attendance/mark", {
          // FIX: Object.keys() always returns strings, but the backend Attendance
          //      entity maps studentId to Long. Sending a string worked via JSON
          //      coercion but is fragile. Explicitly parse to Number to be safe.
          studentId: Number(studentId),
          date: today,
          status: attendance[studentId]
        });
      }
      alert("Attendance marked successfully!");
      setAttendance({});
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to submit attendance. Please try again.";
      alert(msg);
    }

    setSubmitting(false);
  };

  const allMarked = students.length > 0 && students.every(s => attendance[s.id]);

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="container mt-4">

          <h2>Mark Attendance</h2>

          <select
            className="form-control mb-4"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
          </select>

          {students.length === 0 && department && (
            <p className="text-muted">No students found for {department}.</p>
          )}

          {students.length > 0 && (
            <>
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Present</th>
                    <th>Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id} style={{
                      background: attendance[s.id] === "PRESENT"
                        ? "#e8f5e9"
                        : attendance[s.id] === "ABSENT"
                        ? "#ffebee"
                        : "white"
                    }}>
                      <td>{s.name}</td>
                      <td>
                        <input
                          type="radio"
                          name={`att-${s.id}`}
                          checked={attendance[s.id] === "PRESENT"}
                          onChange={() => toggleAttendance(s.id, "PRESENT")}
                        />
                      </td>
                      <td>
                        <input
                          type="radio"
                          name={`att-${s.id}`}
                          checked={attendance[s.id] === "ABSENT"}
                          onChange={() => toggleAttendance(s.id, "ABSENT")}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="d-flex align-items-center gap-3">
                <button
                  className="btn btn-primary"
                  onClick={submitAttendance}
                  disabled={submitting || !allMarked}
                >
                  {submitting ? "Submitting..." : "Submit Attendance"}
                </button>
                {!allMarked && (
                  <span className="text-muted" style={{ fontSize: "13px" }}>
                    Mark all students before submitting
                  </span>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default MarkAttendance;