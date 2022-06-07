import React from 'react';
import { useRoutes } from './routes';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';
import { Navbar } from './Components/Navbar';

import { Loader } from './Components/Loader';
import 'antd/dist/antd.min.css';

function App() {
  const { token, login, userId, logout, ready } = useAuth();
  const isAuthenticated = !!token;

  const routes = useRoutes(isAuthenticated);

  if (!ready) {
    return <Loader />;
  }
  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column' }}>
      <AuthContext.Provider
        value={{ token, userId, login, logout, isAuthenticated }}
      >
        <Router>
          {isAuthenticated && <Navbar />}
          <div className="container">{routes}</div>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
