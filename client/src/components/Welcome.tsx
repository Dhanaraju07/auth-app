import { Card, Button } from 'react-bootstrap';

interface WelcomeCardProps {
  email: string;
  onLogout: () => void;
}

const Welcome: React.FC<WelcomeCardProps> = ({ email, onLogout }) => {
  return (
    <Card>
      <Card.Header className="text-center">
        <h3 className="mb-0">Welcome!</h3>
      </Card.Header>
      <Card.Body className="text-center">
        <p>You are logged in as:</p>
        <h4 className="text-primary">{email}</h4>
        <Button variant="primary" onClick={onLogout} className="mt-3">
          Logout
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Welcome;
