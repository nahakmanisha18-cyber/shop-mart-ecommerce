
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
    FaArrowLeft,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaVenusMars,
    FaBirthdayCake,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaClock,
    FaShieldAlt,
    FaUserCheck,
    FaUserSlash,
    FaSyncAlt,
    FaIdCard,
} from "react-icons/fa";


import "./UserDetailsPage.css";
import { getUserById } from "@/redux/action/userAction";
import { clearUserDetails, clearUserError } from "@/redux/slice/userSlice";
import Loading from "@/Components/Common/Loding/Loading";

export default function UserDetailsPage({ id }) {
    const dispatch = useDispatch();

    const { userDetails, isLoading, isError } = useSelector(
        (state) => state.userStore
    );

    useEffect(() => {
        if (id) {
            dispatch(clearUserError());
            dispatch(getUserById(id));
        }

        return () => {
            dispatch(clearUserDetails());
        };
    }, [dispatch, id]);

    const formatDate = (value, includeTime = false) => {
        if (!value) return "Not provided";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return "Not provided";

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            ...(includeTime
                ? {
                      hour: "2-digit",
                      minute: "2-digit",
                  }
                : {}),
        });
    };

    const formatId = (value) => {
        if (!value) return "—";

        return `#${
    String(value)
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(-8)
    .toUpperCase()
} `;
    };

    const fullAddress = [
        userDetails?.address,
        userDetails?.city,
        userDetails?.state,
        userDetails?.country,
        userDetails?.pincode,
    ]
        .filter(Boolean)
        .join(", ");

    const displayValue = (value) => value || "Not provided";

    if (isLoading && !userDetails) {
        return (
           <Loading/>
        );
    }

    if (isError && !userDetails) {
        return (
            <main className="shop-user-details-page">
                <div className="shop-user-details-error">
                    <FaUserSlash />
                    <h2>Unable to load user</h2>
                    <p>
                        {typeof isError === "string"
                            ? isError
                            : isError?.message || "User details could not be loaded."}
                    </p>

                    <div className="shop-user-details-error-actions">
                        <button
                            type="button"
                            onClick={() => dispatch(getUserById(id))}
                        >
                            Try Again
                        </button>

                        <Link href="/admin/users">
                            Back to Users
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (!userDetails) {
        return (
            <main className="shop-user-details-page">
                <div className="shop-user-details-message">
                    User not found.
                    <Link href="/admin/users"> Back to Users</Link>
                </div>
            </main>
        );
    }

    const user = userDetails;

    return (
        <main className="shop-user-details-page">
            {/* HEADER */}
            <header className="shop-user-details-header">
                <div>
                    <Link
                        href="/admin/users"
                        className="shop-user-back-link"
                    >
                        <FaArrowLeft />
                        Back to Users
                    </Link>

                    <h1>User Details</h1>

                    <p>View registered customer information and account status.</p>
                </div>

                <span className="shop-user-details-id">
                    {formatId(user._id)}
                </span>
            </header>

            {/* PROFILE CARD */}
            <section className="shop-user-profile-card">
                <div className="shop-user-profile-main">
                    <div className="shop-user-details-avatar">
                        {user.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt={user.profileName || "Customer"}
                                onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                    const fallback =
                                        event.currentTarget.nextElementSibling;
                                    if (fallback) fallback.style.display = "flex";
                                }}
                            />
                        ) : null}

                        <span
                            style={{
                                display: user.profileImage ? "none" : "flex",
                            }}
                        >
                            {(user.profileName || "U")
                                .charAt(0)
                                .toUpperCase()}
                        </span>
                    </div>

                    <div className="shop-user-profile-heading">
                        <h2>{user.profileName || "Unnamed User"}</h2>
                        <p>{user.email || "Email not provided"}</p>

                        <div className="shop-user-profile-badges">
                            <span
                                className={`shop - user - detail - badge ${
    user.isBlocked
        ? "blocked"
        : "active"
} `}
                            >
                                {user.isBlocked ? (
                                    <FaUserSlash />
                                ) : (
                                    <FaUserCheck />
                                )}

                                {user.isBlocked ? "Blocked" : "Active"}
                            </span>

                            <span
                                className={`shop - user - detail - badge ${
    user.isVerified
        ? "verified"
        : "unverified"
} `}
                            >
                                <FaShieldAlt />
                                {user.isVerified
                                    ? "Verified"
                                    : "Unverified"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="shop-user-profile-meta">
                    <span>Account Role</span>
                    <strong>{user.role || "user"}</strong>
                </div>
            </section>

            {/* INFORMATION GRID */}
            <div className="shop-user-details-grid">
                {/* PERSONAL INFORMATION */}
                <section className="shop-user-details-card">
                    <div className="shop-user-details-card-heading">
                        <span className="shop-user-details-heading-icon orange">
                            <FaUser />
                        </span>
                        <div>
                            <h3>Personal Information</h3>
                            <p>Customer's basic details</p>
                        </div>
                    </div>

                    <div className="shop-user-detail-row">
                        <span><FaIdCard /> User ID</span>
                        <strong>{formatId(user._id)}</strong>
                    </div>

                    <div className="shop-user-detail-row">
                        <span><FaUser /> Profile Name</span>
                        <strong>{displayValue(user.profileName)}</strong>
                    </div>

                    <div className="shop-user-detail-row">
                        <span><FaVenusMars /> Gender</span>
                        <strong>{displayValue(user.gender)}</strong>
                    </div>

                    <div className="shop-user-detail-row">
                        <span><FaBirthdayCake /> Date of Birth</span>
                        <strong>
                            {user.dateOfBirth
                                ? formatDate(user.dateOfBirth)
                                : "Not provided"}
                        </strong>
                    </div>
                </section>

                {/* CONTACT INFORMATION */}
                <section className="shop-user-details-card">
                    <div className="shop-user-details-card-heading">
                        <span className="shop-user-details-heading-icon blue">
                            <FaEnvelope />
                        </span>
                        <div>
                            <h3>Contact Information</h3>
                            <p>Customer contact details</p>
                        </div>
                    </div>

                    <div className="shop-user-detail-row">
                        <span><FaEnvelope /> Email</span>
                        <strong>{displayValue(user.email)}</strong>
                    </div>

                    <div className="shop-user-detail-row">
                        <span><FaPhone /> Phone Number</span>
                        <strong>{displayValue(user.phoneNumber)}</strong>
                    </div>

                    <div className="shop-user-detail-row shop-user-address-row">
                        <span><FaMapMarkerAlt /> Address</span>
                        <strong>{fullAddress || "Address not provided"}</strong>
                    </div>
                </section>

                {/* ACCOUNT INFORMATION */}
                <section className="shop-user-details-card">
                    <div className="shop-user-details-card-heading">
                        <span className="shop-user-details-heading-icon green">
                            <FaShieldAlt />
                        </span>
                        <div>
                            <h3>Account Information</h3>
                            <p>Account status and permissions</p>
                        </div>
                    </div>

                    <div className="shop-user-detail-row">
                        <span><FaShieldAlt /> Role</span>
                        <strong className="shop-user-role">
                            {displayValue(user.role)}
                        </strong>
                    </div>

                    <div className="shop-user-detail-row">
                        <span><FaUserCheck /> Verification</span>
                        <strong>
                            {user.isVerified ? "Verified" : "Unverified"}
                        </strong>
                    </div>

                    <div className="shop-user-detail-row">
                        <span><FaUserSlash /> Account Status</span>
                        <strong>
                            {user.isBlocked ? "Blocked" : "Active"}
                        </strong>
                    </div>

                    <div className="shop-user-detail-row">
                        <span><FaClock /> Last Login</span>
                        <strong>
                            {user.lastLogin
                                ? formatDate(user.lastLogin, true)
                                : "No login recorded"}
                        </strong>
                    </div>
                </section>

                {/* ACCOUNT TIMELINE */}
                <section className="shop-user-details-card">
                    <div className="shop-user-details-card-heading">
                        <span className="shop-user-details-heading-icon purple">
                            <FaCalendarAlt />
                        </span>
                        <div>
                            <h3>Account Timeline</h3>
                            <p>Registration and recent updates</p>
                        </div>
                    </div>

                    <div className="shop-user-detail-row">
                        <span><FaCalendarAlt /> Registered On</span>
                        <strong>{formatDate(user.createdAt, true)}</strong>
                    </div>

                    <div className="shop-user-detail-row">
                        <span><FaClock /> Last Updated</span>
                        <strong>{formatDate(user.updatedAt, true)}</strong>
                    </div>
                </section>
            </div>
        </main>
    );
}