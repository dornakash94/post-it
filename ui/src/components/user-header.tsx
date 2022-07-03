import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Account } from "../generated/swagger/post-it";

function UserHeader() {
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const account: Account = JSON.parse(localStorage.getItem("account")!);

  return (
    <div>
      You are currently logged in as {account.author}
      <Button onClick={() => navigate("/logout")}>logout</Button>
    </div>
  );
  //TODO -> if not login redirect to index
}

export default UserHeader;
