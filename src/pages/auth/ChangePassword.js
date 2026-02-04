import React, { useState } from "react";
import { Form, Button, Alert, Container, Card, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../api/auth";
import BackgroundImage from "../../assets/images/bg4.jpg";
import {Helmet} from "react-helmet-async";
import Logo from "../../assets/images/LOGO-EXE.png";
function ChangePasswordPage() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState({ type: "", content: "" });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", content: "" });

        if (newPassword !== confirmPassword) {
            setMessage({ type: "danger", content: "Mật khẩu xác nhận không khớp!" });
            return;
        }

        setLoading(true);
        try {
            await changePassword(oldPassword, newPassword);
            setMessage({ type: "success", content: "Đổi mật khẩu thành công! Đang chuyển hướng về trang cá nhân..." });

            // Đợi 2 giây để người dùng đọc thông báo rồi mới chuyển trang
            setTimeout(() => {
                navigate("/profile");
            }, 2000);

        } catch (err) {
            setMessage({
                type: "danger",
                content: err.response?.data?.message || "Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu cũ."
            });
            setLoading(false); // Chỉ tắt loading ở đây nếu lỗi, nếu thành công thì để hiệu ứng loading cho đến khi chuyển trang
        }
    };

    return (
        <div style={{
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: 'cover',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <Container style={{ maxWidth: "500px" }}>
                <Helmet>
                    <title>Thay đổi mật khẩu</title>
                    <link rel="icon" href={Logo} />
                </Helmet>
                <Stack direction="horizontal" gap={2} className="mb-3">
                    <Button variant="light" onClick={() => navigate("/profile")} className="shadow-sm">
                        ← Quay lại
                    </Button>
                    <Button variant="light" onClick={() => navigate("/")} className="shadow-sm">
                        Trang chủ
                    </Button>
                </Stack>

                <Card className="shadow">
                    <Card.Header className="bg-success text-white text-center">
                        <h4 className="mb-0">Đổi Mật Khẩu</h4>
                    </Card.Header>
                    <Card.Body>
                        {message.content && (
                            <Alert variant={message.type}>
                                {message.content}
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Mật khẩu cũ</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Mật khẩu mới</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </Form.Group>

                            <Button variant="success" type="submit" className="w-100" disabled={loading}>
                                {loading ? "Đang xử lý..." : "Xác nhận đổi"}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default ChangePasswordPage;