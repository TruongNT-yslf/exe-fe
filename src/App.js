
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
function App() {
    const token = getToken();
    return (

        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <LoginPage />
                            </PublicRoute>
                        }
                    />
                    <Route path="/products" element={<ViewProduct />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/" element={<Navigate to={token ? "/home" : "/login"} replace />} />
                    <Route path="/blogs" element={<BlogList />} />
                    <Route path="/blog/:id" element={<BlogDetail/>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                    <Route path="/logout" element={<Logout />} />

                    {/* USER routes */}
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    {/* STAFF routes */}

                    {/* ADMIN routes */}
                    <Route path="/admin/blog" element={<BlogAdmin/>} />

                    <Route path="/admin/dashboard" element={<AdminDashboard/>} />
                    <Route path="/admin/product-management" element={<AdminProductList />} />
                    <Route path="/admin/add-new-product" element={<AddNewProduct/>}/>
                    <Route path="/admin/products/edit/:id" element={<EditProduct/>}/>
                    <Route path="/admin/products/view/:id" element={<AdminViewProduct/>}/>
                </Routes>
            </Router>
        </AuthProvider>
    );
}
export default App;
