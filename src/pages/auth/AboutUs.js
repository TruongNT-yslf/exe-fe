import React from 'react';
import './AboutUs.css';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import {useNavigate} from "react-router-dom";

const AboutUs = () => {
    const navigate = useNavigate();
    return (
        <>
            <Header/>
        <div className="about-container" style={{ marginTop: '100px' }}>
            {/* Phần giới thiệu đầu trang */}
            <section className="hero">
                <h1>Nhà Mây Tre - MAYÉ</h1>
                <p>"Gói ghém sự tỉ mỉ, ướp hương nắng giòn tan của làng quê"</p>
            </section>

            {/* Nội dung câu chuyện */}
            <section className="story-section">
                <div className="story-content">
                    <h2>Câu Chuyện Của Chúng Mình</h2>
                    <p>
                        Giữa những hối hả của Hà Nội, <strong>MAYÉ</strong> ra đời để mang đến
                        tiếng lách cách thật khẽ của những nan tre, sợi mây từ làng nghề Phú Vinh trăm tuổi.
                    </p>
                    <p>
                        Chúng mình không chỉ bán túi mây hay đèn tre. Chúng mình gửi gắm vào đó
                        sự tỉ mỉ từ đôi tay nghệ nhân, thổi vào nét hiện đại, tối giản mà bạn tìm kiếm.
                    </p>
                </div>
                <div className="story-image">
                    <img
                        src="https://res.cloudinary.com/dio7kyp2t/image/upload/v1769949249/ecom_store/products/edpr3espymddj2oibjqf.jpg"
                        alt="Sản phẩm mây tre"
                    />
                </div>
            </section>

            {/* Giá trị cốt lõi */}
            <section className="values-grid">
                <div className="value-item">
                    <span>🌿</span>
                    <h3>Thủ Công Việt Nam</h3>
                    <p>Sản phẩm hoàn thiện tỉ mỉ từ làng nghề truyền thống.</p>
                </div>
                <div className="value-item">
                    <span>☕</span>
                    <h3>Sống Chậm</h3>
                    <p>Cảm nhận sự ấm áp của nếp đan thủ công cho riêng mình.</p>
                </div>
                <div className="value-item">
                    <span>✨</span>
                    <h3>Tối Giản</h3>
                    <p>Concept vintage phù hợp với mọi không gian sống hiện đại.</p>
                </div>
            </section>

            {/* Thông tin liên hệ lấy từ ảnh bạn cung cấp */}
            <section className="cta-section">
                <h2>Ghé thăm ngôi nhà nhỏ của tụi mình</h2>
                <p><strong>Hotline:</strong> 0869 152 993</p>
                <p><strong>Email:</strong> nguyenhoa230803@gmail.com</p>
                <button className="cta-button" onClick={() => navigate("/products")}>Khám Phá Sản Phẩm</button>
            </section>
        </div>
            <Footer/>
        </>
    );
};

export default AboutUs;