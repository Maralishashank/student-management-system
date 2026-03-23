import { useEffect,useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";

function MyCourses(){

  const [courses,setCourses] = useState([]);

  const loadCourses = async () => {

    const res = await API.get("/enroll/my");

    setCourses(res.data);

  }

  useEffect(()=>{
    loadCourses();
  },[])

  return(

    <div>

      <Navbar/>

      <div className="d-flex">

        <StudentSidebar/>

        <div className="container mt-4">

          <h2>My Courses</h2>

          <table className="table table-bordered">

            <thead>

              <tr>
                <th>Course ID</th>
              </tr>

            </thead>

            <tbody>

              {courses.map(c => (

                <tr key={c.id}>
                  <td>{c.courseId}</td>
                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )

}

export default MyCourses;