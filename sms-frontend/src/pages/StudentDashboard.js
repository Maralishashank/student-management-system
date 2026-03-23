import Navbar from "../components/Navbar";
import StudentSidebar from "../components/StudentSidebar";

function StudentDashboard(){

  return(

    <div>

      <Navbar/>

      <div className="d-flex">

        <StudentSidebar/>

        <div className="container mt-4">

          <h2>Student Dashboard</h2>

          <div className="row">

            <div className="col-md-4">
              <div className="card text-center p-3">
                <h5>My Marks</h5>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-center p-3">
                <h5>Attendance</h5>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-center p-3">
                <h5>Announcements</h5>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>

  )

}

export default StudentDashboard;