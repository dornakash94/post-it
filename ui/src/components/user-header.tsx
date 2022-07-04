import { useSelector } from "react-redux";
import { accountSelector } from "../store";

function UserHeader() {
  const account = useSelector(accountSelector);

  if (!account) return <div />;

  return <div>You are currently logged in as {account.author}</div>;
}

export default UserHeader;
