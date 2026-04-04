import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import StudentSidebar from "../components/StudentSidebar";
import Navbar from "../components/Navbar";

function Courses() {

  const [courses, setCourses] = useState([]);
  const [name, setName] = useState("");
  const [instructor, setInstructor] = useState("");
  const [credits, setCredits] = useState("");
  const [department, setDepartment] = useState("");

  const location = useLocation();
  const isStudent = location.pathname.includes("/student");

  const loadCourses = async () => {
    try {
      // FIX: Removed pointless ternary — both branches called "/courses"
      const res = await API.get("/courses");
      setCourses(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const addCourse = async () => {

    if (!name.trim() || !instructor.trim() || !credits || !department) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await API.post("/courses", {
        name,
        instructor,
        // FIX: credits was sent as a string from the input value.
        //      The backend Course entity has `int credits`. While Jackson can coerce
        //      a numeric string like "3" to int, sending an empty string or "abc"
        //      would cause a 400 deserialization error with no clear message to the user.
        //      Explicitly converting to Number makes intent clear and fails fast.
        credits: Number(credits),
        department
      });
      setName("");
      setInstructor("");
      setCredits("");
      setDepartment("");
      loadCourses();
    } catch (error) {
      const msg = error.response?.data?.error || "Error adding course";
      alert(msg);
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await API.delete(`/courses/${id}`);
      loadCourses();
    } catch (error) {
      const msg = error.response?.data?.error || "Error deleting course";
      alert(msg);
    }
  };

  const enrollCourse = async (id) => {
    try {
      await API.post(`/enroll/${id}`);
      alert("Enrolled successfully!");
      loadCourses();
    } catch (error) {
      const msg = error.response?.data?.error || "Enrollment failed";
      alert(msg);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        {isStudent ? <StudentSidebar /> : <Sidebar />}
        <div className="container mt-4">

          <h2>Courses</h2>

          {!isStudent && (
            <div className="card p-3 mb-4">
              <h5>Add Course</h5>
              <div className="row g-2">
                <div className="col">
                  <input
                    className="form-control"
                    placeholder="Course Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="col">
                  <input
                    className="form-control"
                    placeholder="Instructor"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                  />
                </div>
                <div className="col">
                  <input
                    className="form-control"
                    placeholder="Credits"
                    type="number"
                    min="1"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                  />
                </div>
                <div className="col">
                  <select
                    className="form-control"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="">Department</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                  </select>
                </div>
                <div className="col-auto">
                  <button className="btn btn-primary" onClick={addCourse}>Add</button>
                </div>
              </div>
            </div>
          )}

          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Instructor</th>
                <th>Credits</th>
                <th>Department</th>
                {!isStudent && <th>Action</th>}
                {isStudent && <th>Enroll</th>}
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.instructor}</td>
                  <td>{c.credits}</td>
                  <td>{c.department}</td>
                  {!isStudent && (
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteCourse(c.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                  {isStudent && (
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => enrollCourse(c.id)}
                      >
                        Enroll
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default Courses;