import { useState } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";

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
  // Local validation state
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  // Email validation
  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    // Simple regex for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Invalid email format";
    return "";
  };

  // Password validation
  // Password requirements
  const passwordRequirements = [
    {
      label: "At least 8 characters",
      test: (v: string) => v.length >= 8,
    },
    {
      label: "At least one uppercase letter",
      test: (v: string) => /[A-Z]/.test(v),
    },
    {
      label: "At least one lowercase letter",
      test: (v: string) => /[a-z]/.test(v),
    },
    {
      label: "At least one number",
      test: (v: string) => /[0-9]/.test(v),
    },
    {
      label: "At least one symbol",
      test: (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v),
    },
  ];

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    for (const req of passwordRequirements) {
      if (!req.test(value)) return req.label;
    }
    return "";
  };

  // Handlers
  const handleEmailChange = (value: string) => {
    setEmailError(validateEmail(value));
    onEmailChange(value);
  };

  const [passwordFocused, setPasswordFocused] = useState(false);

  const handlePasswordChange = (value: string) => {
    setPasswordError(validatePassword(value));
    onPasswordChange(value);
  };

  // Validate on submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    if (emailErr || passwordErr) return;
    onSubmit(e);
  };

  return (
    <Card>
      <Card.Header className="text-center">
        <h3 className="mb-0">{isRegistering ? "Create Account" : "Sign In"}</h3>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              isInvalid={!!emailError}
              required
            />
            {emailError && (
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              isInvalid={!!passwordError}
              required
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            {passwordFocused &&
              passwordRequirements.some((req) => !req.test(password)) && (
                <div style={{ marginTop: "8px" }}>
                  {passwordRequirements.map((req, idx) => {
                    const passed = req.test(password);
                    return (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: passed
                            ? "green"
                            : passwordFocused
                            ? "#ff6b6b"
                            : "#888",
                          fontSize: "0.95em",
                        }}
                      >
                        {passed ? (
                          <span style={{ marginRight: 6 }}>&#10003;</span>
                        ) : passwordFocused ? (
                          <span style={{ marginRight: 6 }}>&#10007;</span>
                        ) : null}
                        <span>{req.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            {passwordFocused &&
              passwordError &&
              passwordRequirements.some((req) => !req.test(password)) && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: "block" }}
                >
                  {passwordError}
                </Form.Control.Feedback>
              )}
          </Form.Group>

          <div className="d-grid gap-2">
            <Button
              variant="primary"
              type="submit"
              size="lg"
              disabled={
                !!emailError ||
                !!passwordError ||
                passwordRequirements.some((req) => !req.test(password))
              }
            >
              {isRegistering ? "Sign Up" : "Sign In"}
            </Button>
          </div>
        </Form>

        <div className="text-center mt-3">
          <p className="mb-0">
            {isRegistering
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <Button variant="link" onClick={onToggleMode} className="p-0">
              {isRegistering ? "Sign In" : "Sign Up"}
            </Button>
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AuthForm;
