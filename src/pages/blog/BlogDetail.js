'use client';


import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogById } from '../../api/Blog';
import './BlogDetail.css';


export default function BlogDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await getBlogById(id);

            setPost(response.data.data);

            setActiveImageIndex(0);
        } catch (err) {
            setError("Không tìm thấy bài viết");
            console.error('Error fetching post:', err);
        } finally {
            setLoading(false);
        }
    };



    const handlePrevImage = () => {
        if (post?.galleryImages && post.galleryImages.length > 0) {
            setActiveImageIndex(
                (prev) => (prev - 1 + post.galleryImages.length) % post.galleryImages.length
            );
        }
    };

    const handleNextImage = () => {
        if (post?.galleryImages && post.galleryImages.length > 0) {
            setActiveImageIndex(
                (prev) => (prev + 1) % post.galleryImages.length
            );
        }
    };

    if (loading) {
        return (
            <div className="blog-detail-container">
                <div className="loading-spinner">Đang tải...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="blog-detail-container">
                <div className="error-message">
                    <p>Lỗi: {error}</p>
                    <Link to="/blog" className="back-link">← Quay lại danh sách</Link>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="blog-detail-container">
                <div className="error-message">
                    <p>Bài viết không tồn tại</p>
                    <Link to="/blog" className="back-link">← Quay lại danh sách</Link>
                </div>
            </div>
        );
    }

    const hasMultipleImages = post.galleryImages && post.galleryImages.length > 1;


    return (
        <div className="blog-detail-container">
            <Link to="/blog" className="back-link">← Quay lại danh sách</Link>

            <article className="blog-detail">
                <header className="blog-detail-header">
                    <h1 className="blog-detail-title">{post.title}</h1>
                </header>

                {post.galleryImages && post.galleryImages.length > 0 && (
                    <div className="gallery-section">
                        <div className="main-image-wrapper">
                            <img
                                src={post.galleryImages[activeImageIndex]}
                                alt={`${post.title} - hình ${activeImageIndex + 1}`}
                                className="main-image"
                            />
                            {hasMultipleImages && (
                                <>
                                    <button
                                        className="gallery-nav prev-btn"
                                        onClick={handlePrevImage}
                                        aria-label="Hình trước"
                                    >
                                        ‹
                                    </button>
                                    <button
                                        className="gallery-nav next-btn"
                                        onClick={handleNextImage}
                                        aria-label="Hình sau"
                                    >
                                        ›
                                    </button>
                                    <div className="image-counter">
                                        {activeImageIndex + 1} / {post.galleryImages.length}
                                    </div>
                                </>
                            )}
                        </div>

                        {hasMultipleImages && (
                            <div className="thumbnail-gallery">
                                {post.galleryImages.map((image, index) => (
                                    <button
                                        key={index}
                                        className={`thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                                        onClick={() => setActiveImageIndex(index)}
                                    >
                                        <img src={image} alt={`Thumbnail ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="blog-content">
                    <div
                        className="content-text"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>
        </div>
    );
}