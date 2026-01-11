import React, { useState, useEffect, useContext } from "react";
import { removeToken, getToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Navbar, Nav, Card } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../assets/css/Home.css";
import axios from "axios";
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
        axios.get("http://localhost:8080/api/categories")
            .then(res => setCategories(res.data.data))
            .catch(err => console.error(err));
    }, []);

    if (loading) return <p className="text-center mt-5">Loading...</p>;

    return (
        <>
            <Header />


            <section className="hero-section text-center">
                <h1>Mây Tre Đan Việt Nam</h1>
                <p>Thủ công – Tự nhiên – Bền vững</p>
            </section>

            {/* CATEGORY GRID */}
            <section className="category-section">
                <Container>
                    <h2 className="text-center fw-bold mb-4">Danh mục sản phẩm</h2>

                    <Row className="g-4">
                        {categories.map(cat => (
                            <Col md={3} key={cat.id}>
                                <Card
                                    className="category-card"
                                    onClick={() => navigate(`/products?categoryId=${cat.id}`)}
                                >
                                    <Card.Body>
                                        <h5>{cat.name}</h5>
                                        <p>{cat.description}</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}

                        {/* VIEW ALL */}
                        <Col md={3}>
                            <Card
                                className="category-card view-all"
                                onClick={() => navigate("/products")}
                            >
                                <Card.Body>
                                    <h5>Xem tất cả</h5>
                                    <p>Toàn bộ sản phẩm mây tre</p>
                                    <Button variant="dark">View All</Button>
                                </Card.Body>
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

            <Footer />
        </>
    );
}

export default HomePage;
