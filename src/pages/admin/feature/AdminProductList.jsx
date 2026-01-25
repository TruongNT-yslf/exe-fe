"use client"
import {useState, useEffect} from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Table,
    Form,
    Badge,
    Modal,
    InputGroup,
    Pagination,
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap';
import {
    Search,
    Filter,
    Pencil,
    Trash,
    Eye,
    Image as ImageIcon,
    CheckCircle,
    XCircle,
    Star,
    StarFill,
    Tag,
    FileText
} from 'react-bootstrap-icons';
import {Link} from 'react-router-dom';
import productManagerApi from "../../../api/ProductManagerApi";
import AdminHeader from "../../../components/admin/AdminHeader";

const AdminProductList = () => {
    // States
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [descriptionModalShow, setDescriptionModalShow] = useState(false);
    const [currentDescription, setCurrentDescription] = useState('');

    // Filter states
    const [filters, setFilters] = useState({
        keyword: '',
        categoryId: '',
        minPrice: '',
        maxPrice: '',
        isFeature: '',
        isActive: '',
        sortPriceBy: '',
    });

    // Pagination states
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 12,
        totalPages: 1,
        totalElements: 0
    });

    // Fetch categories
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch products when filters or pagination changes
    useEffect(() => {
        handleSearch();
    }, [filters, pagination.currentPage, pagination.pageSize]);

    const fetchCategories = async () => {
        try {
            const response = await productManagerApi.getCategories();
            if (response.message === "success") {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.currentPage,
                size: pagination.pageSize,
                ...filters
            };

            // Clean up empty params
            Object.keys(params).forEach(key => {
                if (params[key] === '') {
                    delete params[key];
                }
            });

            const response = await productManagerApi.getAllProducts(params.page, params.size);

            if (response.message === "success") {
                setProducts(response.data.content);
                setPagination(prev => ({
                    ...prev,
                    totalPages: response.data.totalPages,
                    totalElements: response.data.totalElements
                }));
            }
        } catch (error) {
            console.error('Error fetching products:', error);
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
        // Reset to page 1 when filters change
        setPagination(prev => ({...prev, currentPage: 1}));
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.currentPage,
                size: pagination.pageSize,
                ...filters
            };

            // Clean up empty params
            Object.keys(params).forEach(key => {
                if (params[key] === '') {
                    delete params[key];
                }
            });

            const response = await productManagerApi.searchProducts(filters, params.page, params.size);

            if (response.message === "success") {
                setProducts(response.data.content);
                setPagination(prev => ({
                    ...prev,
                    totalPages: response.data.totalPages,
                    totalElements: response.data.totalElements
                }));
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetFilters = () => {
        setFilters({
            keyword: '',
            categoryId: '',
            minPrice: '',
            maxPrice: '',
            isFeature: '',
            isActive: '',
            sortPriceBy: '',
        });
    };

    // Toggle status functions
    const toggleActiveStatus = async (product) => {
        try {
            await productManagerApi.toggleActive(product);
            handleSearch(); // Refresh list
        } catch (error) {
            console.error('Error toggling active status:', error);
        }
    };

    const toggleFeaturedStatus = async (product) => {
        try {
            await productManagerApi.toggleFeaturedStatus(product);
            handleSearch(); // Refresh list
        } catch (error) {
            console.error('Error toggling featured status:', error);
        }
    };

    //handle show description
    const openDescriptionModal = (description) => {
        setCurrentDescription(description || 'Không có mô tả');
        setDescriptionModalShow(true);
    }

    // Delete product
    const confirmDelete = (product) => {
        setSelectedProduct(product);
        setDeleteModalShow(true);
    };

    const handleDelete = async () => {
        if (!selectedProduct) return;

        try {
            await productManagerApi.delete(selectedProduct.id);
            setDeleteModalShow(false);
            setSelectedProduct(null);
            handleSearch(); // Refresh list
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    // Format price
    const formatPrice = (price) => {
        if (!price && price !== 0) return 'Không áp dụng';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Render gallery images preview
    const renderGalleryPreview = (images) => {
        if (!images || images.length === 0) {
            return (
                <Badge bg="secondary" className="me-1">
                    <ImageIcon size={12}/> 0
                </Badge>
            );
        }

        return (
            <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip>
                        {images.map((img, idx) => (
                            <div key={idx} className="mb-1">
                                <img src={img} alt={`Gallery ${idx + 1}`} style={{width: '50px', height: '50px'}}/>
                            </div>
                        ))}
                    </Tooltip>
                }
            >
                <Badge bg="info" className="me-1">
                    <ImageIcon size={12}/> {images.length}
                </Badge>
            </OverlayTrigger>
        );
    };

    // Render pagination
    const renderPagination = () => {
        const items = [];

        // First page
        items.push(
            <Pagination.First
                key="first"
                onClick={() => setPagination(prev => ({...prev, currentPage: 1}))}
                disabled={pagination.currentPage === 1}
            />
        );

        // Previous page
        items.push(
            <Pagination.Prev
                key="prev"
                onClick={() => setPagination(prev => ({...prev, currentPage: prev.currentPage - 1}))}
                disabled={pagination.currentPage === 1}
            />
        );

        // Page numbers
        for (let page = 1; page <= pagination.totalPages; page++) {
            if (page === 1 ||
                page === pagination.totalPages ||
                (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)) {
                items.push(
                    <Pagination.Item
                        key={page}
                        active={page === pagination.currentPage}
                        onClick={() => setPagination(prev => ({...prev, currentPage: page}))}
                    >
                        {page}
                    </Pagination.Item>
                );
            } else if (page === pagination.currentPage - 2 || page === pagination.currentPage + 2) {
                items.push(<Pagination.Ellipsis key={`ellipsis-${page}`}/>);
            }
        }

        // Next page
        items.push(
            <Pagination.Next
                key="next"
                onClick={() => setPagination(prev => ({...prev, currentPage: prev.currentPage + 1}))}
                disabled={pagination.currentPage === pagination.totalPages}
            />
        );

        // Last page
        items.push(
            <Pagination.Last
                key="last"
                onClick={() => setPagination(prev => ({...prev, currentPage: pagination.totalPages}))}
                disabled={pagination.currentPage === pagination.totalPages}
            />
        );

        return <Pagination>{items}</Pagination>;
    };

    return (
        <Container fluid className="py-4">
            {/* Header với tiêu đề chính */}
            <AdminHeader></AdminHeader>

            {/* Filter Card */}
            <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <Filter className="me-2" />
                        <h5 className="mb-0">Bộ lọc & Tìm kiếm</h5>
                    </div>
                    <div className="d-flex">
                        <Button variant="outline-secondary" size="sm" onClick={handleResetFilters} className="me-2">
                            Xóa bộ lọc
                        </Button>
                        <Link to="/admin/add-new-product">
                            <Button variant="primary" size="sm">
                                <Pencil className="me-2" />
                                Thêm sản phẩm mới
                            </Button>
                        </Link>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Row className="g-3">
                        {/* Keyword Search - Chiếm 4 cột */}
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Từ khóa</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <Search />
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Tìm theo tên..."
                                        value={filters.keyword}
                                        onChange={(e) => handleFilterChange('keyword', e.target.value)}
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Col>

                        {/* Category Filter - Chiếm 4 cột */}
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Danh mục</Form.Label>
                                <Form.Select
                                    value={filters.categoryId}
                                    onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                                >
                                    <option value="">Tất cả danh mục</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        {/* Price Range - Chiếm 4 cột với 2 ô con */}
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Khoảng giá</Form.Label>
                                <div className="d-flex gap-2">
                                    <Form.Control
                                        placeholder="Giá thấp nhất"
                                        type="number"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    />
                                    <Form.Control
                                        placeholder="Giá cao nhất"
                                        type="number"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    />
                                </div>
                            </Form.Group>
                        </Col>

                        {/* Status Filters - Chiếm 6 cột */}
                        <Col md={6}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Trạng thái</Form.Label>
                                        <Form.Select
                                            value={filters.isActive}
                                            onChange={(e) => handleFilterChange('isActive', e.target.value)}
                                        >
                                            <option value="">Tất cả</option>
                                            <option value="true">Đang hoạt động</option>
                                            <option value="false">Không hoạt động</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Nổi bật</Form.Label>
                                        <Form.Select
                                            value={filters.isFeature}
                                            onChange={(e) => handleFilterChange('isFeature', e.target.value)}
                                        >
                                            <option value="">Tất cả</option>
                                            <option value="true">Có</option>
                                            <option value="false">Không</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>

                        {/* Sort Options và Search Button - Chiếm 6 cột */}
                        <Col md={6}>
                            <Row className="align-items-end">
                                <Col md={8}>
                                    <Form.Group>
                                        <Form.Label>Sắp xếp theo giá gốc</Form.Label>
                                        <Form.Select
                                            value={filters.sortPriceBy}
                                            onChange={(e) => handleFilterChange('sortPriceBy', e.target.value)}
                                        >
                                            <option value="">Không sắp xếp</option>
                                            <option value="asc">Tăng dần</option>
                                            <option value="desc">Giảm dần</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Button variant="primary" onClick={handleSearch} className="w-100">
                                        <Search className="me-2" />
                                        Tìm kiếm
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Products Table */}
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <Tag className="me-2"/>
                        Danh sách sản phẩm
                        <Badge bg="secondary" className="ms-2">
                            {pagination.totalElements} sản phẩm
                        </Badge>
                    </h5>
                    <div className="d-flex align-items-center">
                        <Form.Select
                            className="me-2"
                            style={{width: 'auto'}}
                            value={pagination.pageSize}
                            onChange={(e) => setPagination(prev => ({
                                ...prev,
                                pageSize: parseInt(e.target.value),
                                currentPage: 1
                            }))}
                        >
                            <option value="5">5 / trang</option>
                            <option value="10">10 / trang</option>
                            <option value="12">12 / trang</option>
                            <option value="25">25 / trang</option>
                            <option value="50">50 / trang</option>
                        </Form.Select>
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
                    ) : products.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="text-muted">Không tìm thấy sản phẩm nào</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table hover className="mb-0">
                                <thead className="bg-light">
                                <tr>
                                    <th width="50">STT</th>
                                    <th width="180">Tên sản phẩm</th>
                                    <th width="130">Danh mục</th>
                                    <th width="90">Mô tả</th>
                                    <th width="100">Ảnh chính</th>
                                    <th width="90">Bộ ảnh</th>
                                    <th width="140">Trạng thái hoạt động</th>
                                    <th width="140">Sản phẩm nổi bật</th>
                                    <th width="130">Giá gốc</th>
                                    <th width="130">Giá đã giảm</th>
                                    <th width="150" className="text-center">Hành động</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.map((product, index) => (
                                    <tr key={product.id}>
                                        {/* STT */}
                                        <td className="align-middle">
                                            <strong>{(pagination.currentPage - 1) * pagination.pageSize + index + 1}</strong>
                                        </td>

                                        {/* Product Name */}
                                        <td className="align-middle">
                                            <div className="fw-semibold">{product.name}</div>
                                        </td>

                                        {/* Category */}
                                        <td className="align-middle">
                                            <Badge bg="info" className="d-block text-truncate"
                                                   style={{maxWidth: '150px'}}>
                                                {product.categoryName}
                                            </Badge>
                                        </td>

                                        {/* Description */}
                                        <td className="align-middle">
                                            <Button
                                                variant={"link"}
                                                size="sm"
                                                className="p-0 ms-1"
                                                onClick={() => {
                                                    openDescriptionModal(product.description)
                                                }}
                                                title={"Xem mô tả đầy đủ"}
                                            >
                                                <FileText size={14} className={"text-primary"}/>
                                            </Button>
                                        </td>

                                        {/* Thumbnail */}
                                        <td className="align-middle">
                                            {product.thumbnail ? (
                                                <img
                                                    src={product.thumbnail}
                                                    alt="Thumbnail"
                                                    className="img-thumbnail"
                                                    style={{width: '80px', height: '80px', objectFit: 'cover'}}
                                                />
                                            ) : (
                                                <Badge bg="secondary" className="p-2">
                                                    <ImageIcon size={20}/>
                                                </Badge>
                                            )}
                                        </td>

                                        {/* Gallery Images */}
                                        <td className="align-middle">
                                            {renderGalleryPreview(product.galleryImages)}
                                        </td>

                                        {/* Active Status */}
                                        <td className="align-middle">
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={product.active}
                                                    onChange={() => toggleActiveStatus(product)}
                                                    style={{cursor: 'pointer'}}
                                                />
                                                <label className="form-check-label">
                                                    {product.active ? (
                                                        <Badge bg="success" className="ms-2">
                                                            <CheckCircle size={12}/> Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge bg="secondary" className="ms-2">
                                                            <XCircle size={12}/> Inactive
                                                        </Badge>
                                                    )}
                                                </label>
                                            </div>
                                        </td>

                                        {/* Featured Status */}
                                        <td className="align-middle">
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={product.featured}
                                                    onChange={() => toggleFeaturedStatus(product)}
                                                    style={{cursor: 'pointer'}}
                                                />
                                                <label className="form-check-label">
                                                    {product.featured ? (
                                                        <Badge bg="warning" className="ms-2">
                                                            <StarFill size={12}/> Featured
                                                        </Badge>
                                                    ) : (
                                                        <Badge bg="secondary" className="ms-2">
                                                            <Star size={12}/> Normal
                                                        </Badge>
                                                    )}
                                                </label>
                                            </div>
                                        </td>

                                        {/* Original Price */}
                                        <td className="align-middle">
                                            {product.discountedPrice !== null ? (
                                                <div className="text-decoration-line-through text-muted">
                                                    <b>
                                                        {formatPrice(product.originalPrice)}
                                                    </b>
                                                </div>
                                            ) : (
                                                <div className="text-decoration text-muted">
                                                    <b>
                                                        {formatPrice(product.originalPrice)}
                                                    </b>
                                                </div>
                                            )}
                                        </td>

                                        {/* Discounted Price */}
                                        <td className="align-middle">
                                            <div className="fw-bold text-danger">
                                                {formatPrice(product.discountedPrice)}
                                            </div>
                                            {product.discountedPrice && product.discountedPrice < product.originalPrice && (
                                                <Badge bg="danger" className="mt-1">
                                                    Giảm {Math.round((1 - product.discountedPrice / product.originalPrice) * 100)}%
                                                </Badge>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="align-middle text-center">
                                            <div className="btn-group" role="group">
                                                <Link to={`/admin/products/edit/${product.id}`}>
                                                    <Button variant="outline-primary" size="sm" className="me-2" title={"Chỉnh sửa sản phẩm"}>
                                                        <Pencil size={14}/>
                                                    </Button>
                                                </Link>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip>Xem chi tiết</Tooltip>}
                                                >
                                                    <Link to={`/admin/products/view/${product.id}`}>
                                                        <Button variant="outline-info" size="sm" className="me-2">
                                                            <Eye size={14}/>
                                                        </Button>
                                                    </Link>
                                                </OverlayTrigger>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip>Xóa sản phẩm</Tooltip>}
                                                >
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => confirmDelete(product)}
                                                    >
                                                        <Trash size={14}/>
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
                {products.length > 0 && (
                    <Card.Footer className="bg-light">
                        <Row className="align-items-center">
                            <Col md={6}>
                                <p className="mb-0">
                                    Hiển thị
                                    từ <strong>{(pagination.currentPage - 1) * pagination.pageSize + 1}</strong> đến{' '}
                                    <strong>{Math.min(pagination.currentPage * pagination.pageSize, pagination.totalElements)}</strong>{' '}
                                    trong tổng số <strong>{pagination.totalElements}</strong> sản phẩm
                                </p>
                            </Col>
                            <Col md={6} className="text-end">
                                {renderPagination()}
                            </Col>
                        </Row>
                    </Card.Footer>
                )}
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal show={deleteModalShow} onHide={() => setDeleteModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProduct && (
                        <>
                            <p>Bạn có chắc chắn muốn xóa sản phẩm:</p>
                            <p className="fw-bold">{selectedProduct.name}</p>
                            <p className="text-danger">
                                Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa.
                            </p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteModalShow(false)}>
                        Hủy bỏ
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Xóa sản phẩm
                    </Button>
                </Modal.Footer>
            </Modal>

            {/*Show description modal*/}
            <Modal
                show={descriptionModalShow}
                onHide={() => setDeleteModalShow(false)}
                size={"lg"}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Mô tả chi tiết</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{maxHeight: '400px', overflowY: 'auto', whiteSpace: 'pre-wrap'}}>
                    {currentDescription}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setDescriptionModalShow(false)}
                    >
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminProductList;