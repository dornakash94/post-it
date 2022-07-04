import { Container, Nav, Navbar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { accountSelector } from "../store";

function AppHeader() {
  const account = useSelector(accountSelector);

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
        <Navbar.Brand href="#home">Post-it</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="#home">Home</Nav.Link>
        </Nav>
        <SwitchButtons />
      </Container>
    </Navbar>
  );
}
export default AppHeader;
