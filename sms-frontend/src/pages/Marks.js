import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Marks() {

  const [marks, setMarks] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const loadMarks = async () => {
    try {
      const res = await API.get("/marks");
      setMarks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await API.get("/students");
      // FIX: Added ?? [] null guard — same crash risk as in Students.js
      setStudents(res.data.content ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadMarks();
    loadStudents();
  }, []);

  const handleStudentChange = async (e) => {
    const id = e.target.value;
    setStudentId(id);
    setSubject("");
    setSubjects([]);

    // FIX: The original code used strict equality (s.id === id).
    //      e.target.value is always a string, but s.id from the API is a number.
    //      Strict equality between "5" and 5 is false, so student was always
    //      undefined and subjects never loaded.
    //      Fixed by converting id to a Number before comparing.
    const student = students.find(s => s.id === Number(id));

    if (student) {
      try {
        const res = await API.get(`/subjects/department/${student.department}`);
        setSubjects(res.data);
      } catch (err) {
        console.log("Failed to load subjects:", err);
      }
    }
  };

  const addMarks = async () => {

    if (!studentId || !subject || !score || !maxScore) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await API.post("/marks", {
        // FIX: Send as numbers not strings — the backend entity expects Long/int
        studentId: Number(studentId),
        subject,
        score: Number(score),
        maxScore: Number(maxScore)
      });
      loadMarks();
      alert("Marks added");
      setStudentId("");
      setSubject("");
      setScore("");
      setMaxScore("");
      setSubjects([]);
    } catch (error) {
      const msg = error.response?.data?.error || "Error adding marks";
      alert(msg);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="container mt-4">

          <h2>Marks</h2>

          <div className="card p-3 mb-4">
            <h5>Add Marks</h5>
            <div className="row g-2">

              <div className="col">
                <select
                  className="form-control"
                  value={studentId}
                  onChange={handleStudentChange}
                >
                  <option value="">Select Student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col">
                <select
                  className="form-control"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={subjects.length === 0}
                >
                  <option value="">
                    {studentId ? "Select Subject" : "Select student first"}
                  </option>
                  {subjects.map((sub, i) => (
                    <option key={i} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col">
                <input
                  className="form-control"
                  placeholder="Score"
                  type="number"
                  min="0"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
              </div>

              <div className="col">
                <input
                  className="form-control"
                  placeholder="Max Score"
                  type="number"
                  min="1"
                  value={maxScore}
                  onChange={(e) => setMaxScore(e.target.value)}
                />
              </div>

              <div className="col-auto">
                <button className="btn btn-primary" onClick={addMarks}>Add</button>
              </div>

            </div>
          </div>

          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Student ID</th>
                <th>Subject</th>
                <th>Score</th>
                <th>Max Score</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m, i) => (
                <tr key={i}>
                  <td>{m.studentId}</td>
                  <td>{m.subject}</td>
                  <td>{m.score}</td>
                  <td>{m.maxScore}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default Marks;