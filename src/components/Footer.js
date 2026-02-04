import "../assets/css/Footer.css";
import Logo from "../assets/images/LOGO-EXE.png";
export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-container">

                {/* Logo + mô tả */}
                <div className="footer-col">
                    <img
                        src={Logo}
                        alt="Logo"
                        className="footer-logo"
                    />
                    <p className="footer-desc">
                        Mây tre đan thì ngol luôn.
                    </p>
                </div>

                {/* Product */}
                <div className="footer-col">
                    <h4>Product</h4>
                    <ul>
                        <li><a href="#">Overview</a></li>
                        <li><a href="#">Features</a></li>
                        <li><a href="#">Pricing</a></li>
                    </ul>
                </div>

                {/* Resources */}
                <div className="footer-col">
                    <h4>Resources</h4>
                    <ul>
                        <li><a href="#">Documentation</a></li>
                        <li><a href="#">Guides</a></li>
                        <li><a href="#">Support</a></li>
                    </ul>
                </div>

                {/* Company */}
                <div className="footer-col">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>

            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} MAYÉ All rights reserved.</p>
                <div className="footer-legal">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}
