import "../assets/css/Footer.css";
import Logo from "../assets/images/LOGO-EXE.png";

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-container">


                <div className="footer-col">
                    <img src={Logo} alt="Logo" className="footer-logo" />
                    <p className="footer-desc">
                        <b>MAYÉ</b> - Tổng hợp các items mây tre đan: Túi xách, nội thất, đồ trang trí concept vintage và hiện đại. Sản phẩm được hoàn thiện tỉ mỉ từ làng nghề, ưu tiên tính thẩm mỹ và ứng dụng cao.
                    </p>
                </div>

                {/* Danh mục */}
                <div className="footer-col">
                    <h4>Sản phẩm</h4>
                    <ul>
                        <li><a href="/products?category=1">Nội thất mây</a></li>
                        <li><a href="/products?category=2">Đồ dùng gia đình</a></li>
                        <li><a href="/products?category=3">Phụ kiện thời trang</a></li>
                    </ul>
                </div>

                {/* Chăm sóc khách hàng */}
                <div className="footer-col">
                    <h4>Hỗ trợ & Liên hệ</h4>
                    <ul className="footer-contact-list">
                        <li>
                            <a href="https://www.facebook.com/profile.php?id=61587231650638" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-facebook"></i> Fanpage CSKH
                            </a>
                        </li>
                        <li>
                            <a href="mailto:nguyenhoa230803@gmail.com">
                                <i className="fas fa-envelope"></i> Email: nguyenhoa230803@gmail.com
                            </a>
                        </li>
                        <li>
                            <a href="tel:0869152993">
                                <i className="fas fa-phone"></i> SĐT: 0869 152 993
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Địa chỉ</h4>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                        Thạch Hoà - Thạch Thất - Hà Nội<br/>
                    </p>
                </div>

            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} <b>MAYÉ - Nghệ thuật Mây Tre</b>. All rights reserved.</p>
                <div className="footer-legal">
                    <a href="#">Chính sách bảo mật</a>
                    <a href="#">Điều khoản sử dụng</a>
                </div>
            </div>
        </footer>
    );
}