"use client";

import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./AdminProfilePage.css";

const AdminProfilePage = () => {
    return (
        <Container fluid className="admin-profile-container">

            <Row>

                {/* Left Side */}

                <Col lg={4}>

                    <Card className="admin-left-card">

                        <div className="admin-profile-top">

                            <img
                                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                alt="Admin"
                                className="admin-profile-image"
                            />

                            <h3>Manisha Patel</h3>

                            <p>admin@gmail.com</p>

                        </div>

                        <hr />

                        <div className="admin-info">

                            <div className="info-item">
                                <span>Role</span>
                                <h6>Administrator</h6>
                            </div>

                            <div className="info-item">
                                <span>Status</span>
                                <h6>Active</h6>
                            </div>

                            <div className="info-item">
                                <span>Member Since</span>
                                <h6>20 June 2026</h6>
                            </div>

                            <div className="info-item">
                                <span>Last Login</span>
                                <h6>01 July 2026</h6>
                            </div>

                        </div>

                        <div className="admin-btn-group">

                            <Button className="edit-btn">
                                Edit Profile
                            </Button>

                            <Button className="logout-btn">
                                Logout
                            </Button>

                        </div>

                    </Card>

                </Col>

                {/* Right Side */}

                <Col lg={8}>

                    <Card className="admin-right-card">

                        <div className="profile-header">

                            <h2>Admin Profile</h2>

                            <p>
                                Manage your administrator account information.
                            </p>

                        </div>

                        <Row className="g-4">

                            <Col md={6}>
                                <div className="profile-box">
                                    <span>Full Name</span>
                                    <h6>Manisha Patel</h6>
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="profile-box">
                                    <span>Email</span>
                                    <h6>admin@gmail.com</h6>
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="profile-box">
                                    <span>Phone Number</span>
                                    <h6>9876543210</h6>
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="profile-box">
                                    <span>Gender</span>
                                    <h6>Female</h6>
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="profile-box">
                                    <span>Date Of Birth</span>
                                    <h6>10 March 2002</h6>
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="profile-box">
                                    <span>Account Type</span>
                                    <h6>Super Admin</h6>
                                </div>
                            </Col>

                        </Row>

                    </Card>

                    {/* Dashboard Stats */}

                    <Row className="mt-4 g-4">

                        <Col md={4}>

                            <Card className="stats-card">

                                <h2>120</h2>

                                <p>Total Products</p>

                            </Card>

                        </Col>

                        <Col md={4}>

                            <Card className="stats-card">

                                <h2>56</h2>

                                <p>Total Users</p>

                            </Card>

                        </Col>

                        <Col md={4}>

                            <Card className="stats-card">

                                <h2>245</h2>

                                <p>Total Orders</p>

                            </Card>

                        </Col>

                    </Row>

                </Col>

            </Row>

        </Container>
    );
};

export default AdminProfilePage;