import React, { useState, useEffect, useContext } from "react";
import { removeToken, getToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Navbar, Nav, Card } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../assets/css/Home.css";
function HomePage() {
    const navigate = useNavigate();
    const token = getToken();
    const { user, loading } = useContext(AuthContext);
    const imageStyle = {
        height: '150px',
        objectFit: 'cover'
    };

    const handleLogout = () => {
        removeToken();
        navigate("/login");
    };

    if (loading) return <p className="text-center mt-5">Loading...</p>;

    return (
        <>
            <Header />

            {/* Book List Section */}
            <section id="books" className="bg-light" style={{ marginTop: "70px  " }}>
                <p>Mây Tre Đan</p>
            </section>

            {/* Features Section */}
            <section id="features" className="py-5">
                <Container>
                    <h2 className="text-center mb-4 fw-bold">News & Events</h2>
                    <Row>
                        <Col md={4} className="d-flex mb-4">
                            {/* Áp dụng class CSS tùy chỉnh cho card */}
                            <Card className="fixed-size-card shadow-sm w-100">

                                {/* 1. Component Image (cao 150px) */}
                                <Card.Img
                                    variant="top"
                                    style={imageStyle} // THAY ĐỔI ĐƯỜNG DẪN NÀY
                                    src="https://scontent.fhan14-2.fna.fbcdn.net/v/t39.30808-6/503378156_1179157050677175_1580011093702690973_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEn7kfpQU4Q63mHwDq9OaJWzuEGTdDZzlfO4QZN0NnOV8-VVRvtdan-KcP7F7kK4Wg3bm2OIPtzc9HIStCfFzg7&_nc_ohc=4sODrAoMt2EQ7kNvwEborET&_nc_oc=Adme7yY0noy5wyzrVVxIZXy5MjlI_8a67C33nKF7CNjWKjgukA0KeEJAyFmOP_65doc&_nc_zt=23&_nc_ht=scontent.fhan14-2.fna&_nc_gid=H5osawWXQY_Fw16PBASZpA&oh=00_AfiWzjz8ZRcTpvLQoeqv7665dpUz18y7sta0rkloGSIN-g&oe=691B2B95"
                                    alt="Vạn sách trao tay mùa 3"
                                />

                                {/* 2. Phần nội dung (cao 280px - 150px = 130px) */}
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>Vạn sách trao tay mùa 3</Card.Title>
                                    {/* Dùng text-truncate để nội dung dài tự động cắt nếu muốn */}
                                    <Card.Text className="line-clamp-3">
                                        “Vạn Sách Trao Tay III” – hội sách mùa hè lớn nhất năm đến từ Lib4u – đã chính thức trở lại. Tiếp nối sứ mệnh lan tỏa văn hóa đọc, hội sách lần này hứa hẹn mang đến hàng ngàn đầu sách hấp dẫn, đa dạng thể loại, cùng cơ hội giao lưu và kết nối với các tác giả hot nhất.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4} className="d-flex mb-4">
                            <Card className="fixed-size-card shadow-sm w-100">
                                <Card.Img
                                    variant="top"
                                    src="https://library.fpt.edu.vn/Uploads/HN/files/post%20gi%E1%BB%9Bi%20thi%E1%BB%87u.png" // THAY ĐỔI ĐƯỜNG DẪN NÀY
                                    style={imageStyle}
                                    alt="Ngày hội đổi sách 2025"
                                />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>Ngày hội đổi sách 2025</Card.Title>
                                    <Card.Text className="line-clamp-3">
                                        Bạn muốn lan tỏa những cuốn sách hay? Bạn có muốn đổi những cuốn sách cũ của mình để khám phá những cuốn sách mới lạ? Đừng bỏ lỡ Ngày hội đổi sách 2025 nhé!
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4} className="d-flex mb-4">
                            <Card className="fixed-size-card shadow-sm w-100">
                                <Card.Img
                                    variant="top"
                                    src="https://library.fpt.edu.vn/Uploads/HN/files/A%CC%89nh%20ma%CC%80n%20hi%CC%80nh%202024-12-02%20lu%CC%81c%2015_41_48.png" // THAY ĐỔI ĐƯỜNG DẪN NÀY
                                    style={imageStyle}
                                    alt="Thông báo đóng cửa thư viện"
                                />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>Thông báo đóng cửa thư viện ngày 9/12/2024</Card.Title>
                                    <Card.Text className="line-clamp-3">
                                        Thư viện đóng cửa từ 9/12 - 13/12/2024 để thực hiện công tác kiểm kê 2024
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* CTA Section */}
            {!token ? (
                <section className="cta text-center text-white">
                    <Container>
                        <h2 className="fw-bold">Ready to Get Started?</h2>
                        <Button variant="light" size="lg">
                            Sign Up Now
                        </Button>
                    </Container>
                </section>
            ) : null}

            <Footer />
        </>
    );
}

export default HomePage;
