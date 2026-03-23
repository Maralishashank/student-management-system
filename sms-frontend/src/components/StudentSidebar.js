import { Link } from "react-router-dom";

function StudentSidebar(){

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href="/";
  }

  return(

    <div className="bg-dark text-white p-3" style={{width:"220px",height:"100vh"}}>

      <h4 className="text-center mb-4">Student Panel</h4>

      <ul className="nav flex-column">

        <li className="nav-item">
          <Link className="nav-link text-white" to="/student">
            Dashboard
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/my-marks">
            My Marks
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/my-attendance">
            My Attendance
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/student/courses">
            Courses
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/student/announcements">
            Announcements
          </Link>
        </li>

        <Link className="nav-link text-white" to="/profile">
Profile
</Link>

<Link className="nav-link text-white" to="/my-courses">
My Courses
</Link>

        <button className="btn btn-danger mt-3" onClick={logout}>
          Logout
        </button>

      </ul>

    </div>

  )

}

export default StudentSidebar;