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

  // Load courses
  const loadCourses = async () => {

    try{

      const res = await API.get(isStudent ? "/courses" : "/courses");

      setCourses(res.data);

    }catch(error){

      console.error(error);

    }

  };

  useEffect(()=>{

    loadCourses();

  },[]);

  // Add course (Admin)
  const addCourse = async () => {

    try{

      await API.post("/courses",{
        name,
        instructor,
        credits,
        department
      });

      setName("");
      setInstructor("");
      setCredits("");
      setDepartment("");

      loadCourses();

    }catch(error){

      alert("Error adding course");

    }

  };

  // Delete course (Admin)
  const deleteCourse = async (id) => {

    if(!window.confirm("Delete this course?")) return;

    try{

      await API.delete(`/courses/${id}`);

      loadCourses();

    }catch(error){

      alert("Error deleting course");

    }

  };

  // Enroll course (Student)
  const enrollCourse = async (id) => {

    try{

      await API.post(`/enroll/${id}`);

      alert("Enrolled successfully");

      loadCourses();

    }catch(error){

      alert("Enrollment failed");

    }

  };

  return(

    <div>

      <Navbar/>

      <div className="d-flex">

        {isStudent ? <StudentSidebar/> : <Sidebar/>}

        <div className="container mt-4">

          <h2>Courses</h2>

          {/* Admin Add Course Form */}

          {!isStudent && (

          <div className="card p-3 mb-4">

            <h5>Add Course</h5>

            <div className="row">

              <div className="col">

                <input
                  className="form-control"
                  placeholder="Course Name"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                />

              </div>

              <div className="col">

                <input
                  className="form-control"
                  placeholder="Instructor"
                  value={instructor}
                  onChange={(e)=>setInstructor(e.target.value)}
                />

              </div>

              <div className="col">

                <input
                  className="form-control"
                  placeholder="Credits"
                  value={credits}
                  onChange={(e)=>setCredits(e.target.value)}
                />

              </div>

              <div className="col">

                <select
                  className="form-control"
                  value={department}
                  onChange={(e)=>setDepartment(e.target.value)}
                >

                  <option value="">Department</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>

                </select>

              </div>

              <div className="col">

                <button
                  className="btn btn-primary"
                  onClick={addCourse}
                >

                  Add

                </button>

              </div>

            </div>

          </div>

          )}

          {/* Courses Table */}

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

              {courses.map((c)=>(

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
                        onClick={()=>deleteCourse(c.id)}
                      >

                        Delete

                      </button>

                    </td>

                  )}

                  {isStudent && (

                    <td>

                      <button
                        className="btn btn-success btn-sm"
                        onClick={()=>enrollCourse(c.id)}
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

  )

}

export default Courses;