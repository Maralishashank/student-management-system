import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// FIX: New component — guards all protected routes.
// Without this, any unauthenticated user could navigate directly to /admin,
// /students, /marks etc. The API would return 401/403, but the page shell
// still rendered and showed an empty broken UI.
//
// Usage in App.js:
//   <Route path="/admin" element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>} />
//   <Route path="/student" element={<PrivateRoute role="STUDENT"><StudentDashboard /></PrivateRoute>} />
//   <Route path="/students" element={<PrivateRoute role="ADMIN"><Students /></PrivateRoute>} />
//   (and so on for every protected route)

function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Check token expiry
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/" replace />;
    }

    // If a specific role is required, enforce it
    if (role && decoded.role !== role) {
      // Redirect to the correct dashboard rather than login
      const correctPath = decoded.role === "ADMIN" ? "/admin" : "/student";
      return <Navigate to={correctPath} replace />;
    }

    return children;

  } catch (e) {
    // Token is malformed
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }
}

export default PrivateRoute;