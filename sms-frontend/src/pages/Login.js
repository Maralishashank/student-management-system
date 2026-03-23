import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login(){

  const navigate = useNavigate();

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [dark,setDark] = useState(true);

  const handleLogin = async () => {

    setLoading(true);
    setError("");

    try{

      const res = await API.post("/auth/login",{
        username,
        password
      });

      console.log("login response:", res.data);

      const token =
        typeof res.data === "string"
          ? res.data
          : res.data.token || res.data.jwt || res.data.accessToken;

      if(!token){
        throw new Error("Token not found in login response");
      }

      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      console.log("decoded token:", decoded);

      const isAdmin =
        decoded.role === "ADMIN" ||
        decoded.role === "ROLE_ADMIN" ||
        (Array.isArray(decoded.roles) && decoded.roles.includes("ADMIN")) ||
        (Array.isArray(decoded.roles) && decoded.roles.includes("ROLE_ADMIN")) ||
        (Array.isArray(decoded.authorities) && decoded.authorities.includes("ADMIN")) ||
        (Array.isArray(decoded.authorities) && decoded.authorities.includes("ROLE_ADMIN"));

      navigate(isAdmin ? "/admin" : "/student");

    }catch(err){
      console.log("login error:", err.response?.data || err.message);
      setError("Invalid username or password");
    }

    setLoading(false);
  };

  return(

    <div style={{
      height:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      background: dark
        ? "linear-gradient(270deg, #667eea, #764ba2, #6b73ff)"
        : "linear-gradient(270deg, #f5f7fa, #c3cfe2)",
      backgroundSize:"400% 400%",
      animation:"gradientMove 10s ease infinite"
    }}>

      <button
        onClick={()=>setDark(!dark)}
        style={{
          position:"absolute",
          top:"20px",
          right:"20px",
          border:"none",
          padding:"8px 12px",
          borderRadius:"8px",
          cursor:"pointer"
        }}
      >
        {dark ? "🌙" : "☀️"}
      </button>

      <div style={{
        width:"360px",
        padding:"35px",
        borderRadius:"20px",
        backdropFilter:"blur(15px)",
        background: dark
          ? "rgba(255,255,255,0.15)"
          : "rgba(255,255,255,0.9)",
        boxShadow:"0 8px 32px rgba(0,0,0,0.25)",
        color: dark ? "white" : "#333",
        transition:"0.3s"
      }}>

        <h3 style={{textAlign:"center",marginBottom:"10px"}}>
          Student Portal
        </h3>

        <p style={{textAlign:"center",fontSize:"14px",marginBottom:"25px"}}>
          Sign in to continue
        </p>

        <div style={inputWrapper}>
          <span>👤</span>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={inputWrapper}>
          <span>🔒</span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            style={inputStyle}
          />
          <span
            onClick={()=>setShowPassword(!showPassword)}
            style={{cursor:"pointer"}}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {error && (
          <p style={{
            color:"red",
            fontSize:"13px",
            marginBottom:"10px"
          }}>
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width:"100%",
            padding:"12px",
            borderRadius:"10px",
            border:"none",
            background:"#ffffff",
            color:"#333",
            fontWeight:"600",
            cursor:"pointer",
            marginTop:"10px",
            transition:"0.3s"
          }}
          onMouseOver={(e)=>e.target.style.background="#ddd"}
          onMouseOut={(e)=>e.target.style.background="#fff"}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>

      <style>
        {`
        @keyframes gradientMove {
          0% {background-position:0% 50%;}
          50% {background-position:100% 50%;}
          100% {background-position:0% 50%;}
        }
        `}
      </style>

    </div>

  )
}

const inputWrapper = {
  display:"flex",
  alignItems:"center",
  background:"#fff",
  borderRadius:"12px",
  padding:"12px",
  marginBottom:"15px",
  boxShadow:"0 2px 6px rgba(0,0,0,0.1)"
};

const inputStyle = {
  flex:1,
  border:"none",
  outline:"none",
  fontSize:"14px",
  marginLeft:"8px",
  marginRight:"8px",
  background:"transparent"
};

export default Login;