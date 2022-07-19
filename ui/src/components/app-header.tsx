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
          <Nav.Link href="/logout">Log-out</Nav.Link>
          <Avatar
            image={account.author_image}
            style={{ width: 40, height: 40 }}
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
    <Navbar style={{ marginBottom: 30 }} bg="dark" variant="dark">
      <Container>
        <Navbar.Brand
          style={{ marginBottom: 8 }}
          href="#"
          onClick={() => navigate("/")}
        >
          Post-it
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link style={{ marginBottom: 6 }} onClick={() => navigate("/")}>
            <img src={homeIcon} style={{ width: 40, height: 30 }} />
          </Nav.Link>
        </Nav>
        <SwitchButtons />
      </Container>
    </Navbar>
  );
}
export default AppHeader;
