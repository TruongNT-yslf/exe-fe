import {Button, Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import React, {useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";

export default function Header() {
    const navigate = useNavigate();
    const {user, logout} = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    const renderServiceDropdown = () => {
        if (!user) {
            return (
                <NavDropdown title="Service" id="service-dropdown">
                    <NavDropdown.Item as={Link} to="/login">Login to access services</NavDropdown.Item>
                </NavDropdown>
            );
        }

        switch (user.role) {
            case "ROLE_ADMIN":
                return (
                    <NavDropdown title="Service" id="service-dropdown">
                        <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                    </NavDropdown>
                );

            case "ROLE_STAFF":
                return (
                    <NavDropdown title="Service" id="service-dropdown">
                        <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                    </NavDropdown>
                );

            default:
                return (
                    <NavDropdown title="Service" id="service-dropdown">
                        <NavDropdown.Item as={Link} to="/profile">👨🏻‍💻 Profile</NavDropdown.Item>
                    </NavDropdown>
                );
        }
    };

    return (
        <Navbar
            expand="lg"
            fixed="top"
            className="shadow-sm"
            style={{backgroundColor: '#EBDCC5'}}
        >
            <Container>
                <Navbar.Brand href="/" className="fw-bold" style={{color: '#A6C48A'}}>
                    MAYÉ
                </Navbar.Brand>
                <Navbar.Toggle/>
                <Navbar.Collapse>
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link href="/">HomePage</Nav.Link>
                        {renderServiceDropdown()}
                        {user ? (
                            <div className="d-flex align-items-center">
                                <NavDropdown
                                    title={<span className="fw-bold" style={{color: '#A6C48A'}}>{user.username}</span>}
                                    id="user-dropdown"
                                    align="end"
                                >
                                    <NavDropdown.Item as={Link} to="/profile">
                                        Your Profile
                                    </NavDropdown.Item>
                                </NavDropdown>

                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    className="ms-2"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="primary"
                                size="sm"
                                className="ms-3"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
