import { Container, Nav, Navbar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { accountSelector } from "../store";
import { useNavigate } from "react-router-dom";
import Avatar from "./avatar";
import homeIcon from "../resources/home-icon.jpg";

function AppHeader() {
  const account = useSelector(accountSelector);
  const navigate = useNavigate();

  const SwitchButtons = () => {
    if (account) {
      return (
        <Nav>
          <Nav.Link href="/logout">Logout</Nav.Link>
          <Avatar
            image={account.author_image}
            className="avatar-image-icon avatar-image-header"
          />
        </Nav>
      );
    } else {
      return (
        <Nav>
          <Nav.Link href="/login">Login</Nav.Link>
          <Nav.Link href="/register">Sign-up</Nav.Link>
        </Nav>
      );
    }
  };

  return (
    <Navbar variant="dark" className="App-header" fixed="top">
      <Container
        style={{
          maxWidth: 9000,
        }}
      >
        <Navbar.Brand>
          <img
            src={homeIcon}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>
        <SwitchButtons />
      </Container>
    </Navbar>
  );
}
export default AppHeader;
