import React, {useEffect, useState, useCallback} from "react";
import api from "../../api/api";
import {Container, Row, Col, Card, Form, Button, Pagination, Badge} from "react-bootstrap";
import axios from "axios";
import {useSearchParams, useNavigate} from "react-router-dom";
import {getToken} from "../../utils/auth";
import "../../assets/css/ViewProduct.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCartShopping} from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Logo from "../../assets/images/LOGO-EXE.png";
import {Helmet} from "react-helmet-async";
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
function ViewProduct() {
    const token = getToken();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();


    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);


    const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
    const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
    const [minPrice, setMinPrice] = useState(Number(searchParams.get("minPrice")) || 0);
    const [maxPrice, setMaxPrice] = useState(Number(searchParams.get("maxPrice")) || 2000000);
    const page = Number(searchParams.get("page")) || 1;
    const size = 6;


    useEffect(() => {
        api.get(`${BACKEND_URL}/categories`)
            .then(res => setCategories(res.data.data || []))
            .catch(err => console.error(err));
    }, []);


    useEffect(() => {
        setKeyword(searchParams.get("keyword") || "");
        setCategoryId(searchParams.get("categoryId") || "");
        setMinPrice(Number(searchParams.get("minPrice")) || 0);
        setMaxPrice(Number(searchParams.get("maxPrice")) || 2000000);

        fetchProducts();
    }, [searchParams]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get(`${BACKEND_URL}/products/view`, {
                params: {
                    keyword: searchParams.get("keyword") || "",
                    categoryId: searchParams.get("categoryId") || "",
                    minPrice: searchParams.get("minPrice") || 0,
                    maxPrice: searchParams.get("maxPrice") || 2000000,
                    page: page,
                    size,
                    sort: searchParams.get("sort") || ""
                }
            });
            setProducts(res.data.data.content || []);
            setTotalPages(res.data.data.totalPages || 1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        const params = {};
        if (keyword) params.keyword = keyword;
        if (categoryId) params.categoryId = categoryId;
        if (minPrice > 0) params.minPrice = minPrice;
        if (maxPrice < 2000000) params.maxPrice = maxPrice;
        params.page = 1;

        setSearchParams(params);
    };

    const handleClearFilter = () => {
        setKeyword("");
        setCategoryId("");
        setMinPrice(0);
        setMaxPrice(2000000);
        setSearchParams({});
    };

    const handlePageChange = (newPage) => {
        const currentParams = Object.fromEntries([...searchParams]);
        setSearchParams({...currentParams, page: newPage});
        window.scrollTo(0, 0);
    };

    const handleAddToCart = (productId) => {
        axios.post(`${BACKEND_URL}/cart/add`, null, {
            params: {productId, quantity: 1},
            headers: {Authorization: `Bearer ${token}`}
        })
            .then(() => alert("Đã thêm vào giỏ hàng"))
            .catch(err => console.error(err));
    };

    return (
        <>
            <Header/>
            <Helmet>
                <title>Danh mục sản phẩm | Nhà Mây Tre</title>
                <link rel="icon" href={Logo} />
            </Helmet>
            <Container style={{maxWidth: 1200, paddingTop: "150px"}}>
                <Row>
                    <Col md={3}>
                        <div className="filter-box shadow-sm p-3 rounded bg-white">
                            <h5 className="fw-bold mb-3">Bộ lọc sản phẩm</h5>
                            <Form.Group className="mb-3">
                                <Form.Label>Tìm kiếm</Form.Label>
                                <Form.Control
                                    value={keyword}
                                    onChange={e => setKeyword(e.target.value)}
                                    placeholder="Tên sản phẩm..."
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Danh mục</Form.Label>
                                <Form.Select
                                    value={categoryId}
                                    onChange={e => setCategoryId(e.target.value)}
                                >
                                    <option value="">Tất cả</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Giá: {minPrice.toLocaleString()} - {maxPrice.toLocaleString()}đ</Form.Label>
                                <Form.Range min={0} max={2000000} step={50000} value={minPrice}
                                            onChange={e => setMinPrice(Number(e.target.value))}/>
                                <Form.Range min={0} max={2000000} step={50000} value={maxPrice}
                                            onChange={e => setMaxPrice(Number(e.target.value))}/>
                            </Form.Group>

                            <Button variant="success" className="w-100 mb-2" onClick={handleFilter}>Áp dụng</Button>
                            <Button variant="outline-secondary" className="w-100" onClick={handleClearFilter}>Xóa bộ
                                lọc</Button>
                        </div>
                    </Col>

                    <Col md={9}>
                        {loading ? (
                            <div className="text-center mt-5">Đang tải sản phẩm...</div>
                        ) : products.length === 0 ? (
                            <p className="text-center mt-4 text-muted">Không tìm thấy sản phẩm nào.</p>
                        ) : (
                            <Row className="g-4">
                                {products.map(p => (
                                    <Col md={4} key={p.id}>
                                        <Card className="product-card h-100 shadow-sm border-0">
                                            <div className="img-wrapper" style={{cursor: 'pointer'}}
                                                 onClick={() => navigate(`/products/${p.id}`)}>
                                                <Card.Img variant="top" src={p.thumbnail}/>
                                                {p.discountedPrice &&
                                                    <Badge bg="danger" className="discount-badge">SALE</Badge>}
                                            </div>
                                            <Card.Body>
                                                <h6 className="product-title text-center">{p.name}</h6>
                                                <div className="product-action-wrapper">
                                                    <div
                                                        className="d-flex justify-content-between align-items-center mb-2">
                                                        <div className="price-box">
                                                            {p.discountedPrice ? (
                                                                <>
                        <span className="old-price block small text-muted text-decoration-line-through">
                            {p.originalPrice?.toLocaleString()}đ
                        </span>
                                                                    <span
                                                                        className="new-price d-block fw-bold text-success">
                            {p.discountedPrice.toLocaleString()}đ
                        </span>
                                                                </>
                                                            ) : (
                                                                <span className="new-price d-block fw-bold">
                        {p.originalPrice?.toLocaleString()}đ
                    </span>
                                                            )}
                                                        </div>

                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            className="btn-cart-circle"
                                                            onClick={() => handleAddToCart(p.id)}
                                                            style={{backgroundColor: '#A6C48A', border: 'none'}}
                                                        >
                                                            <FontAwesomeIcon icon={faCartShopping}/>
                                                        </Button>
                                                    </div>


                                                    <Button
                                                        variant="outline-success"
                                                        className="w-100 btn-view-detail"
                                                        onClick={() => navigate(`/products/${p.id}`)}
                                                        style={{color: '#A6C48A', borderColor: '#A6C48A'}}
                                                    >
                                                        Xem chi tiết
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}

                        {totalPages > 1 && (
                            <Pagination className="justify-content-center mt-5">
                                <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1}/>
                                <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1}/>
                                {[...Array(totalPages)].map((_, i) => (
                                    <Pagination.Item key={i + 1} active={i + 1 === page}
                                                     onClick={() => handlePageChange(i + 1)}>
                                        {i + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={() => handlePageChange(page + 1)}
                                                 disabled={page === totalPages}/>
                                <Pagination.Last onClick={() => handlePageChange(totalPages)}
                                                 disabled={page === totalPages}/>
                            </Pagination>
                        )}
                    </Col>
                </Row>
            </Container>
            <Footer/>
        </>
    );
}

export default ViewProduct;