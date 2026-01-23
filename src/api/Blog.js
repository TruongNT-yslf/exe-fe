import api from "./api";

export const getBlogs = () => api.get("/blog");


// Lấy bài viết theo id
export const getBlogById = (id) => api.get(`/blog/${id}`);


// Tạo bài viết mới
export const createBlog = (data) => api.post("/blog", data);


// Cập nhật bài viết
export const updateBlog = (id, data) => api.put(`/blog/${id}`, data);


// Xóa bài viết
export const deleteBlog = (id) => api.delete(`/blog/${id}`);