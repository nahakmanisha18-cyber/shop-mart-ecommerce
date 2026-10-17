"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
    FaSearch,
    FaWallet,
    FaMoneyBillWave,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaEye,
    FaEdit,
    FaRedoAlt,
    FaFilter,
    FaExclamationCircle,
} from "react-icons/fa";

import { getAllRefunds } from "@/redux/action/refundAction";
import "./RefundPage.css";
import Loading from "@/Components/Common/Loding/Loading";

const formatCurrency = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
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


const formatOrderId = (id) => {
    const value = String(id || "").trim().toUpperCase();

    if (!value || value === "—") return "—";

    // Last 8 characters with # prefix
    return `#${value.slice(-8)}`;
};


const getStatusLabel = (status) => {
    const labels = {
        pending: "Pending",
        processing: "Processing",
        processed: "Processed",
        failed: "Failed",
        cancelled: "Cancelled",
    };

    return labels[status] || status || "Unknown";
};

const RefundPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const {
        refunds = [],
        isLoading,
        isError,
        errorMessage,
    } = useSelector((state) => state.refundStore);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        dispatch(getAllRefunds());
    }, [dispatch]);

    const summary = useMemo(() => {
        const totalAmount = refunds.reduce(
            (sum, refund) => sum + (Number(refund.amount) || 0),
            0
        );

        const processing = refunds.filter(
            (refund) =>
                refund.status === "pending" ||
                refund.status === "processing"
        ).length;

        const processed = refunds.filter(
            (refund) => refund.status === "processed"
        ).length;

        const failed = refunds.filter(
            (refund) => refund.status === "failed"
        ).length;

        return {
            total: refunds.length,
            totalAmount,
            processing,
            processed,
            failed,
        };
    }, [refunds]);

    const filteredRefunds = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        return refunds.filter((refund) => {
            const customerName = refund.userId?.profileName || "";
            const customerEmail = refund.userId?.email || "";
            const orderNumber =
                refund.orderId?.orderNumber ||
                refund.orderId?._id ||
                refund.orderId ||
                "";
            const refundId = refund._id || "";
            const razorpayRefundId = refund.razorpayRefundId || "";

            const matchesSearch =
                !search ||
                String(refundId).toLowerCase().includes(search) ||
                String(orderNumber).toLowerCase().includes(search) ||
                customerName.toLowerCase().includes(search) ||
                customerEmail.toLowerCase().includes(search) ||
                razorpayRefundId.toLowerCase().includes(search);

            const matchesStatus =
                statusFilter === "all" ||
                refund.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [refunds, searchTerm, statusFilter]);

    const handleView = (refundId) => {
        router.push(`/admin/refunds/details/${refundId}`);
    };

    const handleUpdate = (refundId) => {
        router.push(`/admin/refunds/edit/${refundId}`);
    };

    const handleRetry = () => {
        dispatch(getAllRefunds());
    };


    if (isLoading) {
        return <Loading/>;
    }

    return (
        <div className="refund-page">
            <div className="refund-page-header">
                <div>
                    

                    <h1>Refund Management</h1>

                    <p>
                        View and manage customer refunds and Razorpay
                        transactions.
                    </p>
                </div>

                <button
                    type="button"
                    className="refund-refresh-btn"
                    onClick={handleRetry}
                    disabled={isLoading}
                >
                    <FaRedoAlt className={isLoading ? "refund-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* Summary cards */}
            <div className="refund-summary-grid">
                <div className="refund-summary-card">
                    <div className="refund-summary-icon refund-icon-purple">
                        <FaWallet />
                    </div>
                    <div className="refund-summary-info">
                        <span>Total Refunds</span>
                        <h2>{summary.total}</h2>
                        <small>All recorded refunds</small>
                    </div>
                </div>

                <div className="refund-summary-card">
                    <div className="refund-summary-icon refund-icon-blue">
                        <FaMoneyBillWave />
                    </div>
                    <div className="refund-summary-info">
                        <span>Total Refund Amount</span>
                        <h2>{formatCurrency(summary.totalAmount)}</h2>
                        <small>All refund records</small>
                    </div>
                </div>

                <div className="refund-summary-card">
                    <div className="refund-summary-icon refund-icon-orange">
                        <FaClock />
                    </div>
                    <div className="refund-summary-info">
                        <span>Pending / Processing</span>
                        <h2>{summary.processing}</h2>
                        <small>Awaiting completion</small>
                    </div>
                </div>

                <div className="refund-summary-card">
                    <div className="refund-summary-icon refund-icon-green">
                        <FaCheckCircle />
                    </div>
                    <div className="refund-summary-info">
                        <span>Processed</span>
                        <h2>{summary.processed}</h2>
                        <small>Refunds processed</small>
                    </div>
                </div>
            </div>

            {/* Refund list */}
            <section className="refund-list-section">
                

                <div className="refund-toolbar">
                    <div className="refund-search-box">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search refund ID, order, customer..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                            aria-label="Search refunds"
                        />
                    </div>

                    <div className="refund-filter-box">
                        <FaFilter />
                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                            aria-label="Filter refunds by status"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="processed">Processed</option>
                            <option value="failed">Failed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {isError && (
                    <div className="refund-error-message">
                        <FaExclamationCircle />
                        <span>
                            {errorMessage || "Unable to load refunds."}
                        </span>
                        <button type="button" onClick={handleRetry}>
                            Try again
                        </button>
                    </div>
                )}

                {isLoading && refunds.length === 0 ? (
                    <div className="refund-state-message">
                        <div className="refund-loader" />
                        <p>Loading refunds...</p>
                    </div>
                ) : !isError && filteredRefunds.length === 0 ? (
                    <div className="refund-state-message">
                        <div className="refund-empty-icon">
                            <FaWallet />
                        </div>
                        <h3>
                            {refunds.length === 0
                                ? "No refunds found"
                                : "No matching refunds"}
                        </h3>
                        <p>
                            {refunds.length === 0
                                ? "Refund records will appear here when available."
                                : "Try changing your search or status filter."}
                        </p>
                        {(searchTerm || statusFilter !== "all") && (
                            <button
                                type="button"
                                className="refund-clear-filter"
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("all");
                                }}
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="refund-table-wrapper">
                        <table className="refund-table">
                            <thead>
                                <tr>
                                    <th>Refund / Order</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Payment / Refund ID</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredRefunds.map((refund) => {
                                    const customer = refund.userId || {};
                                    const order = refund.orderId || {};

                                    const orderNumber =
                                        order.orderNumber ||
                                        (typeof order === "object"
                                            ? order._id
                                            : order) ||
                                        "—";

                                    return (
                                        <tr key={refund._id}>
                                            <td>
                                                <div className="refund-primary-cell">
                                                    <strong>
                                                        {String(
                                                            refund._id
                                                        ).slice(-8).toUpperCase()}
                                                    </strong>

                                                    <span>
                                                        Order: {formatOrderId(orderNumber)}
                                                    </span>

                                                </div>
                                            </td>

                                   
                                            <td>
                                                <div className="refund-customer">
                                                    <div className="refund-customer-avatar">
                                                        {refund.userId?.profileImage ? (
                                                            <img
                                                                className="customer-avatar-img"
                                                                src={refund.userId.profileImage}
                                                                alt={refund.userId?.profileName || "Customer"}
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = "none";
                                                                }}
                                                            />
                                                        ) : (
                                                            <span>
                                                                {(refund.userId?.profileName || "U")
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="refund-customer-info">
                                                        <strong>
                                                            {refund.userId?.profileName || "Name unavailable"}
                                                        </strong>

                                                        <span>
                                                            {refund.userId?.email || "Email unavailable"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                           
                                            

                                            <td>
                                                <strong className="refund-amount">
                                                    {formatCurrency(
                                                        refund.amount,
                                                        refund.currency || "INR"
                                                    )}
                                                </strong>
                                                <span className="refund-type">
                                                    {refund.refundType ===
                                                        "partial"
                                                        ? "Partial refund"
                                                        : "Full refund"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="refund-id-cell">
                                                    <span>
                                                        Payment:{" "}
                                                        {refund.paymentId ||
                                                            "—"}
                                                    </span>
                                                    <span>
                                                        Refund:{" "}
                                                        {refund.razorpayRefundId ||
                                                            "Not initiated"}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                {formatDate(
                                                    refund.createdAt
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={`refund-status-badge refund-status-${refund.status}`}
                                                >
                                                    {refund.status ===
                                                        "processed" && (
                                                            <FaCheckCircle />
                                                        )}
                                                    {refund.status ===
                                                        "failed" && (
                                                            <FaTimesCircle />
                                                        )}
                                                    {(refund.status ===
                                                        "pending" ||
                                                        refund.status ===
                                                        "processing") && (
                                                            <FaClock />
                                                        )}
                                                    {getStatusLabel(
                                                        refund.status
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="refund-action-buttons">
                                                    <button
                                                        type="button"
                                                        className="refund-action-btn refund-view-btn"
                                                        title="View refund details"
                                                        aria-label="View refund details"
                                                        onClick={() =>
                                                            handleView(
                                                                refund._id
                                                            )
                                                        }
                                                    >
                                                        <FaEye />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="refund-action-btn refund-edit-btn"
                                                        title="Update refund"
                                                        aria-label="Update refund"
                                                        onClick={() =>
                                                            handleUpdate(
                                                                refund._id
                                                            )
                                                        }
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                
            </section>
        </div>
    );
};

export default RefundPage;