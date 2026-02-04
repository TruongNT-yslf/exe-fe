import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Container, Row, Col, Button, Badge, Spinner, Alert} from 'react-bootstrap';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Thumbs, FreeMode} from 'swiper/modules';
import {FaShoppingCart, FaBolt, FaLeaf, FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import '../../assets/css/ProductDetails.css';
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
const ProductDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BACKEND_URL}/products/view/${id}`);
                if (response.data.success) {
                    setProduct(response.data.data);
                }
            } catch (err) {
                setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);


    const handleCartAction = async (isBuyNow = false) => {
        try {
            setAdding(true);
            const token = localStorage.getItem('token');

            if (!token) {
                alert("Vui lòng đăng nhập để mua hàng!");
                navigate('/login');
                return;
            }

            const response = await axios.post(
                `${BACKEND_URL}/cart/add`,
                null,
                {
                    params: {
                        productId: product.id,
                        quantity: quantity
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                if (isBuyNow) {
                    navigate('/cart');
                } else {
                    alert("Đã thêm vào giỏ hàng thành công!");
                }
            }
        } catch (err) {
            console.error("Cart Error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Có lỗi xảy ra khi thêm vào giỏ hàng.");
        } finally {
            setAdding(false);
        }
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(price);

    if (loading) return (
        <Container className="text-center py-100">
            <Spinner animation="border" variant="success"/>
            <p className="mt-3 text-secondary">Đang tải tuyệt tác mây tre...</p>
        </Container>
    );

    if (error) return <Container className="py-5"><Alert variant="danger">{error}</Alert></Container>;
    if (!product) return <Container className="py-5 text-center">Sản phẩm không tồn tại.</Container>;

    const allImages = [product.thumbnail, ...(product.galleryImages || [])];

    return (
        <>
            <Header/>
            <Helmet>
                <title title={product.name}></title>
                <link rel="icon" href={Logo} />
            </Helmet>
            <div style={{ height: '100px' }}></div>
            <Container className="py-5 product-detail-page">
                <Row className="g-5">
                    {/* CỘT TRÁI: GALLERY */}
                    <Col lg={6}>
                        <div className="gallery-sticky">
                            <Swiper
                                spaceBetween={10}
                                navigation={true}
                                thumbs={{swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null}}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="main-image-slider rounded-4 shadow-sm"
                            >
                                {allImages.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="img-container">
                                            <img src={img} alt={product.name}/>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={12}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="thumb-image-slider mt-3"
                            >
                                {allImages.map((img, index) => (
                                    <SwiperSlide key={index} className="rounded-3 overflow-hidden">
                                        <img src={img} alt="thumbnail" className="img-fluid"/>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </Col>

                    {/* CỘT PHẢI: INFO */}
                    <Col lg={6}>
                        <div className="product-content-wrapper ps-lg-4">
                            <Badge bg="success" className="category-badge mb-3">
                                <FaLeaf className="me-2"/> {product.categoryName}
                            </Badge>

                            <h1 className="product-title-1 fw-bold mb-3">{product.name}</h1>

                            <div className="price-container d-flex align-items-center mb-4">
                                <h2 className="current-price mb-0 me-3">
                                    {product.discountedPrice && product.discountedPrice > 0
                                        ? formatPrice(product.discountedPrice)
                                        : formatPrice(product.originalPrice)}
                                </h2>

                                {product.discountedPrice && product.discountedPrice > 0 && product.discountedPrice < product.originalPrice && (
                                    <span className="old-price text-muted">
            {formatPrice(product.originalPrice)}
        </span>
                                )}
                            </div>

                            <p className="product-desc text-secondary mb-4">{product.description}</p>

                            <hr className="divider"/>

                            {/* BỘ CHỌN SỐ LƯỢNG */}
                            <div className="quantity-section mb-5">
                                <label className="fw-bold mb-3 text-muted small">SỐ LƯỢNG</label>
                                <div className="custom-qty-selector">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}>−
                                    </button>
                                    <input type="number" value={quantity} readOnly/>
                                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                                </div>
                            </div>


                            <div className="action-buttons-group">
                                <Button
                                    variant="outline-success"
                                    className="btn-cart flex-grow-1"
                                    onClick={() => handleCartAction(false)}
                                    disabled={adding}
                                >
                                    {adding ? <Spinner size="sm"/> : <><FaShoppingCart className="me-2"/> THÊM GIỎ
                                        HÀNG</>}
                                </Button>

                                <Button
                                    variant="success"
                                    className="btn-buy flex-grow-1 shadow-green"
                                    onClick={() => handleCartAction(true)}
                                    disabled={adding}
                                >
                                    <FaBolt className="me-2"/> MUA NGAY
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer/>
        </>
    );
};

export default ProductDetail;