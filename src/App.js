
import './App.css';
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/auth/HomePage";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Logout from "./components/Logout";
import { getToken } from "./utils/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
// import ProtectedRoute from "./routes/ProtectedRoute";
// import PrivateRoute from "./routes/PrivateRoute";
import ViewProduct from "./pages/products/ViewProduct";
import PublicRoute from "./routes/PublicRoute";
import ProfilePage from "./pages/profile/ProfilePage";
import ProductDetails from "./pages/products/ProductDetails";
import BlogDetail from "./pages/blog/BlogDetail";
import BlogAdmin from "./components/blog/BlogAdmin";
import BlogList from "./components/blog/BlogList";
import Cart from "./pages/cart/Cart";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductList from "./pages/admin/feature/AdminProductList";
import AddNewProduct from "./pages/admin/feature/AddNewProduct";
import ChangePassword from "./pages/auth/ChangePassword";
import EditProduct from "./components/admin/navigate-view-or-edit/EditProduct";
import AdminViewProduct from "./components/admin/navigate-view-or-edit/ViewProduct";
import Checkout from "./pages/checkout/CheckoutPage";
import AdminOrderList from "./pages/admin/feature/AdminOrderList";
import ProtectedRoute from "./routes/ProtectedRoute";
function App() {
    const token = getToken();

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* ================= PUBLIC ROUTES ================= */}
                    <Route path="/login" element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    } />

                    <Route path="/home" element={<HomePage />} />
                    <Route path="/products" element={<ViewProduct />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/blogs" element={<BlogList />} />
                    <Route path="/blog/:id" element={<BlogDetail />} />
                    <Route path="/logout" element={<Logout />} />

                    <Route path="/" element={<Navigate to="/home" replace />} />

                    {/* ================= USER ROUTES ================= */}
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

                    {/* ================= ADMIN ROUTES ================= */}
                    <Route path="/admin/*" element={
                        <ProtectedRoute roles={['ROLE_ADMIN']}>
                            <Routes>
                                <Route path="dashboard" element={<AdminDashboard />} />
                                <Route path="blog" element={<BlogAdmin />} />
                                <Route path="product-management" element={<AdminProductList />} />
                                <Route path="add-new-product" element={<AddNewProduct />} />
                                <Route path="products/edit/:id" element={<EditProduct />} />
                                <Route path="products/view/:id" element={<AdminViewProduct />} />
                                <Route path="order-management" element={<AdminOrderList />} />
                            </Routes>
                        </ProtectedRoute>
                    } />

                    {/* Catch-all: Nếu gõ bậy bạ thì về trang chủ */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
export default App;