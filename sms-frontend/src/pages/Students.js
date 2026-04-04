import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Students() {

  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [search, setSearch] = useState("");

  const loadStudents = async () => {
    try {
      const res = await API.get("/students");
      // FIX: Added ?? [] fallback. If the API returns an unexpected shape or fails,
      //      students was set to undefined, causing .filter() to crash the page.
      setStudents(res.data.content ?? []);
    } catch (error) {
      console.error("Failed to load students:", error);
      setStudents([]);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const addStudent = async () => {

    if (!name.trim() || !email.trim() || !department) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await API.post("/students", { name, email, department });
      loadStudents();
      setName("");
      setEmail("");
      setDepartment("");
    } catch (error) {
      const msg = error.response?.data?.error || "Error adding student";
      alert(msg);
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await API.delete(`/students/${id}`);
      loadStudents();
    } catch (error) {
      alert("Error deleting student");
    }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="container mt-4">

          <h2 className="mb-3">Students</h2>

          <div className="card p-3 mb-4">
            <h5>Add Student</h5>
            <div className="row g-2">
              <div className="col">
                <input
                  className="form-control"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="col">
                <input
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="col">
                {/* FIX: Changed free-text input to a dropdown so department values
                         are always one of the three valid options the backend expects. */}
                <select
                  className="form-control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="">Select Department</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                </select>
              </div>
              <div className="col-auto">
                <button className="btn btn-primary" onClick={addStudent}>Add</button>
              </div>
            </div>
          </div>

          <input
            className="form-control mb-3"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.department}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteStudent(s.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default Students;