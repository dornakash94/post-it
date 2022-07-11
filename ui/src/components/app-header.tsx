import { Container, Nav, Navbar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { accountSelector } from "../store";
import { useNavigate } from "react-router-dom";

function AppHeader() {
  const account = useSelector(accountSelector);
  const navigate = useNavigate();

  const SwitchButtons = () => {
    if (account) {
      return (
        <Nav>
          <Nav.Link href="/logout">Log-out</Nav.Link>
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
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#" onClick={() => navigate("/")}>
          Post-it
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
        </Nav>
        <SwitchButtons />
      </Container>
    </Navbar>
  );
}
export default AppHeader;
