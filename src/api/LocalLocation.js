// Giả sử bạn đặt file json tại: public/data/dia-chinh-web.json
// Hoặc import trực tiếp nếu file < 5MB
import locationData from '../assets/dia-chinh-web.json';

// Hàm lấy danh sách Tỉnh/Thành
export const getProvinces = () => {
    // Lọc các bản ghi có cấp là Tỉnh (T)
    const provinces = locationData.filter(item => item.capDiaChinh === 'T');

    // Sắp xếp A-Z (trừ Hà Nội, TP.HCM có thể để đầu nếu muốn)
    return provinces.sort((a, b) => a.ten.localeCompare(b.ten));
};

// Hàm lấy danh sách Xã/Phường theo Mã Tỉnh
export const getWardsByProvince = (provinceId) => {
    if (!provinceId) return [];

    // Lọc các bản ghi có cha là provinceId
    // Lưu ý: Trong file JSON, diaChinhChaId là chuỗi ("1"), provinceId cũng cần là chuỗi
    const wards = locationData.filter(item =>
        item.diaChinhChaId === String(provinceId) && item.capDiaChinh === 'P'
    );

    // Sắp xếp A-Z để dễ tìm vì số lượng xã rất lớn
    return wards.sort((a, b) => a.ten.localeCompare(b.ten));
};

