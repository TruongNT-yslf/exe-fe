import React, { useState, useContext } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { login as apiLogin, signup } from "../../api/auth";
import { saveToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Login.css";
import BackgroundImage from "../../assets/images/bg4.jpg";
import Logo from "../../assets/images/LOGO EXE.png";
import { AuthContext } from "../../context/AuthContext";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [fullname, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isSignIn, setIsSignIn] = useState(true);
    const [repeatPassword, setRepeatPassword] = useState("");
    const { login: loginContext } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isSignIn) {
                const data = await apiLogin(username, password);
                const token = data.data.token;
                saveToken(token);

                // Cập nhật AuthContext ngay lập tức
                await loginContext(token);

                navigate("/home");
            } else {
                if (password !== repeatPassword) {
                    setError("Passwords do not match!");
                    return;
                }

                const data = await signup(username, password, email, fullname);
                alert("Register success! Please login.");
                setIsSignIn(true);
                navigate("/login");
            }
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handlePassword = () => {
        console.log("Forgot password clicked");
    };

    return (
        <div
            className="sign-in__wrapper"
            style={{ backgroundImage: `url(${BackgroundImage})` }}
        >
            <div className="sign-in__backdrop"></div>

            <Form className="shadow p-4 bg-white rounded" onSubmit={handleLogin}>
                <div className="d-flex justify-content-center mb-3">
                    <Button
                        variant={isSignIn ? "success" : "outline-success"}
                        className="me-2"
                        onClick={() => setIsSignIn(true)}
                    >
                        Sign In
                    </Button>
                    <Button
                        variant={!isSignIn ? "success" : "outline-success"}
                        onClick={() => setIsSignIn(false)}
                    >
                        Sign Up
                    </Button>
                </div>

                <img
                    className="img-thumbnail mx-auto d-block mb-2 p-0"
                    src={Logo}
                    alt="logo"
                />

                <div className="h4 mb-2 text-center">
                    {isSignIn ? "Sign In" : "Sign Up"}
                </div>

                {error && (
                    <Alert
                        className="mb-2"
                        variant="danger"
                        onClose={() => setError("")}
                        dismissible
                    >
                        {error}
                    </Alert>
                )}

                <Form.Group className="mb-2" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>

                {!isSignIn && (
                    <>
                        <Form.Group className="mb-2" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-2" controlId="fullname">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={fullname}
                                placeholder="Full Name"
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </>
                )}

                <Form.Group className="mb-2" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                {!isSignIn && (
                    <Form.Group className="mb-2" controlId="repeatPassword">
                        <Form.Label>Repeat Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={repeatPassword}
                            placeholder="Repeat Password"
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                )}

                {!loading ? (
                    <Button className="w-100" variant="success" type="submit">
                        {isSignIn ? "Log In" : "Sign Up"}
                    </Button>
                ) : (
                    <Button className="w-100" variant="success" disabled>
                        {isSignIn ? "Logging In..." : "Signing Up..."}
                    </Button>
                )}

                {isSignIn && (
                    <div className="d-grid justify-content-end">
                        <Button
                            className="text-muted px-0"
                            variant="link"
                            onClick={handlePassword}
                        >
                            Forgot password?
                        </Button>
                    </div>
                )}
            </Form>

            <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
                Made by MAYÉ | &copy;2025
            </div>
        </div>
    );
}

export default LoginPage;
