"use client";

import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";

import "./ProfileeEditForm.css"
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "@/redux/action/userAction";
import { useRouter } from "next/navigation";
import { imageUpload } from "@/services/imageUpload";


const ProfileEditForm = () => {
    const defaultImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

    const { user } = useSelector((state) => state.authStore);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(defaultImage);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const dispatch = useDispatch();

    const router = useRouter()
    const [formData, setFormData] = useState({
        profileName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
    });



    const handleImageSelect = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setSelectedFile(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleImageUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);

        const imageUrl = await imageUpload(selectedFile);

        if (!imageUrl) {
            setUploading(false);
            return;
        }

        const updatedUser = {
            ...user,
            profileImage: imageUrl,
        };

        await dispatch(updateProfile(updatedUser));

        setUploading(false);
        setSelectedFile(null);
    };
    useEffect(() => {
        if (user) {
            setPreviewImage(user.profileImage || defaultImage);

            setFormData({
                profileName: user.profileName || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                gender: user.gender || "",
                dateOfBirth: user.dateOfBirth || "",
                address: user.address || "",
                city: user.city || "",
                state: user.state || "",
                country: user.country || "",
                pincode: user.pincode || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await dispatch(updateProfile({
            ...formData,
            profileImage: previewImage
        }));

        if (res) {
            router.push("/profile");
        }
    };

    return (

        <Container className="py-5">
            <Form onSubmit={handleSubmit}>
                <Card className="edit-profile-card shadow">

                    <Card.Body>

                        {/* Header */}
                        <div className="edit-header">
                            <div>
                                <h2>Edit Profile</h2>
                                <p>
                                    Keep your personal information up to date.
                                </p>
                            </div>
                        </div>

                        {/* Profile Image */}
                        <div className="text-center mb-5">

                            <img
                                src={previewImage}
                                className="edit-profile-image"
                            />

                            <input
                                type="file"
                                hidden
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageSelect}
                            />

                            <br />

                            {!selectedFile ? (

                                <Button
                                    className="mt-3 cp-btn"
                                    // variant="outline-primary"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    Change Photo
                                </Button>

                            ) : (

                                <Button
                                    className="mt-3 cp-btn"
                                    
                                    onClick={handleImageUpload}
                                    disabled={uploading}
                                >
                                    {uploading ? "Uploading..." : "Save Photo"}
                                </Button>

                            )}

                        </div>

                        {/* Personal Information */}
                        <h4 className="section-title">
                            Personal Information
                        </h4>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Full Name
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="profileName"
                                        value={formData.profileName}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Email
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Phone Number
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Gender
                                    </Form.Label>
                                    <Form.Select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            Select Gender
                                        </option>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>

                                <Form.Group className="mb-4">

                                    <Form.Label>
                                        Date Of Birth
                                    </Form.Label>

                                    <Form.Control
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                    />

                                </Form.Group>

                            </Col>

                        </Row>

                        {/* Address */}

                        <h4 className="section-title mt-3">
                            Address Details
                        </h4>

                        <Row>

                            <Col md={12}>

                                <Form.Group className="mb-4">

                                    <Form.Label>
                                        Address
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />

                                </Form.Group>

                            </Col>

                            <Col md={6}>

                                <Form.Group className="mb-4">

                                    <Form.Label>
                                        City
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />

                                </Form.Group>

                            </Col>

                            <Col md={6}>

                                <Form.Group className="mb-4">

                                    <Form.Label>
                                        State
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                    />

                                </Form.Group>

                            </Col>

                            <Col md={6}>

                                <Form.Group className="mb-4">

                                    <Form.Label>
                                        Country
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                    />

                                </Form.Group>

                            </Col>

                            <Col md={6}>

                                <Form.Group className="mb-4">

                                    <Form.Label>
                                        Pincode
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                    />

                                </Form.Group>

                            </Col>

                        </Row>

                        {/* Buttons */}

                        <div className="text-end mt-4">

                            <Button
                                type="button"
                                variant="secondary"
                                className="me-3"
                                onClick={() => router.push("/profile")}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="primary"
                                className="cp-btn"
                            >
                                Save Changes
                            </Button>

                        </div>

                    </Card.Body>

                </Card>

            </Form>

        </Container>

    )

}

export default ProfileEditForm;