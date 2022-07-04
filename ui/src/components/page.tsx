import { useSelector } from "react-redux";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { accountSelector } from "../store";
import Home from "./pages/home";
import Login from "./pages/login";
import Logout from "./pages/logout";
import NotFound from "./pages/not-found";
import Register from "./pages/register";
import UserHeader from "./user-header";

function Page() {
  const TokenEnforcer = ({ Component }: { Component: React.FC }) => {
    const location = useLocation();
    const account = useSelector(accountSelector);

    return account ? (
      <div>
        <UserHeader />
        <Component />
      </div>
    ) : (
      <Navigate to="/register" replace state={{ from: location }} />
    );
  };

  const NoTokenEnforcer = ({ Component }: { Component: React.FC }) => {
    const account = useSelector(accountSelector);
    return account ? <Navigate to="/" /> : <Component />;
  };

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default Page;
