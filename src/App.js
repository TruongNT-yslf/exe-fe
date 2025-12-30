
import './App.css';
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/auth/HomePage";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Logout from "./components/Logout";
import { getToken } from "./utils/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
// import ProtectedRoute from "./routes/ProtectedRoute";
// import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
function App() {
    const token = getToken();
    return (

        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <LoginPage />
                            </PublicRoute>
                        }
                    />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/" element={<Navigate to={token ? "/home" : "/login"} replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                    <Route path="/logout" element={<Logout />} />

                    {/* USER routes */}

                    {/* STAFF routes */}

                    {/* ADMIN routes */}

                </Routes>
            </Router>
        </AuthProvider>
    );
}
export default App;
