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
import {get3Blogs, getBlogs} from '../../api/Blog';
import { Link } from "react-router-dom";
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
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const imageStyle = {
        height: '250px',
        objectFit: 'cover'
    };

    const handleLogout = () => {
        removeToken();
        navigate("/login");
    };
    useEffect(() => {
        const fetchRelatedBlogs = async () => {
            try {
                const response = await getBlogs();
                const filtered = response.data.data
                    .slice(0, 3) || [];
                setRelatedBlogs(filtered);
            } catch (err) {
                console.error('Error fetching related blogs:', err);
            }
        };

        axios.get(`${BACKEND_URL}/categories`)
            .then(res => setCategories(res.data.data))
            .catch(err => console.error(err));
        fetchRelatedBlogs();
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
                    <h2 className="text-center mb-5 fw-bold section-title">Chia sẻ kiến thức</h2>
                    <Row>
                        {relatedBlogs && relatedBlogs.length > 0 ? (
                            relatedBlogs.map((blog) => (
                                <Col md={4} key={blog.id} className="mb-4">
                                    <Link to={`/blog/${blog.id}`} className="text-decoration-none text-dark">
                                        <Card className="h-100 border-0 shadow-sm hover-shadow transition">
                                            <Card.Img
                                                variant="top"
                                                style={{ height: '220px', objectFit: 'cover' }}
                                                src={blog.thumbnail || 'placeholder-image-url.jpg'}
                                                alt={blog.title}
                                            />
                                            <Card.Body>
                                                <Card.Title className="fw-bold mb-2" style={{ fontSize: '1.1rem' }}>
                                                    {blog.title}
                                                </Card.Title>
                                                <Card.Text
                                                    className="text-muted small"
                                                    style={{
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 3, // Tăng lên 3 dòng cho dễ đọc
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {/* Loại bỏ tag HTML nếu nội dung là HTML */}
                                                    {blog.content?.replace(/<[^>]*>?/gm, '')}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Link>
                                </Col>
                            ))
                        ) : (
                            <p className="text-center">Đang tải bài viết...</p>
                        )}
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
