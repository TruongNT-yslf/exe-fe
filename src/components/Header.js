// import {Button, Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
// import React, {useContext} from "react";
// import {Link, useNavigate} from "react-router-dom";
// import {AuthContext} from "../context/AuthContext";
// import Logo from "../assets/images/LOGO-EXE.png";
// export default function Header() {
//     const navigate = useNavigate();
//     const {user, logout} = useContext(AuthContext);
//
//     const handleLogout = () => {
//         logout();
//         navigate("/login");
//     };
//     const renderServiceDropdown = () => {
//         if (!user) {
//             return (
//                 <NavDropdown title="Service" id="service-dropdown">
//                     <NavDropdown.Item as={Link} to="/login">Login to access services</NavDropdown.Item>
//                 </NavDropdown>
//             );
//         }
//
//         switch (user.role) {
//             case "ROLE_ADMIN":
//                 return (
//                     <NavDropdown title="Service" id="service-dropdown">
//                         <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
//                     </NavDropdown>
//                 );
//
//             case "ROLE_STAFF":
//                 return (
//                     <NavDropdown title="Service" id="service-dropdown">
//                         <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
//                     </NavDropdown>
//                 );
//
//             default:
//                 return (
//                     <NavDropdown title="Service" id="service-dropdown">
//                         <NavDropdown.Item as={Link} to="/profile">👨🏻‍💻 Profile</NavDropdown.Item>
//                     </NavDropdown>
//                 );
//         }
//     };
//
//     return (
//         <Navbar
//             expand="lg"
//             fixed="top"
//             className="shadow-sm py-0"
//             style={{backgroundColor: '#EBDCC5'}}
//         >
//             <Container>
//                 <Navbar.Brand href="/" className="p-0 d-flex align-items-center">
//                     <img
//                         src={Logo}
//                         style={{
//                             height: '100%',
//                             maxHeight: '60px',
//                             width: 'auto',
//                             objectFit: 'contain'
//                         }}
//                         alt="MAYÉ"
//                     />
//                     <span
//                         className="fw-bold ms-2"
//                         style={{
//                             color: '#A6C48A',
//                             fontSize: '2.1rem',
//                             lineHeight: '1',
//                             display: 'inline-block',
//                             transform: 'scaleY(1.2)'
//                         }}
//                     >
//         MAYÉ
//     </span>
//                 </Navbar.Brand>
//                 <Navbar.Toggle/>
//                 <Navbar.Collapse>
//                     <Nav className="ms-auto align-items-center p-0">
//                         <Nav.Link href="/">HomePage</Nav.Link>
//                         {renderServiceDropdown()}
//                         {user ? (
//                             <div className="d-flex align-items-center">
//                                 <NavDropdown
//                                     title={<span className="fw-bold" style={{color: '#A6C48A'}}>{user.username}</span>}
//                                     id="user-dropdown"
//                                     align="end"
//                                 >
//                                     <NavDropdown.Item as={Link} to="/profile">
//                                         Your Profile
//                                     </NavDropdown.Item>
//                                 </NavDropdown>
//
//                                 <Button
//                                     variant="outline-danger"
//                                     size="sm"
//                                     className="ms-2"
//                                     onClick={handleLogout}
//                                 >
//                                     Logout
//                                 </Button>
//                             </div>
//                         ) : (
//                             <Button
//                                 variant="success"
//                                 size="sm"
//                                 className="ms-3"
//                                 onClick={() => navigate("/login")}
//                             >
//                                 Login
//                             </Button>
//                         )}
//                     </Nav>
//                 </Navbar.Collapse>
//             </Container>
//         </Navbar>
//     );
// }
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Logo from "../assets/images/LOGO-EXE.png";
import "../assets/css/Header.css";
import { FaShoppingCart } from 'react-icons/fa';
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
export default function Header() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [showCategory, setShowCategory] = useState(false);
    const [showUser, setShowUser] = useState(false);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/categories`)
            .then(res => setCategories(res.data.data))
            .catch(err => console.error(err));
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <Navbar
            expand="lg"
            fixed="top"
            className="custom-navbar shadow-sm p-0"
            style={{ backgroundColor: '#fdfaf7' }}
        >
            <Container fluid className="px-4">
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center py-1">
                    <img
                        src={Logo}
                        style={{ height: '80px', width: 'auto', objectFit: 'contain' }}
                        alt="MAYÉ"
                    />
                    <div className="ms-2 d-flex flex-column justify-content-center" style={{ lineHeight: '1.1' }}>
                        <span className="fw-bold" style={{ color: '#A6C48A', fontSize: '2.6rem', letterSpacing: '-1px' }}>
                            MAYÉ
                        </span>
                        <small className="fw-bold" style={{ color: '#888', fontSize: '0.65rem', letterSpacing: '3px', textAlign: 'center', marginLeft:'5px'}}>
                            NHÀ MÂY TRE
                        </small>
                    </div>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-nav" />
                <Navbar.Collapse id="main-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={Link} to="/" className="nav-item-link">Trang chủ</Nav.Link>
                        <Nav.Link as={Link} to="/about" className="nav-item-link">Về chúng tôi</Nav.Link>

                        <NavDropdown
                            title="Danh mục"
                            id="cat-drop"
                            className="nav-item-link"
                            show={showCategory}
                            onMouseEnter={() => setShowCategory(true)}
                            onMouseLeave={() => setShowCategory(false)}
                        >
                            {categories.map(cat => (
                                <NavDropdown.Item key={cat.id} as={Link} to={`/products?categoryId=${cat.id}`}>
                                    {cat.name}
                                </NavDropdown.Item>
                            ))}
                        </NavDropdown>

                        <div className="ms-lg-3 d-flex align-items-center">
                            {user ? (
                                <>
                                    <NavDropdown
                                        title={<span className="fw-bold" style={{color: '#A6C48A'}}>{user.username}</span>}
                                        id="user-drop"
                                        align="end"
                                        show={showUser}
                                        onMouseEnter={() => setShowUser(true)}
                                        onMouseLeave={() => setShowUser(false)}
                                    >
                                        <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                                        {user.username === "admin" && (
                                            <>
                                                <NavDropdown.Divider />
                                                <NavDropdown.Item onClick={() =>navigate("/admin/dashboard")} className="text-info">Admin Mode</NavDropdown.Item>
                                            </>
                                        )}
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={handleLogout} className="text-danger">Logout</NavDropdown.Item>
                                    </NavDropdown>
                                    <Nav.Link
                                        as={Link}
                                        to="/cart"
                                        className="cart-icon-wrapper me-3 position-relative"
                                        style={{ color: '#2e7d32' }}
                                    >
                                        <FaShoppingCart size={22} />
                                        <span className="cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        </span>
                                    </Nav.Link>
                                </>
                            ) : (
                                <Button
                                    variant="success"
                                    className="rounded-0 px-4 py-2"
                                    onClick={() => navigate("/login")}
                                    style={{ backgroundColor: '#A6C48A', border: 'none', fontWeight: 'bold' }}
                                >
                                    LOGIN
                                </Button>
                            )}
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}