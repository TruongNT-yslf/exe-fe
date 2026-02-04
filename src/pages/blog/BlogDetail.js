'use client';

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogById, getBlogs } from '../../api/Blog';
import { formatDate } from '../../utils/dateFormat';
import './BlogDetail.css';
import {Helmet} from "react-helmet-async";
import Logo from "../../assets/images/LOGO-EXE.png";
export default function BlogDetail() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const response = await getBlogById(id);
                setBlog(response.data.data);
                setSelectedImage(response.data.data?.galleryImages?.[0] || null);
            } catch (err) {
                console.error('Error fetching blog:', err);
                setError('Không thể tải bài viết');
            } finally {
                setLoading(false);
            }
        };

        const fetchRelatedBlogs = async () => {
            try {
                const response = await getBlogs();
                const filtered = response.data.data
                    ?.filter((b) => b.id !== parseInt(id))
                    .slice(0, 3) || [];
                setRelatedBlogs(filtered);
            } catch (err) {
                console.error('Error fetching related blogs:', err);
            }
        };

        if (id) {
            fetchBlog();
            fetchRelatedBlogs();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="blog-detail-loading">
                <div className="blog-detail-loading-content">
                    <div className="blog-detail-spinner"></div>
                    <p className="blog-detail-loading-text">Đang tải bài viết...</p>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="blog-detail-error">
                <div className="blog-detail-error-content">
                    <p className="blog-detail-error-message">{error || 'Bài viết không tồn tại'}</p>
                    <Link
                        to="/blogs"
                        className="blog-detail-error-link"
                    >
                        Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="blog-detail-container">
            <Helmet>
                <title>Blog | Nhà mây tre</title>
                <link rel="icon" href={Logo} />
            </Helmet>
            <div className="blog-detail-nav">
                <div className="blog-detail-nav-wrapper">
                    <Link to="/blogs" className="blog-detail-nav-link">
                        ← Quay lại danh sách
                    </Link>
                </div>
            </div>

            <div className="blog-detail-wrapper">
                <div className="blog-detail-content">
                    <div className="blog-detail-header">
                        <h1 className="blog-detail-title">
                            {blog.title}
                        </h1>
                        <p className="blog-detail-date">
                            {formatDate(blog.createdAt)}
                        </p>
                    </div>

                    {selectedImage && (
                        <div className="blog-detail-featured-image-container">
                            <img
                                src={selectedImage}
                                alt={blog.title}
                                className="blog-detail-featured-image"
                            />
                        </div>
                    )}

                    <div
                        className="blog-detail-body"
                        dangerouslySetInnerHTML={{
                            __html: blog.content || '',
                        }}
                    />

                    {blog.galleryImages && blog.galleryImages.length > 1 && (
                        <div className="blog-detail-gallery">
                            <h2 className="blog-detail-gallery-title">Hình ảnh liên quan</h2>
                            <div className="blog-detail-gallery-grid">
                                {blog.galleryImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`blog-detail-gallery-item ${selectedImage === image ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(image)}
                                    >
                                        <img
                                            src={image}
                                            alt={`Gallery ${index + 1}`}
                                            className="blog-detail-gallery-item-image"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="blog-detail-divider"></div>

                    {relatedBlogs.length > 0 && (
                        <div className="blog-detail-related">
                            <h2 className="blog-detail-related-title">Bài viết liên quan</h2>
                            <div className="blog-detail-related-grid">
                                {relatedBlogs.map((relatedBlog) => (
                                    <Link key={relatedBlog.id} to={`/blog/${relatedBlog.id}`} className="blog-detail-related-card">
                                        <div className="blog-detail-related-card-image">
                                            {relatedBlog.thumbnail ? (
                                                <img
                                                    src={relatedBlog.thumbnail}
                                                    alt={relatedBlog.title}
                                                    className="blog-detail-related-card-image-img"
                                                />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom right, var(--color-muted), rgba(102, 102, 102, 0.2))' }}></div>
                                            )}
                                        </div>

                                        <h3 className="blog-detail-related-card-title">
                                            {relatedBlog.title}
                                        </h3>
                                        <p className="blog-detail-related-card-date">
                                            {formatDate(relatedBlog.createdAt)}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="blog-detail-cta">
                        <Link to="/blogs" className="blog-detail-cta-link">
                            Xem tất cả bài viết
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
