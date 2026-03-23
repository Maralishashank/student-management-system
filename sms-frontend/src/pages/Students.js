import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Students() {

  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [search,setSearch] = useState("");

  const loadStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data.content); // because backend returns Page
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const addStudent = async () => {

    try {

      await API.post("/students", {
        name,
        email,
        department
      });

      loadStudents();

      setName("");
      setEmail("");
      setDepartment("");

    } catch (error) {
      alert("Error adding student");
    }

  };

  const deleteStudent = async (id) => {

  if(!window.confirm("Delete this student?")) return;

  try{

    await API.delete(`/students/${id}`);

    loadStudents();

  }catch(error){

    alert("Error deleting student");

  }

}

return(

<div>

  <Navbar/>

  <div className="d-flex">

    <Sidebar/>

    <div className="container mt-4">

      <h2 className="mb-3">Students</h2>

      <div className="card p-3 mb-4">

        <h5>Add Student</h5>

        <div className="row">

          <div className="col">
            <input
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />
          </div>

          <div className="col">
            <input
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <div className="col">
            <input
              className="form-control"
              placeholder="Department"
              value={department}
              onChange={(e)=>setDepartment(e.target.value)}
            />
          </div>

          <div className="col">
            <button className="btn btn-primary" onClick={addStudent}>
              Add
            </button>
          </div>

        </div>

      </div>
      <input
  className="form-control mb-3"
  placeholder="Search student..."
  value={search}
  onChange={(e)=>setSearch(e.target.value)}
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

          {students
.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
.map((s)=>(

            <tr key={s.id}>

              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.department}</td>

              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={()=>deleteStudent(s.id)}
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

)
}

export default Students;