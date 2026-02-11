"use client";

import {useNavigate} from "react-router-dom";
import {useState, useEffect, useMemo} from "react";
// Import các hàm xử lý từ file mới tạo
import {getProvinces, getWardsByProvince} from "../../api/LocalLocation";
import {fetchUserProfile, updateUserProfile} from "../../api/Profile";
import "./profile.css";
import {Helmet} from "react-helmet-async";
import Logo from "../../assets/images/LOGO-EXE.png";
export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // Form State
    const [basicInfo, setBasicInfo] = useState({fullName: "", phone: "", email:""});
    const [selectedProvinceId, setSelectedProvinceId] = useState("");
    const [selectedWardId, setSelectedWardId] = useState("");
    const [detailAddress, setDetailAddress] = useState("");

    // Load danh sách Tỉnh ngay khi khởi tạo (dữ liệu tĩnh)
    const provinces = useMemo(() => getProvinces(), []);

    // Tự động tính toán danh sách Xã khi Tỉnh thay đổi
    const wards = useMemo(() => {
        return getWardsByProvince(selectedProvinceId);
    }, [selectedProvinceId]);

    // Load User Data
    useEffect(() => {
        const initData = async () => {
            try {
                const userData = await fetchUserProfile();
                if (!userData) return;

                setUser(userData);
                setBasicInfo({
                    fullName: userData.fullName || "",
                    phone: userData.phone || "",
                    email: userData.email || "",
                });

                if (userData.locationIds?.province) {
                    setSelectedProvinceId(userData.locationIds.province);
                    setSelectedWardId(userData.locationIds.ward || "");
                }

                if (userData.detailAddress) {
                    setDetailAddress(userData.detailAddress);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, []);


    // Xử lý khi chọn Tỉnh
    const handleProvinceChange = (e) => {
        setSelectedProvinceId(e.target.value);
        setSelectedWardId(""); // Reset xã
    };

    // Xử lý Lưu
    const handleUpdate = async (type) => {
        setIsUpdating(true);

        try {
            let payload = {type};

            if (type === "BASIC") {
                payload = {
                    type: "BASIC",
                    fullName: basicInfo.fullName,
                    phone: basicInfo.phone,
                    email: basicInfo.email,
                };
            }

            if (type === "ADDRESS") {
                const pName = provinces.find(p => p.id === selectedProvinceId)?.ten;
                const wName = wards.find(w => w.id === selectedWardId)?.ten;

                if (!detailAddress || !pName || !wName) {
                    alert("Vui lòng nhập đầy đủ địa chỉ");
                    return;
                }

                const address = `${detailAddress}, ${wName}, ${pName}`;

                payload = {
                    type: "ADDRESS",
                    address,
                };
            }

            const updatedData = await updateUserProfile(payload);

            setUser(prev => ({
                ...prev,
                ...updatedData,
            }));

            if (updatedData.success === false) {
                alert(updatedData.message);
            } else {
                await updateUserProfile(payload);
                const freshUser = await fetchUserProfile();
                setUser(freshUser);
                alert("Cập nhật thành công");
            }
        } catch (e) {
            alert(e.message || "Cập nhật thất bại");
        } finally {
            setIsUpdating(false);
        }
    };


    if (loading) return <div className="text-center p-5">Đang tải dữ liệu...</div>;

    return (
        <div className="profile-container container py-4">
            {/* Header Profile */}
            <Helmet>
                <title>Thông tin cá nhân || Nhà Mây Tre</title>
                <link rel="icon" href={Logo} />
            </Helmet>
            <div className="card-bamboo p-4 mb-4 d-flex align-items-center gap-3 shadow-sm bg-white rounded">
                <div
                    className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{width: 60, height: 60, fontSize: 24}}>
                    {user?.fullName?.charAt(0) || "U"}
                </div>
                <div>
                    <h4 className="m-0">{user?.fullName}</h4>
                    <small className="text-muted">{user?.email}</small>
                </div>
            </div>

            <div className="row g-4">
                {/* Menu Trái */}
                <div className="col-md-4">
                    <div className="card-bamboo p-2">
                        <button className="btn btn-light w-100 text-start fw-bold text-success mb-1" onClick={() => navigate("/home")}>
                            Quay về trang chủ
                        </button>
                        <button className="btn btn-light w-100 text-start fw-bold text-warning mb-1" onClick={() => navigate("/change-password")}>
                            Thay đổi mật khẩu
                        </button>
                        <button className="btn btn-light w-100 text-start text-danger" onClick={() => navigate("/logout")}>
                            Đăng xuất
                        </button>
                    </div>
                </div>

                {/* Nội dung Phải */}
                <div className="col-md-8">
                    {/* Form Thông tin cơ bản */}
                    <div className="card-bamboo p-4">
                        <h5 className="section-title">Thông tin cơ bản</h5>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Họ và tên</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={basicInfo.fullName}
                                    onChange={(e) => setBasicInfo({...basicInfo, fullName: e.target.value})}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Số điện thoại</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={basicInfo.phone}
                                    onChange={(e) => setBasicInfo({...basicInfo, phone: e.target.value})}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Email liên lạc</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={basicInfo.email}
                                    onChange={(e) => setBasicInfo({...basicInfo, email: e.target.value})}
                                />
                            </div>
                            <div className="col-12 text-end">
                                <button className="btn btn-bamboo" onClick={() => handleUpdate("BASIC")}
                                        disabled={isUpdating}>
                                    Cập nhật thông tin
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card-bamboo p-4">
                        <h5 className="mb-3 border-bottom pb-2">Địa chỉ nhận hàng</h5>
                        <div className="mb-3">
                            <label className="form-label text-muted small">ĐỊA CHỈ HIỆN TẠI</label>
                            <div className="fw-bold">{user?.address || "Chưa cập nhật"}</div>
                        </div>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Tỉnh / Thành phố</label>
                                <select className="form-select" value={selectedProvinceId}
                                        onChange={handleProvinceChange}>
                                    <option value="">-- Chọn Tỉnh --</option>
                                    {provinces.map(p => (
                                        <option key={p.id} value={p.id}>{p.ten}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Phường / Xã</label>
                                <select
                                    className="form-select"
                                    value={selectedWardId}
                                    onChange={e => setSelectedWardId(e.target.value)}
                                    disabled={!selectedProvinceId}
                                >
                                    <option value="">-- Chọn Xã --</option>
                                    {wards.map(w => (
                                        <option key={w.id} value={w.id}>{w.ten}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12">
                                <label className="form-label">Địa chỉ chi tiết</label>
                                <input
                                    type="text" className="form-control"
                                    placeholder="Số nhà, đường..."
                                    value={detailAddress}
                                    onChange={e => setDetailAddress(e.target.value)}
                                />
                            </div>

                            <div className="col-12 text-end">
                                <button className="btn btn-success" onClick={() => handleUpdate("ADDRESS")}
                                        disabled={isUpdating}>
                                    {isUpdating ? "Đang lưu..." : "Cập nhật Địa chỉ"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}