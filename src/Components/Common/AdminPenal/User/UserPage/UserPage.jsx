"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/redux/action/userAction";
import {
    FaUsers,
    FaUserCheck,
    FaUserSlash,
    FaSearch,
    FaEye,
    FaSortAmountDown,
    FaFilter,
    FaSyncAlt,
    FaChevronLeft,
    FaChevronRight,
    FaTimes,
} from "react-icons/fa";

import "./UserPage.css";
import Loading from "@/Components/Common/Loding/Loading";

const ITEMS_PER_PAGE = 8;

export default function UserPage() {
    const dispatch = useDispatch();

    const {
        users = [],
        isLoading,
        isError,
    } = useSelector((state) => state.userStore);

    const [search, setSearch] = useState("");
    const [accountFilter, setAccountFilter] = useState("all");
    const [verificationFilter, setVerificationFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    const formatId = (id) => {
        if (!id) return "—";

        return `#${String(id)
                .replace(/[^a-zA-Z0-9]/g, "")
                .slice(-8)
                .toUpperCase()
            } `;
    };

    const formatDate = (date) => {
        if (!date) return "—";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return "—";

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const filteredUsers = useMemo(() => {
        let result = [...users];

        // Search by name, email, phone or ID
        const query = search.trim().toLowerCase();

        if (query) {
            result = result.filter((user) =>
                [
                    user.profileName,
                    user.email,
                    user.phoneNumber,
                    user._id,
                    formatId(user._id),
                ].some((value) =>
                    String(value || "").toLowerCase().includes(query)
                )
            );
        }

        // Account status filter
        if (accountFilter === "active") {
            result = result.filter((user) => !user.isBlocked);
        } else if (accountFilter === "blocked") {
            result = result.filter((user) => user.isBlocked);
        }

        // Verification filter
        if (verificationFilter === "verified") {
            result = result.filter((user) => user.isVerified === true);
        } else if (verificationFilter === "unverified") {
            result = result.filter((user) => user.isVerified !== true);
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === "name-asc") {
                return String(a.profileName || "").localeCompare(
                    String(b.profileName || "")
                );
            }

            if (sortBy === "name-desc") {
                return String(b.profileName || "").localeCompare(
                    String(a.profileName || "")
                );
            }

            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();

            if (sortBy === "oldest") return dateA - dateB;

            return dateB - dateA;
        });

        return result;
    }, [users, search, accountFilter, verificationFilter, sortBy]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, accountFilter, verificationFilter, sortBy]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
    );

    const safePage = Math.min(currentPage, totalPages);

    const paginatedUsers = filteredUsers.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
    );

    const verifiedCount = users.filter(
        (user) => user.isVerified === true
    ).length;

    const blockedCount = users.filter(
        (user) => user.isBlocked === true
    ).length;

    const activeCount = users.filter(
        (user) => !user.isBlocked
    ).length;

    const clearFilters = () => {
        setSearch("");
        setAccountFilter("all");
        setVerificationFilter("all");
        setSortBy("newest");
        setCurrentPage(1);
    };

    const errorMessage =
        typeof isError === "string"
            ? isError
            : isError?.message || "Unable to fetch users.";
    
    if(isLoading){
        return <Loading/>
    }

    return (
        <main className="shop-users-page">
            {/* PAGE HEADER */}
            <div className="shop-users-header">
                <div className="shop-users-title">
                   
                    <h1>Users Management</h1>

                    <p>
                        Manage and view your registered customers.
                    </p>
                </div>

                <button
                    type="button"
                    className="shop-users-refresh"
                    onClick={() => dispatch(getAllUsers())}
                    disabled={isLoading}
                >
                    <FaSyncAlt className={isLoading ? "shop-spin" : ""} />
                    {isLoading ? "Loading..." : "Refresh"}
                </button>
            </div>

            {/* SUMMARY CARDS */}
            <div className="shop-users-stats">
                <div className="shop-users-stat-card">
                    <div className="shop-users-stat-icon orange">
                        <FaUsers />
                    </div>

                    <div className="shop-users-stat-content">
                        <span>Total Users</span>
                        <strong>{users.length}</strong>
                        <small>Registered customers</small>
                    </div>
                </div>

                <div className="shop-users-stat-card">
                    <div className="shop-users-stat-icon green">
                        <FaUserCheck />
                    </div>

                    <div className="shop-users-stat-content">
                        <span>Verified Users</span>
                        <strong>{verifiedCount}</strong>
                        <small>Email verification status</small>
                    </div>
                </div>

                <div className="shop-users-stat-card">
                    <div className="shop-users-stat-icon blue">
                        <FaUserCheck />
                    </div>

                    <div className="shop-users-stat-content">
                        <span>Active Accounts</span>
                        <strong>{activeCount}</strong>
                        <small>Accounts not blocked</small>
                    </div>
                </div>

                <div className="shop-users-stat-card">
                    <div className="shop-users-stat-icon red">
                        <FaUserSlash />
                    </div>

                    <div className="shop-users-stat-content">
                        <span>Blocked Users</span>
                        <strong>{blockedCount}</strong>
                        <small>Restricted accounts</small>
                    </div>
                </div>
            </div>

            {/* USERS TABLE */}
            <section className="shop-users-table-card">
                

                {/* SEARCH AND FILTERS */}
                <div className="shop-users-toolbar">
                    <div className="shop-users-search">
                        <FaSearch />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search name, email, phone or ID..."
                            aria-label="Search users"
                        />

                        {search && (
                            <button
                                type="button"
                                className="shop-users-clear-search"
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>

                    <div className="shop-users-filter">
                        <FaFilter />

                        <select
                            value={accountFilter}
                            onChange={(event) =>
                                setAccountFilter(event.target.value)
                            }
                            aria-label="Filter by account status"
                        >
                            <option value="all">All Accounts</option>
                            <option value="active">Active</option>
                            <option value="blocked">Blocked</option>
                        </select>
                    </div>

                    <div className="shop-users-filter">
                        <select
                            value={verificationFilter}
                            onChange={(event) =>
                                setVerificationFilter(event.target.value)
                            }
                            aria-label="Filter by verification"
                        >
                            <option value="all">All Verification</option>
                            <option value="verified">Verified</option>
                            <option value="unverified">Unverified</option>
                        </select>
                    </div>

                    <div className="shop-users-filter shop-users-sort">
                        <FaSortAmountDown />

                        <select
                            value={sortBy}
                            onChange={(event) =>
                                setSortBy(event.target.value)
                            }
                            aria-label="Sort users"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name-asc">Name A–Z</option>
                            <option value="name-desc">Name Z–A</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        className="shop-users-reset"
                        onClick={clearFilters}
                    >
                        Reset
                    </button>
                </div>

                {/* ERROR */}
                {isError && !isLoading && (
                    <div className="shop-users-error">
                        <span>{errorMessage}</span>

                        <button
                            type="button"
                            onClick={() => dispatch(getAllUsers())}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* LOADING */}
                
                        {/* TABLE */}
                        <div className="shop-users-table-scroll">
                            <table className="shop-users-table">
                                <thead>
                                    <tr>
                                        <th>User ID</th>
                                        <th>Customer</th>
                                        <th>Phone</th>
                                        <th>Verification</th>
                                        <th>Account Status</th>
                                        <th>Joined Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedUsers.map((user) => (
                                        <tr key={user._id}>
                                            <td className="shop-user-id">
                                                {formatId(user._id)}
                                            </td>

                                            <td>
                                                <div className="shop-user-profile">
                                                    <div className="shop-user-avatar">
                                                        {user.profileImage && (
                                                            <img
                                                                src={user.profileImage}
                                                                alt={
                                                                    user.profileName ||
                                                                    "Customer"
                                                                }
                                                                onError={(event) => {
                                                                    event.currentTarget.style.display =
                                                                        "none";

                                                                    const fallback =
                                                                        event.currentTarget.nextElementSibling;

                                                                    if (fallback) {
                                                                        fallback.style.display =
                                                                            "flex";
                                                                    }
                                                                }}
                                                            />
                                                        )}

                                                        <span
                                                            style={{
                                                                display: user.profileImage
                                                                    ? "none"
                                                                    : "flex",
                                                            }}
                                                        >
                                                            {(
                                                                user.profileName ||
                                                                "U"
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                    </div>

                                                    <div className="shop-user-info">
                                                        <strong>
                                                            {user.profileName ||
                                                                "Unnamed User"}
                                                        </strong>

                                                        <span>
                                                            {user.email || "No email"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                {user.phoneNumber ||
                                                    "Not provided"}
                                            </td>

                                            <td>
                                                <span
                                                    className={`shop - user - badge ${user.isVerified
                                                            ? "is-verified"
                                                            : "is-unverified"
                                                        } `}
                                                >
                                                    {user.isVerified
                                                        ? "Verified"
                                                        : "Unverified"}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`shop - user - badge ${user.isBlocked
                                                            ? "is-blocked"
                                                            : "is-active"
                                                        } `}
                                                >
                                                    {user.isBlocked
                                                        ? "Blocked"
                                                        : "Active"}
                                                </span>
                                            </td>

                                            <td>
                                                {formatDate(user.createdAt)}
                                            </td>

                                            <td>
                                                <Link
                                                    href={`/admin/users/details/${user._id}`}
                                                    className="shop-user-view-btn"
                                                    title="View user details"
                                                >
                                                    <FaEye />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* EMPTY STATE */}
                        {filteredUsers.length === 0 && !isLoading && (
                            <div className="shop-users-empty">
                                <div className="shop-users-empty-icon">
                                    <FaUsers />
                                </div>

                                <h3>No users found</h3>

                                <p>
                                    Try changing your search or filters.
                                </p>

                                <button
                                    type="button"
                                    onClick={clearFilters}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}

                        {/*  */}
                    
            </section>
        </main>
    );
}