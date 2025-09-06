import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import WelcomeCard from './components/Welcome';
import AuthForm from './components/AuthForm';
import Header from './components/Navbar';

interface User {
  email: string;
  [key: string]: any;
}

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('https://auth-5jrm.onrender.com/api/user', { withCredentials: true });
      setIsLoggedIn(true);
      setUser(response.data);
    } catch (error: any) {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isRegistering ? 'https://auth-5jrm.onrender.com/api/register' : 'https://auth-5jrm.onrender.com/api/login';
      await axios.post(endpoint, { email, password }, { withCredentials: true });
      await checkAuthStatus();
      setEmail('');
      setPassword('');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Something went wrong');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('https://auth-5jrm.onrender.com/api/logout', {}, { withCredentials: true });
      setIsLoggedIn(false);
      setUser(null);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Something went wrong');
    }
  };

  const toggleAuthMode = () => {
    setEmail('');
    setPassword('');
    setError('');
    setIsRegistering(!isRegistering);
  };

  if (isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', minWidth: '100vw', display: 'flex', flexDirection: 'column' }}>
        <Header onLogout={handleLogout} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Container>
            <Row className="justify-content-center">
              <Col md={6}>
                <WelcomeCard email={user?.email || ''} onLogout={handleLogout} />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', minWidth: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <AuthForm
              email={email}
              password={password}
              isRegistering={isRegistering}
              error={error}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onSubmit={handleSubmit}
              onToggleMode={toggleAuthMode}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
