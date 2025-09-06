import { Form, Button, Alert, Card } from 'react-bootstrap';

interface AuthFormProps {
  email: string;
  password: string;
  isRegistering: boolean;
  error: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  email,
  password,
  isRegistering,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onToggleMode,
}) => {
  return (
    <Card>
      <Card.Header className="text-center">
        <h3 className="mb-0">{isRegistering ? 'Create Account' : 'Sign In'}</h3>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              required
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" size="lg">
              {isRegistering ? 'Sign Up' : 'Sign In'}
            </Button>
          </div>
        </Form>

        <div className="text-center mt-3">
          <p className="mb-0">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Button variant="link" onClick={onToggleMode} className="p-0">
              {isRegistering ? 'Sign In' : 'Sign Up'}
            </Button>
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AuthForm;
