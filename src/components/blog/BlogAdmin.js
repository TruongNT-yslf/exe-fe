'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import './BlogAdmin.css';
import { createBlog, updateBlog, deleteBlog, getBlogs } from '../../api/Blog';
import { formatDate } from '../../utils/dateFormat';
import api from '../../api/api';

// 1. Import React Quill và CSS của nó
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AdminHeader from "../admin/AdminHeader";

export default function BlogAdmin() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Thêm state để loading khi upload thumbnail
    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
    const thumbnailInputRef = useRef(null);

    // Ref dùng cho Quill để truy cập editor instance
    const quillRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        thumbnail: '', // Thêm trường thumbnail vào state
    });

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

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
            const res = await getBlogs();
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

    const handleContentChange = (value) => {
        setFormData((prev) => ({ ...prev, content: value }));
    };

    // --- LOGIC MỚI: Upload Thumbnail ---
    const handleThumbnailUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploadingThumbnail(true);
        const data = new FormData();
        data.append('file', file);
        data.append("folder", "blog"); // Bạn có thể để folder riêng hoặc chung

        try {
            const response = await api.post('/media/upload', data);
            const result = response.data;
            const url = result.secure_url || result.url;

            // Cập nhật state thumbnail
            setFormData(prev => ({ ...prev, thumbnail: url }));
        } catch (err) {
            console.error("Thumbnail upload failed", err);
            setError('Lỗi upload ảnh bìa');
        } finally {
            setIsUploadingThumbnail(false);
            if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
        }
    };

    const removeThumbnail = () => {
        setFormData(prev => ({ ...prev, thumbnail: '' }));
    };
    // ------------------------------------

    // Logic Upload ảnh cho Editor (Content)
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const data = new FormData();
            data.append('file', file);
            data.append("folder", "blog");

            try {
                const response = await api.post('/media/upload', data);
                const result = response.data;
                const url = result.secure_url || result.url;

                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', url);
                quill.setSelection(range.index + 1);

            } catch (err) {
                console.error("Upload failed", err);
                setError('Lỗi upload ảnh vào nội dung');
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), []);

    const handleCancel = () => {
        setEditingId(null);
        setFormData({ title: '', content: '', thumbnail: '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Payload bây giờ đã bao gồm thumbnail từ formData
            const payload = {
                title: formData.title,
                content: formData.content,
                thumbnail: formData.thumbnail,
                galleryImages: [],
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
            setError('Lỗi khi lưu bài viết.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditPost = (post) => {
        setEditingId(post.id);
        setFormData({
            title: post.title,
            content: post.content || '',
            thumbnail: post.thumbnail || '', // Load thumbnail cũ lên form
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeletePost = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
        try {
            await deleteBlog(id);
            setSuccessMessage('Đã xóa');
            fetchPosts();
        } catch (e) { setError('Lỗi xóa bài'); }
    };

    return (
        <div className="blog-admin-container">
            {/* ... Header, Alert ... */}
            <AdminHeader></AdminHeader>
            {error && <div className="alert alert-error">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="blog-form">
                <div className="form-section">
                    <h2>{editingId ? 'Chỉnh Sửa' : 'Tạo Bài Viết'}</h2>

                    <div className="form-group">
                        <label>Tiêu Đề</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                        />
                    </div>

                    {/* --- UI MỚI: Khu vực chọn Ảnh Bìa --- */}
                    <div className="form-group">
                        <label>Ảnh Bìa (Thumbnail)</label>
                        <div className="thumbnail-upload-container" style={{ marginBottom: '15px' }}>
                            <input
                                type="file"
                                ref={thumbnailInputRef}
                                onChange={handleThumbnailUpload}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />

                            {/* Nút upload */}
                            {!formData.thumbnail ? (
                                <button
                                    type="button"
                                    onClick={() => thumbnailInputRef.current?.click()}
                                    className="btn btn-secondary"
                                    disabled={isUploadingThumbnail}
                                >
                                    {isUploadingThumbnail ? 'Đang tải lên...' : '📷 Chọn Ảnh Bìa'}
                                </button>
                            ) : (
                                /* Preview ảnh đã chọn */
                                <div className="thumbnail-preview-wrapper" style={{ position: 'relative', width: 'fit-content' }}>
                                    <img
                                        src={formData.thumbnail}
                                        alt="Thumbnail Preview"
                                        style={{ maxWidth: '200px', borderRadius: '8px', border: '1px solid #ddd' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={removeThumbnail}
                                        style={{
                                            position: 'absolute', top: '-10px', right: '-10px',
                                            background: 'red', color: 'white', border: 'none',
                                            borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer'
                                        }}
                                        title="Xóa ảnh bìa"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* ------------------------------------- */}

                    <div className="form-group">
                        <label>Nội Dung</label>
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={formData.content}
                            onChange={handleContentChange}
                            modules={modules}
                            className="quill-editor"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={loading || isUploadingThumbnail} className="btn btn-primary">
                            {loading ? 'Đang lưu...' : editingId ? 'Cập Nhật' : 'Tạo Bài Viết'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={handleCancel} className="btn btn-secondary">Hủy</button>
                        )}
                    </div>
                </div>
            </form>

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
                            <div className="col-images">Ảnh Bìa</div> {/* Đổi tên cột */}
                            <div className="col-actions">Hành Động</div>
                        </div>

                        {posts.map((post) => (
                            <div key={post.id} className="table-row">
                                <div className="col-title">
                                    <p className="post-title">{post.title}</p>
                                    <p className="post-excerpt">
                                        {(post.content || '').replace(/<[^>]*>/g, '').substring(0, 80)}...
                                    </p>
                                </div>
                                <div className="col-date">
                                    {formatDate(post.createdAt)}
                                </div>

                                {/* --- UI MỚI: Hiển thị Thumbnail trong list --- */}
                                <div className="col-images">
                                    {post.thumbnail ? (
                                        <img
                                            src={post.thumbnail}
                                            alt="Thumb"
                                            style={{
                                                width: '60px',
                                                height: '40px',
                                                objectFit: 'cover',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: '12px', color: '#999' }}>Không có</span>
                                    )}
                                </div>
                                {/* --------------------------------------------- */}

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