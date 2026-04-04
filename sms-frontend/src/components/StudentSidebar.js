import { Link } from "react-router-dom";

function StudentSidebar() {

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="bg-dark text-white p-3" style={{ width: "220px", height: "100vh" }}>

      <h4 className="text-center mb-4">Student Panel</h4>

      <ul className="nav flex-column">

        <li className="nav-item">
          <Link className="nav-link text-white" to="/student">Dashboard</Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/my-marks">My Marks</Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/my-attendance">My Attendance</Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/student/courses">Courses</Link>
        </li>

        {/* FIX: Profile and My Courses were raw <Link> elements placed directly
                 inside <ul> without <li> wrappers. This breaks Bootstrap's nav
                 structure and causes inconsistent padding and alignment.
                 Wrapped both in <li className="nav-item"> to match all other items. */}
        <li className="nav-item">
          <Link className="nav-link text-white" to="/my-courses">My Courses</Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/profile">Profile</Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/student/announcements">Announcements</Link>
        </li>

      </ul>

      <button className="btn btn-danger mt-3 w-100" onClick={logout}>
        Logout
      </button>

    </div>
  );
}

export default StudentSidebar;