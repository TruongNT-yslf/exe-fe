import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import productManagerApi from "../../../api/ProductManagerApi";
import api from "../../../api/api";
import AdminHeader from "../../../components/admin/AdminHeader";
import {Helmet} from "react-helmet-async";
import Logo from "../../../assets/images/LOGO-EXE.png";
const AddNewProduct = () => {
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
    //state cho thumbnail preview
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    //state cho gallery previews
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    const thumbnailInputRef = React.useRef(null);
    const galleryInputRef = React.useRef(null);
    useEffect(() => {
        fetchCategories();
    },[])

    // Thêm useEffect để cleanup
    useEffect(() => {
        return () => {
            // Cleanup thumbnail preview URL
            if (thumbnailPreview) {
                URL.revokeObjectURL(thumbnailPreview);
            }

            // Cleanup gallery preview URLs
            galleryPreviews.forEach(preview => {
                URL.revokeObjectURL(preview);
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // hàm xử lý upload thumbnail
    const handleThumbnailUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploadingThumbnail(true);
        setUploadErrors(prev => ({ ...prev, thumbnail: '' }));

        const data = new FormData();
        data.append('file', file);
        data.append("folder", "products"); // Thay "blog" bằng "products" hoặc folder phù hợp

        try {
            const response = await api.post('/media/upload', data);
            const result = response.data;
            const url = result.secure_url || result.url;

            // Cập nhật thumbnail URL (không dùng base64 nữa)
            setProduct(prev => ({ ...prev, thumbnail: url }));

            // Tạo preview từ URL
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

    // hàm xử lý thêm gallery images
    const handleGalleryImagesUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploadingGallery(true);
        setUploadErrors(prev => ({ ...prev, gallery: '' }));

        const uploadedUrls = [];
        const previewUrls = [];

        try {
            // Upload từng file và chờ tất cả hoàn thành
            for (const file of files) {
                const data = new FormData();
                data.append('file', file);
                data.append("folder", "products");

                try {
                    const response = await api.post('/media/upload', data);
                    const result = response.data;
                    const url = result.secure_url || result.url;

                    uploadedUrls.push(url);
                    // Tạo preview URL từ file local (tạm thời) hoặc dùng URL từ server
                    previewUrls.push(URL.createObjectURL(file));
                } catch (err) {
                    console.error("Gallery image upload failed", err);
                }
            }

            // Cập nhật state với tất cả URLs đã upload
            setProduct(prev => ({
                ...prev,
                galleryImages: [...prev.galleryImages, ...uploadedUrls]
            }));

            // Cập nhật previews
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

    // Hàm xóa thumbnail
    const handleRemoveThumbnail = () => {
        // Revoke object URL nếu là URL tạm thời
        if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
            URL.revokeObjectURL(thumbnailPreview);
        }

        // Reset thumbnail và preview
        setProduct(prev => ({ ...prev, thumbnail: '' }));
        setThumbnailPreview('');
        setUploadErrors(prev => ({ ...prev, thumbnail: '' }));

        // Reset input file
        if (thumbnailInputRef.current) {
            thumbnailInputRef.current.value = '';
        }
    };

    // hàm xóa gallery image
    const handleRemoveGalleryImage = (index) => {
        // Revoke object URL nếu là URL tạm thời
        if (galleryPreviews[index] && galleryPreviews[index].startsWith('blob:')) {
            URL.revokeObjectURL(galleryPreviews[index]);
        }

        // Cập nhật state
        setProduct(prev => ({
            ...prev,
            galleryImages: prev.galleryImages.filter((_, i) => i !== index)
        }));

        // Xóa preview tương ứng
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Chuyển đổi dữ liệu trước khi gửi
        const productData = {
            ...product,
            originalPrice: parseFloat(product.originalPrice) || 0,
            discountedPrice: parseFloat(product.discountedPrice) || null,
            categoryId: product.categoryId ? parseInt(product.categoryId) : null,
            // Lấy tên category từ dropdown
            categoryName: categories.find(c => c.id === product.categoryId)?.name || ''
        };

        console.log('Product Data:', productData);

        try {
            const response = await productManagerApi.addProduct(productData);
            console.log('Dữ liệu sau khi thêm mới trả về:', response.data);

            // Kiểm tra response và hiển thị thông báo
            if (response.message === "success" || response.success) {
                alert("Thêm sản phẩm thành công");
                resetForm();
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
                alert(message);
            }
        } catch (error) {

        }
    };

    // hàm reset form
    const resetForm = () => {
        // Reset product state
        setProduct({
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

        // Revoke và reset thumbnail preview
        if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
            URL.revokeObjectURL(thumbnailPreview);
        }
        setThumbnailPreview('');

        // Revoke và reset gallery previews
        galleryPreviews.forEach(preview => {
            if (preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        });
        setGalleryPreviews([]);

        // Reset upload errors
        setUploadErrors({ thumbnail: '', gallery: '' });

        // Reset upload states
        setIsUploadingThumbnail(false);
        setIsUploadingGallery(false);

        // Reset input files
        if (thumbnailInputRef.current) {
            thumbnailInputRef.current.value = '';
        }
        if (galleryInputRef.current) {
            galleryInputRef.current.value = '';
        }
    };

    return (
        <Container className="py-4">
            {/* Header với tiêu đề chính */}
            <AdminHeader></AdminHeader>
            <Helmet>
                <title>Thêm sản phẩm mới</title>
                <link rel="icon" href={Logo} />
            </Helmet>
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
                                        disabled={loadingCategories}
                                    >
                                        <option value="">Chọn một danh mục</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {product.categoryId && (
                                        <Form.Control
                                            type="hidden"
                                            name="categoryName"
                                            value={categories.find(c => c.id === product.categoryId)?.name || ''}
                                        />
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Images */}
                        <Form.Group className="mb-3">
                            <Form.Label><strong>Ảnh chính</strong></Form.Label>

                            {/* Hiển thị lỗi upload thumbnail nếu có */}
                            {uploadErrors.thumbnail && (
                                <Alert variant="danger" className="py-1 mb-2">
                                    {uploadErrors.thumbnail}
                                </Alert>
                            )}

                            <div className="thumbnail-upload-container mb-2">
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailUpload}
                                    ref={thumbnailInputRef}
                                    disabled={isUploadingThumbnail}
                                    className="d-none"
                                    id="thumbnail-upload"
                                />

                                {/* Nút upload thay thế */}
                                {!product.thumbnail ? (
                                    <Form.Label
                                        htmlFor="thumbnail-upload"
                                        className={`btn ${isUploadingThumbnail ? 'btn-secondary' : 'btn-outline-primary'} w-100`}
                                        style={{ cursor: isUploadingThumbnail ? 'not-allowed' : 'pointer' }}
                                    >
                                        {isUploadingThumbnail ? 'Đang tải lên...' : '📷 Chọn ảnh chính'}
                                    </Form.Label>
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
                                    </div>
                                )}
                            </div>

                            {/* Hiển thị URL của thumbnail đã upload */}
                            {product.thumbnail && (
                                <Form.Text className="text-muted d-block mt-1">
                                    URL: <small>{product.thumbnail.substring(0, 50)}...</small>
                                </Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><strong>Bộ ảnh</strong></Form.Label>

                            {/* Hiển thị lỗi upload gallery nếu có */}
                            {uploadErrors.gallery && (
                                <Alert variant="warning" className="py-1 mb-2">
                                    {uploadErrors.gallery}
                                </Alert>
                            )}

                            <div className="gallery-upload-container mb-2">
                                <Form.Control
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleGalleryImagesUpload}
                                    ref={galleryInputRef}
                                    disabled={isUploadingGallery}
                                    className="d-none"
                                    id="gallery-upload"
                                />

                                {/* Nút upload thay thế */}
                                <Form.Label
                                    htmlFor="gallery-upload"
                                    className={`btn ${isUploadingGallery ? 'btn-secondary' : 'btn-outline-success'} w-100`}
                                    style={{ cursor: isUploadingGallery ? 'not-allowed' : 'pointer' }}
                                >
                                    {isUploadingGallery ? 'Đang tải lên...' : '📸 Chọn nhiều ảnh'}
                                </Form.Label>
                            </div>

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
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}
                        </Form.Group>

                        {/* Checkboxes */}
                        <Row className="mb-4">
                            <Col md={6}>
                                <Form.Check
                                    type="checkbox"
                                    label="Sản phẩm nổi bật"
                                    name="featured"
                                    checked={product.featured}
                                    onChange={handleChange}
                                    className="mb-2"
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="Sản phẩm được hiển thị"
                                    name="active"
                                    checked={product.active}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>

                        {/* Submit Button */}
                        <div className="d-flex justify-content-end gap-2">
                            <Button
                                variant="secondary"
                                size="lg"
                                style={{ minWidth: '150px' }}
                                onClick={resetForm}
                                type="button"
                            >
                                Hoàn tác
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                size="lg"
                                style={{ minWidth: '150px' }}
                            >
                                Thêm sản phẩm
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AddNewProduct;