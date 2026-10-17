
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import {
    FaArrowLeft,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaBox,
    FaMoneyBillWave,
    FaCreditCard,
    FaUndo,
    FaCalendarAlt,
    FaFileAlt,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaExclamationCircle,
    FaIdBadge,
    FaSyncAlt,
} from "react-icons/fa";

import {
    getRefundDetails,
} from "@/redux/action/refundAction";

import {
    clearRefundDetails,
    clearRefundError,
} from "@/redux/slice/refundSlice";

import "./RefundDetailsPage.css";
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

    return parsedDate.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getStatusIcon = (status) => {
    switch (status) {
        case "processed":
            return <FaCheckCircle />;
        case "failed":
        case "cancelled":
            return <FaTimesCircle />;
        case "processing":
        case "pending":
            return <FaClock />;
        default:
            return <FaExclamationCircle />;
    }
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

const RefundDetailsPage = ({ refundId }) => {
    const dispatch = useDispatch();

    const {
        refundDetails,
        isLoading,
        isError,
        errorMessage,
    } = useSelector((state) => state.refundStore);

    useEffect(() => {
        if (refundId) {
            dispatch(getRefundDetails(refundId));
        }

        return () => {
            dispatch(clearRefundDetails());
            dispatch(clearRefundError());
        };
    }, [dispatch, refundId]);

    const handleRetry = () => {
        if (refundId) {
            dispatch(getRefundDetails(refundId));
        }
    };

    if (isLoading && !refundDetails) {
        return <Loading/>;
    }

    if (isError) {
        return (
            <div className="refund-details-page">
                <Link
                    href="/admin/refunds"
                    className="refund-details-back"
                >
                    <FaArrowLeft />
                    Back to Refunds
                </Link>

                <div className="refund-details-error">
                    <FaExclamationCircle />
                    <h2>Unable to load refund details</h2>
                    <p>
                        {errorMessage ||
                            "Something went wrong while fetching refund details."}
                    </p>

                    <button type="button" onClick={handleRetry}>
                        <FaSyncAlt />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!refundDetails) {
        return (
            <div className="refund-details-page">
                <Link
                    href="/admin/refunds"
                    className="refund-details-back"
                >
                    <FaArrowLeft />
                    Back to Refunds
                </Link>

                <div className="refund-details-state">
                    <FaFileAlt className="refund-details-empty-icon" />
                    <h3>Refund not found</h3>
                    <p>The requested refund details are unavailable.</p>
                </div>
            </div>
        );
    }

    const refund = refundDetails;

    const customer =
        refund.userId && typeof refund.userId === "object"
            ? refund.userId
            : {};

    const order =
        refund.orderId && typeof refund.orderId === "object"
            ? refund.orderId
            : {};

    const returnRequest =
        refund.returnId && typeof refund.returnId === "object"
            ? refund.returnId
            : {};

    const refundIdLabel = refund._id || refundId;

    return (
        <div className="refund-details-page">
            {/* Header */}
            <div className="refund-details-header">
                <div>
                    <Link
                        href="/admin/refunds"
                        className="refund-details-back"
                    >
                        <FaArrowLeft />
                        Back to Refunds
                    </Link>

                    <div className="refund-details-breadcrumb">
                        Admin <span>/</span> Refunds <span>/</span> Details
                    </div>

                    <h1>Refund Details</h1>

                    <p>
                        View customer, payment, order and return information.
                    </p>
                </div>

                <button
                    type="button"
                    className="refund-details-refresh"
                    onClick={handleRetry}
                    disabled={isLoading}
                >
                    <FaSyncAlt className={isLoading ? "refund-details-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* Refund summary */}
            <section className="refund-details-summary">
                <div className="refund-details-summary-top">
                    <div className="refund-details-summary-icon">
                        <FaMoneyBillWave />
                    </div>

                    <div>
                        <span>Refund Amount</span>
                        <h2>
                            {formatCurrency(
                                refund.amount,
                                refund.currency || "INR"
                            )}
                        </h2>
                    </div>

                    <span
                        className={`refund-details-status refund-details-status-${refund.status}`}
                    >
                        {getStatusIcon(refund.status)}
                        {getStatusLabel(refund.status)}
                    </span>
                </div>

                <div className="refund-details-summary-grid">
                    <div>
                        <span>Refund ID</span>
                        <strong>{refundIdLabel || "—"}</strong>
                    </div>

                    <div>
                        <span>Refund Type</span>
                        <strong>
                            {refund.refundType === "partial"
                                ? "Partial Refund"
                                : refund.refundType === "full"
                                    ? "Full Refund"
                                    : "—"}
                        </strong>
                    </div>

                    <div>
                        <span>Created Date</span>
                        <strong>{formatDate(refund.createdAt)}</strong>
                    </div>

                    <div>
                        <span>Processed Date</span>
                        <strong>{formatDate(refund.processedAt)}</strong>
                    </div>
                </div>
            </section>

            <div className="refund-details-grid">
                {/* Customer */}
                <section className="refund-details-card">
                    <div className="refund-details-card-heading">
                        <div className="refund-details-card-icon">
                            <FaUser />
                        </div>
                        <div>
                            <h2>Customer Details</h2>
                            <p>Customer information</p>
                        </div>
                    </div>

                    <div className="refund-details-customer">
                        <div className="refund-details-avatar">
                            {customer.profileImage ? (
                                <img
                                    src={customer.profileImage}
                                    alt={customer.profileName || "Customer"}
                                    onError={(event) => {
                                        event.currentTarget.style.display = "none";
                                    }}
                                />
                            ) : (
                                <span>
                                    {(customer.profileName || "U")
                                        .charAt(0)
                                        .toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div>
                            <h3>
                                {customer.profileName || "Name unavailable"}
                            </h3>
                            <p>Customer</p>
                        </div>
                    </div>

                    <div className="refund-details-info-row">
                        <FaEnvelope />
                        <div>
                            <span>Email Address</span>
                            <strong>{customer.email || "—"}</strong>
                        </div>
                    </div>

                    <div className="refund-details-info-row">
                        <FaPhone />
                        <div>
                            <span>Phone Number</span>
                            <strong>{customer.phoneNumber || "—"}</strong>
                        </div>
                    </div>

                    <div className="refund-details-info-row">
                        <FaIdBadge />
                        <div>
                            <span>Customer ID</span>
                            <strong>
                                {customer._id ||
                                    (typeof refund.userId === "string"
                                        ? refund.userId
                                        : "—")}
                            </strong>
                        </div>
                    </div>
                </section>

                {/* Payment */}
                <section className="refund-details-card">
                    <div className="refund-details-card-heading">
                        <div className="refund-details-card-icon">
                            <FaCreditCard />
                        </div>
                        <div>
                            <h2>Payment Details</h2>
                            <p>Original payment and refund reference</p>
                        </div>
                    </div>

                    <div className="refund-details-info-row">
                        <FaCreditCard />
                        <div>
                            <span>Payment Method</span>
                            <strong>
                                {(refund.paymentMethod || "—").toUpperCase()}
                            </strong>
                        </div>
                    </div>
                    {refund.paymentMethod?.toLowerCase() === "cod" && (
                        <div className="refund-details-info-row">
                            <FaMoneyBillWave />
                            <div>
                                <span>COD Payout Reference / UTR</span>
                                <strong>
                                    {refund.payoutReference || "Payout reference not available"}
                                </strong>
                            </div>
                        </div>
                    )}
                    <div className="refund-details-info-row">
                        <FaIdBadge />
                        <div>
                            <span>Payment Reference</span>
                            <strong>{refund.paymentId || "—"}</strong>
                        </div>
                    </div>

                    <div className="refund-details-info-row">
                        <FaUndo />
                        <div>
                            <span>Razorpay Refund ID</span>
                            <strong>
                                {refund.razorpayRefundId || "Not initiated"}
                            </strong>
                        </div>
                    </div>

                    <div className="refund-details-info-row">
                        <FaMoneyBillWave />
                        <div>
                            <span>Currency</span>
                            <strong>{refund.currency || "INR"}</strong>
                        </div>
                    </div>

                    {refund.failureReason && (
                        <div className="refund-details-failure">
                            <strong>Failure Reason</strong>
                            <p>{refund.failureReason}</p>
                        </div>
                    )}
                </section>

                {/* Order */}
                <section className="refund-details-card">
                    <div className="refund-details-card-heading">
                        <div className="refund-details-card-icon">
                            <FaBox />
                        </div>
                        <div>
                            <h2>Order Details</h2>
                            <p>Order associated with this refund</p>
                        </div>
                    </div>

                    <div className="refund-details-info-row">
                        <FaIdBadge />
                        <div>
                            <span>Order ID</span>
                            <strong>
                                {order._id ||
                                    (typeof refund.orderId === "string"
                                        ? refund.orderId
                                        : "—")}
                            </strong>
                        </div>
                    </div>

                    <div className="refund-details-info-row">
                        <FaMoneyBillWave />
                        <div>
                            <span>Order Total</span>
                            <strong>
                                {formatCurrency(
                                    order.totalAmount,
                                    refund.currency || "INR"
                                )}
                            </strong>
                        </div>
                    </div>

                    <div className="refund-details-info-row">
                        <FaCreditCard />
                        <div>
                            <span>Payment Status</span>
                            <strong>{order.paymentStatus || "—"}</strong>
                        </div>
                    </div>

                    <div className="refund-details-info-row">
                        <FaBox />
                        <div>
                            <span>Order Status</span>
                            <strong>{order.orderStatus || "—"}</strong>
                        </div>
                    </div>
                </section>

                {/* Return */}
                <section className="refund-details-card">
                    <div className="refund-details-card-heading">
                        <div className="refund-details-card-icon">
                            <FaUndo />
                        </div>
                        <div>
                            <h2>Return Request</h2>
                            <p>Return request linked to this refund</p>
                        </div>
                    </div>

                    <div className="refund-details-info-row">
                        <FaIdBadge />
                        <div>
                            <span>Return ID</span>
                            <strong>
                                {returnRequest.returnId ||
                                    returnRequest._id ||
                                    "—"}
                            </strong>
                        </div>
                    </div>

                    <div className="refund-details-info-row">
                        <FaUndo />
                        <div>
                            <span>Return Type</span>
                            <strong>{returnRequest.returnType || "—"}</strong>
                        </div>
                    </div>

                    <div className="refund-details-info-row">
                        <FaCheckCircle />
                        <div>
                            <span>Return Status</span>
                            <strong>{returnRequest.status || "—"}</strong>
                        </div>
                    </div>

                    <div className="refund-details-info-row">
                        <FaMoneyBillWave />
                        <div>
                            <span>Requested Refund</span>
                            <strong>
                                {formatCurrency(
                                    returnRequest.totalRefundAmount,
                                    refund.currency || "INR"
                                )}
                            </strong>
                        </div>
                    </div>

                    <div className="refund-details-info-row">
                        <FaFileAlt />
                        <div>
                            <span>Reason</span>
                            <strong>{returnRequest.reason || refund.reason || "—"}</strong>
                        </div>
                    </div>

                    {returnRequest.notes && (
                        <div className="refund-details-notes">
                            <span>Customer Notes</span>
                            <p>{returnRequest.notes}</p>
                        </div>
                    )}
                </section>

                {/* Admin notes */}
                <section className="refund-details-card refund-details-notes-card">
                    <div className="refund-details-card-heading">
                        <div className="refund-details-card-icon">
                            <FaFileAlt />
                        </div>
                        <div>
                            <h2>Refund Notes</h2>
                            <p>Administrative information</p>
                        </div>
                    </div>

                    <div className="refund-details-notes">
                        <span>Admin Notes</span>
                        <p>{refund.adminNotes || "No admin notes added."}</p>
                    </div>

                    <div className="refund-details-info-row">
                        <FaCalendarAlt />
                        <div>
                            <span>Last Updated</span>
                            <strong>{formatDate(refund.updatedAt)}</strong>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RefundDetailsPage;
