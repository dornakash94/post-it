import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { accountSelector } from "../store";
import Home from "./pages/home";
import Login from "./pages/login";
import Logout from "./pages/logout";
import NotFound from "./pages/not-found";
import Register from "./pages/register";

interface EnforcerProps {
  Component: React.FC;
}

function AppBody() {
  const TokenEnforcer = ({ Component }: EnforcerProps) => {
    const location = useLocation();
    const account = useSelector(accountSelector);

    return account ? (
      <div>
        <Component />
      </div>
    ) : (
      <Navigate to="/login" replace state={{ from: location }} />
    );
  };

  const NoTokenEnforcer = ({ Component }: EnforcerProps) => {
    const account = useSelector(accountSelector);
    return account ? <Navigate to="/" /> : <Component />;
  };

  return (
    <div className="App-body">
      <Routes>
        <Route path="/" element={<TokenEnforcer Component={Home} />} />
        <Route
          path="/register"
          element={<NoTokenEnforcer Component={Register} />}
        />
        <Route path="/login" element={<NoTokenEnforcer Component={Login} />} />
        <Route path="/logout" element={<TokenEnforcer Component={Logout} />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate replace to="/404" />} />
      </Routes>
    </div>
  );
}

export default AppBody;
