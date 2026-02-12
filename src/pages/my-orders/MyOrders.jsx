import React, {useState, useEffect, useContext} from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Badge,
    Modal,
    Table,
    Pagination,
    Spinner,
    Form
} from 'react-bootstrap';
import {
    BoxSeam,
    Clock,
    CheckCircle,
    Truck,
    CheckLg,
    XCircle,
    Eye,
    FileText,
    Person,
    Envelope,
    Telephone,
    GeoAlt,
    CurrencyDollar,
    Calendar,
    Search, ArrowReturnLeft, Speedometer2, House, BoxArrowRight
} from 'react-bootstrap-icons';
import {getUserOrders, cancelOrder} from "../../api/auth";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";

export default function MyOrders() {

    const {user} = useContext(AuthContext);
    const userId = user.userId;
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const {logout} = useContext(AuthContext);
    const navigate = useNavigate();
    // States
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailModalShow, setDetailModalShow] = useState(false);
    const [noteModalShow, setNoteModalShow] = useState(false);
    // State cho hủy đơn hàng
    const [cancelModalShow, setCancelModalShow] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelLoading, setCancelLoading] = useState(false);


    // Bộ lọc & phân trang
    const [filters, setFilters] = useState({status: ''});
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalElements: 0
    });

    // 🟢 Gọi API mỗi khi userId, filters, pagination thay đổi
    useEffect(() => {
        if (userId) {
            fetchMyOrders();
        } else {
            console.warn("Không tìm thấy userId trong localStorage");
            // Fallback: hiển thị mock data nếu muốn test UI
            setOrders(mockOrders);
        }
    }, [userId, filters.status, pagination.currentPage, pagination.pageSize]);

    // 🟢 Hàm gọi API lấy đơn hàng theo userId
    const fetchMyOrders = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const params = {
                userId: parseInt(userId),          // gửi userId lên param
                page: pagination.currentPage - 1,  // zero‑based
                size: pagination.pageSize,
                status: filters.status || undefined
            };

            const response = await getUserOrders(params);
            if (response.success) {
                setOrders(response.data.content || []);
                setPagination({
                    currentPage: response.data.currentPage || 1,
                    pageSize: response.data.pageSize || 10,
                    totalPages: response.data.totalPages || 1,
                    totalElements: response.data.totalElements || 0
                });
            } else {
                // fallback nếu API trả về không thành công
                setOrders(mockOrders);
            }
        } catch (error) {
            console.error('Lỗi lấy đơn hàng:', error);
            setOrders(mockOrders); // fallback hiển thị mock
        } finally {
            setLoading(false);
        }
    };

    // Mở modal hủy đơn
    const openCancelModal = (order) => {
        setSelectedOrder(order);
        setCancelReason('');
        setCancelModalShow(true);
    };

    // Xử lý xác nhận hủy đơn
    const handleCancelOrder = async () => {
        if (!selectedOrder) return;
        if (!cancelReason.trim()) {
            alert('Vui lòng nhập lý do hủy đơn hàng');
            return;
        }
        setCancelLoading(true);
        try {
            await cancelOrder(selectedOrder.id, cancelReason);
            alert('Hủy đơn hàng thành công!');
            setCancelModalShow(false);
            fetchMyOrders(); // reload danh sách
        } catch (error) {
            console.error('Lỗi hủy đơn:', error);
            alert('Có lỗi xảy ra: ' + error.message);
        } finally {
            setCancelLoading(false);
        }
    };


    // 📦 Mock data – dùng khi chưa có API hoặc lỗi
    const mockOrders = [
        {
            id: 101,
            customerName: 'Lương Xuân Lộc',
            customerEmail: 'lexuanloc26022004@gmail.com',
            customerPhone: '0123456789',
            shippingAddress: 'Abc, Thạch Thất, Hà Nội',
            note: 'Giao hàng giờ hành chính',
            totalPrice: 90000,
            status: 'APPROVED',
            createdAt: '2026-02-10T10:30:00',
            items: [
                {productName: 'Tranh treo tường', quantity: 2, price: 36000},
                {productName: 'Tượng gỗ nhỏ', quantity: 1, price: 18000}
            ]
        },
        {
            id: 102,
            customerName: 'Lương Xuân Lộc',
            customerEmail: 'lexuanloc26022004@gmail.com',
            customerPhone: '0123456789',
            shippingAddress: '123 Đường XYZ, Quận 1, TP.HCM',
            note: '',
            totalPrice: 140000,
            status: 'SHIPPING',
            createdAt: '2026-02-09T15:20:00',
            items: [
                {productName: 'Giỏ mây tre', quantity: 2, price: 45000},
                {productName: 'Đèn lồng', quantity: 1, price: 50000}
            ]
        },
        {
            id: 103,
            customerName: 'Lương Xuân Lộc',
            customerEmail: 'lexuanloc26022004@gmail.com',
            customerPhone: '0123456789',
            shippingAddress: 'Abc, Thạch Thất, Hà Nội',
            note: 'Kiểm tra hàng trước khi nhận',
            totalPrice: 185000,
            status: 'DELIVERED',
            createdAt: '2026-02-08T09:15:00',
            items: [
                {productName: 'Bộ ấm trà', quantity: 1, price: 120000},
                {productName: 'Khung ảnh', quantity: 2, price: 32500}
            ]
        },
        {
            id: 104,
            customerName: 'Lương Xuân Lộc',
            customerEmail: 'lexuanloc26022004@gmail.com',
            customerPhone: '0123456789',
            shippingAddress: 'Abc, Thạch Thất, Hà Nội',
            note: 'Đổi màu sắc',
            totalPrice: 230000,
            status: 'CANCELLED',
            createdAt: '2026-02-07T11:45:00',
            items: [
                {productName: 'Ghế mây', quantity: 1, price: 230000}
            ]
        }
    ];

    // ================ HÀM TIỆN ÍCH ================
    const formatPrice = (price) => {
        if (!price && price !== 0) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        switch (status?.toUpperCase()) {
            case 'PENDING':
                return 'warning';
            case 'APPROVED':
                return 'info';
            case 'SHIPPING':
                return 'primary';
            case 'DELIVERED':
                return 'success';
            case 'CANCELLED':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    const getStatusText = (status) => {
        switch (status?.toUpperCase()) {
            case 'PENDING':
                return 'Chờ xử lý';
            case 'APPROVED':
                return 'Đã xác nhận';
            case 'SHIPPING':
                return 'Đang giao';
            case 'DELIVERED':
                return 'Đã giao';
            case 'CANCELLED':
                return 'Đã hủy';
            default:
                return status || 'N/A';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toUpperCase()) {
            case 'PENDING':
                return <Clock className="me-1"/>;
            case 'APPROVED':
                return <CheckCircle className="me-1"/>;
            case 'SHIPPING':
                return <Truck className="me-1"/>;
            case 'DELIVERED':
                return <CheckLg className="me-1"/>;
            case 'CANCELLED':
                return <XCircle className="me-1"/>;
            default:
                return <Clock className="me-1"/>;
        }
    };

    // ================ XỬ LÝ MODAL ================
    const openDetailModal = (order) => {
        setSelectedOrder(order);
        setDetailModalShow(true);
    };

    const openNoteModal = (order) => {
        setSelectedOrder(order);
        setNoteModalShow(true);
    };

    // ================ PHÂN TRANG ================
    const renderPagination = () => {
        const items = [];
        items.push(
            <Pagination.First
                key="first"
                onClick={() => setPagination(p => ({...p, currentPage: 1}))}
                disabled={pagination.currentPage === 1}
            />,
            <Pagination.Prev
                key="prev"
                onClick={() => setPagination(p => ({...p, currentPage: p.currentPage - 1}))}
                disabled={pagination.currentPage === 1}
            />
        );

        for (let page = 1; page <= pagination.totalPages; page++) {
            if (page === 1 || page === pagination.totalPages ||
                (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)) {
                items.push(
                    <Pagination.Item
                        key={page}
                        active={page === pagination.currentPage}
                        onClick={() => setPagination(p => ({...p, currentPage: page}))}
                    >
                        {page}
                    </Pagination.Item>
                );
            } else if (page === pagination.currentPage - 2 || page === pagination.currentPage + 2) {
                items.push(<Pagination.Ellipsis key={`ellipsis-${page}`}/>);
            }
        }

        items.push(
            <Pagination.Next
                key="next"
                onClick={() => setPagination(p => ({...p, currentPage: p.currentPage + 1}))}
                disabled={pagination.currentPage === pagination.totalPages}
            />,
            <Pagination.Last
                key="last"
                onClick={() => setPagination(p => ({...p, currentPage: pagination.totalPages}))}
                disabled={pagination.currentPage === pagination.totalPages}
            />
        );
        return <Pagination>{items}</Pagination>;
    };

    return (
        <Container fluid className="py-4">

            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="fw-bold">Đơn hàng của tôi</h2>
                    <p className="text-muted">Theo dõi trạng thái và lịch sử mua hàng</p>
                </Col>
                <Col className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>
                            <ArrowReturnLeft className="me-1" size={14}/>
                            Trở về trang trước đó
                        </Button>
                        {/* Nút trở về trang chủ */}
                        <Link to="/">
                            <Button variant="outline-secondary" size="sm">
                                <House className="me-1" size={14}/>
                                Trang chủ
                            </Button>
                        </Link>

                        {/* Nút đăng xuất */}
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={handleLogout}
                        >
                            <BoxArrowRight className="me-1" size={14}/>
                            Đăng xuất
                        </Button>
                    </div>
                </Col>
            </Row>


            {/* Bộ lọc trạng thái */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Body>
                    <Row className="g-3 align-items-end">
                        <Col md={3}>
                            <Form.Label>Lọc theo trạng thái</Form.Label>
                            <Form.Select
                                value={filters.status}
                                onChange={(e) => {
                                    setFilters({status: e.target.value});
                                    setPagination(p => ({...p, currentPage: 1}));
                                }}
                            >
                                <option value="">Tất cả đơn hàng</option>
                                <option value="PENDING">Chờ xử lý</option>
                                <option value="APPROVED">Đã xác nhận</option>
                                <option value="SHIPPING">Đang giao</option>
                                <option value="DELIVERED">Đã giao</option>
                                <option value="CANCELLED">Đã hủy</option>
                            </Form.Select>
                        </Col>
                        <Col md={2}>
                            <Button variant="primary" onClick={fetchMyOrders} className="w-100">
                                <Search className="me-1"/> Lọc
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Danh sách đơn hàng */}
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary"/>
                    <p className="mt-2">Đang tải đơn hàng...</p>
                </div>
            ) : orders.length === 0 ? (
                <Card className="text-center py-5 shadow-sm">
                    <Card.Body>
                        <BoxSeam size={48} className="text-muted mb-3"/>
                        <h5>Chưa có đơn hàng nào</h5>
                        <p className="text-muted">Bạn chưa đặt mua sản phẩm nào.</p>
                        <Button variant="primary" href="/products">Tiếp tục mua sắm</Button>
                    </Card.Body>
                </Card>
            ) : (
                <>
                    {/* Danh sách đơn hàng - dạng lưới */}
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {orders.map((order) => (
                            <Col key={order.id}>
                                <Card className="h-100 shadow-sm border-0">
                                    <Card.Body className="d-flex flex-column">
                                        {/* Header: Mã đơn + Badge trạng thái */}
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h6 className="fw-bold mb-0">Đơn hàng #{order.id}</h6>
                                            <Badge bg={getStatusBadge(order.status)} className="px-3 py-2">
                                                {getStatusIcon(order.status)}
                                                {getStatusText(order.status)}
                                            </Badge>
                                        </div>

                                        {/* Ngày đặt */}
                                        <div className="text-muted small mb-2">
                                            <Calendar className="me-1" size={14}/>
                                            {formatDate(order.createdAt)}
                                        </div>

                                        {/* Tổng tiền */}
                                        <div className="mt-2 mb-2">
                                            <span className="fw-bold">Tổng tiền:</span>
                                            <span className="text-primary fw-bold fs-6 ms-2">
                            {formatPrice(order.totalPrice)}
                        </span>
                                        </div>

                                        {/* Địa chỉ giao hàng (cắt ngắn nếu dài) */}
                                        <div className="text-truncate mb-2" style={{maxWidth: '100%'}}>
                                            <GeoAlt className="me-1 text-secondary" size={14}/>
                                            {order.shippingAddress}
                                        </div>

                                        {/* Ghi chú (nếu có) */}
                                        {order.note && (
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="p-0 mt-1 text-start"
                                                onClick={() => openNoteModal(order)}
                                            >
                                                <FileText className="me-1"/> Xem ghi chú
                                            </Button>
                                        )}

                                        {/* Nút xem chi tiết - đẩy xuống dưới cùng */}
                                        <div className="mt-auto pt-3 text-end">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => openDetailModal(order)}
                                            >
                                                <Eye className="me-1"/> Chi tiết
                                            </Button>
                                        </div>

                                        {/* Nút hủy đơn - chỉ hiển thị nếu đơn hàng đang ở trạng thái có thể hủy */}
                                        {(order.status === 'PENDING' || order.status === 'APPROVED') && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="mt-2 w-100"
                                                onClick={() => openCancelModal(order)}
                                            >
                                                <XCircle className="me-1" /> Hủy đơn
                                            </Button>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Phân trang */}
                    {orders.length > 0 && (
                        <Row className="mt-4">
                            <Col className="d-flex justify-content-end">
                                {renderPagination()}
                            </Col>
                        </Row>
                    )}
                </>
            )}

            {/* Modal hiển thị ghi chú */}
            <Modal show={noteModalShow} onHide={() => setNoteModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Ghi chú đơn hàng #{selectedOrder?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{whiteSpace: 'pre-wrap'}}>
                    {selectedOrder?.note || 'Không có ghi chú'}
                </Modal.Body>
                {(selectedOrder?.status === 'PENDING' || selectedOrder?.status === 'APPROVED') && (
                    <Button
                        variant="danger"
                        onClick={() => {
                            setDetailModalShow(false);
                            openCancelModal(selectedOrder);
                        }}
                    >
                        <XCircle className="me-1" /> Hủy đơn hàng
                    </Button>
                )}
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setNoteModalShow(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal chi tiết đơn hàng */}
            <Modal show={detailModalShow} onHide={() => setDetailModalShow(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết đơn hàng #{selectedOrder?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <>
                            {/* Thông tin khách hàng */}
                            <Card className="mb-3">
                                <Card.Header className="bg-light">
                                    <h6 className="mb-0">
                                        <Person className="me-2"/>
                                        Thông tin nhận hàng
                                    </h6>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <p>
                                                <strong>
                                                    <Person className="me-2"/>
                                                    Họ tên:
                                                </strong>{' '}
                                                {selectedOrder.customerName}
                                            </p>
                                            <p>
                                                <strong>
                                                    <Envelope className="me-2"/>
                                                    Email:
                                                </strong>{' '}
                                                {selectedOrder.customerEmail || 'N/A'}
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <p>
                                                <strong>
                                                    <Telephone className="me-2"/>
                                                    SĐT:
                                                </strong>{' '}
                                                {selectedOrder.customerPhone || 'N/A'}
                                            </p>
                                            <p>
                                                <strong>
                                                    <GeoAlt className="me-2"/>
                                                    Địa chỉ:
                                                </strong>{' '}
                                                {selectedOrder.shippingAddress}
                                            </p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Thông tin đơn hàng */}
                            <Card className="mb-3">
                                <Card.Header className="bg-light">
                                    <h6 className="mb-0">
                                        <BoxSeam className="me-2"/>
                                        Thông tin đơn hàng
                                    </h6>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <p>
                                                <strong>Mã đơn:</strong> #{selectedOrder.id}
                                            </p>
                                            <p>
                                                <strong>Trạng thái:</strong>
                                                <Badge
                                                    bg={getStatusBadge(selectedOrder.status)}
                                                    className="ms-2"
                                                >
                                                    {getStatusIcon(selectedOrder.status)}
                                                    {getStatusText(selectedOrder.status)}
                                                </Badge>
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <p>
                                                <strong>
                                                    <CurrencyDollar className="me-2"/>
                                                    Tổng tiền:
                                                </strong>
                                                <span className="fw-bold text-primary ms-2">
                                                    {formatPrice(selectedOrder.totalPrice)}
                                                </span>
                                            </p>
                                            <p>
                                                <strong>
                                                    <Calendar className="me-2"/>
                                                    Ngày đặt:
                                                </strong>{' '}
                                                {formatDate(selectedOrder.createdAt)}
                                            </p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Danh sách sản phẩm */}
                            <Card>
                                <Card.Header className="bg-light">
                                    <h6 className="mb-0">
                                        <BoxSeam className="me-2"/>
                                        Sản phẩm đã mua
                                    </h6>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <Table striped bordered hover className="mb-0">
                                        <thead>
                                        <tr>
                                            <th width="50">STT</th>
                                            <th>Tên sản phẩm</th>
                                            <th width="100">Số lượng</th>
                                            <th width="150">Đơn giá</th>
                                            <th width="150">Thành tiền</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {selectedOrder.items?.length > 0 ? (
                                            selectedOrder.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="align-middle">{idx + 1}</td>
                                                    <td className="align-middle">{item.productName}</td>
                                                    <td className="align-middle text-center">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="align-middle text-end">
                                                        {formatPrice(item.price)}
                                                    </td>
                                                    <td className="align-middle text-end fw-bold">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-3">
                                                    Không có sản phẩm
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                        <tfoot>
                                        <tr>
                                            <td colSpan="4" className="text-end fw-bold">
                                                Tổng cộng:
                                            </td>
                                            <td className="text-end fw-bold text-primary">
                                                {formatPrice(selectedOrder.totalPrice)}
                                            </td>
                                        </tr>
                                        </tfoot>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDetailModalShow(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal hủy đơn hàng */}
            <Modal show={cancelModalShow} onHide={() => !cancelLoading && setCancelModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Hủy đơn hàng #{selectedOrder?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
                    <Form.Group className="mt-3">
                        <Form.Label>Lý do hủy <span className="text-danger">*</span>:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Nhập lý do hủy đơn hàng..."
                            disabled={cancelLoading}
                            required
                        />
                        {!cancelReason.trim() && (
                            <small className="text-danger">Vui lòng nhập lý do hủy</small>
                        )}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setCancelModalShow(false)} disabled={cancelLoading}>
                        Hủy bỏ
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleCancelOrder}
                        disabled={cancelLoading || !cancelReason.trim()}
                    >
                        {cancelLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Đang xử lý...
                            </>
                        ) : (
                            'Xác nhận hủy'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}