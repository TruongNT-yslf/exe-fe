import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Spinner, Card, Form } from 'react-bootstrap';
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
    const [selectedIds, setSelectedIds] = useState([]); // State lưu các item được chọn

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const axiosConfig = { headers: { 'Authorization': `Bearer ${token}` } };

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/cart', axiosConfig);
            if (response.data.success) {
                setCart(response.data.data);
                // Mặc định chọn tất cả khi mới load hoặc có thể để mảng rỗng []
                const allIds = response.data.data.items.map(item => item.productId);
                setSelectedIds(allIds);
            }
        } catch (error) {
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

    // Xử lý chọn/bỏ chọn từng item
    const handleSelectItem = (productId) => {
        setSelectedIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    // Xử lý chọn tất cả
    const handleSelectAll = () => {
        if (selectedIds.length === cart.items.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(cart.items.map(item => item.productId));
        }
    };

    // Tính toán tổng tiền dựa trên các item được tick chọn
    const calculateSelectedTotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items
            .filter(item => selectedIds.includes(item.productId))
            .reduce((sum, item) => sum + item.subTotal, 0);
    };

    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        setUpdatingId(productId);
        try {
            const response = await axios.put(
                `http://localhost:8080/api/cart/item/${productId}`,
                null,
                { ...axiosConfig, params: { quantity: newQuantity } }
            );
            if (response.data.success) setCart(response.data.data);
        } catch (error) {
            alert("Lỗi cập nhật số lượng");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteItem = async (productId) => {
        if (!window.confirm("Xóa sản phẩm này?")) return;
        try {
            const response = await axios.delete(`http://localhost:8080/api/cart/item/${productId}`, axiosConfig);
            if (response.data.success) {
                setCart(response.data.data);
                setSelectedIds(prev => prev.filter(id => id !== productId));
            }
        } catch (error) {
            alert("Lỗi khi xóa");
        }
    };

    const handleCheckout = () => {
        if (selectedIds.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
            return;
        }
        // Gửi thông tin các item đã chọn sang trang checkout
        const selectedItems = cart.items.filter(item => selectedIds.includes(item.productId));
        navigate('/checkout', { state: { items: selectedItems, total: calculateSelectedTotal() } });
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    if (loading) return <div className="cart-loading-state"><Spinner animation="grow" variant="success" /><p>Đang tải...</p></div>;

    return (
        <div className="cart-page-wrapper">
            <Header />
            <div className="header-spacer"></div>

            <Container className="py-5">
                <div className="cart-header mb-5">
                    <h2 className="fw-bold text-success d-flex align-items-center">
                        <FaShoppingBasket className="me-3" /> GIỎ HÀNG
                    </h2>
                    <div className="green-line"></div>
                </div>

                {(!cart || !cart.items || cart.items.length === 0) ? (
                    <div className="empty-cart-box text-center py-5 shadow-sm rounded-4 bg-white border">
                        <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty" className="mb-4 opacity-75" style={{ width: '180px' }} />
                        <h4 className="fw-bold">Giỏ hàng trống</h4>
                        <Button as={Link} to="/products" variant="success" className="rounded-pill px-5">MUA SẮM NGAY</Button>
                    </div>
                ) : (
                    <Row className="g-4">
                        <Col lg={8}>
                            <div className="cart-items-list rounded-4 shadow-sm bg-white border">
                                <Table responsive hover className="mb-0 align-middle">
                                    <thead className="bg-light">
                                    <tr>
                                        <th className="ps-4">
                                            <Form.Check
                                                type="checkbox"
                                                checked={selectedIds.length === cart.items.length}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th>Sản phẩm</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Thành tiền</th>
                                        <th className="pe-4"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {cart.items.map((item) => (
                                        <tr key={item.productId} className={updatingId === item.productId ? 'row-updating' : ''}>
                                            <td className="ps-4">
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selectedIds.includes(item.productId)}
                                                    onChange={() => handleSelectItem(item.productId)}
                                                />
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img src={item.thumbnail} alt={item.productName} className="product-img-cart rounded-3 border me-3" />
                                                    <span className="fw-bold text-dark">{item.productName}</span>
                                                </div>
                                            </td>
                                            <td className="text-muted">{formatPrice(item.price)}</td>
                                            <td>
                                                <div className="cart-qty-control">
                                                    <button onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)} disabled={updatingId === item.productId || item.quantity <= 1}>−</button>
                                                    <input type="text" value={item.quantity} readOnly />
                                                    <button onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)} disabled={updatingId === item.productId}>+</button>
                                                </div>
                                            </td>
                                            <td className="fw-bold text-success">{formatPrice(item.subTotal)}</td>
                                            <td className="pe-4 text-end">
                                                <button className="btn-remove" onClick={() => handleDeleteItem(item.productId)}><FaTrash size={14} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>

                        <Col lg={4}>
                            <Card className="summary-card border-0 shadow-sm rounded-4">
                                <Card.Body className="p-4">
                                    <h5 className="fw-bold mb-4 border-bottom pb-3">TỔNG ĐƠN HÀNG</h5>
                                    <div className="summary-row d-flex justify-content-between mb-3">
                                        <span className="text-muted">Đã chọn:</span>
                                        <span className="fw-bold">{selectedIds.length} sản phẩm</span>
                                    </div>
                                    <div className="total-row d-flex justify-content-between mb-4 align-items-end">
                                        <span className="fs-6 fw-bold">TỔNG THANH TOÁN</span>
                                        <span className="total-amount text-danger fw-bolder fs-4">
                                            {formatPrice(calculateSelectedTotal())}
                                        </span>
                                    </div>
                                    <Button
                                        variant="success"
                                        size="lg"
                                        className="w-100 rounded-pill py-3 fw-bold checkout-btn shadow-green"
                                        onClick={handleCheckout}
                                        disabled={selectedIds.length === 0}
                                    >
                                        THANH TOÁN ({selectedIds.length})
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