import {Button, Col, Row} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {ArrowReturnLeft, BoxArrowRight, House, Speedometer2} from "react-bootstrap-icons";
import {useLocation} from "react-router-dom";
import React, {useContext} from "react";
import {AuthContext} from "../../context/AuthContext";

const AdminHeader = () => {
    const {logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const isAdminDashboard = location.pathname.includes("/admin/dashboard");
    const isAdminBlog = location.pathname.includes("/admin/blog");
    const isAdminAddNewProduct = location.pathname.includes("/admin/add-new-product");
    const isAdminProductManagement = location.pathname.includes("/admin/product-management");
    const isAdminEditProduct = location.pathname.includes("/admin/products/edit");
    const isAdminViewProduct = location.pathname.includes("/admin/products/view");

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    return (
        <>
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="fw-bold">
                        {isAdminDashboard ? "Chế độ Admin" : ""}
                        {isAdminAddNewProduct ? "Thêm sản phẩm mới" : ""}
                        {isAdminProductManagement ? "Quản lý sản phẩm" : ""}
                        {isAdminEditProduct ? "Chỉnh sửa sản phẩm" : ""}
                        {isAdminViewProduct ? "Chi tiết sản phẩm": ""}
                    </h2>
                    <p className="text-muted">
                        {isAdminDashboard ? "Quản lý hệ thống" : ""}
                        {isAdminAddNewProduct ? "Thêm sản phẩm mới cho hệ thống của bạn" : ""}
                        {isAdminProductManagement ? "Quản lý sản phẩm trong hệ thống của bạn" : ""}
                        {isAdminEditProduct ? "Chính sửa sản phẩm trong hệ thống của bạn" : ""}
                    </p>
                </Col>
                <Col className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                        {!isAdminDashboard ? (
                            <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>
                                <ArrowReturnLeft className="me-1" size={14} />
                                Trở về trang trước đó
                            </Button>
                        ) : (
                            <></>
                        )}
                        {/* Nút trở về bảng điều khiển */}
                        <Link to="/admin/dashboard">
                            <Button variant="outline-secondary" size="sm">
                                <Speedometer2 className="me-1" size={14} />
                                Bảng điều khiển
                            </Button>
                        </Link>

                        {/* Nút trở về trang chủ */}
                        <Link to="/">
                            <Button variant="outline-secondary" size="sm">
                                <House className="me-1" size={14} />
                                Trang chủ
                            </Button>
                        </Link>

                        {/* Nút đăng xuất */}
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={handleLogout}
                        >
                            <BoxArrowRight className="me-1" size={14} />
                            Đăng xuất
                        </Button>
                    </div>
                </Col>
            </Row>
        </>
    )
}
export default AdminHeader;