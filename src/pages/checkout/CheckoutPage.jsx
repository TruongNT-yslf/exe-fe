import React, { useState, useEffect } from 'react';
import '../../assets/css/Checkout.css';
import diachinh from '../../assets/dia-chinh-web.json';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Logo from "../../assets/images/LOGO-EXE.png";
import {Helmet} from "react-helmet-async";
const BACKEND_URL = process.env.REACT_APP_API_URL
export async function login(username, password) {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || "Login failed";
        throw new Error(errorMessage);
    }

    return response.json(); // { token, expiration }
}
const CheckoutPage = ({ userProfile }) => {
    const location = useLocation();
    const navigate = useNavigate();


    const cartItems = location.state?.items || [];
    const totalPrice = location.state?.total || 0;

    const [isNewAddress, setIsNewAddress] = useState(false);
    const [formData, setFormData] = useState({
        name: '', phone: '', email: '', houseNumber: '', note: ''
    });
    const [loc, setLoc] = useState({ province: '', ward: '' });

    useEffect(() => {

        if (cartItems.length === 0) {
            navigate('/cart');
        }

        if (userProfile) {
            setFormData(prev => ({
                ...prev,
                name: userProfile.fullName || '',
                phone: userProfile.phone || '',
                email: userProfile.email || '',
            }));
        }
    }, [userProfile, cartItems, navigate]);

    const provinces = diachinh.filter(d => d.capDiaChinh === 'T');
    const wards = diachinh.filter(d => d.diaChinhChaId === loc.province && d.capDiaChinh === 'P');

    const handleConfirmOrder = async () => {
        const token = localStorage.getItem('token');
        let finalAddress = userProfile?.address || "";

        if (isNewAddress) {
            const pName = provinces.find(p => p.id === loc.province)?.ten || "";
            const wName = wards.find(w => w.id === loc.ward)?.ten || "";
            finalAddress = `${formData.houseNumber}, ${wName}, ${pName}`;
        }

        if (!finalAddress || finalAddress.trim() === ",") {
            alert("Vui lòng cung cấp địa chỉ giao hàng!");
            return;
        }

        const orderRequest = {
            customerName: formData.name,
            customerPhone: formData.phone,
            customerEmail: formData.email,
            shippingAddress: finalAddress,
            note: formData.note,
            totalPrice: totalPrice,
            orderItems: cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: item.price
            }))
        };

        try {
            const response = await axios.post(`${BACKEND_URL}/orders/add`, orderRequest, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                alert("Đặt hàng thành công!");
                navigate('/orders/history'); // Hoặc trang cảm ơn
            }
        } catch (error) {
            alert("Lỗi khi đặt hàng: " + (error.response?.data?.message || "Server error"));
        }
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    return (
        <>
        <Header />
            <Helmet>
                <title>Check out | Nhà Mây Tre</title>
                <link rel="icon" href={Logo} />
            </Helmet>
            <div className="checkout-container">
                <h2 className="checkout-title">Xác Nhận Đơn Hàng</h2>

                <div className="checkout-grid">
                    <div className="section-card">
                        <h4 className="section-title">📍 Thông tin giao hàng</h4>

                        <div className="form-group">
                            <label className="input-label">Họ và tên</label>
                            <input className="input-field" type="text" value={formData.name}
                                   onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>

                        <div className="form-group">
                            <label className="input-label">Số điện thoại</label>
                            <input className="input-field" type="text" value={formData.phone}
                                   onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>

                        <div className="address-section">
                            <p className="address-hint">Chọn nơi nhận hàng:</p>

                            <div className={`address-box ${!isNewAddress ? 'active' : ''}`} onClick={() => setIsNewAddress(false)}>
                                <div className="radio-circle"></div>
                                <div className="address-content">
                                    <strong>Địa chỉ mặc định (Profile)</strong>
                                    <p>{userProfile?.address || "Chưa thiết lập địa chỉ"}</p>
                                </div>
                            </div>

                            <div className={`address-box ${isNewAddress ? 'active' : ''}`} onClick={() => setIsNewAddress(true)}>
                                <div className="radio-circle"></div>
                                <div className="address-content">
                                    <strong>Giao đến địa chỉ mới</strong>
                                    <p>Nhập tỉnh thành, số nhà khác</p>
                                </div>
                            </div>

                            {isNewAddress && (
                                <div className="new-address-inputs">
                                    <div className="select-row">
                                        <select className="input-field" onChange={e => setLoc({...loc, province: e.target.value})}>
                                            <option value="">Chọn Tỉnh/Thành</option>
                                            {provinces.map(p => <option key={p.id} value={p.id}>{p.ten}</option>)}
                                        </select>
                                        <select className="input-field" disabled={!loc.province} onChange={e => setLoc({...loc, ward: e.target.value})}>
                                            <option value="">Chọn Phường/Xã</option>
                                            {wards.map(w => <option key={w.id} value={w.id}>{w.ten}</option>)}
                                        </select>
                                    </div>
                                    <input className="input-field" placeholder="Số nhà, tên đường..."
                                           value={formData.houseNumber} onChange={e => setFormData({...formData, houseNumber: e.target.value})} />
                                </div>
                            )}
                        </div>

                        <div className="form-group" style={{marginTop: '20px'}}>
                            <label className="input-label">Ghi chú</label>
                            <textarea className="input-field" rows="3" onChange={e => setFormData({...formData, note: e.target.value})}></textarea>
                        </div>
                    </div>

                    <div className="section-card summary-card">
                        <h4 className="section-title">🛒 Tóm tắt đơn hàng</h4>
                        <div className="item-list">
                            {cartItems.map((item) => (
                                <div className="item-row" key={item.productId}>
                                    <div className="item-info">
                                        <img src={item.thumbnail} alt="" className="item-img" />
                                        <div>
                                            <p className="item-name">{item.productName}</p>
                                            <p className="item-qty">Số lượng: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="item-price">{formatPrice(item.subTotal)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="total-box">
                            <div className="total-line">
                                <span>Tạm tính:</span>
                                <span>{formatPrice(totalPrice)}</span>
                            </div>
                            <div className="total-line">
                                <span>Phí vận chuyển:</span>
                                <span className="text-success">Miễn phí</span>
                            </div>
                            <div className="total-line grand-total">
                                <span>TỔNG CỘNG:</span>
                                <span className="price-tag">{formatPrice(totalPrice)}</span>
                            </div>
                        </div>

                        <button className="confirm-btn" onClick={handleConfirmOrder}>XÁC NHẬN ĐẶT HÀNG</button>
                    </div>
                </div>
            </div>
        <Footer /></>
    );
};

export default CheckoutPage;