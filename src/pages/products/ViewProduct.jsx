import React, {useEffect, useState} from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Pagination,
    Badge
} from "react-bootstrap";
import axios from "axios";
import {useSearchParams} from "react-router-dom";
import {getToken} from "../../utils/auth";
import "../../assets/css/ViewProduct.css";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCartShopping} from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function ViewProduct() {
    const token = getToken();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [keyword, setKeyword] = useState("");
    const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(2000000);

    const [sort, setSort] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const size = 6;

    const [loading, setLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [page]);

    const fetchProducts = async (
        search = keyword,
        category = categoryId,
        min = minPrice,
        max = maxPrice,
        currentPage = page,
        sortValue = sort
    ) => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8080/api/products/view", {
                params: {
                    keyword: search,
                    categoryId: category,
                    minPrice: min,
                    maxPrice: max,
                    page: currentPage,
                    size,
                    sort: sortValue
                },
                headers: {Authorization: `Bearer ${token}`}
            });

            setProducts(res.data.data.content || []);
            setTotalPages(res.data.data.totalPages || 1);
            setPage(res.data.data.currentPage || currentPage);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = () => {
        axios.get("http://localhost:8080/api/categories", {
            headers: {Authorization: `Bearer ${token}`}
        })
            .then(res => setCategories(res.data.data || []))
            .catch(err => console.error(err));
    };

    const handleFilter = () => {
        setPage(1);
        fetchProducts(keyword, categoryId, minPrice, maxPrice, 1, sort);
    };

    const handleClearFilter = () => {
        setKeyword("");
        setCategoryId("");
        setMinPrice(0);
        setMaxPrice(2000000);
        setSort("");
        setPage(1);

        fetchProducts("", "", 0, 2000000, 1, "");
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleAddToCart = (productId) => {
        axios.post(
            "http://localhost:8080/api/cart/add",
            null,
            {
                params: {
                    productId: productId,
                    quantity: 1
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(res => {
                alert("Đã thêm vào giỏ hàng");
                console.log(res.data);
            })
            .catch(err => {
                console.error("Add to cart error:", err);
            });
    };


    return (
        <>
            <Header />
            <Container style={{ maxWidth: 1100, paddingTop: "80px" }}>
                <Row>
                    {/* FILTER PANEL */}
                    <Col md={3}>
                        <div className="filter-box shadow-sm p-3 rounded">
                            <h5 className="fw-bold mb-3">Bộ lọc sản phẩm</h5>

                            <Form.Group className="mb-3">
                                <Form.Label>Tìm kiếm</Form.Label>
                                <Form.Control
                                    placeholder="Nhập tên sản phẩm..."
                                    value={keyword}
                                    onChange={e => setKeyword(e.target.value)}
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
                                <Form.Label>Khoảng giá</Form.Label>

                                <Form.Range
                                    min={0}
                                    max={2000000}
                                    step={50000}
                                    value={minPrice}
                                    onChange={e => setMinPrice(Number(e.target.value))}
                                />

                                <Form.Range
                                    min={0}
                                    max={2000000}
                                    step={50000}
                                    value={maxPrice}
                                    onChange={e => setMaxPrice(Number(e.target.value))}
                                />

                                <div className="d-flex gap-2">
                                    <Form.Control
                                        type="number"
                                        value={minPrice}
                                        onChange={e => setMinPrice(Number(e.target.value))}
                                    />
                                    <Form.Control
                                        type="number"
                                        value={maxPrice}
                                        onChange={e => setMaxPrice(Number(e.target.value))}
                                    />
                                </div>
                            </Form.Group>


                            <Button  variant="success" className="w-100 mb-2" onClick={handleFilter}>
                                Áp dụng
                            </Button>

                            <Button
                                variant="outline-warning"
                                className="w-100"
                                onClick={handleClearFilter}
                            >
                                Clear bộ lọc
                            </Button>
                        </div>
                    </Col>

                    {/* PRODUCT GRID */}
                    <Col md={9}>
                        {loading ? (
                            <Row className="g-4">
                                {[...Array(6)].map((_, i) => (
                                    <Col md={4} key={i}>
                                        <Card className="p-3 shadow-sm">
                                            <div className="skeleton-img mb-3"/>
                                            <div className="skeleton-text mb-2"/>
                                            <div className="skeleton-text w-50"/>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        ) : products.length === 0 ? (
                            <p className="text-center mt-4 text-muted">
                                Không tìm thấy sản phẩm
                            </p>
                        ) : (
                            <Row className="g-4">
                                {products.map(p => (
                                    <Col md={4} key={p.id}>
                                        <Card className="product-card h-100 shadow-sm">
                                            <div className="img-wrapper">
                                                <Card.Img
                                                    variant="top"
                                                    src={p.thumbnail}
                                                    alt={p.name}
                                                />
                                                {p.discountedPrice && (
                                                    <Badge bg="danger" className="discount-badge">
                                                        SALE
                                                    </Badge>
                                                )}
                                            </div>

                                            <Card.Body>

                                                {/* Tên sản phẩm */}
                                                <h6 className="product-title">{p.name}</h6>

                                                <div className="d-flex align-items-center gap-3 mt-2">

                                                    <Button
                                                        size="sm"
                                                        variant="outline-success"
                                                        onClick={() => handleAddToCart(p.id)}
                                                        disabled={cartLoading === p.id}
                                                    >
                                                        {cartLoading === p.id ? "..." : (
                                                            <FontAwesomeIcon icon={faCartShopping}/>
                                                        )}
                                                    </Button>

                                                    <div className="price-box">
                                                        {p.discountedPrice ? (
                                                            <>
                    <span className="old-price">
                        {p.originalPrice?.toLocaleString()}đ
                    </span>
                                                                <span className="new-price">
                        {p.discountedPrice.toLocaleString()}đ
                    </span>
                                                            </>
                                                        ) : (
                                                            <span className="new-price">
                    {p.originalPrice?.toLocaleString()}đ
                </span>
                                                        )}
                                                    </div>

                                                </div>


                                                <Button
                                                    variant="outline-success"
                                                    size="sm"
                                                    className="w-100 mt-2"
                                                    onClick={() => navigate(`/products/${p.id}`)}
                                                >
                                                    Xem chi tiết
                                                </Button>

                                            </Card.Body>


                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}

                        {/* PAGINATION */}
                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center mt-4">
                                <Pagination>
                                    <Pagination.First
                                        onClick={() => handlePageChange(1)}
                                        disabled={page === 1}
                                    />

                                    <Pagination.Prev
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                    />

                                    {[...Array(totalPages)].map((_, i) => (
                                        <Pagination.Item
                                            key={i + 1}
                                            active={i + 1 === page}
                                            onClick={() => handlePageChange(i + 1)}
                                        >
                                            {i + 1}
                                        </Pagination.Item>
                                    ))}

                                    <Pagination.Next
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalPages}
                                    />

                                    <Pagination.Last
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={page === totalPages}
                                    />
                                </Pagination>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
}

export default ViewProduct;
