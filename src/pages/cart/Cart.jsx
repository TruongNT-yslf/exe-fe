import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Spinner, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaChevronLeft, FaShoppingBasket, FaTruckMoving } from 'react-icons/fa';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../assets/css/Cart.css';
const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const axiosConfig = {
        headers: { 'Authorization': `Bearer ${token}` }
    };

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/cart', axiosConfig);
            if (response.data.success) {
                setCart(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) navigate('/login');
        else fetchCart();
    }, []);

    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        setUpdatingId(productId);
        try {
            const response = await axios.put(
                `http://localhost:8080/api/cart/item/${productId}`,
                null,
                { ...axiosConfig, params: { quantity: newQuantity } }
            );
            if (response.data.success) {
                setCart(response.data.data);
            }
        } catch (error) {
            alert("Không thể cập nhật số lượng. Vui lòng thử lại.");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteItem = async (productId) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) return;
        try {
            const response = await axios.delete(
                `http://localhost:8080/api/cart/item/${productId}`,
                axiosConfig
            );
            if (response.data.success) {
                setCart(response.data.data);
            }
        } catch (error) {
            alert("Lỗi khi xóa sản phẩm");
        }
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    if (loading) return (
        <div className="cart-loading-state">
            <Spinner animation="grow" variant="success" />
            <p>Đang kiểm tra giỏ hàng của bạn...</p>
        </div>
    );

    return (
        <div className="cart-page-wrapper">
            <Header />
            <div className="header-spacer"></div>

            <Container className="py-5">
                <div className="cart-header mb-5">
                    <h2 className="fw-bold text-success d-flex align-items-center">
                        <FaShoppingBasket className="me-3" /> GIỎ HÀNG CỦA BẠN
                    </h2>
                    <div className="green-line"></div>
                </div>

                {(!cart || !cart.items || cart.items.length === 0) ? (
                    <div className="empty-cart-box text-center py-5 shadow-sm rounded-4 bg-white border">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
                            alt="Empty Cart"
                            className="mb-4 opacity-75"
                            style={{ width: '180px' }}
                        />
                        <h4 className="fw-bold">Giỏ hàng trống</h4>
                        <p className="text-muted mb-4">Bạn chưa thêm sản phẩm mây tre nào vào giỏ.</p>
                        <Button as={Link} to="/products" variant="success" className="rounded-pill px-5 shadow-green">
                            KHÁM PHÁ SẢN PHẨM
                        </Button>
                    </div>
                ) : (
                    <Row className="g-4">
                        {/* DANH SÁCH SẢN PHẨM */}
                        <Col lg={8}>
                            <div className="cart-items-list rounded-4 shadow-sm bg-white overflow-hidden border">
                                <Table responsive hover className="mb-0 align-middle">
                                    <thead className="bg-light text-secondary small uppercase">
                                    <tr>
                                        <th className="ps-4 py-3">Sản phẩm</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Thành tiền</th>
                                        <th className="pe-4"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {cart.items.map((item) => (
                                        <tr key={item.productId} className={updatingId === item.productId ? 'row-updating' : ''}>
                                            <td className="ps-4 py-4">
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={item.thumbnail}
                                                        alt={item.productName}
                                                        className="product-img-cart rounded-3 border me-3"
                                                    />
                                                    <span className="fw-bold text-dark product-name-link">{item.productName}</span>
                                                </div>
                                            </td>
                                            <td className="text-muted">{formatPrice(item.price)}</td>
                                            <td>
                                                <div className="cart-qty-control">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                                        disabled={updatingId === item.productId || item.quantity <= 1}
                                                    >−</button>
                                                    <input type="text" value={item.quantity} readOnly />
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                                        disabled={updatingId === item.productId}
                                                    >+</button>
                                                </div>
                                            </td>
                                            <td className="fw-bold text-success">
                                                {formatPrice(item.subTotal)}
                                            </td>
                                            <td className="pe-4 text-end">
                                                <button
                                                    className="btn-remove"
                                                    onClick={() => handleDeleteItem(item.productId)}
                                                    title="Xóa khỏi giỏ hàng"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </div>
                            <Button as={Link} to="/products" variant="link" className="text-success mt-4 p-0 text-decoration-none d-flex align-items-center">
                                <FaChevronLeft className="me-2" size={10} /> Tiếp tục mua sắm
                            </Button>
                        </Col>

                        {/* TỔNG KẾT ĐƠN HÀNG */}
                        <Col lg={4}>
                            <Card className="summary-card border-0 shadow-sm rounded-4">
                                <Card.Body className="p-4">
                                    <h5 className="fw-bold mb-4 border-bottom pb-3">TÓM TẮT ĐƠN HÀNG</h5>
                                    <div className="summary-row d-flex justify-content-between mb-3">
                                        <span className="text-muted">Tạm tính ({cart.items.length} sản phẩm)</span>
                                        <span className="fw-bold text-dark">{formatPrice(cart.totalAmount)}</span>
                                    </div>
                                    <div className="summary-row d-flex justify-content-between mb-3">
                                        <span className="text-muted">Phí vận chuyển</span>
                                        <span className="text-success fw-bold">Miễn phí</span>
                                    </div>
                                    <div className="shipping-notice mb-4">
                                        <small className="text-muted d-flex align-items-center">
                                            <FaTruckMoving className="me-2" /> Sản phẩm mây tre đan thủ công được đóng gói cẩn thận.
                                        </small>
                                    </div>
                                    <hr className="my-4" />
                                    <div className="total-row d-flex justify-content-between mb-4 align-items-end">
                                        <span className="fs-6 fw-bold">TỔNG CỘNG</span>
                                        <span className="total-amount text-danger fw-bolder fs-4">
                                            {formatPrice(cart.totalAmount)}
                                        </span>
                                    </div>
                                    <Button
                                        variant="success"
                                        size="lg"
                                        className="w-100 rounded-pill py-3 fw-bold checkout-btn shadow-green"
                                        onClick={() => navigate('/checkout')}
                                    >
                                        ĐẶT HÀNG NGAY
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>
            <Footer />
        </div>
    );
};

export default Cart;