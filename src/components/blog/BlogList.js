'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs } from '../../api/Blog';
import { formatDate } from '../../utils/dateFormat';
import './BlogList.css';

export default function BlogList() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const response = await getBlogs();
                setBlogs(response.data.data || []);
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError('Không thể tải danh sách bài viết');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <div className="blog-list-loading">
                <div className="blog-list-loading-content">
                    <div className="blog-list-spinner"></div>
                    <p className="blog-list-loading-text">Đang tải bài viết...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="blog-list-error">
                <div className="blog-list-error-content">
                    <p className="blog-list-error-message">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="blog-list-error-button"
                    >
                        Tải lại trang
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="blog-list-container">
            <div className="blog-list-wrapper">
                <div className="blog-list-header">
                    <h1 className="blog-list-title">TIN TỨC MỚI</h1>
                    <p className="blog-list-subtitle">
                        Khám phá những bài viết mới nhất về mây tre đan
                    </p>
                </div>

                <div className="blog-grid">
                    {blogs.length > 0 ? (
                        blogs.map((blog) => (
                            <Link key={blog.id} to={`/blog/${blog.id}`} className="blog-card-link">
                                <div className="blog-card">
                                    <div className="blog-card-image-container">
                                        {blog.thumbnail !== null ? (
                                            <img
                                                src={blog.thumbnail}
                                                alt={blog.title}
                                                className="blog-card-image"
                                            />
                                        ) : (
                                            <div className="blog-card-image-placeholder">
                                                <span>Không có ảnh</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <p className="blog-card-date">
                                            {formatDate(blog.createdAt)}
                                        </p>

                                        <h2 className="blog-card-title">
                                            {blog.title}
                                        </h2>

                                        <p className="blog-card-excerpt">
                                            {blog.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                        </p>

                                        <div className="blog-card-more">
                      <span className="blog-card-more-link">
                        Đọc tiếp →
                      </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="blog-list-empty">
                            <p className="blog-list-empty-text">Chưa có bài viết nào</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
