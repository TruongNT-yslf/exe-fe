import React, { useState, useEffect, useContext } from "react";
import { removeToken, getToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Navbar, Nav, Card } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BG from "../../assets/images/homebg.jpg";
import "../../assets/css/Home.css";
import axios from "axios";
import ChatBox from "../../components/chatbot/ChatBox";
import {Helmet} from "react-helmet-async";
import Logo from "../../assets/images/LOGO-EXE.png";
const BACKEND_URL = process.env.REACT_APP_API_URL

export async function login(username, password) {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || "Login failed";
        throw new Error(errorMessage);
    }

    return response.json(); // { token, expiration }
}
function HomePage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const token = getToken();
    const { user, loading } = useContext(AuthContext);
    const imageStyle = {
        height: '250px',
        objectFit: 'cover'
    };

    const handleLogout = () => {
        removeToken();
        navigate("/login");
    };
    useEffect(() => {
        axios.get(`${BACKEND_URL}/categories`)
            .then(res => setCategories(res.data.data))
            .catch(err => console.error(err));
    }, []);

    if (loading) return <p className="text-center mt-5">Loading...</p>;

    return (
        <>
            <Header />
            <Helmet>
                <title>Trang Chủ | Nhà Mây Tre</title>
                <link rel="icon" href={Logo} />
            </Helmet>
            <section
                className="hero-section text-center"
                style={{
                    marginTop: '100px',
                    backgroundImage: `url(${BG})`,
                    backgroundPosition: 'top center',
                    backgroundSize: '100% auto',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {/* Nội dung bên trong */}
            </section>

            {/* CATEGORY GRID */}
            <section className="category-section">
                <Container className="py-5">
                    <h2 className="text-center fw-bold mb-5 section-title">
                        Danh mục sản phẩm
                    </h2>
                    <Row className="g-4">
                        {categories.map(cat => (
                            <Col lg={3} md={4} sm={6} key={cat.id}>
                                <Card
                                    className="category-card border-0 text-white shadow-sm overflow-hidden"
                                    onClick={() => navigate(`/products?categoryId=${cat.id}`)}
                                >
                                    <div className="category-img-container">
                                        <Card.Img
                                            src={cat.picture}
                                            alt={cat.name}
                                            className="category-img"
                                        />
                                        <Card.ImgOverlay className="d-flex flex-column justify-content-end align-items-center  pb-4 category-overlay">
                                            <Card.Title className="fw-bold fs-4 mb-1">{cat.name}</Card.Title>
                                            <Card.Text className="small opacity-75">
                                                {cat.description}
                                            </Card.Text>
                                        </Card.ImgOverlay>
                                    </div>
                                </Card>
                            </Col>
                        ))}

                        {/* Card VIEW ALL */}
                        <Col lg={3} md={4} sm={6}>
                            <Card
                                className="category-card border-0 text-white shadow-sm overflow-hidden"
                                onClick={() => navigate("/products")}
                            >
                                <div className="category-img-container">
                                    <Card.Img
                                        src="https://i.pinimg.com/736x/39/42/06/3942068c0153280a4b88c5b09ced6ffd.jpg"
                                        className="category-img"
                                    />
                                    <Card.ImgOverlay className="d-flex flex-column align-items-center justify-content-center text-center category-overlay">
                                        <h3 className="fw-bold">Xem tất cả</h3>
                                        <p className="small mb-3">Toàn bộ sản phẩm mây tre</p>
                                        <Button variant="light" size="sm" className="rounded-pill px-4 fw-bold">
                                            Khám phá ngay
                                        </Button>
                                    </Card.ImgOverlay>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
            {/* Features Section */}
            <section id="features" className="py-5">
                <Container>
                    <h2 className="text-center mb-4 fw-bold">Chia sẻ kiến thức</h2>
                    <Row>
                        <Col md={4} className="d-flex mb-4">
                            {/* Áp dụng class CSS tùy chỉnh cho card */}
                            <Card className="fixed-size-card shadow-sm w-100">

                                {/* 1. Component Image (cao 150px) */}
                                <Card.Img
                                    variant="top"
                                    style={imageStyle} // THAY ĐỔI ĐƯỜNG DẪN NÀY
                                    src="https://maymatcaovilata.com/wp-content/uploads/2025/06/lang-nghe-may-tre-dan-Phu-Vinh.png.webp"
                                    alt="Mây Tre Phú Vinh – Địa chỉ bán đồ thủ công chất lượng tại Hà Nội"
                                />

                                {/* 2. Phần nội dung (cao 280px - 150px = 130px) */}
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>Mây Tre Phú Vinh – Địa chỉ bán đồ thủ công chất lượng tại Hà Nội</Card.Title>
                                    {/* Dùng text-truncate để nội dung dài tự động cắt nếu muốn */}
                                    <Card.Text className="line-clamp-3">
                                        Nổi tiếng với những sản phẩm thủ công tinh xảo và chất lượng, Mây Tre Phú Vinh đã trở thành điểm đến tin cậy cho những ai yêu thích và trân trọng những sản phẩm từ mây tre. Không chỉ là nơi mua sắm, đây còn là không gian để người ta khám phá và cảm nhận nghệ thuật thủ công đầy tinh tế, cùng sự khéo léo và tài hoa của những nghệ nhân lành nghề.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4} className="d-flex mb-4">
                            <Card className="fixed-size-card shadow-sm w-100">
                                <Card.Img
                                    variant="top"
                                    src="https://treladatthanh.com/admin_assets/source/tin-tuc/may-tre-dan-la-gi.jpg" // THAY ĐỔI ĐƯỜNG DẪN NÀY
                                    style={imageStyle}
                                    alt="Mây Tre Đan Là Gì?"
                                />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>Mây Tre Đan Là Gì? Những Sản Phẩm Mây Tre Đan</Card.Title>
                                    <Card.Text className="line-clamp-3">
                                        Các sản phẩm từ mây tre đan đã tồn tại trong văn hóa người Việt Nam từ hàng trăm năm qua. Vậy mây tre đan là gì? Các sản phẩm mây tre đan xuất khẩu phổ biến hiện nay gồm những sản phẩm gì? Cùng tìm hiểu tất cả qua nội dung bài viết sau đây.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4} className="d-flex mb-4">
                            <Card className="fixed-size-card shadow-sm w-100">
                                <Card.Img
                                    variant="top"
                                    src="https://vhandy.com.vn/wp-content/uploads/2023/10/mau-tui-may-tre.jpg"
                                    style={imageStyle}
                                    alt="Thông báo đóng cửa thư viện"
                                />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>Túi xách mây tre đan – Lựa chọn hoàn hảo cho mùa hè năng động</Card.Title>
                                    <Card.Text className="line-clamp-3">
                                        Túi được làm từ mây tre đan thủ công, một nguồn nguyên liệu tự nhiên, bền vững và có khả năng tái chế cao. Mây tre là loại cây phát triển nhanh và không đòi hỏi sử dụng nhiều hóa chất trong quá trình canh tác, giúp giảm thiểu tác động tiêu cực đến môi trường. Đặc biệt, túi làm từ mây tre có thể phân hủy sinh học hoàn toàn, không gây ô nhiễm đất và nước như các loại túi nhựa thông thường.
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
            < ChatBox/>
            <Footer />
        </>
    );
}

export default HomePage;
