import { Link } from "react-router-dom";

function Sidebar(){

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href="/";
  }

  return(

    <div className="bg-dark text-white p-3" style={{width:"220px", height:"100vh"}}>

      <h4 className="text-center mb-4">Admin Panel</h4>

      <ul className="nav flex-column">

        <li className="nav-item">
<Link className="nav-link text-white" to="/admin">Dashboard</Link>
</li>

<li className="nav-item">
<Link className="nav-link text-white" to="/students">Students</Link>
</li>

<li className="nav-item">
<Link className="nav-link text-white" to="/courses">Courses</Link>
</li>

<li className="nav-item">
<Link className="nav-link text-white" to="/marks">Marks</Link>
</li>

<li className="nav-item">
<Link className="nav-link text-white" to="/mark-attendance">Mark Attendance</Link>
</li>

<li className="nav-item">
<Link className="nav-link text-white" to="/announcements">Announcements</Link>
</li>

<li className="nav-item">
<Link className="nav-link text-white" to="/attendance">Attendance Report</Link>
</li>
     
<br></br>
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>

      </ul>

    </div>

  )
}

export default Sidebar;