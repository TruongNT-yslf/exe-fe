    'use client';

import React, { useState, useEffect, useRef } from 'react';
import './BlogAdmin.css';
import {createBlog, updateBlog, deleteBlog, getBlogById, getBlogs} from '../../api/Blog';
import api from '../../api/api';

export default function BlogAdmin() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });

    const [uploadedImages, setUploadedImages] = useState([]); // Lưu trữ {url, publicId}
    const [isUploading, setIsUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    // Tự động xóa thông báo sau 3 giây
    useEffect(() => {
        if (successMessage || error) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, error]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await getBlogs;
            setPosts(res.data.data || []);
        } catch (e) {
            setError('Không tải được danh sách bài viết');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (e) => {
        setFormData((prev) => ({ ...prev, content: e.target.value }));
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploading(true);
        setError(null);

        try {
            const uploadPromises = files.map(async (file) => {
                const data = new FormData();
                data.append('file', file);
                data.append("folder", "blog")

                // Gọi API upload (Sửa lỗi biến fd thành data)
                const response = await api.post('/media/upload', data);
                // Giả sử response trả về trực tiếp data hoặc qua axios là res.data
                const result = response.data;

                return {
                    url: result.secure_url || result.url,
                    publicId: result.public_id,
                };
            });

            const newImages = await Promise.all(uploadPromises);
            setUploadedImages((prev) => [...prev, ...newImages]);
        } catch (err) {
            setError(`Lỗi upload: ${err.message}`);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (index) => {
        setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({ title: '', content: '' });
        setUploadedImages([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                galleryImages: uploadedImages.map((img) => img.url),
            };

            if (editingId) {
                await updateBlog(editingId, payload);
                setSuccessMessage('Cập nhật bài viết thành công!');
            } else {
                await createBlog(payload);
                setSuccessMessage('Tạo bài viết mới thành công!');
            }

            handleCancel();
            fetchPosts();
        } catch (e) {
            setError('Lỗi khi lưu bài viết. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditPost = async (post) => {
        setEditingId(post.id);
        setFormData({
            title: post.title,
            content: post.content,
        });
        // Chuyển format string array từ BE thành object array cho UI
        const currentImages = post.galleryImages?.map(url => ({ url, publicId: '' })) || [];
        setUploadedImages(currentImages);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeletePost = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
        try {
            await deleteBlog(id);
            setSuccessMessage('Xóa bài viết thành công');
            fetchPosts();
        } catch (e) {
            setError('Không thể xóa bài viết');
        }
    };


    return (
        <div className="blog-admin-container">
            <div className="admin-header">
                <h1>Quản Lý Bài Viết Blog</h1>
                <p>Tạo, chỉnh sửa và quản lý các bài viết về mây tre đan</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            {/* Form tạo/chỉnh sửa bài viết */}
            <form onSubmit={handleSubmit} className="blog-form">
                <div className="form-section">
                    <h2>{editingId ? 'Chỉnh Sửa Bài Viết' : 'Tạo Bài Viết Mới'}</h2>

                    <div className="form-group">
                        <label htmlFor="title">Tiêu Đề</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Nhập tiêu đề bài viết..."
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Nội Dung</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleContentChange}
                            placeholder="Nhập nội dung bài viết (HTML được hỗ trợ)..."
                            className="form-textarea"
                            rows="12"
                            required
                        />
                        <small className="hint-text">
                            Bạn có thể sử dụng HTML để định dạng nội dung (ví dụ: &lt;strong&gt;, &lt;em&gt;, &lt;p&gt;)
                        </small>
                    </div>

                    {/* Upload hình ảnh */}
                    <div className="form-group">
                        <label>Hình Ảnh Bài Viết</label>
                        <div className="image-upload-section">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                multiple
                                accept="image/*"
                                disabled={isUploading}
                                className="file-input"
                                style={{ display: 'none' }}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="upload-btn"
                            >
                                {isUploading ? 'Đang tải...' : '+ Tải Lên Hình Ảnh'}
                            </button>
                        </div>

                        {uploadedImages.length > 0 && (
                            <div className="image-preview-grid">
                                {uploadedImages.map((image, index) => (
                                    <div key={index} className="image-preview-item">
                                        <img src={image.url} alt={`Preview ${index + 1}`} />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="remove-image-btn"
                                            title="Xóa hình ảnh"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={loading || isUploading}
                            className="btn btn-primary"
                        >
                            {loading ? 'Đang lưu...' : editingId ? 'Cập Nhật' : 'Tạo Bài Viết'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="btn btn-secondary"
                            >
                                Hủy
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {/* Danh sách bài viết */}
            <div className="posts-section">
                <h2>Danh Sách Bài Viết ({posts.length})</h2>

                {loading ? (
                    <div className="loading-spinner">Đang tải...</div>
                ) : posts.length === 0 ? (
                    <p className="no-posts">Chưa có bài viết nào</p>
                ) : (
                    <div className="posts-table">
                        <div className="table-header">
                            <div className="col-title">Tiêu Đề</div>
                            <div className="col-date">Ngày Tạo</div>
                            <div className="col-images">Hình Ảnh</div>
                            <div className="col-actions">Hành Động</div>
                        </div>

                        {posts.map((post) => (
                            <div key={post.id} className="table-row">
                                <div className="col-title">
                                    <p className="post-title">{post.title}</p>
                                    <p className="post-excerpt">
                                        {post.content.replace(/<[^>]*>/g, '').substring(0, 80)}...
                                    </p>
                                </div>
                                <div className="col-date">
                                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                </div>
                                <div className="col-images">
                                    {post.galleryImages && post.galleryImages.length > 0
                                        ? `${post.galleryImages.length} ảnh`
                                        : 'Không có ảnh'}
                                </div>
                                <div className="col-actions">
                                    <button
                                        onClick={() => handleEditPost(post)}
                                        className="btn-action btn-edit"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDeletePost(post.id)}
                                        className="btn-action btn-delete"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

