import { Outlet, Route, Routes } from 'react-router-dom';

import Header from './components/Header.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Account from './pages/Account.jsx';
import Campaigns from './pages/Campaigns.jsx';
import Contact from './pages/Contact.jsx';
import Help from './pages/Help.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import './index.css';

const AppLayout = () => (
  <div className="app">
    <Header />
    <main className="main">
      <Outlet />
    </main>
    <footer className="app-footer">
      <div className="container">
        <p>Copyright {new Date().getFullYear()} Click Duplicator. All rights reserved.</p>
      </div>
    </footer>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="help" element={<Help />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="campaigns"
            element={
              <ProtectedRoute>
                <Campaigns />
              </ProtectedRoute>
            }
          />
          <Route
            path="account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
