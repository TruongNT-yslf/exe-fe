import React, { useState, useContext } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { login as apiLogin, signup, forgotPassword } from "../../api/auth"; // Import thêm forgotPassword
import { saveToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Login.css";
import BackgroundImage from "../../assets/images/bg4.jpg";
import Logo from "../../assets/images/LOGO EXE.png";
import { AuthContext } from "../../context/AuthContext";

function LoginPage() {
    // Thay vì isSignIn (boolean), dùng mode (string): 'LOGIN', 'SIGNUP', 'FORGOT'
    const [mode, setMode] = useState("LOGIN");

    const [username, setUsername] = useState("");
    const [fullname, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    // State riêng cho Forgot Password
    const [forgotKey, setForgotKey] = useState("");

    const [error, setError] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState(""); // Thêm thông báo thành công
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login: loginContext } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setLoading(true);

        try {
            if (mode === "LOGIN") {
                const data = await apiLogin(username, password);
                const token = data.data.token;
                saveToken(token);
                await loginContext(token);
                navigate("/home");
            }
            else if (mode === "SIGNUP") {
                if (password !== repeatPassword) {
                    throw new Error("Passwords do not match!");
                }
                await signup(username, password, email, fullname);
                setSuccessMsg("Register success! Please login.");
                setMode("LOGIN");
            }
            else if (mode === "FORGOT") {
                try {
                    // 1. Gọi API và nhận phản hồi
                    const response = await forgotPassword(forgotKey);

                    // 2. Kiểm tra flag success từ server (dựa trên JSON bạn cung cấp)
                    if (response.success) {
                        setSuccessMsg("Mật khẩu mới đã được gửi tới email của bạn. Vui lòng kiểm tra hộp thư.");
                        // Có thể thêm điều hướng sau 3 giây: setTimeout(() => setMode("LOGIN"), 3000);
                    } else {
                        // 3. Xử lý trường hợp success: false (như lỗi 500 "Không tìm thấy người dùng")
                        setErrorMsg(response.message || "Đã có lỗi xảy ra.");
                    }
                } catch (error) {
                    // 4. Xử lý lỗi kết nối hoặc lỗi nghiêm trọng từ phía client/network
                    alert(error.response?.data?.message || error.message || "Đã có lỗi xảy ra khi gửi yêu cầu.");
                }
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data || err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Hàm render tiêu đề form
    const renderTitle = () => {
        if (mode === "LOGIN") return "Sign In";
        if (mode === "SIGNUP") return "Sign Up";
        return "Forgot Password";
    };

    return (
        <div className="sign-in__wrapper" style={{ backgroundImage: `url(${BackgroundImage})` }}>
            <div className="sign-in__backdrop"></div>

            <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
                {/* Logo */}
                <img className="img-thumbnail mx-auto d-block mb-2 p-0" src={Logo} alt="logo" />

                <div className="h4 mb-2 text-center">{renderTitle()}</div>

                {/* Thông báo lỗi & thành công */}
                {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
                {errorMsg && <Alert variant="danger" onClose={() => setErrorMsg("")} dismissible>{errorMsg}</Alert>}
                {successMsg && <Alert variant="success" onClose={() => setSuccessMsg("")} dismissible>{successMsg}</Alert>}

                {/* --- FORM QUÊN MẬT KHẨU --- */}
                {mode === "FORGOT" && (
                    <Form.Group className="mb-2" controlId="forgotKey">
                        <Form.Label>Enter Username or Email</Form.Label>
                        <Form.Control
                            type="text"
                            value={forgotKey}
                            placeholder="username or email@example.com"
                            onChange={(e) => setForgotKey(e.target.value)}
                            required
                        />
                    </Form.Group>
                )}

                {/* --- FORM LOGIN & SIGNUP (Ẩn khi đang ở chế độ FORGOT) --- */}
                {mode !== "FORGOT" && (
                    <>
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

                        {mode === "SIGNUP" && (
                            <>
                                <Form.Group className="mb-2" controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                                </Form.Group>
                                <Form.Group className="mb-2" controlId="fullname">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control type="text" value={fullname} placeholder="Full Name" onChange={(e) => setFullName(e.target.value)} required />
                                </Form.Group>
                            </>
                        )}

                        <Form.Group className="mb-2" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                        </Form.Group>

                        {mode === "SIGNUP" && (
                            <Form.Group className="mb-2" controlId="repeatPassword">
                                <Form.Label>Repeat Password</Form.Label>
                                <Form.Control type="password" value={repeatPassword} placeholder="Repeat Password" onChange={(e) => setRepeatPassword(e.target.value)} required />
                            </Form.Group>
                        )}
                    </>
                )}

                {/* Button Submit */}
                <Button className="w-100 mt-2" variant="success" type="submit" disabled={loading}>
                    {loading ? "Processing..." : (mode === "FORGOT" ? "Reset Password" : (mode === "LOGIN" ? "Log In" : "Sign Up"))}
                </Button>

                {/* Button Switch Mode */}
                <div className="d-grid mt-3 text-center">
                    {mode === "LOGIN" ? (
                        <>
                            <Button variant="link" className="text-muted px-0" onClick={() => setMode("FORGOT")}>
                                Forgot password?
                            </Button>
                            <div className="text-muted small">
                                Don't have an account? <span className="text-primary" style={{cursor: "pointer"}} onClick={() => setMode("SIGNUP")}>Sign Up</span>
                            </div>
                        </>
                    ) : (
                        <Button variant="link" className="text-decoration-none" onClick={() => setMode("LOGIN")}>
                            Back to Sign In
                        </Button>
                    )}
                </div>
            </Form>

            <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
                Made by MAYÉ | &copy;2025
            </div>
        </div>
    );
}

export default LoginPage;