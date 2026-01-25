import React, { useState, useEffect } from 'react';
import {useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import productManagerApi from "../../api/ProductManagerApi";
import { Link } from "react-router-dom";
import api from "../../api/api";
import {Pencil, Save} from "react-bootstrap-icons";
import AdminHeader from "./AdminHeader";

const ProductForm = ({ mode = 'view' }) => {
    const { id } = useParams();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        originalPrice: '',
        discountedPrice: '',
        thumbnail: '',
        galleryImages: [],
        featured: false,
        active: true,
        categoryId: '',
        categoryName: ''
    });

    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
    const [isUploadingGallery, setIsUploadingGallery] = useState(false);
    const [uploadErrors, setUploadErrors] = useState({ thumbnail: '', gallery: '' });
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const thumbnailInputRef = React.useRef(null);
    const galleryInputRef = React.useRef(null);

    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';

    useEffect(() => {
        fetchCategories();

        // Nếu là edit hoặc view mode, fetch product data
        if ((isEditMode || isViewMode) && id) {
            fetchProductData();
        }
    }, [id, mode]);

    // Thêm useEffect để cleanup
    useEffect(() => {
        return () => {
            if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
                URL.revokeObjectURL(thumbnailPreview);
            }
            galleryPreviews.forEach(preview => {
                if (preview.startsWith('blob:')) {
                    URL.revokeObjectURL(preview);
                }
            });
        };
    }, [thumbnailPreview, galleryPreviews]);

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

    const fetchProductData = async () => {
        setIsLoading(true);
        try {
            const response = await productManagerApi.getProductById(id);
            if (response.message === "success") {
                const productData = response.data;
                setProduct({
                    name: productData.name || '',
                    description: productData.description || '',
                    originalPrice: productData.originalPrice || '',
                    discountedPrice: productData.discountedPrice || '',
                    thumbnail: productData.thumbnail || '',
                    galleryImages: productData.galleryImages || [],
                    featured: productData.featured || false,
                    active: productData.active ?? true,
                    categoryId: productData.categoryId || '',
                    categoryName: productData.categoryName || ''
                });

                // Set previews
                if (productData.thumbnail) {
                    setThumbnailPreview(productData.thumbnail);
                }

                if (productData.galleryImages && productData.galleryImages.length > 0) {
                    setGalleryPreviews(productData.galleryImages);
                }
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            setErrorMessage('Không thể tải thông tin sản phẩm');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        if (isViewMode) return; // Không cho phép chỉnh sửa trong view mode

        const { name, value, type, checked } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleThumbnailUpload = async (e) => {
        if (isViewMode) return;

        const file = e.target.files[0];
        if (!file) return;

        setIsUploadingThumbnail(true);
        setUploadErrors(prev => ({ ...prev, thumbnail: '' }));

        const data = new FormData();
        data.append('file', file);
        data.append("folder", "products");

        try {
            const response = await api.post('/media/upload', data);
            const result = response.data;
            const url = result.secure_url || result.url;

            setProduct(prev => ({ ...prev, thumbnail: url }));
            setThumbnailPreview(url);
        } catch (err) {
            console.error("Thumbnail upload failed", err);
            setUploadErrors(prev => ({
                ...prev,
                thumbnail: 'Lỗi upload ảnh chính'
            }));
        } finally {
            setIsUploadingThumbnail(false);
            if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
        }
    };

    const handleGalleryImagesUpload = async (e) => {
        if (isViewMode) return;

        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploadingGallery(true);
        setUploadErrors(prev => ({ ...prev, gallery: '' }));

        const uploadedUrls = [];
        const previewUrls = [];

        try {
            for (const file of files) {
                const data = new FormData();
                data.append('file', file);
                data.append("folder", "products");

                try {
                    const response = await api.post('/media/upload', data);
                    const result = response.data;
                    const url = result.secure_url || result.url;

                    uploadedUrls.push(url);
                    previewUrls.push(URL.createObjectURL(file));
                } catch (err) {
                    console.error("Gallery image upload failed", err);
                }
            }

            setProduct(prev => ({
                ...prev,
                galleryImages: [...prev.galleryImages, ...uploadedUrls]
            }));

            setGalleryPreviews(prev => [...prev, ...previewUrls]);

            if (uploadedUrls.length < files.length) {
                setUploadErrors(prev => ({
                    ...prev,
                    gallery: `Đã upload ${uploadedUrls.length}/${files.length} ảnh`
                }));
            }
        } catch (error) {
            console.error("Error uploading gallery images", error);
            setUploadErrors(prev => ({
                ...prev,
                gallery: 'Lỗi upload bộ ảnh'
            }));
        } finally {
            setIsUploadingGallery(false);
            if (galleryInputRef.current) galleryInputRef.current.value = '';
        }
    };

    const handleRemoveThumbnail = () => {
        if (isViewMode) return;

        if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
            URL.revokeObjectURL(thumbnailPreview);
        }

        setProduct(prev => ({ ...prev, thumbnail: '' }));
        setThumbnailPreview('');
        setUploadErrors(prev => ({ ...prev, thumbnail: '' }));

        if (thumbnailInputRef.current) {
            thumbnailInputRef.current.value = '';
        }
    };

    const handleRemoveGalleryImage = (index) => {
        if (isViewMode) return;

        if (galleryPreviews[index] && galleryPreviews[index].startsWith('blob:')) {
            URL.revokeObjectURL(galleryPreviews[index]);
        }

        setProduct(prev => ({
            ...prev,
            galleryImages: prev.galleryImages.filter((_, i) => i !== index)
        }));

        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = {
            ...product,
            originalPrice: parseFloat(product.originalPrice) || 0,
            discountedPrice: parseFloat(product.discountedPrice) || null,
            categoryId: product.categoryId ? parseInt(product.categoryId) : null,
            categoryName: categories.find(c => c.id === product.categoryId)?.name || ''
        };

        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            let response;
            if (isEditMode) {
                response = await productManagerApi.updateProduct(id, productData);
            }
            console.log('API Response:', response);

            if (response.message === "success" || response.success) {
                const message = isEditMode ? 'Cập nhật sản phẩm thành công!' : null;
                setSuccessMessage(message);
            }
            if(!response.success) {
                let message = response.message;
                if(message === "Product name is required"){
                    message = "Vui lòng điền tên sản phẩm!";
                }else if(message === "Discounted price must be less than original price"){
                    message = "Giá giảm phải nhỏ hơn giá gốc!";
                }else if(message === "Product name cannot exceed 1000 characters!"){
                    message = "Tên sản phẩm không được vượt quá 1000 ký tự!";
                }else if(message === "Price must be greater than 0"){
                    message = "Giá phải lớn hơn 0!";
                }else if(message === "Discounted price must be greater than or equal to 0"){
                    message = "Giá phải lớn hơn 0!";
                }else{
                    message = "Có lỗi khi cập nhật sản phẩm ! (Lỗi bất định)";
                }
                setErrorMessage(message);
            }
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && (isEditMode || isViewMode)) {
        return (
            <Container className="py-4 text-center">
                <Alert variant="info">Đang tải dữ liệu sản phẩm...</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            {/* Header */}
            <AdminHeader></AdminHeader>

            {/* Messages */}
            {errorMessage && (
                <Alert variant="danger" className="mb-3" onClose={() => setErrorMessage('')} dismissible>
                    {errorMessage}
                </Alert>
            )}

            {successMessage && (
                <Alert variant="success" className="mb-3" onClose={() => setSuccessMessage('')} dismissible>
                    {successMessage}
                </Alert>
            )}

            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* General Information */}
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Tên sản phẩm</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                placeholder="Nhập tên sản phẩm"
                                required
                                readOnly={isViewMode}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Mô tả</strong></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                placeholder="Nhập mô tả"
                                required
                                readOnly={isViewMode}
                            />
                        </Form.Group>

                        {/* Pricing */}
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label><strong>Giá gốc (VND)</strong></Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="originalPrice"
                                        value={product.originalPrice}
                                        onChange={handleChange}
                                        placeholder="Nhập giá gốc"
                                        required
                                        readOnly={isViewMode}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label><strong>Giá đã giảm (VND)</strong> <small className="text-muted">(Tuỳ chọn)</small></Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="discountedPrice"
                                        value={product.discountedPrice}
                                        onChange={handleChange}
                                        placeholder="Nhập giá giảm"
                                        readOnly={isViewMode}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Category */}
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label><strong>Danh mục</strong></Form.Label>
                                    <Form.Select
                                        name="categoryId"
                                        value={product.categoryId}
                                        onChange={handleChange}
                                        required
                                        disabled={loadingCategories || isViewMode}
                                    >
                                        <option value="">Chọn một danh mục</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Thumbnail Image */}
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Ảnh chính</strong></Form.Label>

                            {uploadErrors.thumbnail && (
                                <Alert variant="danger" className="py-1 mb-2">
                                    {uploadErrors.thumbnail}
                                </Alert>
                            )}

                            <div className="thumbnail-upload-container mb-2">
                                {!isViewMode && (
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailUpload}
                                        ref={thumbnailInputRef}
                                        disabled={isUploadingThumbnail || isViewMode}
                                        className="d-none"
                                        id="thumbnail-upload"
                                    />
                                )}

                                {!product.thumbnail ? (
                                    !isViewMode ? (
                                        <Form.Label
                                            htmlFor="thumbnail-upload"
                                            className={`btn ${isUploadingThumbnail ? 'btn-secondary' : 'btn-outline-primary'} w-100`}
                                            style={{ cursor: isUploadingThumbnail ? 'not-allowed' : 'pointer' }}
                                        >
                                            {isUploadingThumbnail ? 'Đang tải lên...' : '📷 Chọn ảnh chính'}
                                        </Form.Label>
                                    ) : (
                                        <div className="text-muted">Không có ảnh chính</div>
                                    )
                                ) : (
                                    <div className="thumbnail-preview-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                                        <img
                                            src={thumbnailPreview}
                                            alt="Thumbnail preview"
                                            style={{
                                                maxWidth: '200px',
                                                maxHeight: '200px',
                                                objectFit: 'cover',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        {!isViewMode && (
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                className="position-absolute top-0 end-0"
                                                style={{ transform: 'translate(30%, -30%)' }}
                                                onClick={handleRemoveThumbnail}
                                                disabled={isUploadingThumbnail}
                                            >
                                                ×
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {product.thumbnail && !isViewMode && (
                                <Form.Text className="text-muted d-block mt-1">
                                    URL: <small>{product.thumbnail.substring(0, 50)}...</small>
                                </Form.Text>
                            )}
                        </Form.Group>

                        {/* Gallery Images */}
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Bộ ảnh</strong></Form.Label>

                            {uploadErrors.gallery && (
                                <Alert variant="warning" className="py-1 mb-2">
                                    {uploadErrors.gallery}
                                </Alert>
                            )}

                            {!isViewMode && (
                                <div className="gallery-upload-container mb-2">
                                    <Form.Control
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleGalleryImagesUpload}
                                        ref={galleryInputRef}
                                        disabled={isUploadingGallery || isViewMode}
                                        className="d-none"
                                        id="gallery-upload"
                                    />

                                    <Form.Label
                                        htmlFor="gallery-upload"
                                        className={`btn ${isUploadingGallery ? 'btn-secondary' : 'btn-outline-success'} w-100`}
                                        style={{ cursor: isUploadingGallery ? 'not-allowed' : 'pointer' }}
                                    >
                                        {isUploadingGallery ? 'Đang tải lên...' : '📸 Chọn nhiều ảnh'}
                                    </Form.Label>
                                </div>
                            )}

                            {/* Hiển thị gallery previews */}
                            {galleryPreviews.length > 0 && (
                                <div className="mt-2">
                                    <h6>Ảnh xem trước ({product.galleryImages.length} ảnh):</h6>
                                    <Row className="g-2">
                                        {galleryPreviews.map((preview, index) => (
                                            <Col xs={4} md={3} key={index}>
                                                <div className="position-relative">
                                                    <img
                                                        src={preview}
                                                        alt={`Gallery preview ${index + 1}`}
                                                        style={{
                                                            width: '100%',
                                                            height: '120px',
                                                            objectFit: 'cover',
                                                            borderRadius: '8px',
                                                            border: '1px solid #dee2e6'
                                                        }}
                                                    />
                                                    {!isViewMode && (
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            className="position-absolute top-0 end-0"
                                                            style={{ transform: 'translate(30%, -30%)' }}
                                                            onClick={() => handleRemoveGalleryImage(index)}
                                                            disabled={isUploadingGallery}
                                                        >
                                                            ×
                                                        </Button>
                                                    )}
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}
                        </Form.Group>

                        {/* Checkboxes */}
                        {!isViewMode && (
                            <Row className="mb-4">
                                <Col md={6}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Sản phẩm nổi bật"
                                        name="featured"
                                        checked={product.featured}
                                        onChange={handleChange}
                                        className="mb-2"
                                        disabled={isViewMode}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Sản phẩm được hiển thị"
                                        name="active"
                                        checked={product.active}
                                        onChange={handleChange}
                                        disabled={isViewMode}
                                    />
                                </Col>
                            </Row>
                        )}

                        {/* Action Buttons */}
                        {isEditMode && (
                            <div className="d-flex justify-content-end gap-2">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    size="lg"
                                    style={{ minWidth: '150px' }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang xử lý...' : (
                                        <>
                                            <Save className="me-1" />
                                            Cập nhật
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        {isViewMode && (
                            <div className="d-flex justify-content-end gap-2">
                                <Link to={`/admin/products/edit/${id}`}>
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        style={{ minWidth: '150px' }}
                                    >
                                        <Pencil className="me-1" />
                                        Chỉnh sửa
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ProductForm;