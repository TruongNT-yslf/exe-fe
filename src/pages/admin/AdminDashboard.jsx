"use client"
import {
    Container,
    Row,
    Col,
    Card,
    Button,
} from "react-bootstrap";
import {Link} from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader";

const AdminDashboard = () => {
    return (
        <Container className="py-5">
            {/* Header với tiêu đề chính */}
            <AdminHeader></AdminHeader>
            <Row>
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-warning text-dark">
                            <div className="d-flex justify-content-between align-items-center">
                                <h3 className="mb-0">Bảng điều khiển</h3>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {/* Manager Features */}
                            <Row className="mt-4">
                                <Col md={4}>
                                    <Card className="h-100">
                                        <Card.Body className="text-center">
                                            <h6>Tạo blog mới</h6>
                                            <p className="text-muted small">Tạo các bài viết cho website của bạn</p>
                                            <Link to={"/admin/blog"}>
                                                <Button variant="outline-success" size="sm">
                                                    Tạo blog
                                                </Button>
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="h-100">
                                        <Card.Body className="text-center">
                                            <h6>Thêm sản phẩm mới</h6>
                                            <p className="text-muted small">Thêm sản phầm mới cho hệ thống</p>
                                            <Link to="/admin/add-new-product">
                                                <Button variant="outline-success" size="sm">
                                                    Thêm sản phẩm
                                                </Button>
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="h-100">
                                        <Card.Body className="text-center">
                                            <h6>Quản lý sản phẩm</h6>
                                            <p className="text-muted small">Quản lý toàn bộ sản phẩm của hệ thống</p>
                                            <Link to={"/admin/product-management"}>
                                                <Button variant="outline-success" size="sm">
                                                    Hiện danh sách sản phẩm
                                                </Button>
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <Row className="mt-4">
                                <Col md={4}>
                                    <Card className="h-100">
                                        <Card.Body className="text-center">
                                            <h6>Feature</h6>
                                            <p className="text-muted small">Feature Description</p>
                                            <Button variant="outline-success" size="sm">
                                                View Feature
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="h-100">
                                        <Card.Body className="text-center">
                                            <h6>Feature</h6>
                                            <p className="text-muted small">Feature Description</p>
                                            <Button variant="outline-success" size="sm">
                                                View Feature
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="h-100">
                                        <Card.Body className="text-center">
                                            <h6>Feature</h6>
                                            <p className="text-muted small">Feature Description</p>
                                            <Button variant="outline-success" size="sm">
                                                View Feature
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default AdminDashboard;