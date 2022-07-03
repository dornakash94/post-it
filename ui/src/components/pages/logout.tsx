import { Navigate, useLocation } from "react-router-dom";

function Logout() {
  const location = useLocation();

  localStorage.clear();

  const locationState = location.state as { from?: string };
  const from = locationState?.from || "/";

  return (
    <div>
      <p>Logout in process</p>
      <Navigate to={from} />
    </div>
  );
}

export default Logout;
