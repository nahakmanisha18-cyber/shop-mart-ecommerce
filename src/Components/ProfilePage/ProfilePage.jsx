"use client";

import { useState, useRef, useEffect } from "react";
import "./ProfilePage.css";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
} from "react-bootstrap";
import { imageUpload } from "@/services/imageUpload";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, getUserProfile } from "@/redux/action/userAction";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/action/authAction";
import Loading from "../Common/Loding/Loading";



const ProfilePage = () => {
    const defaultImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

    const { user } = useSelector((state) => state.authStore);

    useEffect(() => {
        if (user) {
            setProfile({
                profileImage: user.profileImage || "",
                profileName: user.profileName || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                gender: user.gender || "",
                age: user.age || "",
                location: user.location || "",
                dateOfBirth: user.dateOfBirth || "",
                address: user.address || "",
                city: user.city || "",
                state: user.state || "",
                country: user.country || "",
                pincode: user.pincode || "",
            });
        }
    }, [user]);

    const { updatedProfile, isUpdated, isLoading } = useSelector((state) => state.userStore);

    const router = useRouter()
    const [editMode, setEditMode] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);

    const [previewImage, setPreviewImage] = useState("");

    const fileInputRef = useRef(null);

    const dispatch = useDispatch()

    const [profile, setProfile] = useState({
        profileImage: "",
        profileName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        age: "",
        location: "",
        dateOfBirth: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
    });


    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };


    const handleImageSelect = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setSelectedFile(file);

        setPreviewImage(URL.createObjectURL(file));

    }

    useEffect(() => {
        dispatch(getUserProfile());
    }, [dispatch]);

    const handleSaveImage = async () => {
        if (!selectedFile) return;

        setUploading(true); // loader on

        const imageUrl = await imageUpload(selectedFile);

        if (!imageUrl) {
            alert("Image upload failed!");
            setUploading(false);
            return;
        }

        const updatedData = {
            ...profile,
            profileImage: imageUrl,
        };

        await dispatch(updateProfile(updatedData));

        setProfile(updatedData); // ← local state bhi turant update karo
        setSelectedFile(null);
        setShowImageModal(false);
        setUploading(false); // loader off
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreviewImage(profile.profileImage || defaultImage);
        setShowImageModal(false);
    }

    useEffect(() => {
        if (user) {
            setProfile(user);
        }
    }, [user]);

    useEffect(() => {
        if (isUpdated && updatedProfile) {
            setProfile(updatedProfile);
        }
    }, [isUpdated, updatedProfile]);

    const handleLogout = async () => {
        const result = await dispatch(logout());

        if (logout.fulfilled.match(result)) {
            router.push("/");
        }
    };

    if (isLoading) {
        return (
            <Loading />
        );
    }
    return (
        <Container className="profile-container py-5">

            <Card className="profile-card shadow">

                <Row>

                    <Col lg={4} md={5} className="profile-left">

                        <div className="profile-image-box">

                            <div className="profile-image-wrapper">

                                <img
                                    src={profile.profileImage || defaultImage}
                                    className="profile-image"
                                />

                                <button
                                    className="edit-image-btn"
                                    onClick={() => {
                                        setPreviewImage(profile.profileImage || defaultImage);
                                        setShowImageModal(true);
                                    }}
                                >
                                    <i className="bi bi-pencil-fill"></i>
                                </button>

                            </div>
                            <Modal
                                show={showImageModal}
                                onHide={handleCancel}
                                centered
                            >

                                <Modal.Header closeButton>

                                    <Modal.Title>

                                        Update Profile Picture

                                    </Modal.Title>

                                </Modal.Header>

                                <Modal.Body>

                                    <div className="text-center">

                                        <img

                                            src={previewImage}

                                            className="preview-profile"

                                        />

                                        <input

                                            type="file"

                                            accept="image/*"

                                            hidden

                                            ref={fileInputRef}

                                            onChange={handleImageSelect}

                                        />

                                    </div>

                                </Modal.Body>

                                <Modal.Footer>

                                    <Button
                                        variant="secondary"
                                        onClick={handleCancel}
                                    >

                                        Cancel

                                    </Button>

                                    <Button
                                        variant="primary"
                                        className="cp-btn"
                                        onClick={() => {
                                            if (selectedFile) {
                                                handleSaveImage();
                                            } else {
                                                fileInputRef.current.click();
                                            }
                                        }}
                                    >
                                        {selectedFile ? "Save Image" : "Update Image"}
                                    </Button>

                                </Modal.Footer>

                            </Modal>

                            <h3 className="profile-name">
                                {profile.profileName || "User Name"}
                            </h3>

                            <p className="profile-email">
                                {profile.email}
                            </p>

                            <div className="profile-divider"></div>

                            <div className="profile-info">

                                <div className="profile-info-item">
                                    <i className="bi bi-person-badge"></i>
                                    <div>
                                        <small>Role</small>
                                        <h6>{profile.role}</h6>
                                    </div>
                                </div>


                                <div className="profile-info-item">
                                    <i className="bi bi-shield-check"></i>
                                    <div>
                                        <small>Account</small>
                                        <h6>
                                            {profile.isBlocked ? "Blocked" : "Active"}
                                        </h6>
                                    </div>
                                </div>

                            </div>
                            <div className="profile-action-btns">



                                <Button
                                    className="logout-btn"
                                    onClick={handleLogout}
                                >
                                    <i className="bi bi-box-arrow-right me-2"></i>
                                    Logout
                                </Button>

                            </div>


                        </div>

                    </Col>



                    <Col lg={8} md={7} className="profile-right">

                        <div className="profile-header">

                            <div>
                                <h2 className="profile-heading">
                                    Personal Information
                                </h2>

                                <p className="profile-subtitle">
                                    Manage your personal details
                                </p>
                            </div>

                            <Button
                                className="profile-edit-btn"
                                onClick={() => router.push("/profile-edit")}
                            >
                                <i className="bi bi-pencil-square me-2"></i>
                                Edit Profile
                            </Button>

                        </div>

                        <Row className="g-4">

                            <Col md={6}>
                                <div className="info-box">
                                    <span>Full Name</span>
                                    <h6>{profile.profileName || "Not Added"}</h6>
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="info-box">
                                    <span>Email</span>
                                    <h6>{profile.email}</h6>
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="info-box">
                                    <span>Phone Number</span>
                                    <h6>{profile.phoneNumber || "Not Added"}</h6>
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="info-box">
                                    <span>Gender</span>
                                    <h6>{profile.gender || "Not Added"}</h6>
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="info-box">
                                    <span>Date of Birth</span>
                                    <h6>{profile.dateOfBirth || "Not Added"}</h6>
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="info-box">
                                    <span>Address</span>
                                    <h6>{profile.address || "Not Added"}</h6>
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="info-box">
                                    <span>City</span>
                                    <h6>{profile.city || "Not Added"}</h6>
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="info-box">
                                    <span>State</span>
                                    <h6>{profile.state || "Not Added"}</h6>
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="info-box">
                                    <span>Country</span>
                                    <h6>{profile.country || "Not Added"}</h6>
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className="info-box">
                                    <span>Pincode</span>
                                    <h6>{profile.pincode || "Not Added"}</h6>
                                </div>
                            </Col>

                        </Row>

                    </Col>

                </Row>

            </Card>

        </Container>
    );
};

export default ProfilePage;