import { Container, Navbar, Nav, Button } from 'react-bootstrap';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>Welcome to Auth App</Navbar.Brand>
        <Nav className="ms-auto">
          <Button variant="outline-light" onClick={onLogout}>
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
