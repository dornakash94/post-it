import { useDispatch } from "react-redux";
import { logout } from "../../store/reducers/user-reducer";

function Logout() {
  const dispatch = useDispatch();

  localStorage.clear();

  dispatch(logout());

  return (
    <div>
      <p>Logout in process</p>
    </div>
  );
}

export default Logout;
