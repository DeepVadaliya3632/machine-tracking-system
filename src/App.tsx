import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });

    const handleLogin = () => {
        localStorage.setItem('isLoggedIn', 'true');
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={
                        !isAuthenticated ?
                            <Login onLogin={handleLogin} /> :
                            <Navigate to="/dashboard" replace />
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated ?
                            <Dashboard onLogout={handleLogout} /> :
                            <Navigate to="/login" replace />
                    }
                />
                <Route
                    path="*"
                    element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
                />
            </Routes>
        </Router>
    );
}

export default App;
