"use client"
import { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Table,
    Badge,
    Modal,
    Pagination,
    OverlayTrigger,
    Tooltip,
    Form,
} from 'react-bootstrap';
import {
    Search,
    Filter,
    Eye,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    Truck,
    CheckLg,
    BoxSeam,
    ArrowClockwise,
    Person,
    Envelope,
    Telephone,
    GeoAlt,
    CurrencyDollar,
    Calendar
} from 'react-bootstrap-icons';
import adminOrderApi from "../../../api/AdminOrderApi";
import AdminHeader from "../../../components/admin/AdminHeader";
import Logo from "../../../assets/images/LOGO-EXE.png";
import {Helmet} from "react-helmet-async";
const AdminOrderList = () => {
    // States
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noteModalShow, setNoteModalShow] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailModalShow, setDetailModalShow] = useState(false);
    const [actionModalShow, setActionModalShow] = useState(false);
    const [actionType, setActionType] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        keyword: '',
        status: '',
    });

    // Pagination states
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalElements: 0
    });

    // Fetch orders
    useEffect(() => {
        fetchOrders();
    }, [filters, pagination.currentPage, pagination.pageSize]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.currentPage - 1, // API dùng zero-based index
                size: pagination.pageSize,
                ...filters
            };

            // Clean up empty params
            Object.keys(params).forEach(key => {
                if (params[key] === '' || params[key] === undefined) {
                    delete params[key];
                }
            });

            const response = await adminOrderApi.getAllOrders(params);

            if (response.success) {
                const ordersData = response.data.content || [];
                setOrders(ordersData);

                // Cập nhật phân trang từ API response
                setPagination({
                    currentPage: response.data.currentPage || 1,
                    pageSize: response.data.pageSize || 10,
                    totalPages: response.data.totalPages || 1,
                    totalElements: response.data.totalElements || 0
                });
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            // Fallback data
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleResetFilters = () => {
        setFilters({
            keyword: '',
            status: ''
        });
    };

    // Open note modal
    const openNoteModal = (order) => {
        setSelectedOrder(order);
        setNoteModalShow(true);
    };

    // Open detail modal
    const openDetailModal = async (order) => {
        setSelectedOrder(order);
        setDetailModalShow(true);
    };

    // Open action modal
    const openActionModal = (order, type) => {
        setSelectedOrder(order);
        setActionType(type);
        setRejectReason('');
        setActionModalShow(true);
    };

    // Handle order actions
    const handleOrderAction = async () => {
        if (!selectedOrder) return;

        // Kiểm tra nếu là từ chối mà không có lý do
        if (actionType === 'reject' && !rejectReason.trim()) {
            alert('Vui lòng nhập lý do từ chối');
            return;
        }
        console.log("Trạng thái hiện tại:" + actionType);
        setActionLoading(true); // Bắt đầu loading
        try {
            if (actionType === 'accept') {
                await adminOrderApi.acceptOrder(selectedOrder.id);
                alert('Đã chấp nhận đơn hàng thành công!');
            } else if (actionType === 'reject') {
                await adminOrderApi.rejectOrder(selectedOrder.id, rejectReason);
                alert('Đã từ chối đơn hàng thành công!');
            } else if (actionType === 'ship') {
                await adminOrderApi.confirmShipping(selectedOrder.id);
                alert('Đã xác nhận đơn hàng đang giao!');
            }

            setActionModalShow(false);
            fetchOrders(); // Refresh list
        } catch (error) {
            console.error('Error processing order action:', error);
            alert('Có lỗi xảy ra: ' + error.message);
        } finally {
            setActionLoading(false); // Kết thúc loading
        }
    };

    // Format price
    const formatPrice = (price) => {
        if (!price && price !== 0) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status badge color
    const getStatusBadge = (status) => {
        switch (status?.toUpperCase()) {
            case 'PENDING':
                return 'warning';
            case 'APPROVED':
                return 'info'
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

    // Get status display text
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

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status?.toUpperCase()) {
            case 'PENDING':
                return <Clock className="me-1" />;
            case 'APPROVED':
                return <CheckCircle className="me-1" />;
            case 'SHIPPING':
                return <Truck className="me-1" />;
            case 'DELIVERED':
                return <CheckLg className="me-1" />;
            case 'CANCELLED':
                return <XCircle className="me-1" />;
            default:
                return <Clock className="me-1" />;
        }
    };

    // Render pagination
    const renderPagination = () => {
        const items = [];

        items.push(
            <Pagination.First
                key="first"
                onClick={() => setPagination(prev => ({ ...prev, currentPage: 1 }))}
                disabled={pagination.currentPage === 1}
            />
        );

        items.push(
            <Pagination.Prev
                key="prev"
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
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
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                    >
                        {page}
                    </Pagination.Item>
                );
            } else if (page === pagination.currentPage - 2 || page === pagination.currentPage + 2) {
                items.push(<Pagination.Ellipsis key={`ellipsis-${page}`} />);
            }
        }

        items.push(
            <Pagination.Next
                key="next"
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.totalPages}
            />
        );

        items.push(
            <Pagination.Last
                key="last"
                onClick={() => setPagination(prev => ({ ...prev, currentPage: pagination.totalPages }))}
                disabled={pagination.currentPage === pagination.totalPages}
            />
        );

        return <Pagination>{items}</Pagination>;
    };

    // Statistics calculation
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'PENDING').length,
        approved: orders.filter(o => o.status === 'APPROVED').length,
        shipping: orders.filter(o => o.status === 'SHIPPING').length,
        delivered: orders.filter(o => o.status === 'DELIVERED').length,
        cancelled: orders.filter(o => o.status === 'CANCELLED').length
    };

    return (
        <Container fluid className="py-4">
            {/* Header */}
            <AdminHeader/>
            <Helmet>
                <title>Danh sách đơn hàng</title>
                <link rel="icon" href={Logo} />
            </Helmet>
            {/* Statistics Cards */}
            <Row className="mb-4">
                <Col md={2}>
                    <Card className="border-0 shadow-sm bg-gradient-primary text-dark">
                        <Card.Body className="text-center py-3">
                            <h3 className="mb-1">{stats.total}</h3>
                            <p className="mb-0 small">Tổng đơn hàng</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card className="border-0 shadow-sm bg-gradient-warning text-dark">
                        <Card.Body className="text-center py-3">
                            <h3 className="mb-1">{stats.pending}</h3>
                            <p className="mb-0 small">Chờ xử lý</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card className="border-0 shadow-sm bg-gradient-info text-dark">
                        <Card.Body className="text-center py-3">
                            <h3 className="mb-1">{stats.approved}</h3>
                            <p className="mb-0 small">Đã xác nhận</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card className="border-0 shadow-sm bg-gradient-primary text-dark">
                        <Card.Body className="text-center py-3">
                            <h3 className="mb-1">{stats.shipping}</h3>
                            <p className="mb-0 small">Đang giao</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card className="border-0 shadow-sm bg-gradient-success text-dark">
                        <Card.Body className="text-center py-3">
                            <h3 className="mb-1">{stats.delivered}</h3>
                            <p className="mb-0 small">Đã giao</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={2}>
                    <Card className="border-0 shadow-sm bg-gradient-danger text-dark">
                        <Card.Body className="text-center py-3">
                            <h3 className="mb-1">{stats.cancelled}</h3>
                            <p className="mb-0 small">Đã hủy</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filter Card */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <Filter className="me-2" />
                        Bộ lọc & Tìm kiếm
                    </h5>
                    <Button variant="outline-secondary" size="sm" onClick={handleResetFilters}>
                        Xóa bộ lọc
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Row className="g-3">
                        <Col md={4}>
                            <div className="form-group">
                                <label>Từ khóa</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <Search />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Tìm theo tên..."
                                        value={filters.keyword}
                                        onChange={(e) => handleFilterChange('keyword', e.target.value)}
                                    />
                                </div>
                            </div>
                        </Col>

                        <Col md={3}>
                            <div className="form-group">
                                <label>Trạng thái</label>
                                <select
                                    className="form-select"
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="PENDING">Chờ xử lý</option>
                                    <option value="APPROVED">Đã xác nhận</option>
                                    <option value="SHIPPING">Đang giao</option>
                                    <option value="DELIVERED">Đã giao</option>
                                    <option value="CANCELLED">Đã hủy</option>
                                </select>
                            </div>
                        </Col>

                        <Col md={1} className="d-flex align-items-center">
                            <Button
                                variant="primary"
                                onClick={fetchOrders}
                                className="w-100"
                            >
                                <Search />
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Orders Table */}
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <BoxSeam className="me-2" />
                        Danh sách đơn hàng
                        <Badge bg="secondary" className="ms-2">
                            {pagination.totalElements} đơn hàng
                        </Badge>
                    </h5>
                    <div className="d-flex align-items-center">
                        <select
                            className="form-select me-2"
                            style={{ width: 'auto' }}
                            value={pagination.pageSize}
                            onChange={(e) => setPagination(prev => ({
                                ...prev,
                                pageSize: parseInt(e.target.value),
                                currentPage: 1
                            }))}
                        >
                            <option value="5">5 / trang</option>
                            <option value="10">10 / trang</option>
                            <option value="25">25 / trang</option>
                            <option value="50">50 / trang</option>
                        </select>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={fetchOrders}
                        >
                            <ArrowClockwise />
                        </Button>
                    </div>
                </Card.Header>

                <Card.Body className="p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Đang tải...</span>
                            </div>
                            <p className="mt-2">Đang tải dữ liệu...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="text-muted">Không tìm thấy đơn hàng nào</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="mb-0">
                                <thead className="bg-light">
                                <tr>
                                    <th width="50">STT</th>
                                    <th>Tên khách hàng</th>
                                    <th>Email</th>
                                    <th>Số điện thoại</th>
                                    <th>Địa chỉ giao hàng</th>
                                    <th width="100">Ghi chú</th>
                                    <th width="120">Tổng giá</th>
                                    <th width="120">Trạng thái</th>
                                    <th width="200" className="text-center">Hành động</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders.map((order, index) => (
                                    <tr key={order.id}>
                                        {/* STT */}
                                        <td className="align-middle">
                                            <strong>{(pagination.currentPage - 1) * pagination.pageSize + index + 1}</strong>
                                        </td>

                                        {/* Customer Name */}
                                        <td className="align-middle">
                                            <div className="fw-semibold">{order.customerName}</div>
                                        </td>

                                        {/* Email */}
                                        <td className="align-middle">
                                            {order.customerEmail || 'N/A'}
                                        </td>

                                        {/* Phone */}
                                        <td className="align-middle">
                                            {order.customerPhone || 'N/A'}
                                        </td>

                                        {/* Shipping Address */}
                                        <td className="align-middle">
                                            <div className="text-truncate" style={{ maxWidth: '200px' }}>
                                                {order.shippingAddress}
                                            </div>
                                        </td>

                                        {/* Note */}
                                        <td className="align-middle">
                                            {order.note ? (
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="p-0"
                                                    onClick={() => openNoteModal(order)}
                                                    title="Xem ghi chú"
                                                >
                                                    <FileText size={16} className="text-primary" />
                                                </Button>
                                            ) : (
                                                <span className="text-muted">-</span>
                                            )}
                                        </td>

                                        {/* Total Price */}
                                        <td className="align-middle fw-bold">
                                            {formatPrice(order.totalPrice)}
                                        </td>

                                        {/* Status */}
                                        <td className="align-middle">
                                            <Badge
                                                bg={getStatusBadge(order.status)}
                                                className="d-flex align-items-center"
                                                style={{ width: 'fit-content' }}
                                            >
                                                {getStatusIcon(order.status)}
                                                {getStatusText(order.status)}
                                            </Badge>
                                        </td>

                                        {/* Actions */}
                                        <td className="align-middle text-center">
                                            <div className="btn-group" role="group">
                                                {order.status === 'PENDING' && (
                                                    <>
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={<Tooltip>Chấp nhận đơn hàng</Tooltip>}
                                                        >
                                                            <Button
                                                                variant="outline-success"
                                                                size="sm"
                                                                className="me-1"
                                                                onClick={() => openActionModal(order, 'accept')}
                                                            >
                                                                <CheckCircle size={14} />
                                                            </Button>
                                                        </OverlayTrigger>

                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={<Tooltip>Từ chối đơn hàng</Tooltip>}
                                                        >
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                className="me-1"
                                                                onClick={() => openActionModal(order, 'reject')}
                                                            >
                                                                <XCircle size={14} />
                                                            </Button>
                                                        </OverlayTrigger>
                                                    </>
                                                )}

                                                {order.status === 'APPROVED' && ( // Sửa từ APPROVE thành APPROVED
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip>Xác nhận đang giao hàng</Tooltip>}
                                                    >
                                                        <Button
                                                            variant="outline-info"
                                                            size="sm"
                                                            className="me-1"
                                                            onClick={() => openActionModal(order, 'ship')}
                                                        >
                                                            <Truck size={14} />
                                                        </Button>
                                                    </OverlayTrigger>
                                                )}

                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip>Xem chi tiết</Tooltip>}
                                                >
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => openDetailModal(order)}
                                                    >
                                                        <Eye size={14} />
                                                    </Button>
                                                </OverlayTrigger>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>

                {/* Pagination Footer */}
                {orders.length > 0 && (
                    <Card.Footer className="bg-light">
                        <Row className="align-items-center">
                            <Col md={6}>
                                <p className="mb-0">
                                    Hiển thị từ <strong>{(pagination.currentPage - 1) * pagination.pageSize + 1}</strong> đến{' '}
                                    <strong>{Math.min(pagination.currentPage * pagination.pageSize, pagination.totalElements)}</strong>{' '}
                                    trong tổng số <strong>{pagination.totalElements}</strong> đơn hàng
                                </p>
                            </Col>
                            <Col md={6} className="text-end">
                                {renderPagination()}
                            </Col>
                        </Row>
                    </Card.Footer>
                )}
            </Card>

            {/* Note Modal */}
            <Modal
                show={noteModalShow}
                onHide={() => setNoteModalShow(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Ghi chú đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedOrder?.note || 'Không có ghi chú'}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setNoteModalShow(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Detail Modal */}
            <Modal
                show={detailModalShow}
                onHide={() => setDetailModalShow(false)}
                size="lg"
            >
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
                                        <Person className="me-2" />
                                        Thông tin khách hàng
                                    </h6>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <p><strong><Person className="me-2" />Họ tên:</strong> {selectedOrder.customerName}</p>
                                            <p><strong><Envelope className="me-2" />Email:</strong> {selectedOrder.customerEmail || 'N/A'}</p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong><Telephone className="me-2" />SĐT:</strong> {selectedOrder.customerPhone || 'N/A'}</p>
                                            <p><strong><GeoAlt className="me-2" />Địa chỉ:</strong> {selectedOrder.shippingAddress}</p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Thông tin đơn hàng */}
                            <Card className="mb-3">
                                <Card.Header className="bg-light">
                                    <h6 className="mb-0">
                                        <BoxSeam className="me-2" />
                                        Thông tin đơn hàng
                                    </h6>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <p><strong>Mã đơn:</strong> #{selectedOrder.id}</p>
                                            <p><strong>Trạng thái:</strong>
                                                <Badge bg={getStatusBadge(selectedOrder.status)} className="ms-2">
                                                    {getStatusIcon(selectedOrder.status)}
                                                    {getStatusText(selectedOrder.status)}
                                                </Badge>
                                            </p>
                                        </Col>
                                        <Col md={6}>
                                            <p><strong><CurrencyDollar className="me-2" />Tổng tiền:</strong>
                                                <span className="fw-bold text-primary ms-2">
                                                    {formatPrice(selectedOrder.totalPrice)}
                                                </span>
                                            </p>
                                            <p><strong><Calendar className="me-2" />Ngày đặt:</strong> {formatDate(selectedOrder.createdAt)}</p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Danh sách sản phẩm */}
                            <Card>
                                <Card.Header className="bg-light">
                                    <h6 className="mb-0">
                                        <BoxSeam className="me-2" />
                                        Danh sách sản phẩm
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
                                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                            selectedOrder.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="align-middle">{index + 1}</td>
                                                    <td className="align-middle">{item.productName}</td>
                                                    <td className="align-middle text-center">{item.quantity}</td>
                                                    <td className="align-middle text-end">{formatPrice(item.price)}</td>
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

            {/* Action Confirmation Modal */}
            <Modal show={actionModalShow} onHide={() => !actionLoading && setActionModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {actionType === 'accept' && 'Xác nhận đơn hàng'}
                        {actionType === 'reject' && 'Từ chối đơn hàng'}
                        {actionType === 'ship' && 'Xác nhận đang giao hàng'} {/* Thêm title cho ship */}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <>
                            <p>
                                Bạn có chắc chắn muốn {actionType === 'accept' ? 'chấp nhận' : actionType === 'reject' ? 'từ chối' : 'xác nhận đang giao'} đơn hàng
                                của <strong>{selectedOrder.customerName}</strong>?
                            </p>

                            {actionType === 'reject' && (
                                <Form.Group className="mt-3">
                                    <Form.Label>Lý do từ chối <span className="text-danger">*</span>:</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        placeholder="Nhập lý do từ chối..."
                                        disabled={actionLoading}
                                        required
                                    />
                                    {!rejectReason.trim() && (
                                        <small className="text-danger">Vui lòng nhập lý do từ chối</small>
                                    )}
                                </Form.Group>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setActionModalShow(false)}
                        disabled={actionLoading}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant={actionType === 'accept' ? 'success' : actionType === 'reject' ? 'danger' : 'info'}
                        onClick={handleOrderAction}
                        disabled={actionLoading || (actionType === 'reject' && !rejectReason.trim())}
                    >
                        {actionLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Đang xử lý...
                            </>
                        ) : (
                            actionType === 'accept' ? 'Chấp nhận' : actionType === 'reject' ? 'Từ chối' : 'Xác nhận đang giao'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminOrderList;