import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";

function MyMarks() {

  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMarks = async () => {
    try {
      const res = await API.get("/marks/my");
      setMarks(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarks();
  }, []);

  // FIX: Compute percentage for each subject to display alongside raw score
  const withPercentage = marks.map(m => ({
    ...m,
    percentage: m.maxScore > 0 ? ((m.score / m.maxScore) * 100).toFixed(1) : "—"
  }));

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <StudentSidebar />
        <div className="container mt-4">

          <h2>My Marks</h2>

          {loading && <p className="text-muted">Loading...</p>}

          {!loading && marks.length === 0 && (
            <p className="text-muted">No marks recorded yet.</p>
          )}

          {!loading && marks.length > 0 && (
            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Subject</th>
                  <th>Score</th>
                  <th>Max Score</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {withPercentage.map((m, i) => (
                  <tr key={i}>
                    <td>{m.subject}</td>
                    <td>{m.score}</td>
                    <td>{m.maxScore}</td>
                    <td>{m.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </div>
  );
}

export default MyMarks;